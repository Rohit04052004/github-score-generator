import React, { useState } from 'react';
import { Github, AlertTriangle, Download, Sparkles } from 'lucide-react';

export default function App() {
  const [repoLink, setRepoLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [error, setError] = useState(null);
  const [reportText, setReportText] = useState("");
  const [displayRepoLink, setDisplayRepoLink] = useState("");

  const handleAnalyze = async () => {
    setError(null);
    setReportReady(false);

    if (!repoLink.trim() || !repoLink.startsWith("https://github.com/")) {
      setError("Please enter a valid GitHub repository URL.");
      return;
    }

    setIsLoading(true);
    setDisplayRepoLink(repoLink);

    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoLink }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ error: "An unknown error occurred." }));
        throw new Error(data.error || `HTTP error! Status: ${response.status}`);
      }

      setTimeout(async () => {
        try {
          const reportRes = await fetch("http://localhost:5000/report.txt");
          if (!reportRes.ok) throw new Error("Could not fetch the report file.");

          const text = await reportRes.text();
          setReportText(text);
          setReportReady(true);
        } catch (fetchErr) {
          setError(`Failed to retrieve the report. ${fetchErr.message}`);
        } finally {
          setIsLoading(false);
        }
      }, 2000);

    } catch (err) {
      console.error("Backend communication error:", err);
      setError(err.message || "Something went wrong. Please ensure your local backend is running.");
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Google Font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        body {
          font-family: 'Inter', sans-serif;
          margin: 0;
          color: white;
        }
        h1, h2, h3, h4, h5, h6, p, span, a, input, button {
          font-family: 'Inter', sans-serif;
        }
        .main-container {
          box-sizing: border-box;
          min-height: 100vh;
          background-color: #0d0c1d;
          background-image: radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120, 119, 198, 0.3), rgba(255, 255, 255, 0));
          display: flex;
          justify-content: center;
          padding: 3rem 1.5rem;
        }
        .content-wrapper {
          width: 100%;
          max-width: 640px;
          text-align: center;
        }
        .title-gradient {
          background-image: linear-gradient(to right, #c084fc, #f472b6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subtitle {
          color: #94a3b8;
          font-size: 1rem;
          max-width: 28rem;
          margin: 0 auto;
        }
        .input-card-wrapper {
          margin-top: 2rem;
          padding: 2px;
          border-radius: 1rem;
          background: linear-gradient(90deg, rgba(107, 43, 193, 0.3), rgba(69, 58, 132, 0.3));
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .input-card {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 0.5rem;
          background-color: #111021;
          padding: 0.5rem;
          border-radius: 0.9rem;
          flex-wrap: wrap;
        }
        .input-field-wrapper {
          position: relative;
          flex-grow: 1;
        }
        .input-field {
          width: 100%;
          height: 3.5rem;
          background-color: transparent;
          border: none;
          border-radius: 0.75rem;
          padding-left: 2.75rem;
          color: white;
          font-size: 1rem;
        }
        .input-field:focus {
          outline: none;
        }
        .analyze-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          height: 3rem;
          padding: 0 1.25rem;
          background-image: linear-gradient(to right, #a855f7, #6366f1);
          border: none;
          border-radius: 0.75rem;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(168, 85, 247, 0.2);
        }
        .analyze-button:hover {
          opacity: 0.9;
          box-shadow: 0 6px 20px rgba(168, 85, 247, 0.3);
        }
        .analyze-button:disabled {
          opacity: 0.5;
          cursor: wait;
        }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }

        pre {
          font-size: 0.9rem;
          line-height: 1.5;
          font-family: 'Courier New', Courier, monospace;
        }
      `}</style>

      <main className="main-container">
        <div className="content-wrapper">
          <header className="mb-10 text-center">
            <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl title-gradient">GitHub Insight</h1>
            <p className="subtitle">
              Generate an instant developer profile and repository analysis from any public GitHub URL.
            </p>
          </header>

          <div className="input-card-wrapper">
            <div className="input-card">
              <div className="input-field-wrapper">
                <Github className="absolute -translate-y-1/2 left-3 top-1/2 text-slate-300" size={20} />
                <input
                  className="input-field"
                  placeholder="e.g., https://github.com/facebook/react"
                  value={repoLink}
                  onChange={(e) => setRepoLink(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleAnalyze()}
                  disabled={isLoading}
                />
              </div>
              <button onClick={handleAnalyze} disabled={isLoading} className="analyze-button">
                {isLoading ? 'Analyzing...' : <><Sparkles size={18} /> Analyze</>}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 mt-6 text-red-300 border rounded-lg bg-red-900/50 border-red-700/50 animate-fade-in">
              <AlertTriangle size={20} />
              <span>{error}</span>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center gap-3 mt-8">
              <div className="w-10 h-10 border-4 border-purple-400 rounded-full border-t-transparent animate-spin"></div>
              <p className="text-slate-400">Analyzing repository... this may take a moment.</p>
            </div>
          )}

          {reportReady && (
            <div className="p-6 mt-8 border shadow-2xl bg-slate-900/70 backdrop-blur-xl border-slate-700/50 rounded-2xl shadow-black/20 animate-fade-in">
              <div className="flex flex-col items-start justify-between mb-4 sm:flex-row sm:items-center">
                <h2 className="flex items-center gap-2 mb-2 text-xl font-bold text-white sm:mb-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Analysis Complete
                </h2>
                <a
                  href="http://localhost:5000/report.txt"
                  download="github_insight_report.txt"
                  className="flex items-center gap-2 px-4 py-2 text-sm transition-colors duration-300 bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  <Download size={16} /> Download Report
                </a>
              </div>
              <p className="mb-4 text-sm truncate text-slate-400">
                Report for: <a href={displayRepoLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-400">{displayRepoLink}</a>
              </p>
              <pre className="whitespace-pre-wrap bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 overflow-x-auto max-h-[50vh]">{reportText}</pre>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
