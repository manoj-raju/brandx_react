import { useState, useEffect } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobOpen(false);
  };

  const links = [
    ["home", "Home"],
    ["work", "Work"],
    ["services", "Services"],
    ["about", "About"],
    ["contact", "Contact"],
  ];

  return (
    <>
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <div className="logo" onClick={() => go("home")}>
            Brand<span className="logo-x">X</span>
            <span className="logo-dot" />
          </div>
          <ul className="nav-links">
            {links.map(([id, label]) => (
              <li key={id}>
                <a onClick={() => go(id)}>{label}</a>
              </li>
            ))}
          </ul>
          <button className="btn btn-primary nav-cta" onClick={() => go("cta")}>
            Book a Call
          </button>
          <button className="ham" onClick={() => setMobOpen(true)}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      <div className={`mob${mobOpen ? " open" : ""}`}>
        <button className="mob-x" onClick={() => setMobOpen(false)}>
          ✕
        </button>
        {links.map(([id, label]) => (
          <a key={id} onClick={() => go(id)}>
            {label}
          </a>
        ))}
        <button className="btn btn-primary" onClick={() => go("cta")}>
          Book a Call
        </button>
      </div>
    </>
  );
}
