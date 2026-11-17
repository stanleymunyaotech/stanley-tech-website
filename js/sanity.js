(() => {
  const cfg = window.SANITY_CONFIG || {};
  const configured = Boolean(cfg.projectId && cfg.projectId !== 'YOUR_SANITY_PROJECT_ID' && cfg.dataset);
  const endpoint = configured
    ? `https://${cfg.projectId}.api.sanity.io/v${cfg.apiVersion}/data/query/${cfg.dataset}`
    : null;

  async function querySanity(query, params = {}) {
    if (!endpoint) return null;
    const url = new URL(endpoint);
    url.searchParams.set('query', query);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(`$${key}`, String(value));
      }
    });
    const response = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Content service unavailable');
    const payload = await response.json();
    return payload.result;
  }

  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  function imageUrl(image, width = 900) {
    const ref = image?.asset?._ref;
    if (!ref || !cfg.projectId || !cfg.dataset) return '';
    const match = ref.match(/^image-(.+)-(\w+)$/);
    return match
      ? `https://cdn.sanity.io/images/${cfg.projectId}/${cfg.dataset}/${match[1]}-${match[2]}?w=${width}&auto=format`
      : '';
  }

  function textFromBlocks(blocks = []) {
    return blocks.map(block => block.children?.map(child => child.text || '').join('') || '').join(' ');
  }

  function renderBlocks(blocks = []) {
    const output = [];
    let listType = null;
    const closeList = () => {
      if (listType) {
        output.push(listType === 'number' ? '</ol>' : '</ul>');
        listType = null;
      }
    };

    blocks.forEach(block => {
      if (block._type === 'image') {
        closeList();
        const src = imageUrl(block, 1200);
        if (src) {
          output.push(`<figure class="post-figure"><img src="${escapeHTML(src)}" alt="${escapeHTML(block.alt || '')}" loading="lazy"></figure>`);
        }
        return;
      }
      if (block._type !== 'block') return;

      const markDefs = new Map((block.markDefs || []).map(mark => [mark._key, mark]));
      const text = (block.children || []).map(child => {
        let value = escapeHTML(child.text || '');
        (child.marks || []).forEach(mark => {
          if (mark === 'strong') value = `<strong>${value}</strong>`;
          else if (mark === 'em') value = `<em>${value}</em>`;
          else if (mark === 'code') value = `<code>${value}</code>`;
          else {
            const def = markDefs.get(mark);
            const href = def?.href || '';
            if (def?._type === 'link' && /^https:\/\//i.test(href)) {
              value = `<a href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${value}</a>`;
            }
          }
        });
        return value;
      }).join('');

      if (block.listItem) {
        const next = block.listItem;
        if (listType !== next) {
          closeList();
          listType = next;
          output.push(next === 'number' ? '<ol>' : '<ul>');
        }
        output.push(`<li>${text}</li>`);
        return;
      }

      closeList();
      if (block.style === 'h2') output.push(`<h2>${text}</h2>`);
      else if (block.style === 'h3') output.push(`<h3>${text}</h3>`);
      else if (block.style === 'blockquote') output.push(`<blockquote>${text}</blockquote>`);
      else output.push(`<p>${text}</p>`);
    });
    closeList();
    return output.join('');
  }

  function card(post) {
    const slug = post.slug?.current;
    if (!slug) return '';
    const cover = imageUrl(post.coverImage, 700);
    const date = post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      : '';
    const excerpt = post.excerpt || textFromBlocks(post.body || []).slice(0, 160);
    const readingTime = post.readingTime ? `${post.readingTime} min read` : '';
    const href = `post.html?slug=${encodeURIComponent(slug)}`;
    return `<article class="article-card">
      <a href="${href}" aria-label="Read ${escapeHTML(post.title)}">
        <div class="article-cover" ${cover ? `style="background-image:url('${escapeHTML(cover)}');background-size:cover;background-position:center"` : ''}>${cover ? '' : 'INSIGHT'}</div>
      </a>
      <div class="article-body">
        <div class="article-meta"><span>${escapeHTML(date)}</span>${readingTime ? `<span>${escapeHTML(readingTime)}</span>` : ''}<span>${escapeHTML(post.category?.title || 'Technology')}</span></div>
        <h3><a href="${href}">${escapeHTML(post.title)}</a></h3>
        <p>${escapeHTML(excerpt)}</p>
        <a class="text-link" href="${href}">Read article <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
  }

  async function loadList(selector, query) {
    const target = document.querySelector(selector);
    if (!target) return;
    if (!configured) {
      target.innerHTML = '<div class="empty-state">The editorial dashboard has not been connected yet. Follow the Sanity setup guide to publish articles here.</div>';
      return;
    }
    try {
      const posts = await querySanity(query);
      target.innerHTML = posts?.length
        ? posts.map(card).filter(Boolean).join('')
        : '<div class="empty-state">No featured articles have been published yet. New articles will appear here when they are marked as featured in the editorial dashboard.</div>';
    } catch {
      target.innerHTML = '<div class="empty-state">The journal is temporarily unavailable. Please check back later.</div>';
    }
  }

  function updateMeta(selector, attribute, content) {
    let element = document.querySelector(selector);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, selector.includes('property=') ? selector.match(/property="([^"]+)"/)[1] : selector.match(/name="([^"]+)"/)[1]);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }

  async function loadPost() {
    const target = document.querySelector('#postContent');
    if (!target) return;
    const slug = new URLSearchParams(window.location.search).get('slug');
    if (!slug) {
      target.innerHTML = '<div class="empty-state"><h1>No article selected</h1><p>Choose a published article from the journal.</p><a href="blog.html" class="text-link">Back to the blog <span aria-hidden="true">↗</span></a></div>';
      return;
    }
    if (!configured) {
      target.innerHTML = '<div class="empty-state"><h1>The journal is being connected.</h1><p>Published articles will be available after the Sanity dashboard is configured.</p><a href="blog.html" class="text-link">Back to the blog <span aria-hidden="true">↗</span></a></div>';
      return;
    }

    try {
      const post = await querySanity(
        '*[_type == "post" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{title,slug,excerpt,coverImage,publishedAt,readingTime,category->{_id,title},body,seoTitle,seoDescription}',
        { slug }
      );
      if (!post) {
        target.innerHTML = '<div class="empty-state"><h1>Article not found</h1><p>This article may have been moved or is not published.</p><a href="blog.html" class="text-link">Back to the blog <span aria-hidden="true">↗</span></a></div>';
        return;
      }

      const title = post.seoTitle || post.title;
      const description = post.seoDescription || post.excerpt || textFromBlocks(post.body || []).slice(0, 160);
      const cover = imageUrl(post.coverImage, 1200);
      const currentUrl = window.location.href;
      const date = post.publishedAt
        ? new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        : '';
      const wordCount = textFromBlocks(post.body || []).trim().split(/\s+/).filter(Boolean).length;
      const readingTime = post.readingTime || Math.max(1, Math.ceil(wordCount / 220));
      const category = post.category?.title || 'Technology';
      const relatedQuery = '*[_type == "post" && slug.current != $slug && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc)[0...3]{title,slug,excerpt,coverImage,publishedAt,readingTime,category->{title}}';
      const related = await querySanity(relatedQuery, { slug }).catch(() => []);

      document.title = `${title} | Stanley Munyao Tech`;
      updateMeta('meta[name="description"]', 'name', description);
      updateMeta('meta[property="og:title"]', 'property', title);
      updateMeta('meta[property="og:description"]', 'property', description);
      updateMeta('meta[property="og:url"]', 'property', currentUrl);
      updateMeta('meta[property="og:type"]', 'property', 'article');
      updateMeta('meta[name="twitter:title"]', 'name', title);
      updateMeta('meta[name="twitter:description"]', 'name', description);
      if (cover) {
        updateMeta('meta[property="og:image"]', 'property', cover);
        updateMeta('meta[name="twitter:image"]', 'name', cover);
      }
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.href = currentUrl;

      const relatedHTML = related?.length
        ? `<section class="related-articles"><div class="section-heading"><div><span class="eyebrow">KEEP EXPLORING</span><h2>More from the journal.</h2></div></div><div class="article-grid">${related.map(card).filter(Boolean).join('')}</div></section>`
        : '';
      const coverHTML = cover
        ? `<figure class="post-cover"><img src="${escapeHTML(cover)}" alt="${escapeHTML(post.coverImage?.alt || post.title)}" fetchpriority="high"></figure>`
        : '';
      const shareUrl = encodeURIComponent(currentUrl);
      const shareTitle = encodeURIComponent(title);

      target.innerHTML = `<article class="post-layout">
        <a href="blog.html" class="text-link">← Back to the blog</a>
        <header class="post-header">
          <p class="eyebrow">${escapeHTML(category)}</p>
          <h1>${escapeHTML(post.title)}</h1>
          ${post.excerpt ? `<p class="post-deck">${escapeHTML(post.excerpt)}</p>` : ''}
          <div class="article-meta"><span>${escapeHTML(date)}</span><span>${readingTime} min read</span></div>
        </header>
        ${coverHTML}
        <div class="post-content">${renderBlocks(post.body || [])}</div>
        <div class="post-share"><span>Share this article</span><a href="https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a><a href="https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}" target="_blank" rel="noopener noreferrer">X <span aria-hidden="true">↗</span></a><button type="button" class="share-copy" id="copyArticleLink">Copy link</button><span id="copyArticleStatus" class="copy-status" aria-live="polite"></span></div>
        ${relatedHTML}
      </article>`;

      const copyButton = target.querySelector('#copyArticleLink');
      const copyStatus = target.querySelector('#copyArticleStatus');
      copyButton?.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(currentUrl);
          if (copyStatus) copyStatus.textContent = 'Link copied.';
        } catch {
          if (copyStatus) copyStatus.textContent = 'Copy is unavailable in this browser. Use the address bar link instead.';
        }
      });

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description,
        datePublished: post.publishedAt || undefined,
        author: { '@type': 'Person', name: 'Stanley Munyao' },
        image: cover || undefined,
        mainEntityOfPage: currentUrl
      };
      let jsonLd = document.querySelector('#articleStructuredData');
      if (!jsonLd) {
        jsonLd = document.createElement('script');
        jsonLd.type = 'application/ld+json';
        jsonLd.id = 'articleStructuredData';
        document.head.appendChild(jsonLd);
      }
      jsonLd.textContent = JSON.stringify(structuredData);
    } catch {
      target.innerHTML = '<div class="empty-state"><h1>Article unavailable</h1><p>There was a problem loading this article. Please return to the blog and try again.</p><a href="blog.html" class="text-link">Back to the blog <span aria-hidden="true">↗</span></a></div>';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadList(
      '#blogList',
      '*[_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc)[0...30]{title,slug,excerpt,coverImage,publishedAt,readingTime,category->{title},body}'
    );
    loadList(
      '#featuredPosts',
      '*[_type == "post" && featured == true && defined(slug.current) && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc)[0...3]{title,slug,excerpt,coverImage,publishedAt,readingTime,category->{title},body}'
    );
    loadPost();
  });
})();
