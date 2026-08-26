Trinity Express site assets and Netlify functions.

Instructions:
- Update AGENT_PHONE in site/assets/main.js to the booking agent's phone (no plus sign, include country code, e.g. 254712345678).
- In Netlify dashboard set environment variables:
  - SENDGRID_API_KEY (for sending email alerts)
  - AGENT_EMAIL (email address of booking agent)
  - SENDGRID_FROM (from email for SendGrid)

Deployment:
- Publish the repository to Netlify or Vercel. The Netlify function will be available at /.netlify/functions/enquiry

This README is a short helper for the created multi-page site and serverless function.
