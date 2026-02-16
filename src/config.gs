/**
 * Application configuration and constants.
 * Centralizes API keys, URLs and parameters.
 */

const DIFY = {
  USER_ID: "comando-team",
  RESPONSE_MODE: "blocking",
  /** Default URL when DIFY_API_URL is not set in Script Properties */
  DEFAULT_WORKFLOW_URL: "https://api.dify.ai/v1/workflows/run"
};

/**
 * Returns the Dify API key from script properties.
 * @returns {string} API key
 */
function getDifyApiKey() {
  return PropertiesService.getScriptProperties().getProperty('DIFY_API_KEY');
}

/**
 * Returns the Dify workflow endpoint URL from script properties.
 * Falls back to default Dify URL if DIFY_API_URL is not set.
 * @returns {string} API URL
 */
function getDifyApiUrl() {
  const url = PropertiesService.getScriptProperties().getProperty('DIFY_API_URL');
  return url || DIFY.DEFAULT_WORKFLOW_URL;
}