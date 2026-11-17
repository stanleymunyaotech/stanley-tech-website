# Stanley Munyao Tech — Complete Portfolio Kit

A responsive, multi-page portfolio and editorial website for Stanley Munyao. This final version preserves the supplied project structure, original portrait, project assets, public links and Sanity Studio foundation.

## Website pages

- `index.html` — positioning, service overview, selected work and journal introduction
- `about.html` — background and approach
- `portfolio.html` — five project presentations and case studies
- `services.html` — data analytics, web development, software systems, workflow automation and project process
- `skills.html` — accurate skills profile without artificial proficiency bars
- `blog.html` — published article listing powered by Sanity
- `post.html` — dynamic article page for published Sanity posts
- `contact.html` — contact placeholders, verified profile links and enquiry form
- `404.html` — custom not-found page

## Design and brand

The final approved design is **Creative Technology (Option C)**: midnight navy surfaces, electric-blue and violet gradients, cyan highlights, luminous project cards and subtle technology-inspired details. The positioning is **“Technology built around real-world problems.”** The custom favicon is in `assets/favicon/` and is referenced across all HTML pages. The original portrait is preserved at `assets/images/stanley-munyao-portrait.png`; the site uses an optimised WebP copy for faster loading.

## Images and screenshots

Real project screenshots (JAPRES, Aldermere, Aurevia, ShopPro and others) and the Python, SQL, Power BI and Excel concept mockups are in `assets/images/projects/` as optimised WebP files. Concept mockups carry a visible "Concept mockup · sample data" label and are described as practice work, not client results. In the JAPRES student portal screenshot the name, admission number, phone and email are covered. Two placeholders remain in `portfolio.html` (raw and cleaned sales data, and the portfolio/blog case study) until you capture real screenshots.

## Skills and education

`skills.html` lists the skills in three groups (Data analytics, Programming and software, Web development) plus tools, and the Bachelor of Economics and Statistics at the University of Nairobi. A short version appears on `index.html` and `about.html`.

## Project-claim accuracy

- JAPRES Academy is presented as a client project using the confirmed HTML, CSS, JavaScript and Supabase stack.
- Sales analysis is presented as an 800-order Excel project. Python, SQL and Power BI are not claimed as completed tools in this case study.
- Aldermere Analytics is identified as your own brand/website project, not an external client.
- ShopPro Cloud is an independent product project with a live preview and active development; individual workflows are described conservatively and are not presented as fully verified.
- This portfolio is identified as your own supporting web project.

## Preview locally

Use a local static server rather than opening pages as `file://`, especially for the Sanity-powered blog. From the project root run:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500/`. The static pages work without a build step.

## Contact form setup

Your email (`stanleymunyao42@gmail.com`) and WhatsApp (+254 759 916 552) are now on the contact page and in the footer. The enquiry form opens the visitor's email app addressed to you. For direct online submissions, set a Formspree HTTPS endpoint in `window.SITE_CONFIG.contactEndpoint`.

The form prepares an email only after you add a valid email address to `window.SITE_CONFIG.contactEmail`. For direct online submissions, configure a Formspree HTTPS endpoint in `window.SITE_CONFIG.contactEndpoint`. Until either is configured, the form clearly reports that setup is incomplete and does not claim to have sent anything. Read `FORM_SETUP.md`. Never place private tokens or credentials in frontend files.

## Sanity CMS

The separate `sanity-studio/` folder contains the editorial dashboard and schemas. Read `SANITY_SETUP.md` before connecting it. It supports drafts, publishing/unpublishing through Sanity's document workflow, cover images, categories, featured posts, SEO fields and an editor-only draft preview panel. The public site queries published posts only.

The public Sanity project ID and dataset are configured in `js/config.js`. Do not place write tokens or secrets in this file.

## Deployment

The website is structured for the existing GitHub Pages repository: `stanleymunyaotech/stanley-tech-website`. Upload the contents of this folder to the repository root, keeping the directory structure. The canonical URLs and sitemap retain the current GitHub Pages base URL.

Before replacing the live site, keep a backup or deploy this version on a branch/preview first. Test the contact form, all project links, CMS connection and mobile navigation after deployment.
