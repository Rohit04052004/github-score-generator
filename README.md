# GitHub Score Maker

> A full-stack tool that analyzes any public GitHub user's coding profile and generates a report with language usage, code complexity, origin classification (AI-generated, copied, or original), and overall developer persona — all in one place.

---

## 🌟 Features

* Analyze any public GitHub user's repositories
* Detect used programming languages and frameworks
* Estimate code complexity using static analysis tools
* Classify code origin (original, AI-generated, copied) using local LLMs via Ollama
* Generate a plain-text report summarizing all insights
* View the report directly in the UI and download it
* Works offline — no paid APIs required

---

## 🛠 Tech Stack

| Layer              | Tech Used                                 |
| ------------------ | ----------------------------------------- |
| Frontend           | React + Tailwind CSS + Lucide Icons       |
| Backend            | Flask + GitHub API + Radon + Lizard       |
| Language Detection | Custom Script (`language_detector.py`)    |
| Code Origin        | Local LLM with **Ollama** (e.g., Mistral) |
| Report View        | Plain-text viewer inside frontend         |

---

## 📆 Project Structure

```
github-score-maker/
├── main.py                  # Flask backend entry
├── analyzer.py              # Code complexity analysis (radon/lizard)
├── github_api.py            # GitHub data retrieval
├── language_detector.py     # Multi-language support
├── origin_classifier.py     # Uses LLM to classify AI/copied/original
├── persona_builder.py       # Report summarizer
├── report.txt               # Final user report
├── extracted_repos/         # Repo data (unzipped)
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── tailwind.config.js
    └── public/
```

---

## 🚀 Running Locally

### 1️⃣ Backend (Flask)

```bash
git clone https://github.com/yourusername/github-score-maker.git
cd github-score-maker
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

> Requires [Ollama](https://ollama.com/) to be running locally with a model like `mistral`.

---

### 2️⃣ Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🧠 LLM-Based Origin Classification

Each repository is passed through a prompt to determine:

* Original code (self-written)
* AI-generated code
* Copied code (e.g., tutorials, templates)

The classification is done locally using [Ollama](https://ollama.com/) with models like `mistral`. This helps assess how efficiently the developer uses tools.

> This project **does not penalize AI use**, but includes it as an insight.

---

## 📄 Report Example

The report includes:

* User info: name, repo count, followers
* Complexity score per repo
* Top languages used (merged across repos)
* AI/copied/original classification of each repo
* Summary insight about the developer

---

## 💽 UI Interface

* Minimal VS Code–style theme
* Input field for GitHub profile URL
* Loading spinner while analyzing
* Report displayed as plain text
* One-click report download

---

## 🌐 Deployment (Optional)

Can be deployed using:

| Platform         | Notes                                   |
| ---------------- | --------------------------------------- |
| **Render**       | Easy all-in-one deployment              |
| Vercel + Railway | Separate frontend/backend setup         |
| PythonAnywhere   | Flask-only, UI must be hosted elsewhere |

> Let me know if you'd like deployment configs (e.g., `render.yaml`)

---

## ✨ Future Work

* Progress bar while analyzing repos
* GitHub README badges from analysis
* PDF export
* Insights panel (e.g., "Best project", "Strongest language")

---

## 👨‍💻 Author

**Rohith Chigatapu**
[GitHub](https://github.com/Rohit04052004)

---

## 📄 License

MIT License
