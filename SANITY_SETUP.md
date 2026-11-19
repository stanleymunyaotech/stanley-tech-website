# Sanity CMS setup — Stanley Munyao Tech

The public website is a static GitHub Pages site. The separate `sanity-studio/` directory is the editorial dashboard. Public pages retrieve only published articles; drafts remain private inside your Sanity account.

## 1. Create a Sanity project

1. Create/sign in to your Sanity account at https://www.sanity.io/.
2. Create a project named **Stanley Munyao Tech**.
3. Create or select the `production` dataset.
4. Copy the project ID from the project settings.

## 2. Connect the public website

Edit `js/config.js` and replace `YOUR_SANITY_PROJECT_ID` with your project ID. Keep `production` as the dataset unless you intentionally use another one. The project ID and dataset are public identifiers. **Never put a write token or secret in this public file.** The website uses the read-only Content Lake query API. Ensure the dataset's public read access matches your intended publishing model.

## 3. Run the editorial dashboard

Open a terminal in `sanity-studio/` and install dependencies:

```bash
npm install
```

Set the project ID and run the Studio.

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

Sign in with your Sanity account at the local Studio URL printed in the terminal.

## 4. Editorial workflow

- Create or edit a Blog post document.
- Add a title, URL slug, introduction, category and article body.
- Add a featured image and required alternative text when using one.
- Add SEO title and description in the SEO field group.
- Use the **Article preview** panel to inspect the current draft's title, excerpt and opening text inside Studio.
- Save a draft while it is being prepared. Use Sanity's **Publish** action only when it is reviewed and ready. Use the document's unpublish action to remove a published article from the public blog.
- Set a publication date and optionally feature the post on the homepage.

The editor preview panel is private to the Studio and does not expose a draft token or unreviewed content on the public site. The public website displays published posts only.

## 5. Deploy the Studio

After testing locally:

```bash
npm run build
npm run deploy
```

Follow the Sanity CLI prompts. Keep Studio access restricted to authorised accounts.

## 6. Starter article drafts

Three substantial draft articles are included in `content/article-drafts/`. They are not imported, published or indexed automatically. Review them, create the appropriate categories in Studio and paste the article content into new Blog post documents when ready.

## Notes

- The public site gracefully displays a neutral message when Sanity is not configured or temporarily unavailable. It does not show raw API errors to visitors.
- Sanity feature availability and pricing are determined by Sanity and may change. Review current Sanity documentation for account-specific options.
