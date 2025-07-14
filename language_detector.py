from collections import Counter
import os

def detect_languages(repo_path):
    ext_map = {
        ".py": "Python", ".js": "JavaScript", ".java": "Java", ".cpp": "C++",
        ".c": "C", ".go": "Go", ".cs": "C#", ".php": "PHP", ".rb": "Ruby",
        ".swift": "Swift", ".ts": "TypeScript", ".kt": "Kotlin", ".rs": "Rust"
    }

    langs = []

    for root, _, files in os.walk(repo_path):
        for file in files:
            _, ext = os.path.splitext(file)
            if ext in ext_map:
                langs.append(ext_map[ext])

    lang_count = dict(Counter(langs))
    return lang_count
