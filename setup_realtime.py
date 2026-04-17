#!/usr/bin/env python3
"""
Quick setup script for Real-Time AI Dashboard
Installs dependencies and initializes the system
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(cmd, cwd=None):
    """Run shell command and return success status"""
    try:
        print(f"\n▶️  {cmd}")
        result = subprocess.run(cmd, shell=True, cwd=cwd, check=True)
        return True
    except subprocess.CalledProcessError:
        print(f"❌ Failed: {cmd}")
        return False

def main():
    print("""
    ╔════════════════════════════════════════════════════════════╗
    ║   Real-Time AI Dashboard - Quick Setup                    ║
    ║   Installation & Configuration                             ║
    ╚════════════════════════════════════════════════════════════╝
    """)
    
    project_root = Path(__file__).parent
    backend_dir = project_root / "backend"
    frontend_dir = project_root / "frontend"
    
    # Step 1: Backend Setup
    print("\n📦 Setting up Backend...")
    print("=" * 60)
    
    if backend_dir.exists():
        print(f"✅ Backend directory found: {backend_dir}")
        
        # Check for venv
        venv_path = project_root.parent / ".venv"
        if venv_path.exists():
            print(f"✅ Virtual environment found: {venv_path}")
            requirements_file = backend_dir / "requirements.txt"
            
            if requirements_file.exists():
                print("\n📥 Installing Python dependencies...")
                if sys.platform == "win32":
                    activate_script = venv_path / "Scripts" / "activate.bat"
                    cmd = f"cd /d {backend_dir} && {activate_script} && pip install -r requirements.txt"
                else:
                    activate_script = venv_path / "bin" / "activate"
                    cmd = f"cd {backend_dir} && source {activate_script} && pip install -r requirements.txt"
                
                if run_command(cmd):
                    print("✅ Backend dependencies installed")
                else:
                    print("⚠️  Install manually: cd backend && pip install -r requirements.txt")
            else:
                print("❌ requirements.txt not found")
        else:
            print("⚠️  Virtual environment not found. Create with: python -m venv .venv")
    else:
        print("❌ Backend directory not found")
    
    # Step 2: Frontend Setup
    print("\n📦 Setting up Frontend...")
    print("=" * 60)
    
    if frontend_dir.exists():
        print(f"✅ Frontend directory found: {frontend_dir}")
        
        package_json = frontend_dir / "package.json"
        if package_json.exists():
            print("\n📥 Installing Node dependencies...")
            if run_command("npm install", cwd=frontend_dir):
                print("✅ Frontend dependencies installed")
            else:
                print("⚠️  Install manually: cd frontend && npm install")
        else:
            print("❌ package.json not found")
    else:
        print("❌ Frontend directory not found")
    
    # Step 3: Configuration
    print("\n⚙️  Configuration")
    print("=" * 60)
    
    # Check .env files
    backend_env = backend_dir / ".env"
    frontend_env = frontend_dir / ".env"
    
    if not backend_env.exists():
        print("\n📝 Create backend/.env file with:")
        print("""
MONGO_URI=mongodb://localhost:27017/mentor_ai
SECRET_KEY=your-secret-key-here
DEBUG=False
        """)
    else:
        print(f"✅ Backend config found: {backend_env}")
    
    if not frontend_env.exists():
        print("\n📝 Create frontend/.env file with:")
        print("""
VITE_API_URL=http://localhost:5000
        """)
    else:
        print(f"✅ Frontend config found: {frontend_env}")
    
    # Step 4: Database Check
    print("\n💾 Database")
    print("=" * 60)
    print("""
✅ Using MongoDB (local or remote)
   - Local: mongodb://localhost:27017
   - Remote: mongodb+srv://user:pass@cluster.mongodb.net/

📝 Set MONGO_URI in backend/.env
    """)
    
    # Step 5: Summary
    print("\n✨ Setup Complete!")
    print("=" * 60)
    print("""
Next steps:

1️⃣  Start Backend (Terminal 1):
    cd backend
    python app.py
    
2️⃣  Start Frontend (Terminal 2):
    cd frontend
    npm run dev
    
3️⃣  Open Browser:
    👉 http://localhost:5173/user-dashboard
    
4️⃣  Check Connection:
    - Top-right should show 🟢 Live
    - Open DevTools → Network → WS to watch Socket.IO
    
5️⃣  Test Real-Time:
    - Click task checkbox
    - See instant updates across dashboard
    - Charts update in real-time

📚 Documentation:
   → See REALTIME_SYSTEM_GUIDE.md for full details

🔗 Useful URLs:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:5173
   - WebSocket: ws://localhost:5000/socket.io
    """)

if __name__ == "__main__":
    main()
