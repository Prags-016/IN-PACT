import "./App.css";

function App() {
  return (
    <div className="app">
      {/* =====================================================
          NAVBAR
      ===================================================== */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">I</div>
          <span>IN-PACT</span>
        </div>

        <div className="nav-links">
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>

          <button className="login-btn">
            Government Login
          </button>

          <button className="login-btn">
            Citizen Login
          </button>
        </div>
      </nav>


      {/* =====================================================
          HERO SECTION
      ===================================================== */}
      <main>
        <section className="hero">

          {/* HERO CONTENT */}
          <div className="hero-content">

            <div className="badge">
              <span></span>
              AI-POWERED CIVIC INTELLIGENCE
            </div>

            <h1>
              Smarter Cities.
              <br />
              <span>Faster Action.</span>
            </h1>

            <p className="hero-description">
              Report civic problems in seconds. IN-PACT uses artificial
              intelligence to understand, prioritize and route grievances
              to the right government authority.
            </p>

            <div className="hero-buttons">
              <button className="primary-btn">
                Report a Problem
                <span>→</span>
              </button>

              <button className="secondary-btn">
                Explore Dashboard
              </button>
            </div>

            <div className="hero-note">
              <span>✓</span>
              No need to know which department to contact
            </div>

          </div>


          {/* =================================================
              HERO DASHBOARD
          ================================================= */}
          <div className="hero-visual">

            <div className="visual-card">

              <div className="visual-header">

                <div>
                  <p>LIVE CIVIC INTELLIGENCE</p>
                  <h3>Greater Noida</h3>
                </div>

                <div className="live">
                  <span></span>
                  LIVE
                </div>

              </div>


              {/* MAP */}
              <div className="map">

                <div className="road road-one"></div>
                <div className="road road-two"></div>
                <div className="road road-three"></div>


                <div className="map-point point-one">
                  !
                </div>

                <div className="map-point point-two">
                  !
                </div>

                <div className="map-point point-three">
                  !
                </div>

              </div>


              {/* MAP STATISTICS */}
              <div className="map-stats">

                <div>
                  <strong>1,284</strong>
                  <span>ACTIVE ISSUES</span>
                </div>

                <div>
                  <strong>42</strong>
                  <span>CRITICAL</span>
                </div>

                <div>
                  <strong>87%</strong>
                  <span>RESOLVED</span>
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            STATISTICS
        ===================================================== */}
        <section className="stats">

          <div className="stat">
            <h2>12K+</h2>
            <p>Citizen Reports</p>
          </div>

          <div className="stat">
            <h2>1.2K</h2>
            <p>Issues Tracked</p>
          </div>

          <div className="stat">
            <h2>87%</h2>
            <p>Resolution Rate</p>
          </div>

          <div className="stat">
            <h2>24/7</h2>
            <p>Intelligence Monitoring</p>
          </div>

        </section>


        {/* =====================================================
            HOW IT WORKS
        ===================================================== */}
        <section
          className="how-section"
          id="how-it-works"
        >

          <div className="section-heading">

            <div className="small-label">
              HOW IT WORKS
            </div>

            <h2>
              From complaint to
              <br />
              <span>government action.</span>
            </h2>

            <p>
              Citizens simply report the problem.
              IN-PACT handles the complexity behind
              the scenes using AI-powered intelligence.
            </p>

          </div>


          {/* STEPS */}
          <div className="steps">

            <div className="step">

              <div className="step-number">
                01
              </div>

              <h3>Report</h3>

              <p>
                Submit a complaint using text,
                photo, voice or your location.
              </p>

            </div>


            <div className="step">

              <div className="step-number">
                02
              </div>

              <h3>Understand</h3>

              <p>
                AI identifies the problem, severity
                and infrastructure involved.
              </p>

            </div>


            <div className="step">

              <div className="step-number">
                03
              </div>

              <h3>Route</h3>

              <p>
                The system identifies the appropriate
                department and responsible authority.
              </p>

            </div>


            <div className="step">

              <div className="step-number">
                04
              </div>

              <h3>Resolve</h3>

              <p>
                Authorities receive prioritized,
                actionable intelligence.
              </p>

            </div>

          </div>

        </section>


        {/* =====================================================
            ABOUT / INTELLIGENCE SECTION
        ===================================================== */}
        <section
          className="how-section"
          id="about"
        >

          <div className="section-heading">

            <div className="small-label">
              WHY IN-PACT
            </div>

            <h2>
              From reactive governance
              <br />
              <span>to predictive governance.</span>
            </h2>

            <p>
              IN-PACT doesn't simply collect complaints.
              It transforms scattered citizen reports into
              structured, prioritized and actionable intelligence
              for government authorities.
            </p>

          </div>


          <div className="steps">

            <div className="step">

              <div className="step-number">
                AI
              </div>

              <h3>Understand</h3>

              <p>
                Natural language and computer vision
                understand what citizens are reporting.
              </p>

            </div>


            <div className="step">

              <div className="step-number">
                GIS
              </div>

              <h3>Locate</h3>

              <p>
                Geographic intelligence identifies the
                exact affected area and nearby issues.
              </p>

            </div>


            <div className="step">

              <div className="step-number">
                ML
              </div>

              <h3>Prioritize</h3>

              <p>
                AI evaluates severity, recurrence,
                affected population and safety risk.
              </p>

            </div>


            <div className="step">

              <div className="step-number">
                PREDICT
              </div>

              <h3>Prevent</h3>

              <p>
                Historical and environmental data can
                help predict recurring civic problems.
              </p>

            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default App;