# Avenue 67

Landing page for Avenue 67, property sourcing in London, Oxford and Cambridge. Static site served by GitHub Pages.

## Connect the enquiry form to Google Sheets

1. Create a Google Sheet (for example "Avenue 67 leads").
2. In the Sheet, open **Extensions → Apps Script**, replace the editor contents with [`google-sheet/Code.gs`](google-sheet/Code.gs), and save.
3. **Deploy → New deployment → Select type: Web app**. Set *Execute as*: **Me**, *Who has access*: **Anyone**. Deploy and authorise.
4. Copy the web app URL (ends in `/exec`).
5. In `index.html`, set `var SHEET_URL = '<that URL>';`, commit and push.

Each enquiry becomes a row in a **Leads** tab: time received, email, phone, page.

## Photos

From [Unsplash](https://unsplash.com/license), free to use: Barbican tower at dusk, and curved balconies at night.
