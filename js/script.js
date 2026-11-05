document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const filterButtons = document.querySelectorAll("[data-filter]");
  const projectCards = document.querySelectorAll("[data-category]");
  filterButtons.forEach(button => button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    projectCards.forEach(card => {
      card.classList.toggle("hidden", filter !== "all" && card.dataset.category !== filter);
    });
  }));

  const form = document.querySelector("#contactForm");
  if (form) form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = encodeURIComponent(data.get("subject"));
    const body = encodeURIComponent(
      `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`
    );
    window.location.href = `mailto:stanleymunyao42@gmail.com?subject=${subject}&body=${body}`;
    const status = document.querySelector("#formStatus");
    if (status) status.textContent = "Your email application should open with the enquiry prepared. The website does not store form submissions.";
  });
});
