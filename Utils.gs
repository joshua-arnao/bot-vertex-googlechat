function logUsage(promptText, responseText, usageData) {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
    let sheet =
      ss.getSheetByName(CONFIG.SHEET_LOG_NAME) ||
      ss.insertSheet(CONFIG.SHEET_LOG_NAME);

    sheet.appendRow([
      new Date(),
      promptText,
      usageData.promptTokenCount || 0,
      usageData.candidatesTokenCount || 0,
      usageData.totalTokenCount || 0,
      responseText.substring(0, 400),
    ]);
  } catch (e) {
    console.error('Error logging usage: ' + e.toString());
  }
}

function createResponse(text) {
  return {
    hostAppDataAction: {
      chatDataAction: {
        createMessageAction: {
          message: { text: text },
        },
      },
    },
  };
}

function testBot() {
  const testQuestion = 'que kpis mejora fidel?';
  const testId = 'TEST_SESSION_001';

  console.log('--- TEST: ' + testQuestion + ' ---');
  try {
    const response = onMessage({
      user: { name: testId },
      message: { text: testQuestion },
    });
    console.log(
      'BOT SAYS: ' +
        response.hostAppDataAction.chatDataAction.createMessageAction.message
          .text,
    );
  } catch (e) {
    console.error(e.message);
  }
}
