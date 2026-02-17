/**
 * Client for the Dify API (workflow).
 * Builds the request, calls the workflow and parses the response.
 */

/**
 * Runs the Dify workflow with the given problem.
 * @param {string} problem - Problem/incident description
 * @param {string} apiKey - Dify API key
 * @param {string} apiUrl - Workflow endpoint URL (e.g. https://api.dify.ai/v1/workflows/run)
 * @returns {string} Text returned by the workflow (output "text")
 * @throws {Error} On network failure or invalid response
 */
function runDifyWorkflow(problem, apiKey, apiUrl) {
  if (!apiUrl) {
    throw new Error("Dify API URL is empty.");
  }
  if (!apiKey) {
    throw new Error("Dify API key is empty.");
  }

  const options = {
    method: "post",
    contentType: "application/json",
    headers: { "Authorization": "Bearer " + apiKey },
    payload: JSON.stringify({
      inputs: { problem: problem },
      response_mode: DIFY.RESPONSE_MODE,
      user: DIFY.USER_ID
    })
  };

  const response = UrlFetchApp.fetch(apiUrl, options);
  const responseText = response.getContentText();
  const json = JSON.parse(responseText);
  const text = json && json.data && json.data.outputs ? json.data.outputs.text : undefined;
  if (typeof text !== "string") {
    throw new Error("Unexpected Dify response format: missing data.outputs.text");
  }
  return text;
}
