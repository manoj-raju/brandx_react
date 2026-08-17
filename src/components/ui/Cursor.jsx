import { useEffect, useRef } from "react";

export function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ mx: 0, my: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const move = (e) => {
      pos.current.mx = e.clientX;
      pos.current.my = e.clientY;
    };
    document.addEventListener("mousemove", move);
    let raf;
    const loop = () => {
      pos.current.rx += (pos.current.mx - pos.current.rx) * 0.12;
      pos.current.ry += (pos.current.my - pos.current.ry) * 0.12;
      if (dotRef.current) {
        dotRef.current.style.left = pos.current.mx + "px";
        dotRef.current.style.top = pos.current.my + "px";
      }
      if (ringRef.current) {
        ringRef.current.style.left = pos.current.rx + "px";
        ringRef.current.style.top = pos.current.ry + "px";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      document.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cur"
        style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 99999, transform: "translate(-50%,-50%)" }}
      >
        <div className="cur-dot" />
      </div>
      <div
        ref={ringRef}
        className="cur"
        style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none", zIndex: 99998, transform: "translate(-50%,-50%)" }}
      >
        <div className="cur-ring" />
      </div>
    </>
  );
}
