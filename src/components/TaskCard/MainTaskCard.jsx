import "./MainTaskCard.css";

export default function MainTaskCard({ badgeIcon, badgeText, title, tasks }) {
  return (
    <section className="gk-card">
      <div className="gk-badge">
        <span className="gk-badge__icon">{badgeIcon}</span>
        <span className="gk-badge__text">{badgeText}</span>
      </div>

      <div className="gk-content">
        <div className="gk-topline">
          <div className="gk-title">{title}</div>
        </div>

        <div className="gk-list">
          {tasks.map((t, idx) => (
            <div className="gk-item" key={idx}>
              <div className="gk-item__left">
                <div className="gk-item__icon">{t.icon || "📌"}</div>
                <div className="gk-item__text">
                  <div className="gk-item__name">{t.title}</div>
                  <div className="gk-item__from">
                    {t.from} <span className="gk-arrow">›</span>
                  </div>
                </div>
              </div>

              <div className="gk-item__right">
                {t.reward > 0 && <span className="gk-plus">+{t.reward}</span>}
                {t.reward > 0 && <span className="gk-coin">🪙</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="gk-actions">
          <button className="gk-btn">
            查看任務 <span>›</span>
          </button>
        </div>
      </div>
    </section>
  );
}
