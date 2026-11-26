(function (root) {
  'use strict'
  var PROJECTS = [
    { id: 1, title: 'Copper wall clock', cat: 'product', img: 'images/1.jpg', blurb: 'Packaging and product page for a handmade clock.' },
    { id: 2, title: 'Minimal watch', cat: 'product', img: 'images/2.jpg', blurb: 'Launch site and product photography direction.' },
    { id: 3, title: 'Kraft business cards', cat: 'branding', img: 'images/3.jpg', blurb: 'Identity and stationery for a roastery.' },
    { id: 4, title: 'Leather sneaker', cat: 'product', img: 'images/4.jpg', blurb: 'Shop pages and size-guide design.' },
    { id: 5, title: 'Studio identity', cat: 'branding', img: 'images/5.jpg', blurb: 'Logo, colours and cards for a design studio.' },
    { id: 6, title: 'Pocket device', cat: 'product', img: 'images/6.jpg', blurb: 'App onboarding and companion web app.' },
  ]
  var PLANS = [
    { id: 'landing', name: 'Landing page', base: 400, days: 5 },
    { id: 'site', name: 'Multi-page website', base: 1200, days: 14 },
    { id: 'app', name: 'Web app prototype', base: 2000, days: 21 },
  ]
  var EXTRAS = [
    { id: 'brand', name: 'Brand kit', price: 300, days: 3 },
    { id: 'seo', name: 'SEO setup', price: 150, days: 1 },
    { id: 'cms', name: 'Content editing', price: 250, days: 2 },
    { id: 'rush', name: 'Rush delivery (-30% time)', rush: true },
  ]
  function filter(list, cat) { return cat === 'all' ? list : list.filter(function (p) { return p.cat === cat }) }
  /* quote: plan id, extra ids, pages (only counts for the multi-page site: 5 pages included, 80 USD per extra page). Rush adds 25% to the price. */
  function quote(planId, extraIds, pages) {
    var plan = PLANS.filter(function (p) { return p.id === planId })[0]
    if (!plan) return null
    var price = plan.base, days = plan.days
    if (planId === 'site') price += Math.max(0, Math.min(40, Math.floor(pages || 5)) - 5) * 80
    var rush = false
    EXTRAS.forEach(function (x) {
      if (extraIds.indexOf(x.id) === -1) return
      if (x.rush) rush = true; else { price += x.price; days += x.days }
    })
    if (rush) { price = Math.round(price * 1.25); days = Math.max(1, Math.ceil(days * 0.7)) }
    return { price: price, days: days }
  }
  function validEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || '').trim()) }
  function validateContact(f) {
    var e = {}
    if (!f.name || f.name.trim().length < 2) e.name = 'Enter your name.'
    if (!validEmail(f.email)) e.email = 'Enter a valid email.'
    if (!f.message || f.message.trim().length < 10) e.message = 'Write at least 10 characters.'
    return e
  }
  function mailto(to, f) {
    return 'mailto:' + to + '?subject=' + encodeURIComponent('Project enquiry from ' + f.name.trim()) + '&body=' + encodeURIComponent(f.message.trim() + '\n\n' + f.name.trim() + '\n' + f.email.trim())
  }
  function countStep(target, t) { var k = Math.min(1, Math.max(0, t)); return Math.round(target * (1 - Math.pow(1 - k, 3))) }
  var api = { PROJECTS: PROJECTS, PLANS: PLANS, EXTRAS: EXTRAS, filter: filter, quote: quote, validEmail: validEmail, validateContact: validateContact, mailto: mailto, countStep: countStep }
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.FokirLogic = api
})(typeof window !== 'undefined' ? window : this)
