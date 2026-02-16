/**
 * Configurações e constantes da aplicação.
 * Responsabilidade: centralizar chaves, URLs e parâmetros.
 */

const DIFY = {
  USER_ID: "comando-team",
  RESPONSE_MODE: "blocking",
  /** URL padrão quando DIFY_API_URL não está nas Script Properties */
  DEFAULT_WORKFLOW_URL: "https://api.dify.ai/v1/workflows/run"
};

/**
 * Obtém a API key do Dify das propriedades do script.
 * @returns {string} API key
 */
function getDifyApiKey() {
  return PropertiesService.getScriptProperties().getProperty('DIFY_API_KEY');
}

/**
 * Obtém a URL do endpoint do workflow Dify das propriedades do script.
 * Se DIFY_API_URL não estiver definida, usa a URL padrão do Dify.
 * @returns {string} URL da API
 */
function getDifyApiUrl() {
  const url = PropertiesService.getScriptProperties().getProperty('DIFY_API_URL');
  return url || DIFY.DEFAULT_WORKFLOW_URL;
}