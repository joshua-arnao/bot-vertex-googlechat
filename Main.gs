function onMessage(event) {
  try {
    const cache = CacheService.getUserCache();
    const userId = event.user?.name || 'default_user';

    let userText = (
      event.message?.text ||
      event.chat?.messagePayload?.message?.text ||
      ''
    ).trim();
    if (!userText) return createResponse('No detecté texto.');

    const userTextLower = userText.toLowerCase();

    if (['hola', 'buenas', 'ayuda'].some((f) => userTextLower.includes(f))) {
      cache.remove('anchor_' + userId);
      cache.remove('last_reply_' + userId);
      const welcomeMsg =
        '¡Hola! Soy tu asistente. ¿Sobre qué producto quieres consultar?';
      logUsage(userText, welcomeMsg, { totalTokenCount: 0 });
      return createResponse(welcomeMsg);
    }

    let words = userTextLower.split(' ').filter((p) => p.length > 3);
    let currentAnchor = cache.get('anchor_' + userId) || '';

    const sheetValues = SpreadsheetApp.openById(CONFIG.SHEET_ID)
      .getDataRange()
      .getDisplayValues();
    let results = [];

    let searchTerms = [...words];
    if (currentAnchor && !searchTerms.includes(currentAnchor)) {
      searchTerms.push(currentAnchor);
    }

    for (let i = 1; i < sheetValues.length; i++) {
      let rowText = sheetValues[i].join(' ').toLowerCase();

      if (searchTerms.some((p) => rowText.includes(p))) {
        let cleanRow = sheetValues[i]
          .filter((c) => c.trim() !== '')
          .join(' | ');
        results.push(cleanRow);

        words.forEach((p) => {
          if (sheetValues[i][0].toLowerCase().includes(p)) currentAnchor = p;
        });
      }
    }

    if (currentAnchor) cache.put('anchor_' + userId, currentAnchor, 21600);

    let aiContext = results.slice(0, 5).join('\n');
    const previousReply = cache.get('last_reply_' + userId) || '';

    const finalPrompt = `INFO_EXCEL:\n${aiContext || 'No hay datos'}\n\nHISTORIAL_BREVE: El bot dijo: "${previousReply}"\n\nPREGUNTA_USUARIO: "${userText}"`;

    const response = callGemini(finalPrompt);
    const answer =
      response.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No pude generar respuesta.';
    const usage = response.usageMetadata || { totalTokenCount: 0 };

    logUsage(userText, answer, usage);
    cache.put('last_reply_' + userId, answer, 21600);

    return createResponse(answer);
  } catch (e) {
    return createResponse('⚠️ Error: ' + e.toString());
  }
}

function onAddedToSpace(e) {
  return createResponse('¡Hola!');
}
function onRemovedFromSpace(e) {}
function onAppCommand(e) {
  return createResponse('OK');
}
