# Admin and enquiries storage — REMOVED

The admin UI and automatic saving of enquiries to the repository have been removed in this branch. The website has been simplified to rely on the booking agent's phone/WhatsApp and email only.

Current contact details:
- Phone / WhatsApp: +254 753 753 266
- Email: jameskesteve@gmail.com

Notes for maintainers:
- Netlify functions remain in the repository but are no longer used by the site pages. If you want to fully remove them, delete the `netlify/functions` files.
- If you want to re-enable server-side persistence, reintroduce a protected admin UI and configure a secret GITHUB_TOKEN as described previously.
