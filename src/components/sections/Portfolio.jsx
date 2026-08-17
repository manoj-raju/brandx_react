import { useState } from "react";
import { splitTags } from "../../utils/helpers";

export function Portfolio({ projects, onOpenModal }) {
  const [filter, setFilter] = useState("All");
  const cats = ["All", ...new Set(projects.map((p) => p.cat))];
  const visible = filter === "All" ? projects : projects.filter((p) => p.cat === filter);

  return (
    <section id="work" className="section" style={{ background: "var(--bg2)" }}>
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
            <div className="section-tag reveal">Portfolio</div>
            <h2 className="headline reveal">
              Work We're <span className="hi">Proud Of</span>
            </h2>
          </div>
          <button
            className="btn btn-ghost reveal"
            onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })}
          >
            Start a Project →
          </button>
        </div>
        <div className="port-filters">
          {cats.map((c) => (
            <button key={c} className={`flt-btn${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="port-grid">
          {visible.map((p) => (
            <div key={p.id} className="port-item reveal" onClick={() => onOpenModal(p.id)}>
              <div className={`port-thumb ${p.bg}`}>
                <span>{p.emoji}</span>
                <div className="port-ov">
                  <div>
                    <div className="port-ov-ttl">{p.name}</div>
                    <button
                      className="port-ov-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenModal(p.id);
                      }}
                    >
                      View Case Study →
                    </button>
                  </div>
                </div>
              </div>
              <div className="port-meta">
                <div className="port-tags">
                  {splitTags(p.tags).map((t, i) => (
                    <span key={i} className="ptag">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="port-name">{p.name}</div>
                <div className="port-results">
                  {splitTags(p.results)
                    .slice(0, 2)
                    .map((r, i) => (
                      <span key={i} className="pres">
                        {r}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
