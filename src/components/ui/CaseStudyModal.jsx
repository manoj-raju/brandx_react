import { useEffect } from "react";
import { getYTEmbed, splitLines, splitTags } from "../../utils/helpers";

export function CaseStudyModal({ project, onClose }) {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    document.body.style.overflow = project ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return <div className="modal-ov" />;

  const embed = getYTEmbed(project.videoUrl);
  const shots = splitLines(project.screenshots);
  const results = splitTags(project.results);
  const tags = splitTags(project.tags);

  return (
    <div
      className="modal-ov open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box">
        <div className="modal-hdr">
          <div>
            <div className="port-tags" style={{ marginBottom: ".5rem" }}>
              {tags.map((t, i) => (
                <span key={i} className="ptag">
                  {t}
                </span>
              ))}
            </div>
            <h2 style={{ fontFamily: "var(--fd)", fontWeight: 900, fontSize: "1.6rem", letterSpacing: "-.03em" }}>
              {project.name}
            </h2>
          </div>
          <button className="modal-x" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-vid">
            {embed ? (
              <iframe
                src={embed}
                allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
                allowFullScreen
              />
            ) : project.videoUrl ? (
              <video controls src={project.videoUrl} style={{ width: "100%", height: "100%", borderRadius: 12 }} />
            ) : (
              <div style={{ fontSize: "4rem" }}>{project.emoji || "🎬"}</div>
            )}
          </div>
          <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "1.5rem" }}>{project.desc}</p>
          {shots.length > 0 && (
            <>
              <h4
                style={{
                  fontFamily: "var(--fd)",
                  fontWeight: 800,
                  fontSize: ".82rem",
                  color: "var(--muted)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                Screenshots
              </h4>
              <div className="modal-shots">
                {shots.map((src, i) => (
                  <img key={i} src={src} alt="screenshot" />
                ))}
              </div>
            </>
          )}
          {results.length > 0 && (
            <>
              <h4
                style={{
                  fontFamily: "var(--fd)",
                  fontWeight: 800,
                  fontSize: ".82rem",
                  color: "var(--muted)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  marginBottom: ".8rem",
                  marginTop: "1.5rem",
                }}
              >
                Results
              </h4>
              <div className="modal-res">
                {results.map((r, i) => (
                  <span key={i} className="modal-rpill">
                    {r}
                  </span>
                ))}
              </div>
            </>
          )}
          {project.liveUrl && (
            <div style={{ marginTop: "2rem" }}>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-cyan">
                Visit Live Site →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
