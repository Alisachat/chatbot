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
    const intentName = body.queryResult.intent.displayName;

    console.log('✅ Webhook triggered:', intentName);

    await sheets.spreadsheets.values.append({
      spreadsheetId: '19a4W_VJ11ArpSwYLwN8EsPwLMrR0u4IqZFAGa2vxN18',
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[new Date().toISOString(), intentName, JSON.stringify(body)]],
      },
    });

    let responseText = 'Hmm… I’m not sure how to help you, babe 😘';

    if (intentName === 'Appointment Time') {
      responseText = 'Sure babe 😘 What time were you thinking? I might be available…';
    } else if (intentName === 'Picture Request Intent') {
      responseText = 'Here’s a little something to tease you 😘 [Insert Photo URL]';
    } else if (intentName === 'Incall Outcall Price') {
      responseText = 'My sweet moments go for €150 for 1 hour incall, €200 outcall 💋';
    } else if (intentName === 'Extra Handling') {
      responseText = 'I have a few naughty extras just for you 😈 Want me to share them?';
    }

    return res.json({
      fulfillmentMessages: [
        {
          text: { text: [responseText] }
        }
      ]

    });

  } catch (err) {
    console.error('❌ Webhook error:', err);
    res.status(500).send('Webhook error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Anna webhook listening on port ${PORT}`);
});
