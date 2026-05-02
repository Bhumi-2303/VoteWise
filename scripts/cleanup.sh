#!/bin/bash
# VoteWise Repository Cleanup Script
# Removes legacy configuration files and prepares for production audit.

echo "🧹 Starting VoteWise cleanup..."

# List of files to remove
FILES=(
    "render.yaml"
    "vercel.json"
    "Procfile"
    "test_gemini.py"
    "test_gemini_local.py"
    "backend/test_gemini_diagnostics.py"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "✅ Removed $file"
    fi
done

echo "✨ Repository is clean and standardized for Google Cloud."
