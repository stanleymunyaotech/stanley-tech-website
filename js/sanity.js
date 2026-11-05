(() => {
  const cfg = window.SANITY_CONFIG || {};
  const configured = cfg.projectId && cfg.projectId !== "YOUR_SANITY_PROJECT_ID";
  const endpoint = configured
    ? `https://${cfg.projectId}.api.sanity.io/v${cfg.apiVersion}/data/query/${cfg.dataset}`
    : null;

  async function querySanity(query, params = {}) {
    if (!endpoint) throw new Error("Sanity is not configured yet.");
    const url = new URL(endpoint);
    url.searchParams.set("query", query);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(`$${key}`, String(value));
    });
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`Sanity request failed (${response.status}).`);
    const payload = await response.json();
    return payload.result;
  }

  const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));

  function imageUrl(image, width = 900) {
    const ref = image?.asset?._ref;
    if (!ref) return "";
    const match = ref.match(/^image-(.+)-(\w+)$/);
    return match ? `https://cdn.sanity.io/images/${cfg.projectId}/${cfg.dataset}/${match[1]}-${match[2]}?w=${width}&auto=format` : "";
  }

  function plainText(blocks = []) {
    return blocks.map(block => block.children?.map(child => child.text || "").join("") || "").join(" ");
  }

  function renderBlocks(blocks = []) {
    return blocks.map(block => {
      if (block._type !== "block") return "";
      const text = (block.children || []).map(child => escapeHTML(child.text)).join("");
      if (block.style === "h2") return `<h2>${text}</h2>`;
      if (block.style === "h3") return `<h3>${text}</h3>`;
      if (block.style === "blockquote") return `<blockquote>${text}</blockquote>`;
      if (block.listItem) return `<li>${text}</li>`;
      return `<p>${text}</p>`;
    }).join("");
  }

  function card(post) {
    const cover = imageUrl(post.coverImage, 700);
    const date = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Draft date";
    const excerpt = post.excerpt || plainText(post.body).slice(0, 150);
    return `<article class="article-card">
      <a href="post.html?slug=${encodeURIComponent(post.slug.current)}" aria-label="Read ${escapeHTML(post.title)}">
        <div class="article-cover" ${cover ? `style="background-image:url('${cover}');background-size:cover;background-position:center"` : ""}>${cover ? "" : "INSIGHT"}</div>
      </a>
      <div class="article-body"><div class="article-meta"><span>${escapeHTML(date)}</span><span>${escapeHTML(post.category?.title || "Technology")}</span></div>
      <h3><a href="post.html?slug=${encodeURIComponent(post.slug.current)}">${escapeHTML(post.title)}</a></h3>
      <p>${escapeHTML(excerpt)}</p>
      <a class="text-link" href="post.html?slug=${encodeURIComponent(post.slug.current)}">Read article →</a></div>
    </article>`;
  }

  async function loadBlogList() {
    const target = document.querySelector("#blogList");
    if (!target) return;
    try {
      const posts = await querySanity(
        '*[_type == "post" && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc)[0...30]{title,slug,excerpt,coverImage,publishedAt,category->{title},body}'
      );
      target.innerHTML = posts.length ? posts.map(card).join("") : '<div class="empty-state">No published articles yet. New articles will appear here after they are published in the CMS.</div>';
    } catch (error) {
      target.innerHTML = `<div class="empty-state">${escapeHTML(error.message)} Follow the setup guide to connect the blog.</div>`;
    }
  }

  async function loadFeaturedPosts() {
    const target = document.querySelector("#featuredPosts");
    if (!target) return;
    try {
      const posts = await querySanity(
        '*[_type == "post" && featured == true && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc)[0...3]{title,slug,excerpt,coverImage,publishedAt,category->{title},body}'
      );
      target.innerHTML = posts.length ? posts.map(card).join("") : '<div class="empty-state">Featured articles will appear here once published in the CMS.</div>';
    } catch {
      target.innerHTML = '<div class="empty-state">Connect the CMS to display featured articles.</div>';
    }
  }

  async function loadPost() {
    const target = document.querySelector("#postContent");
    if (!target) return;
    const slug = new URLSearchParams(location.search).get("slug");
    if (!slug) { target.innerHTML = '<div class="empty-state">No article was selected.</div>'; return; }
    try {
      const post = await querySanity(
        '*[_type == "post" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{title,slug,excerpt,coverImage,publishedAt,category->{title},body,seoTitle,seoDescription}',
        {slug}
      );
      if (!post) { target.innerHTML = '<div class="empty-state">This article could not be found or has not been published.</div>'; return; }
      document.title = `${post.seoTitle || post.title} | Stanley Munyao`;
      const cover = imageUrl(post.coverImage, 1200);
      target.innerHTML = `<article class="post-layout">
        <a class="text-link" href="blog.html">← Back to insights</a>
        <p class="eyebrow" style="margin-top:28px">${escapeHTML(post.category?.title || "Technology")}</p>
        <h1 style="font-size:clamp(2.4rem,5vw,4rem);margin:14px 0">${escapeHTML(post.title)}</h1>
        <p>${escapeHTML(post.excerpt || "")}</p>
        <p class="article-meta">${post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ""}</p>
        ${cover ? `<img src="${cover}" alt="" style="width:100%;border-radius:20px;margin:25px 0">` : ""}
        <div class="post-content">${renderBlocks(post.body || [])}</div>
      </article>`;
    } catch (error) {
      target.innerHTML = `<div class="empty-state">${escapeHTML(error.message)} Please check the CMS setup.</div>`;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    loadBlogList();
    loadFeaturedPosts();
    loadPost();
  });
})();
