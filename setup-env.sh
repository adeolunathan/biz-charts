#!/bin/bash
# Navigate to your project directory (adjust this path if needed)
cd ~/Downloads/my\ work/bizcharts

# Check if virtual environment exists, and create if it doesn't
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "Virtual environment created."
else
    echo "Virtual environment already exists."
fi

# Make sure activation script exists
if [ ! -f "venv/bin/activate" ]; then
    echo "ERROR: Virtual environment exists but activation script not found."
    echo "Recreating virtual environment..."
    rm -rf venv
    python3 -m venv venv
fi

# Print activation instructions
echo ""
echo "===== IMPORTANT: ACTIVATION INSTRUCTIONS ====="
echo "To activate the virtual environment, run this exact command:"
echo ""
echo "    source ~/Downloads/my\\ work/bizcharts/venv/bin/activate"
echo ""
echo "After activation, your prompt should change to show (venv)"
echo "====================================="
echo ""

# Update requirements.txt
echo "Creating updated requirements.txt..."
cat > requirements.txt << 'EOF'
Flask==2.3.3
Flask-Cors==4.0.0
Werkzeug==2.3.7
gunicorn==21.2.0
python-dotenv==1.0.0
pytest==7.4.0
requests==2.31.0
EOF
echo "Updated requirements.txt created."

echo ""
echo "Now run these commands (copy and paste each line):"
echo ""
echo "source ~/Downloads/my\\ work/bizcharts/venv/bin/activate"
echo "pip install -r requirements.txt"
echo "cd backend"
echo "python app.py"
echo ""
echo "In a separate terminal, run:"
echo "cd ~/Downloads/my\\ work/bizcharts/frontend"
echo "yarn install"
echo "yarn start"