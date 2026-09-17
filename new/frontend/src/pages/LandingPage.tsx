import { Link } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { SiteNav } from "../components/SiteNav";
import "../landing.css";

const TILES = [
  {
    to: "/listings",
    label: "Property listings",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    to: "/listings",
    label: "Rent a home",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  },
  {
    to: "/agents",
    label: "Find an agent",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  },
];

export function LandingPage() {
  return (
    <div className="landing">
      <SiteNav />
      <section className="lp-hero">
        <h1>The all in one real estate platform</h1>
      </section>
      <section className="lp-tiles">
        {TILES.map((tile) => (
          <Link className="lp-tile" to={tile.to} key={tile.label}>
            <img src={tile.image} alt="" />
            <span>{tile.label} →</span>
          </Link>
        ))}
      </section>
      <SiteFooter />
    </div>
  );
}
