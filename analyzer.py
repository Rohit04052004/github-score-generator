import os
import zipfile
import radon.complexity as radon_cc
from radon.visitors import ComplexityVisitor
import tempfile
import lizard
import time


def unzip_all(zip_dir="repos", extract_to="extracted_repos"):
    os.makedirs(extract_to, exist_ok=True)
    for zip_file in os.listdir(zip_dir):
        if zip_file.endswith(".zip"):
            repo_name = zip_file.replace(".zip", "")
            extract_path = os.path.join(extract_to, repo_name)
            with zipfile.ZipFile(os.path.join(zip_dir, zip_file), 'r') as zip_ref:
                zip_ref.extractall(extract_path)
            print(f"✅ Extracted: {zip_file}")
    print("All repos extracted.\n")

def analyze_python_file(file_path):
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        code = f.read()
    try:
        visitor = ComplexityVisitor.from_code(code)
        avg_complexity = sum([block.complexity for block in visitor.functions]) / max(len(visitor.functions), 1)
    except Exception as e:
        avg_complexity = 0
    return avg_complexity



def analyze_repo_complexity(repo_path):
    code_extensions = (".c", ".cpp", ".h", ".py", ".java", ".js", ".ts", ".cs", ".go", ".rb", ".swift", ".kt", ".php", ".scala")
    
    all_files = []
    for root, _, files in os.walk(repo_path):
        for file in files:
            if file.lower().endswith(code_extensions):
                all_files.append(os.path.join(root, file))

    total_files = len(all_files)

    if total_files == 0:
        print(f"⏩ Skipped (no supported code files): {repo_path}")
        return 0

    print(f"\n🔍 Analyzing {total_files} code files in: {repo_path}")

    total_complexity = 0
    total_funcs = 0
    start_time = time.time()

    for i, file_path in enumerate(all_files, 1):
        try:
            analysis = lizard.analyze_file(file_path)
            file_complexity = sum(func.cyclomatic_complexity for func in analysis.function_list)
            func_count = len(analysis.function_list)

            total_complexity += file_complexity
            total_funcs += func_count

            elapsed = time.time() - start_time
            avg_time = elapsed / i
            eta = (total_files - i) * avg_time

            print(f"  ✅ {i}/{total_files}: {os.path.basename(file_path)} | "
                  f"Funcs: {func_count} | Complexity: {file_complexity} | ETA: {int(eta)}s")
        except Exception as e:
            print(f"  ⚠️ Error analyzing {file_path}: {e}")

    if total_funcs == 0:
        return 0

    avg_complexity = round(total_complexity / total_funcs, 2)
    print(f"\n📊 Done with {repo_path} → Avg Complexity: {avg_complexity} | Total Functions: {total_funcs}\n")
    return avg_complexity

