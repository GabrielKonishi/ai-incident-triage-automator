/**
 * HTTP client for calling the Python backend API.
 * Handles POST requests with JSON payloads.
 */

/**
 * Calls the Python backend API with the given payload.
 * @param {{ incident_id: string, description: string, priority: string }} payload - JSON payload to send
 * @returns {object} Parsed JSON response from the backend
 * @throws {Error} On network failure or non-2xx response
 */
function callPythonBackend(payload) {
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(API_ENDPOINT, options);
  const responseCode = response.getResponseCode();
  const responseText = response.getContentText();

  if (responseCode >= 200 && responseCode < 300) {
    try {
      return JSON.parse(responseText);
    } catch (e) {
      return { raw: responseText };
    }
  }

  // Throw error for non-success status codes
  throw new Error(`Python backend returned status ${responseCode}: ${responseText}`);
}
