function analiseAllIncidents() {
  const tab = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastLine = tab.getLastRow();
  const apiKey = PropertiesService.getScriptProperties().getProperty('DIFY_API_KEY');
  if (lastLine < 2) return;

  const interval = tab.getRange(2, 1, lastLine - 1, 1);
  const data = interval.getValues();

  const url = "https://api.dify.ai/v1/workflows/run";

  for (let i = 0; i < data.length; i++) {
    let problem = data[i][0]
    let options = {
      "method": "post",
      "contentType": "application/json",
      "headers": { "Authorization": "Bearer " + apiKey},
      "payload": JSON.stringify({
        "inputs": { "problem": problem },
        "response_mode": "blocking",
        "user": "comando-team"
      })
    };

    try {
      let response = UrlFetchApp.fetch(url, options);
      let responseText = response.getContentText()
      let json = JSON.parse(responseText);
      let result = json.data.outputs.text;
      tab.getRange(i + 2, 2).setValue(result);
    } catch (e) {
      tab.getRange(i + 2, 2).setValue("Connection error: " + e.toString());
    }

    Utilities.sleep(500);

  }
  
}