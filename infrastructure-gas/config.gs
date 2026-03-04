/**
 * Application configuration.
 * Centralizes the connection logic with the Python Backend.
 */

function getBackendUrl() {
  const url = PropertiesService.getScriptProperties().getProperty('BACKEND_URL');
  
  if (!url) {
    throw new Error(
      "❌ BACKEND_URL not found! \n" +
      "Please go to: Project Settings (Gear icon) > Script Properties > Add 'BACKEND_URL' with your Ngrok URL."
    );
  }
  
  const cleanUrl = url.trim();
  return cleanUrl.endsWith('/') ? cleanUrl.slice(0, -1) : cleanUrl;
}

/**
 * Endpoint used for API calls.
 * It's a 'function' or 'get' to ensure it always uses the latest Property value.
 */
function getApiEndpoint() {
  return getBackendUrl() + '/analyze';
}