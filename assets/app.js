/* Open house sign-in. Reads window.OH (config.js in the property folder).
   Each sign-in becomes one row in ros_inbox; Realtor OS turns it into a buyer lead. */
(function () {
  'use strict';
  const OH = window.OH;
  const $ = id => document.getElementById(id);

  // mode 'preview' sends nothing (sign-ins only queue on this device). 'live' inserts into Supabase.
  // The key is public by design: visitors can only insert into ros_inbox (row-level security).
  const CFG = { mode: 'live', url: 'https://ffudeimvudfcdgqmpgrr.supabase.co', key: 'sb_publishable_bWXLJES2-7sbm3cYXa5XKg_kwZ15dfh' };
  const QUEUE_KEY = 'oh_queue', FAILED_KEY = 'oh_failed';

  const money = n => '$' + Math.round(n).toLocaleString('en-CA');
  const money2 = n => '$' + n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* ---------- Fill the page from config ---------- */
  function fill() {
    document.title = 'Open House · ' + OH.address;
    const photo = OH.photos[0];
    $('hero-img').src = photo.src; $('hero-img').alt = photo.alt || '';
    $('staged').hidden = !photo.staged;
    $('address').textContent = OH.address;
    $('area').textContent = OH.area;
    $('price').textContent = money(OH.price);
    $('price-tag').textContent = OH.priceTag || '';
    $('facts').textContent = OH.facts.join(' · ');
    $('when').textContent = 'Open house ' + OH.openHouse;
    $('consent-text').textContent = `Yes, ${OH.host.name} (${OH.host.brokerage}) may text or email me about this and similar homes. Unsubscribe anytime.`;
    $('footer').textContent = `Listed by ${OH.listing.agent}, ${OH.listing.brokerage} · Hosted by ${OH.host.name}, ${OH.host.brokerage}`;

    $('guide').href = OH.buyerGuide;
    // Optional feature sheet (PDF in the listing folder). Older pages without the button just skip this.
    if ($('feature') && OH.featureSheet) { $('feature').href = OH.featureSheet; $('feature').hidden = false; }
    const sms = text => `sms:${OH.host.phone}?&body=${encodeURIComponent(text)}`; // "?&" works on iPhone and Android
    // No floor plan file yet? Hide that part instead of showing a broken image.
    $('plan-img').onerror = () => { $('plan-link').hidden = true; const h = document.querySelector('.plan h2'); if (h) h.hidden = true; };
    $('plan-link').href = $('plan-img').src = OH.floorPlan.src;
    $('plan-img').alt = OH.floorPlan.alt;
    $('cta-heading').textContent = OH.cta.heading;
    $('cta').textContent = OH.cta.button;
    $('cta').href = sms(OH.cta.text);
    $('sms').href = sms(OH.strataDocsText);

    // Only figures straight from the listing. No mortgage or other estimates.
    const c = OH.costs;
    const card = document.querySelector('.card');
    if (card) {
      card.querySelector('h2').textContent = 'Monthly strata & taxes';
      card.querySelector('.note').textContent = 'From the listing. Ask me about mortgage numbers.';
    }
    const rows = [
      ['Strata fee', money2(c.strata) + '/mo', c.strataNote],
      ['Property tax', `${money(c.taxMonthly)}/mo`, c.taxYearly ? `${money2(c.taxYearly)} a year` : '']
    ];
    $('costs').innerHTML = '';
    rows.forEach(([label, value, sub]) => {
      const d = document.createElement('div');
      const dt = document.createElement('dt'); dt.textContent = label;
      const dd = document.createElement('dd'); dd.textContent = value;
      if (sub) { const s = document.createElement('small'); s.textContent = sub; dd.appendChild(s); }
      d.append(dt, dd); $('costs').appendChild(d);
    });
  }

  /* ---------- Offline-safe queue ---------- */
  function readQueue() { try { return JSON.parse(localStorage.getItem(QUEUE_KEY)) || []; } catch (e) { return []; } }
  function writeQueue(q) { try { localStorage.setItem(QUEUE_KEY, JSON.stringify(q)); } catch (e) { /* private mode: nothing to do */ } }

  // 'sent', 'retry' (offline, timeout, server busy or spam brake) or 'rejected' (the database refused this row).
  async function send(row) {
    if (CFG.mode !== 'live') { console.info('[preview] not sent:', row); return 'retry'; }
    const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 15000);
    try {
      const res = await fetch(CFG.url + '/rest/v1/ros_inbox', {
        method: 'POST', keepalive: true, signal: ctrl.signal, // keepalive: finishes even if the tab is closed
        headers: { apikey: CFG.key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify(row)
      });
      if (res.ok) return 'sent';
      const text = await res.text().catch(() => '');
      if (res.status >= 500 || res.status === 408 || res.status === 429 || /too many requests/i.test(text)) return 'retry';
      console.error('Sign-in rejected:', res.status, text);
      return 'rejected';
    } catch (e) {
      console.warn('Retry later:', e);
      return 'retry';
    } finally { clearTimeout(timer); }
  }

  // Rejected rows are kept on the device (localStorage oh_failed) so they can be recovered by hand.
  function keepFailed(item) { try { localStorage.setItem(FAILED_KEY, JSON.stringify(JSON.parse(localStorage.getItem(FAILED_KEY) || '[]').concat(item))); } catch (e) { /* nothing to do */ } }

  async function submit(row) {
    const item = { qid: Date.now() + Math.random().toString(36).slice(2), row };
    const result = await send(row);
    if (result === 'retry') writeQueue(readQueue().concat(item));
    else if (result === 'rejected') keepFailed(item);
  }

  let flushing = false;
  async function flush() {
    if (flushing) return;
    flushing = true;
    try {
      for (const item of readQueue()) {
        const result = await send(item.row);
        if (result === 'retry') break; // still offline; keep order and try again later
        if (result === 'rejected') keepFailed(item);
        writeQueue(readQueue().filter(x => x.qid !== item.qid));
      }
    } finally { flushing = false; }
  }

  /* ---------- Form ---------- */
  const pick = name => (document.querySelector(`input[name="${name}"]:checked`) || {}).value || null;
  const ROS_TIMELINE = { 'looking': 'Just browsing', '0-3': '1-3 months', '3-6': '3-6 months', '6+': '6-12 months' }; // form value -> Realtor OS timeline label

  document.querySelectorAll('input[name="agent"]').forEach(r =>
    r.addEventListener('change', () => { $('agent-name-wrap').hidden = pick('agent') !== 'yes'; }));

  $('form').addEventListener('submit', async e => {
    e.preventDefault();
    const v = id => $(id).value.trim();
    const first = v('first'), last = v('last'), phone = v('phone'), email = v('email');
    const err = $('err'); err.textContent = '';
    if (!first) { err.textContent = 'Add your first name.'; $('first').focus(); return; }
    if (!phone && !email) { err.textContent = 'Add a phone number or an email so I can send you the guide.'; $('phone').focus(); return; }
    if (phone && phone.replace(/\D/g, '').length < 10) { err.textContent = 'That phone number looks short. Include the area code.'; $('phone').focus(); return; }
    if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = 'That email address looks incomplete.'; $('email').focus(); return; }

    if (v('company')) { showThanks(first); return; } // honeypot filled: a bot. Drop it silently.

    const now = new Date().toISOString();
    const consent = $('consent').checked;
    const src = new URLSearchParams(location.search).get('src');
    const timeline = pick('timeline');
    const row = {
      source: 'open-house',
      name: (first + ' ' + last).trim().slice(0, 80),
      email: email ? email.slice(0, 120) : null,
      phone: phone ? phone.slice(0, 30) : null,
      address: OH.leadProperty,
      area: OH.boardArea || null,
      timeline: timeline ? ROS_TIMELINE[timeline] : null,
      details: {
        property: OH.leadProperty,
        src: src ? src.slice(0, 40) : null,
        agent: pick('agent'),
        agentName: pick('agent') === 'yes' ? (v('agent-name').slice(0, 60) || null) : null,
        timeline,
        firstTime: pick('firstTime'),
        preApproved: pick('preApproved'),
        use: pick('use'),
        pet: pick('pet'),
        heard: pick('heard'),
        consent,
        consentAt: consent ? now : null,
        consentText: consent ? $('consent-text').textContent : null,
        buyerGuide: true, // signing in is how they ask for the guide
        signedInAt: now
      }
    };

    showThanks(first);
    await submit(row);
    flush();
  });

  function showThanks(first) {
    $('signin').hidden = true;
    $('thanks').hidden = false;
    $('thanks-title').textContent = `Thanks, ${first}!`;
    window.scrollTo(0, 0);
    $('thanks-title').focus({ preventScroll: true });
  }

  /* ---------- vCard ---------- */
  $('vcard').addEventListener('click', async () => {
    const h = OH.host;
    let photo = '';
    try {
      const res = await fetch(h.headshot);
      if (res.ok && /image\/jpe?g/.test(res.headers.get('content-type') || '')) {
        const buf = new Uint8Array(await res.arrayBuffer());
        let bin = ''; for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
        photo = 'PHOTO;ENCODING=b;TYPE=JPEG:' + btoa(bin) + '\r\n';
      }
    } catch (e) { /* no headshot: card without a photo */ }
    const card = 'BEGIN:VCARD\r\nVERSION:3.0\r\n' +
      `N:${h.last};${h.first};;;\r\nFN:${h.name}\r\nORG:${h.brokerage}\r\nTITLE:REALTOR®\r\n` +
      `TEL;TYPE=CELL,VOICE:${h.phoneDisplay}\r\nEMAIL;TYPE=INTERNET:${h.email}\r\n` + photo + 'END:VCARD\r\n';
    const url = URL.createObjectURL(new Blob([card], { type: 'text/vcard' }));
    const a = document.createElement('a');
    a.href = url; a.download = h.name.replace(/\s+/g, '-') + '.vcf';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  });

  /* ---------- Background retries ---------- */
  fill();
  flush();
  addEventListener('online', () => flush());
  setInterval(() => { if (readQueue().length) flush(); }, 20000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && readQueue().length) flush(); });
})();
