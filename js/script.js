document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.site-header').forEach(header => header.classList.add('is-ready'));
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        nav.classList.remove('open');
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open'); document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false'); toggle.focus();
      }
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open'); document.body.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const revealTargets = document.querySelectorAll('main > section, .project-case, .project-index, .contact-form, .article-card');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.08 });
    revealTargets.forEach(el => { el.classList.add('editorial-reveal'); revealObserver.observe(el); });
  }

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

  const workButtons = [...document.querySelectorAll('.selected-work-item')];
  const previewImage = document.querySelector('#workPreviewImage');
  const previewDescription = document.querySelector('#workPreviewDescription');
  const previewLink = document.querySelector('#workPreviewLink');
  workButtons.forEach(button => {
    const selectWork = () => {
      workButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      if (previewImage) { previewImage.src = button.dataset.workImage; previewImage.alt = button.dataset.workAlt || ''; }
      if (previewDescription) previewDescription.textContent = button.dataset.workDescription || '';
      if (previewLink) {
        const projectId = ({'JAPRES Academy':'japres','Sales Data Analysis':'sales','Aldermere Analytics':'aldermere','ShopPro Cloud':'shop'})[button.dataset.workTitle];
        previewLink.href = ({japres:'japres-academy.html',sales:'sales-data-analysis.html',aldermere:'aldermere-analytics.html',shop:'shoppro-cloud.html'})[projectId] || 'japres-academy.html';
      }
    };
    button.addEventListener('mouseenter', selectWork);
    button.addEventListener('focus', selectWork);
    button.addEventListener('click', selectWork);
  });

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  filterButtons.forEach(button => button.addEventListener('click', () => {
      const chosen = button.dataset.filter;
    filterButtons.forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let visible = 0;
    cards.forEach(card => {
      const caseCategory = card.dataset.category || '';
      const filterCategory = ({japres:'web',sales:'data',aldermere:'web',shop:'software','portfolio-site':'web'})[caseCategory] || caseCategory;
      const show = chosen === 'all' || filterCategory === chosen;
      card.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    const count = document.querySelector('.filter-count');
    if (count) count.textContent = `Showing ${visible} of ${cards.length}`;
  }));
  document.querySelectorAll('.project-case[data-case-url] .project-intro-body h2').forEach(title => {
    const project = title.closest('.project-case');
    const anchor = document.createElement('a');
    anchor.href = project.dataset.caseUrl;
    anchor.className = 'text-link';
    anchor.textContent = `Open dedicated case study ↗`;
    title.insertAdjacentElement('afterend', anchor);
  });

  const journal = document.querySelector('#blogList');
  if (journal) {
    const params = new URLSearchParams(window.location.search);
    const search = document.querySelector('#journalSearch');
    const filters = document.querySelector('#journalCategories');
    const results = document.querySelector('#journalResultCount');
    let activeCategory = params.get('category') || 'all';
    let query = params.get('q') || '';
    if (search) search.value = query;
    const applyJournalFilters = () => {
      const articles = [...journal.querySelectorAll('.article-card')];
      const emptyState = journal.querySelector('.empty-state');
      let visible = 0;
      if (emptyState) emptyState.hidden = articles.length > 0;
      articles.forEach(article => {
        const category = (article.dataset.category || 'technology').toLowerCase();
        const haystack = `${article.textContent} ${article.dataset.search || ''}`.toLowerCase();
        const show = (activeCategory === 'all' || category === activeCategory.toLowerCase()) && (!query || haystack.includes(query.toLowerCase()));
        article.hidden = !show; if (show) visible++;
      });
      if (emptyState) {
        emptyState.hidden = articles.length > 0 && visible > 0;
        if (articles.length && visible === 0) emptyState.innerHTML = '<h2>No articles match these filters.</h2><p>Try a different topic or search phrase.</p>';
      }
      if (results) results.textContent = `${visible} ${visible === 1 ? 'article' : 'articles'}`;
      const url = new URL(window.location.href);
      if (activeCategory === 'all') url.searchParams.delete('category'); else url.searchParams.set('category', activeCategory);
      if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
      window.history.replaceState({}, '', url);
    };
    filters?.querySelectorAll('[data-journal-category]').forEach(button => {
      const category = button.dataset.journalCategory;
      button.addEventListener('click', () => {
        activeCategory = category; query = '';
        if (search) search.value = '';
        filters.querySelectorAll('[data-journal-category]').forEach(item => {
          const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active));
        });
        applyJournalFilters();
      });
      if (category === activeCategory) { button.classList.add('active'); button.setAttribute('aria-pressed', 'true'); }
    });
    window.addEventListener('journal-category-change', event => {
      activeCategory = event.detail.slug; query = ''; if (search) search.value = '';
      filters?.querySelectorAll('[data-journal-category]').forEach(item => { const active = item.dataset.journalCategory === activeCategory; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
      applyJournalFilters();
    });
    search?.addEventListener('input', () => {
      query = search.value.trim();
      if (query) {
        activeCategory = 'all';
        filters?.querySelectorAll('[data-journal-category]').forEach(item => {
          const active = item.dataset.journalCategory === 'all'; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active));
        });
      }
      applyJournalFilters();
    });
    const journalObserver = new MutationObserver(() => applyJournalFilters());
    journalObserver.observe(journal, { childList: true, subtree: true });
    applyJournalFilters();
  }

  const form = document.querySelector('#contactForm');
  if (form) {
    const params = new URLSearchParams(window.location.search);
    const serviceSelect = form.querySelector('[name="service"]');
    const requestedService = params.get('service');
    if (serviceSelect && requestedService) {
      const match = [...serviceSelect.options].find(option => option.text.toLowerCase() === requestedService.toLowerCase());
      if (match) serviceSelect.value = match.value;
    }
    const subjectInput = form.querySelector('[name="subject"]');
    if (subjectInput && params.get('subject')) subjectInput.value = params.get('subject').slice(0, 150);

    form.addEventListener('submit', async event => {
      event.preventDefault();
      const status = document.querySelector('#formStatus');
      const button = form.querySelector('.form-submit');
      const label = button?.querySelector('.submit-label');
      const loading = button?.querySelector('.submit-loading');
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const config = window.SITE_CONFIG || {};
      const endpoint = typeof config.contactEndpoint === 'string' ? config.contactEndpoint.trim() : '';
      const email = typeof config.contactEmail === 'string' ? config.contactEmail.trim() : '';
      const values = Object.fromEntries(data.entries());
      if (status) { status.className = 'form-status'; status.textContent = ''; }
      if (button) button.disabled = true;
      if (label) label.hidden = true;
      if (loading) loading.hidden = false;

      if (endpoint && /^https:\/\//i.test(endpoint) && !endpoint.includes('YOUR_')) {
        try {
          const response = await fetch(endpoint, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } });
          if (!response.ok) throw new Error('The form provider returned an error.');
          if (status) { status.className = 'form-status success'; status.textContent = 'Your enquiry has been submitted successfully. Thank you. I will review it and respond using the email address you provided.'; }
          form.reset();
        } catch (error) {
          if (status) { status.className = 'form-status error'; status.textContent = 'The online submission did not complete. Please use the email or WhatsApp links to contact me instead.'; }
        }
      } else if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const subject = encodeURIComponent(values.subject || 'Website enquiry');
        const body = encodeURIComponent([
          `Name: ${values.name || ''}`,
          `Email: ${values.email || ''}`,
          `Service: ${values.service || ''}`,
          `Estimated budget: ${values.budget || 'Not provided'}`,
          '', 'Project description:', values.message || ''
        ].join('\n'));
        const mailto = `mailto:${email}?subject=${subject}&body=${body}`;
        if (status) { status.className = 'form-status'; status.textContent = 'Your email application should open with the enquiry prepared. Check the details and press Send in your email app. This website has not sent or stored the message.'; }
        window.location.href = mailto;
      } else {
        if (status) { status.className = 'form-status error'; status.textContent = 'The contact form is not connected yet. Add a verified email address or configure a Formspree endpoint in js/config.js before accepting enquiries.'; }
      }
      if (button) button.disabled = false;
      if (label) label.hidden = false;
      if (loading) loading.hidden = true;
    });
  }
});
