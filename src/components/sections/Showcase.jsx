export function Showcase({ screenshots }) {
  if (!screenshots?.length) return null;
  const doubled = [...screenshots, ...screenshots];

  return (
    <section className="section" style={{ background: "var(--bg2)", paddingTop: "4rem", paddingBottom: "4rem", overflow: "hidden" }}>
      <div className="container" style={{ marginBottom: "3rem", textAlign: "center" }}>
        <div className="section-tag reveal" style={{ justifyContent: "center" }}>
          Our Websites
        </div>
        <h2 className="headline reveal" style={{ textAlign: "center" }}>
          Websites That <span className="hi">Convert</span>
        </h2>
        <p className="reveal" style={{ color: "var(--muted)", maxWidth: "500px", margin: ".8rem auto 0", lineHeight: 1.7 }}>
          A snapshot of the websites we've designed and built for our clients.
        </p>
      </div>
      <div className="show-wrap">
        <div className="show-track">
          {doubled.map((s, i) => (
            <div key={i} className="scard">
              {s.img ? (
                <img src={s.img} alt={s.title} className="scard-img" />
              ) : (
                <div className="scard-ph">
                  <span style={{ fontSize: "2.5rem" }}>🌐</span>
                  <span style={{ fontSize: ".8rem", color: "var(--muted)", fontFamily: "var(--fd)", fontWeight: 600 }}>{s.title}</span>
                </div>
              )}
              <div className="scard-lbl">{s.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
