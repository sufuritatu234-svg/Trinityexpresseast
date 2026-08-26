# Admin and enquiries storage

This repository now supports a lightweight admin listing for booking enquiries. Implementation details:

- Enquiries are saved to a JSON file inside the repo at: data/enquiries.json
- The enquiry submission function (netlify/functions/enquiry.js) will attempt to: 1) send an email via SendGrid (if configured), and 2) append the enquiry to the enquiries JSON file by committing to the repository using the GitHub REST API.

Required environment variables for persistence and admin functions:
- GITHUB_TOKEN: a personal access token with `repo` scope (to read/write the enquiries file). Set this in Netlify (or your hosting provider) to allow the serverless function to create/update `data/enquiries.json`.
- GITHUB_REPO (optional): defaults to `sufuritatu234-svg/Trinityexpresseast`.
- BRANCH (optional): defaults to `main`.
- ENQUIRIES_PATH (optional): defaults to `data/enquiries.json`.

Security notes:
- The admin page (site/admin.html) is not protected by authentication. Do not expose it publicly without access controls. Netlify offers "Password protect" and "Members" features; use them or host the admin behind basic auth.
- The GITHUB_TOKEN must be kept secret. Do NOT commit it to the repository.

How it works:
- When a user submits the booking/charter enquiry form, the enquiry function sends an email (if SendGrid is configured) and appends the enquiry to the JSON file in the repo.
- The admin page loads /.netlify/functions/enquiries-list, which reads the JSON file from the repo and returns it as JSON to the admin UI.

To test locally:
- Use Netlify CLI: `netlify dev` and set env vars locally (NETLIFY_ENV or via .env). The function will commit to the repository only if GITHUB_TOKEN is provided.

