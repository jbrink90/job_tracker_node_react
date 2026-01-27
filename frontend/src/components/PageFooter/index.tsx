import {useState} from "react";
import "./index.css";
import { NavLink } from "react-router-dom";

export default function PageFooter({ onInstallClick }: { onInstallClick: () => Promise<void> | void }) {
  const logo_src = "search.png";

  const [year] = useState<number>(new Date().getFullYear());

  return (
    <footer className="pageFooter_container">
    <div className="pageFooter_containerInner">
      <div className="pageFooter_grid">
        {/* ------------------- Brand Section ------------------- */}
        <div className="pageFooter_brand">
        <NavLink
        style={{ textDecoration: 'none' }}
          to="/">
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
            Your sidekick for tracking applications and landing
            that dream gig with ease.
          </p>
          <p className="pageFooter_copyright">
            © {year} JobTrackr.online. All rights reserved.
          </p>
        </div>

        {/* ------------------- Product Links ------------------- */}
        <div className="pageFooter_linksGroup">
          <h3 className="pageFooter_title">Learn More</h3>
          <ul className="pageFooter_list">
            <li>
              <NavLink
                className="pageFooter_link"
                to="/features">
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
                to="#">
                Install Anywhere
              </NavLink>
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