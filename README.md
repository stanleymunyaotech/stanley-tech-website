# Stanley Munyao Tech — Portfolio & Blog

A responsive, multi-page personal portfolio for GitHub Pages, with a separate Sanity Studio for managing blog content.

## Public website

- `index.html` — home
- `about.html` — about
- `portfolio.html` — projects and filters
- `skills.html` — skills
- `blog.html` — CMS-powered article listing
- `post.html` — CMS-powered article page
- `services.html` — services
- `contact.html` — contact
- `css/style.css` — design system and responsive styling
- `js/script.js` — navigation, project filters and contact form behaviour
- `js/config.js` — public Sanity project configuration
- `js/sanity.js` — public read-only Sanity integration

## Run locally

Open the folder in VS Code and use a local static server (for example, the Live Server extension). Opening HTML files directly may work for static pages, but use a local server to test CMS fetches.

## CMS

Read `SANITY_SETUP.md` before connecting Sanity. The private Studio lives in `sanity-studio/`.

## Deployment

The public website is designed for GitHub Pages. Upload the contents of this project to the repository's publishing branch/root, preserving folder structure. Then configure the Sanity project ID in `js/config.js`.

Before replacing your live website, keep a backup of the current repository or create a new Git branch and test this version first.


## Personal image and featured work

- `assets/images/stanley-munyao-portrait.png` is the supplied portrait used in the About page. Keep this file path intact unless you update the image reference in `about.html`.
- Aldermere Analytics is featured on the homepage and portfolio page and links to https://aldermere-analytics.netlify.app. Its preview is a locally authored visual mock-up, not a captured screenshot of the live site.

## Final configuration notes

The Sanity CMS still requires a project ID and dataset configuration before blog publishing works. The contact form's existing behaviour must be checked and connected to a real form endpoint before it is used for live submissions. Do not treat a front-end-only confirmation as a delivered message.
