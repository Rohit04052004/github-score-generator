import React, { useState } from "react";
import { FileText } from "lucide-react";

function App() {
  const [repoLink, setRepoLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [timestamp, setTimestamp] = useState(null);

  const [reportText, setReportText] = useState("");

const handleAnalyze = async () => {
  if (!repoLink.startsWith("https://github.com/")) {
    alert("❌ Please enter a valid GitHub repository URL.");
    return;
  }

  setIsLoading(true);
  setReportReady(false);
  setReportText("");
  setTimestamp(new Date().toLocaleString());

  try {
    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repo_url: repoLink }),
    });

    const data = await response.json();

    if (data.error) {
      alert("❌ " + data.error);
      setIsLoading(false);
      return;
    }

    // Wait and fetch report
    setTimeout(async () => {
      const report = await fetch("http://localhost:5000/report.txt");
      const text = await report.text();
      setReportText(text);
      setReportReady(true);
      setIsLoading(false);
    }, 2000);
  } catch (err) {
    console.error("❌ Backend error:", err);
    alert("Something went wrong. Is your backend running?");
    setIsLoading(false);
  }
};



  return (
    <main className="min-h-screen bg-[#1e1e2f] text-white p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">GitHub Score Maker</h1>
        <p className="text-gray-400 text-center mb-8">
          Analyze any public GitHub repository and generate a developer profile.
        </p>

        <div className="bg-[#2a2a3a] p-4 rounded-xl">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-[#1e1e2f] text-white border border-gray-600 rounded-lg p-2"
              placeholder="Enter GitHub Repo URL"
              value={repoLink}
              onChange={(e) => setRepoLink(e.target.value)}
            />
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
            >
              {isLoading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="text-center mt-6">
            <div className="animate-spin border-4 border-purple-500 rounded-full w-10 h-10 mx-auto mb-2 border-t-transparent"></div>
            <p className="text-sm text-gray-400">Analyzing repository...</p>
          </div>
        )}

        {reportReady && (
          <div className="mt-8 bg-[#2a2a3a] p-4 rounded-xl shadow-lg">
  <h2 className="text-xl font-semibold mb-2">✅ Analysis Complete</h2>
  <p className="text-sm text-gray-400 mb-1">Time Extracted: {timestamp}</p>
  <p className="text-sm text-gray-400 mb-4">From: {repoLink}</p>

  <div className="flex justify-between items-center mb-2">
    <h3 className="text-lg font-semibold">📄 Report</h3>
    <a
      href="http://localhost:5000/report.txt"
      download
      className="bg-purple-600 px-3 py-1 text-sm rounded hover:bg-purple-700"
    >
      ⬇ Download
    </a>
  </div>

  <pre className="whitespace-pre-wrap text-sm bg-[#1e1e2f] p-4 rounded-xl overflow-x-auto max-h-[500px]">
    {reportText}
  </pre>
</div>

        )}
      </div>
    </main>
  );
}

export default App;
