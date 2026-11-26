(function () {
  'use strict'
  var L = window.FokirLogic, $ = function (s) { return document.querySelector(s) }, $$ = function (s) { return [].slice.call(document.querySelectorAll(s)) }
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function toast(m) { var t = $('#toast'); t.textContent = m; t.className = 'toast show'; setTimeout(function () { t.className = 'toast' }, 2400) }
  $('#theme').onclick = function () { var n = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = n; try { localStorage.setItem('fokir-theme', n) } catch (e) {} }
  $('#burger').onclick = function () { var o = $('header').classList.toggle('open'); this.setAttribute('aria-expanded', o) }
  $$('#nav a').forEach(function (a) { a.onclick = function () { $('header').classList.remove('open') } })
  var secs = $$('main section[id]')
  function spy() { var y = scrollY + 120, c = secs[0].id; secs.forEach(function (s) { if (s.offsetTop <= y) c = s.id }); $$('#nav a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + c) }) }
  addEventListener('scroll', spy, { passive: true }); spy()
  // stat counters
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  function count() { $$('[data-n]').forEach(function (e) { var n = +e.dataset.n; if (reduce) return (e.textContent = n); var t0 = performance.now(); (function f(t) { var k = (t - t0) / 1200; e.textContent = L.countStep(n, k); if (k < 1) requestAnimationFrame(f) })(t0) }) }
  if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { count(); io.disconnect() } }); io.observe($('#stats')) } else count()
  // work
  var cat = 'all', cats = [['all', 'All'], ['product', 'Product'], ['branding', 'Branding']]
  $('#chips').innerHTML = cats.map(function (c) { return '<button class="chip" data-c="' + c[0] + '" aria-pressed="' + (c[0] === 'all') + '">' + c[1] + '</button>' }).join('')
  $('#chips').onclick = function (e) { var b = e.target.closest('.chip'); if (!b) return; cat = b.dataset.c; $$('.chip').forEach(function (x) { x.setAttribute('aria-pressed', x === b) }); paintWork() }
  function paintWork() { $('#work-grid').innerHTML = L.filter(L.PROJECTS, cat).map(function (p) { return '<article class="proj"><img src="' + p.img + '" alt="' + esc(p.title) + '" loading="lazy"><div><span class="tag">' + p.cat + '</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.blurb) + '</p></div></article>' }).join('') }
  // quote
  var plan = 'landing', extras = [], pages = 5
  $('#plans').innerHTML = L.PLANS.map(function (p) { return '<label class="opt"><input type="radio" name="plan" value="' + p.id + '"' + (p.id === plan ? ' checked' : '') + '><span>' + p.name + '<small>from $' + p.base + '</small></span></label>' }).join('')
  $('#extras').innerHTML = L.EXTRAS.map(function (x) { return '<label class="opt"><input type="checkbox" value="' + x.id + '"><span>' + x.name + '<small>' + (x.rush ? '+25% price' : '+$' + x.price) + '</small></span></label>' }).join('')
  function paintQuote() { var q = L.quote(plan, extras, pages); $('#price').textContent = '$' + q.price.toLocaleString('en-US'); $('#days').textContent = 'About ' + q.days + ' working days'; $('#pages-row').hidden = plan !== 'site'; $('#pages-out').textContent = pages }
  $('#plans').onchange = function (e) { plan = e.target.value; paintQuote() }
  $('#extras').onchange = function () { extras = $$('#extras input:checked').map(function (i) { return i.value }); paintQuote() }
  $('#pages').oninput = function () { pages = +this.value; paintQuote() }
  $('#use-quote').onclick = function () { var q = L.quote(plan, extras, pages), name = L.PLANS.filter(function (p) { return p.id === plan })[0].name; var m = $('#f-msg'); if (!m.value.trim()) m.value = 'Hi, I would like a ' + name + (plan === 'site' ? ' (' + pages + ' pages)' : '') + (extras.length ? ' with ' + extras.join(', ') : '') + '. Estimate: $' + q.price + ', about ' + q.days + ' days.'; }
  // faq
  var faq = [['How long does a project take?', 'A landing page takes about a week. A multi-page site takes two to three weeks. Use the calculator for a closer figure.'], ['Do I own the code?', 'Yes. You get the full source and a short guide to edit it.'], ['Can you work with my brand?', 'Yes. If you have colours and a logo, we use them. If not, the brand kit extra covers it.'], ['What do you need from me?', 'Your text, photos if you have them, and one person who can say yes or no quickly.']]
  $('#faq-list').innerHTML = faq.map(function (f, i) { return '<div class="q"><button aria-expanded="false" aria-controls="a' + i + '">' + f[0] + '<span>+</span></button><p id="a' + i + '" hidden>' + f[1] + '</p></div>' }).join('')
  $('#faq-list').onclick = function (e) { var b = e.target.closest('button'); if (!b) return; var o = b.getAttribute('aria-expanded') === 'true'; b.setAttribute('aria-expanded', !o); b.nextElementSibling.hidden = o; b.lastChild.textContent = o ? '+' : '\u2212' }
  // form
  $('#form').onsubmit = function (e) {
    e.preventDefault(); var f = { name: $('#f-name').value, email: $('#f-email').value, message: $('#f-msg').value }, er = L.validateContact(f)
    ;['name', 'email', 'message'].forEach(function (k) { $('#e-' + k).textContent = er[k] || '' })
    if (Object.keys(er).length) return
    toast('Opening your email app'); window.location.href = L.mailto('hello@fokir.example', f)
  }
  paintWork(); paintQuote()
})()
