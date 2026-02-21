/**
 * Spreadsheet logger for Gmail incidents.
 * Appends incident data and API responses to a dedicated sheet.
 */

const GMAIL_INCIDENTS_SHEET_NAME = 'GmailIncidents';

/**
 * Gets or creates the Gmail Incidents sheet.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} The Gmail Incidents sheet
 */
function getGmailIncidentsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(GMAIL_INCIDENTS_SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(GMAIL_INCIDENTS_SHEET_NAME);
    // Headers: Timestamp, Incident ID, Priority, Description, API Response
    sheet.appendRow(['Timestamp', 'Incident ID', 'Priority', 'Description', 'API Response']);
    sheet.getRange('A1:E1').setFontWeight('bold').setBackground('#f3f3f3');
  }
  
  return sheet;
}

/**
 * Appends incident data to the Gmail Incidents sheet.
 * @param {{ incident_id: string, description: string, priority: string, apiResponse?: object }} data - Incident data to log
 */
function appendIncidentToSheet(data) {
  const sheet = getGmailIncidentsSheet();
  const timestamp = new Date();
  const apiResponseJson = data.apiResponse ? JSON.stringify(data.apiResponse, null, 2) : '';
  
  sheet.appendRow([
    timestamp,
    data.incident_id || '',
    data.priority || '',
    data.description || '',
    apiResponseJson
  ]);

  registerLog('INFO', 'appendIncidentToSheet', 'Incident logged to sheet', {
    incidentId: data.incident_id
  });
}
