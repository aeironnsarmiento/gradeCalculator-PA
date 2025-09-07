import React, { useMemo, useState } from "react";
import "./App.css";

// ---- Utility functions -----------------------------------------------------
const currency = (n) => (isFinite(n) ? n.toFixed(2) : "0.00");
const pct = (n) => (isFinite(n) ? n.toFixed(2) + "%" : "0.00%");

// ---- Data model ------------------------------------------------------------
function cloneSections(s) {
  return JSON.parse(JSON.stringify(s));
}

// Exams — 4×50 pts
const EXAMS = {
  id: "exams",
  title: "Exams (part of 80% bucket)",
  help: "Exams + Quizzes together are 80% of your final grade. Exams total 200 pts.",
  rows: [
    { id: "exam1", label: "Exam 1", earned: "", possible: 50 },
    { id: "exam2", label: "Exam 2", earned: "", possible: 50 },
    { id: "exam3", label: "Exam 3", earned: "", possible: 50 },
    { id: "final", label: "Final Exam", earned: "", possible: 50 },
  ],
};

// Quizzes — per your list (total 50 pts)
const QUIZZES = {
  id: "quizzes",
  title: "Quizzes (part of 80% bucket)",
  help: "Quizzes total 50 pts and live in the same 80% bucket as exams.",
  rows: [
    {
      id: "medterm",
      label: "Medical Terminology Quiz",
      earned: 20,
      possible: 20,
    },
    { id: "derm", label: "H&P Derm Quiz", earned: 4.5, possible: 5 },
    { id: "neuro", label: "H&P Neuro Quiz", earned: "", possible: 4 },
    { id: "heent", label: "H&P HEENT Quiz", earned: "", possible: 5 },
    { id: "cardio", label: "H&P Cardiology Quiz", earned: "", possible: 4 },
    { id: "pulm", label: "H&P Pulmonology Quiz", earned: "", possible: 4 },
    { id: "peds", label: "H&P Pediatrics Quiz", earned: "", possible: 4 },
    { id: "lymph", label: "Lymphatic Quiz", earned: "", possible: 4 },
  ],
};

// Assignments & Activities — 10% bucket
const ASSIGNMENTS = {
  id: "assignments",
  title: "Assignments & Activities (10%)",
  help: "All written work / activities counted in the 10% bucket.",
  rows: [
    { id: "dermsoap", label: "Derm SOAP Note", earned: "", possible: 44 },
    {
      id: "heentlymphsoap",
      label: "HEENT Lymph SOAP note",
      earned: "",
      possible: 44,
    },
    { id: "neurosoap", label: "Neuro SOAP note", earned: "", possible: 44 },
    {
      id: "cardiosoap",
      label: "Cardiology SOAP note",
      earned: "",
      possible: 44,
    },
    {
      id: "cardiacflow",
      label: "Cardiac Blood Flow Worksheet",
      earned: "",
      possible: 15,
    },
    { id: "dermmod", label: "Derm Modules", earned: 18, possible: 18 },
    { id: "eyews", label: "Eye Worksheet", earned: "", possible: 11 },
    {
      id: "murmur",
      label: "Cardiac Murmur Worksheet",
      earned: "",
      possible: 9,
    },
    {
      id: "video1",
      label: "Student Videos #1 — Self Reflection & Provider Satisfaction",
      earned: "",
      possible: 10,
    },
    {
      id: "video2",
      label: "Video #2 — Graded SOAP Note Provider Satisfaction",
      earned: "",
      possible: 44,
    },
    { id: "gcd3", label: "GCD Chapter 3", earned: 10, possible: 11 },
    { id: "gcd5", label: "GCD Chapter 5", earned: "", possible: 17 },
  ],
};

// Attendance & Professionalism — 10%
const ATTENDANCE = {
  id: "attendance",
  title: "Attendance & Professionalism (10%)",
  help: "Enter earned / possible points (usually 10 / 10).",
  rows: [
    {
      id: "attn",
      label: "Attendance & Professionalism",
      earned: "",
      possible: 10,
    },
  ],
};

// Practicums — pass/fail (excluded)
const PRACTICUMS = {
  id: "practicums",
  title: "Practicums (Pass/Fail — not counted in numeric grade)",
  rows: [
    { id: "finalprac", label: "Final Practicum", earned: "", possible: 10 },
    {
      id: "gvd",
      label: "General VS & Derm Practicum",
      earned: "",
      possible: 10,
    },
    {
      id: "heentlymphprac",
      label: "HEENT & Lymph Practicum",
      earned: "",
      possible: 10,
    },
    { id: "neuroprac", label: "Neuro Practicum", earned: "", possible: 10 },
    {
      id: "cardiovesselprac",
      label: "Cardiac Vessel & Pulmonary Practicum",
      earned: "",
      possible: 10,
    },
  ],
};

// ---- UI helpers ------------------------------------------------------------

function SectionTable({
  section,
  onChange,
  dimContribution = false,
}: {
  section: any;
  onChange: any;
  dimContribution?: boolean;
}) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="section-title">{section.title}</h2>
          {section.help && <p className="section-help">{section.help}</p>}
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <colgroup>
            <col style={{ width: "52%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "16%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Item</th>
              <th>Earned</th>
              <th>Possible</th>
              <th>Percent</th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((r) => {
              const e = Number(r.earned) || 0;
              const p = Number(r.possible) || 0;
              const pr = p > 0 ? (100 * e) / p : 0;
              return (
                <tr key={r.id}>
                  <td className="td-item">{r.label}</td>
                  <td>
                    <input
                      inputMode="decimal"
                      className="input input-earned"
                      value={r.earned}
                      onChange={(e) => onChange(r.id, e.target.value)}
                      placeholder="—"
                    />
                  </td>
                  <td className="td-num">{r.possible}</td>
                  <td className="td-num">{pct(pr)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {dimContribution && (
        <div className="muted">Not counted toward numeric grade.</div>
      )}
    </div>
  );
}

function SummaryRow({
  label,
  pct,
  contrib,
}: {
  label: string;
  pct: string;
  contrib?: string;
}) {
  return (
    <div className="summary-row">
      <div className="summary-label">{label}</div>
      <div className="summary-value">
        <div className="primary tabular-nums">{pct}</div>
        {contrib && <div className="secondary tabular-nums">{contrib}</div>}
      </div>
    </div>
  );
}

export default function App() {
  const [examSec, setExamSec] = useState(() => cloneSections([EXAMS])[0]);
  const [quizSec, setQuizSec] = useState(() => cloneSections([QUIZZES])[0]);
  const [assignSec, setAssignSec] = useState(
    () => cloneSections([ASSIGNMENTS])[0]
  );
  const [attnSec, setAttnSec] = useState(() => cloneSections([ATTENDANCE])[0]);
  const [pracSec, setPracSec] = useState(() => cloneSections([PRACTICUMS])[0]);
  const [goal, setGoal] = useState(80);

  // Update helpers
  const updateRow = (setter, section) => (rowId, value) => {
    const next = cloneSections([section])[0];
    const row = next.rows.find((r) => r.id === rowId);
    row.earned = value === "" ? "" : Number(value);
    setter(next);
  };

  // Aggregations
  const sums = useMemo(() => {
    const sum = (rows) =>
      rows.reduce(
        (acc, r) => {
          const e = Number(r.earned) || 0;
          const p = Number(r.possible) || 0;
          acc.e += e;
          acc.p += p;
          return acc;
        },
        { e: 0, p: 0 }
      );

    const ex = sum(examSec.rows);
    const qz = sum(quizSec.rows);
    const asg = sum(assignSec.rows);
    const att = sum(attnSec.rows);
    const prc = sum(pracSec.rows); // informational only

    // Exams+Quizzes bucket (80%) — weighted by points *inside* bucket
    const bucketPoints = ex.p + qz.p;
    const bucketEarned = ex.e + qz.e;
    const bucketPct =
      bucketPoints > 0 ? (bucketEarned / bucketPoints) * 100 : 0;
    const contribExQz = (bucketPct / 100) * 80;

    // Assignments (10%)
    const assignPct = asg.p > 0 ? (asg.e / asg.p) * 100 : 0;
    const contribAssign = (assignPct / 100) * 10;

    // Attendance (10%)
    const attnPct = att.p > 0 ? (att.e / att.p) * 100 : 0;
    const contribAttn = (attnPct / 100) * 10;

    // Overall
    const overall = contribExQz + contribAssign + contribAttn;

    // Needed Exams+Quizzes % to hit goal
    const neededBucketPct = (() => {
      const A = assignPct;
      const P = attnPct;
      const B = (goal - 0.1 * A - 0.1 * P) / 0.8;
      return isFinite(B) ? B : 0;
    })();

    return {
      ex,
      qz,
      asg,
      att,
      prc,
      bucketPoints,
      bucketEarned,
      bucketPct,
      contribExQz,
      assignPct,
      contribAssign,
      attnPct,
      contribAttn,
      overall,
      neededBucketPct,
    };
  }, [examSec, quizSec, assignSec, attnSec, pracSec, goal]);

  const resetAll = () => {
    setExamSec(cloneSections([EXAMS])[0]);
    setQuizSec(cloneSections([QUIZZES])[0]);
    setAssignSec(cloneSections([ASSIGNMENTS])[0]);
    setAttnSec(cloneSections([ATTENDANCE])[0]);
    setPracSec(cloneSections([PRACTICUMS])[0]);
    setGoal(80);
  };

  return (
    <div className="app">
      <h1>H&P Grade Calculator — React</h1>
      <p className="subhead">
        Exams + Quizzes = 80% (internally weighted by points), Assignments =
        10%, Attendance = 10%. Practicums are not included.
      </p>

      {/* Top Overall summary */}
      <div className="card top-summary">
        <div className="top-summary-label">Overall grade</div>
        <div className="top-summary-value tabular-nums">{`${currency(
          sums.overall
        )}%`}</div>
      </div>

      <div className="stack mt-20">
        <SectionTable
          section={examSec}
          onChange={updateRow(setExamSec, examSec)}
        />
        <SectionTable
          section={quizSec}
          onChange={updateRow(setQuizSec, quizSec)}
        />
        <SectionTable
          section={assignSec}
          onChange={updateRow(setAssignSec, assignSec)}
        />
        <SectionTable
          section={attnSec}
          onChange={updateRow(setAttnSec, attnSec)}
        />
        <SectionTable
          section={pracSec}
          onChange={updateRow(setPracSec, pracSec)}
          dimContribution
        />
      </div>

      <div className="grid-2 mt-24">
        <div className="card">
          <h3 className="card-title">Summary</h3>
          <div className="summary-list">
            <SummaryRow
              label="Exams + Quizzes bucket"
              pct={`${pct(sums.bucketPct)}`}
              contrib={`+${currency(sums.contribExQz)} pts toward 100`}
            />
            <SummaryRow
              label="Assignments (10%)"
              pct={`${pct(sums.assignPct)}`}
              contrib={`+${currency(sums.contribAssign)} pts`}
            />
            <SummaryRow
              label="Attendance (10%)"
              pct={`${pct(sums.attnPct)}`}
              contrib={`+${currency(sums.contribAttn)} pts`}
            />
            <div className="separator" />
            <SummaryRow
              label="Overall grade"
              pct={`${currency(sums.overall)}%`}
            />
          </div>
        </div>
      </div>

      <div className="actions">
        <button onClick={resetAll} className="btn">
          Reset to Defaults
        </button>
      </div>

      <p className="tip">
        Tip: Leave an "earned" cell blank if it hasn't been graded yet. We'll
        weight each bucket by points automatically.
      </p>
    </div>
  );
}
