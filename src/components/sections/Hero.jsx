export function Hero({ data }) {
  const h = data.hero;
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="home" className="hero section">
      <div className="hero-grid" />
      <div className="hb hb1" />
      <div className="hb hb2" />
      <div className="hb hb3" />
      <div className="container">
        <div className="hero-layout">
          <div>
            <div className="hero-badge">
              <div className="bping" />
              {h.badge}
            </div>
            <h1 className="hero-h1">
              {h.line1}
              <span className="line2">{h.line2}</span>
            </h1>
            <p className="hero-sub">{h.sub}</p>
            <div className="hero-btns">
              <button className="btn btn-primary" onClick={() => go("work")}>
                View Our Work →
              </button>
              <button className="btn btn-cyan" onClick={() => go("cta")}>
                Book a Call
              </button>
            </div>
            <div className="hero-metrics">
              {h.metrics.map((m, i) => (
                <div key={i}>
                  <div className="mval">{m.val}</div>
                  <div className="mlbl">{m.lbl}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-vis">
            <div className="orbit">
              <div className="oring r1">
                <div className="rdot" />
              </div>
              <div className="oring r2">
                <div className="rdot" />
              </div>
              <div className="oring r3">
                <div className="rdot" />
              </div>
              <div className="orb">
                <div className="orb-brand">
                  Brand<span>X</span>
                </div>
                <div className="orb-sub">Digital Growth</div>
              </div>
            </div>
            <div className="fc fc1">
              <div className="fc-ico">📈</div>
              <div>
                <div className="fc-ttl">+340% Traffic</div>
                <div className="fc-val">SEO Campaign</div>
              </div>
            </div>
            <div className="fc fc2">
              <div className="fc-ico">🤖</div>
              <div>
                <div className="fc-ttl">AI Receptionist</div>
                <div className="fc-val">24/7 Active</div>
              </div>
            </div>
            <div className="fc fc3">
              <div className="fc-ico">🎬</div>
              <div>
                <div className="fc-ttl">120 Reels</div>
                <div className="fc-val">Content Pipeline</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
