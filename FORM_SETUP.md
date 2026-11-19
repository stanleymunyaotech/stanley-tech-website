# Contact form setup

The portfolio uses the verified public email, WhatsApp, LinkedIn and GitHub contact details already present in the supplied project. The form does not store submissions until a hosted endpoint is configured.

## Configure email fallback

1. Open `js/config.js`.
2. Set `contactEmail` to your verified public contact email address.
3. In `contact.html`, replace the email placeholder card with a `mailto:` link using that same address.
4. Replace the email placeholder in the footer on each page with the matching link.

When no hosted form endpoint is configured, the form opens the visitor's email application with the enquiry prepared. The visitor must press **Send**. The site does not claim that the message was delivered or stored.

## Enable direct online submission with Formspree

1. Create a form in your own Formspree account.
2. Configure allowed domains and spam protection.
3. Copy its HTTPS endpoint.
4. Set `window.SITE_CONFIG.contactEndpoint` in `js/config.js` to that endpoint.
5. Submit a real test enquiry and confirm receipt.

Do not put private tokens or API secrets in frontend files. The endpoint is public configuration. If it is not configured, a valid email fallback is required.

## Configure WhatsApp

Replace the WhatsApp placeholder card and footer placeholder with a `https://wa.me/` link built from your verified number in international format, digits only (no plus sign, spaces or punctuation). Test the link before publishing.
