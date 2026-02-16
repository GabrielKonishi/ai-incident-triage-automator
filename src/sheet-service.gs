/**
 * Serviço de leitura e escrita na planilha de incidentes.
 * Responsabilidade: obter dados da aba "Incidents" e escrever resultados nas células.
 */

/** Nome da aba onde ficam os incidentes (coluna A = problema, coluna B = resultado). */
const INCIDENTS_SHEET_NAME = "Incidents";

/**
 * Retorna a aba de incidentes pela nome. Não cria a aba se não existir.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} spreadsheet - Planilha ativa
 * @returns {GoogleAppsScript.Spreadsheet.Sheet|null} Aba "Incidents" ou null
 */
function getIncidentsSheet(spreadsheet) {
  return spreadsheet.getSheetByName(INCIDENTS_SHEET_NAME);
}

/**
 * Obtém a lista de problemas (coluna A) a partir da linha 2 até a penúltima linha.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - Aba Incidents
 * @returns {{ problems: string[][], lastRow: number }} Valores da coluna e última linha
 */
function getProblemsFromSheet(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return { problems: [], lastRow };
  }
  // Lê da linha 2 até a penúltima (original excluía a última). Se lastRow === 2, lê só a linha 2.
  const endRow = lastRow === 2 ? 2 : lastRow - 1;
  const range = sheet.getRange(2, 1, endRow, 1);
  const data = range.getValues();
  return { problems: data, lastRow };
}

/**
 * Escreve o resultado (ou mensagem de erro) na coluna B da linha indicada.
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet - Aba Incidents
 * @param {number} rowIndex - Índice da linha (1-based, considerando cabeçalho)
 * @param {string} value - Texto a gravar
 */
function writeResultToSheet(sheet, rowIndex, value) {
  sheet.getRange(rowIndex, 2).setValue(value);
}
