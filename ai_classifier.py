import subprocess
def ask_ollama(prompt, model="mistral"):
    result = subprocess.run(["ollama", "run", model], input=prompt.encode(), capture_output=True)
    return result.stdout.decode()
