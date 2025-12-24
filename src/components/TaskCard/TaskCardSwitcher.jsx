import { useMemo, useState } from "react";
import MainTaskCard from "./MainTaskCard";
import MiniSourceCard from "./MiniSourceCard";
import "./TaskCardSwitcher.css";

export default function TaskCardSwitcher() {
  const sources = useMemo(
    () => [
      {
        id: "board",
        name: "任務欄",
        subtitle: "目前有 3 個任務等你承接",
        icon: "⚔️",
        mainTitle: "目前有 6 個任務等你承接",
        tasks: [
          { title: "購買牛奶和麵包", from: "來自 親親的任務來源", reward: 10, icon: "🧃" },
          { title: "運動 30 分鐘", from: "來自 伴侶的任務來源", reward: 10, icon: "🏋️" },
          { title: "清理書櫃/垃圾房", from: "來自 親親的任務來源", reward: 10, icon: "🧹" },
          { title: "清理書櫃/垃圾房", from: "來自 親親的任務來源", reward: 10, icon: "🧹" },
          { title: "清理書櫃/垃圾房", from: "來自 親親的任務來源", reward: 10, icon: "🧹" },
          { title: "清理書櫃/垃圾房", from: "來自 親親的任務來源", reward: 10, icon: "🧹" },
          { title: "清理書櫃/垃圾房", from: "來自 親親的任務來源", reward: 10, icon: "🧹" },
          { title: "清理書櫃/垃圾房", from: "來自 親親的任務來源", reward: 10, icon: "🧹" },
        ],
      },
      {
        id: "published",
        name: "我發布的任務",
        subtitle: "有 1 個待審核任務",
        icon: "🧾",
        mainTitle: "你目前有 1 個任務待審核",
        tasks: [{ title: "整理房間（待審核）", from: "狀態：審核中", reward: 20, icon: "🧺" }],
      },
      {
        id: "source",
        name: "我的任務來源",
        subtitle: "已加入 3 個任務來源",
        icon: "🧭",
        mainTitle: "你已加入 3 個任務來源",
        tasks: [
          { title: "親親", from: "關係：家人", reward: 0, icon: "👨‍👩‍👧" },
          { title: "伴侶", from: "關係：伴侶", reward: 0, icon: "💍" },
          { title: "公會", from: "關係：好友", reward: 0, icon: "🏰" },
        ],
      },
    ],
    []
  );

  const [activeId, setActiveId] = useState(sources[0].id);
  const active = sources.find((s) => s.id === activeId);

  return (
    <div className="taskBoardWrap">
      <div className="switcher">
        <MainTaskCard
          badgeIcon={active.icon}
          badgeText={active.name}
          title={active.mainTitle}
          tasks={active.tasks}
        />

        <div className="miniRow">
          {sources.map((s) => (
            <MiniSourceCard
              key={s.id}
              active={s.id === activeId}
              icon={s.icon}
              title={s.name}
              subtitle={s.subtitle}
              onClick={() => setActiveId(s.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
