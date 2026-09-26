const FIELDS = {
  name: 120,
  company: 160,
  industry: 80,
  employees: 40,
  contact: 160,
  message: 3000,
};

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const json = (body, status = 200) => Response.json(body, { status });

export async function POST(request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error('[contact] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set');
    return json({ ok: false, error: 'not_configured' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid_json' }, 400);
  }
  if (!body || typeof body !== 'object') return json({ ok: false, error: 'invalid_body' }, 400);

  // Honeypot: bots fill hidden fields; answer as if it worked so they don't retry.
  if (typeof body.website === 'string' && body.website.trim()) return json({ ok: true });

  const data = {};
  for (const [field, max] of Object.entries(FIELDS)) {
    const value = typeof body[field] === 'string' ? body[field].trim() : '';
    if (!value || value.length > max) return json({ ok: false, error: `invalid_${field}` }, 400);
    data[field] = escapeHtml(value);
  }
  const lang = ['uz', 'ru', 'en'].includes(body.lang) ? body.lang.toUpperCase() : '—';

  const text = [
    '<b>🆕 Yangi ariza — TrustCode</b>',
    '',
    `<b>Ism:</b> ${data.name}`,
    `<b>Kompaniya:</b> ${data.company}`,
    `<b>Soha:</b> ${data.industry}`,
    `<b>Xodimlar:</b> ${data.employees}`,
    `<b>Aloqa:</b> ${data.contact}`,
    '',
    `<b>Xabar:</b>\n${data.message}`,
    '',
    `<i>Til: ${lang} · ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}</i>`,
  ].join('\n');

  const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
  }).catch((err) => {
    console.error('[contact] Telegram request failed', err);
    return null;
  });

  if (!tg || !tg.ok) {
    if (tg) console.error('[contact] Telegram error', tg.status, await tg.text());
    return json({ ok: false, error: 'telegram_failed' }, 502);
  }
  return json({ ok: true });
}
