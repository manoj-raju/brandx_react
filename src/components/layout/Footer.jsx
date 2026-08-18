export function Footer({ data }) {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const f = data.footer;

  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="foot-grid">
          <div>
            <div className="logo" style={{ marginBottom: "1.2rem" }} onClick={() => go("home")}>
              Brand<span className="logo-x">X</span>
              <span className="logo-dot" />
            </div>
            <p className="foot-desc">{f.tagline}</p>
            <div className="socials">
              {["𝕏", "in", "ig", "yt"].map((s, i) => (
                <a key={i} href="#" className="social" onClick={(e) => e.preventDefault()}>
                  {s}
                </a>
              ))}
            </div>
          </div>
          <div className="foot-col">
            <h5>Quick Links</h5>
            <ul className="foot-links">
              {[
                ["home", "Home"],
                ["work", "Work"],
                ["services", "Services"],
                ["about", "About"],
                ["contact", "Contact"],
              ].map(([id, label]) => (
                <li key={id}>
                  <a onClick={() => go(id)}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h5>Services</h5>
            <ul className="foot-links">
              {(data.services || []).map((s) => (
                <li key={s.id || s.title}>
                  <a onClick={() => go("services")}>{s.title}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h5>Contact</h5>
            <ul className="foot-links">
              <li>
                <a href={`mailto:${f.email}`}>{f.email}</a>
              </li>
              <li>
                <a href={`tel:${f.phone}`}>{f.phone}</a>
              </li>
              <li>
                <span style={{ color: "var(--muted)" }}>{f.location}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="foot-bot">
          <p>
            © {new Date().getFullYear()} <span>{data.brand}</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
