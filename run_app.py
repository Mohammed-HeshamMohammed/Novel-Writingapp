import subprocess
import os
import time
import sys
import requests
import signal

# 📁 Paths
project_root = os.path.abspath(os.path.dirname(__file__))
electron_app_path = os.path.join(project_root, "electron-app")
vite_url = "http://localhost:5173"

# 📦 Start FastAPI backend
print("🐍 Starting FastAPI backend...")
api_process = subprocess.Popen(
    ["uvicorn", "python-backend.app:app", "--port", "8000"],
    cwd=project_root,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
    shell=True
)

# 🚀 Start Vite Dev Server
print("🔧 Starting Vite dev server...")
vite_process = subprocess.Popen(
    ["npm", "run", "dev"],
    cwd=electron_app_path,
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL,
    shell=True
)

# ⏳ Wait for Vite to become ready
print("⏳ Waiting for Vite to be ready...")
vite_ready = False
for _ in range(60):
    try:
        requests.get(vite_url)
        vite_ready = True
        print("✅ Vite server is ready.")
        break
    except requests.exceptions.ConnectionError:
        time.sleep(1)

if not vite_ready:
    print("❌ [ERROR] Vite server didn't start in time.")
    vite_process.terminate()
    api_process.terminate()
    sys.exit(1)

# 🪟 Launch Electron App
electron_cli = os.path.join(electron_app_path, "node_modules", "electron", "cli.js")
try:
    print("⚡ Launching Electron app...")
    subprocess.run(["node", electron_cli, "."], cwd=electron_app_path)
except Exception as e:
    print(f"❌ [ERROR] Failed to launch Electron: {e}")

# 🧹 Cleanup
print("🧹 Shutting down Vite and FastAPI...")
vite_process.terminate()
api_process.terminate()

# Ensure they exit properly
try:
    vite_process.wait(timeout=5)
    api_process.wait(timeout=5)
except subprocess.TimeoutExpired:
    vite_process.kill()
    api_process.kill()

print("👋 App closed. Goodbye!")
