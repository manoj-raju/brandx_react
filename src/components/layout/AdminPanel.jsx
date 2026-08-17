import { useState, useEffect } from "react";
import { DEFAULT_DATA } from "../../data/defaultData";
import { saveData, uid, downloadDefaultData } from "../../utils/helpers";
import { useToast } from "../../hooks/useToast";

function Field({ label, children }) {
  return (
    <div className="afield">
      {label && <label>{label}</label>}
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div className="agrid">{children}</div>;
}

function ACard({ title, children }) {
  return (
    <div className="acard">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function HeroTab({ data, save }) {
  const [h, setH] = useState({ ...data.hero });
  const setM = (i, k, v) => {
    const m = [...h.metrics];
    m[i] = { ...m[i], [k]: v };
    setH({ ...h, metrics: m });
  };
  return (
    <ACard title="Hero Section">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Grid>
          <Field label="Badge Text">
            <input value={h.badge} onChange={(e) => setH({ ...h, badge: e.target.value })} />
          </Field>
          <Field label="Email (Book a Call)">
            <input value={h.email} onChange={(e) => setH({ ...h, email: e.target.value })} />
          </Field>
        </Grid>
        <Grid>
          <Field label="Headline Line 1">
            <input value={h.line1} onChange={(e) => setH({ ...h, line1: e.target.value })} />
          </Field>
          <Field label="Headline Line 2 (colored)">
            <input value={h.line2} onChange={(e) => setH({ ...h, line2: e.target.value })} />
          </Field>
        </Grid>
        <Field label="Subtext">
          <textarea value={h.sub} onChange={(e) => setH({ ...h, sub: e.target.value })} />
        </Field>
        <h4 style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: ".85rem" }}>Metrics</h4>
        {h.metrics.map((m, i) => (
          <Grid key={i}>
            <Field label={`Value ${i + 1}`}>
              <input value={m.val} onChange={(e) => setM(i, "val", e.target.value)} />
            </Field>
            <Field label={`Label ${i + 1}`}>
              <input value={m.lbl} onChange={(e) => setM(i, "lbl", e.target.value)} />
            </Field>
          </Grid>
        ))}
        <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={() => save({ ...data, hero: h })}>
          Save Hero →
        </button>
      </div>
    </ACard>
  );
}

function ServicesTab({ data, save }) {
  const [svcs, setSvcs] = useState(data.services.map((s) => ({ ...s })));
  const update = (i, k, v) => {
    const n = [...svcs];
    n[i] = { ...n[i], [k]: v };
    setSvcs(n);
  };
  const clsList = ["ico-blue", "ico-cyan", "ico-purple", "ico-pink", "ico-gold", "ico-teal"];
  return (
    <ACard title="Services — Edit each card, then save">
      {svcs.map((s, i) => (
        <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "1rem", marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".8rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.5rem" }}>{s.icon}</span>
            <strong style={{ fontFamily: "var(--fd)" }}>{s.title}</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
            <Grid>
              <Field label="Title">
                <input value={s.title} onChange={(e) => update(i, "title", e.target.value)} />
              </Field>
              <Field label="Icon Emoji">
                <input value={s.icon} onChange={(e) => update(i, "icon", e.target.value)} />
              </Field>
            </Grid>
            <Field label="Description">
              <textarea value={s.desc} rows={2} onChange={(e) => update(i, "desc", e.target.value)} />
            </Field>
            <Field label="Items (one per line)">
              <textarea
                value={s.items.join("\n")}
                rows={4}
                onChange={(e) => update(i, "items", e.target.value.split("\n").map((x) => x.trim()).filter(Boolean))}
              />
            </Field>
            <Grid>
              <Field label="Badge (hot / new / blank)">
                <input value={s.badge} onChange={(e) => update(i, "badge", e.target.value)} />
              </Field>
              <Field label="Icon Color">
                <select value={s.cls} onChange={(e) => update(i, "cls", e.target.value)}>
                  {clsList.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </Grid>
            <div style={{ display: "flex", gap: "1rem", marginTop: ".5rem" }}>
              <button
                className="btn btn-primary"
                style={{ padding: ".55rem 1.1rem", fontSize: ".82rem" }}
                onClick={() => {
                  save({ ...data, services: svcs });
                }}
              >
                Save Services →
              </button>
              <button
                className="del-btn"
                onClick={() => {
                  if (confirm(`Delete service "${s.title}"?`)) {
                    const n = svcs.filter((_, idx) => idx !== i);
                    setSvcs(n);
                    save({ ...data, services: n });
                  }
                }}
              >
                Delete Service Card
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        className="btn btn-ghost"
        onClick={() => {
          const newSvc = {
            id: uid(),
            icon: "✨",
            cls: "ico-blue",
            badge: "",
            title: "New Service",
            desc: "Service description goes here.",
            items: ["Feature 1", "Feature 2"],
          };
          const n = [...svcs, newSvc];
          setSvcs(n);
          save({ ...data, services: n });
        }}
      >
        + Add New Service Card
      </button>
    </ACard>
  );
}

function ProjectsTab({ data, save, toast }) {
  const blank = { name: "", cat: "Solar", tags: "", emoji: "🏢", bg: "bg-solar", desc: "", results: "", videoUrl: "", screenshots: "", liveUrl: "" };
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);
  const bgMap = { Solar: "bg-solar", Roofing: "bg-roofing", Remodeling: "bg-remodel", Coaching: "bg-coach" };

  const startEdit = (p) => {
    setForm({ ...p });
    setEditId(p.id);
  };
  const cancel = () => {
    setForm(blank);
    setEditId(null);
  };

  const submit = () => {
    if (!form.name.trim()) {
      toast("Enter a project name");
      return;
    }
    const proj = { ...form, id: editId || uid(), bg: bgMap[form.cat] || "bg-solar" };
    const projects = editId ? data.projects.map((p) => (p.id === editId ? proj : p)) : [...data.projects, proj];
    save({ ...data, projects });
    if (!editId) cancel();
  };

  const del = (id) => {
    if (!confirm("Delete?")) return;
    save({ ...data, projects: data.projects.filter((p) => p.id !== id) });
  };

  return (
    <>
      <ACard title={editId ? "Edit Project" : "Add New Project"}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Grid>
            <Field label="Project Name">
              <input placeholder="Torres Roofing — Full Brand" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Category">
              <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
                {["Solar", "Roofing", "Remodeling", "Coaching"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
          </Grid>
          <Grid>
            <Field label="Tags (comma separated)">
              <input placeholder="Roofing, Web Design, SEO" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </Field>
            <Field label="Emoji">
              <input placeholder="🏠" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
            </Field>
          </Grid>
          <Field label="Description">
            <textarea value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
          </Field>
          <Field label="Results (comma separated)">
            <input placeholder="+340% Traffic, 3x Leads" value={form.results} onChange={(e) => setForm({ ...form, results: e.target.value })} />
          </Field>
          <Field label="Video URL (YouTube or Vimeo)">
            <input placeholder="https://youtube.com/watch?v=..." value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
          </Field>
          <Field label="Screenshot URLs (one per line)">
            <textarea
              rows={3}
              placeholder="https://i.imgur.com/example.jpg"
              value={form.screenshots}
              onChange={(e) => setForm({ ...form, screenshots: e.target.value })}
            />
          </Field>
          <Field label="Live Website URL">
            <input placeholder="https://clientsite.com" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} />
          </Field>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="btn btn-primary" onClick={submit}>
              {editId ? "Update Project" : "Add Project"}
            </button>
            {editId && (
              <button className="btn btn-ghost" onClick={cancel}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </ACard>
      <ACard title={`All Projects (${data.projects.length})`}>
        {data.projects.map((p) => (
          <div key={p.id} className="alist-item">
            <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{p.emoji}</span>
            <div className="alist-info">
              <div className="alist-ttl">{p.name}</div>
              <div className="alist-sub">
                {p.cat} · {p.tags}
              </div>
            </div>
            <button className="edt-btn" onClick={() => startEdit(p)}>
              Edit
            </button>
            <button className="del-btn" onClick={() => del(p.id)}>
              Delete
            </button>
          </div>
        ))}
      </ACard>
    </>
  );
}

function TestimonialsTab({ data, save, toast }) {
  const blank = { quote: "", author: "", role: "", init: "", stars: 5, cat: "Solar" };
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);

  const startEdit = (t) => {
    setForm({ ...t });
    setEditId(t.id);
  };
  const cancel = () => {
    setForm(blank);
    setEditId(null);
  };

  const submit = () => {
    if (!form.quote.trim()) {
      toast("Enter a quote");
      return;
    }
    const t = { ...form, id: editId || uid() };
    const testimonials = editId ? data.testimonials.map((x) => (x.id === editId ? t : x)) : [...data.testimonials, t];
    save({ ...data, testimonials });
    if (!editId) cancel();
  };

  const del = (id) => {
    if (!confirm("Delete?")) return;
    save({ ...data, testimonials: data.testimonials.filter((t) => t.id !== id) });
  };

  return (
    <>
      <ACard title={editId ? "Edit Testimonial" : "Add Testimonial"}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="Quote">
            <textarea placeholder="What the client said..." value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
          </Field>
          <Grid>
            <Field label="Name">
              <input placeholder="James Mitchell" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </Field>
            <Field label="Role / Company">
              <input placeholder="CEO, SolarEdge Homes" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </Field>
          </Grid>
          <Grid>
            <Field label="Initials">
              <input placeholder="JM" maxLength={3} value={form.init} onChange={(e) => setForm({ ...form, init: e.target.value.toUpperCase() })} />
            </Field>
            <Field label="Category">
              <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
                {["Solar", "Roofing", "Remodeling", "Coaching"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
          </Grid>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="btn btn-primary" onClick={submit}>
              {editId ? "Update" : "Add Testimonial"}
            </button>
            {editId && (
              <button className="btn btn-ghost" onClick={cancel}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </ACard>
      <ACard title={`All Testimonials (${data.testimonials.length})`}>
        {data.testimonials.map((t) => (
          <div key={t.id} className="alist-item">
            <div
              className="tav"
              style={{
                width: 40,
                height: 40,
                minWidth: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg,var(--blue),var(--purple))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--fd)",
                fontWeight: 900,
                fontSize: ".8rem",
              }}
            >
              {t.init}
            </div>
            <div className="alist-info">
              <div className="alist-ttl">
                {t.author} — {t.role}
              </div>
              <div className="alist-sub">"{t.quote}"</div>
            </div>
            <button className="edt-btn" onClick={() => startEdit(t)}>
              Edit
            </button>
            <button className="del-btn" onClick={() => del(t.id)}>
              Delete
            </button>
          </div>
        ))}
      </ACard>
    </>
  );
}

function ShowcaseTab({ data, save, toast }) {
  const [title, setTitle] = useState("");
  const [img, setImg] = useState("");

  const add = () => {
    if (!title.trim()) {
      toast("Enter a name");
      return;
    }
    save({ ...data, websiteScreenshots: [...(data.websiteScreenshots || []), { id: uid(), title, img }] });
    setTitle("");
    setImg("");
  };

  const del = (id) => save({ ...data, websiteScreenshots: data.websiteScreenshots.filter((s) => s.id !== id) });

  return (
    <>
      <ACard title="Add Website Screenshot">
        <p style={{ color: "var(--muted)", fontSize: ".85rem", marginBottom: "1.2rem" }}>
          Paste any public image URL — host images free at{" "}
          <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--cyan)" }}>
            imgur.com
          </a>
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="Client / Website Name">
            <input placeholder="Torres Roofing" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Image URL">
            <input placeholder="https://i.imgur.com/example.jpg" value={img} onChange={(e) => setImg(e.target.value)} />
          </Field>
          {img && (
            <img
              src={img}
              alt="preview"
              style={{ width: "100%", maxHeight: 180, objectFit: "cover", objectPosition: "top", borderRadius: 8, border: "1px solid var(--border)" }}
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
          <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={add}>
            Add Screenshot
          </button>
        </div>
      </ACard>
      <ACard title={`Screenshots (${(data.websiteScreenshots || []).length})`}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "1rem" }}>
          {(data.websiteScreenshots || []).map((s) => (
            <div key={s.id} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              {s.img ? (
                <img src={s.img} alt={s.title} style={{ width: "100%", height: 120, objectFit: "cover", objectPosition: "top", display: "block" }} />
              ) : (
                <div
                  style={{
                    height: 120,
                    background: "var(--surface2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--muted)",
                    fontSize: ".78rem",
                  }}
                >
                  No image
                </div>
              )}
              <div style={{ padding: ".7rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--fd)", fontWeight: 700, fontSize: ".82rem" }}>{s.title}</span>
                <button className="del-btn" style={{ fontSize: ".7rem", padding: ".2rem .6rem" }} onClick={() => del(s.id)}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </ACard>
    </>
  );
}

function CompaniesTab({ data, save, toast }) {
  const [name, setName] = useState("");
  const [init, setInit] = useState("");
  const [logo, setLogo] = useState("");

  const add = () => {
    if (!name.trim()) {
      toast("Enter a name");
      return;
    }
    save({ ...data, companies: [...(data.companies || []), { id: uid(), name, init: init.toUpperCase(), logo }] });
    setName("");
    setInit("");
    setLogo("");
  };

  const del = (id) => save({ ...data, companies: data.companies.filter((c) => c.id !== id) });

  return (
    <>
      <ACard title="Add Company">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Grid>
            <Field label="Company Name">
              <input placeholder="SolarEdge Homes" value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field label="Initials (if no logo)">
              <input placeholder="SE" maxLength={3} value={init} onChange={(e) => setInit(e.target.value)} />
            </Field>
          </Grid>
          <Field label="Logo URL (optional)">
            <input placeholder="https://...logo.png" value={logo} onChange={(e) => setLogo(e.target.value)} />
          </Field>
          <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={add}>
            Add Company
          </button>
        </div>
      </ACard>
      <ACard title={`Companies (${(data.companies || []).length})`}>
        {(data.companies || []).map((c) => (
          <div key={c.id} className="alist-item">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "linear-gradient(135deg,var(--blue-dim),var(--blue))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {c.logo ? (
                <img src={c.logo} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <span style={{ fontFamily: "var(--fd)", fontWeight: 900, fontSize: ".85rem", color: "#fff" }}>{c.init}</span>
              )}
            </div>
            <div className="alist-info">
              <div className="alist-ttl">{c.name}</div>
            </div>
            <button className="del-btn" onClick={() => del(c.id)}>
              Remove
            </button>
          </div>
        ))}
      </ACard>
    </>
  );
}

function CTATab({ data, save }) {
  const [c, setC] = useState({ ...data.cta });
  return (
    <ACard title="CTA Section">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Grid>
          <Field label="Line 1">
            <input value={c.line1} onChange={(e) => setC({ ...c, line1: e.target.value })} />
          </Field>
          <Field label="Line 2 (colored)">
            <input value={c.line2} onChange={(e) => setC({ ...c, line2: e.target.value })} />
          </Field>
        </Grid>
        <Field label="Subtext">
          <textarea value={c.sub} onChange={(e) => setC({ ...c, sub: e.target.value })} />
        </Field>
        <Field label="Email (Schedule a Call button)">
          <input value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} />
        </Field>
        <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={() => save({ ...data, cta: c })}>
          Save CTA →
        </button>
      </div>
    </ACard>
  );
}

function FooterTab({ data, save }) {
  const [f, setF] = useState({ ...data.footer });
  return (
    <ACard title="Footer & Contact Info">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Field label="Tagline">
          <textarea value={f.tagline} onChange={(e) => setF({ ...f, tagline: e.target.value })} />
        </Field>
        <Grid>
          <Field label="Email">
            <input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          </Field>
        </Grid>
        <Field label="Location">
          <input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} />
        </Field>
        <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={() => save({ ...data, footer: f })}>
          Save Footer →
        </button>
      </div>
    </ACard>
  );
}

function SettingsTab({ data, save, toast, onClose }) {
  const [brand, setBrand] = useState(data.brand);
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");

  const savePw = () => {
    if (!pw1) {
      toast("Enter a password");
      return;
    }
    if (pw1 !== pw2) {
      toast("Passwords don't match");
      return;
    }
    save({ ...data, adminPassword: pw1 });
    setPw1("");
    setPw2("");
  };

  const reset = () => {
    if (!confirm("Reset ALL data to defaults? Cannot be undone.")) return;
    const fresh = JSON.parse(JSON.stringify(DEFAULT_DATA));
    save(fresh);
    onClose();
    toast("Reset to defaults");
  };

  return (
    <>
      <ACard title="Brand Name">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="Brand Name">
            <input value={brand} onChange={(e) => setBrand(e.target.value)} />
          </Field>
          <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={() => save({ ...data, brand })}>
            Save →
          </button>
        </div>
      </ACard>
      <ACard title="Change Admin Password">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Field label="New Password">
            <input type="password" placeholder="New password" value={pw1} onChange={(e) => setPw1(e.target.value)} />
          </Field>
          <Field label="Confirm Password">
            <input type="password" placeholder="Confirm" value={pw2} onChange={(e) => setPw2(e.target.value)} />
          </Field>
          <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={savePw}>
            Update Password →
          </button>
        </div>
      </ACard>
      <ACard title="💾 Export Code File">
        <p style={{ color: "var(--muted)", fontSize: ".87rem", marginBottom: "1.2rem" }}>
          Download the updated <code>defaultData.js</code> file directly if you want to replace it manually in your project repo.
        </p>
        <button
          className="btn btn-ghost"
          style={{ padding: ".6rem 1.4rem", fontSize: ".85rem" }}
          onClick={() => {
            downloadDefaultData(data);
            toast("Downloaded defaultData.js ✓");
          }}
        >
          Download defaultData.js ↓
        </button>
      </ACard>
      <ACard title="⚠ Danger Zone">
        <p style={{ color: "var(--muted)", fontSize: ".87rem", marginBottom: "1.2rem" }}>Reset everything back to original defaults. Cannot be undone.</p>
        <button className="del-btn" style={{ padding: ".6rem 1.4rem", fontSize: ".85rem" }} onClick={reset}>
          Reset All Data
        </button>
      </ACard>
    </>
  );
}

function MarqueeTab({ data, save }) {
  const [itemsStr, setItemsStr] = useState((data.marquee || []).join("\n"));
  return (
    <ACard title="Marquee Ticker Items (one per line)">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Field label="Ticker Items">
          <textarea rows={8} value={itemsStr} onChange={(e) => setItemsStr(e.target.value)} />
        </Field>
        <button
          className="btn btn-primary"
          style={{ alignSelf: "flex-start" }}
          onClick={() => {
            const marquee = itemsStr.split("\n").map((x) => x.trim()).filter(Boolean);
            save({ ...data, marquee });
          }}
        >
          Save Marquee →
        </button>
      </div>
    </ACard>
  );
}

function AITab({ data, save }) {
  const [ai, setAi] = useState({
    tag: data.ai?.tag || "AI Services",
    headline1: data.ai?.headline1 || "The Future of",
    headline2: data.ai?.headline2 || "Your Business",
    sub: data.ai?.sub || "",
    cards: data.ai?.cards ? data.ai.cards.map((c) => ({ ...c })) : [],
  });

  const updateCard = (i, k, v) => {
    const cards = [...ai.cards];
    cards[i] = { ...cards[i], [k]: v };
    setAi({ ...ai, cards });
  };

  return (
    <ACard title="AI Services Section">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Grid>
          <Field label="Tagline / Badge">
            <input value={ai.tag} onChange={(e) => setAi({ ...ai, tag: e.target.value })} />
          </Field>
          <Field label="Headline 1">
            <input value={ai.headline1} onChange={(e) => setAi({ ...ai, headline1: e.target.value })} />
          </Field>
        </Grid>
        <Grid>
          <Field label="Headline 2 (colored)">
            <input value={ai.headline2} onChange={(e) => setAi({ ...ai, headline2: e.target.value })} />
          </Field>
          <Field label="Subtext">
            <textarea value={ai.sub} onChange={(e) => setAi({ ...ai, sub: e.target.value })} />
          </Field>
        </Grid>
        <h4 style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: ".9rem", marginTop: "1rem" }}>AI Cards ({ai.cards.length})</h4>
        {ai.cards.map((c, i) => (
          <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "1rem" }}>
            <Grid>
              <Field label="Title">
                <input value={c.title} onChange={(e) => updateCard(i, "title", e.target.value)} />
              </Field>
              <Field label="Tag">
                <input value={c.tag} onChange={(e) => updateCard(i, "tag", e.target.value)} />
              </Field>
            </Grid>
            <Field label="Description">
              <textarea value={c.desc} rows={2} onChange={(e) => updateCard(i, "desc", e.target.value)} />
            </Field>
            <Field label="Features (comma separated)">
              <input value={(c.feats || []).join(", ")} onChange={(e) => updateCard(i, "feats", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} />
            </Field>
          </div>
        ))}
        <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={() => save({ ...data, ai })}>
          Save AI Services →
        </button>
      </div>
    </ACard>
  );
}

function WhyUsTab({ data, save }) {
  const [w, setW] = useState({
    tag: data.whyUs?.tag || "Why BrandX",
    headline1: data.whyUs?.headline1 || "We Don't Just Deliver Work —",
    headline2: data.whyUs?.headline2 || "We Deliver Results",
    sub: data.whyUs?.sub || "",
    cards: data.whyUs?.cards ? data.whyUs.cards.map((c) => ({ ...c })) : [],
  });

  const updateCard = (i, k, v) => {
    const cards = [...w.cards];
    cards[i] = { ...cards[i], [k]: v };
    setW({ ...w, cards });
  };

  return (
    <ACard title="Why Us Section">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Grid>
          <Field label="Section Tag">
            <input value={w.tag} onChange={(e) => setW({ ...w, tag: e.target.value })} />
          </Field>
          <Field label="Headline 1">
            <input value={w.headline1} onChange={(e) => setW({ ...w, headline1: e.target.value })} />
          </Field>
        </Grid>
        <Grid>
          <Field label="Headline 2 (colored)">
            <input value={w.headline2} onChange={(e) => setW({ ...w, headline2: e.target.value })} />
          </Field>
          <Field label="Subtext">
            <textarea value={w.sub} onChange={(e) => setW({ ...w, sub: e.target.value })} />
          </Field>
        </Grid>
        <h4 style={{ fontFamily: "var(--fd)", fontWeight: 800, fontSize: ".9rem", marginTop: "1rem" }}>Cards ({w.cards.length})</h4>
        {w.cards.map((c, i) => (
          <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: "1rem" }}>
            <Grid>
              <Field label="Title">
                <input value={c.title} onChange={(e) => updateCard(i, "title", e.target.value)} />
              </Field>
              <Field label="Icon Emoji">
                <input value={c.icon} onChange={(e) => updateCard(i, "icon", e.target.value)} />
              </Field>
            </Grid>
            <Field label="Description">
              <textarea value={c.desc} rows={2} onChange={(e) => updateCard(i, "desc", e.target.value)} />
            </Field>
          </div>
        ))}
        <button className="btn btn-primary" style={{ alignSelf: "flex-start" }} onClick={() => save({ ...data, whyUs: w })}>
          Save Why Us →
        </button>
      </div>
    </ACard>
  );
}

export function AdminPanel({ data, onUpdate, onClose }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [tab, setTab] = useState("hero");
  const toast = useToast();

  const tabs = [
    { id: "hero", label: "🏠 Hero" },
    { id: "marquee", label: "✨ Marquee Ticker" },
    { id: "services", label: "⚙ Services" },
    { id: "ai", label: "🤖 AI Services" },
    { id: "projects", label: "📁 Portfolio" },
    { id: "testimonials", label: "💬 Testimonials" },
    { id: "showcase", label: "🖼 Screenshots" },
    { id: "companies", label: "🏢 Companies" },
    { id: "whyUs", label: "🎯 Why Us" },
    { id: "cta", label: "📣 CTA" },
    { id: "footer", label: "📧 Footer" },
    { id: "settings", label: "🔐 Settings" },
  ];

  const save = async (newData) => {
    onUpdate(newData);
    const savedToFile = await saveData(newData);
    if (savedToFile) {
      toast("Saved to Code & Browser ✓");
    } else {
      toast("Saved to Browser ✓");
    }
  };

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!authed)
    return (
      <div className="admin-ov open">
        <div className="pwd-screen">
          <div className="pwd-box">
            <h2>⚙ Admin Panel</h2>
            <p>Enter your password to edit site content</p>
            <div className="afield" style={{ marginBottom: "1rem" }}>
              <input
                type="password"
                placeholder="Password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (pw === data.adminPassword) {
                      setAuthed(true);
                      setPwErr(false);
                    } else setPwErr(true);
                  }
                }}
                style={{ textAlign: "center" }}
              />
            </div>
            {pwErr && <p style={{ color: "var(--pink)", fontSize: ".85rem", marginBottom: "1rem" }}>Wrong password</p>}
            <button
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={() => {
                if (pw === data.adminPassword) {
                  setAuthed(true);
                  setPwErr(false);
                } else setPwErr(true);
              }}
            >
              Login →
            </button>
            <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", marginTop: ".8rem" }} onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="admin-ov open">
      <div className="admin-top">
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="logo" style={{ fontSize: "1.3rem" }}>
            Brand<span className="logo-x">X</span>
            <span className="logo-dot" />
          </div>
          <span style={{ color: "var(--muted)", fontFamily: "var(--fd)", fontSize: ".78rem", letterSpacing: ".1em", textTransform: "uppercase" }}>
            Admin Panel
          </span>
        </div>
        <div style={{ display: "flex", gap: ".8rem" }}>
          <button className="btn btn-ghost" style={{ padding: ".5rem 1rem" }} onClick={onClose}>
            ← View Site
          </button>
          <button className="btn btn-ghost" style={{ padding: ".5rem 1rem", color: "var(--pink)" }} onClick={() => setAuthed(false)}>
            Logout
          </button>
        </div>
      </div>
      <div className="atabs">
        {tabs.map((t) => (
          <button key={t.id} className={`atab${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="abody">
        {tab === "hero" && <HeroTab data={data} save={save} toast={toast} />}
        {tab === "marquee" && <MarqueeTab data={data} save={save} toast={toast} />}
        {tab === "services" && <ServicesTab data={data} save={save} toast={toast} />}
        {tab === "ai" && <AITab data={data} save={save} toast={toast} />}
        {tab === "projects" && <ProjectsTab data={data} save={save} toast={toast} />}
        {tab === "testimonials" && <TestimonialsTab data={data} save={save} toast={toast} />}
        {tab === "showcase" && <ShowcaseTab data={data} save={save} toast={toast} />}
        {tab === "companies" && <CompaniesTab data={data} save={save} toast={toast} />}
        {tab === "whyUs" && <WhyUsTab data={data} save={save} toast={toast} />}
        {tab === "cta" && <CTATab data={data} save={save} toast={toast} />}
        {tab === "footer" && <FooterTab data={data} save={save} toast={toast} />}
        {tab === "settings" && <SettingsTab data={data} save={save} toast={toast} onClose={onClose} />}
      </div>
    </div>
  );
}

