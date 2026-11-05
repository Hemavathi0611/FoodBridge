import { Link } from "react-router-dom";
import {
  HeartHandshake,
  Utensils,
  Truck,
  Users,
  ShieldCheck,
  ArrowRight,
  Leaf,
  HandHeart,
} from "lucide-react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";

const Home = () => {
  const features = [
    {
      icon: <Utensils size={28} />,
      title: "Share Surplus Food",
      description:
        "Donors can list fresh surplus food and connect with organizations that need it.",
    },
    {
      icon: <Users size={28} />,
      title: "Connect with NGOs",
      description:
        "Approved NGOs can discover available donations and accept food for their communities.",
    },
    {
      icon: <Truck size={28} />,
      title: "Track Deliveries",
      description:
        "Verified volunteers help collect and deliver food with transparent pickup tracking.",
    },
    {
      icon: <ShieldCheck size={28} />,
      title: "Safe Redistribution",
      description:
        "Food expiry dates and pickup deadlines help support responsible food redistribution.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Donate Food",
      description: "Donors register and list their surplus food.",
    },
    {
      number: "02",
      title: "NGO Accepts",
      description: "Approved NGOs find and accept suitable donations.",
    },
    {
      number: "03",
      title: "Volunteer Collects",
      description: "Verified volunteers receive pickup assignments.",
    },
    {
      number: "04",
      title: "Food Delivered",
      description: "The delivery is tracked until food reaches the NGO.",
    },
  ];

  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <span className="hero-badge">
              <Leaf size={16} /> Together for a Hunger-Free Community
            </span>

            <h1>
              Good Food Should <span>Never Go to Waste.</span>
            </h1>

            <p>
              FoodBridge connects food donors, NGOs and volunteers to
              redistribute surplus food to people who need it most.
              Every donation can make a difference.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-large">
                Start Donating <ArrowRight size={19} />
              </Link>

              <Link to="/login" className="btn btn-outline btn-large">
                Explore Platform
              </Link>
            </div>

            <div className="hero-note">
              <HandHeart size={19} />
              <span>Reduce food waste. Share hope. Serve communities.</span>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1000"
              alt="Fresh healthy food prepared for sharing"
            />
            <div className="hero-image-card">
              <HeartHandshake size={25} />
              <div>
                <strong>Share More, Waste Less</strong>
                <span>Be part of the change</span>
              </div>
            </div>
          </div>
        </section>

        <section className="features-section" id="about">
          <div className="section-heading">
            <span>WHAT WE DO</span>
            <h2>One Platform. Four Powerful Solutions.</h2>
            <p>
              FoodBridge brings together everyone involved in responsible
              food redistribution.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="steps-section" id="how-it-works">
          <div className="section-heading">
            <span>HOW IT WORKS</span>
            <h2>From Surplus Food to Shared Meals</h2>
            <p>A simple process that connects food with people in need.</p>
          </div>

          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step-card" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div>
            <span>MAKE A DIFFERENCE TODAY</span>
            <h2>Your Surplus Can Become Someone's Hope.</h2>
            <p>
              Join FoodBridge and help build a community where good food
              reaches the people who need it.
            </p>
          </div>

          <Link to="/register" className="btn btn-light btn-large">
            Join FoodBridge <ArrowRight size={19} />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
