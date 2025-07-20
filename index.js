import { google } from 'googleapis';
import express from 'express';
import bodyParser from 'body-parser';
import { authorize } from './auth.js';

const app = express();
app.use(bodyParser.json());

const SHEET_ID = '19a4W_VJ11ArpSwYLwN8EsPwLMrR0u4IqZFAGa2vxN18';

app.post('/webhook', async (req, res) => {
  try {
    const authClient = await authorize();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const body = req.body;
    console.log('Received webhook:', body);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[new Date().toISOString(), JSON.stringify(body)]],
      },
    });

    res.status(200).send('Success');
  } catch (err) {
    console.error('Error handling webhook:', err);
    res.status(500).send('Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Anna webhook listening on port ${PORT}`);
});