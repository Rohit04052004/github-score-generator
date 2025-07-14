import requests
import os
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv("GITHUB_TOKEN")

HEADERS = {
    "Authorization": f"token {TOKEN}" if TOKEN else None,
    "Accept": "application/vnd.github.v3+json"
}

def get_user_info(username):
    url = f"https://api.github.com/users/{username}"
    res = requests.get(url, headers=HEADERS)
    return res.json()

def get_user_repos(username, max_pages=10):
    repos = []
    page = 1

    while page <= max_pages:
        url = f"https://api.github.com/users/{username}/repos?per_page=100&page={page}"
        print(f"Fetching page {page}...")
        res = requests.get(url, headers=HEADERS)

        if res.status_code == 403:
            print("Rate limited! Add a token to .env.")
            print(res.json())
            break

        try:
            data = res.json()
        except Exception as e:
            print("Error parsing JSON:", e)
            print("Raw response:", res.text[:500])
            break

        # Check if empty or invalid
        if not isinstance(data, list) or len(data) == 0:
            print("No more repositories found.")
            break

        repos.extend(data)
        page += 1

    print(f"Total repositories fetched: {len(repos)}")
    return repos



def download_repo_code(username, repo_name, save_dir="repos"):
    os.makedirs(save_dir, exist_ok=True)
    filepath = os.path.join(save_dir, f"{repo_name}.zip")
    
    if os.path.exists(filepath):
        print(f"⏩ Skipped (already downloaded): {repo_name}")
        return filepath

    zip_url = f"https://github.com/{username}/{repo_name}/archive/refs/heads/main.zip"
    response = requests.get(zip_url)

    if response.status_code == 404:
        zip_url = f"https://github.com/{username}/{repo_name}/archive/refs/heads/master.zip"
        response = requests.get(zip_url)

    if response.status_code == 200:
        with open(filepath, "wb") as f:
            f.write(response.content)
        print(f"✅ Downloaded: {repo_name}")
        return filepath
    else:
        print(f"❌ Failed to download {repo_name}")
        return None

