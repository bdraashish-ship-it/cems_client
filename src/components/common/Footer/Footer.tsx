import React from "react";
import { Heart, Github, Globe, Mail } from "lucide-react";
import "./footer.css";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__left">
          <p className="footer__copyright">
            &copy; {currentYear} <span className="footer__brand">CEMS</span>. All Rights Reserved.
          </p>
          <div className="footer__divider"></div>
          <p className="footer__version">v2.1.0-stable</p>
        </div>

        <div className="footer__center">
          <p className="footer__tagline">
            Building the future of Nepal <Heart size={14} className="heart-icon" /> Engineering Excellence
          </p>
        </div>

        <div className="footer__right">
          <div className="footer__links">
            <a href="#" className="footer__link" title="Documentation">
              <Globe size={18} />
            </a>
            <a href="#" className="footer__link" title="Support">
              <Mail size={18} />
            </a>
            <a href="#" className="footer__link" title="Source">
              <Github size={18} />
            </a>
          </div>
          <div className="footer__divider"></div>
          <div className="footer__status">
            <span className="status-dot"></span>
            System Online
          </div>
        </div>
      </div>
    </footer>
  );
};
