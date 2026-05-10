const SHEETS = {
  executionLog: 'Execution_Log',
  defectLog: 'Defect_Log'
};

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const spreadsheet = SpreadsheetApp.openById(payload.spreadsheetId);

  upsertExecutionRows_(spreadsheet, payload.executionLogRows || []);
  appendDefectCandidates_(spreadsheet, payload.defectCandidates || []);

  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      executionRows: (payload.executionLogRows || []).length,
      defectCandidates: (payload.defectCandidates || []).length
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function upsertExecutionRows_(spreadsheet, rows) {
  const sheet = spreadsheet.getSheetByName(SHEETS.executionLog);
  const values = sheet.getDataRange().getValues();
  const index = {};

  for (let i = 1; i < values.length; i++) {
    const runId = values[i][0];
    const tcId = values[i][5];
    if (runId && tcId) {
      index[`${runId}::${tcId}`] = i + 1;
    }
  }

  rows.forEach(row => {
    const next = [
      row.runId,
      row.runDate,
      row.buildVersion,
      row.environment,
      row.device,
      row.tcId,
      row.tcTitle,
      row.result,
      row.actualResult,
      row.evidenceLink,
      row.defectId,
      row.tester,
      row.notes
    ];
    const key = `${row.runId}::${row.tcId}`;
    if (index[key]) {
      sheet.getRange(index[key], 1, 1, next.length).setValues([next]);
    } else {
      sheet.appendRow(next);
    }
  });
}

function appendDefectCandidates_(spreadsheet, rows) {
  const sheet = spreadsheet.getSheetByName(SHEETS.defectLog);
  rows.forEach(row => {
    sheet.appendRow([
      row.runId,
      row.defectId,
      row.tcId,
      row.category,
      row.severity,
      row.priority,
      row.title,
      row.status,
      row.owner,
      row.foundDate,
      row.evidenceLink,
      row.expected,
      row.actual,
      row.notes
    ]);
  });
}
