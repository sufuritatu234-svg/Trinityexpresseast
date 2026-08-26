const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const body = JSON.parse(event.body || '{}');
    const { name, phone, origin, destination, date, passengers, type } = body;
    if (!name || !phone) return { statusCode: 400, body: 'Missing required fields' };

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    const AGENT_EMAIL = process.env.AGENT_EMAIL || 'agent@example.com';
    const FROM = process.env.SENDGRID_FROM || 'no-reply@trinityexpresseast.example';

    if (!SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY not set');
      // proceed to store the enquiry even if email can't be sent
    }

    const subject = type === 'charter' ? `Charter request from ${name}` : `Booking enquiry from ${name}`;

    const text = `New enquiry:\n\nName: ${name}\nPhone: ${phone}\nRoute: ${origin || ''} → ${destination || ''}\nDate: ${date || ''}\nPassengers: ${passengers || ''}\nType: ${type || 'booking'}`;

    // Try to send email via SendGrid if configured
    if (SENDGRID_API_KEY) {
      const payload = {
        personalizations: [{ to: [{ email: AGENT_EMAIL }] }],
        from: { email: FROM },
        subject,
        content: [{ type: 'text/plain', value: text }]
      };

      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        console.error('SendGrid error', await res.text());
        // continue to persist enquiry even if email fails
      }
    }

    // Persist enquiry to repository file using GitHub Contents API
    // Environment vars required:
    // GITHUB_TOKEN - token with repo contents write access
    // GITHUB_REPO - owner/repo (defaults to current repo)
    // ENQUIRIES_PATH - path to file (defaults to data/enquiries.json)
    // BRANCH - branch to commit to (defaults to main)

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO || 'sufuritatu234-svg/Trinityexpresseast';
    const ENQUIRIES_PATH = process.env.ENQUIRIES_PATH || 'data/enquiries.json';
    const BRANCH = process.env.BRANCH || 'main';

    const newEntry = {
      id: Date.now(),
      name,
      phone,
      origin: origin || null,
      destination: destination || null,
      date: date || null,
      passengers: passengers || null,
      type: type || 'booking',
      created_at: new Date().toISOString()
    };

    if (GITHUB_TOKEN) {
      try {
        const [owner, repo] = GITHUB_REPO.split('/');
        const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(ENQUIRIES_PATH)}?ref=${BRANCH}`;
        const getRes = await fetch(getUrl, { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } });

        let entries = [];
        let sha = null;

        if (getRes.status === 200) {
          const data = await getRes.json();
          sha = data.sha;
          const content = Buffer.from(data.content, 'base64').toString('utf8');
          try { entries = JSON.parse(content); if (!Array.isArray(entries)) entries = []; } catch(e) { entries = []; }
        } else if (getRes.status === 404) {
          entries = [];
        } else {
          console.error('GitHub get file failed', getRes.status);
        }

        entries.push(newEntry);
        const updatedContent = Buffer.from(JSON.stringify(entries, null, 2)).toString('base64');

        const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(ENQUIRIES_PATH)}`;
        const bodyPayload = {
          message: `Add enquiry ${newEntry.id}`,
          content: updatedContent,
          branch: BRANCH
        };
        if (sha) bodyPayload.sha = sha;

        const putRes = await fetch(putUrl, {
          method: 'PUT',
          headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' },
          body: JSON.stringify(bodyPayload)
        });

        if (!putRes.ok) {
          console.error('Failed to write enquiries file', await putRes.text());
        }
      } catch (err) {
        console.error('Error persisting to GitHub', err);
      }
    } else {
      console.warn('GITHUB_TOKEN not set; enquiry will not be saved in repo. Only email attempted.');
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Server error' };
  }
};
