/**
 * Gmail trigger module.
 * Searches for unread emails with 'INCIDENT' in the subject and extracts incident data.
 */

/**
 * Gets new incidents from Gmail by searching for unread threads with 'INCIDENT' in the subject.
 * Extracts the message ID and body for each incident.
 * @returns {{ id: string, body: string }[]} Array of incident objects with id and body
 */
function getNewIncidentsFromGmail() {
  const query = 'is:unread subject:"INCIDENT"';
  const threads = GmailApp.search(query, 0, 50); // Limit to 50 threads

  if (!threads || threads.length === 0) {
    registerLog('INFO', 'getNewIncidentsFromGmail', 'No unread INCIDENT emails found', { query });
    return [];
  }

  const incidents = [];

  for (let i = 0; i < threads.length; i++) {
    const thread = threads[i];
    const messages = thread.getMessages();

    for (let j = 0; j < messages.length; j++) {
      const message = messages[j];
      
      // Only process unread messages
      if (!message.isUnread()) {
        continue;
      }

      const id = message.getId();
      const body = message.getPlainBody() || message.getBody();

      incidents.push({
        id: id,
        body: body
      });
    }
  }

  registerLog('INFO', 'getNewIncidentsFromGmail', 'Found incidents from Gmail', {
    threadsFound: threads.length,
    incidentsExtracted: incidents.length
  });

  return incidents;
}
