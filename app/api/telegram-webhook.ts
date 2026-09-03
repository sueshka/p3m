/**
 * POST /api/telegram-webhook — replies to /start with a button that opens
 * the Mini App.
 *
 * Telegram never launches an app on its own: a person has to tap. This
 * makes that tap one button in the chat instead of a hunt through the menu.
 *
 * Register it once (TELEGRAM_WEBHOOK_SECRET is any random string):
 *   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<host>/api/telegram-webhook&secret_token=<SECRET>"
 */
export const config = { runtime: 'edge' };

interface Update {
  message?: {
    chat?: { id?: number };
    text?: string;
  };
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Telegram echoes the secret set at registration; without it, anyone who
  // guesses this URL could make the bot post.
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET ?? '';
  if (secret && req.headers.get('x-telegram-bot-api-secret-token') !== secret) {
    return new Response('forbidden', { status: 403 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const appUrl = process.env.MINI_APP_URL || 'https://t.me/Project3Months_Bot/p3m';
  if (!token) {
    console.error('telegram-webhook: TELEGRAM_BOT_TOKEN missing');
    return new Response('ok', { status: 200 });
  }

  let update: Update;
  try {
    update = (await req.json()) as Update;
  } catch {
    return new Response('ok', { status: 200 });
  }

  const chatId = update.message?.chat?.id;
  const text = update.message?.text ?? '';
  if (!chatId || !text.startsWith('/start')) {
    return new Response('ok', { status: 200 });
  }

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: START_TEXT,
        reply_markup: {
          inline_keyboard: [[{ text: START_BUTTON, web_app: { url: appUrl } }]],
        },
      }),
    });
  } catch (err) {
    console.error('sendMessage failed', err);
  }

  return new Response('ok', { status: 200 });
}

const START_TEXT =
  'Привет, на связи Sue!\n\n' +
  'Я собрала приложение, где обычный телефон превращается в инструмент ' +
  'кинематографичного сторителлинга: съёмка на iPhone, цвет и монтаж.\n\n' +
  'Overlays, LUTs и туториал по Open Gate — бесплатно, забирай сразу. ' +
  'А внутри комьюнити ждут 3 урока, разборы и эфиры.\n\n' +
  'Заходи, кнопка ниже.';

const START_BUTTON = 'Открыть';
