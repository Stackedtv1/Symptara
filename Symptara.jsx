import { useState, useEffect, useRef } from “react”;

// ─── Embedded Condition Database ────────────────────────────────────────────
const CONDITION_DB = {
“Type 2 Diabetes”: {
category: “Endocrine”,
icd: “E11”,
overview: “A chronic metabolic disorder where the body doesn’t use insulin properly, leading to elevated blood glucose levels.”,
symptoms: [“Frequent urination”,“Excessive thirst”,“Unexplained weight loss”,“Fatigue”,“Blurred vision”,“Slow-healing sores”,“Frequent infections”,“Tingling in hands/feet”],
causes: [“Insulin resistance”,“Obesity”,“Physical inactivity”,“Genetic predisposition”,“Age over 45”,“Prediabetes history”],
treatments: [“Lifestyle modification”,“Blood glucose monitoring”,“Oral medications”,“Insulin therapy”,“Weight management”,“Dietary changes”],
medications: [
{ name: “Metformin”, type: “Biguanide”, use: “First-line therapy; reduces glucose production”, warning: “Avoid in severe kidney disease” },
{ name: “Glipizide”, type: “Sulfonylurea”, use: “Stimulates insulin release”, warning: “Risk of hypoglycemia” },
{ name: “Januvia (Sitagliptin)”, type: “DPP-4 Inhibitor”, use: “Lowers blood sugar after meals”, warning: “May cause pancreatitis (rare)” },
{ name: “Ozempic (Semaglutide)”, type: “GLP-1 Agonist”, use: “Lowers blood sugar and aids weight loss”, warning: “Nausea common initially” },
],
related: [“Type 1 Diabetes”,“Metabolic Syndrome”,“Hypertension”,“Obesity”,“PCOS”,“Diabetic Nephropathy”],
urgency: “See a doctor if fasting glucose exceeds 126 mg/dL or you experience severe fatigue and frequent urination.”,
specialists: [“Endocrinologist”,“Dietitian”,“Ophthalmologist”,“Podiatrist”],
prevalence: “~537 million adults worldwide”,
},
“Hypertension”: {
category: “Cardiovascular”,
icd: “I10”,
overview: “Chronically elevated blood pressure (≥130/80 mmHg) that significantly increases the risk of heart disease, stroke, and kidney damage.”,
symptoms: [“Often asymptomatic”,“Headaches (severe)”,“Shortness of breath”,“Nosebleeds”,“Chest pain”,“Dizziness”,“Visual changes”,“Pounding in chest/neck”],
causes: [“Genetics”,“High sodium diet”,“Obesity”,“Physical inactivity”,“Chronic stress”,“Excessive alcohol”,“Kidney disease”,“Sleep apnea”],
treatments: [“DASH diet”,“Regular aerobic exercise”,“Sodium restriction”,“Stress management”,“Smoking cessation”,“Weight loss”,“Medication”],
medications: [
{ name: “Lisinopril”, type: “ACE Inhibitor”, use: “Relaxes blood vessels”, warning: “Can cause dry cough; avoid in pregnancy” },
{ name: “Amlodipine”, type: “Calcium Channel Blocker”, use: “Relaxes blood vessel walls”, warning: “May cause ankle swelling” },
{ name: “Hydrochlorothiazide”, type: “Thiazide Diuretic”, use: “Reduces fluid volume”, warning: “Monitor potassium levels” },
{ name: “Losartan”, type: “ARB”, use: “Blocks angiotensin receptors”, warning: “Avoid in pregnancy; monitor kidneys” },
],
related: [“Coronary Artery Disease”,“Heart Failure”,“Stroke”,“Chronic Kidney Disease”,“Atrial Fibrillation”,“Diabetes”],
urgency: “Seek emergency care if BP exceeds 180/120 mmHg or you experience chest pain, vision loss, or severe headache.”,
specialists: [“Cardiologist”,“Nephrologist”,“Primary Care Physician”],
prevalence: “~1.3 billion adults worldwide”,
},
“Asthma”: {
category: “Respiratory”,
icd: “J45”,
overview: “A chronic inflammatory disease of the airways causing recurrent episodes of wheezing, breathlessness, chest tightness, and coughing.”,
symptoms: [“Wheezing”,“Shortness of breath”,“Chest tightness”,“Persistent cough (especially at night)”,“Rapid breathing”,“Difficulty sleeping”,“Fatigue during exercise”],
causes: [“Allergens (pollen, dust, pet dander)”,“Air pollution”,“Respiratory infections”,“Exercise”,“Cold air”,“Stress”,“Smoke exposure”,“Genetics”],
treatments: [“Trigger avoidance”,“Rescue inhalers”,“Controller medications”,“Allergy immunotherapy”,“Breathing exercises”,“Action plan management”],
medications: [
{ name: “Albuterol (Ventolin)”, type: “Short-acting Beta Agonist”, use: “Rapid relief during attacks”, warning: “Overuse can worsen asthma” },
{ name: “Fluticasone (Flovent)”, type: “Inhaled Corticosteroid”, use: “Daily controller to reduce inflammation”, warning: “Rinse mouth after use to prevent thrush” },
{ name: “Montelukast (Singulair)”, type: “Leukotriene Modifier”, use: “Daily prevention and allergy control”, warning: “Rare neuropsychiatric effects reported” },
{ name: “Salmeterol (Serevent)”, type: “Long-acting Beta Agonist”, use: “Long-term symptom control”, warning: “Never use alone without corticosteroid” },
],
related: [“Allergic Rhinitis”,“Eczema”,“COPD”,“Sinusitis”,“GERD”,“Vocal Cord Dysfunction”],
urgency: “Call 911 if breathing is severely labored, lips/fingernails turn blue, or rescue inhaler provides no relief.”,
specialists: [“Pulmonologist”,“Allergist/Immunologist”],
prevalence: “~262 million people worldwide”,
},
“Migraine”: {
category: “Neurological”,
icd: “G43”,
overview: “A neurological disorder characterized by recurrent moderate-to-severe headaches often accompanied by nausea, vomiting, and extreme sensitivity to light and sound.”,
symptoms: [“Pulsating head pain (one side)”,“Nausea and vomiting”,“Light sensitivity (photophobia)”,“Sound sensitivity”,“Aura (visual disturbances)”,“Dizziness”,“Neck stiffness”,“Cognitive fog”],
causes: [“Hormonal changes”,“Stress”,“Certain foods/drinks”,“Sleep disruption”,“Sensory stimuli”,“Medication overuse”,“Dehydration”,“Genetic predisposition”],
treatments: [“Trigger identification/avoidance”,“Rest in dark quiet room”,“Cold/warm compresses”,“Stress management”,“Regular sleep schedule”,“Biofeedback”,“Preventive medications”],
medications: [
{ name: “Sumatriptan (Imitrex)”, type: “Triptan”, use: “Abortive treatment during attacks”, warning: “Avoid in cardiovascular disease” },
{ name: “Topiramate (Topamax)”, type: “Anticonvulsant”, use: “Preventive therapy”, warning: “Cognitive side effects; teratogenic” },
{ name: “Amitriptyline”, type: “Tricyclic Antidepressant”, use: “Preventive therapy”, warning: “Causes drowsiness; cardiac monitoring needed” },
{ name: “Aimovig (Erenumab)”, type: “CGRP Monoclonal Antibody”, use: “Monthly preventive injection”, warning: “Constipation; injection site reactions” },
],
related: [“Tension Headache”,“Cluster Headache”,“Vertigo”,“Depression”,“Anxiety”,“Sleep Disorders”],
urgency: “Seek emergency care for sudden ‘thunderclap’ headache, headache with fever/stiff neck, or neurological symptoms.”,
specialists: [“Neurologist”,“Headache Specialist”],
prevalence: “~1 billion people worldwide”,
},
“Depression”: {
category: “Mental Health”,
icd: “F32”,
overview: “A common and serious mood disorder causing persistent feelings of sadness, loss of interest, and a wide range of emotional and physical problems that interfere with daily functioning.”,
symptoms: [“Persistent sadness or emptiness”,“Loss of interest/pleasure”,“Fatigue and low energy”,“Sleep disturbances”,“Appetite changes”,“Difficulty concentrating”,“Feelings of worthlessness”,“Thoughts of death or suicide”],
causes: [“Neurochemical imbalances”,“Genetics”,“Trauma or life events”,“Chronic illness”,“Substance use”,“Certain medications”,“Seasonal changes”,“Hormonal shifts”],
treatments: [“Psychotherapy (CBT)”,“Antidepressant medications”,“Exercise”,“Social support”,“Mindfulness-based therapy”,“Electroconvulsive therapy (severe cases)”,“Lifestyle modifications”],
medications: [
{ name: “Sertraline (Zoloft)”, type: “SSRI”, use: “First-line antidepressant”, warning: “May increase suicidal thoughts in young adults initially” },
{ name: “Escitalopram (Lexapro)”, type: “SSRI”, use: “Broad-spectrum antidepressant”, warning: “Sexual side effects common” },
{ name: “Bupropion (Wellbutrin)”, type: “NDRI”, use: “Depression + smoking cessation”, warning: “Lowers seizure threshold” },
{ name: “Venlafaxine (Effexor)”, type: “SNRI”, use: “Depression and anxiety”, warning: “Discontinuation syndrome; monitor BP” },
],
related: [“Anxiety Disorder”,“Bipolar Disorder”,“PTSD”,“Substance Use Disorder”,“Chronic Pain”,“Insomnia”],
urgency: “Seek immediate help if experiencing thoughts of self-harm or suicide. Call 988 (Suicide & Crisis Lifeline).”,
specialists: [“Psychiatrist”,“Psychologist”,“Licensed Therapist”,“Primary Care Physician”],
prevalence: “~280 million people worldwide”,
},
“GERD”: {
category: “Gastroenterology”,
icd: “K21”,
overview: “Gastroesophageal reflux disease occurs when stomach acid frequently flows back into the esophagus, causing irritation, heartburn, and potential long-term complications.”,
symptoms: [“Heartburn”,“Regurgitation”,“Chest pain”,“Difficulty swallowing”,“Chronic cough”,“Hoarseness”,“Sore throat”,“Sensation of lump in throat”],
causes: [“Weak lower esophageal sphincter”,“Hiatal hernia”,“Obesity”,“Pregnancy”,“Certain foods/drinks”,“Smoking”,“Delayed gastric emptying”,“Certain medications”],
treatments: [“Dietary modifications”,“Weight loss”,“Elevate head of bed”,“Avoid lying down after meals”,“Quit smoking”,“Limit alcohol”,“Medications”,“Surgery (severe cases)”],
medications: [
{ name: “Omeprazole (Prilosec)”, type: “Proton Pump Inhibitor”, use: “Reduces stomach acid production”, warning: “Long-term use may affect magnesium/bone density” },
{ name: “Famotidine (Pepcid)”, type: “H2 Blocker”, use: “Reduces acid production”, warning: “Generally well tolerated” },
{ name: “Tums (Calcium Carbonate)”, type: “Antacid”, use: “Rapid short-term heartburn relief”, warning: “Overuse causes acid rebound” },
{ name: “Metoclopramide”, type: “Prokinetic”, use: “Speeds gastric emptying”, warning: “Neurological side effects with prolonged use” },
],
related: [“Barrett’s Esophagus”,“Esophagitis”,“Hiatal Hernia”,“Peptic Ulcer”,“Asthma”,“Laryngopharyngeal Reflux”],
urgency: “See a doctor for difficulty swallowing, unintentional weight loss, vomiting blood, or symptoms >2 weeks despite treatment.”,
specialists: [“Gastroenterologist”],
prevalence: “~20% of the Western population”,
},
};

const ALL_CONDITIONS = Object.keys(CONDITION_DB);
const CATEGORY_COLORS = {
Endocrine: “#f59e0b”,
Cardiovascular: “#ef4444”,
Respiratory: “#3b82f6”,
Neurological: “#8b5cf6”,
“Mental Health”: “#ec4899”,
Gastroenterology: “#10b981”,
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 16, color = “currentColor”, strokeWidth = 1.75 }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
{Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
</svg>
);

const ICONS = {
search: “M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z”,
bookmark: [“M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z”],
note: [“M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7”,“M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z”],
pill: [“M10.5 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7.5”,“M2 12h10”,“M20 16v6”,“M23 19h-6”],
warning: “M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z”,
cross: “M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 6v4m0 4h.01”,
sparkle: [“M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z”,“M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15z”],
db: [“M12 2C6.5 2 2 4.02 2 6.5v11C2 19.98 6.5 22 12 22s10-2.02 10-4.5v-11C22 4.02 17.5 2 12 2z”,“M2 12c0 2.48 4.5 4.5 10 4.5s10-2.02 10-4.5”,“M2 6.5c0 2.48 4.5 4.5 10 4.5s10-2.02 10-4.5”],
link: “M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71”,
close: “M18 6L6 18M6 6l12 12”,
person: [“M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2”,“M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z”],
home: “M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z”,
};

// ─── Styled Atom Components ──────────────────────────────────────────────────
const Tag = ({ children, color = “#0ea5e9”, bg }) => (
<span style={{
display: “inline-flex”, alignItems: “center”,
padding: “3px 10px”, borderRadius: “20px”,
fontSize: “11px”, fontWeight: 600, letterSpacing: “0.04em”,
background: bg || `${color}18`,
color, border: `1px solid ${color}30`,
}}>{children}</span>
);

const SectionHead = ({ children }) => (

  <div style={{
    fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em",
    textTransform: "uppercase", color: "#475569", marginBottom: "10px",
    display: "flex", alignItems: "center", gap: "6px"
  }}>{children}</div>
);

const Card = ({ children, style = {} }) => (

  <div style={{
    background: "rgba(15,20,35,0.8)",
    border: "1px solid rgba(14,165,233,0.12)",
    borderRadius: "14px", padding: "20px",
    backdropFilter: "blur(8px)",
    ...style
  }}>{children}</div>
);

const Pill = ({ children, onClick, active }) => (
<button onClick={onClick} style={{
padding: “6px 14px”, borderRadius: “20px”, cursor: “pointer”,
border: active ? “1px solid #0ea5e9” : “1px solid rgba(255,255,255,0.07)”,
background: active ? “rgba(14,165,233,0.15)” : “rgba(255,255,255,0.03)”,
color: active ? “#7dd3fc” : “#475569”,
fontSize: “12px”, fontWeight: 500, transition: “all 0.18s”,
fontFamily: “inherit”,
}}>{children}</button>
);

// ─── Medication Card ─────────────────────────────────────────────────────────
function MedCard({ med }) {
const [open, setOpen] = useState(false);
return (
<div style={{
border: “1px solid rgba(14,165,233,0.15)”, borderRadius: “10px”,
overflow: “hidden”, transition: “border-color 0.2s”,
}}>
<button onClick={() => setOpen(o => !o)} style={{
width: “100%”, padding: “12px 14px”, background: “rgba(14,165,233,0.05)”,
border: “none”, cursor: “pointer”, display: “flex”,
justifyContent: “space-between”, alignItems: “center”, gap: “12px”,
fontFamily: “inherit”,
}}>
<div style={{ textAlign: “left” }}>
<div style={{ fontSize: “14px”, fontWeight: 600, color: “#e2e8f0” }}>{med.name}</div>
<div style={{ fontSize: “11px”, color: “#0ea5e9”, marginTop: “2px” }}>{med.type}</div>
</div>
<span style={{ color: “#475569”, fontSize: “18px”, lineHeight: 1 }}>{open ? “−” : “+”}</span>
</button>
{open && (
<div style={{ padding: “12px 14px”, borderTop: “1px solid rgba(14,165,233,0.1)” }}>
<div style={{ fontSize: “13px”, color: “#94a3b8”, marginBottom: “8px” }}>
<span style={{ color: “#64748b”, fontWeight: 600 }}>Use: </span>{med.use}
</div>
<div style={{
fontSize: “12px”, padding: “8px 10px”,
background: “rgba(251,191,36,0.07)”, borderRadius: “6px”,
borderLeft: “3px solid #fbbf24”, color: “#fbbf24”,
}}>
⚠ {med.warning}
</div>
</div>
)}
</div>
);
}

// ─── Result Panel ─────────────────────────────────────────────────────────────
function ResultPanel({ data, source, query, bookmarks, setBookmarks, notes, setNotes, onRelated }) {
const [tab, setTab] = useState(“overview”);
const [noteOpen, setNoteOpen] = useState(false);
const [noteText, setNoteText] = useState(notes[data.condition || query] || “”);
const isBookmarked = bookmarks.some(b => b.key === (data.condition || query));
const catColor = CATEGORY_COLORS[data.category] || “#0ea5e9”;
const key = data.condition || query;

const toggleBookmark = () => {
setBookmarks(prev =>
prev.some(b => b.key === key)
? prev.filter(b => b.key !== key)
: […prev, { key, condition: data.condition || query, category: data.category, icd: data.icd, overview: data.overview, symptoms: data.symptoms, savedAt: new Date().toLocaleDateString(“en-US”, { month: “short”, day: “numeric”, year: “numeric” }) }]
);
};

const saveNote = () => {
setNotes(prev => ({ …prev, [key]: noteText }));
setNoteOpen(false);
};

const tabs = [“overview”, “symptoms”, “medications”, “details”];

return (
<div style={{ animation: “slideUp 0.35s cubic-bezier(.22,1,.36,1)” }}>
<style>{`@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>

```
  {/* Header */}
  <div style={{
    background: `linear-gradient(135deg, ${catColor}12, rgba(10,15,30,0.0))`,
    border: `1px solid ${catColor}25`,
    borderRadius: "16px", padding: "24px", marginBottom: "14px",
    position: "relative", overflow: "hidden"
  }}>
    <div style={{
      position: "absolute", top: "-30px", right: "-30px",
      width: "120px", height: "120px", borderRadius: "50%",
      background: `radial-gradient(circle, ${catColor}15, transparent 70%)`,
      pointerEvents: "none"
    }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <Tag color={catColor}>{data.category}</Tag>
          {data.icd && <Tag color="#64748b">ICD-10: {data.icd}</Tag>}
          <Tag color="#22d3ee">{source === "db" ? "📚 Database" : "✨ AI"}</Tag>
        </div>
        <h2 style={{
          margin: "0 0 10px", fontSize: "clamp(20px,4vw,28px)", fontWeight: 300,
          color: "#f1f5f9", letterSpacing: "-0.03em", lineHeight: 1.2,
          fontFamily: "'Playfair Display', Georgia, serif"
        }}>{data.condition || query}</h2>
        <p style={{ margin: 0, color: "#94a3b8", fontSize: "14px", lineHeight: 1.65 }}>{data.overview}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0 }}>
        <button onClick={toggleBookmark} title={isBookmarked ? "Remove bookmark" : "Bookmark"} style={{
          width: "38px", height: "38px", borderRadius: "9px", border: "none", cursor: "pointer",
          background: isBookmarked ? "rgba(14,165,233,0.2)" : "rgba(255,255,255,0.04)",
          display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
        }}>
          <Icon d={ICONS.bookmark} size={17} color={isBookmarked ? "#7dd3fc" : "#475569"} strokeWidth={isBookmarked ? 2.5 : 1.75} />
        </button>
        <button onClick={() => { setNoteText(notes[key] || ""); setNoteOpen(o => !o); }} title="Notes" style={{
          width: "38px", height: "38px", borderRadius: "9px", border: "none", cursor: "pointer",
          background: notes[key] ? "rgba(14,165,233,0.2)" : "rgba(255,255,255,0.04)",
          display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s"
        }}>
          <Icon d={ICONS.note} size={15} color={notes[key] ? "#7dd3fc" : "#475569"} />
        </button>
      </div>
    </div>

    {data.urgency && (
      <div style={{
        marginTop: "16px", padding: "10px 14px", borderRadius: "8px",
        background: "rgba(251,191,36,0.08)", borderLeft: "3px solid #f59e0b",
        fontSize: "13px", color: "#fbbf24", lineHeight: 1.5
      }}>
        <strong>When to seek care:</strong> {data.urgency}
      </div>
    )}
    {data.prevalence && (
      <div style={{ marginTop: "10px", fontSize: "12px", color: "#475569" }}>
        🌍 Prevalence: {data.prevalence}
      </div>
    )}
  </div>

  {/* Notes Box */}
  {noteOpen && (
    <Card style={{ marginBottom: "14px", borderColor: "rgba(14,165,233,0.25)" }}>
      <SectionHead><Icon d={ICONS.note} size={12} color="#0ea5e9" /> Personal Notes</SectionHead>
      <textarea
        value={noteText} onChange={e => setNoteText(e.target.value)}
        placeholder="Add doctor instructions, personal triggers, reminders…"
        rows={3}
        style={{
          width: "100%", background: "rgba(14,165,233,0.05)", border: "1px solid rgba(14,165,233,0.2)",
          borderRadius: "8px", padding: "10px 12px", color: "#e2e8f0", fontSize: "13px",
          resize: "vertical", outline: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: 1.6
        }}
      />
      <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
        <button onClick={saveNote} style={{
          padding: "8px 18px", background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
          border: "none", borderRadius: "7px", color: "#fff", fontSize: "13px",
          fontWeight: 600, cursor: "pointer", fontFamily: "inherit"
        }}>Save Note</button>
        <button onClick={() => setNoteOpen(false)} style={{
          padding: "8px 14px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "7px", color: "#64748b", fontSize: "13px", cursor: "pointer", fontFamily: "inherit"
        }}>Cancel</button>
      </div>
    </Card>
  )}
  {notes[key] && !noteOpen && (
    <div style={{
      marginBottom: "14px", padding: "12px 16px", borderRadius: "10px",
      background: "rgba(14,165,233,0.06)", border: "1px solid rgba(14,165,233,0.2)",
      fontSize: "13px", color: "#94a3b8", fontStyle: "italic", lineHeight: 1.6,
      display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px"
    }}>
      <span>📝 {notes[key]}</span>
      <button onClick={() => { setNoteText(notes[key]); setNoteOpen(true); }} style={{
        background: "transparent", border: "none", color: "#0ea5e9", cursor: "pointer",
        fontSize: "11px", fontWeight: 600, flexShrink: 0, fontFamily: "inherit"
      }}>Edit</button>
    </div>
  )}

  {/* Tab Nav */}
  <div style={{
    display: "flex", gap: "4px", marginBottom: "14px",
    background: "rgba(15,20,35,0.8)", padding: "4px", borderRadius: "11px",
    border: "1px solid rgba(14,165,233,0.1)"
  }}>
    {tabs.map(t => (
      <button key={t} onClick={() => setTab(t)} style={{
        flex: 1, padding: "8px 6px", borderRadius: "8px", border: "none", cursor: "pointer",
        fontSize: "12px", fontWeight: 600, textTransform: "capitalize", transition: "all 0.18s",
        fontFamily: "inherit",
        background: tab === t ? "linear-gradient(135deg,rgba(14,165,233,0.3),rgba(79,70,229,0.2))" : "transparent",
        color: tab === t ? "#7dd3fc" : "#475569",
      }}>{t === "medications" ? "💊 Meds" : t.charAt(0).toUpperCase() + t.slice(1)}</button>
    ))}
  </div>

  {/* Tab Panels */}
  {tab === "overview" && (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: "12px" }}>
      <Card>
        <SectionHead><Icon d={ICONS.cross} size={12} color="#ef4444" /> Causes & Risk Factors</SectionHead>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {data.causes?.map((c, i) => (
            <li key={i} style={{ padding: "5px 0", fontSize: "13px", color: "#cbd5e1", borderBottom: i < data.causes.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", display: "flex", gap: "8px" }}>
              <span style={{ color: "#ef4444", flexShrink: 0 }}>›</span>{c}
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <SectionHead><Icon d={ICONS.cross} size={12} color="#10b981" /> Treatments</SectionHead>
        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
          {data.treatments?.map((t, i) => (
            <li key={i} style={{ padding: "5px 0", fontSize: "13px", color: "#cbd5e1", borderBottom: i < data.treatments.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", display: "flex", gap: "8px" }}>
              <span style={{ color: "#10b981", flexShrink: 0 }}>›</span>{t}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )}

  {tab === "symptoms" && (
    <Card>
      <SectionHead><Icon d={ICONS.cross} size={12} color="#f59e0b" /> Symptoms & Signs</SectionHead>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {data.symptoms?.map((s, i) => (
          <span key={i} style={{
            padding: "6px 14px", borderRadius: "20px", fontSize: "13px",
            background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
            color: "#fcd34d"
          }}>{s}</span>
        ))}
      </div>
    </Card>
  )}

  {tab === "medications" && (
    <div>
      <Card style={{ marginBottom: "12px" }}>
        <SectionHead><Icon d={ICONS.pill} size={12} color="#0ea5e9" /> Medications — Click to Expand</SectionHead>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {data.medications?.length > 0
            ? data.medications.map((m, i) => <MedCard key={i} med={typeof m === "string" ? { name: m, type: "—", use: "—", warning: "Consult your doctor." } : m} />)
            : <p style={{ color: "#475569", fontSize: "13px", margin: 0 }}>Medication details available via AI search for this condition.</p>}
        </div>
      </Card>
      <div style={{ fontSize: "11px", color: "#334155", lineHeight: 1.5 }}>
        ⚠ Always consult a licensed pharmacist or physician before starting, stopping, or changing any medication.
      </div>
    </div>
  )}

  {tab === "details" && (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {data.specialists && (
        <Card>
          <SectionHead><Icon d={ICONS.person} size={12} color="#22d3ee" /> Recommended Specialists</SectionHead>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {data.specialists.map((s, i) => (
              <span key={i} style={{
                padding: "6px 14px", borderRadius: "20px", fontSize: "13px",
                background: "rgba(34,211,238,0.07)", border: "1px solid rgba(34,211,238,0.18)", color: "#67e8f9"
              }}>{s}</span>
            ))}
          </div>
        </Card>
      )}
      {data.related?.length > 0 && (
        <Card>
          <SectionHead><Icon d={ICONS.link} size={12} color="#8b5cf6" /> Related Conditions</SectionHead>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {data.related.map((r, i) => (
              <button key={i} onClick={() => onRelated(r)} style={{
                padding: "6px 14px", borderRadius: "20px", cursor: "pointer",
                border: "1px solid rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.08)",
                color: "#c4b5fd", fontSize: "13px", transition: "all 0.18s", fontFamily: "inherit"
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(139,92,246,0.18)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(139,92,246,0.08)"}
              >{r}</button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )}
</div>
```

);
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function SymptaraApp() {
const [query, setQuery] = useState(””);
const [loading, setLoading] = useState(false);
const [result, setResult] = useState(null);
const [resultSource, setResultSource] = useState(“db”);
const [error, setError] = useState(null);
const [suggestions, setSuggestions] = useState([]);
const [activeTab, setActiveTab] = useState(“search”);
const [bookmarks, setBookmarks] = useState([]);
const [notes, setNotes] = useState({});
const [categoryFilter, setCategoryFilter] = useState(“All”);
const inputRef = useRef(null);

const categories = [“All”, …new Set(Object.values(CONDITION_DB).map(c => c.category))];

useEffect(() => {
if (query.length > 1) {
const q = query.toLowerCase();
const matches = ALL_CONDITIONS.filter(c => {
const cond = CONDITION_DB[c];
return c.toLowerCase().includes(q) || cond.symptoms?.some(s => s.toLowerCase().includes(q)) || cond.category?.toLowerCase().includes(q);
}).slice(0, 6);
setSuggestions(matches);
} else setSuggestions([]);
}, [query]);

const search = async (q) => {
const sq = (q || query).trim();
if (!sq) return;
setLoading(true); setResult(null); setError(null); setSuggestions([]);

```
// Try DB first
const dbMatch = ALL_CONDITIONS.find(c => c.toLowerCase() === sq.toLowerCase())
  || ALL_CONDITIONS.find(c => c.toLowerCase().includes(sq.toLowerCase()))
  || ALL_CONDITIONS.find(c => CONDITION_DB[c].symptoms?.some(s => s.toLowerCase().includes(sq.toLowerCase())));

if (dbMatch) {
  await new Promise(r => setTimeout(r, 220));
  setResult({ ...CONDITION_DB[dbMatch], condition: dbMatch });
  setResultSource("db");
  setLoading(false);
  return;
}

// Fallback to AI
try {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: `You are a medical reference assistant. Return ONLY a JSON object, no markdown, no commentary:
```

{
“condition”: “Full medical name”,
“category”: “One of: Endocrine | Cardiovascular | Respiratory | Neurological | Mental Health | Gastroenterology | Musculoskeletal | Dermatology | Infectious | Oncology | Other”,
“icd”: “ICD-10 code”,
“overview”: “2-3 clear sentences”,
“symptoms”: [“up to 8 symptoms”],
“causes”: [“up to 6 causes”],
“treatments”: [“up to 6 treatments”],
“medications”: [{“name”:“drug”,“type”:“class”,“use”:“what it does”,“warning”:“caution”}],
“related”: [“up to 5 related conditions”],
“urgency”: “One sentence about when to seek care”,
“specialists”: [“relevant specialists”],
“prevalence”: “brief stat if known”
}`,
messages: [{ role: “user”, content: sq }]
})
});
const data = await res.json();
const text = data.content?.map(b => b.text || “”).join(””) || “”;
const clean = text.replace(/`json|`/g, “”).trim();
const parsed = JSON.parse(clean);
setResult(parsed);
setResultSource(“ai”);
} catch {
setError(“Could not retrieve information. Please check your query or try again.”);
} finally {
setLoading(false);
}
};

const filteredBookmarks = categoryFilter === “All”
? bookmarks
: bookmarks.filter(b => b.category === categoryFilter);

return (
<div style={{
minHeight: “100vh”,
background: “#070b14”,
fontFamily: “‘DM Sans’, ‘Helvetica Neue’, sans-serif”,
color: “#e2e8f0”,
}}>
<style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;600&family=DM+Sans:wght@300;400;500;600&display=swap'); * { box-sizing: border-box; } ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(14,165,233,0.3); border-radius: 4px; } input::placeholder { color: #334155; } textarea::placeholder { color: #334155; }`}</style>

```
  {/* Ambient BG — sky blue to match logo */}
  <div style={{
    position: "fixed", top: 0, left: 0, right: 0, height: "100vh",
    background: "radial-gradient(ellipse 70% 50% at 15% 10%, rgba(14,165,233,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 80%, rgba(56,189,248,0.05) 0%, transparent 60%)",
    pointerEvents: "none", zIndex: 0
  }} />

  {/* Top Nav */}
  <nav style={{
    position: "sticky", top: 0, zIndex: 100,
    borderBottom: "1px solid rgba(14,165,233,0.12)",
    background: "rgba(7,11,20,0.94)", backdropFilter: "blur(12px)",
    padding: "0 20px", height: "64px",
    display: "flex", alignItems: "center", justifyContent: "space-between"
  }}>
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAYAAACAvzbMAABUyElEQVR42u3dd5xU1fk/8M85997p24ClIxYEBaMi2BsbTWISo6bsmsREE2M0zRZNLInOjjExlthLUH+aRI26a8fedrEXEFTAXqjL9jL9lvP8/phZWBQQS8o3ft6v1wq4M3fu3Jl7nvOcChAREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREREf2vUbwE/06ygeuthNeGiBhASCEpCtOgUAuFTgjqYaCVQDbyKRhRaIZGLRRaWwHMMmiEQDG4EBEDyP92ZtFULvzrlL+hR9WjyXr36C1115jhVun/vI9dlnR6zc0NwQYP3SQWFpdCDFLK8FoTEQPI/4KkaEyDQoMKhl7Q6j+v3CwYU7Wtb8wO8PVmRskko8OjjbaiCrDFaBs+RMEAWjzjewUr8HskEnpZ5b1Onc28a1A9L/r+ix39V+3du/bTUsCZxgYaDVIpBhMiYgD5P6dJLNRDoEoZwaQD3gx3Hlq7lx8NfcXY4b1MEGxvYqE4KoDBZivxAZ0HpADAB9aEHAWYMAAHQAhQBpA8YNKA5XqrdOA/4/j2I6a//fncmRNe/kBmIsxKiIgB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dU69bzaXG9xpKoaVmOM2t0Eka1FrO0DZU1WVqhSARABLBvQvoEq9M+z8ukL+q+a2KQAWTMy7D/VqU9EDCC0vlSg3FFeDiQ1v108zaup/Zkfin9HQrHRYgAUAeOjKAoChZC2oZUFiAG0C0D8HoFqU4HnixFPKeWKga18hKCtMKCGwwTDxQpbYgESAPBRWlDRArQClO8WbS/Xag+0/7/+q7e5s/QIBdQb9nUQEQPIf7WkaEyDGgwkY45uGZEZPemrvhM/VKzInuJEq4NQqWnJBIAKEMDAFwWlABvlFZC1BiCl4ILS42ACiNIwEFiiAaUALYB283kVFBbAFO53iqse6L9i5ktrUxd2khMRA8j/6UACAMMOf3ScGbP1zCAS29kKhXd2A9k6UOEaHQpXG5QyiqHT+AabpJS/9oOwvYLAqFXwC8ssP/+8NpkF4VzmifbZ099fJxtqgEazMviofdWJiBhA/kuJKDS2WmicZaDW7XuoB6wnT1o8PmdFJhtx4giFahEEUxSk0kAUlAGMdi0dbfeNWSHFTHfU7VkNy3+t57LdBtb7Ophl2MdBRPQ/l5UkS2tRJT+DhRelvP1sssUe3LqWiIgZyOcnPVFIlud11ANY3KqAWR9+2LQhzVDNzUBzvQG4QyARERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERHRR/n/6AQETmc+U2UAAAAASUVORK5CYII="
        alt="Symptara"
        style={{ height: "36px", width: "auto", objectFit: "contain" }}
      />
    </div>
    <div style={{ display: "flex", gap: "2px" }}>
      {[["search", ICONS.search, "Search"], ["bookmarks", ICONS.bookmark, `Saved (${bookmarks.length})`]].map(([id, icon, label]) => (
        <button key={id} onClick={() => setActiveTab(id)} style={{
          padding: "7px 14px", borderRadius: "8px", border: "none", cursor: "pointer",
          background: activeTab === id ? "rgba(14,165,233,0.15)" : "transparent",
          color: activeTab === id ? "#38bdf8" : "#475569",
          fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "center", gap: "6px",
          transition: "all 0.18s", fontFamily: "inherit"
        }}>
          <Icon d={icon} size={14} color={activeTab === id ? "#38bdf8" : "#475569"} />
          {label}
        </button>
      ))}
    </div>
  </nav>

  <main style={{ maxWidth: "820px", margin: "0 auto", padding: "32px 20px 60px", position: "relative", zIndex: 1 }}>

    {/* ── SEARCH TAB ── */}
    {activeTab === "search" && (
      <>
        {!result && !loading && (
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "5px 14px", borderRadius: "20px",
              background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)",
              fontSize: "12px", color: "#38bdf8", marginBottom: "18px", fontWeight: 500
            }}>
              <Icon d={ICONS.sparkle} size={12} color="#38bdf8" /> AI + Database Powered
            </div>
            <h1 style={{
              margin: "0 0 10px", fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: "clamp(26px,5vw,44px)", fontWeight: 300, color: "#f8fafc",
              letterSpacing: "-0.03em", lineHeight: 1.15
            }}>
              Symptara<br /><em style={{ fontStyle: "italic", color: "#38bdf8" }}>medical reference, reimagined</em>
            </h1>
            <p style={{ color: "#475569", fontSize: "14px", margin: 0 }}>
              Search by condition name, symptom, keyword, or ICD code
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div style={{ position: "relative", marginBottom: "8px" }}>
          <div style={{
            display: "flex", borderRadius: "13px", overflow: "visible",
            border: "1.5px solid rgba(14,165,233,0.35)",
            background: "rgba(15,20,35,0.9)",
            boxShadow: "0 0 0 5px rgba(14,165,233,0.04), 0 4px 24px rgba(0,0,0,0.3)",
          }}>
            <div style={{ padding: "0 16px", display: "flex", alignItems: "center", color: "#334155" }}>
              <Icon d={ICONS.search} size={18} color="#0ea5e9" />
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && search()}
              placeholder="diabetes, chest pain, fatigue, J45…"
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontSize: "15px", color: "#f1f5f9", padding: "15px 0", fontFamily: "inherit"
              }}
            />
            {query && (
              <button onClick={() => { setQuery(""); setResult(null); setSuggestions([]); }} style={{
                padding: "0 12px", background: "transparent", border: "none",
                cursor: "pointer", color: "#334155"
              }}>
                <Icon d={ICONS.close} size={14} color="#334155" />
              </button>
            )}
            <button onClick={() => search()} disabled={loading} style={{
              margin: "7px", padding: "10px 22px",
              background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
              border: "none", borderRadius: "9px", cursor: loading ? "not-allowed" : "pointer",
              color: "#fff", fontWeight: 600, fontSize: "14px",
              opacity: loading ? 0.6 : 1, transition: "opacity 0.2s", fontFamily: "inherit",
              boxShadow: "0 2px 12px rgba(14,165,233,0.4)"
            }}>
              {loading ? "…" : "Search"}
            </button>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div style={{
              position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
              background: "#0d1220", border: "1px solid rgba(14,165,233,0.2)",
              borderRadius: "12px", overflow: "hidden", zIndex: 200,
              boxShadow: "0 12px 40px rgba(0,0,0,0.5)"
            }}>
              {suggestions.map((s, i) => {
                const cond = CONDITION_DB[s];
                const cc = CATEGORY_COLORS[cond?.category] || "#0ea5e9";
                return (
                  <div key={i} onClick={() => { setQuery(s); setSuggestions([]); search(s); }}
                    style={{
                      padding: "11px 16px", cursor: "pointer", fontSize: "14px", color: "#cbd5e1",
                      borderBottom: i < suggestions.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                      transition: "background 0.12s", display: "flex", justifyContent: "space-between", alignItems: "center"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(14,165,233,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: cc, flexShrink: 0 }} />
                      {s}
                    </div>
                    {cond && <span style={{ fontSize: "10px", color: "#334155" }}>{cond.category}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div style={{
          padding: "9px 14px", borderRadius: "8px", marginBottom: "24px",
          background: "rgba(251,191,36,0.04)", border: "1px solid rgba(251,191,36,0.12)",
          fontSize: "11px", color: "#78716c", lineHeight: 1.5
        }}>
          ⚠ For informational purposes only. This does not constitute medical advice. Always consult a qualified healthcare provider.
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "56px", color: "#334155" }}>
            <div style={{
              width: "44px", height: "44px", margin: "0 auto 18px",
              border: "3px solid rgba(14,165,233,0.15)",
              borderTopColor: "#0ea5e9", borderRadius: "50%",
              animation: "spin 0.75s linear infinite"
            }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <div style={{ fontSize: "13px" }}>Searching database & AI…</div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            padding: "16px 20px", borderRadius: "12px",
            background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
            color: "#fca5a5", fontSize: "14px", textAlign: "center"
          }}>{error}</div>
        )}

        {/* Result */}
        {result && !loading && (
          <ResultPanel
            data={result}
            source={resultSource}
            query={query}
            bookmarks={bookmarks}
            setBookmarks={setBookmarks}
            notes={notes}
            setNotes={setNotes}
            onRelated={(r) => { setQuery(r); search(r); }}
          />
        )}

        {/* Quick Browse — only when no result */}
        {!result && !loading && (
          <div>
            <SectionHead><Icon d={ICONS.db} size={12} color="#475569" /> Browse Database</SectionHead>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "18px" }}>
              {categories.map(c => (
                <Pill key={c} active={categoryFilter === c} onClick={() => setCategoryFilter(c)}>{c}</Pill>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "8px" }}>
              {ALL_CONDITIONS
                .filter(c => categoryFilter === "All" || CONDITION_DB[c].category === categoryFilter)
                .map(c => {
                  const cond = CONDITION_DB[c];
                  const cc = CATEGORY_COLORS[cond.category] || "#0ea5e9";
                  return (
                    <button key={c} onClick={() => { setQuery(c); search(c); }} style={{
                      padding: "12px 14px", borderRadius: "11px", textAlign: "left",
                      border: `1px solid ${cc}18`,
                      background: `linear-gradient(135deg,${cc}08,transparent)`,
                      cursor: "pointer", transition: "all 0.18s", fontFamily: "inherit"
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = `${cc}40`; e.currentTarget.style.background = `linear-gradient(135deg,${cc}14,transparent)`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = `${cc}18`; e.currentTarget.style.background = `linear-gradient(135deg,${cc}08,transparent)`; }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: 500, color: "#e2e8f0", marginBottom: "4px" }}>{c}</div>
                      <div style={{ fontSize: "10px", color: cc, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{cond.category}</div>
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </>
    )}

    {/* ── BOOKMARKS TAB ── */}
    {activeTab === "bookmarks" && (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h2 style={{ margin: "0 0 4px", fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 400, fontSize: "24px", color: "#f1f5f9" }}>Saved Conditions</h2>
            <p style={{ margin: 0, color: "#475569", fontSize: "13px" }}>{bookmarks.length} condition{bookmarks.length !== 1 ? "s" : ""} bookmarked</p>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.3 }}>🔖</div>
            <div style={{ color: "#334155", fontSize: "14px" }}>No saved conditions yet.</div>
            <div style={{ color: "#1e293b", fontSize: "13px", marginTop: "6px" }}>Search for a condition and click the bookmark icon to save it here.</div>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
              {categories.filter(c => c === "All" || bookmarks.some(b => b.category === c)).map(c => (
                <Pill key={c} active={categoryFilter === c} onClick={() => setCategoryFilter(c)}>{c}</Pill>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredBookmarks.map((b, i) => {
                const cc = CATEGORY_COLORS[b.category] || "#0ea5e9";
                return (
                  <Card key={i} style={{ borderColor: `${cc}18` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "17px", fontWeight: 400, color: "#f1f5f9" }}>{b.condition}</span>
                          <Tag color={cc}>{b.category}</Tag>
                          {b.icd && <Tag color="#475569">ICD-10: {b.icd}</Tag>}
                        </div>
                        <p style={{ margin: "0 0 10px", color: "#64748b", fontSize: "13px", lineHeight: 1.55 }}>{b.overview}</p>
                        {b.symptoms?.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" }}>
                            {b.symptoms.slice(0, 4).map((s, j) => (
                              <span key={j} style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "12px", background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.15)", color: "#d97706" }}>{s}</span>
                            ))}
                            {b.symptoms.length > 4 && <span style={{ fontSize: "11px", color: "#475569" }}>+{b.symptoms.length - 4} more</span>}
                          </div>
                        )}
                        {notes[b.key] && (
                          <div style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic", marginBottom: "6px" }}>
                            📝 {notes[b.key]}
                          </div>
                        )}
                        <div style={{ fontSize: "11px", color: "#1e293b" }}>Saved {b.savedAt}</div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                        <button onClick={() => { setQuery(b.condition); setActiveTab("search"); search(b.condition); }} style={{
                          padding: "7px 14px", borderRadius: "8px", border: "none", cursor: "pointer",
                          background: "rgba(14,165,233,0.12)", color: "#7dd3fc",
                          fontSize: "12px", fontWeight: 600, fontFamily: "inherit"
                        }}>View</button>
                        <button onClick={() => setBookmarks(prev => prev.filter((_, idx) => idx !== i))} style={{
                          padding: "7px 14px", borderRadius: "8px",
                          border: "1px solid rgba(239,68,68,0.2)", background: "transparent",
                          color: "#f87171", fontSize: "12px", cursor: "pointer", fontFamily: "inherit"
                        }}>Remove</button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    )}
  </main>

  {/* Footer */}
  <div style={{
    textAlign: "center", padding: "20px", fontSize: "11px",
    color: "#1e293b", borderTop: "1px solid rgba(255,255,255,0.03)",
    position: "relative", zIndex: 1
  }}>
    Symptara Pro · For informational use only · Not a substitute for professional medical advice
  </div>
</div>
```

);
}
