const GOLD = "#d4af37";

function Star({ on }) {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24">
      <path
        d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"
        fill={on ? GOLD : "#333"}
      />
    </svg>
  );
}

export default function Badges({ me }) {
  if (!me || !me.state) return null;
  const s = me.state;
  const done = s.done || [];
  const hist = s.history || [];
  const iv = s.iv || [];
  const graph = me.graph || [];
  const coins = me.user?.coins || 0;
  const minutes = s.minutes || 0;
  const rec = hist.filter((h) => h.retest && h.correct && h.diag?.reasoningOk).length;
  const ivAvg = iv.length ? iv.reduce((a, x) => a + x.score, 0) / iv.length : 0;

  const courseDone = [1, 2, 3, 4].some((c) => {
    const n = graph.filter((x) => x.course === c);
    return n.length > 0 && n.every((x) => x.mastery >= 80);
  });

  const BADGES = [
    { n: "First Step", m: "Nalla aarambam! Mudhal lesson mudichitteenga.", ok: done.length >= 1 },
    { n: "Quick Learner", m: "Semma speed! Seekiram niraya lessons kathukitteenga.", ok: done.length >= 3 },
    { n: "Speed Achiever", m: "Kammi neram-la nalla mastery. Superb!", ok: me.overall >= 50 && minutes > 0 && minutes <= 30 },
    { n: "Course Finisher", m: "Congratulations! Oru course-a mudichitteenga.", ok: courseDone },
    { n: "Fast Finisher", m: "Course-a seekiram mudichitteenga. Vera level!", ok: courseDone && minutes <= 60 },
    { n: "Quiz Starter", m: "Mudhal quiz try pannitteenga. Continue pannunga!", ok: hist.length >= 1 },
    { n: "Quiz Champion", m: "10 quiz attempts. Unga muyarchi paaratta thakkadhu.", ok: hist.length >= 10 },
    { n: "Mistake Fixer", m: "Thappa purinjukitta idathai sari pannitteenga.", ok: rec >= 1 },
    { n: "Comeback Star", m: "3 misconceptions recover pannitteenga. Great!", ok: rec >= 3 },
    { n: "Daily Doer", m: "Oru naal-la 2 tasks mudichitteenga.", ok: (s.tasks || 0) >= 2 },
    { n: "Coin Collector", m: "100 coins sethitteenga.", ok: coins >= 100 },
    { n: "Coin Master", m: "1000 coins! Adutha course-a unlock pannalaam.", ok: coins >= 1000 },
    { n: "Interview Ready", m: "Mock interview attend pannitteenga. Thairiyam!", ok: iv.length >= 1 },
    { n: "Interview Pro", m: "Interview average 7+. Excellent!", ok: ivAvg >= 7 },
    { n: "Mastery 50", m: "Overall mastery 50% thaandiyaachu.", ok: me.overall >= 50 },
    { n: "Mastery 80", m: "Overall mastery 80%. Neenga oru star!", ok: me.overall >= 80 },
  ];

  const got = BADGES.filter((b) => b.ok).length;

  return (
    <div className="card">
      <h3>
        Achievements <span className="tag">{got}/{BADGES.length}</span>
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: 12 }}>
        {BADGES.map((b) => (
          <div
            key={b.n}
            style={{
              display: "flex", gap: 10, padding: 12, borderRadius: 12,
              border: `1px solid ${b.ok ? GOLD : "#2a2a2a"}`,
              background: b.ok ? "#1a1608" : "#0d0d0d",
              opacity: b.ok ? 1 : 0.5,
            }}
          >
            <Star on={b.ok} />
            <div>
              <b style={{ color: b.ok ? GOLD : "#888" }}>{b.n}</b>
              <br />
              <small>{b.ok ? b.m : "Locked"}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
