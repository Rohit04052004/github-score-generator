def build_persona(user_info, language_stats, complexity_scores, origin_stats):
    total_repos = len(complexity_scores)
    avg_complexity = round(sum(complexity_scores.values()) / max(total_repos, 1), 2)

    lang_usage = ", ".join(f"{k} ({v})" for k, v in language_stats.items())

    origin_counts = {
        "Original": sum(1 for val in origin_stats.values() if val[0] == "Original"),
        "AI-Generated": sum(1 for val in origin_stats.values() if val[0] == "AI-Generated"),
        "Copied": sum(1 for val in origin_stats.values() if val[0] == "Copied")
    }

    persona = f"""
👤 Developer Profile: {user_info.get("login")}

Name: {user_info.get("name", "N/A")}
Followers: {user_info.get("followers")}
Public Repositories: {user_info.get("public_repos")}

📊 Summary:
- Languages used: {lang_usage}
- Projects analyzed: {total_repos}
- Average Complexity Score: {avg_complexity}
- Origin Breakdown:
    - ✍️ Original: {origin_counts['Original']}
    - 🤖 AI-Generated: {origin_counts['AI-Generated']}
    - 📄 Copied: {origin_counts['Copied']}
    
📝 Final Verdict:
This developer shows consistent coding habits with a tech stack primarily based on the languages and frameworks above. Complexity score and origin metadata reflect the developer's style and tooling.
""".strip()

    return persona
