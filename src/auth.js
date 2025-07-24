import { GoogleAuth } from 'google-auth-library';

export async function authorize() {
  const auth = new GoogleAuth({
    keyFile: './service-account.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return await auth.getClient();
}
