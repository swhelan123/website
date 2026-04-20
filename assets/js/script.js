(() => {
  'use strict';

  // ——— Nav scrolled border ———
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ——— Mobile menu ———
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? 'Close' : 'Menu';
    });
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = 'Menu';
      })
    );
  }

  // ——— Scroll reveal ———
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ——— Active nav link on scroll ———
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sectionEls = [...navAnchors]
    .map(a => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-15% 0px -75% 0px' });

  sectionEls.forEach(s => navObserver.observe(s));

  // ——— GitHub stats (public API, no token required) ———
  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  const hideStatItem = (id) => {
    const el = document.getElementById(id);
    if (el) el.closest('.stat-item')?.remove();
  };
  const year = new Date().getFullYear();

  // Public repo count
  fetch('https://api.github.com/users/swhelan123')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(d => setEl('stat-repos', d.public_repos))
    .catch(() => hideStatItem('stat-repos'));

  // Total PRs authored
  fetch('https://api.github.com/search/issues?q=author:swhelan123+type:pr&per_page=1')
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(d => setEl('stat-prs', d.total_count + '+'))
    .catch(() => hideStatItem('stat-prs'));

  // Contributions this year (via public contributions API)
  fetch(`https://github-contributions-api.jogruber.de/v4/swhelan123?y=${year}`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(d => {
      const count = d.total[year] ?? d.total[year - 1];
      if (count != null) setEl('stat-contributions', count);
      else hideStatItem('stat-contributions');
    })
    .catch(() => hideStatItem('stat-contributions'));

  // PR reviews this year
  fetch(`https://api.github.com/search/issues?q=type:pr+reviewed-by:swhelan123+updated:>=${year}-01-01&per_page=1`)
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(d => setEl('stat-reviews', d.total_count + '+'))
    .catch(() => hideStatItem('stat-reviews'));

})();
