#!/bin/bash
# Quick setup script for Guest Transportation Form

echo "🎉 Setting up Guest Transportation Form..."
echo ""

# Navigate to the project directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 IMPORTANT: Before running, you need to:"
echo "   1. Follow instructions in GOOGLE_SHEETS_SETUP.md"
echo "   2. Update the Google Script URL in src/components/TransportationForm.jsx"
echo ""
echo "🚀 To start the development server, run:"
echo "   npm start"
echo ""
echo "📖 For more information, see:"
echo "   - PROJECT_SUMMARY.md (overview)"
echo "   - GOOGLE_SHEETS_SETUP.md (required setup)"
echo "   - README.md (full documentation)"
echo ""
