// Avenue 67 enquiry form -> Google Sheet.
// Paste into Extensions > Apps Script of the Sheet that should receive leads,
// then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).

const SHEET_NAME = 'Leads';

function doPost(e) {
  const p = (e && e.parameter) || {};
  const email = String(p.email || '').trim().slice(0, 200);
  const phone = String(p.phone || '').trim().slice(0, 40);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !/^\+?\d{9,14}$/.test(phone)) {
    return ContentService.createTextOutput('invalid');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Received', 'Email', 'Phone', 'Page']);
      sheet.setFrozenRows(1);
    }
    // Prefix with ' so Sheets never evaluates submitted text as a formula.
    sheet.appendRow([new Date(), "'" + email, "'" + phone, String(p.page || '').slice(0, 300)]);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}
