/**
 * Monitoramento via log na aba "Log".
 * Responsabilidade: criar a aba Log (se não existir) e registrar entradas.
 */

const LOG_SHEET_NAME = "Log";

/**
 * Retorna a aba de log, criando-a se não existir.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getLogSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(LOG_SHEET_NAME);
  if (!sheet) {
    sheet = createLogSheet();
  }
  return sheet;
}

/**
 * Cria a aba "Log" com cabeçalhos e formatação.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
function createLogSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet(LOG_SHEET_NAME);
  sheet.appendRow(["Date/Time", "Level", "Function", "Message", "Payload"]);
  sheet.getRange("A1:E1").setFontWeight("bold").setBackground("#f3f3f3");
  return sheet;
}

/**
 * Registra uma linha de log na aba "Log".
 * @param {string} level - Nível: "INFO", "WARN", "ERROR"
 * @param {string} func - Nome da função que gerou o log
 * @param {string} message - Mensagem
 * @param {string|object} [payload=""] - Dados extras (objeto é convertido para JSON)
 */
function registrarLog(level, func, message, payload = "") {
  const sheet = getLogSheet();
  const now = new Date();
  const payloadString = typeof payload === "object" ? JSON.stringify(payload, null, 2) : payload;
  sheet.appendRow([now, level, func, message, payloadString]);
}