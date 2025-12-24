import "./MiniSourceCard.css";

export default function MiniSourceCard({ active, icon, title, subtitle, onClick }) {
  return (
    <div className={`miniCard ${active ? "active" : ""}`} onClick={onClick}>
      <div className="miniIcon">{icon}</div>
      <div className="miniText">
        <div className="miniTitle">{title}</div>
        <div className="miniSub">{subtitle}</div>
      </div>
    </div>
  );
}
