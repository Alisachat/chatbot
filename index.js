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
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[new Date().toISOString(), intentName, JSON.stringify(body)]],
      },
    });

    let responseText = 'Hmm… I’m not sure how to help you, babe 😘';

    if (intentName === 'Appointment Time') {
      responseText = "Mmm... I'd love to spend some time with you 😘\n\nLet me take just a few details, sweetie:\n\n1️⃣ What time would you like to meet?\n2️⃣ Incall (you come to me) or Outcall (I come to you)?\n3️⃣ How long would you like?\n4️⃣ Any naughty extras you'd like to add? 💋\n5️⃣ And if it's an outcall, what’s the address?";
    } else if (intentName === 'Extra Handling') {
      responseText = "Mmm… I do offer a few naughty little extras 😇\n\n💋 Passionate kissing – €50\n👐 Erotic massage – €40\n🧴 Oil play – €30\n🥵 Dirty talk & roleplay – €20\n\nYou can mix and match, babe… just tell me what excites you 😘";
    } else if (intentName === 'Incall Outcall Price') {
      responseText = "Here are my little moments of pleasure, just for you 💋…\n\n💖 Incall (my place):\n- 30 minutes → €100\n- 1 hour → €150\n\n💋 Outcall (your place):\n- 1 hour → €200 + taxi fare\n\nMmm… tell me which one you crave, darling 😘";
    } else if (intentName === 'Picture Request Intent') {
      responseText = "Mmm 😘 I knew you'd want a peek... Here’s one of my favorites 👀🔥\nWould you like something more intimate?";
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
