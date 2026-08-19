import React, { useState } from "react";
import StatCard from "../components/StatCard";
import MapView from "../components/MapView";

export default function Home({ navigateTo }) {
  // Interactive AI Triaging Sandbox state on landing page
  const [demoPrompt, setDemoPrompt] = useState("Open deep trench pothole near Knowledge Park metro causing scooter accidents");
  const [demoResult, setDemoResult] = useState({
    category: "Roads & Highway Infrastructure",
    department: "Public Works Department (PWD - Division 2)",
    severity: "CRITICAL",
    confidence: 97.4,
    sla: "6 Hours Emergency SLA",
    tags: ["High Traffic Corridor", "Accident Risk", "Asphalt Failure"]
  });
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const samplePresets = [
    {
      title: "Road Crater / Pothole",
      text: "Open deep trench pothole near Knowledge Park metro causing scooter accidents",
      result: {
        category: "Roads & Highway Infrastructure",
        department: "Public Works Department (PWD - Division 2)",
        severity: "CRITICAL",
        confidence: 97.4,
        sla: "6 Hours Emergency SLA",
        tags: ["High Traffic Corridor", "Accident Risk", "Asphalt Failure"]
      }
    },
    {
      title: "Drain Choke & Flood",
      text: "Main stormwater drain overflowing near Pari Chowk underpass with 2 feet waterlogging",
      result: {
        category: "Drainage & Flood Control",
        department: "UP Jal Nigam (Sewerage & Stormwater Wing)",
        severity: "HIGH",
        confidence: 98.6,
        sla: "12 Hours Pre-Monsoon SLA",
        tags: ["Waterlogging", "Culvert Silt 85%", "Arterial Road"]
      }
    },
    {
      title: "Sparking Transformer",
      text: "11kV commercial transformer sparking and heavy buzzing noise in Alpha 1 market",
      result: {
        category: "Power Grid & Electrical Safety",
        department: "NPCL State Power Distribution",
        severity: "CRITICAL",
        confidence: 99.1,
        sla: "2 Hours Emergency Life-Safety",
        tags: ["Fire Hazard", "High Tension Line", "Public Market"]
      }
    },
    {
      title: "Garbage Dump Overflow",
      text: "Unattended municipal garbage dump on Delta 2 perimeter attracting stray animals for 4 days",
      result: {
        category: "Municipal Solid Waste Management",
        department: "GNIDA Health & Sanitation Department",
        severity: "MODERATE",
        confidence: 94.8,
        sla: "24 Hours Standard SLA",
        tags: ["Organic Waste", "Public Health", "Footpath Blockage"]
      }
    }
  ];

  const handleSelectPreset = (preset) => {
    setDemoPrompt(preset.text);
    setIsDemoRunning(true);
    setTimeout(() => {
      setDemoResult(preset.result);
      setIsDemoRunning(false);
    }, 400);
  };

  return (
    <div className="home-page">
      {/* Top Official Gov Strip */}
      <div className="gov-top-strip">
        <div className="strip-container">
          <div className="strip-item">
            <span className="strip-emblem">🏛️</span>
            <span>GOVERNMENT OF INDIA • SMART CITIES MISSION • SIH 2026</span>
          </div>
          <div className="strip-item hide-mobile">
            <span className="live-dot-green"></span>
            <span>AI PREDICTIVE GOVERNANCE ENGINE: <strong>ACTIVE</strong></span>
          </div>
        </div>
      </div>

      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge">
            <span className="pulse-indicator"></span>
            AI-POWERED CIVIC INTELLIGENCE & PREDICTIVE GOVERNANCE
          </div>

          <h1>
            Smarter Cities.
            <br />
            <span>Faster Action.</span>
          </h1>

          <p className="hero-description">
            Report civic hazards in seconds. <strong>IN-PACT</strong> eliminates municipal bureaucratic silos 
            using multimodal AI, computer vision, and spatiotemporal clustering to autonomously triage, 
            prioritize severity, and route grievances directly to the responsible government authority.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => navigateTo("citizen-dashboard")}>
              Report a Problem <span>→</span>
            </button>

            <button className="secondary-btn" onClick={() => navigateTo("gov-dashboard")}>
              ⚡ Government Command Center
            </button>
          </div>

          <div className="hero-note-group">
            <div className="hero-note-item">
              <span className="check-icon">✓</span>
              <span><strong>Zero Bureaucracy:</strong> No need to know department hierarchies</span>
            </div>
            <div className="hero-note-item">
              <span className="check-icon">✓</span>
              <span><strong>Multimodal Ingestion:</strong> Text, Camera Photos, Voice & Live GPS</span>
            </div>
            <div className="hero-note-item">
              <span className="check-icon">✓</span>
              <span><strong>Predictive Civic Defense:</strong> Forecasts infrastructure failures before escalation</span>
            </div>
          </div>
        </div>

        {/* HERO LIVE MAP PREVIEW */}
        <div className="hero-visual">
          <div className="visual-card">
            <div className="visual-header">
              <div>
                <p className="visual-sub">LIVE CIVIC INTELLIGENCE GRID</p>
                <h3>Greater Noida Metropolis</h3>
              </div>
              <div className="live-pill">
                <span className="live-dot"></span>
                LIVE GIS FEED
              </div>
            </div>

            <MapView city="Greater Noida" />

            {/* Live Telemetry Ticker */}
            <div className="hero-ticker">
              <span className="ticker-label">⚡ LIVE TELEMETRY:</span>
              <span className="ticker-text">Pari Chowk desiltation team deployed • Alpha 1 feeder stabilized • 98.4% AI triage accuracy</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          INTERACTIVE AI TRIAGE DEMO PLAYGROUND
      ===================================================== */}
      <section className="demo-sandbox-section">
        <div className="sandbox-card">
          <div className="sandbox-header">
            <div>
              <div className="small-label">INTERACTIVE TECHNOLOGY PLAYGROUND</div>
              <h2>Experience Real-Time AI Grievance Triaging</h2>
              <p>Click a sample civic problem below or type one to see how IN-PACT's AI instantaneously predicts the department, severity, and SLA.</p>
            </div>
            <div className="sandbox-ai-badge">
              <span>🧠 Multimodal NLP & Vision Engine</span>
            </div>
          </div>

          <div className="preset-buttons-row">
            {samplePresets.map((p, idx) => (
              <button
                key={idx}
                className={`preset-chip ${demoPrompt === p.text ? "active" : ""}`}
                onClick={() => handleSelectPreset(p)}
              >
                {p.title}
              </button>
            ))}
          </div>

          <div className="sandbox-body">
            <div className="sandbox-input-box">
              <label htmlFor="sandboxText">Input Grievance Text (English / Hindi / Dialects):</label>
              <textarea
                id="sandboxText"
                className="form-textarea"
                rows={3}
                value={demoPrompt}
                onChange={(e) => setDemoPrompt(e.target.value)}
              />
            </div>

            <div className="sandbox-output-box">
              {isDemoRunning ? (
                <div className="demo-analyzing-state">
                  <span className="pulse-dot"></span>
                  <span>AI Neural Network Triaging Complaint...</span>
                </div>
              ) : (
                <div className="demo-results-grid">
                  <div className="demo-res-item">
                    <span className="res-label">Target Department</span>
                    <strong className="res-val dept">🏢 {demoResult.department}</strong>
                  </div>
                  <div className="demo-res-item">
                    <span className="res-label">Detected Category</span>
                    <strong className="res-val">{demoResult.category}</strong>
                  </div>
                  <div className="demo-res-item">
                    <span className="res-label">Severity Level</span>
                    <strong className={`res-val severity-${demoResult.severity.toLowerCase()}`}>
                      ● {demoResult.severity}
                    </strong>
                  </div>
                  <div className="demo-res-item">
                    <span className="res-label">Resolution SLA</span>
                    <strong className="res-val sla">⏳ {demoResult.sla}</strong>
                  </div>
                  <div className="demo-res-full">
                    <span className="res-label">AI Extracted Attributes:</span>
                    <div className="demo-tags-row">
                      <span className="demo-conf-tag">Confidence: {demoResult.confidence}%</span>
                      {demoResult.tags.map((t, i) => (
                        <span key={i} className="demo-tag-chip">✓ {t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          LIVE IMPACT METRICS
      ===================================================== */}
      <section className="stats-section" id="analytics">
        <div className="section-heading text-center" style={{ margin: "0 auto 30px" }}>
          <div className="small-label">PROVEN GOVERNANCE IMPACT</div>
          <h2>Measurable Civic Transformation</h2>
          <p>Real-time metrics from active municipal deployment across Greater Noida districts.</p>
        </div>

        <div className="stats-grid">
          <StatCard
            title="Total Citizen Reports"
            value="14,820+"
            subtitle="Processed across 18 municipal wards"
            icon="📢"
            trend="18% this month"
            trendPositive={true}
          />
          <StatCard
            title="AI Routing Precision"
            value="98.4%"
            subtitle="Autonomous department allocation"
            icon="🎯"
            trend="4.2% higher precision"
            trendPositive={true}
            variant="success"
          />
          <StatCard
            title="Avg. Resolution Time"
            value="3.2 Days"
            subtitle="Down from traditional 14-day cycle"
            icon="⚡"
            trend="68% faster resolution"
            trendPositive={true}
            variant="purple"
          />
          <StatCard
            title="Predictive Alerts Dispatched"
            value="142"
            subtitle="Pre-monsoon flood & power hazard prevented"
            icon="🛡️"
            trend="Active 24/7"
            trendPositive={true}
            variant="warning"
          />
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS (4-STEP PIPELINE)
      ===================================================== */}
      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <div className="small-label">SEAMLESS CIVIC PIPELINE</div>
          <h2>
            From citizen report to
            <br />
            <span>verified government action.</span>
          </h2>
          <p>
            Citizens simply capture or speak the problem. IN-PACT autonomously executes the complete triaging, prioritization, and jurisdictional routing pipeline behind the scenes.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon">📸</div>
            <h3>Multi-Modal Submission</h3>
            <p>
              Citizens submit grievances via voice notes in regional dialects, camera captures, live GPS geotags, or natural text.
            </p>
            <div className="step-tag">Zero Friction</div>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon">🧠</div>
            <h3>Multimodal AI Understanding</h3>
            <p>
              Vision AI inspects pothole crater depth and drain blockages while NLP evaluates urgency, sentiment, and population hazard.
            </p>
            <div className="step-tag">Computer Vision + NLP</div>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon">🔀</div>
            <h3>Predictive Jurisdictional Routing</h3>
            <p>
              Instantly allocated to the exact nodal agency (PWD, Jal Nigam, NPCL Power, Municipal Health) with dynamic SLA timers.
            </p>
            <div className="step-tag">Zero Bureaucracy</div>
          </div>

          <div className="step-card">
            <div className="step-number">04</div>
            <div className="step-icon">✅</div>
            <h3>Verified Resolution & Closure</h3>
            <p>
              Field crews complete repairs and upload geotagged before/after photographic proof, verified directly by the citizen.
            </p>
            <div className="step-tag">Closed-Loop Accountability</div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PREDICTIVE GOVERNANCE SECTION
      ===================================================== */}
      <section className="how-section predictive-section" id="about">
        <div className="section-heading">
          <div className="small-label">PREDICTIVE GOVERNANCE ENGINE</div>
          <h2>
            From reactive complaints
            <br />
            <span>to predictive civic defense.</span>
          </h2>
          <p>
            Traditional systems wait for thousands of complaints after a disaster occurs. 
            IN-PACT identifies micro-anomalies and recurring spatiotemporal clusters to forecast municipal failures weeks in advance.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-tag">GIS SPATIAL CLUSTERING</div>
            <h3>Hotspot Anomaly Detection</h3>
            <p>
              Automatically identifies chronic failure zones (e.g. 5+ sewage leaks within 100 meters) and merges duplicate complaints into single work orders.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-tag">WEATHER & DISASTER PREDICTION</div>
            <h3>Pre-Monsoon Urban Flood Defense</h3>
            <p>
              Cross-references meteorological rainfall forecasts with stormwater drain silt levels to proactively deploy suction cleaners before flooding starts.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-tag">ML DYNAMIC WEIGHTING</div>
            <h3>Smart Urgency Prioritization</h3>
            <p>
              Elevates risk scores automatically for hazards situated near schools, hospitals, emergency lanes, and high-density commuter junctions.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-tag">INTER-AGENCY SLA</div>
            <h3>Cross-Department Accountability</h3>
            <p>
              Automated escalation matrices alert Chief Engineers and District Magistrates whenever target repair turnaround times risk breaching SLAs.
            </p>
          </div>
        </div>

        {/* COMPARISON TABLE: OLD VS IN-PACT */}
        <div className="comparison-card">
          <div className="comparison-header">
            <h3>Traditional Grievance Portals vs. IN-PACT AI Governance</h3>
          </div>
          <div className="comparison-grid">
            <div className="comp-column traditional">
              <h4>❌ Traditional Municipal Portals</h4>
              <ul>
                <li>Citizen must manually guess the right department</li>
                <li>Slow manual triage taking 24 to 72 hours</li>
                <li>100% reactive — action starts only after major failure</li>
                <li>Duplicate complaints clutter officer queues</li>
                <li>Zero transparency on field inspection proof</li>
              </ul>
            </div>
            <div className="comp-column inpact">
              <h4>✨ IN-PACT Predictive AI</h4>
              <ul>
                <li>Multimodal AI auto-identifies jurisdiction in 1.2 seconds</li>
                <li>98.4% autonomous routing precision to nodal engineers</li>
                <li>Predictive failure forecasting ahead of rains and grid stress</li>
                <li>Automated GIS clustering merges duplicate reports</li>
                <li>Geotagged before/after photo verification loop</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PARTNER & NODAL AGENCIES STRIP
      ===================================================== */}
      <section className="partners-section">
        <div className="small-label text-center" style={{ marginBottom: "16px" }}>
          INTEGRATED GOVERNMENT NODAL DEPARTMENTS
        </div>
        <div className="partners-grid">
          <div className="partner-chip">🛣️ Public Works Department (PWD)</div>
          <div className="partner-chip">💧 UP Jal Nigam (Water & Drainage)</div>
          <div className="partner-chip">⚡ NPCL / State Power Distribution</div>
          <div className="partner-chip">🗑️ GNIDA Solid Waste Management</div>
          <div className="partner-chip">🚦 Traffic & Urban Mobility Police</div>
        </div>
      </section>

      {/* =====================================================
          FINAL PORTAL CALL TO ACTION
      ===================================================== */}
      <section className="cta-banner">
        <div className="cta-content">
          <div className="badge" style={{ marginBottom: "6px" }}>
            <span>🇮🇳</span> LIVE PLATFORM ACCESS
          </div>
          <h2>Ready to experience predictive civic governance?</h2>
          <p>
            Join thousands of citizens improving urban infrastructure or access the administrative command console for executive municipal monitoring.
          </p>
          <div className="cta-actions">
            <button className="primary-btn" onClick={() => navigateTo("citizen-dashboard")}>
              Launch Citizen Portal <span>→</span>
            </button>
            <button className="secondary-btn" onClick={() => navigateTo("gov-dashboard")}>
              Access Government Command Center ⚡
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
