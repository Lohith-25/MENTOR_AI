#!/usr/bin/env python3
"""
Placement Predictor - Automated Startup Script
Run this once to set up and start the entire application
"""

import os
import sys
import subprocess
import time
import platform

def print_header(text):
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60 + "\n")

def run_command(cmd, description, shell=True):
    """Run a command and handle errors"""
    print(f"🔧 {description}...")
    try:
        result = subprocess.run(cmd, shell=shell, capture_output=True, text=True, timeout=60)
        if result.returncode != 0:
            print(f"⚠️  Warning: {result.stderr}")
        else:
            print(f"✅ {description} completed")
        return True
    except subprocess.TimeoutExpired:
        print(f"⏱️  Timeout: {description} took too long")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def setup_backend():
    """Setup backend"""
    print_header("SETTING UP BACKEND")
    
    backend_dir = os.path.join(os.path.dirname(__file__), "backend")
    os.chdir(backend_dir)
    
    # Create venv if not exists
    if not os.path.exists("venv"):
        print("📦 Creating virtual environment...")
        run_command(f"{sys.executable} -m venv venv", "Virtual environment creation")
    
    # Get Python executable path
    if platform.system() == "Windows":
        python_exe = os.path.join("venv", "Scripts", "python.exe")
        pip_exe = os.path.join("venv", "Scripts", "pip.exe")
    else:
        python_exe = os.path.join("venv", "bin", "python")
        pip_exe = os.path.join("venv", "bin", "pip")
    
    # Install dependencies
    run_command(f"{pip_exe} install -r requirements.txt", "Installing backend dependencies")
    
    return python_exe

def setup_frontend():
    """Setup frontend"""
    print_header("SETTING UP FRONTEND")
    
    frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")
    os.chdir(frontend_dir)
    
    # Install npm dependencies
    run_command("npm install", "Installing frontend dependencies")

def start_services():
    """Start backend and frontend servers"""
    print_header("STARTING SERVICES")
    
    backend_dir = os.path.join(os.path.dirname(__file__), "backend")
    frontend_dir = os.path.join(os.path.dirname(__file__), "frontend")
    
    # Get Python executable
    if platform.system() == "Windows":
        python_exe = os.path.join(backend_dir, "venv", "Scripts", "python.exe")
    else:
        python_exe = os.path.join(backend_dir, "venv", "bin", "python")
    
    print("\n🚀 Starting Backend...")
    print(f"   Command: {python_exe} {os.path.join(backend_dir, 'app.py')}")
    print("   URL: http://localhost:5000")
    print("   ⏳ Waiting 3 seconds...\n")
    
    # Start backend in subprocess
    backend_process = subprocess.Popen(
        [python_exe, os.path.join(backend_dir, "app.py")],
        cwd=backend_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        shell=platform.system() == "Windows"
    )
    
    time.sleep(3)
    
    print("🚀 Starting Frontend...")
    print(f"   Command: npm run dev")
    print("   URL: http://localhost:5173")
    print("   ⏳ Waiting 5 seconds...\n")
    
    # Start frontend in subprocess
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=frontend_dir,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        shell=platform.system() == "Windows"
    )
    
    time.sleep(5)
    
    print_header("✨ APPLICATION READY")
    print("\n🌐 Open your browser and navigate to:")
    print("   http://localhost:5173")
    print("\n📊 Backend API:")
    print("   http://localhost:5000/api/health")
    print("\n💡 Troubleshooting:")
    print("   • Backend port 5000 already in use? Kill the process")
    print("   • Frontend port 5173 already in use? Kill the process")
    print("   • Check console output above for errors")
    print("\n⏹️  Press Ctrl+C to stop both servers")
    
    try:
        # Keep processes running
        backend_process.wait()
        frontend_process.wait()
    except KeyboardInterrupt:
        print("\n\n🛑 Stopping services...")
        backend_process.terminate()
        frontend_process.terminate()
        print("✅ Services stopped")

def main():
    """Main execution"""
    print_header("PLACEMENT PREDICTOR - AUTOMATED SETUP")
    
    print("This script will:")
    print("1. Setup Python virtual environment")
    print("2. Install backend dependencies")
    print("3. Install frontend dependencies")
    print("4. Start both servers")
    print("\nNote: Keep this window open while using the application")
    
    # Setup backend
    python_exe = setup_backend()
    
    # Setup frontend
    setup_frontend()
    
    # Start services
    start_services()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⛔ Setup cancelled")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
