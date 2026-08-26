const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_REPO = process.env.GITHUB_REPO || 'sufuritatu234-svg/Trinityexpresseast';
    const ENQUIRIES_PATH = process.env.ENQUIRIES_PATH || 'data/enquiries.json';
    const BRANCH = process.env.BRANCH || 'main';

    if (!GITHUB_TOKEN) return { statusCode: 500, body: 'GITHUB_TOKEN not configured' };

    const [owner, repo] = GITHUB_REPO.split('/');
    const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(ENQUIRIES_PATH)}?ref=${BRANCH}`;
    const res = await fetch(getUrl, { headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } });

    if (res.status === 200) {
      const data = await res.json();
      const content = Buffer.from(data.content, 'base64').toString('utf8');
      return { statusCode: 200, body: content, headers: { 'Content-Type': 'application/json' } };
    } else if (res.status === 404) {
      return { statusCode: 200, body: '[]', headers: { 'Content-Type': 'application/json' } };
    } else {
      const text = await res.text();
      console.error('GitHub API error', res.status, text);
      return { statusCode: 502, body: 'Error reading enquiries' };
    }
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Server error' };
  }
};
