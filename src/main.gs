/**
 * Ponto de entrada principal – orquestração da análise de incidentes.
 * Responsabilidade: coordenar planilha, config, Dify e escrita dos resultados.
 */

/** Intervalo em ms entre chamadas ao Dify (evitar rate limit). */
const DELAY_BETWEEN_CALLS_MS = 500;

/**
 * Analisa todos os incidentes da coluna A na aba "Incidents":
 * para cada problema chama o workflow Dify e grava o resultado na coluna B.
 */
function analiseAllIncidents() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tab = getIncidentsSheet(ss);
  if (!tab) {
    registrarLog("ERROR", "analiseAllIncidents", "Sheet 'Incidents' not found. Create a sheet with that name.", {
      expectedSheet: "Incidents"
    });
    return;
  }
  const { problems } = getProblemsFromSheet(tab);
  if (problems.length === 0) {
    registrarLog("INFO", "analiseAllIncidents", "No incidents to analyze");
    return;
  }

  registrarLog("INFO", "analiseAllIncidents", "Analysis started", {
    sheet: INCIDENTS_SHEET_NAME,
    total: problems.length
  });

  const apiKey = getDifyApiKey();
  const apiUrl = getDifyApiUrl();
  let errors = 0;

  for (let i = 0; i < problems.length; i++) {
    const problem = problems[i][0];
    const rowIndex = i + 2;

    try {
      const result = runDifyWorkflow(problem, apiKey, apiUrl);
      writeResultToSheet(tab, rowIndex, result);
      registrarLog("INFO", "analiseAllIncidents", "Row " + rowIndex + " analyzed", { rowIndex });
    } catch (e) {
      errors++;
      writeResultToSheet(tab, rowIndex, "Connection error: " + e.toString());
      registrarLog("ERROR", "analiseAllIncidents", "Error analyzing row " + rowIndex, {
        rowIndex,
        error: e.toString()
      });
    }

    Utilities.sleep(DELAY_BETWEEN_CALLS_MS);
  }

  registrarLog("INFO", "analiseAllIncidents", "Analysis completed", {
    processed: problems.length,
    errors
  });
}
