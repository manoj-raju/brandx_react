export function Services({ services }) {
  return (
    <section id="services" className="section" style={{ background: "var(--bg2)" }}>
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "4rem",
            flexWrap: "wrap",
            gap: "2rem",
          }}
        >
          <div>
            <div className="section-tag reveal">What We Do</div>
            <h2 className="headline reveal">
              Everything You Need to <span className="hi">Grow</span>
            </h2>
          </div>
          <p className="reveal" style={{ color: "var(--muted)", maxWidth: "340px", lineHeight: 1.7, fontSize: ".95rem" }}>
            From your website to your content pipeline and AI systems — BrandX handles the full stack of your digital presence.
          </p>
        </div>
        <div className="svc-grid">
          {services.map((s) => (
            <div className="svc-card reveal" key={s.id}>
              <div className="svc-head">
                <div className={`svc-ico ${s.cls}`}>{s.icon}</div>
                {s.badge && <span className={`svc-badge ${s.badge === "hot" ? "b-hot" : "b-new"}`}>{s.badge.toUpperCase()}</span>}
              </div>
              <div className="svc-body">
                <div className="svc-title">{s.title}</div>
                <p className="svc-desc">{s.desc}</p>
                <ul className="svc-list">
                  {s.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
