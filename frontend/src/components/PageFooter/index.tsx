import React from "react";
import "./index.css";

export default function PageFooter() {
  return (
    <footer className="pageFooter_container">
    <div className="pageFooter_containerInner">
      <div className="pageFooter_grid">
        {/* ------------------- Brand Section ------------------- */}
        <div className="pageFooter_brand">
          <div className="pageFooter_logo">
            <img
              src={"favicon.ico"}
              alt="Career Companion Logo"
              className="pageFooter_logoImage"
            />
            <span className="pageFooter_brandText">JobTrackr.online</span>
          </div>
          <p className="pageFooter_description">
            Your sidekick for tracking applications and landing
            that dream gig with ease.
          </p>
          <p className="pageFooter_copyright">
            © 2025 JobTrackr.online. All rights reserved.
          </p>
        </div>

        {/* ------------------- Product Links ------------------- */}
        <div className="pageFooter_linksGroup">
          <h3 className="pageFooter_title">Learn More</h3>
          <ul className="pageFooter_list">
            <li>
              <a href="#features" className="pageFooter_link">
                Features
              </a>
            </li>
            <li>
              <a href="#pricing" className="pageFooter_link">
                Pricing
              </a>
            </li>
            <li>
              <a href="#app" className="pageFooter_link">
                Mobile App
              </a>
            </li>
          </ul>
        </div>

        {/* ------------------- Support Links ------------------- */}
        <div className="pageFooter_linksGroup">
          <h3 className="pageFooter_title">Support</h3>
          <ul className="pageFooter_list">
            <li>
              <a href="privacy.html" className="pageFooter_link">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="terms.html" className="pageFooter_link">
                Terms &amp; Conditions
              </a>
            </li>
            <li>
              <a href="#contact" className="pageFooter_link">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
  );
}