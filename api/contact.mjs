// [field, max length, required, label in the Telegram message]
const FIELDS = [
  ['name', 120, true, 'Ism'],
  ['contact', 160, true, 'Aloqa'],
  ['company', 160, false, 'Kompaniya'],
  ['position', 120, false, 'Lavozim'],
  ['industry', 80, false, 'Soha'],
  ['employees', 40, false, 'Xodimlar'],
  ['message', 3000, false, 'Xabar'],
];

const SOURCES = { modal: 'Konsultatsiya oynasi', contact: 'Aloqa sahifasi' };

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const json = (body, status = 200) => Response.json(body, { status });

export async function POST(request) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    // Names only, never values: tells the owner which variable this deployment can't see.
    const missing = [!token && 'TELEGRAM_BOT_TOKEN', !chatId && 'TELEGRAM_CHAT_ID'].filter(Boolean);
    const env = process.env.VERCEL_ENV ?? 'unknown';
    const commit = (process.env.VERCEL_GIT_COMMIT_SHA ?? '').slice(0, 7) || 'unknown';
    console.error(`[contact] missing ${missing.join(', ')} in ${env} deployment of ${commit}`);
    return json({ ok: false, error: 'not_configured', missing, env, commit }, 500);
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
  for (const [field, max, required] of FIELDS) {
    const value = typeof body[field] === 'string' ? body[field].trim() : '';
    if ((required && !value) || value.length > max) return json({ ok: false, error: `invalid_${field}` }, 400);
    if (value) data[field] = escapeHtml(value);
  }
  const lang = ['uz', 'ru', 'en'].includes(body.lang) ? body.lang.toUpperCase() : '—';
  const source = SOURCES[body.source] ?? 'Sayt';

  const lines = FIELDS.filter(([field]) => field !== 'message' && data[field]).map(
    ([field, , , label]) => `<b>${label}:</b> ${data[field]}`,
  );
  const text = [
    '<b>🆕 Yangi ariza — TrustCode</b>',
    '',
    ...lines,
    ...(data.message ? ['', `<b>Xabar:</b>\n${data.message}`] : []),
    '',
    `<i>${source} · Til: ${lang} · ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' })}</i>`,
  ].join('\n');

  const send = (targetChat) =>
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: targetChat, text, parse_mode: 'HTML', disable_web_page_preview: true }),
    })
      .then(async (res) => ({ ok: res.ok, status: res.status, body: await res.json().catch(() => ({})) }))
      .catch((err) => {
        console.error('[contact] Telegram request failed', err);
        return null;
      });

  let tg = await send(chatId);

  // A basic group gets a new id when Telegram upgrades it to a supergroup.
  const migratedTo = tg?.body?.parameters?.migrate_to_chat_id;
  if (tg && !tg.ok && migratedTo) {
    console.error(`[contact] Chat ${chatId} became a supergroup; update TELEGRAM_CHAT_ID to ${migratedTo}`);
    tg = await send(migratedTo);
  }

  if (!tg || !tg.ok) {
    if (tg) console.error('[contact] Telegram error', tg.status, JSON.stringify(tg.body));
    return json({ ok: false, error: 'telegram_failed' }, 502);
  }
  return json({ ok: true });
}
