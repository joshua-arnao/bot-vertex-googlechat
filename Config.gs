const props = PropertiesService.getScriptProperties();

const CONFIG = {
  PROJECT_ID: props.getProperty('PROJECT_ID'),
  LOCATION: 'us-central1',
  DOC_ID: props.getProperty('DOC_ID'),
  SHEET_ID: props.getProperty('SHEET_ID'),
  SHEET_LOG_NAME: 'Consumo',
  MODEL_ID: 'gemini-2.5-flash',
};
