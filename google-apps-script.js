// Google Apps Script for Google Sheets Integration with Email Confirmation
// 
// Instructions to set up:
// 1. Go to Google Sheets and create a new spreadsheet
// 2. Name it "Guest Transportation Responses"
// 3. In the spreadsheet, go to Extensions > Apps Script
// 4. Delete any existing code and paste this entire script
// 5. Click the disk icon to save
// 6. Click "Deploy" > "New deployment"
// 7. Click the gear icon next to "Select type" and choose "Web app"
// 8. Set the following:
//    - Description: "Guest Transportation Form"
//    - Execute as: "Me"
//    - Who has access: "Anyone"
// 9. Click "Deploy"
// 10. Copy the Web App URL
// 11. Paste it in src/components/TransportationForm.jsx where it says YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE

function doPost(e) {
  try {
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data - handle both JSON and form data
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonError) {
        // If JSON parse fails, try to get form parameters
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }
    
    // Check if this is the first entry (create headers if needed)
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'Name',
        'Email',
        'Group Size',
        'Arrival Transportation Required',
        'BNA Arrival Time (if transportation needed)',
        'Alila Arrival Time (if no transportation)',
        'Departure Transportation Required',
        'Hotel Departure Time (if transportation needed)',
        'Alila Departure Time (if no transportation)',
        'Additional Notes'
      ];
      sheet.appendRow(headers);
      
      // Format header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#C9B894');
      headerRange.setFontColor('#FFFFFF');
    }
    
    // Prepare row data
    const rowData = [
      new Date(data.timestamp),
      data.name,
      data.email,
      data.groupSize,
      data.arrivalTransportation,
      data.bnaArrivalTime || 'N/A',
      data.arrivalTime || 'N/A',
      data.departureTransportation,
      data.hotelDepartureTime || 'N/A',
      data.departureTime || 'N/A',
      data.additionalNotes
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, 11);
    
    // Send confirmation email
    if (data.email && data.email.trim() !== "") {
      try {
        const subject = "✈️ Travel Information Received - Alex & Lucia's Wedding";
        
        const htmlBody = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <style>
              @media only screen and (max-width: 600px) {
                .container { padding: 0 !important; }
                .card { 
                  padding: 32px 20px !important; 
                  margin: 0 !important;
                  border-radius: 0 !important;
                }
                .header-title { font-size: 28px !important; letter-spacing: -0.8px !important; }
                .section-padding { padding: 24px 20px !important; }
                .details-row { margin-bottom: 16px !important; }
                .details-label { 
                  display: block !important; 
                  margin-bottom: 6px !important; 
                }
              }
              
              body {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
              }
            </style>
          </head>
          <body style="margin: 0; padding: 0; background: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Helvetica, Arial, sans-serif;">
            <div class="container" style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div class="card" style="background: #ffffff; border-radius: 18px; padding: 48px 40px; box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06); margin: 0 auto;">
                
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 40px;">
                  <div style="font-size: 48px; margin-bottom: 20px; line-height: 1;">✈️</div>
                  <h1 class="header-title" style="color: #1d1d1f; font-size: 34px; margin: 0; font-weight: 600; letter-spacing: -1px; line-height: 1.1;">Travel Info Received</h1>
                  <div style="width: 40px; height: 2px; background: linear-gradient(90deg, #D4AF76, #C9A961); margin: 24px auto; border-radius: 2px;"></div>
                </div>
                
                <!-- Personal greeting -->
                <div style="margin-bottom: 36px;">
                  <h2 style="color: #1d1d1f; font-size: 21px; margin-bottom: 14px; font-weight: 600; letter-spacing: -0.3px;">Dear ${data.name},</h2>
                  <p style="color: #424245; font-size: 17px; line-height: 1.5; margin-bottom: 14px; letter-spacing: -0.1px;">
                    Thank you for sharing your travel information with us! We've received your details and are excited to help coordinate your arrival.
                  </p>
                  <p style="color: #424245; font-size: 17px; line-height: 1.5; margin-bottom: 0; letter-spacing: -0.1px;">
                    Below is a summary of the information you provided. If you need to make any changes, please reach out to us directly.
                  </p>
                </div>
                
                <!-- Travel Details -->
                <div class="section-padding" style="background: rgba(245, 230, 211, 0.2); padding: 28px 32px; border-radius: 14px; margin: 32px 0; border: 1px solid rgba(212, 175, 118, 0.2);">
                  <h3 style="color: #1d1d1f; margin-top: 0; margin-bottom: 22px; font-size: 19px; font-weight: 600; letter-spacing: -0.3px;">Your Transportation Details</h3>
                  
                  <div class="details-row" style="margin-bottom: 18px;">
                    <span class="details-label" style="color: #1d1d1f; font-weight: 500; font-size: 15px; letter-spacing: -0.1px;">Group Size:</span> 
                    <span style="color: #424245; font-size: 15px; letter-spacing: -0.1px;">${data.groupSize} ${parseInt(data.groupSize) === 1 ? 'person' : 'people'}</span>
                  </div>
                </div>
                
                <!-- Transportation Details -->
                <div class="section-padding" style="background: rgba(245, 230, 211, 0.2); padding: 28px 32px; border-radius: 14px; margin: 32px 0; border: 1px solid rgba(212, 175, 118, 0.2);">
                  <h3 style="color: #1d1d1f; margin-top: 0; margin-bottom: 22px; font-size: 19px; font-weight: 600; letter-spacing: -0.3px;">🚌 Transportation</h3>
                  
                  <div style="background: #ffffff; padding: 20px; border-radius: 10px; margin-bottom: 16px; border: 1px solid rgba(212, 175, 118, 0.2);">
                    <div class="details-row" style="margin-bottom: 12px;">
                      <span class="details-label" style="color: #1d1d1f; font-weight: 500; font-size: 15px; letter-spacing: -0.1px;">✈️ Airport → Hotel:</span> 
                      <span style="color: #424245; font-size: 15px; letter-spacing: -0.1px; background: ${data.arrivalTransportation === 'yes' ? '#D4AF76' : '#f5f5f5'}; color: ${data.arrivalTransportation === 'yes' ? '#ffffff' : '#424245'}; padding: 6px 14px; border-radius: 20px; display: inline-block; font-weight: 500; margin-left: 8px;">
                        ${data.arrivalTransportation === 'yes' ? '✓ Required' : '✗ Not Required'}
                      </span>
                    </div>
                    ${data.arrivalTransportation === 'yes' && data.bnaArrivalTime !== 'N/A' ? `
                      <div class="details-row" style="margin-bottom: 0; padding-left: 24px;">
                        <span class="details-label" style="color: #8A7968; font-size: 14px; letter-spacing: -0.1px;">Expected BNA Arrival:</span> 
                        <span style="color: #424245; font-size: 15px; letter-spacing: -0.1px; font-weight: 500;">${data.bnaArrivalTime}</span>
                      </div>
                    ` : ''}
                    ${data.arrivalTransportation === 'no' && data.arrivalTime !== 'N/A' ? `
                      <div class="details-row" style="margin-bottom: 0; padding-left: 24px;">
                        <span class="details-label" style="color: #8A7968; font-size: 14px; letter-spacing: -0.1px;">Alila Arrival Time:</span> 
                        <span style="color: #424245; font-size: 15px; letter-spacing: -0.1px; font-weight: 500;">${data.arrivalTime}</span>
                      </div>
                    ` : ''}
                  </div>
                  
                  <div style="background: #ffffff; padding: 20px; border-radius: 10px; border: 1px solid rgba(212, 175, 118, 0.2);">
                    <div class="details-row" style="margin-bottom: 12px;">
                      <span class="details-label" style="color: #1d1d1f; font-weight: 500; font-size: 15px; letter-spacing: -0.1px;">🏨 Hotel → Airport:</span> 
                      <span style="color: #424245; font-size: 15px; letter-spacing: -0.1px; background: ${data.departureTransportation === 'yes' ? '#D4AF76' : '#f5f5f5'}; color: ${data.departureTransportation === 'yes' ? '#ffffff' : '#424245'}; padding: 6px 14px; border-radius: 20px; display: inline-block; font-weight: 500; margin-left: 8px;">
                        ${data.departureTransportation === 'yes' ? '✓ Required' : '✗ Not Required'}
                      </span>
                    </div>
                    ${data.departureTransportation === 'yes' && data.hotelDepartureTime !== 'N/A' ? `
                      <div class="details-row" style="margin-bottom: 0; padding-left: 24px;">
                        <span class="details-label" style="color: #8A7968; font-size: 14px; letter-spacing: -0.1px;">Hotel Departure Time:</span> 
                        <span style="color: #424245; font-size: 15px; letter-spacing: -0.1px; font-weight: 500;">${data.hotelDepartureTime}</span>
                      </div>
                    ` : ''}
                    ${data.departureTransportation === 'no' && data.departureTime !== 'N/A' ? `
                      <div class="details-row" style="margin-bottom: 0; padding-left: 24px;">
                        <span class="details-label" style="color: #8A7968; font-size: 14px; letter-spacing: -0.1px;">Alila Departure Time:</span> 
                        <span style="color: #424245; font-size: 15px; letter-spacing: -0.1px; font-weight: 500;">${data.departureTime}</span>
                      </div>
                    ` : ''}
                  </div>
                </div>
                
                ${data.additionalNotes !== 'None' ? `
                  <!-- Additional Notes -->
                  <div class="section-padding" style="background: rgba(245, 230, 211, 0.2); padding: 28px 32px; border-radius: 14px; margin: 32px 0; border: 1px solid rgba(212, 175, 118, 0.2);">
                    <h3 style="color: #1d1d1f; margin-top: 0; margin-bottom: 18px; font-size: 19px; font-weight: 600; letter-spacing: -0.3px;">📝 Additional Notes</h3>
                    <p style="color: #424245; font-size: 17px; line-height: 1.6; margin: 0; letter-spacing: -0.1px; white-space: pre-wrap;">${data.additionalNotes}</p>
                  </div>
                ` : ''}
                
                <!-- Closing -->
                <div style="text-align: center; margin-top: 40px; padding-top: 32px; border-top: 1px solid rgba(212, 175, 118, 0.25);">
                  <p style="color: #424245; font-size: 17px; font-style: italic; margin: 0; line-height: 1.5; letter-spacing: -0.1px;">
                    Looking forward to seeing you in June!<br>
                    <strong style="color: #1d1d1f; font-size: 19px; font-weight: 600; letter-spacing: -0.3px;">Alex & Lucia</strong>
                  </p>
                  
                  <div style="margin-top: 24px; font-size: 24px; opacity: 0.8;">
                    ✨ 🌺 ✈️
                  </div>
                </div>
                
              </div>
            </div>
          </body>
          </html>
        `;
        
        MailApp.sendEmail({
          to: data.email,
          subject: subject,
          htmlBody: htmlBody
        });
      } catch (emailError) {
        console.log("Email sending failed: " + emailError.toString());
      }
    }
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify the script works
function doGet(e) {
  return ContentService
    .createTextOutput('Guest Transportation Form API is running!')
    .setMimeType(ContentService.MimeType.TEXT);
}
