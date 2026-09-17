// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import axios from "axios";
import * as cheerio from "cheerio";

console.log("LinkedIn Scraper Function Loaded at " + new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));

// This endpoint uses 'publishable' | 'secret' access, apiKey is required.
// Use publishable for Client-facing, key-validated endpoints
// Use secret for Server-to-server, internal calls

const extractLinkedInJob = async (url: string) => {
  const res = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    },
  });

  const $ = cheerio.load(res.data);

  const jsonLd = $('script[type="application/ld+json"]').html();
  if (jsonLd) {
    try {
      const structuredData = JSON.parse(jsonLd);
    } catch (e) {
      console.error("Failed to parse JSON-LD", e);
    }
  }

  const cleanText = (text: string) => {
    return text
      .replace(/\s+/g, " ")
      .replace(/\n\s+/g, "")
      .replace(/Show more|Show less/g, "")
      .trim();
  };

  const htmlToMarkdown = (html: string) => {
    return (
      html
        // Remove comment nodes
        .replace(/<!---->/g, "")
        // Convert <strong> and <b> to markdown bold
        .replace(/<(?:strong|b)>(.*?)<\/(?:strong|b)>/g, "**$1**")
        // Convert <em> and <i> to markdown italic
        .replace(/<(?:em|i)>(.*?)<\/(?:em|i)>/g, "*$1*")
        // Convert <ul> to markdown lists (remove opening tag)
        .replace(/<ul[^>]*>/g, "")
        // Convert </ul> to just newlines
        .replace(/<\/ul>/g, "\n")
        // Convert <ol> to markdown numbered lists
        .replace(/<ol[^>]*>/g, "")
        .replace(/<\/ol>/g, "\n")
        // Convert <li> to markdown list items
        .replace(/<li[^>]*>(.*?)<\/li>/g, "- $1\n")
        // Convert <br> and <br/> to newlines
        .replace(/<br\s*\/?>/g, "\n")
        // Convert <p> and </p> to newlines
        .replace(/<p[^>]*>/g, "")
        .replace(/<\/p>/g, "\n\n")
        // Convert <h1>-<h6> to markdown headers
        .replace(/<h1[^>]*>(.*?)<\/h1>/g, "# $1\n\n")
        .replace(/<h2[^>]*>(.*?)<\/h2>/g, "## $1\n\n")
        .replace(/<h3[^>]*>(.*?)<\/h3>/g, "### $1\n\n")
        .replace(/<h4[^>]*>(.*?)<\/h4>/g, "#### $1\n\n")
        .replace(/<h5[^>]*>(.*?)<\/h5>/g, "##### $1\n\n")
        .replace(/<h6[^>]*>(.*?)<\/h6>/g, "###### $1\n\n")
        // Remove any remaining HTML tags
        .replace(/<[^>]*>/g, "")
        // Clean up whitespace
        .replace(/\n\s*\n\s*\n/g, "\n\n") // Normalize multiple newlines
        .replace(/^\s+|\s+$/gm, "") // Trim lines
        .trim()
    );
  };

  const extractDescriptionMarkdown = () => {
    // Try to get the inner content of the description div
    const descriptionDiv = $(".show-more-less-html__markup").first();
    if (descriptionDiv.length) {
      return htmlToMarkdown(descriptionDiv.html() || "");
    }

    // Fallback to other methods
    const fallbackHtml =
      $('[data-test="job-description"]').html() ||
      $(".description__text").html() ||
      $(".show-more-less-html__markup").html() ||
      "";
    return htmlToMarkdown(fallbackHtml);
  };

  const titleText = $("title").text();

  let location = "";

  const titleMatch = titleText.match(/^(.+?)\s+in\s+(.+?)\s*\|/);
  if (titleMatch && titleMatch[2]) {
    location = titleMatch[2].trim();
  }

  if (!location) {
    location =
      $('[class*="location"]:not([class*="typeahead"])')
        .first()
        .text()
        .trim() ||
      $(".topcard__flavor--bullet-location-v2").first().text().trim() ||
      $('[data-test="job-location"]').first().text().trim() ||
      "";
  }

  return {
    title: cleanText(
      $("h1").first().text().trim() ||
        $('[data-test="job-title"]').text().trim(),
    ),
    company: cleanText(
      $('[data-test="job-company"]').text().trim() ||
        $('a[href*="/company/"]').first().text().trim(),
    ),
    location: cleanText(
      location.split("\n")[0].split(",")[0].split("·")[0].trim(),
    ),
    description: extractDescriptionMarkdown(),
  };
};

export default {
  fetch: withSupabase({ auth: ["user", "publishable"] }, async (req, ctx) => {
    // Called by another service with a secret key
    // ctx.supabaseAdmin bypasses RLS — use for privileged operations
    /*
    if (ctx.authMode === "secret") {
      const { user_id } = await req.json();
      const { data } = await ctx.supabaseAdmin.auth.admin.getUserById(user_id);

      return Response.json({
        email: data?.user?.email,
      });
    }
    */

    // Origin check - only allow requests from allowed domains

    const origin = req.headers.get("origin") || req.headers.get("referer");
    const allowedOrigins = ["jobtrackr.online", "http://localhost:5173"];
    
    if (!origin || !allowedOrigins.some(allowed => origin.includes(allowed))) {
      if (origin) {
        console.log(`Unrecognized origin: ${origin}`);
      }
      return Response.json({ error: "Forbidden - invalid origin" }, { status: 403 });
    }

    const { url } = await req.json();
    const { data: userData, error: userError } = await ctx.supabase.auth.getUser();

    if (userData.user) {
      console.log(`${userData.user.email} requested ${url}`);
    } else {
      console.log(`${url} requested without authentication.`);
    }
    
    const scrapedJob = await extractLinkedInJob(url);
    return Response.json({
      success: true,
      job: {
        job_title: scrapedJob.title,
        company: scrapedJob.company,
        location: scrapedJob.location,
        description: scrapedJob.description,
      },
    });
  }),
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/linkedin-scraper' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
    --data '{"name":"Functions"}'

*/
