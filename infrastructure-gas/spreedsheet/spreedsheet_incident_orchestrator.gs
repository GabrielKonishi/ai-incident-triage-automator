/**
 * Main entry point – orchestrates incident analysis.
 * Coordinates spreadsheet, config, Dify API and result writing.
 */

/** Delay in ms between Dify API calls (avoid rate limit). */
const DELAY_BETWEEN_CALLS_MS = 2000;

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

  let errors = 0;

  for (let i = 0; i < incidentDescriptions.length; i++) {
    const description = incidentDescriptions[i][0];
    const rowIndex = i + 2;

    try {
      const payload = {
        description: description,
        reported_by: "Incident Spreedsheet",
        source: "GoogleSheets",
        incident_id: incident_id || "",
        priority: 'MEDIUM'
      }

      const apiResponse = callPythonBackend(payload);
      
      let resultText = "Erro na resposta da IA";
      if (apiResponse && apiResponse.analysis_summary) {
        resultText = "Incident ID: " + apiResponse.incident_id +"Summary: " + apiResponse.analysis_summary + "\nUrgency: " + apiResponse.urgency + "\nAction: " + apiResponse.immediate_action;
      }

      writeResultToSheet(sheet, rowIndex, resultText);
      
      registerLog("INFO", "analyzeAllIncidents", "Linha " + rowIndex + " analisada via Python", { rowIndex });

    } catch (e) {
      errors++;
      writeResultToSheet(sheet, rowIndex, "Erro de Conexão: " + e.toString());
      registerLog("ERROR", "analyzeAllIncidents", "Erro ao analisar linha " + rowIndex, {
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
