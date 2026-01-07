# Guest Transportation Form

A React application to collect guest transportation and arrival information for the wedding. Built with the same elegant design style as the main wedding website.

## 🎯 Features

- **Travel Information Collection**: Flight numbers, arrival dates/times at BNA
- **Transportation Coordination**: Track who needs hotel-to-airport transportation and when
- **Group Size Tracking**: Know how many people are in each party
- **Attire Recommendations**: Reminds guests to bring 2-3 light-colored long dresses (ladies) or 2-3 suits (gentlemen)
- **Google Sheets Integration**: All responses automatically saved to a Google Sheet
- **Responsive Design**: Beautiful on all devices
- **Elegant Styling**: Matches the champagne/refined aesthetic of the main wedding site

## 📋 Form Fields

The form collects:
- Full Name *
- Flight Number (班机号) *
- Estimated Arrival Date in BNA *
- Estimated Arrival Time in BNA *
- Transportation Needed (Yes/No) *
  - If Yes: Which day and what time
- Group Size *
- Additional Notes (optional)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd guest_transportation
npm install
```

### 2. Set Up Google Sheets Integration

**Important**: You need to configure Google Sheets before the form will work!

Follow the detailed instructions in [`GOOGLE_SHEETS_SETUP.md`](./GOOGLE_SHEETS_SETUP.md)

Quick summary:
1. Create a Google Sheet
2. Add the Apps Script from `google-apps-script.js`
3. Deploy as Web App
4. Copy the Web App URL
5. Paste it in `src/components/TransportationForm.jsx` (line 82)

### 3. Start Development Server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
```

The build folder will contain your production-ready files.

## 📁 Project Structure

```
guest_transportation/
├── public/
│   ├── index.html          # HTML template
│   ├── manifest.json       # PWA manifest
│   └── robots.txt
├── src/
│   ├── components/
│   │   └── TransportationForm.jsx  # Main form component
│   ├── styles/
│   │   └── global.css      # Global styles matching wedding site
│   ├── App.css             # App-specific styles
│   ├── App.js              # Main app component
│   └── index.js            # Entry point
├── google-apps-script.js   # Google Sheets backend script
├── GOOGLE_SHEETS_SETUP.md  # Detailed setup guide
├── package.json
└── README.md
```

## 🎨 Design

The application uses the same design system as the main wedding website:
- **Color Palette**: Champagne (#C9B894), warm browns, elegant neutrals
- **Typography**: Playfair Display for headings, system fonts for body
- **Components**: Cards, smooth transitions, refined shadows
- **Layout**: Clean, spacious, mobile-responsive

## 🔧 Configuration

### Update Google Sheets URL

Edit `src/components/TransportationForm.jsx`:

```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_WEB_APP_URL_HERE';
```

### Customize Form Fields

All form fields are in `src/components/TransportationForm.jsx`. You can:
- Add new fields to the `formData` state
- Update validation in `validateForm()`
- Modify the submission data structure
- Update the Google Apps Script accordingly

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px - 1199px (adjusted spacing)
- **Mobile**: < 768px (stacked layout, optimized for touch)

## 🐛 Troubleshooting

### Form doesn't submit
- Check that Google Apps Script URL is correct
- Verify the script is deployed with "Anyone" access
- Check browser console for errors

### Styling issues
- Ensure `global.css` and `App.css` are imported
- Clear browser cache
- Check for CSS conflicts

### Dependencies issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📦 Dependencies

- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **axios**: ^1.6.0 (for API calls)
- **react-scripts**: 5.0.1

## 🚀 Deployment

### Deploy to Netlify, Vercel, or GitHub Pages

1. Build the project: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Make sure the Google Apps Script URL is configured

### Environment Variables (Optional)

Create a `.env` file for the Google Script URL:

```
REACT_APP_GOOGLE_SCRIPT_URL=your_url_here
```

Then use it in the code:
```javascript
const GOOGLE_SCRIPT_URL = process.env.REACT_APP_GOOGLE_SCRIPT_URL;
```

## 📝 License

Private project for wedding use.

## 💡 Tips

- Test the form thoroughly before sharing with guests
- Monitor the Google Sheet regularly for new submissions
- Consider adding email notifications via Google Apps Script
- Keep a backup of the Google Sheet data

## 🆘 Support

For issues or questions, refer to:
- `GOOGLE_SHEETS_SETUP.md` for integration help
- React documentation: https://react.dev
- Google Apps Script docs: https://developers.google.com/apps-script
