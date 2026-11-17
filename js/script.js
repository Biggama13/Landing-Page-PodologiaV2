(() => {
  const root = document.documentElement;
  const WA = 'https://wa.me/5513991212112?text=';
  const msg = s => WA + encodeURIComponent(s
    ? `Olá, Karina! Vim pelo site e gostaria de agendar: ${s}.`
    : 'Olá, Karina! Vim pelo site e gostaria de agendar um horário ou tirar uma dúvida.');

  // Links do WhatsApp (mensagem personalizada por serviço)
  document.querySelectorAll('[data-wa]').forEach(a => {
    a.href = msg(a.dataset.service);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Fallback de imagens: se o arquivo local não existir, usa a URL da internet
  document.querySelectorAll('img[data-fb]').forEach(img => {
    const swap = () => { if (img.src !== img.dataset.fb) img.src = img.dataset.fb; };
    img.addEventListener('error', swap, { once: true });
    if (img.complete && img.naturalWidth === 0) swap();
  });

  // Scroll-linked: barra de progresso + parallax (variáveis --p e --sy)
  const header = document.getElementById('top');
  let ticking = false;
  const update = () => {
    const y = window.scrollY, max = root.scrollHeight - innerHeight;
    root.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    root.style.setProperty('--sy', y);
    header.classList.toggle('on', y > 10);
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update);
  update();

  // Scroll-trigger: revela elementos ao entrar na tela (cascata nos grids)
  document.querySelectorAll('.grid, .pillars, .loc').forEach(g =>
    g.querySelectorAll('.reveal').forEach((el, i) => el.style.setProperty('--d', (i % 3) * 0.1 + 's')));
  const io = new IntersectionObserver((entries, o) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Destaque do dia atual nos horários
  const today = String(new Date().getDay());
  document.querySelectorAll('[data-days]').forEach(li =>
    li.classList.toggle('today', li.dataset.days.split(' ').includes(today)));
})();
