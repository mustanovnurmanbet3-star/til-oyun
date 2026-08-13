import React, { useState, useEffect, useMemo, useRef } from "react";

// ---------- Data: word bank grouped by category ----------
const WORD_BANK = {
  "Үй-бүлө": [
    { ky: "апа", en: "mother", emoji: "👩" },
    { ky: "ата", en: "father", emoji: "👨" },
    { ky: "бала", en: "child", emoji: "🧒" },
    { ky: "эже", en: "older sister", emoji: "👧" },
    { ky: "ага", en: "older brother", emoji: "🧑" },
    { ky: "чоң ата", en: "grandfather", emoji: "👴" },
    { ky: "чоң эне", en: "grandmother", emoji: "👵" },
    { ky: "бөбөк", en: "baby", emoji: "👶" },
  ],
  "Жаныбарлар": [
    { ky: "жылкы", en: "horse", emoji: "🐴" },
    { ky: "ит", en: "dog", emoji: "🐕" },
    { ky: "мышык", en: "cat", emoji: "🐈" },
    { ky: "кой", en: "sheep", emoji: "🐑" },
    { ky: "уй", en: "cow", emoji: "🐄" },
    { ky: "төө", en: "camel", emoji: "🐫" },
    { ky: "бүркүт", en: "eagle", emoji: "🦅" },
    { ky: "коён", en: "rabbit", emoji: "🐇" },
  ],
  "Тамак-аш": [
    { ky: "нан", en: "bread", emoji: "🍞" },
    { ky: "эт", en: "meat", emoji: "🍖" },
    { ky: "сүт", en: "milk", emoji: "🥛" },
    { ky: "алма", en: "apple", emoji: "🍎" },
    { ky: "чай", en: "tea", emoji: "🍵" },
    { ky: "күрүч", en: "rice", emoji: "🍚" },
    { ky: "бал", en: "honey", emoji: "🍯" },
    { ky: "жумуртка", en: "egg", emoji: "🥚" },
  ],
  "Түстөр": [
    { ky: "кызыл", en: "red", emoji: "🔴" },
    { ky: "көк", en: "blue", emoji: "🔵" },
    { ky: "сары", en: "yellow", emoji: "🟡" },
    { ky: "жашыл", en: "green", emoji: "🟢" },
    { ky: "ак", en: "white", emoji: "⚪" },
    { ky: "кара", en: "black", emoji: "⚫" },
  ],
  "Сандар": [
    { ky: "бир", en: "one", emoji: "1️⃣" },
    { ky: "эки", en: "two", emoji: "2️⃣" },
    { ky: "үч", en: "three", emoji: "3️⃣" },
    { ky: "төрт", en: "four", emoji: "4️⃣" },
    { ky: "беш", en: "five", emoji: "5️⃣" },
    { ky: "он", en: "ten", emoji: "🔟" },
  ],
  "Табият": [
    { ky: "тоо", en: "mountain", emoji: "⛰️" },
    { ky: "суу", en: "water", emoji: "💧" },
    { ky: "күн", en: "sun", emoji: "☀️" },
    { ky: "ай", en: "moon", emoji: "🌙" },
    { ky: "жылдыз", en: "star", emoji: "⭐" },
    { ky: "тал", en: "willow tree", emoji: "🌳" },
    { ky: "көл", en: "lake", emoji: "🏞️" },
    { ky: "боз үй", en: "yurt", emoji: "⛺" },
  ],
};

const ALL_WORDS = Object.values(WORD_BANK).flat();
const CATEGORIES = Object.keys(WORD_BANK);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- Tunduk (yurt-crown) decorative SVG ----------
function Tunduk({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="2.5" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        const x1 = 50 + 12 * Math.cos(angle);
        const y1 = 50 + 12 * Math.sin(angle);
        const x2 = 50 + 44 * Math.cos(angle);
        const y2 = 50 + 44 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2.5" />;
      })}
    </svg>
  );
}

// ---------- Score pill ----------
function ScorePill({ score, total }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-[#2B3A55] text-[#FBF3E7] px-4 py-1.5 text-sm font-semibold tracking-wide shadow-md">
      <span className="text-[#F2A93B]">★</span>
      <span>{score} / {total}</span>
    </div>
  );
}

// ---------- Home hub ----------
function Home({ onSelect, best }) {
  const games = [
    {
      id: "flash",
      title: "Флэш-карталар",
      subtitle: "Сөздөрдү карап, айланта бас",
      icon: "🃏",
    },
    {
      id: "quiz",
      title: "Тандоо тести",
      subtitle: "Туура котормону тап",
      icon: "🎯",
    },
    {
      id: "match",
      title: "Дал келтир",
      subtitle: "Кыргызча менен англисчени бирикт",
      icon: "🧩",
    },
    {
      id: "listen",
      title: "Тез арада",
      subtitle: "Уккан боюнча жазуу — жакында",
      icon: "🎧",
      disabled: true,
    },
  ];
  return (
    <div className="max-w-3xl mx-auto px-5 pb-16">
      <header className="pt-10 pb-8 relative">
        <Tunduk className="w-16 h-16 text-[#F2A93B] mb-4" />
        <h1 className="font-serif text-4xl sm:text-5xl text-[#2B3A55] leading-tight">
          Тил <span className="text-[#B33A3A]">Көпүрөсү</span>
        </h1>
        <p className="mt-3 text-[#5b5346] text-base sm:text-lg max-w-lg">
          Кыргыз тилинен англис тилине — оюн аркылуу үйрөн. Ар бир сөз бир кадам,
          ар бир оюн — жаңы көпүрө.
        </p>
        {best > 0 && (
          <div className="mt-4">
            <ScorePill score={best} total={best} />
          </div>
        )}
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {games.map((g) => (
          <button
            key={g.id}
            disabled={g.disabled}
            onClick={() => !g.disabled && onSelect(g.id)}
            className={`text-left rounded-2xl border-2 p-5 transition-all
              ${g.disabled
                ? "border-[#e3d9c6] bg-[#f4efe4] opacity-60 cursor-not-allowed"
                : "border-[#2B3A55]/15 bg-[#FBF3E7] hover:border-[#B33A3A] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
              }`}
          >
            <div className="text-3xl mb-3">{g.icon}</div>
            <div className="font-serif text-xl text-[#2B3A55]">{g.title}</div>
            <div className="text-sm text-[#7a7062] mt-1">{g.subtitle}</div>
          </button>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-3 text-[#7a7062] text-sm">
        <div className="h-px flex-1 bg-[#e3d9c6]" />
        <span>{ALL_WORDS.length} сөз · {CATEGORIES.length} категория</span>
        <div className="h-px flex-1 bg-[#e3d9c6]" />
      </div>
    </div>
  );
}

// ---------- Flashcards game ----------
function FlashGame({ onExit }) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const words = WORD_BANK[category];
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(() => new Set());

  const word = words[idx];

  function next(dir) {
    setFlipped(false);
    setTimeout(() => {
      setIdx((i) => (i + dir + words.length) % words.length);
    }, 120);
  }

  function markKnown() {
    setKnown((prev) => new Set(prev).add(`${category}-${idx}`));
    next(1);
  }

  useEffect(() => {
    setIdx(0);
    setFlipped(false);
  }, [category]);

  return (
    <div className="max-w-xl mx-auto px-5 pb-16">
      <GameHeader title="Флэш-карталар" onExit={onExit} />

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
              ${category === c
                ? "bg-[#B33A3A] text-white border-[#B33A3A]"
                : "bg-transparent text-[#5b5346] border-[#e3d9c6] hover:border-[#B33A3A]"
              }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div
        className="relative mx-auto h-64 sm:h-72 cursor-pointer select-none"
        style={{ perspective: "1200px" }}
        onClick={() => setFlipped((f) => !f)}
      >
        <div
          className="absolute inset-0 rounded-3xl transition-transform duration-500"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* front: Kyrgyz */}
          <div
            className="absolute inset-0 rounded-3xl bg-[#2B3A55] text-[#FBF3E7] flex flex-col items-center justify-center gap-4 shadow-xl"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="text-5xl">{word.emoji}</div>
            <div className="font-serif text-3xl">{word.ky}</div>
            <div className="text-xs text-[#F2A93B] tracking-wide uppercase">Басып, которгонун көр</div>
          </div>
          {/* back: English */}
          <div
            className="absolute inset-0 rounded-3xl bg-[#F2A93B] text-[#2B3A55] flex flex-col items-center justify-center gap-4 shadow-xl"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="text-5xl">{word.emoji}</div>
            <div className="font-serif text-3xl">{word.en}</div>
            <div className="text-sm">{word.ky}</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => next(-1)}
          className="px-4 py-2 rounded-full border border-[#e3d9c6] text-[#2B3A55] hover:border-[#B33A3A] transition-colors"
        >
          ← Мурунку
        </button>
        <div className="text-sm text-[#7a7062]">{idx + 1} / {words.length}</div>
        <button
          onClick={() => next(1)}
          className="px-4 py-2 rounded-full border border-[#e3d9c6] text-[#2B3A55] hover:border-[#B33A3A] transition-colors"
        >
          Кийинки →
        </button>
      </div>

      <button
        onClick={markKnown}
        className="mt-4 w-full py-3 rounded-2xl bg-[#4A7C59] text-white font-semibold hover:brightness-110 transition-all"
      >
        Билем ✓ ({known.size} сөз үйрөндүм)
      </button>
    </div>
  );
}

// ---------- Quiz game ----------
function QuizGame({ onExit, onFinish }) {
  const rounds = useMemo(() => {
    const pool = shuffle(ALL_WORDS).slice(0, 10);
    return pool.map((w) => {
      const distractors = shuffle(ALL_WORDS.filter((x) => x.en !== w.en)).slice(0, 3);
      const options = shuffle([w, ...distractors]);
      return { word: w, options };
    });
  }, []);

  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);

  const round = rounds[step];

  function choose(opt) {
    if (picked) return;
    setPicked(opt);
    const correct = opt.en === round.word.en;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (step + 1 < rounds.length) {
        setStep((s) => s + 1);
        setPicked(null);
      } else {
        setDone(true);
      }
    }, 700);
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-5 pb-16">
        <GameHeader title="Тандоо тести" onExit={onExit} />
        <div className="rounded-3xl bg-[#2B3A55] text-[#FBF3E7] p-10 text-center mt-6">
          <Tunduk className="w-12 h-12 text-[#F2A93B] mx-auto mb-4" />
          <div className="font-serif text-3xl mb-2">Натыйжа: {score} / {rounds.length}</div>
          <p className="text-[#c9c2b0] mb-6">
            {score === rounds.length
              ? "Мыкты! Баарын туура таптың."
              : score >= rounds.length * 0.6
              ? "Жакшы жыйынтык! Улантсаң, дагы жакшы болот."
              : "Кайра машыктан, сен жасай аласың!"}
          </p>
          <button
            onClick={() => { onFinish(score); }}
            className="px-6 py-3 rounded-full bg-[#F2A93B] text-[#2B3A55] font-semibold hover:brightness-105"
          >
            Башкы бетке кайт
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-5 pb-16">
      <GameHeader title="Тандоо тести" onExit={onExit} />
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-[#7a7062]">Суроо {step + 1} / {rounds.length}</div>
        <ScorePill score={score} total={rounds.length} />
      </div>

      <div className="w-full h-2 rounded-full bg-[#e3d9c6] mb-8 overflow-hidden">
        <div
          className="h-full bg-[#B33A3A] transition-all duration-300"
          style={{ width: `${(step / rounds.length) * 100}%` }}
        />
      </div>

      <div className="text-center mb-8">
        <div className="text-6xl mb-3">{round.word.emoji}</div>
        <div className="font-serif text-3xl text-[#2B3A55]">{round.word.ky}</div>
        <div className="text-sm text-[#7a7062] mt-1">бул сөздүн англисчесин тандаңыз</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {round.options.map((opt, i) => {
          const isCorrect = opt.en === round.word.en;
          const isPicked = picked === opt;
          let style = "border-[#e3d9c6] bg-[#FBF3E7] text-[#2B3A55] hover:border-[#2B3A55]";
          if (picked) {
            if (isCorrect) style = "border-[#4A7C59] bg-[#4A7C59] text-white";
            else if (isPicked) style = "border-[#B33A3A] bg-[#B33A3A] text-white";
            else style = "border-[#e3d9c6] bg-[#FBF3E7] text-[#b3ac9c] opacity-60";
          }
          return (
            <button
              key={i}
              onClick={() => choose(opt)}
              className={`rounded-2xl border-2 py-4 px-3 font-medium transition-all ${style}`}
            >
              {opt.en}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Matching game ----------
function MatchGame({ onExit }) {
  const words = useMemo(() => shuffle(ALL_WORDS).slice(0, 6), []);
  const leftItems = useMemo(() => shuffle(words.map((w) => ({ key: w.ky, text: w.ky, en: w.en }))), [words]);
  const rightItems = useMemo(() => shuffle(words.map((w) => ({ key: w.ky, text: w.en, en: w.en }))), [words]);

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [solved, setSolved] = useState(() => new Set());
  const [wrongFlash, setWrongFlash] = useState(null);
  const [moves, setMoves] = useState(0);

  function pickLeft(item) {
    if (solved.has(item.key)) return;
    setSelectedLeft(item);
  }

  function pickRight(item) {
    if (!selectedLeft || solved.has(item.key)) return;
    setMoves((m) => m + 1);
    if (selectedLeft.key === item.key) {
      setSolved((prev) => new Set(prev).add(item.key));
      setSelectedLeft(null);
    } else {
      setWrongFlash(item.key);
      setTimeout(() => setWrongFlash(null), 400);
      setSelectedLeft(null);
    }
  }

  const finished = solved.size === words.length;

  return (
    <div className="max-w-xl mx-auto px-5 pb-16">
      <GameHeader title="Дал келтир" onExit={onExit} />
      <p className="text-sm text-[#7a7062] mb-5">
        Кыргызча сөздү тандап, андан кийин туура англисче которомосун бас.
      </p>

      {finished ? (
        <div className="rounded-3xl bg-[#4A7C59] text-white p-10 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <div className="font-serif text-2xl mb-2">Баарын дал келтирдиң!</div>
          <p className="text-[#e3f0e6] mb-5">{moves} аракет менен аяктадың.</p>
          <button
            onClick={onExit}
            className="px-6 py-3 rounded-full bg-white text-[#2B3A55] font-semibold hover:brightness-95"
          >
            Башкы бетке кайт
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            {leftItems.map((item) => {
              const isSolved = solved.has(item.key);
              const isSelected = selectedLeft?.key === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => pickLeft(item)}
                  disabled={isSolved}
                  className={`rounded-xl border-2 py-3 px-3 text-sm font-medium transition-all text-left
                    ${isSolved
                      ? "border-[#4A7C59] bg-[#e3f0e6] text-[#4A7C59] opacity-70"
                      : isSelected
                      ? "border-[#B33A3A] bg-[#B33A3A] text-white"
                      : "border-[#e3d9c6] bg-[#FBF3E7] text-[#2B3A55] hover:border-[#2B3A55]"
                    }`}
                >
                  {item.text}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-3">
            {rightItems.map((item) => {
              const isSolved = solved.has(item.key);
              const isWrong = wrongFlash === item.key;
              return (
                <button
                  key={item.key + "-r"}
                  onClick={() => pickRight(item)}
                  disabled={isSolved}
                  className={`rounded-xl border-2 py-3 px-3 text-sm font-medium transition-all text-left
                    ${isSolved
                      ? "border-[#4A7C59] bg-[#e3f0e6] text-[#4A7C59] opacity-70"
                      : isWrong
                      ? "border-[#B33A3A] bg-[#fbe4e4] text-[#B33A3A]"
                      : "border-[#e3d9c6] bg-[#FBF3E7] text-[#2B3A55] hover:border-[#2B3A55]"
                    }`}
                >
                  {item.text}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function GameHeader({ title, onExit }) {
  return (
    <div className="flex items-center justify-between pt-8 pb-6">
      <button
        onClick={onExit}
        className="text-sm text-[#5b5346] hover:text-[#B33A3A] transition-colors flex items-center gap-1"
      >
        ← Башкы бет
      </button>
      <div className="font-serif text-lg text-[#2B3A55]">{title}</div>
      <div className="w-16" />
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [best, setBest] = useState(0);

  return (
    <div
      className="min-h-screen"
      style={{
        background: "#FBF3E7",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      <style>{`
        .font-serif { font-family: 'Georgia', 'Times New Roman', serif; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      `}</style>
      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        {screen === "home" && <Home onSelect={setScreen} best={best} />}
        {screen === "flash" && <FlashGame onExit={() => setScreen("home")} />}
        {screen === "quiz" && (
          <QuizGame
            onExit={() => setScreen("home")}
            onFinish={(score) => {
              setBest((b) => Math.max(b, score));
              setScreen("home");
            }}
          />
        )}
        {screen === "match" && <MatchGame onExit={() => setScreen("home")} />}
      </div>
    </div>
  );
}
