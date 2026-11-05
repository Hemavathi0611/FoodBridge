import { HeartHandshake } from "lucide-react";

const Footer = () => {
  return (
    <footer className="public-footer">
      <div className="footer-brand">
        <HeartHandshake size={25} />
        <span>FoodBridge</span>
      </div>

      <p>
        Reducing food waste. Sharing hope. Building stronger communities.
      </p>

      <p className="footer-copyright">
        © {new Date().getFullYear()} FoodBridge. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
