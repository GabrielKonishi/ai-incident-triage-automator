/**
 * Cliente para a API Dify (workflow).
 * Responsabilidade: montar requisição, chamar o workflow e interpretar a resposta.
 */

/**
 * Executa o workflow no Dify com o problema informado.
 * @param {string} problem - Descrição do problema/incidente
 * @param {string} apiKey - API key do Dify
 * @param {string} apiUrl - URL do endpoint do workflow (ex.: https://api.dify.ai/v1/workflows/run)
 * @returns {string} Texto retornado pelo workflow (output "text")
 * @throws {Error} Em caso de falha de rede ou resposta inválida
 */
function runDifyWorkflow(problem, apiKey, apiUrl) {
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
  return json.data.outputs.text;
}
