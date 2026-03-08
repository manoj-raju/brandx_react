import { useState, useEffect, useRef, useCallback } from "react";

// ─── FONTS ───────────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;500;700;800;900&family=Outfit:wght@300;400;500;600;700;800&display=swap";
document.head.appendChild(fontLink);

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  :root {
    --bg: #04060f; --bg2: #060a16; --surface: #0a0f20; --surface2: #0e1528;
    --blue: #4f8ef7; --blue-dim: #1a3a7a; --cyan: #00e5ff; --purple: #a855f7;
    --pink: #ec4899; --gold: #f5c842; --text: #eef2ff; --muted: #5a6a99; --muted2: #3a4a72;
    --border: rgba(79,142,247,0.12);
    --fd: 'Exo 2', sans-serif; --fb: 'Outfit', sans-serif;
    --bounce: cubic-bezier(0.34,1.56,0.64,1);
    --smooth: cubic-bezier(0.25,0.46,0.45,0.94);
  }
  body { background: var(--bg); color: var(--text); font-family: var(--fb); overflow-x: hidden; cursor: none; }
  body::after { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E"); pointer-events:none; z-index:9998; opacity:.4; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: linear-gradient(var(--blue), var(--purple)); border-radius: 2px; }
  @media(max-width:768px) { body { cursor: auto; } }

  /* CURSOR */
  .cur { position:fixed; top:0; left:0; pointer-events:none; z-index:99999; transform:translate(-50%,-50%); }
  .cur-dot { width:10px; height:10px; background:var(--cyan); border-radius:50%; mix-blend-mode:screen; }
  .cur-ring { width:34px; height:34px; border:1px solid rgba(79,142,247,.5); border-radius:50%; transition: width .3s, height .3s; }
  @media(max-width:768px) { .cur, .cur-ring { display:none; } }

  /* INTRO */
  .intro { position:fixed; inset:0; z-index:10000; background:var(--bg); display:flex; align-items:center; justify-content:center; flex-direction:column; transition: opacity .8s var(--smooth), transform .9s var(--smooth); }
  .intro.gone { opacity:0; pointer-events:none; transform:translateY(-100%); }
  .intro-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(79,142,247,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(79,142,247,.04) 1px,transparent 1px); background-size:60px 60px; }
  .intro-b1 { position:absolute; width:600px; height:600px; border-radius:50%; background:rgba(79,142,247,.07); filter:blur(120px); top:-200px; left:-200px; }
  .intro-b2 { position:absolute; width:500px; height:500px; border-radius:50%; background:rgba(168,85,247,.05); filter:blur(100px); bottom:-150px; right:-100px; }
  .intro-name { font-family:var(--fd); font-weight:900; font-size:clamp(5rem,15vw,13rem); letter-spacing:-.04em; position:relative; z-index:1; opacity:0; transform:scale(.85); transition: opacity .8s var(--bounce), transform .8s var(--bounce); }
  .intro-name.show { opacity:1; transform:scale(1); }
  .intro-name .bx { background:linear-gradient(135deg,var(--cyan),var(--blue),var(--purple)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .intro-sub { position:relative; z-index:1; display:flex; align-items:center; gap:.8rem; margin-top:1.5rem; opacity:0; transform:translateY(10px); transition: all .8s var(--bounce) .5s; }
  .intro-sub.show { opacity:1; transform:translateY(0); }
  .intro-sub span { font-family:var(--fd); font-size:.72rem; font-weight:700; letter-spacing:.25em; text-transform:uppercase; color:var(--muted); }
  .intro-sub::before,.intro-sub::after { content:''; flex:0 0 40px; height:1px; background:linear-gradient(90deg,transparent,rgba(0,229,255,.5)); }
  .intro-sub::after { background:linear-gradient(90deg,rgba(0,229,255,.5),transparent); }
  .intro-hint { position:absolute; bottom:3rem; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:.6rem; opacity:0; transition:opacity .5s .9s; z-index:1; }
  .intro-hint.show { opacity:1; }
  .intro-hint span { font-size:.72rem; color:var(--muted); letter-spacing:.2em; text-transform:uppercase; font-family:var(--fd); }
  .scroll-line { width:1px; height:40px; background:linear-gradient(var(--cyan),transparent); animation:sarr 1.5s ease infinite; }
  @keyframes sarr { 0%,100%{opacity:.3;transform:scaleY(.6)} 50%{opacity:1;transform:scaleY(1)} }

  /* NAV */
  .nav { position:fixed; top:0; left:0; right:0; z-index:1000; padding:1.4rem 0; transition:all .4s var(--smooth); }
  .nav.scrolled { background:rgba(4,6,15,.88); backdrop-filter:blur(24px); border-bottom:1px solid var(--border); padding:.9rem 0; }
  .nav-inner { display:flex; align-items:center; justify-content:space-between; max-width:1240px; margin:0 auto; padding:0 2rem; }
  .logo { font-family:var(--fd); font-weight:900; font-size:1.6rem; color:var(--text); letter-spacing:-.04em; display:flex; align-items:center; gap:2px; cursor:pointer; text-decoration:none; }
  .logo-x { background:linear-gradient(135deg,var(--cyan),var(--blue)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .logo-dot { width:7px; height:7px; border-radius:50%; background:var(--cyan); margin-bottom:4px; box-shadow:0 0 10px var(--cyan); animation:blink 2s ease infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
  .nav-links { display:flex; align-items:center; gap:2.5rem; list-style:none; }
  .nav-links a { color:var(--muted); font-size:.88rem; font-weight:500; font-family:var(--fd); letter-spacing:.05em; cursor:pointer; transition:color .2s; position:relative; text-decoration:none; }
  .nav-links a::after { content:''; position:absolute; bottom:-4px; left:0; right:0; height:1px; background:var(--cyan); transform:scaleX(0); transform-origin:right; transition:transform .3s; }
  .nav-links a:hover { color:var(--text); }
  .nav-links a:hover::after { transform:scaleX(1); transform-origin:left; }
  .ham { display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:4px; }
  .ham span { display:block; width:24px; height:1.5px; background:var(--text); border-radius:2px; }
  .mob { display:none; position:fixed; inset:0; background:rgba(4,6,15,.97); backdrop-filter:blur(30px); z-index:999; flex-direction:column; align-items:center; justify-content:center; gap:3rem; }
  .mob.open { display:flex; }
  .mob a { font-family:var(--fd); font-size:2.5rem; font-weight:900; color:var(--text); cursor:pointer; transition:color .2s; text-decoration:none; }
  .mob a:hover { color:var(--cyan); }
  .mob-x { position:absolute; top:2rem; right:2rem; background:none; border:none; color:var(--muted); font-size:1.8rem; cursor:pointer; }
  @media(max-width:768px) { .nav-links,.nav-cta { display:none; } .ham { display:flex; } }

  /* BUTTONS */
  .btn { display:inline-flex; align-items:center; gap:.55rem; padding:.8rem 2rem; border-radius:6px; font-family:var(--fd); font-size:.9rem; font-weight:700; border:none; cursor:pointer; transition:all .3s var(--bounce); letter-spacing:.04em; text-decoration:none; white-space:nowrap; }
  .btn-primary { background:linear-gradient(135deg,var(--blue),#2563eb); color:#fff; box-shadow:0 0 24px rgba(79,142,247,.4),0 4px 20px rgba(0,0,0,.4); }
  .btn-primary:hover { transform:translateY(-3px) scale(1.02); box-shadow:0 0 40px rgba(79,142,247,.6); }
  .btn-cyan { background:transparent; color:var(--cyan); border:1.5px solid rgba(0,229,255,.3); }
  .btn-cyan:hover { background:rgba(0,229,255,.07); border-color:rgba(0,229,255,.7); transform:translateY(-3px); }
  .btn-ghost { background:transparent; color:var(--text); border:1.5px solid var(--border); }
  .btn-ghost:hover { border-color:rgba(79,142,247,.4); color:var(--blue); background:rgba(79,142,247,.06); transform:translateY(-2px); }

  /* SECTION */
  .section { padding:8rem 0; position:relative; }
  .container { max-width:1240px; margin:0 auto; padding:0 2rem; }
  .section-tag { display:inline-flex; align-items:center; gap:.6rem; font-family:var(--fd); font-size:.72rem; font-weight:700; letter-spacing:.25em; text-transform:uppercase; color:var(--cyan); margin-bottom:1.25rem; }
  .section-tag::before { content:''; display:block; width:28px; height:1.5px; background:linear-gradient(90deg,var(--cyan),transparent); }
  .section-tag::after { content:''; display:block; width:6px; height:6px; background:var(--cyan); border-radius:50%; box-shadow:0 0 8px var(--cyan); }
  .headline { font-family:var(--fd); font-size:clamp(2.4rem,4.5vw,3.8rem); font-weight:900; line-height:1.06; letter-spacing:-.03em; }
  .hi { background:linear-gradient(135deg,var(--cyan),var(--blue),var(--purple)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

  /* HERO */
  .hero { min-height:100vh; display:flex; align-items:center; padding-top:7rem; position:relative; overflow:hidden; }
  .hero-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(79,142,247,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(79,142,247,.04) 1px,transparent 1px); background-size:60px 60px; mask-image:radial-gradient(ellipse 80% 60% at 50% 50%,black 30%,transparent 100%); }
  .hb { position:absolute; border-radius:50%; filter:blur(100px); pointer-events:none; }
  .hb1 { width:700px; height:700px; background:rgba(79,142,247,.07); top:-200px; left:-200px; }
  .hb2 { width:600px; height:600px; background:rgba(168,85,247,.05); bottom:-200px; right:-100px; }
  .hb3 { width:400px; height:400px; background:rgba(0,229,255,.04); top:30%; right:10%; animation:drift 12s ease-in-out infinite; }
  @keyframes drift { 0%,100%{transform:translate(0,0)} 33%{transform:translate(30px,-20px)} 66%{transform:translate(-20px,30px)} }
  .hero-layout { display:grid; grid-template-columns:1.1fr .9fr; gap:4rem; align-items:center; position:relative; z-index:1; }
  .hero-badge { display:inline-flex; align-items:center; gap:.7rem; background:linear-gradient(135deg,rgba(0,229,255,.07),rgba(79,142,247,.05)); border:1px solid rgba(0,229,255,.18); border-radius:100px; padding:.4rem 1.1rem .4rem .5rem; font-size:.78rem; color:var(--cyan); margin-bottom:1.8rem; font-family:var(--fd); font-weight:600; letter-spacing:.06em; }
  .bping { width:24px; height:24px; border-radius:50%; background:rgba(0,229,255,.15); display:flex; align-items:center; justify-content:center; }
  .bping::before { content:''; display:block; width:8px; height:8px; border-radius:50%; background:var(--cyan); animation:ping 2s ease infinite; }
  @keyframes ping { 0%{box-shadow:0 0 0 0 rgba(0,229,255,.4)} 70%{box-shadow:0 0 0 10px rgba(0,229,255,0)} 100%{box-shadow:0 0 0 0 rgba(0,229,255,0)} }
  .hero-h1 { font-family:var(--fd); font-weight:900; font-size:clamp(3rem,5.5vw,5.2rem); line-height:1.04; letter-spacing:-.04em; margin-bottom:1.6rem; }
  .hero-h1 .line2 { display:block; background:linear-gradient(135deg,var(--cyan),var(--blue),var(--purple)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .hero-sub { color:var(--muted); font-size:1.05rem; line-height:1.75; max-width:520px; margin-bottom:2.8rem; }
  .hero-btns { display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:3.5rem; }
  .hero-metrics { display:flex; gap:3rem; padding-top:2.5rem; border-top:1px solid rgba(79,142,247,.1); flex-wrap:wrap; }
  .mval { font-family:var(--fd); font-weight:900; font-size:2.2rem; line-height:1; letter-spacing:-.04em; background:linear-gradient(135deg,var(--text),var(--cyan)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .mlbl { font-size:.78rem; color:var(--muted); margin-top:.3rem; letter-spacing:.04em; }
  .hero-vis { position:relative; display:flex; align-items:center; justify-content:center; }
  .orbit { position:relative; width:460px; height:460px; display:flex; align-items:center; justify-content:center; }
  .oring { position:absolute; border-radius:50%; border:1px solid rgba(79,142,247,.1); }
  .r1 { width:460px; height:460px; animation:spin 25s linear infinite; }
  .r2 { width:340px; height:340px; animation:spin 18s linear infinite reverse; border-style:dashed; border-color:rgba(0,229,255,.08); }
  .r3 { width:220px; height:220px; animation:spin 10s linear infinite; border-color:rgba(168,85,247,.1); }
  @keyframes spin { to { transform:rotate(360deg); } }
  .rdot { position:absolute; top:-5px; left:50%; width:10px; height:10px; border-radius:50%; margin-left:-5px; }
  .r1 .rdot { background:var(--blue); box-shadow:0 0 16px var(--blue); }
  .r2 .rdot { background:var(--cyan); box-shadow:0 0 16px var(--cyan); }
  .r3 .rdot { background:var(--purple); box-shadow:0 0 16px var(--purple); top:-4px; }
  .orb { width:160px; height:160px; border-radius:50%; z-index:2; background:radial-gradient(circle at 35% 35%,rgba(79,142,247,.3),rgba(4,6,15,.9) 70%); border:1px solid rgba(79,142,247,.3); box-shadow:0 0 50px rgba(79,142,247,.2),inset 0 0 30px rgba(79,142,247,.1); display:flex; align-items:center; justify-content:center; flex-direction:column; gap:.6rem; animation:float 7s ease-in-out infinite; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  .orb-brand { font-family:var(--fd); font-weight:900; font-size:1.1rem; color:var(--text); }
  .orb-brand span { background:linear-gradient(135deg,var(--cyan),var(--blue)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .orb-sub { font-size:.6rem; color:var(--muted); letter-spacing:.15em; text-transform:uppercase; }
  .fc { position:absolute; z-index:3; background:rgba(10,15,32,.92); border:1px solid rgba(79,142,247,.2); border-radius:12px; padding:.85rem 1.1rem; backdrop-filter:blur(16px); display:flex; align-items:center; gap:.8rem; white-space:nowrap; box-shadow:0 8px 32px rgba(0,0,0,.4); }
  .fc-ico { font-size:1.4rem; }
  .fc-ttl { font-family:var(--fd); font-weight:700; font-size:.85rem; color:var(--text); }
  .fc-val { color:var(--cyan); font-size:.75rem; font-weight:700; }
  .fc1 { top:5%; right:-40px; animation:float 5.5s ease-in-out infinite; }
  .fc2 { bottom:8%; left:-50px; animation:float 7s ease-in-out 1.5s infinite; }
  .fc3 { top:50%; right:-55px; animation:float 6s ease-in-out .8s infinite; }
  @media(max-width:1024px) { .hero-layout { grid-template-columns:1fr; } .hero-vis { display:none; } .hero-metrics { justify-content:center; } .hero-btns { justify-content:center; } .hero-h1 { text-align:center; } .hero-badge { align-self:center; } .hero-sub { text-align:center; margin:0 auto 2.8rem; } }

  /* MARQUEE */
  .mq { padding:2rem 0; overflow:hidden; border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
  .mq-track { display:flex; gap:3rem; white-space:nowrap; animation:mqanim 22s linear infinite; width:max-content; }
  @keyframes mqanim { to { transform:translateX(-50%); } }
  .mq-item { display:flex; align-items:center; gap:.8rem; font-family:var(--fd); font-weight:700; font-size:.78rem; letter-spacing:.15em; text-transform:uppercase; color:var(--muted2); }
  .mq-dot { color:var(--cyan); }

  /* SERVICES */
  .svc-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1.5rem; }
  .svc-card { background:var(--surface); border:1px solid var(--border); border-radius:20px; overflow:hidden; transition:all .4s var(--smooth); position:relative; }
  .svc-card::before { content:''; position:absolute; inset:0; background:radial-gradient(circle at 50% 0%,rgba(79,142,247,.06),transparent 70%); opacity:0; transition:opacity .4s; }
  .svc-card:hover { border-color:rgba(79,142,247,.35); transform:translateY(-8px); box-shadow:0 24px 60px rgba(0,0,0,.4); }
  .svc-card:hover::before { opacity:1; }
  .svc-head { padding:2rem 2rem 1.5rem; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
  .svc-ico { width:52px; height:52px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:1.5rem; }
  .ico-blue { background:rgba(79,142,247,.12); border:1px solid rgba(79,142,247,.2); }
  .ico-cyan { background:rgba(0,229,255,.08); border:1px solid rgba(0,229,255,.15); }
  .ico-purple { background:rgba(168,85,247,.1); border:1px solid rgba(168,85,247,.18); }
  .ico-pink { background:rgba(236,72,153,.1); border:1px solid rgba(236,72,153,.18); }
  .ico-gold { background:rgba(245,200,66,.08); border:1px solid rgba(245,200,66,.15); }
  .ico-teal { background:rgba(20,184,166,.08); border:1px solid rgba(20,184,166,.15); }
  .svc-badge { font-size:.65rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding:.3rem .75rem; border-radius:100px; font-family:var(--fd); }
  .b-hot { background:rgba(236,72,153,.1); color:var(--pink); border:1px solid rgba(236,72,153,.2); }
  .b-new { background:rgba(0,229,255,.1); color:var(--cyan); border:1px solid rgba(0,229,255,.2); }
  .svc-body { padding:1.5rem 2rem 2rem; }
  .svc-title { font-family:var(--fd); font-weight:800; font-size:1.15rem; margin-bottom:.6rem; }
  .svc-desc { color:var(--muted); font-size:.87rem; line-height:1.7; margin-bottom:1.4rem; }
  .svc-list { list-style:none; display:flex; flex-direction:column; gap:.55rem; }
  .svc-list li { display:flex; align-items:center; gap:.6rem; font-size:.83rem; color:var(--muted); }
  .svc-list li::before { content:''; flex-shrink:0; width:5px; height:5px; border-radius:50%; background:var(--cyan); box-shadow:0 0 6px var(--cyan); }
  @media(max-width:1024px) { .svc-grid { grid-template-columns:1fr 1fr; } }
  @media(max-width:768px) { .svc-grid { grid-template-columns:1fr; } }

  /* AI SECTION */
  .ai-grid { display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; }
  .ai-inner { background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:2.5rem; position:relative; overflow:hidden; transition:border-color .4s, transform .4s; }
  .ai-inner:hover { border-color:rgba(79,142,247,.35); transform:translateY(-6px); }
  .ai-glow { position:absolute; top:0; right:0; width:200px; height:200px; border-radius:50%; filter:blur(60px); opacity:.3; }
  .gblue { background:var(--blue); }
  .gcyan { background:var(--cyan); }
  .ai-tag { display:inline-flex; align-items:center; gap:.4rem; font-size:.68rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase; color:var(--blue); margin-bottom:1.2rem; font-family:var(--fd); }
  .ai-tag::before { content:'●'; font-size:.5rem; }
  .ai-ttl { font-family:var(--fd); font-weight:800; font-size:1.5rem; margin-bottom:.75rem; letter-spacing:-.03em; }
  .ai-desc { color:var(--muted); font-size:.9rem; line-height:1.7; margin-bottom:1.75rem; }
  .ai-feats { display:flex; flex-wrap:wrap; gap:.6rem; }
  .ai-feat { background:rgba(79,142,247,.07); border:1px solid rgba(79,142,247,.12); border-radius:100px; padding:.3rem .9rem; font-size:.75rem; color:var(--text); }
  @media(max-width:768px) { .ai-grid { grid-template-columns:1fr; } }

  /* PORTFOLIO */
  .port-filters { display:flex; gap:.6rem; flex-wrap:wrap; margin-bottom:2rem; }
  .flt-btn { background:var(--surface); border:1px solid var(--border); color:var(--muted); font-family:var(--fd); font-size:.78rem; font-weight:700; letter-spacing:.08em; padding:.45rem 1.1rem; border-radius:100px; cursor:pointer; transition:all .2s; }
  .flt-btn:hover, .flt-btn.active { border-color:rgba(79,142,247,.5); color:var(--blue); background:rgba(79,142,247,.08); }
  .port-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1.5rem; }
  .port-item { border-radius:16px; overflow:hidden; border:1px solid var(--border); background:var(--surface); position:relative; cursor:pointer; transition:all .4s var(--smooth); }
  .port-item:hover { border-color:rgba(79,142,247,.35); transform:translateY(-4px); }
  .port-thumb { width:100%; aspect-ratio:16/9; display:flex; align-items:center; justify-content:center; font-size:4.5rem; position:relative; overflow:hidden; transition:transform .5s; }
  .port-item:hover .port-thumb { transform:scale(1.04); }
  .port-ov { position:absolute; inset:0; background:linear-gradient(to top,rgba(4,6,15,.95),rgba(4,6,15,.2) 60%,transparent); opacity:0; transition:opacity .4s; display:flex; align-items:flex-end; padding:1.5rem; }
  .port-item:hover .port-ov { opacity:1; }
  .port-ov-ttl { font-family:var(--fd); font-weight:800; font-size:1.1rem; margin-bottom:.3rem; }
  .port-ov-link { font-size:.8rem; color:var(--cyan); font-weight:600; background:none; border:none; cursor:pointer; font-family:var(--fd); padding:0; }
  .port-meta { padding:1.2rem 1.5rem; }
  .port-tags { display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:.5rem; }
  .ptag { font-size:.68rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--blue); background:rgba(79,142,247,.08); border-radius:4px; padding:.2rem .6rem; font-family:var(--fd); }
  .port-name { font-family:var(--fd); font-weight:800; font-size:1.02rem; letter-spacing:-.02em; }
  .port-results { display:flex; gap:.5rem; flex-wrap:wrap; margin-top:.6rem; }
  .pres { font-size:.72rem; color:var(--cyan); background:rgba(0,229,255,.06); border:1px solid rgba(0,229,255,.12); border-radius:4px; padding:.2rem .6rem; font-family:var(--fd); font-weight:600; }
  .bg-solar { background:linear-gradient(135deg,#0f1a1a,#0a2020,#0f2810); }
  .bg-ai { background:linear-gradient(135deg,#0f102a,#1a1050); }
  .bg-roofing { background:linear-gradient(135deg,#1a1008,#201808); }
  .bg-remodel { background:linear-gradient(135deg,#120a1a,#1a0f28); }
  .bg-coach { background:linear-gradient(135deg,#0a1520,#0f1a35); }
  .bg-fitness { background:linear-gradient(135deg,#1a0a0a,#280f10); }
  @media(max-width:768px) { .port-grid { grid-template-columns:1fr; } }

  /* TESTIMONIALS */
  .testi-wrap { overflow:hidden; position:relative; padding:1rem 0; }
  .testi-wrap::before,.testi-wrap::after { content:''; position:absolute; top:0; bottom:0; width:100px; z-index:2; pointer-events:none; }
  .testi-wrap::before { left:0; background:linear-gradient(to right,var(--bg),transparent); }
  .testi-wrap::after { right:0; background:linear-gradient(to left,var(--bg),transparent); }
  .testi-track { display:flex; gap:1.5rem; animation:mqanim 40s linear infinite; width:max-content; }
  .testi-track:hover { animation-play-state:paused; }
  .tcard { background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:2rem; width:380px; flex-shrink:0; position:relative; overflow:hidden; transition:border-color .3s, transform .3s; }
  .tcard:hover { border-color:rgba(79,142,247,.35); transform:translateY(-4px); }
  .tcard-q { font-family:var(--fd); font-size:5rem; font-weight:900; color:rgba(79,142,247,.08); position:absolute; top:-.5rem; left:1rem; line-height:1; user-select:none; }
  .tstars { display:flex; gap:.3rem; margin-bottom:1rem; }
  .star { color:var(--gold); }
  .tquote { font-size:.9rem; line-height:1.75; color:var(--text); margin-bottom:1.5rem; font-style:italic; font-weight:300; position:relative; z-index:1; }
  .tauthor { display:flex; align-items:center; gap:.8rem; }
  .tav { width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg,var(--blue),var(--purple)); display:flex; align-items:center; justify-content:center; font-family:var(--fd); font-weight:900; font-size:.85rem; border:2px solid rgba(79,142,247,.3); flex-shrink:0; }
  .tname { font-family:var(--fd); font-weight:800; font-size:.9rem; }
  .trole { color:var(--muted); font-size:.78rem; }
  .tcat { font-family:var(--fd); font-size:.68rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:var(--cyan); background:rgba(0,229,255,.07); border:1px solid rgba(0,229,255,.12); border-radius:4px; padding:.2rem .6rem; margin-top:.3rem; display:inline-block; }

  /* SHOWCASE */
  .show-wrap { overflow:hidden; position:relative; }
  .show-wrap::before,.show-wrap::after { content:''; position:absolute; top:0; bottom:0; width:120px; z-index:2; pointer-events:none; }
  .show-wrap::before { left:0; background:linear-gradient(to right,var(--bg2),transparent); }
  .show-wrap::after { right:0; background:linear-gradient(to left,var(--bg2),transparent); }
  .show-track { display:flex; gap:1.5rem; animation:mqanim 35s linear infinite; width:max-content; }
  .show-track:hover { animation-play-state:paused; }
  .scard { width:320px; flex-shrink:0; border-radius:16px; overflow:hidden; border:1px solid var(--border); background:var(--surface); transition:transform .3s, border-color .3s; }
  .scard:hover { transform:translateY(-6px) scale(1.02); border-color:rgba(79,142,247,.3); }
  .scard-img { width:100%; height:200px; object-fit:cover; object-position:top; display:block; }
  .scard-ph { width:100%; height:200px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.5rem; background:var(--surface2); }
  .scard-lbl { padding:.8rem 1.2rem; font-family:var(--fd); font-weight:700; font-size:.85rem; border-top:1px solid var(--border); }

  /* COMPANIES */
  .co-wrap { overflow:hidden; position:relative; }
  .co-wrap::before,.co-wrap::after { content:''; position:absolute; top:0; bottom:0; width:100px; z-index:2; pointer-events:none; }
  .co-wrap::before { left:0; background:linear-gradient(to right,var(--bg),transparent); }
  .co-wrap::after { right:0; background:linear-gradient(to left,var(--bg),transparent); }
  .co-track { display:flex; gap:2rem; animation:mqanim 30s linear infinite; width:max-content; align-items:center; padding:1rem 0; }
  .co-pill { display:flex; align-items:center; gap:.8rem; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:.8rem 1.5rem; white-space:nowrap; transition:all .3s; flex-shrink:0; }
  .co-pill:hover { border-color:rgba(79,142,247,.4); background:rgba(79,142,247,.06); }
  .co-logo { width:36px; height:36px; border-radius:8px; overflow:hidden; background:linear-gradient(135deg,var(--blue-dim),var(--blue)); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .co-logo img { width:100%; height:100%; object-fit:contain; }
  .co-init { font-family:var(--fd); font-weight:900; font-size:.9rem; color:#fff; }
  .co-name { font-family:var(--fd); font-weight:700; font-size:.88rem; }

  /* WHY */
  .why-layout { display:grid; grid-template-columns:1fr 1fr; gap:5rem; align-items:center; }
  .why-cards { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  .why-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:1.75rem; transition:all .35s; }
  .why-card:hover { border-color:rgba(79,142,247,.3); transform:translateY(-4px); box-shadow:0 12px 40px rgba(0,0,0,.3); }
  .why-ico { font-size:1.8rem; display:block; margin-bottom:.9rem; }
  .why-ttl { font-family:var(--fd); font-weight:800; font-size:.95rem; margin-bottom:.5rem; }
  .why-desc { color:var(--muted); font-size:.82rem; line-height:1.6; }
  @media(max-width:1024px) { .why-layout { grid-template-columns:1fr; gap:3rem; } }
  @media(max-width:768px) { .why-cards { grid-template-columns:1fr; } }

  /* CTA */
  .cta-box { border-radius:28px; overflow:hidden; position:relative; background:var(--surface); border:1px solid rgba(79,142,247,.15); padding:7rem 4rem; text-align:center; }
  .cta-box::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 60% 40% at 50% 0%,rgba(79,142,247,.12),transparent 60%),radial-gradient(ellipse 40% 30% at 50% 100%,rgba(168,85,247,.08),transparent 60%); }
  .cta-box::after { content:''; position:absolute; inset:0; background-image:linear-gradient(rgba(79,142,247,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(79,142,247,.03) 1px,transparent 1px); background-size:50px 50px; }
  .cta-cnt { position:relative; z-index:1; }
  .cta-ttl { font-family:var(--fd); font-weight:900; font-size:clamp(2.5rem,5vw,4.5rem); letter-spacing:-.04em; line-height:1.05; margin-bottom:1.2rem; }
  .cta-sub { color:var(--muted); max-width:500px; margin:0 auto 3rem; font-size:1.05rem; line-height:1.75; }
  .cta-btns { display:flex; gap:1rem; justify-content:center; flex-wrap:wrap; }
  @media(max-width:768px) { .cta-box { padding:4rem 1.5rem; } }

  /* FOOTER */
  .footer { background:var(--bg2); border-top:1px solid var(--border); padding:5.5rem 0 2.5rem; }
  .foot-grid { display:grid; grid-template-columns:2fr 1fr 1fr 1.4fr; gap:3.5rem; margin-bottom:4rem; }
  .foot-desc { color:var(--muted); font-size:.88rem; line-height:1.75; margin-bottom:1.8rem; max-width:280px; }
  .socials { display:flex; gap:.7rem; }
  .social { width:40px; height:40px; border-radius:10px; background:var(--surface); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--muted); font-size:.75rem; font-family:var(--fd); font-weight:700; transition:all .2s; cursor:pointer; text-decoration:none; }
  .social:hover { border-color:rgba(79,142,247,.4); color:var(--blue); }
  .foot-col h5 { font-family:var(--fd); font-weight:800; font-size:.82rem; letter-spacing:.1em; text-transform:uppercase; margin-bottom:1.4rem; }
  .foot-links { list-style:none; display:flex; flex-direction:column; gap:.75rem; }
  .foot-links a { color:var(--muted); font-size:.87rem; cursor:pointer; transition:color .2s; text-decoration:none; }
  .foot-links a:hover { color:var(--cyan); }
  .foot-bot { border-top:1px solid var(--border); padding-top:2rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; }
  .foot-bot p { color:var(--muted2); font-size:.8rem; }
  .foot-bot span { color:var(--blue); }
  @media(max-width:1024px) { .foot-grid { grid-template-columns:1fr 1fr; gap:2.5rem; } }
  @media(max-width:768px) { .foot-grid { grid-template-columns:1fr; } .foot-bot { flex-direction:column; text-align:center; } }

  /* MODAL */
  .modal-ov { position:fixed; inset:0; background:rgba(4,6,15,.97); backdrop-filter:blur(20px); z-index:5000; display:flex; align-items:flex-start; justify-content:center; overflow-y:auto; padding:2rem; opacity:0; pointer-events:none; transition:opacity .3s; }
  .modal-ov.open { opacity:1; pointer-events:all; }
  .modal-box { background:var(--surface); border:1px solid rgba(79,142,247,.2); border-radius:24px; max-width:900px; width:100%; margin:auto; overflow:hidden; transform:translateY(30px); transition:transform .4s var(--bounce); }
  .modal-ov.open .modal-box { transform:translateY(0); }
  .modal-hdr { padding:2.5rem 2.5rem 2rem; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:flex-start; }
  .modal-x { background:none; border:none; color:var(--muted); font-size:1.5rem; cursor:pointer; transition:color .2s; line-height:1; }
  .modal-x:hover { color:var(--text); }
  .modal-body { padding:2.5rem; }
  .modal-vid { width:100%; aspect-ratio:16/9; background:rgba(0,0,0,.5); border-radius:12px; overflow:hidden; margin-bottom:2rem; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; }
  .modal-vid iframe,.modal-vid video { width:100%; height:100%; border:none; }
  .modal-shots { display:grid; grid-template-columns:repeat(2,1fr); gap:1rem; margin-bottom:2rem; }
  .modal-shots img { width:100%; border-radius:10px; border:1px solid var(--border); }
  .modal-res { display:flex; gap:.8rem; flex-wrap:wrap; }
  .modal-rpill { background:rgba(0,229,255,.08); border:1px solid rgba(0,229,255,.2); border-radius:100px; padding:.5rem 1.2rem; font-family:var(--fd); font-size:.85rem; font-weight:700; color:var(--cyan); }
  @media(max-width:768px) { .modal-shots { grid-template-columns:1fr; } .modal-hdr,.modal-body { padding:1.5rem; } }

  /* SCROLL REVEAL */
  .reveal { opacity:0; transform:translateY(32px); transition:opacity .75s var(--smooth), transform .75s var(--smooth); }
  .reveal.left { transform:translateX(-32px); }
  .reveal.visible { opacity:1; transform:none; }

  /* ADMIN PANEL */
  .admin-ov { position:fixed; inset:0; z-index:20000; background:var(--bg); overflow-y:auto; display:none; }
  .admin-ov.open { display:block; }
  .admin-top { display:flex; align-items:center; justify-content:space-between; padding:1.2rem 2rem; background:var(--surface); border-bottom:1px solid var(--border); position:sticky; top:0; z-index:10; }
  .atabs { display:flex; gap:.5rem; flex-wrap:wrap; padding:1.5rem 2rem; border-bottom:1px solid var(--border); background:var(--bg2); }
  .atab { background:var(--surface); border:1px solid var(--border); color:var(--muted); font-family:var(--fd); font-size:.8rem; font-weight:700; letter-spacing:.06em; padding:.5rem 1.1rem; border-radius:8px; cursor:pointer; transition:all .2s; }
  .atab:hover,.atab.active { border-color:rgba(79,142,247,.5); color:var(--blue); background:rgba(79,142,247,.08); }
  .abody { padding:2rem; max-width:900px; margin:0 auto; }
  .acard { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:1.5rem; margin-bottom:1.5rem; }
  .acard h3 { font-family:var(--fd); font-weight:800; font-size:1.05rem; margin-bottom:1.25rem; }
  .afield { display:flex; flex-direction:column; gap:.4rem; }
  .afield label { font-family:var(--fd); font-size:.72rem; font-weight:700; color:var(--muted); letter-spacing:.1em; text-transform:uppercase; }
  .afield input,.afield textarea,.afield select { background:var(--bg); border:1px solid var(--border); color:var(--text); font-family:var(--fb); font-size:.9rem; padding:.7rem 1rem; border-radius:8px; transition:border-color .2s; outline:none; width:100%; cursor:text; }
  .afield input:focus,.afield textarea:focus,.afield select:focus { border-color:rgba(79,142,247,.5); }
  .afield textarea { min-height:80px; resize:vertical; }
  .afield select { cursor:pointer; }
  .agrid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
  .alist-item { background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:1rem 1.2rem; display:flex; align-items:center; gap:1rem; margin-bottom:.6rem; }
  .alist-info { flex:1; min-width:0; }
  .alist-ttl { font-family:var(--fd); font-weight:700; font-size:.9rem; margin-bottom:.15rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .alist-sub { color:var(--muted); font-size:.78rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .del-btn { background:rgba(236,72,153,.08); border:1px solid rgba(236,72,153,.2); color:var(--pink); font-family:var(--fd); font-size:.75rem; font-weight:700; padding:.35rem .8rem; border-radius:6px; cursor:pointer; transition:all .2s; white-space:nowrap; }
  .del-btn:hover { background:rgba(236,72,153,.18); }
  .edt-btn { background:rgba(79,142,247,.08); border:1px solid rgba(79,142,247,.2); color:var(--blue); font-family:var(--fd); font-size:.75rem; font-weight:700; padding:.35rem .8rem; border-radius:6px; cursor:pointer; transition:all .2s; white-space:nowrap; }
  .edt-btn:hover { background:rgba(79,142,247,.15); }
  .pwd-screen { display:flex; align-items:center; justify-content:center; min-height:100vh; }
  .pwd-box { background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:3rem; max-width:400px; width:100%; text-align:center; }
  .pwd-box h2 { font-family:var(--fd); font-weight:900; font-size:1.8rem; margin-bottom:.5rem; }
  .pwd-box p { color:var(--muted); margin-bottom:2rem; font-size:.9rem; }
  @media(max-width:768px) { .agrid { grid-template-columns:1fr; } }

  /* TOAST */
  .toast { position:fixed; bottom:2rem; right:2rem; background:rgba(0,229,255,.1); border:1px solid rgba(0,229,255,.3); color:var(--cyan); padding:1rem 1.5rem; border-radius:10px; font-family:var(--fd); font-weight:700; z-index:99999; animation:toastIn .3s var(--bounce); pointer-events:none; }
  @keyframes toastIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

  /* ADMIN GEAR BTN */
  .admin-btn { position:fixed; bottom:1.5rem; right:1.5rem; width:44px; height:44px; background:rgba(79,142,247,.08); border:1px solid rgba(79,142,247,.15); border-radius:50%; cursor:pointer; z-index:9990; display:flex; align-items:center; justify-content:center; font-size:1.1rem; transition:all .3s; opacity:.5; }
  .admin-btn:hover { opacity:1; background:rgba(79,142,247,.15); border-color:rgba(79,142,247,.4); transform:scale(1.1); }
`;

const styleEl = document.createElement("style");
styleEl.textContent = globalCSS;
document.head.appendChild(styleEl);

// ─── DEFAULT DATA ─────────────────────────────────────────────────────────────
const DEFAULT_DATA = {
  brand: "BrandX",
  adminPassword: "brandx2024",
  hero: {
    badge: "Accepting New Clients",
    line1: "We Build Brands",
    line2: "That Dominate",
    sub: "BrandX is a full-stack digital growth agency — web design, personal branding, content, AI automation, and paid media that scales your business relentlessly.",
    email: "hello@brandx.com",
    metrics: [
      { val: "120+", lbl: "Projects Delivered" },
      { val: "5×",   lbl: "Average ROI" },
      { val: "98%",  lbl: "Client Retention" },
    ],
  },
  marquee: ["Web Design","Personal Branding","SEO","Video Editing","Content Planning","Paid Ads","AI Automation","Account Handling","Scripting","AI Receptionist","Work Automation"],
  services: [
    { id:"s1", icon:"🌐", cls:"ico-blue",   badge:"",    title:"Website Services",            desc:"High-converting, visually stunning websites built for performance and search.",                  items:["Custom Web Design","Landing Pages","E-Commerce Builds","Speed & SEO Optimization","Maintenance & Hosting"] },
    { id:"s2", icon:"👑", cls:"ico-gold",   badge:"hot", title:"Personal Branding",           desc:"Build an authority brand online that attracts clients, opportunities, and media.",               items:["Brand Identity & Strategy","Social Media Presence","LinkedIn & Twitter Growth","PR & Positioning","Visual Identity Systems"] },
    { id:"s3", icon:"📣", cls:"ico-pink",   badge:"",    title:"Paid Advertising",            desc:"Data-driven campaigns on Meta, Google & LinkedIn engineered for maximum ROI.",                   items:["Meta & Google Ads","Campaign Strategy","A/B Creative Testing","Retargeting Funnels","Full Analytics"] },
    { id:"s4", icon:"🎬", cls:"ico-cyan",   badge:"new", title:"Video Editing",               desc:"Professional short-form and long-form video production for every platform.",                     items:["Reels & Short-form","YouTube Videos","Brand Films","Motion Graphics","Subtitles & Captions"] },
    { id:"s5", icon:"📋", cls:"ico-teal",   badge:"",    title:"Content Planning & Scripting",desc:"Data-driven content calendars and viral-optimised scripts written for your niche.",              items:["30-Day Content Calendars","Script Writing","Hook & CTA Copywriting","Trend Research","Multi-platform Strategy"] },
    { id:"s6", icon:"📱", cls:"ico-purple", badge:"",    title:"Account Handling",            desc:"Full-service social media management — we post, engage, and grow your accounts.",                items:["Daily Posting & Scheduling","Community Management","DM & Comment Engagement","Growth Analytics","Influencer Outreach"] },
  ],
  projects: [
    { id:"p1", name:"SolarEdge Homes — Lead Gen Website",       cat:"Solar",      tags:"Solar, Web Design, SEO",              emoji:"☀️", bg:"bg-solar",   desc:"Complete website redesign and SEO strategy. Resulted in 340% increase in organic leads within 90 days.",            results:"+340% Traffic, 3x Leads, #1 Google",          videoUrl:"", screenshots:"", liveUrl:"" },
    { id:"p2", name:"SunPower Solutions — AI Receptionist",     cat:"Solar",      tags:"Solar, AI Automation",                emoji:"🤖", bg:"bg-ai",      desc:"Custom AI receptionist handling inbound enquiries 24/7, qualifying leads and booking consultations automatically.", results:"80% Automated, 24/7 Coverage, 2x Bookings",    videoUrl:"", screenshots:"", liveUrl:"" },
    { id:"p3", name:"Torres Roofing — Full Brand + Web",        cat:"Roofing",    tags:"Roofing, Branding, Web Design",       emoji:"🏠", bg:"bg-roofing", desc:"End-to-end brand identity and website build. Went from no online presence to fully booked.",                       results:"0 → Fully Booked, 5★ Reviews, Local SEO #1",  videoUrl:"", screenshots:"", liveUrl:"" },
    { id:"p4", name:"Elite Home Remodeling — Digital Presence", cat:"Remodeling", tags:"Remodeling, Branding, Content",       emoji:"🔨", bg:"bg-remodel", desc:"Premium brand redesign, website, and content strategy for a high-end remodeling contractor.",                    results:"2x Project Value, 60% More Inquiries, 50k IG", videoUrl:"", screenshots:"", liveUrl:"" },
    { id:"p5", name:"Sarah Chen — Coach Personal Brand",        cat:"Coaching",   tags:"Coaching, Personal Brand, Content",   emoji:"🎯", bg:"bg-coach",   desc:"Personal brand from scratch — LinkedIn strategy, content, website, and lead funnel.",                            results:"800% LinkedIn Growth, Fully Booked, 6-Fig",    videoUrl:"", screenshots:"", liveUrl:"" },
    { id:"p6", name:"PeakForm — Fitness Coaching Brand",        cat:"Coaching",   tags:"Coaching, Video Editing, Paid Ads",   emoji:"💪", bg:"bg-fitness", desc:"Video content, paid ads, and personal branding. Grew 1k to 28k followers and launched sold-out program.",          results:"1k → 28k Followers, Sold-Out Program, 4.2x",  videoUrl:"", screenshots:"", liveUrl:"" },
  ],
  testimonials: [
    { id:"t1", quote:"BrandX completely transformed how we look online. The website redesign tripled our leads and their content team grew our Instagram from 2k to 40k. Genuinely life-changing for our business.", author:"James Mitchell", role:"CEO, SolarEdge Homes",        init:"JM", stars:5, cat:"Solar" },
    { id:"t2", quote:"Our roofing company went from zero online presence to booking out 3 months in advance. BrandX built us a stunning website and the leads just kept coming. Best investment we've ever made.",   author:"Mike Torres",    role:"Owner, Torres Roofing",        init:"MT", stars:5, cat:"Roofing" },
    { id:"t3", quote:"As a business coach, my personal brand is everything. BrandX helped me go from unknown to recognized authority in my niche. My LinkedIn grew 800% and I'm fully booked every month.",          author:"Sarah Chen",     role:"Business Coach & Speaker",     init:"SC", stars:5, cat:"Coaching" },
    { id:"t4", quote:"The AI receptionist they built handles 80% of incoming enquiries automatically. Our team can now focus on installs instead of answering the same questions over and over.",                    author:"David Park",     role:"Director, SunPower Solutions", init:"DP", stars:5, cat:"Solar" },
    { id:"t5", quote:"BrandX redesigned our entire brand and built a website that actually converts. Our remodeling company looks like a Fortune 500 now. Clients always comment on how professional we look.",       author:"Carlos Rivera",  role:"CEO, Elite Home Remodeling",   init:"CR", stars:5, cat:"Remodeling" },
    { id:"t6", quote:"I was skeptical about hiring an agency but BrandX proved me wrong. My coaching program went from 3 clients to 47 in 4 months. Their content strategy is next level.",                         author:"Amanda Foster",  role:"Life & Business Coach",        init:"AF", stars:5, cat:"Coaching" },
  ],
  websiteScreenshots: [
    { id:"w1", title:"SolarEdge Homes",     img:"" },
    { id:"w2", title:"Torres Roofing",      img:"" },
    { id:"w3", title:"Elite Remodeling",    img:"" },
    { id:"w4", title:"SunPower Solutions",  img:"" },
    { id:"w5", title:"Sarah Chen Coaching", img:"" },
  ],
  companies: [
    { id:"c1", name:"SolarEdge Homes",   init:"SE", logo:"" },
    { id:"c2", name:"Torres Roofing",    init:"TR", logo:"" },
    { id:"c3", name:"SunPower Solutions",init:"SP", logo:"" },
    { id:"c4", name:"Elite Remodeling",  init:"ER", logo:"" },
    { id:"c5", name:"BrightPath Coaches",init:"BP", logo:"" },
    { id:"c6", name:"PeakForm Coaching", init:"PF", logo:"" },
    { id:"c7", name:"SunHarvest Solar",  init:"SH", logo:"" },
    { id:"c8", name:"ProRoof Masters",   init:"PM", logo:"" },
  ],
  cta: {
    line1: "Ready to Scale",
    line2: "Your Brand?",
    sub: "Book a free 30-minute strategy call. No pitch, no pressure — just a clear plan for your growth.",
    email: "hello@brandx.com",
  },
  footer: {
    tagline: "Full-stack digital growth agency — design, branding, content, AI & paid media.",
    email: "hello@brandx.com",
    phone: "+1 (123) 456-7890",
    location: "Global — Remote Agency",
  },
};

function loadData() {
  try { const s = localStorage.getItem("brandx_v4"); return s ? JSON.parse(s) : JSON.parse(JSON.stringify(DEFAULT_DATA)); }
  catch { return JSON.parse(JSON.stringify(DEFAULT_DATA)); }
}
function saveData(d) { localStorage.setItem("brandx_v4", JSON.stringify(d)); }
function uid() { return "_" + Math.random().toString(36).slice(2, 9); }
function splitTags(s) { return (s || "").split(",").map((x) => x.trim()).filter(Boolean); }
function splitLines(s) { return (s || "").split("\n").map((x) => x.trim()).filter(Boolean); }
function getYTEmbed(url) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  const v = url.match(/vimeo\.com\/(\d+)/);
  if (v) return `https://player.vimeo.com/video/${v[1]}`;
  return null;
}

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
}

function useToast() {
  const show = useCallback((msg) => {
    const t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }, []);
  return show;
}

// ─── CURSOR ───────────────────────────────────────────────────────────────────
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });
  useEffect(() => {
    const move = (e) => { pos.current.mx = e.clientX; pos.current.my = e.clientY; };
    document.addEventListener("mousemove", move);
    let raf;
    const loop = () => {
      pos.current.rx += (pos.current.mx - pos.current.rx) * 0.12;
      pos.current.ry += (pos.current.my - pos.current.ry) * 0.12;
      if (dotRef.current) { dotRef.current.style.left = pos.current.mx + "px"; dotRef.current.style.top = pos.current.my + "px"; }
      if (ringRef.current) { ringRef.current.style.left = pos.current.rx + "px"; ringRef.current.style.top = pos.current.ry + "px"; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { document.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);
  return (<>
    <div ref={dotRef} className="cur" style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 99999, transform: "translate(-50%,-50%)" }}>
      <div className="cur-dot" />
    </div>
    <div ref={ringRef} className="cur" style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 99998, transform: "translate(-50%,-50%)" }}>
      <div className="cur-ring" />
    </div>
  </>);
}

// ─── INTRO SCREEN ─────────────────────────────────────────────────────────────
function IntroScreen() {
  const [show, setShow] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    setTimeout(() => setShow(true), 100);
    const dismiss = () => { setGone(true); setTimeout(() => document.getElementById("intro-el")?.remove(), 900); };
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    window.addEventListener("scroll", dismiss, { once: true, passive: true });
    window.addEventListener("touchmove", dismiss, { once: true, passive: true });
    const t = setTimeout(() => dismiss(), 4500);
    return () => clearTimeout(t);
  }, []);
  return (
    <div id="intro-el" className={`intro${gone ? " gone" : ""}`}>
      <div className="intro-grid" />
      <div className="intro-b1" /><div className="intro-b2" />
      <div className={`intro-name${show ? " show" : ""}`}>Brand<span className="bx">X</span></div>
      <div className={`intro-sub${show ? " show" : ""}`}><span>Digital Growth Agency</span></div>
      <div className={`intro-hint${show ? " show" : ""}`}>
        <span>Scroll to enter</span>
        <div className="scroll-line" />
      </div>
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ onAdminOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobOpen(false); };
  const links = [["home","Home"],["work","Work"],["services","Services"],["about","About"],["contact","Contact"]];
  return (<>
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <div className="logo" onClick={() => go("home")}>Brand<span className="logo-x">X</span><span className="logo-dot" /></div>
        <ul className="nav-links">
          {links.map(([id, label]) => <li key={id}><a onClick={() => go(id)}>{label}</a></li>)}
        </ul>
        <button className="btn btn-primary nav-cta" onClick={() => go("cta")}>Book a Call</button>
        <button className="ham" onClick={() => setMobOpen(true)}><span/><span/><span/></button>
      </div>
    </nav>
    <div className={`mob${mobOpen ? " open" : ""}`}>
      <button className="mob-x" onClick={() => setMobOpen(false)}>✕</button>
      {links.map(([id, label]) => <a key={id} onClick={() => go(id)}>{label}</a>)}
      <button className="btn btn-primary" onClick={() => go("cta")}>Book a Call</button>
    </div>
  </>);
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ data }) {
  const h = data.hero;
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="home" className="hero section">
      <div className="hero-grid" /><div className="hb hb1" /><div className="hb hb2" /><div className="hb hb3" />
      <div className="container">
        <div className="hero-layout">
          <div>
            <div className="hero-badge"><div className="bping" />{h.badge}</div>
            <h1 className="hero-h1">{h.line1}<span className="line2">{h.line2}</span></h1>
            <p className="hero-sub">{h.sub}</p>
            <div className="hero-btns">
              <button className="btn btn-primary" onClick={() => go("work")}>View Our Work →</button>
              <button className="btn btn-cyan" onClick={() => go("cta")}>Book a Call</button>
            </div>
            <div className="hero-metrics">
              {h.metrics.map((m, i) => <div key={i}><div className="mval">{m.val}</div><div className="mlbl">{m.lbl}</div></div>)}
            </div>
          </div>
          <div className="hero-vis">
            <div className="orbit">
              <div className="oring r1"><div className="rdot" /></div>
              <div className="oring r2"><div className="rdot" /></div>
              <div className="oring r3"><div className="rdot" /></div>
              <div className="orb"><div className="orb-brand">Brand<span>X</span></div><div className="orb-sub">Digital Growth</div></div>
            </div>
            <div className="fc fc1"><div className="fc-ico">📈</div><div><div className="fc-ttl">+340% Traffic</div><div className="fc-val">SEO Campaign</div></div></div>
            <div className="fc fc2"><div className="fc-ico">🤖</div><div><div className="fc-ttl">AI Receptionist</div><div className="fc-val">24/7 Active</div></div></div>
            <div className="fc fc3"><div className="fc-ico">🎬</div><div><div className="fc-ttl">120 Reels</div><div className="fc-val">Content Pipeline</div></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MARQUEE ──────────────────────────────────────────────────────────────────
function Marquee({ items }) {
  const doubled = [...items, ...items];
  return (
    <div className="mq">
      <div className="mq-track">
        {doubled.map((item, i) => <div className="mq-item" key={i}><span className="mq-dot">◆</span>{item}</div>)}
      </div>
    </div>
  );
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
function Services({ services }) {
  return (
    <section id="services" className="section" style={{ background: "var(--bg2)" }}>
      <div className="container">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"4rem", flexWrap:"wrap", gap:"2rem" }}>
          <div>
            <div className="section-tag reveal">What We Do</div>
            <h2 className="headline reveal">Everything You Need to <span className="hi">Grow</span></h2>
          </div>
          <p className="reveal" style={{ color:"var(--muted)", maxWidth:"340px", lineHeight:1.7, fontSize:".95rem" }}>
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
                <ul className="svc-list">{s.items.map((item, i) => <li key={i}>{item}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI SECTION ───────────────────────────────────────────────────────────────
function AISection() {
  const cards = [
    { tag:"Automation", glow:"gblue", title:"Work Automation", desc:"Eliminate repetitive manual tasks. We build custom AI workflows that run your business operations on autopilot — CRM updates, lead processing, reporting, emails, and more.", feats:["CRM Automation","Lead Qualification","Email Sequences","Invoice Processing","Report Generation","Zapier + Make Flows"] },
    { tag:"AI Agent",   glow:"gcyan", title:"AI Receptionist", desc:"A 24/7 intelligent AI agent that handles enquiries, qualifies leads, books appointments, and answers client questions — sounding completely human.", feats:["24/7 Availability","Lead Qualification","Appointment Booking","WhatsApp & Web Chat","Custom Knowledge Base"] },
  ];
  return (
    <section id="ai" className="section">
      <div className="container">
        <div style={{ textAlign:"center", marginBottom:"4rem" }}>
          <div className="section-tag reveal" style={{ justifyContent:"center" }}>AI Services</div>
          <h2 className="headline reveal" style={{ textAlign:"center" }}>The Future of <span className="hi">Your Business</span></h2>
          <p className="reveal" style={{ color:"var(--muted)", maxWidth:"500px", margin:".8rem auto 0", lineHeight:1.7 }}>Supercharge your operations with custom AI tools built for your workflow.</p>
        </div>
        <div className="ai-grid">
          {cards.map((c, i) => (
            <div key={i} className="ai-inner reveal">
              <div className={`ai-glow ${c.glow}`} />
              <div className="ai-tag">{c.tag}</div>
              <div className="ai-ttl">{c.title}</div>
              <p className="ai-desc">{c.desc}</p>
              <div className="ai-feats">{c.feats.map((f, j) => <span className="ai-feat" key={j}>{f}</span>)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── PORTFOLIO ────────────────────────────────────────────────────────────────
function Portfolio({ projects, onOpenModal }) {
  const [filter, setFilter] = useState("All");
  const cats = ["All", ...new Set(projects.map((p) => p.cat))];
  const visible = filter === "All" ? projects : projects.filter((p) => p.cat === filter);
  return (
    <section id="work" className="section" style={{ background: "var(--bg2)" }}>
      <div className="container">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"3rem", flexWrap:"wrap", gap:"1.5rem" }}>
          <div>
            <div className="section-tag reveal">Portfolio</div>
            <h2 className="headline reveal">Work We're <span className="hi">Proud Of</span></h2>
          </div>
          <button className="btn btn-ghost reveal" onClick={() => document.getElementById("cta")?.scrollIntoView({ behavior:"smooth" })}>Start a Project →</button>
        </div>
        <div className="port-filters">
          {cats.map((c) => <button key={c} className={`flt-btn${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>{c}</button>)}
        </div>
        <div className="port-grid">
          {visible.map((p) => (
            <div key={p.id} className="port-item reveal" onClick={() => onOpenModal(p.id)}>
              <div className={`port-thumb ${p.bg}`}>
                <span>{p.emoji}</span>
                <div className="port-ov">
                  <div>
                    <div className="port-ov-ttl">{p.name}</div>
                    <button className="port-ov-link" onClick={(e) => { e.stopPropagation(); onOpenModal(p.id); }}>View Case Study →</button>
                  </div>
                </div>
              </div>
              <div className="port-meta">
                <div className="port-tags">{splitTags(p.tags).map((t, i) => <span key={i} className="ptag">{t}</span>)}</div>
                <div className="port-name">{p.name}</div>
                <div className="port-results">{splitTags(p.results).slice(0,2).map((r,i)=><span key={i} className="pres">{r}</span>)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CASE STUDY MODAL ─────────────────────────────────────────────────────────
function CaseStudyModal({ project, onClose }) {
  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    document.body.style.overflow = project ? "hidden" : "";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [project, onClose]);
  if (!project) return <div className="modal-ov" />;
  const embed = getYTEmbed(project.videoUrl);
  const shots = splitLines(project.screenshots);
  const results = splitTags(project.results);
  const tags = splitTags(project.tags);
  return (
    <div className="modal-ov open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box">
        <div className="modal-hdr">
          <div>
            <div className="port-tags" style={{ marginBottom:".5rem" }}>{tags.map((t,i)=><span key={i} className="ptag">{t}</span>)}</div>
            <h2 style={{ fontFamily:"var(--fd)", fontWeight:900, fontSize:"1.6rem", letterSpacing:"-.03em" }}>{project.name}</h2>
          </div>
          <button className="modal-x" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-vid">
            {embed ? <iframe src={embed} allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen />
              : project.videoUrl ? <video controls src={project.videoUrl} style={{ width:"100%", height:"100%", borderRadius:12 }} />
              : <div style={{ fontSize:"4rem" }}>{project.emoji || "🎬"}</div>}
          </div>
          <p style={{ color:"var(--muted)", lineHeight:1.75, marginBottom:"1.5rem" }}>{project.desc}</p>
          {shots.length > 0 && (<>
            <h4 style={{ fontFamily:"var(--fd)", fontWeight:800, fontSize:".82rem", color:"var(--muted)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:"1rem" }}>Screenshots</h4>
            <div className="modal-shots">{shots.map((src,i)=><img key={i} src={src} alt="screenshot" />)}</div>
          </>)}
          {results.length > 0 && (<>
            <h4 style={{ fontFamily:"var(--fd)", fontWeight:800, fontSize:".82rem", color:"var(--muted)", letterSpacing:".1em", textTransform:"uppercase", marginBottom:".8rem", marginTop:"1.5rem" }}>Results</h4>
            <div className="modal-res">{results.map((r,i)=><span key={i} className="modal-rpill">{r}</span>)}</div>
          </>)}
          {project.liveUrl && <div style={{ marginTop:"2rem" }}><a href={project.liveUrl} target="_blank" rel="noopener" className="btn btn-cyan">Visit Live Site →</a></div>}
        </div>
      </div>
    </div>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function Testimonials({ testimonials }) {
  const doubled = [...testimonials, ...testimonials];
  return (
    <section id="testimonials" className="section" style={{ background:"var(--bg)", overflow:"hidden" }}>
      <div className="container">
        <div style={{ textAlign:"center", marginBottom:"4rem" }}>
          <div className="section-tag reveal" style={{ justifyContent:"center" }}>Testimonials</div>
          <h2 className="headline reveal" style={{ textAlign:"center" }}>What Clients <span className="hi">Say</span></h2>
        </div>
      </div>
      <div className="testi-wrap">
        <div className="testi-track">
          {doubled.map((t, i) => (
            <div key={i} className="tcard">
              <div className="tcard-q">"</div>
              <div className="tstars">{"★".repeat(t.stars || 5).split("").map((s,j)=><span key={j} className="star">{s}</span>)}</div>
              <p className="tquote">"{t.quote}"</p>
              <div className="tauthor">
                <div className="tav">{t.init}</div>
                <div><div className="tname">{t.author}</div><div className="trole">{t.role}</div>{t.cat && <span className="tcat">{t.cat}</span>}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── WEBSITE SHOWCASE ─────────────────────────────────────────────────────────
function WebsiteShowcase({ screenshots }) {
  if (!screenshots?.length) return null;
  const doubled = [...screenshots, ...screenshots];
  return (
    <section className="section" style={{ background:"var(--bg2)", paddingTop:"4rem", paddingBottom:"4rem", overflow:"hidden" }}>
      <div className="container" style={{ marginBottom:"3rem", textAlign:"center" }}>
        <div className="section-tag reveal" style={{ justifyContent:"center" }}>Our Websites</div>
        <h2 className="headline reveal" style={{ textAlign:"center" }}>Websites That <span className="hi">Convert</span></h2>
        <p className="reveal" style={{ color:"var(--muted)", maxWidth:"500px", margin:".8rem auto 0", lineHeight:1.7 }}>A snapshot of the websites we've designed and built for our clients.</p>
      </div>
      <div className="show-wrap">
        <div className="show-track">
          {doubled.map((s, i) => (
            <div key={i} className="scard">
              {s.img ? <img src={s.img} alt={s.title} className="scard-img" /> : <div className="scard-ph"><span style={{ fontSize:"2.5rem" }}>🌐</span><span style={{ fontSize:".8rem", color:"var(--muted)", fontFamily:"var(--fd)", fontWeight:600 }}>{s.title}</span></div>}
              <div className="scard-lbl">{s.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── COMPANIES ────────────────────────────────────────────────────────────────
function Companies({ companies }) {
  if (!companies?.length) return null;
  const doubled = [...companies, ...companies];
  return (
    <section className="section" style={{ background:"var(--bg)", overflow:"hidden", paddingTop:"4rem", paddingBottom:"4rem" }}>
      <div className="container" style={{ marginBottom:"2rem", textAlign:"center" }}>
        <p style={{ fontFamily:"var(--fd)", fontSize:".78rem", fontWeight:700, color:"var(--muted2)", letterSpacing:".2em", textTransform:"uppercase" }}>Trusted by industry leaders</p>
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

// ─── WHY US ───────────────────────────────────────────────────────────────────
function WhyUs() {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const cards = [
    { icon:"🎯", title:"Result Driven",  desc:"Every decision maps back to your core business metrics. No vanity work." },
    { icon:"✨", title:"Modern Design",  desc:"Cutting-edge interfaces that make your brand unforgettable at first glance." },
    { icon:"🔍", title:"SEO Focused",    desc:"Built to rank. Structure, speed, and semantics done right from the start." },
    { icon:"⚡", title:"Fast Delivery",  desc:"Efficient workflows mean you go live faster without sacrificing quality." },
  ];
  return (
    <section id="about" className="section" style={{ background:"var(--bg2)" }}>
      <div className="container">
        <div className="why-layout">
          <div>
            <div className="section-tag reveal left">Why BrandX</div>
            <h2 className="headline reveal left">We Don't Just Deliver Work —<br /><span className="hi">We Deliver Results</span></h2>
            <p className="reveal left" style={{ color:"var(--muted)", lineHeight:1.8, maxWidth:"460px", marginTop:"1rem" }}>We're not a typical agency. Every strategy, every pixel, and every automation we build is obsessed with one thing: making your numbers grow.</p>
            <button className="btn btn-primary reveal left" style={{ marginTop:"2.5rem" }} onClick={() => go("cta")}>Get Started →</button>
          </div>
          <div className="why-cards">
            {cards.map((c, i) => (
              <div key={i} className="why-card reveal">
                <span className="why-ico">{c.icon}</span>
                <div className="why-ttl">{c.title}</div>
                <p className="why-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA({ cta }) {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section id="cta" className="section">
      <div className="container">
        <div className="cta-box reveal">
          <div className="cta-cnt">
            <h2 className="cta-ttl">{cta.line1}<br /><span className="hi">{cta.line2}</span></h2>
            <p className="cta-sub">{cta.sub}</p>
            <div className="cta-btns">
              <a href={`mailto:${cta.email}`} className="btn btn-primary" style={{ fontSize:"1rem", padding:".9rem 2.5rem" }}>Schedule a Call →</a>
              <button className="btn btn-ghost" onClick={() => go("work")}>View Our Work</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ data, onAdminOpen }) {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  const f = data.footer;
  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="foot-grid">
          <div>
            <div className="logo" style={{ marginBottom:"1.2rem" }} onClick={() => go("home")}>Brand<span className="logo-x">X</span><span className="logo-dot" /></div>
            <p className="foot-desc">{f.tagline}</p>
            <div className="socials">
              {["𝕏","in","ig","yt"].map((s,i)=><a key={i} href="#" className="social" onClick={(e)=>e.preventDefault()}>{s}</a>)}
            </div>
          </div>
          <div className="foot-col">
            <h5>Quick Links</h5>
            <ul className="foot-links">
              {[["home","Home"],["work","Work"],["services","Services"],["about","About"],["contact","Contact"]].map(([id,label])=>(
                <li key={id}><a onClick={()=>go(id)}>{label}</a></li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h5>Services</h5>
            <ul className="foot-links">
              {["Web Design","Personal Branding","Video Editing","Content Planning","Paid Ads","AI Automation"].map((s,i)=>(
                <li key={i}><a onClick={()=>go("services")}>{s}</a></li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h5>Contact</h5>
            <ul className="foot-links">
              <li><a href={`mailto:${f.email}`}>{f.email}</a></li>
              <li><a href={`tel:${f.phone}`}>{f.phone}</a></li>
              <li><span style={{ color:"var(--muted)" }}>{f.location}</span></li>
            </ul>
          </div>
        </div>
        <div className="foot-bot">
          <p>© {new Date().getFullYear()} <span>{data.brand}</span>. All rights reserved.</p>
          <p><span style={{ cursor:"pointer", color:"var(--muted2)" }} onClick={onAdminOpen}>Admin ⚙</span></p>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN PANEL
// ═══════════════════════════════════════════════════════════════
function AdminPanel({ data, onUpdate, onClose }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState(false);
  const [tab, setTab] = useState("hero");
  const toast = useToast();

  const tabs = [
    { id:"hero",         label:"🏠 Hero" },
    { id:"services",     label:"⚙ Services" },
    { id:"projects",     label:"📁 Portfolio" },
    { id:"testimonials", label:"💬 Testimonials" },
    { id:"showcase",     label:"🖼 Screenshots" },
    { id:"companies",    label:"🏢 Companies" },
    { id:"cta",          label:"📣 CTA" },
    { id:"footer",       label:"📧 Footer" },
    { id:"settings",     label:"🔐 Settings" },
  ];

  const save = (newData) => { onUpdate(newData); saveData(newData); toast("Saved ✓"); };

  useEffect(() => {
    const h = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!authed) return (
    <div className="admin-ov open">
      <div className="pwd-screen">
        <div className="pwd-box">
          <h2>⚙ Admin Panel</h2>
          <p>Enter your password to edit site content</p>
          <div className="afield" style={{ marginBottom:"1rem" }}>
            <input type="password" placeholder="Password" value={pw} onChange={(e)=>setPw(e.target.value)}
              onKeyDown={(e)=>{ if(e.key==="Enter"){ if(pw===data.adminPassword){setAuthed(true);setPwErr(false);}else setPwErr(true); }}} style={{ textAlign:"center" }} />
          </div>
          {pwErr && <p style={{ color:"var(--pink)", fontSize:".85rem", marginBottom:"1rem" }}>Wrong password</p>}
          <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center" }}
            onClick={()=>{ if(pw===data.adminPassword){setAuthed(true);setPwErr(false);}else setPwErr(true); }}>Login →</button>
          <button className="btn btn-ghost" style={{ width:"100%", justifyContent:"center", marginTop:".8rem" }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-ov open">
      <div className="admin-top">
        <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
          <div className="logo" style={{ fontSize:"1.3rem" }}>Brand<span className="logo-x">X</span><span className="logo-dot" /></div>
          <span style={{ color:"var(--muted)", fontFamily:"var(--fd)", fontSize:".78rem", letterSpacing:".1em", textTransform:"uppercase" }}>Admin Panel</span>
        </div>
        <div style={{ display:"flex", gap:".8rem" }}>
          <button className="btn btn-ghost" style={{ padding:".5rem 1rem" }} onClick={onClose}>← View Site</button>
          <button className="btn btn-ghost" style={{ padding:".5rem 1rem", color:"var(--pink)" }} onClick={()=>setAuthed(false)}>Logout</button>
        </div>
      </div>
      <div className="atabs">
        {tabs.map(t => <button key={t.id} className={`atab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>{t.label}</button>)}
      </div>
      <div className="abody">
        {tab==="hero"         && <HeroTab         data={data} save={save} toast={toast} />}
        {tab==="services"     && <ServicesTab      data={data} save={save} toast={toast} />}
        {tab==="projects"     && <ProjectsTab      data={data} save={save} toast={toast} />}
        {tab==="testimonials" && <TestimonialsTab  data={data} save={save} toast={toast} />}
        {tab==="showcase"     && <ShowcaseTab      data={data} save={save} toast={toast} />}
        {tab==="companies"    && <CompaniesTab     data={data} save={save} toast={toast} />}
        {tab==="cta"          && <CTATab           data={data} save={save} toast={toast} />}
        {tab==="footer"       && <FooterTab        data={data} save={save} toast={toast} />}
        {tab==="settings"     && <SettingsTab      data={data} save={save} toast={toast} onClose={onClose} />}
      </div>
    </div>
  );
}

// ─── ADMIN TABS ───────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return <div className="afield">{label && <label>{label}</label>}{children}</div>;
}
function Grid({ children }) { return <div className="agrid">{children}</div>; }
function ACard({ title, children }) { return <div className="acard"><h3>{title}</h3>{children}</div>; }

function HeroTab({ data, save }) {
  const [h, setH] = useState({ ...data.hero });
  const setM = (i, k, v) => { const m = [...h.metrics]; m[i] = { ...m[i], [k]: v }; setH({ ...h, metrics: m }); };
  return (
    <ACard title="Hero Section">
      <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
        <Grid>
          <Field label="Badge Text"><input value={h.badge} onChange={e=>setH({...h,badge:e.target.value})} /></Field>
          <Field label="Email (Book a Call)"><input value={h.email} onChange={e=>setH({...h,email:e.target.value})} /></Field>
        </Grid>
        <Grid>
          <Field label="Headline Line 1"><input value={h.line1} onChange={e=>setH({...h,line1:e.target.value})} /></Field>
          <Field label="Headline Line 2 (colored)"><input value={h.line2} onChange={e=>setH({...h,line2:e.target.value})} /></Field>
        </Grid>
        <Field label="Subtext"><textarea value={h.sub} onChange={e=>setH({...h,sub:e.target.value})} /></Field>
        <h4 style={{ fontFamily:"var(--fd)", fontWeight:800, fontSize:".85rem" }}>Metrics</h4>
        {h.metrics.map((m,i)=>(
          <Grid key={i}>
            <Field label={`Value ${i+1}`}><input value={m.val} onChange={e=>setM(i,"val",e.target.value)} /></Field>
            <Field label={`Label ${i+1}`}><input value={m.lbl} onChange={e=>setM(i,"lbl",e.target.value)} /></Field>
          </Grid>
        ))}
        <button className="btn btn-primary" style={{ alignSelf:"flex-start" }} onClick={()=>save({...data,hero:h})}>Save Hero →</button>
      </div>
    </ACard>
  );
}

function ServicesTab({ data, save, toast }) {
  const [svcs, setSvcs] = useState(data.services.map(s=>({...s})));
  const update = (i, k, v) => { const n=[...svcs]; n[i]={...n[i],[k]:v}; setSvcs(n); };
  const clsList = ["ico-blue","ico-cyan","ico-purple","ico-pink","ico-gold","ico-teal"];
  return (
    <ACard title="Services — Edit each card, then save">
      {svcs.map((s,i)=>(
        <div key={i} style={{ background:"var(--bg)", border:"1px solid var(--border)", borderRadius:10, padding:"1rem", marginBottom:"1rem" }}>
          <div style={{ display:"flex", alignItems:"center", gap:".8rem", marginBottom:"1rem" }}>
            <span style={{ fontSize:"1.5rem" }}>{s.icon}</span>
            <strong style={{ fontFamily:"var(--fd)" }}>{s.title}</strong>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:".8rem" }}>
            <Grid>
              <Field label="Title"><input value={s.title} onChange={e=>update(i,"title",e.target.value)} /></Field>
              <Field label="Icon Emoji"><input value={s.icon} onChange={e=>update(i,"icon",e.target.value)} /></Field>
            </Grid>
            <Field label="Description"><textarea value={s.desc} rows={2} onChange={e=>update(i,"desc",e.target.value)} /></Field>
            <Field label="Items (one per line)"><textarea value={s.items.join("\n")} rows={4} onChange={e=>update(i,"items",e.target.value.split("\n").map(x=>x.trim()).filter(Boolean))} /></Field>
            <Grid>
              <Field label="Badge (hot / new / blank)"><input value={s.badge} onChange={e=>update(i,"badge",e.target.value)} /></Field>
              <Field label="Icon Color">
                <select value={s.cls} onChange={e=>update(i,"cls",e.target.value)}>
                  {clsList.map(c=><option key={c}>{c}</option>)}
                </select>
              </Field>
            </Grid>
            <button className="btn btn-primary" style={{ alignSelf:"flex-start", padding:".55rem 1.1rem", fontSize:".82rem" }}
              onClick={()=>{ const n=[...svcs]; save({...data,services:n}); }}>Save →</button>
          </div>
        </div>
      ))}
    </ACard>
  );
}

function ProjectsTab({ data, save, toast }) {
  const blank = { name:"", cat:"Solar", tags:"", emoji:"🏢", bg:"bg-solar", desc:"", results:"", videoUrl:"", screenshots:"", liveUrl:"" };
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);
  const bgMap = { Solar:"bg-solar", Roofing:"bg-roofing", Remodeling:"bg-remodel", Coaching:"bg-coach" };
  const startEdit = (p) => { setForm({...p}); setEditId(p.id); };
  const cancel = () => { setForm(blank); setEditId(null); };
  const submit = () => {
    if (!form.name.trim()) { toast("Enter a project name"); return; }
    const proj = { ...form, id: editId || uid(), bg: bgMap[form.cat] || "bg-solar" };
    const projects = editId ? data.projects.map(p=>p.id===editId?proj:p) : [...data.projects, proj];
    save({ ...data, projects }); cancel();
  };
  const del = (id) => { if (!confirm("Delete?")) return; save({ ...data, projects: data.projects.filter(p=>p.id!==id) }); };
  return (<>
    <ACard title={editId ? "Edit Project" : "Add New Project"}>
      <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
        <Grid>
          <Field label="Project Name"><input placeholder="Torres Roofing — Full Brand" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></Field>
          <Field label="Category">
            <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})}>
              {["Solar","Roofing","Remodeling","Coaching"].map(c=><option key={c}>{c}</option>)}
            </select>
          </Field>
        </Grid>
        <Grid>
          <Field label="Tags (comma separated)"><input placeholder="Roofing, Web Design, SEO" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} /></Field>
          <Field label="Emoji"><input placeholder="🏠" value={form.emoji} onChange={e=>setForm({...form,emoji:e.target.value})} /></Field>
        </Grid>
        <Field label="Description"><textarea value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} /></Field>
        <Field label="Results (comma separated)"><input placeholder="+340% Traffic, 3x Leads" value={form.results} onChange={e=>setForm({...form,results:e.target.value})} /></Field>
        <Field label="Video URL (YouTube or Vimeo)"><input placeholder="https://youtube.com/watch?v=..." value={form.videoUrl} onChange={e=>setForm({...form,videoUrl:e.target.value})} /></Field>
        <Field label="Screenshot URLs (one per line)"><textarea rows={3} placeholder="https://i.imgur.com/example.jpg" value={form.screenshots} onChange={e=>setForm({...form,screenshots:e.target.value})} /></Field>
        <Field label="Live Website URL"><input placeholder="https://clientsite.com" value={form.liveUrl} onChange={e=>setForm({...form,liveUrl:e.target.value})} /></Field>
        <div style={{ display:"flex", gap:"1rem" }}>
          <button className="btn btn-primary" onClick={submit}>{editId ? "Update Project" : "Add Project"}</button>
          {editId && <button className="btn btn-ghost" onClick={cancel}>Cancel</button>}
        </div>
      </div>
    </ACard>
    <ACard title={`All Projects (${data.projects.length})`}>
      {data.projects.map(p=>(
        <div key={p.id} className="alist-item">
          <span style={{ fontSize:"1.5rem", flexShrink:0 }}>{p.emoji}</span>
          <div className="alist-info">
            <div className="alist-ttl">{p.name}</div>
            <div className="alist-sub">{p.cat} · {p.tags}</div>
          </div>
          <button className="edt-btn" onClick={()=>startEdit(p)}>Edit</button>
          <button className="del-btn" onClick={()=>del(p.id)}>Delete</button>
        </div>
      ))}
    </ACard>
  </>);
}

function TestimonialsTab({ data, save, toast }) {
  const blank = { quote:"", author:"", role:"", init:"", stars:5, cat:"Solar" };
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState(null);
  const startEdit = (t) => { setForm({...t}); setEditId(t.id); };
  const cancel = () => { setForm(blank); setEditId(null); };
  const submit = () => {
    if (!form.quote.trim()) { toast("Enter a quote"); return; }
    const t = { ...form, id: editId || uid() };
    const testimonials = editId ? data.testimonials.map(x=>x.id===editId?t:x) : [...data.testimonials, t];
    save({ ...data, testimonials }); cancel();
  };
  const del = (id) => { if (!confirm("Delete?")) return; save({ ...data, testimonials: data.testimonials.filter(t=>t.id!==id) }); };
  return (<>
    <ACard title={editId ? "Edit Testimonial" : "Add Testimonial"}>
      <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
        <Field label="Quote"><textarea placeholder="What the client said..." value={form.quote} onChange={e=>setForm({...form,quote:e.target.value})} /></Field>
        <Grid>
          <Field label="Name"><input placeholder="James Mitchell" value={form.author} onChange={e=>setForm({...form,author:e.target.value})} /></Field>
          <Field label="Role / Company"><input placeholder="CEO, SolarEdge Homes" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} /></Field>
        </Grid>
        <Grid>
          <Field label="Initials"><input placeholder="JM" maxLength={3} value={form.init} onChange={e=>setForm({...form,init:e.target.value.toUpperCase()})} /></Field>
          <Field label="Category">
            <select value={form.cat} onChange={e=>setForm({...form,cat:e.target.value})}>
              {["Solar","Roofing","Remodeling","Coaching"].map(c=><option key={c}>{c}</option>)}
            </select>
          </Field>
        </Grid>
        <div style={{ display:"flex", gap:"1rem" }}>
          <button className="btn btn-primary" onClick={submit}>{editId ? "Update" : "Add Testimonial"}</button>
          {editId && <button className="btn btn-ghost" onClick={cancel}>Cancel</button>}
        </div>
      </div>
    </ACard>
    <ACard title={`All Testimonials (${data.testimonials.length})`}>
      {data.testimonials.map(t=>(
        <div key={t.id} className="alist-item">
          <div className="tav" style={{ width:40, height:40, minWidth:40, borderRadius:"50%", background:"linear-gradient(135deg,var(--blue),var(--purple))", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--fd)", fontWeight:900, fontSize:".8rem" }}>{t.init}</div>
          <div className="alist-info">
            <div className="alist-ttl">{t.author} — {t.role}</div>
            <div className="alist-sub">"{t.quote}"</div>
          </div>
          <button className="edt-btn" onClick={()=>startEdit(t)}>Edit</button>
          <button className="del-btn" onClick={()=>del(t.id)}>Delete</button>
        </div>
      ))}
    </ACard>
  </>);
}

function ShowcaseTab({ data, save, toast }) {
  const [title, setTitle] = useState("");
  const [img, setImg] = useState("");
  const add = () => {
    if (!title.trim()) { toast("Enter a name"); return; }
    save({ ...data, websiteScreenshots: [...(data.websiteScreenshots||[]), { id:uid(), title, img }] });
    setTitle(""); setImg("");
  };
  const del = (id) => save({ ...data, websiteScreenshots: data.websiteScreenshots.filter(s=>s.id!==id) });
  return (<>
    <ACard title="Add Website Screenshot">
      <p style={{ color:"var(--muted)", fontSize:".85rem", marginBottom:"1.2rem" }}>Paste any public image URL — host images free at <a href="https://imgur.com" target="_blank" rel="noopener" style={{ color:"var(--cyan)" }}>imgur.com</a></p>
      <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
        <Field label="Client / Website Name"><input placeholder="Torres Roofing" value={title} onChange={e=>setTitle(e.target.value)} /></Field>
        <Field label="Image URL"><input placeholder="https://i.imgur.com/example.jpg" value={img} onChange={e=>setImg(e.target.value)} /></Field>
        {img && <img src={img} alt="preview" style={{ width:"100%", maxHeight:180, objectFit:"cover", objectPosition:"top", borderRadius:8, border:"1px solid var(--border)" }} onError={e=>e.target.style.display="none"} />}
        <button className="btn btn-primary" style={{ alignSelf:"flex-start" }} onClick={add}>Add Screenshot</button>
      </div>
    </ACard>
    <ACard title={`Screenshots (${(data.websiteScreenshots||[]).length})`}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:"1rem" }}>
        {(data.websiteScreenshots||[]).map(s=>(
          <div key={s.id} style={{ background:"var(--bg)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
            {s.img ? <img src={s.img} alt={s.title} style={{ width:"100%", height:120, objectFit:"cover", objectPosition:"top", display:"block" }} />
              : <div style={{ height:120, background:"var(--surface2)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--muted)", fontSize:".78rem" }}>No image</div>}
            <div style={{ padding:".7rem", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:"var(--fd)", fontWeight:700, fontSize:".82rem" }}>{s.title}</span>
              <button className="del-btn" style={{ fontSize:".7rem", padding:".2rem .6rem" }} onClick={()=>del(s.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </ACard>
  </>);
}

function CompaniesTab({ data, save, toast }) {
  const [name, setName] = useState("");
  const [init, setInit] = useState("");
  const [logo, setLogo] = useState("");
  const add = () => {
    if (!name.trim()) { toast("Enter a name"); return; }
    save({ ...data, companies: [...(data.companies||[]), { id:uid(), name, init:init.toUpperCase(), logo }] });
    setName(""); setInit(""); setLogo("");
  };
  const del = (id) => save({ ...data, companies: data.companies.filter(c=>c.id!==id) });
  return (<>
    <ACard title="Add Company">
      <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
        <Grid>
          <Field label="Company Name"><input placeholder="SolarEdge Homes" value={name} onChange={e=>setName(e.target.value)} /></Field>
          <Field label="Initials (if no logo)"><input placeholder="SE" maxLength={3} value={init} onChange={e=>setInit(e.target.value)} /></Field>
        </Grid>
        <Field label="Logo URL (optional)"><input placeholder="https://...logo.png" value={logo} onChange={e=>setLogo(e.target.value)} /></Field>
        <button className="btn btn-primary" style={{ alignSelf:"flex-start" }} onClick={add}>Add Company</button>
      </div>
    </ACard>
    <ACard title={`Companies (${(data.companies||[]).length})`}>
      {(data.companies||[]).map(c=>(
        <div key={c.id} className="alist-item">
          <div style={{ width:36, height:36, borderRadius:8, background:"linear-gradient(135deg,var(--blue-dim),var(--blue))", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", flexShrink:0 }}>
            {c.logo ? <img src={c.logo} alt={c.name} style={{ width:"100%", height:"100%", objectFit:"contain" }} /> : <span style={{ fontFamily:"var(--fd)", fontWeight:900, fontSize:".85rem", color:"#fff" }}>{c.init}</span>}
          </div>
          <div className="alist-info"><div className="alist-ttl">{c.name}</div></div>
          <button className="del-btn" onClick={()=>del(c.id)}>Remove</button>
        </div>
      ))}
    </ACard>
  </>);
}

function CTATab({ data, save }) {
  const [c, setC] = useState({ ...data.cta });
  return (
    <ACard title="CTA Section">
      <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
        <Grid>
          <Field label="Line 1"><input value={c.line1} onChange={e=>setC({...c,line1:e.target.value})} /></Field>
          <Field label="Line 2 (colored)"><input value={c.line2} onChange={e=>setC({...c,line2:e.target.value})} /></Field>
        </Grid>
        <Field label="Subtext"><textarea value={c.sub} onChange={e=>setC({...c,sub:e.target.value})} /></Field>
        <Field label="Email (Schedule a Call button)"><input value={c.email} onChange={e=>setC({...c,email:e.target.value})} /></Field>
        <button className="btn btn-primary" style={{ alignSelf:"flex-start" }} onClick={()=>save({...data,cta:c})}>Save CTA →</button>
      </div>
    </ACard>
  );
}

function FooterTab({ data, save }) {
  const [f, setF] = useState({ ...data.footer });
  return (
    <ACard title="Footer & Contact Info">
      <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
        <Field label="Tagline"><textarea value={f.tagline} onChange={e=>setF({...f,tagline:e.target.value})} /></Field>
        <Grid>
          <Field label="Email"><input value={f.email} onChange={e=>setF({...f,email:e.target.value})} /></Field>
          <Field label="Phone"><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} /></Field>
        </Grid>
        <Field label="Location"><input value={f.location} onChange={e=>setF({...f,location:e.target.value})} /></Field>
        <button className="btn btn-primary" style={{ alignSelf:"flex-start" }} onClick={()=>save({...data,footer:f})}>Save Footer →</button>
      </div>
    </ACard>
  );
}

function SettingsTab({ data, save, toast, onClose }) {
  const [brand, setBrand] = useState(data.brand);
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const savePw = () => {
    if (!pw1) { toast("Enter a password"); return; }
    if (pw1 !== pw2) { toast("Passwords don't match"); return; }
    save({ ...data, adminPassword: pw1 }); setPw1(""); setPw2("");
  };
  const reset = () => {
    if (!confirm("Reset ALL data to defaults? Cannot be undone.")) return;
    const fresh = JSON.parse(JSON.stringify(DEFAULT_DATA));
    save(fresh); onClose(); toast("Reset to defaults");
  };
  return (<>
    <ACard title="Brand Name">
      <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
        <Field label="Brand Name"><input value={brand} onChange={e=>setBrand(e.target.value)} /></Field>
        <button className="btn btn-primary" style={{ alignSelf:"flex-start" }} onClick={()=>save({...data,brand})}>Save →</button>
      </div>
    </ACard>
    <ACard title="Change Admin Password">
      <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
        <Field label="New Password"><input type="password" placeholder="New password" value={pw1} onChange={e=>setPw1(e.target.value)} /></Field>
        <Field label="Confirm Password"><input type="password" placeholder="Confirm" value={pw2} onChange={e=>setPw2(e.target.value)} /></Field>
        <button className="btn btn-primary" style={{ alignSelf:"flex-start" }} onClick={savePw}>Update Password →</button>
      </div>
    </ACard>
    <ACard title="⚠ Danger Zone">
      <p style={{ color:"var(--muted)", fontSize:".87rem", marginBottom:"1.2rem" }}>Reset everything back to original defaults. Cannot be undone.</p>
      <button className="del-btn" style={{ padding:".6rem 1.4rem", fontSize:".85rem" }} onClick={reset}>Reset All Data</button>
    </ACard>
  </>);
}

// ═══════════════════════════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [data, setData] = useState(loadData);
  const [modalProjectId, setModalProjectId] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);

  useScrollReveal();

  const modalProject = data.projects.find(p => p.id === modalProjectId) || null;

  const handleUpdate = (newData) => setData(newData);

  useEffect(() => {
    if (adminOpen || modalProjectId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [adminOpen, modalProjectId]);

  return (
    <>
      <Cursor />
      <IntroScreen />
      <Navbar onAdminOpen={() => setAdminOpen(true)} />

      <main>
        <Hero data={data} />
        <Marquee items={data.marquee} />
        <Services services={data.services} />
        <AISection />
        <Portfolio projects={data.projects} onOpenModal={setModalProjectId} />
        <WebsiteShowcase screenshots={data.websiteScreenshots} />
        <Testimonials testimonials={data.testimonials} />
        <Companies companies={data.companies} />
        <WhyUs />
        <CTA cta={data.cta} />
        <Footer data={data} onAdminOpen={() => setAdminOpen(true)} />
      </main>

      {modalProject && <CaseStudyModal project={modalProject} onClose={() => setModalProjectId(null)} />}

      {adminOpen && (
        <AdminPanel
          data={data}
          onUpdate={handleUpdate}
          onClose={() => setAdminOpen(false)}
        />
      )}

      <button className="admin-btn" title="Admin Panel" onClick={() => setAdminOpen(true)}>⚙</button>
    </>
  );
}
