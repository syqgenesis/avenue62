// Avenue 62 enquiry form -> Google Sheet.
// Paste into Extensions > Apps Script of the Sheet that should receive leads,
// then Deploy > New deployment > Web app (Execute as: Me, Who has access: Anyone).
// After editing an existing deployment: Deploy > Manage deployments > Edit > Version: New version.

const SHEET_NAME = 'Leads';
const HEADERS = ['Received', 'Email', 'Phone', 'Page', 'Name', 'Company'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  const email = String(p.email || '').trim().slice(0, 200);
  const phone = String(p.phone || '').trim().slice(0, 40);
  const name = String(p.name || '').trim().slice(0, 100);
  const company = String(p.company || '').trim().slice(0, 120);
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
      sheet.setFrozenRows(1);
    }
    // Write any missing header cells; older sheets only had the first four columns.
    const header = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    if (header.join('|') !== HEADERS.join('|')) sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

    // Prefix text with ' so Sheets never evaluates submitted values as formulas.
    const t = (v) => (v ? "'" + v : '');
    sheet.appendRow([new Date(), t(email), t(phone), String(p.page || '').slice(0, 300), t(name), t(company)]);
  } finally {
    lock.releaseLock();
  }
  return ContentService.createTextOutput('ok');
}
