from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import subprocess
import os
import sys
from collections import Counter
from urllib.parse import urlparse

from github_api import get_user_info, get_user_repos, download_repo_code
from analyzer import unzip_all, analyze_repo_complexity
from origin_classifier import classify_repo_with_ollama
from language_detector import detect_languages
from persona_builder import build_persona

app = Flask(__name__)
CORS(app)  # Allow frontend calls

@app.route("/analyze", methods=["POST"])
def analyze_repo():
    data = request.get_json()
    repo_url = data.get("repo_url")

    if not repo_url:
        return jsonify({"error": "No repo_url provided"}), 400

    # Parse GitHub username and repo name
    path_parts = urlparse(repo_url).path.strip("/").split("/")
    if len(path_parts) < 2:
        return jsonify({"error": "Invalid GitHub URL"}), 400

    username = path_parts[0]
    repo_name = path_parts[1]

    try:
        # Step 1: User Info
        user_info = get_user_info(username)

        # Step 2: Get repo (single repo)
        repos = [{"name": repo_name}]
        download_repo_code(username, repo_name)

        # Step 3: Unzip
        unzip_all()

        # Step 4: Analysis
        complexity_scores = {}
        origin_stats = {}
        language_stats = {}

        repo_path = os.path.join("extracted_repos", repo_name)

        if not os.path.exists(repo_path):
            return jsonify({"error": "Repository folder not found after unzip"}), 500

        avg_complexity = analyze_repo_complexity(repo_path)
        complexity_scores[repo_name] = avg_complexity

        origin, reason = classify_repo_with_ollama(repo_name, repo_path)
        origin_stats[repo_name] = (origin, reason)

        langs = detect_languages(repo_path)
        language_stats[repo_name] = langs

        # Step 5: Language merge
        merged_language_counts = Counter()
        for lang_dict in language_stats.values():
            merged_language_counts.update(lang_dict)

        # Step 6: Persona
        summary = build_persona(user_info, merged_language_counts, complexity_scores, origin_stats)

        with open("report.txt", "w", encoding="utf-8") as f:
            f.write(summary)

        return jsonify({"message": "Analysis complete", "username": username, "repo": repo_name})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/report.txt")
def get_report():
    if not os.path.exists("report.txt"):
        return "No report found", 404
    return send_file("report.txt", as_attachment=False)

if __name__ == "__main__":
    app.run(port=5000)
