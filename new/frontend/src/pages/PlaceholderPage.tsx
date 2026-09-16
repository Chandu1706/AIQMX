import { SiteFooter } from "../components/SiteFooter";
import { SiteNav } from "../components/SiteNav";

export function PlaceholderPage() {
  return (
    <div className="landing">
      <SiteNav />
      <main className="lp-blank" />
      <SiteFooter />
    </div>
  );
}
