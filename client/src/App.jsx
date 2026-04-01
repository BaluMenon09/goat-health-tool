import React, { useState } from "react";

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

export default function App() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const checkHealth = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/api/check-goat-health", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: selectedSymptoms,
          ageGroup: "adult",
          notes: notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 style={{ marginBottom: "8px" }}>Goat Health Tool</h1>
        <p style={{ color: "#475569", marginBottom: "20px" }}>
          Select the symptoms you observe in the goat and add any extra notes.
        </p>

        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Select Symptoms</h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
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

          <div style={{ marginTop: "16px" }}>
            <strong>Selected symptoms:</strong>
            <div style={{ marginTop: "8px", color: "#475569" }}>
              {selectedSymptoms.length > 0
                ? selectedSymptoms.join(", ")
                : "None selected yet"}
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
              Additional notes / observations
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Example: pregnant goat, not drinking water, started yesterday, happened after rain"
              rows={4}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            onClick={checkHealth}
            disabled={loading || selectedSymptoms.length === 0}
            style={{
              marginTop: "20px",
              padding: "12px 18px",
              borderRadius: "10px",
              border: "none",
              background: loading || selectedSymptoms.length === 0 ? "#94a3b8" : "#2563eb",
              color: "white",
              cursor: loading || selectedSymptoms.length === 0 ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {loading ? "Checking..." : "Check Goat Health"}
          </button>

          {error && (
            <p style={{ color: "red", marginTop: "14px" }}>{error}</p>
          )}
        </div>

        {result && (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
              <div>
                <h2 style={{ margin: 0 }}>{result.likely_condition}</h2>
                <p style={{ color: "#475569", marginTop: "8px" }}>{result.summary}</p>
              </div>

              <span
                style={{
                  padding: "6px 10px",
                  borderRadius: "999px",
                  background:
                    result.risk_level === "High"
                      ? "#fee2e2"
                      : result.risk_level === "Medium"
                      ? "#fef3c7"
                      : "#dcfce7",
                  color:
                    result.risk_level === "High"
                      ? "#b91c1c"
                      : result.risk_level === "Medium"
                      ? "#92400e"
                      : "#166534",
                  fontWeight: 600,
                  fontSize: "13px",
                  height: "fit-content",
                }}
              >
                {result.risk_level} Risk
              </span>
            </div>

            <div style={{ marginTop: "20px" }}>
              <strong>Immediate next steps</strong>
              <ul style={{ marginTop: "10px", paddingLeft: "20px", color: "#334155" }}>
                {result.next_steps?.map((step, idx) => (
                  <li key={idx} style={{ marginBottom: "8px" }}>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: "20px" }}>
              <strong>Urgent signs</strong>
              <ul style={{ marginTop: "10px", paddingLeft: "20px", color: "#334155" }}>
                {result.urgent_signs?.map((sign, idx) => (
                  <li key={idx} style={{ marginBottom: "8px" }}>
                    {sign}
                  </li>
                ))}
              </ul>
            </div>

            {result.vet_help_needed && (
              <div
                style={{
                  marginTop: "20px",
                  background: "#fff7ed",
                  border: "1px solid #fdba74",
                  borderRadius: "12px",
                  padding: "14px",
                  color: "#9a3412",
                  fontWeight: 600,
                }}
              >
                Veterinary help is recommended.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
