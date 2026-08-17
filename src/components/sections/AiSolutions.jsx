export function AiSolutions({ data }) {
  const ai = data?.ai || {
    tag: "AI Services",
    headline1: "The Future of",
    headline2: "Your Business",
    sub: "Supercharge your operations with custom AI tools built for your workflow.",
    cards: [],
  };

  return (
    <section id="ai" className="section">
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="section-tag reveal" style={{ justifyContent: "center" }}>
            {ai.tag}
          </div>
          <h2 className="headline reveal" style={{ textAlign: "center" }}>
            {ai.headline1} <span className="hi">{ai.headline2}</span>
          </h2>
          <p className="reveal" style={{ color: "var(--muted)", maxWidth: "500px", margin: ".8rem auto 0", lineHeight: 1.7 }}>
            {ai.sub}
          </p>
        </div>
        <div className="ai-grid">
          {(ai.cards || []).map((c, i) => (
            <div key={i} className="ai-inner reveal">
              <div className={`ai-glow ${c.glow || "gblue"}`} />
              <div className="ai-tag">{c.tag}</div>
              <div className="ai-ttl">{c.title}</div>
              <p className="ai-desc">{c.desc}</p>
              <div className="ai-feats">
                {(c.feats || []).map((f, j) => (
                  <span className="ai-feat" key={j}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
