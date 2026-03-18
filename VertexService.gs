function callGemini(prompt) {
  const url = `https://${CONFIG.LOCATION}-aiplatform.googleapis.com/v1/projects/${CONFIG.PROJECT_ID}/locations/${CONFIG.LOCATION}/publishers/google/models/${CONFIG.MODEL_ID}:generateContent`;

  const instruction =
    'Eres un asistente experto. Responde de forma BREVE (máximo 3-4 frases). REGLA CRÍTICA: Si el usuario pregunta por KPIs, beneficios o detalles, busca bien en la INFO_EXCEL proporcionada; los datos están ahí. Si es una pregunta de seguimiento, asume que seguimos hablando del mismo producto mencionado en HISTORIAL_BREVE.';

  const payload = {
    systemInstruction: { parts: [{ text: instruction }] },
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 350 },
  };

  const params = {
    method: 'POST',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  return JSON.parse(UrlFetchApp.fetch(url, params).getContentText());
}
