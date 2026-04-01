import React, { useMemo, useState } from "react";

const symptomOptions = [
  "fever",
  "diarrhea",
  "nasal discharge",
  "eye discharge",
  "mouth sores",
  "not eating",
  "weakness",
  "cough",
  "fast breathing",
  "bloating",
  "swollen stomach",
  "dehydration",
  "unable to stand",
];

const diseases = [
  {
    name: "PPR",
    symptoms: ["fever", "diarrhea", "nasal discharge", "eye discharge", "mouth sores", "not eating"],
    level: "High",
    summary: "A serious infectious disease that can spread quickly among goats.",
    steps: [
      "Isolate the goat immediately.",
      "Do not mix it with the rest of the herd.",
      "Provide water and monitor weakness closely.",
      "Contact a veterinarian urgently.",
    ],
    urgentSigns: ["unable to stand", "severe weakness", "continuous diarrhea"],
  },
  {
    name: "Bloat",
    symptoms: ["bloating", "swollen stomach", "not eating", "fast breathing"],
    level: "High",
    summary: "Gas build-up in the stomach that can become an emergency.",
    steps: [
      "Stop feeding immediately.",
      "Keep the goat standing if possible.",
      "Watch breathing closely.",
      "Seek veterinary help urgently.",
    ],
    urgentSigns: ["fast breathing", "unable to stand"],
  },
  {
    name: "Respiratory Infection",
    symptoms: ["cough", "nasal discharge", "fever", "fast breathing", "not eating"],
    level: "Medium",
    summary: "May be caused by infection, poor ventilation, or seasonal stress.",
    steps: [
      "Move the goat to a dry, well-ventilated area.",
      "Check for fever and appetite loss.",
      "Keep it separate from visibly sick animals.",
      "Consult a veterinarian if breathing worsens.",
    ],
    urgentSigns: ["fast breathing", "unable to stand"],
  },
  {
    name: "Digestive Infection / Severe Diarrhea",
    symptoms: ["diarrhea", "weakness", "dehydration", "not eating", "fever"],
    level: "Medium",
    summary: "May be linked to infection, contaminated water, feed change, or worms.",
    steps: [
      "Give access to clean drinking water.",
      "Observe stool pattern and appetite.",
      "Keep the goat in a dry area.",
      "Seek veterinary support if weakness increases.",
    ],
    urgentSigns: ["dehydration", "unable to stand"],
  },
];

function scoreDisease(selectedSymptoms, diseaseSymptoms) {
  return diseaseSymptoms.reduce((score, symptom) => {
    return selectedSymptoms.includes(symptom) ? score + 1 : score;
  }, 0);
}

function levelClass(level) {
  if (level === "High") return "badge high";
  return "badge medium";
}

export default function GoatHealthTool() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const results = useMemo(() => {
    return diseases
      .map((disease) => ({
        ...disease,
        score: scoreDisease(selectedSymptoms, disease.symptoms),
      }))
      .filter((disease) => disease.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [selectedSymptoms]);

  const topResult = results[0];
  const emergencyTriggered = selectedSymptoms.includes("unable to stand") || selectedSymptoms.includes("fast breathing");

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "24px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ margin: 0, fontSize: "32px" }}>Goat Health Tool</h1>
          <p style={{ color: "#475569", marginTop: "8px", maxWidth: "700px" }}>
            Select the symptoms you observe. The tool shows likely conditions, risk level, and immediate next steps.
          </p>
        </div>

        {emergencyTriggered && (
          <div style={{ background: "#fff7ed", border: "1px solid #fdba74", borderRadius: "14px", padding: "16px", marginBottom: "20px" }}>
            <strong style={{ display: "block", marginBottom: "6px" }}>Urgent warning</strong>
            <span>Breathing difficulty or inability to stand may indicate a serious condition. Please contact a veterinarian immediately.</span>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={{ background: "white", borderRadius: "18px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <h2 style={{ marginTop: 0 }}>Step 1: Select Symptoms</h2>
            <p style={{ color: "#64748b", fontSize: "14px" }}>Tap all symptoms that match what you see in the goat.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "16px" }}>
              {symptomOptions.map((symptom) => {
                const active = selectedSymptoms.includes(symptom);
                return (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    style={{
                      borderRadius: "999px",
                      padding: "10px 14px",
                      border: active ? "1px solid #2563eb" : "1px solid #cbd5e1",
                      background: active ? "#dbeafe" : "white",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    {symptom}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: "20px" }}>
              <strong>Selected symptoms:</strong>
              <div style={{ marginTop: "10px", color: "#475569" }}>
                {selectedSymptoms.length > 0 ? selectedSymptoms.join(", ") : "None selected yet"}
              </div>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: "18px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
            <h2 style={{ marginTop: 0 }}>Step 2: Likely Condition</h2>
            {topResult ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{topResult.name}</h3>
                    <p style={{ color: "#475569", marginTop: "8px" }}>{topResult.summary}</p>
                  </div>
                  <span style={{
                    padding: "6px 10px",
                    borderRadius: "999px",
                    background: topResult.level === "High" ? "#fee2e2" : "#fef3c7",
                    color: topResult.level === "High" ? "#b91c1c" : "#92400e",
                    fontWeight: 600,
                    fontSize: "13px"
                  }}>{topResult.level} Risk</span>
                </div>

                <div style={{ marginTop: "18px" }}>
                  <strong>Immediate next steps</strong>
                  <ul style={{ marginTop: "10px", paddingLeft: "20px", color: "#334155" }}>
                    {topResult.steps.map((step, idx) => (
                      <li key={idx} style={{ marginBottom: "8px" }}>{step}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: "18px" }}>
                  <strong>Urgent danger signs</strong>
                  <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {topResult.urgentSigns.map((sign, idx) => (
                      <span key={idx} style={{ background: "#fee2e2", color: "#b91c1c", padding: "6px 10px", borderRadius: "999px", fontSize: "13px" }}>
                        {sign}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p style={{ color: "#64748b" }}>Select one or more symptoms to see the likely condition.</p>
            )}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: "18px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", marginTop: "20px" }}>
          <h2 style={{ marginTop: 0 }}>Other Possible Matches</h2>
          {results.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginTop: "12px" }}>
              {results.map((item, idx) => (
                <div key={idx} style={{ border: "1px solid #e2e8f0", borderRadius: "14px", padding: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                    <strong>{item.name}</strong>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "999px",
                      background: item.level === "High" ? "#fee2e2" : "#fef3c7",
                      color: item.level === "High" ? "#b91c1c" : "#92400e",
                      fontWeight: 600,
                      fontSize: "12px"
                    }}>{item.level}</span>
                  </div>
                  <p style={{ color: "#64748b", fontSize: "14px" }}>{item.summary}</p>
                  <div style={{ color: "#475569", fontSize: "13px" }}>Matched symptoms: {item.score}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#64748b" }}>No matches yet.</p>
          )}
        </div>

        <div style={{ marginTop: "20px", background: "#eff6ff", borderRadius: "18px", padding: "18px", color: "#1e3a8a" }}>
          <strong>Field note</strong>
          <p style={{ marginBottom: 0 }}>
            This tool is for field screening and early response only. It should not replace veterinary diagnosis or treatment.
          </p>
        </div>
      </div>
    </div>
  );
}
