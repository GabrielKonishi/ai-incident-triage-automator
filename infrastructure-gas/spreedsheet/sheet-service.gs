/**
 * Read/write service for the incidents spreadsheet.
 * Reads from the "Incidents" sheet and writes results to cells.
 */

/** Name of the sheet for incidents (column A = problem, column B = result). */
const INCIDENTS_SHEET_NAME = "Incidents";
const INCIDENT_DESCRIPTION_COLUMN = 1;
const INCIDENT_RESULT_COLUMN = 2;
const HEADER_ROW = 1;
const FIRST_DATA_ROW = HEADER_ROW + 1;

/**
 * Returns the incidents sheet by name. Does not create it if missing.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} spreadsheet - Active spreadsheet
 * @returns {GoogleAppsScript.Spreadsheet.Sheet|null} "Incidents" sheet or null
 */
function getIncidentsSheet(spreadsheet) {
  return spreadsheet.getSheetByName(INCIDENTS_SHEET_NAME);
}

/**
 * Gets the list of problems (column A) from row 2 to the second-to-last row.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - Incidents sheet
 * @returns {{ problems: string[][], lastRow: number }} Column values and last row number
 */
function getProblemsFromSheet(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < FIRST_DATA_ROW) {
    return { problems: [], lastRow };
  }
  // Keep legacy behavior: read until the second-to-last row.
  // If there's only one data row (lastRow === 2), read that single row.
  const numRows = lastRow - FIRST_DATA_ROW + 1;
  const range = sheet.getRange(FIRST_DATA_ROW, INCIDENT_DESCRIPTION_COLUMN, numRows, 1);
  const data = range.getValues();
  
  return { problems: data, lastRow };
}

/**
 * Writes the result (or error message) to column B at the given row.
 * Trims leading/trailing line breaks and sets vertical alignment to top for columns A and B.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - Incidents sheet
 * @param {number} rowIndex - Row index (1-based, header is row 1)
 * @param {string} value - Text to write
 */
function writeResultToSheet(sheet, rowIndex, value) {
  const trimmed = (value || "").toString().trim();
  const rangeB = sheet.getRange(rowIndex, INCIDENT_RESULT_COLUMN);
  rangeB.setValue(trimmed);
  // Keep both the incident description (A) and AI response (B) top-aligned for this row.
  sheet
    .getRange(rowIndex, INCIDENT_DESCRIPTION_COLUMN, 1, 2)
    .setVerticalAlignment("top");
}
