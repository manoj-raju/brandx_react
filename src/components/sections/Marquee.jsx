export function Marquee({ items }) {
  const doubled = [...items, ...items];
  return (
    <div className="mq">
      <div className="mq-track">
        {doubled.map((item, i) => (
          <div className="mq-item" key={i}>
            <span className="mq-dot">◆</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
