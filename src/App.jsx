import { useState, useEffect } from "react";
import { loadData } from "./utils/helpers";
import { useScrollReveal } from "./hooks/useScrollReveal";

import { Cursor } from "./components/ui/Cursor";
import { CaseStudyModal } from "./components/ui/CaseStudyModal";
import { IntroLoader } from "./components/layout/IntroLoader";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AdminPanel } from "./components/layout/AdminPanel";

import { Hero } from "./components/sections/Hero";
import { Marquee } from "./components/sections/Marquee";
import { Services } from "./components/sections/Services";
import { AiSolutions } from "./components/sections/AiSolutions";
import { Portfolio } from "./components/sections/Portfolio";
import { Showcase } from "./components/sections/Showcase";
import { Testimonials } from "./components/sections/Testimonials";
import { CompanyMarquee } from "./components/sections/CompanyMarquee";
import { WhyUs } from "./components/sections/WhyUs";
import { CTA } from "./components/sections/CTA";

export default function App() {
  const [data, setData] = useState(loadData);
  const [modalProjectId, setModalProjectId] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);

  useScrollReveal();

  const modalProject = data.projects.find((p) => p.id === modalProjectId) || null;
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
      <IntroLoader />
      <Navbar onAdminOpen={() => setAdminOpen(true)} />

      <main>
        <Hero data={data} />
        <Marquee items={data.marquee} />
        <Services services={data.services} />
        <AiSolutions data={data} />
        <Portfolio projects={data.projects} onOpenModal={setModalProjectId} />
        <Showcase screenshots={data.websiteScreenshots} />
        <Testimonials testimonials={data.testimonials} />
        <CompanyMarquee companies={data.companies} />
        <WhyUs data={data} />
        <CTA cta={data.cta} />
        <Footer data={data} onAdminOpen={() => setAdminOpen(true)} />
      </main>

      {modalProject && <CaseStudyModal project={modalProject} onClose={() => setModalProjectId(null)} />}

      {adminOpen && <AdminPanel data={data} onUpdate={handleUpdate} onClose={() => setAdminOpen(false)} />}

      <button className="admin-btn" title="Admin Panel" onClick={() => setAdminOpen(true)}>
        ⚙
      </button>
    </>
  );
}
