# Sanity CMS setup — Stanley Munyao Tech

The public portfolio is a static website. The separate `sanity-studio/` folder contains the private editorial dashboard. Only published posts are queried by the public blog.

## 1. Create the Sanity project

1. Create/sign in to a Sanity account at https://www.sanity.io/
2. Create a project named **Stanley Munyao Tech**.
3. Create a dataset named `production`.
4. Copy the project ID from the Sanity project settings.

## 2. Configure the public website

Open `js/config.js` and replace `YOUR_SANITY_PROJECT_ID` with your actual project ID. Keep the dataset as `production` unless you intentionally create a different dataset.

The project ID and dataset are public identifiers. **Do not put a Sanity write token or other private secret in this file.** The public website only reads published content through Sanity's public Content Lake API.

## 3. Run the Studio dashboard locally

Open a terminal in `sanity-studio/`:

```bash
npm install
```

Set the project ID in your local environment, then run:

PowerShell:
```powershell
$env:SANITY_STUDIO_PROJECT_ID="YOUR_REAL_PROJECT_ID"
$env:SANITY_STUDIO_DATASET="production"
npm run dev
```

macOS/Linux:
```bash
SANITY_STUDIO_PROJECT_ID="YOUR_REAL_PROJECT_ID" SANITY_STUDIO_DATASET="production" npm run dev
```

Open the local URL shown in the terminal and sign in with your Sanity account. The Studio is the admin dashboard: create categories, draft articles, add images and publish.

## 4. Deploy the Studio

After testing locally:

```bash
npm run build
npm run deploy
```

Follow Sanity's deployment prompts. Keep Studio access restricted to your own authorised Sanity account. Do not share credentials or tokens in public repositories.

## 5. Publish your first article

1. Create a category (for example, Data Analytics).
2. Create a Blog post.
3. Add a title, slug, excerpt, article content and optional cover image.
4. Set a publication date.
5. Publish the document.

The public `blog.html` page will list published articles. Unpublished drafts are excluded by the public query.

## Important limitations to know

- The contact form currently prepares an email in the visitor's email application. It does not store submissions or send them to a server.
- This is a static GitHub Pages-compatible frontend. The Sanity Studio is a separate app and is not deployed inside the public website.
- Sanity plan limits and account settings are controlled by Sanity and may change. Review its current pricing before relying on paid features.
- The starter article renderer supports common text blocks and headings. If you later use complex portable-text features such as inline annotations, embedded video or custom callouts, extend `js/sanity.js` to render those block types.
