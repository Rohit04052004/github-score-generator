import os
import requests
import json

OLLAMA_MODEL = "mistral"  # or llama3 etc.

def generate_prompt(repo_name, repo_path):
    readme_path = None
    for root, dirs, files in os.walk(repo_path):
        for f in files:
            if f.lower() == "readme.md":
                readme_path = os.path.join(root, f)
                break
        if readme_path:
            break

    if readme_path:
        with open(readme_path, 'r', encoding='utf-8', errors='ignore') as f:
            readme_content = f.read()
    else:
        readme_content = "No README found."

    prompt = f"""
You are an expert GitHub reviewer. Classify this project.

Project: {repo_name}
README:
{readme_content}

Options:
- 🤖 AI-Generated
- 📄 Copied
- ✍️ Original

Respond in JSON:
{{
  "origin": "Original",
  "reason": "Explanation here"
}}
""".strip()

    return prompt

def classify_repo_with_ollama(repo_name, repo_path):
    prompt = generate_prompt(repo_name, repo_path)

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False}
    )

    if response.status_code == 200:
        output = response.json()["response"]
        try:
            data = json.loads(output)
            return data["origin"], data["reason"]
        except Exception:
            return "Unknown", "⚠️ Could not parse LLM response"
    else:
        return "Unknown", "⚠️ Ollama request failed"
