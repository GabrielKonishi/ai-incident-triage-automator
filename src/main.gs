/**
 * Main entry point – orchestrates incident analysis.
 * Coordinates spreadsheet, config, Dify API and result writing.
 */

/** Delay in ms between Dify API calls (avoid rate limit). */
const DELAY_BETWEEN_CALLS_MS = 500;

/**
 * Analyzes all incidents in column A of the "Incidents" sheet:
 * for each problem calls the Dify workflow and writes the result to column B.
 */
function analyzeAllIncidents() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getIncidentsSheet(ss);
  if (!sheet) {
    registerLog("ERROR", "analyzeAllIncidents", "Sheet 'Incidents' not found. Create a sheet with that name.", {
      expectedSheet: "Incidents"
    });
    return;
  }
  const { problems: incidentDescriptions } = getProblemsFromSheet(sheet);
  if (incidentDescriptions.length === 0) {
    registerLog("INFO", "analyzeAllIncidents", "No incidents to analyze");
    return;
  }

  registerLog("INFO", "analyzeAllIncidents", "Analysis started", {
    sheet: INCIDENTS_SHEET_NAME,
    total: incidentDescriptions.length
  });

  const apiKey = getDifyApiKey();
  const apiUrl = getDifyApiUrl();
  if (!apiKey) {
    registerLog("ERROR", "analyzeAllIncidents", "DIFY_API_KEY is not set in Script Properties.");
    return;
  }

  let errors = 0;

  for (let i = 0; i < incidentDescriptions.length; i++) {
    const problem = incidentDescriptions[i][0];
    const rowIndex = i + 2;

    try {
      const result = runDifyWorkflow(problem, apiKey, apiUrl);
      writeResultToSheet(sheet, rowIndex, result);
      registerLog("INFO", "analyzeAllIncidents", "Row " + rowIndex + " analyzed", { rowIndex });
    } catch (e) {
      errors++;
      writeResultToSheet(sheet, rowIndex, "Connection error: " + e.toString());
      registerLog("ERROR", "analyzeAllIncidents", "Error analyzing row " + rowIndex, {
        rowIndex,
        error: e.toString()
      });
    }

    Utilities.sleep(DELAY_BETWEEN_CALLS_MS);
  }

  registerLog("INFO", "analyzeAllIncidents", "Analysis completed", {
    processed: incidentDescriptions.length,
    errors
  });
}
