// Marcar retos como hechos (se guarda solo en este navegador)
(function () {
  var KEY = 'robotica-kidsiot-hechos';
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } }
  function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} }
  var done = load();
  function slugOf(href) { var m = (href || '').match(/([^\/]+)\.html$/); return m ? m[1] : null; }
  function paint() {
    document.querySelectorAll('.side li a, .card').forEach(function (a) {
      var s = slugOf(a.getAttribute('href')); a.classList.toggle('done', !!(s && done[s]));
    });
  }
  var here = slugOf(location.pathname);
  var isReto = document.querySelector('.ficha') && document.querySelector('.pn');
  if (isReto && here) {
    var b = document.createElement('button'); b.className = 'done-btn';
    function label() { b.textContent = done[here] ? '✓ Reto hecho' : 'Marcar como hecho'; b.classList.toggle('on', !!done[here]); }
    b.onclick = function () { if (done[here]) delete done[here]; else done[here] = 1; save(done); label(); paint(); };
    label(); var pn = document.querySelector('.pn'); pn.parentNode.insertBefore(b, pn);
  }
  document.querySelectorAll('details.jugar').forEach(function (d) {
    d.addEventListener('toggle', function () {
      var f = d.querySelector('iframe');
      if (d.open && f && !f.getAttribute('src')) f.setAttribute('src', f.getAttribute('data-src'));
    });
  });
  paint();
  var on = document.querySelector('.side a.on'), side = document.querySelector('.side'); if (on && side) side.scrollTop = on.offsetTop - side.offsetTop - 120;
})();

// Carrusel de montaje: flechas y número activo
document.querySelectorAll('.carr').forEach(function (c) {
  var t = c.querySelector('.carr-t'), nums = c.parentNode.querySelectorAll('.carr-n a');
  function idx() { return Math.round(t.scrollLeft / t.clientWidth); }
  function go(i) { t.scrollTo({ left: i * t.clientWidth, behavior: 'smooth' }); }
  c.querySelector('.prev').onclick = function () { go(Math.max(0, idx() - 1)); };
  c.querySelector('.next').onclick = function () { go(Math.min(t.children.length - 1, idx() + 1)); };
  nums.forEach(function (a, i) { a.onclick = function (e) { e.preventDefault(); go(i); }; });
  function mark() { var i = idx(); nums.forEach(function (a, j) { a.classList.toggle('on', i === j); }); }
  t.addEventListener('scroll', function () { clearTimeout(t._m); t._m = setTimeout(mark, 80); }); mark();
});

// Pestañas de los retos: el reto / autoevaluación y rúbrica
document.querySelectorAll('.tabs').forEach(function (tb) {
  var bs = tb.querySelectorAll('.tab'), ps = tb.querySelectorAll(':scope > .tab-p');
  function show(i, scroll) {
    bs.forEach(function (b, j) { b.classList.toggle('on', i === j); b.setAttribute('aria-selected', i === j); });
    ps.forEach(function (p, j) { p.classList.toggle('on', i === j); p.hidden = i !== j; });
    if (scroll) tb.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  bs.forEach(function (b, i) { b.onclick = function () { show(i, false); }; });
  tb.querySelectorAll('.tab-go').forEach(function (g) { g.onclick = function () { show(+g.dataset.t, true); }; });
  if (location.hash === '#evaluacion') show(1, false);
});
