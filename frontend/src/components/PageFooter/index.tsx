import { useState } from "react";
import "./index.css";
import { NavLink } from "react-router-dom";
import { getDeferredPrompt, clearDeferredPrompt } from "../../lib/pwa";

export default function PageFooter() {
  const logo_src = "search.png";
  const [year] = useState<number>(new Date().getFullYear());

  async function onInstallClick() {
    const promptEvent = getDeferredPrompt();

    // if (!promptEvent) {
    //   console.log("No install prompt available yet");
    //   return;
    // }

    try {
      await promptEvent.prompt();
      const choice = await promptEvent.userChoice;
      if (choice.outcome === "accepted") {
        localStorage.setItem("pwa-installed", "1");
        localStorage.setItem("pwa-install-dismissed", "0");
      } else {
        localStorage.setItem("pwa-installed", "0");
        localStorage.setItem("pwa-install-dismissed", "1");
      }
    } finally {
      clearDeferredPrompt();
    }
  }

  return (
    <footer className="pageFooter_container" data-testid="page-footer">
      <div className="pageFooter_containerInner">
        <div className="pageFooter_grid">
          <div className="pageFooter_brand">
            <NavLink style={{ textDecoration: "none" }} to="/">
              <div className="pageFooter_logo">
                <img
                  src={logo_src}
                  alt="JobTrackr Logo"
                  className="pageFooter_logoImage"
                />
                <span className="pageFooter_brandText">JobTrackr.online</span>
              </div>
            </NavLink>

            <p className="pageFooter_description">
              Your sidekick for tracking applications and landing that dream gig
              with ease.
            </p>
            <p className="pageFooter_copyright">
              © {year} JobTrackr.online. All rights reserved.
            </p>
          </div>

          <div className="pageFooter_linksGroup">
            <h3 className="pageFooter_title">Learn More</h3>
            <ul className="pageFooter_list">
              <li>
                <NavLink
                  className="pageFooter_link"
                  to="/login"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Try the demo
                </NavLink>
              </li>
              <li>
                <NavLink className="pageFooter_link" to="#">
                  Features
                </NavLink>
              </li>
              <li>
                <NavLink
                  onClick={async (ev) => {
                    ev.preventDefault();
                    await onInstallClick();
                  }}
                  className="pageFooter_link"
                  to="#"
                >
                  Install Anywhere
                </NavLink>
              </li>
            </ul>
          </div>

          <div className="pageFooter_linksGroup">
            <h3 className="pageFooter_title">Support</h3>
            <ul className="pageFooter_list">
              <li>
                <NavLink
                  className="pageFooter_link"
                  to="/privacy"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="pageFooter_link"
                  to="/terms"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Terms &amp; Conditions
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="pageFooter_link"
                  to="/contact"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Contact Us
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
