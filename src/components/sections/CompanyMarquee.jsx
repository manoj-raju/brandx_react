export function CompanyMarquee({ companies }) {
  if (!companies?.length) return null;
  const doubled = [...companies, ...companies];

  return (
    <section className="section" style={{ background: "var(--bg)", overflow: "hidden", paddingTop: "4rem", paddingBottom: "4rem" }}>
      <div className="container" style={{ marginBottom: "2rem", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--fd)", fontSize: ".78rem", fontWeight: 700, color: "var(--muted2)", letterSpacing: ".2em", textTransform: "uppercase" }}>
          Trusted by industry leaders
        </p>
      </div>
      <div className="co-wrap">
        <div className="co-track">
          {doubled.map((c, i) => (
            <div key={i} className="co-pill">
              <div className="co-logo">
                {c.logo ? <img src={c.logo} alt={c.name} /> : <span className="co-init">{c.init}</span>}
              </div>
              <span className="co-name">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
