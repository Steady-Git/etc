import { useState } from "react";

const HEAVENLY_STEMS = ["갑(甲)", "을(乙)", "병(丙)", "정(丁)", "무(戊)", "기(己)", "경(庚)", "신(辛)", "임(壬)", "계(癸)"];
const EARTHLY_BRANCHES = ["자(子)", "축(丑)", "인(寅)", "묘(卯)", "진(辰)", "사(巳)", "오(午)", "미(未)", "신(申)", "유(酉)", "술(戌)", "해(亥)"];
const FIVE_ELEMENTS = ["목(木)", "화(火)", "토(土)", "금(金)", "수(水)"];
const STEM_ELEMENTS = ["목", "목", "화", "화", "토", "토", "금", "금", "수", "수"];
const BRANCH_ELEMENTS = ["수", "토", "목", "목", "토", "화", "화", "토", "금", "금", "토", "수"];
const STEM_YIN_YANG = ["양", "음", "양", "음", "양", "음", "양", "음", "양", "음"];
const ZOD_ANIMALS = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
const ZOD_EMOJI = ["🐭", "🐮", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑", "🐵", "🐔", "🐶", "🐗"];

const HOUR_BRANCHES = [
  { label: "자시 (23:00~00:59)", branch: 0 },
  { label: "축시 (01:00~02:59)", branch: 1 },
  { label: "인시 (03:00~04:59)", branch: 2 },
  { label: "묘시 (05:00~06:59)", branch: 3 },
  { label: "진시 (07:00~08:59)", branch: 4 },
  { label: "사시 (09:00~10:59)", branch: 5 },
  { label: "오시 (11:00~12:59)", branch: 6 },
  { label: "미시 (13:00~14:59)", branch: 7 },
  { label: "신시 (15:00~16:59)", branch: 8 },
  { label: "유시 (17:00~18:59)", branch: 9 },
  { label: "술시 (19:00~20:59)", branch: 10 },
  { label: "해시 (21:00~22:59)", branch: 11 },
];

function getStemIndex(year) {
  return (year - 4) % 10;
}
function getBranchIndex(year) {
  return (year - 4) % 12;
}
function getMonthStem(yearStem, month) {
  const base = ((yearStem % 5) * 2 + month + 1) % 10;
  return base;
}
function getMonthBranch(month) {
  const map = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1];
  return map[month - 1];
}
function getDayStemBranch(year, month, day) {
  const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day - 1524;
  const stem = (jd + 9) % 10;
  const branch = (jd + 1) % 12;
  return { stem, branch };
}
function getHourStem(dayStem, hourBranch) {
  return (dayStem % 5 * 2 + hourBranch) % 10;
}

const INTERPRETATIONS = {
  목: { desc: "성장, 창의성, 인자함", color: "#4caf50", season: "봄", dir: "동쪽" },
  화: { desc: "열정, 빛, 예의", color: "#f44336", season: "여름", dir: "남쪽" },
  토: { desc: "중용, 신뢰, 안정", color: "#ff9800", season: "사계절", dir: "중앙" },
  금: { desc: "결단력, 의리, 청렴", color: "#9e9e9e", season: "가을", dir: "서쪽" },
  수: { desc: "지혜, 유연함, 생명력", color: "#2196f3", season: "겨울", dir: "북쪽" },
};

const PILLAR_INTERP = {
  년주: "조상·부모의 인연, 어린 시절 환경, 사회적 기반을 나타냅니다.",
  월주: "부모·형제와의 인연, 청년기의 기운과 직업적 재능을 상징합니다.",
  일주: "본인의 기질과 배우자 인연, 중년기의 핵심 에너지입니다.",
  시주: "자녀·후배와의 인연, 노년기의 결실과 말년 운을 담습니다.",
};

function ElementDot({ el }) {
  const colors = { 목: "#4caf50", 화: "#f44336", 토: "#ff9800", 금: "#b0b0b0", 수: "#2196f3" };
  return (
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: colors[el] || "#888",
        marginRight: 4,
        verticalAlign: "middle",
      }}
    />
  );
}

function PillarCard({ title, stem, branch, stemIdx, branchIdx, interp }) {
  const stemEl = STEM_ELEMENTS[stemIdx];
  const branchEl = BRANCH_ELEMENTS[branchIdx];
  const yinYang = STEM_YIN_YANG[stemIdx];
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16,
        padding: "20px 16px",
        flex: 1,
        minWidth: 140,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${INTERPRETATIONS[stemEl]?.color || "#888"}, ${INTERPRETATIONS[branchEl]?.color || "#888"})`,
        }}
      />
      <div style={{ fontSize: 11, letterSpacing: 3, color: "#aaa", textTransform: "uppercase" }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Noto Serif KR', serif", color: "#f0e6c8", letterSpacing: 2 }}>
          {stem}
        </div>
        <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.2)" }} />
        <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Noto Serif KR', serif", color: "#c8dff0", letterSpacing: 2 }}>
          {branch}
        </div>
      </div>
      <div style={{ fontSize: 12, color: "#bbb", textAlign: "center", lineHeight: 1.6 }}>
        <div>
          <ElementDot el={stemEl} />
          <span style={{ color: INTERPRETATIONS[stemEl]?.color }}>{stemEl}</span>
          {" "}· {yinYang}
        </div>
        <div>
          <ElementDot el={branchEl} />
          <span style={{ color: INTERPRETATIONS[branchEl]?.color }}>{branchEl}</span>
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#888", textAlign: "center", lineHeight: 1.5, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 8 }}>
        {interp}
      </div>
    </div>
  );
}

function ElementBar({ counts }) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const order = ["목", "화", "토", "금", "수"];
  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", height: 16, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
        {order.map((el) => (
          <div
            key={el}
            style={{
              flex: counts[el] || 0,
              background: INTERPRETATIONS[el]?.color,
              transition: "flex 0.5s ease",
              minWidth: counts[el] ? 2 : 0,
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {order.map((el) => (
          <div key={el} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            <ElementDot el={el} />
            <span style={{ color: INTERPRETATIONS[el]?.color, fontWeight: 600 }}>{el}</span>
            <span style={{ color: "#888" }}>{counts[el] || 0}개</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getPersonality(dominant, secondary) {
  const map = {
    목: "창의적이고 진취적인 성격으로, 새로운 도전을 즐깁니다. 리더십이 강하고 성장 지향적입니다.",
    화: "열정과 카리스마가 넘치며, 사람들을 이끄는 매력이 있습니다. 빠른 판단력을 가졌습니다.",
    토: "신중하고 안정적이며, 중재자 역할을 잘합니다. 신뢰받는 인품의 소유자입니다.",
    금: "원칙적이고 의지가 강합니다. 완벽주의적 경향이 있으며 의리를 중시합니다.",
    수: "지혜롭고 유연한 사고를 가졌습니다. 적응력이 뛰어나고 직관이 발달했습니다.",
  };
  return map[dominant] || "균형 잡힌 기운을 지니고 있습니다.";
}

export default function SajuApp() {
  const [form, setForm] = useState({ year: "", month: "", day: "", hour: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiReading, setAiReading] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");

  function calculate() {
    const { year, month, day, hour } = form;
    if (!year || !month || !day || hour === "") {
      setError("생년월일시를 모두 입력해 주세요.");
      return;
    }
    setError("");
    setAiReading("");
    const y = parseInt(year), m = parseInt(month), d = parseInt(day), h = parseInt(hour);

    const yearStemIdx = ((y - 4) % 10 + 10) % 10;
    const yearBranchIdx = ((y - 4) % 12 + 12) % 12;
    const monthStemIdx = ((yearStemIdx % 5) * 2 + m + 1) % 10;
    const monthBranchIdx = getMonthBranch(m);
    const { stem: dayStemIdx, branch: dayBranchIdx } = getDayStemBranch(y, m, d);
    const hourStemIdx = getHourStem(dayStemIdx, h);
    const hourBranchIdx = h;

    const pillars = [
      { title: "년주(年柱)", stemIdx: yearStemIdx, branchIdx: yearBranchIdx },
      { title: "월주(月柱)", stemIdx: monthStemIdx, branchIdx: monthBranchIdx },
      { title: "일주(日柱)", stemIdx: dayStemIdx, branchIdx: dayBranchIdx },
      { title: "시주(時柱)", stemIdx: hourStemIdx, branchIdx: hourBranchIdx },
    ];

    const elementCounts = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
    pillars.forEach(({ stemIdx, branchIdx }) => {
      elementCounts[STEM_ELEMENTS[stemIdx]]++;
      elementCounts[BRANCH_ELEMENTS[branchIdx]]++;
    });

    const sorted = Object.entries(elementCounts).sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0][0];
    const secondary = sorted[1][0];
    const zodiac = ZOD_ANIMALS[yearBranchIdx];
    const zodiacEmoji = ZOD_EMOJI[yearBranchIdx];

    setResult({ pillars, elementCounts, dominant, secondary, zodiac, zodiacEmoji, year: y, month: m, day: d });
  }

  async function getAiReading() {
    if (!result) return;
    setAiLoading(true);
    setAiReading("");
    const { pillars, elementCounts, dominant, zodiac } = result;
    const pillarDesc = pillars.map((p, i) => {
      const names = ["년주", "월주", "일주", "시주"];
      return `${names[i]}: 천간 ${HEAVENLY_STEMS[p.stemIdx]} (${STEM_ELEMENTS[p.stemIdx]}), 지지 ${EARTHLY_BRANCHES[p.branchIdx]} (${BRANCH_ELEMENTS[p.branchIdx]})`;
    }).join("\n");
    const elemDesc = Object.entries(elementCounts).map(([k, v]) => `${k}: ${v}개`).join(", ");

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `당신은 전통 사주명리학에 정통한 역술가입니다. 아래 사주팔자를 분석하여 따뜻하고 통찰력 있는 해석을 한국어로 제공해 주세요.

사주팔자:
${pillarDesc}

오행 분포: ${elemDesc}
주 띠: ${zodiac}

다음 항목들을 자연스러운 문단 형식으로 해석해 주세요:
1. 전체적인 기운과 성격의 특징
2. 강점과 타고난 재능
3. 주의해야 할 점이나 보완해야 할 부분
4. 인간관계 및 대인운
5. 직업·재물운에 대한 조언

따뜻하고 긍정적인 톤을 유지하되, 진솔한 조언을 담아 400자 내외로 작성해 주세요.`
          }]
        })
      });
      const data = await response.json();
      const text = data.content?.map(i => i.text || "").join("\n") || "해석을 가져오지 못했습니다.";
      setAiReading(text);
    } catch (e) {
      setAiReading("AI 해석을 불러오는 중 오류가 발생했습니다.");
    }
    setAiLoading(false);
  }

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d0d1a 0%, #0a0f1e 50%, #0d1220 100%)",
      fontFamily: "'Noto Sans KR', sans-serif",
      color: "#e0d5c0",
      padding: "40px 20px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        select, input {
          background: rgba(255,255,255,0.05) !important;
          border: 1px solid rgba(255,255,255,0.12) !important;
          color: #e0d5c0 !important;
          border-radius: 10px !important;
          padding: 10px 14px !important;
          font-size: 15px !important;
          font-family: 'Noto Sans KR', sans-serif !important;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
          -webkit-appearance: none;
        }
        select:focus, input:focus {
          border-color: rgba(180,150,90,0.5) !important;
        }
        select option { background: #1a1a2e; color: #e0d5c0; }
        .stars {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; overflow: hidden; z-index: 0;
        }
        .star {
          position: absolute; width: 2px; height: 2px;
          background: white; border-radius: 50%;
          animation: twinkle 3s infinite alternate;
        }
        @keyframes twinkle { from { opacity: 0.2; } to { opacity: 0.9; } }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .result-card { animation: fadeInUp 0.6s ease forwards; }
        .ai-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(180,150,90,0.3) !important; }
        .calc-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(100,120,200,0.3) !important; }
      `}</style>

      {/* Stars */}
      <div className="stars">
        {Array.from({ length: 60 }, (_, i) => (
          <div key={i} className="star" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
            opacity: Math.random() * 0.7 + 0.1,
          }} />
        ))}
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>☯</div>
          <h1 style={{
            fontFamily: "'Noto Serif KR', serif",
            fontSize: "clamp(28px, 6vw, 42px)",
            fontWeight: 700,
            margin: "0 0 8px",
            background: "linear-gradient(135deg, #d4a94a, #f0e6c8, #d4a94a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: 4,
          }}>사주팔자</h1>
          <p style={{ color: "#7a8a9a", fontSize: 14, letterSpacing: 2, margin: 0 }}>
            四柱八字 · 운명의 여덟 글자
          </p>
        </div>

        {/* Input Form */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding: "32px 28px",
          marginBottom: 28,
          backdropFilter: "blur(10px)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#8a9aa8", marginBottom: 6, letterSpacing: 1 }}>출생 연도</label>
              <input
                type="number"
                placeholder="예: 1990"
                value={form.year}
                onChange={e => setForm(f => ({ ...f, year: e.target.value }))}
                min="1900" max="2099"
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#8a9aa8", marginBottom: 6, letterSpacing: 1 }}>월</label>
              <select value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))}>
                <option value="">월 선택</option>
                {months.map(m => <option key={m} value={m}>{m}월</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#8a9aa8", marginBottom: 6, letterSpacing: 1 }}>일</label>
              <select value={form.day} onChange={e => setForm(f => ({ ...f, day: e.target.value }))}>
                <option value="">일 선택</option>
                {days.map(d => <option key={d} value={d}>{d}일</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, color: "#8a9aa8", marginBottom: 6, letterSpacing: 1 }}>시(時)</label>
              <select value={form.hour} onChange={e => setForm(f => ({ ...f, hour: e.target.value }))}>
                <option value="">시 선택</option>
                {HOUR_BRANCHES.map((hb, i) => <option key={i} value={hb.branch}>{hb.label}</option>)}
              </select>
            </div>
          </div>
          {error && <div style={{ color: "#e57373", fontSize: 13, marginBottom: 12 }}>{error}</div>}
          <button
            className="calc-btn"
            onClick={calculate}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #2a3a6a, #3a4a8a)",
              border: "1px solid rgba(100,130,200,0.3)",
              borderRadius: 12,
              color: "#c8d8f0",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: 2,
              transition: "all 0.2s",
              fontFamily: "'Noto Sans KR', sans-serif",
            }}>
            사주 풀기 ✦
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="result-card">
            {/* Zodiac Banner */}
            <div style={{
              textAlign: "center",
              background: "rgba(212,169,74,0.08)",
              border: "1px solid rgba(212,169,74,0.2)",
              borderRadius: 16,
              padding: "20px",
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 40 }}>{result.zodiacEmoji}</div>
              <div style={{ fontFamily: "'Noto Serif KR', serif", fontSize: 20, color: "#d4a94a", marginTop: 4 }}>
                {result.year}년생 · {result.zodiac}띠
              </div>
              <div style={{ fontSize: 13, color: "#7a8a9a", marginTop: 4 }}>
                주 오행: <span style={{ color: INTERPRETATIONS[result.dominant]?.color, fontWeight: 600 }}>{result.dominant}</span>
                {" "}· {INTERPRETATIONS[result.dominant]?.desc}
              </div>
            </div>

            {/* Four Pillars */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              {result.pillars.map((p, i) => {
                const keys = ["년주", "월주", "일주", "시주"];
                return (
                  <PillarCard
                    key={i}
                    title={keys[i]}
                    stem={HEAVENLY_STEMS[p.stemIdx]}
                    branch={EARTHLY_BRANCHES[p.branchIdx]}
                    stemIdx={p.stemIdx}
                    branchIdx={p.branchIdx}
                    interp={PILLAR_INTERP[keys[i]]}
                  />
                );
              })}
            </div>

            {/* Element Distribution */}
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "24px",
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 13, letterSpacing: 2, color: "#8a9aa8", marginBottom: 16 }}>오행 분포</div>
              <ElementBar counts={result.elementCounts} />
              <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10, fontSize: 14, color: "#b8c8d0", lineHeight: 1.7 }}>
                {getPersonality(result.dominant, result.secondary)}
              </div>
            </div>

            {/* AI Reading */}
            <div style={{
              background: "rgba(212,169,74,0.05)",
              border: "1px solid rgba(212,169,74,0.15)",
              borderRadius: 16,
              padding: "24px",
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 13, letterSpacing: 2, color: "#a89060", marginBottom: 16 }}>AI 역술 해석</div>
              {aiReading ? (
                <div style={{ fontSize: 14, color: "#c8baa0", lineHeight: 1.85, whiteSpace: "pre-wrap" }}>
                  {aiReading}
                </div>
              ) : (
                <div style={{ color: "#6a7a88", fontSize: 14, marginBottom: 16 }}>
                  AI가 사주팔자를 깊이 분석하여 맞춤형 해석을 제공합니다.
                </div>
              )}
              <button
                className="ai-btn"
                onClick={getAiReading}
                disabled={aiLoading}
                style={{
                  marginTop: aiReading ? 16 : 0,
                  padding: "12px 24px",
                  background: aiLoading ? "rgba(180,150,90,0.1)" : "linear-gradient(135deg, #5a3a0a, #8a5a1a)",
                  border: "1px solid rgba(212,169,74,0.3)",
                  borderRadius: 10,
                  color: aiLoading ? "#888" : "#f0d080",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: aiLoading ? "not-allowed" : "pointer",
                  letterSpacing: 1,
                  transition: "all 0.2s",
                  fontFamily: "'Noto Sans KR', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                {aiLoading ? (
                  <>
                    <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>✦</span>
                    해석 중...
                  </>
                ) : aiReading ? "다시 해석받기 ✦" : "AI 해석 받기 ✦"}
              </button>
            </div>

            <div style={{ textAlign: "center", fontSize: 12, color: "#3a4a5a", letterSpacing: 1 }}>
              ※ 사주는 참고용이며, 실제 인생의 모든 것을 결정하지 않습니다.
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
