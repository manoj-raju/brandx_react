export function Testimonials({ testimonials }) {
  const doubled = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="section" style={{ background: "var(--bg)", overflow: "hidden" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div className="section-tag reveal" style={{ justifyContent: "center" }}>
            Testimonials
          </div>
          <h2 className="headline reveal" style={{ textAlign: "center" }}>
            What Clients <span className="hi">Say</span>
          </h2>
        </div>
      </div>
      <div className="testi-wrap">
        <div className="testi-track">
          {doubled.map((t, i) => (
            <div key={i} className="tcard">
              <div className="tcard-q">"</div>
              <div className="tstars">
                {"★"
                  .repeat(t.stars || 5)
                  .split("")
                  .map((s, j) => (
                    <span key={j} className="star">
                      {s}
                    </span>
                  ))}
              </div>
              <p className="tquote">"{t.quote}"</p>
              <div className="tauthor">
                <div className="tav">{t.init}</div>
                <div>
                  <div className="tname">{t.author}</div>
                  <div className="trole">{t.role}</div>
                  {t.cat && <span className="tcat">{t.cat}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
