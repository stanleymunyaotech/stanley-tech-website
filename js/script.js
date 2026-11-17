document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    document.addEventListener('click', event => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });

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
      const show = chosen === 'all' || card.dataset.category === chosen;
      card.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    const count = document.querySelector('.filter-count');
    if (count) count.textContent = `Showing ${visible} of ${cards.length}`;
  }));

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
