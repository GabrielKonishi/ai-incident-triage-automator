/**
 * Logging via the "Log" sheet.
 * Creates the Log sheet if missing and appends log entries.
 */

const LOG_SHEET_NAME = "Log";

/**
 * Returns the log sheet, creating it if it does not exist.
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
 * Creates the "Log" sheet with headers and formatting.
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
 * Appends a log row to the "Log" sheet.
 * @param {string} level - Level: "INFO", "WARN", "ERROR"
 * @param {string} funcName - Name of the function that produced the log
 * @param {string} message - Message
 * @param {string|object} [payload=""] - Extra data (object is stringified to JSON)
 */
function registerLog(level, funcName, message, payload = "") {
  const sheet = getLogSheet();
  const now = new Date();
  const payloadString = typeof payload === "object" ? JSON.stringify(payload, null, 2) : payload;
  sheet.appendRow([now, level, funcName, message, payloadString]);
}