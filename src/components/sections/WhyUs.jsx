export function WhyUs({ data }) {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const w = data?.whyUs || {
    tag: "Why BrandX",
    headline1: "We Don't Just Deliver Work —",
    headline2: "We Deliver Results",
    sub: "We're not a typical agency. Every strategy, every pixel, and every automation we build is obsessed with one thing: making your numbers grow.",
    cards: [],
  };

  return (
    <section id="about" className="section" style={{ background: "var(--bg2)" }}>
      <div className="container">
        <div className="why-layout">
          <div>
            <div className="section-tag reveal left">{w.tag}</div>
            <h2 className="headline reveal left">
              {w.headline1}
              <br />
              <span className="hi">{w.headline2}</span>
            </h2>
            <p className="reveal left" style={{ color: "var(--muted)", lineHeight: 1.8, maxWidth: "460px", marginTop: "1rem" }}>
              {w.sub}
            </p>
            <button className="btn btn-primary reveal left" style={{ marginTop: "2.5rem" }} onClick={() => go("cta")}>
              Get Started →
            </button>
          </div>
          <div className="why-cards">
            {(w.cards || []).map((c, i) => (
              <div key={i} className="why-card reveal">
                <span className="why-ico">{c.icon}</span>
                <div className="why-ttl">{c.title}</div>
                <p className="why-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
