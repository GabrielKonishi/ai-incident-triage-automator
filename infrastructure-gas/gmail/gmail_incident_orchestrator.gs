/**
 * Incident orchestrator module.
 * Coordinates the Gmail -> Python backend -> Spreadsheet flow.
 */

/**
 * Processes the complete Gmail incident flow:
 * 1. Fetches new incidents from Gmail
 * 2. For each incident, builds JSON payload and sends to Python backend
 * 3. On success, logs to spreadsheet and marks email as read
 */
function processGmailIncidentFlow() {
  registerLog('INFO', 'processGmailIncidentFlow', 'Starting Gmail incident processing flow');

  const incidents = getNewIncidentsFromGmail();

  if (!incidents || incidents.length === 0) {
    registerLog('INFO', 'processGmailIncidentFlow', 'No new incidents to process');
    return;
  }

  registerLog('INFO', 'processGmailIncidentFlow', 'Processing incidents', {
    count: incidents.length
  });

  let successCount = 0;
  let errorCount = 0;

  // Step 2: Process each incident
  for (let i = 0; i < incidents.length; i++) {
    const incident = incidents[i];

    try {
      // Build JSON payload compatible with backend
      const payload = {
        description: incident.body,
        reported_by: "Gmail",
        source: "Gmail",
        incident_id: incident.id || "",
        priority: 'MEDIUM'
      };

      // Step 3: Send to Python backend
      const apiResponse = callPythonBackend(payload);

      // Step 4: Log to spreadsheet
      appendIncidentToSheet({
        incident_id: payload.incident_id,
        description: payload.description,
        priority: payload.priority,
        apiResponse: apiResponse
      });

      // Step 5: Mark email as read
      try {
        const message = GmailApp.getMessageById(incident.id);
        message.markRead();
      } catch (e) {
        registerLog('WARN', 'processGmailIncidentFlow', 'Could not mark email as read', {
          incidentId: incident.id,
          error: e.toString()
        });
      }

      successCount++;
      registerLog('INFO', 'processGmailIncidentFlow', 'Incident processed successfully', {
        incidentId: incident.id
      });

    } catch (e) {
      errorCount++;
      registerLog('ERROR', 'processGmailIncidentFlow', 'Error processing incident', {
        incidentId: incident.id,
        error: e.toString()
      });
    }
  }

  registerLog('INFO', 'processGmailIncidentFlow', 'Flow completed', {
    total: incidents.length,
    success: successCount,
    errors: errorCount
  });
}
