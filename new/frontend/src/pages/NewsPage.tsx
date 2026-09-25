import { useMemo, useState } from "react";
import { SiteFooter } from "../components/SiteFooter";
import { SiteNav } from "../components/SiteNav";
import "../news.css";

type Quote = { ticker: string; price: number; change: number };
type NewsItem = { headline: string; source: string; time: string; body: string };

const quotes: Quote[] = [
  { ticker: "RE1", price: 184.42, change: 4.82 }, { ticker: "RE2", price: 96.15, change: 3.76 },
  { ticker: "RE3", price: 241.8, change: 3.21 }, { ticker: "RE4", price: 132.64, change: 2.94 },
  { ticker: "RE5", price: 78.31, change: 2.48 }, { ticker: "RE6", price: 154.12, change: -4.36 },
  { ticker: "RE7", price: 88.42, change: -3.91 }, { ticker: "RE8", price: 203.7, change: -3.44 },
  { ticker: "RE9", price: 116.55, change: -2.88 }, { ticker: "RE10", price: 67.19, change: -2.31 },
  { ticker: "RE11", price: 145.2, change: 1.62 }, { ticker: "RE12", price: 109.84, change: -1.44 },
  { ticker: "RE13", price: 76.44, change: 0.94 }, { ticker: "RE14", price: 190.36, change: -0.72 },
  { ticker: "RE15", price: 52.8, change: 0.41 },
];

const news: NewsItem[] = [
  { headline: "Property markets open higher as demand stays resilient", source: "AIQMX Wire", time: "12 min ago", body: "Residential and commercial activity remains firm in the latest market session, with leading real-estate names showing early strength." },
  { headline: "Urban housing activity points to a stronger quarter", source: "Market Desk", time: "34 min ago", body: "New project launches and steady buyer interest are supporting a constructive outlook across several urban markets." },
  { headline: "Developers focus on premium projects as buyers trade up", source: "RE Daily", time: "1 hr ago", body: "Premium housing continues to attract attention as developers increase launches in high-demand corridors." },
  { headline: "Rental demand remains steady across major cities", source: "AIQMX Research", time: "2 hrs ago", body: "Rental activity is holding up across key markets, supported by employment hubs and improving mobility." },
  { headline: "Infrastructure spending reshapes emerging property corridors", source: "Capital Brief", time: "3 hrs ago", body: "New infrastructure projects are creating fresh investment corridors and improving connectivity around growing districts." },
];

export function NewsPage() {
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const gainers = useMemo(() => [...quotes].sort((a, b) => b.change - a.change).slice(0, 5), []);
  const losers = useMemo(() => [...quotes].sort((a, b) => a.change - b.change).slice(0, 5), []);

  return (
    <div className="market-page">
      <SiteNav />
      <main className="market-main">
        <section className="market-hero">
          <div className="hero-grid" />
          <div className="market-hero-copy">
            <p className="market-eyebrow">AIQMX / MARKET PULSE</p>
            <h1>Markets, moving<br /><span>in real time.</span></h1>
            <p className="market-intro">A focused view of real-estate market activity, leaders, laggards and the stories shaping the session.</p>
          </div>
          <div className="session-card"><span>SESSION</span><strong>MARKET OPEN</strong><small>Quotes are simulated</small></div>
        </section>

        <section className="market-content">
          <div className="section-heading"><div><p>MARKET SNAPSHOT</p><h2>Leaders & laggards</h2></div><span>15 RE TICKERS</span></div>
          <div className="quote-grid">
            <div className="quote-panel gain"><div className="panel-title"><span>TOP 5 GAINERS</span><b>↑</b></div>{gainers.map((q, i) => <div className="quote-row" key={q.ticker}><span className="rank">0{i + 1}</span><strong>{q.ticker}</strong><span>₹{q.price.toFixed(2)}</span><em>+{q.change.toFixed(2)}%</em></div>)}</div>
            <div className="quote-panel loss"><div className="panel-title"><span>TOP 5 LOSERS</span><b>↓</b></div>{losers.map((q, i) => <div className="quote-row" key={q.ticker}><span className="rank">0{i + 1}</span><strong>{q.ticker}</strong><span>₹{q.price.toFixed(2)}</span><em>{q.change.toFixed(2)}%</em></div>)}</div>
          </div>

          <div className="news-heading"><div><p>THE NEWSROOM</p><h2>Stories moving the market</h2></div><span>CLICK A STORY TO READ</span></div>
          <div className="news-layout">
            <div className="news-list">{news.map((item, index) => <button className={`news-card ${index === 0 ? "featured" : ""}`} key={item.headline} onClick={() => setSelected(item)}><span className="news-number">0{index + 1}</span><div><h3>{item.headline}</h3><p><b>{item.source}</b><span>•</span>{item.time}</p></div><span className="arrow">↗</span></button>)}</div>
            <aside className="market-note"><span>AIQMX NOTE</span><h3>Context before conviction.</h3><p>Use the market feed to spot movement and follow the underlying story. This page uses mock data for demonstration.</p><div className="note-line" /><small>Delayed quotes. Not investment advice.</small></aside>
          </div>
        </section>
      </main>
      <SiteFooter />

      {selected && <div className="news-modal" role="dialog" aria-modal="true" onClick={() => setSelected(null)}><article onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)}>×</button><p>{selected.source} · {selected.time}</p><h2>{selected.headline}</h2><div className="modal-rule" /><span>MARKET BRIEF</span><p className="modal-body">{selected.body}</p><button className="back-news" onClick={() => setSelected(null)}>Back to news</button></article></div>}
    </div>
  );
}
