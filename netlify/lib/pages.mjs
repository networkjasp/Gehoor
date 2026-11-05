/** Page templates. Each returns a complete HTML document. */
import { e, url, absUrl, media, nl2br, setting, practices, team, team_photo_url, newsletters, format_date, whatsapp_link, icon, slot_img } from './helpers.mjs';
import { practices as PRACTICES } from './content.mjs';
import { pageHead, pageFooter, members_of, cta_band, page_hero } from './layout.mjs';

const faqLd = (qs, prefix = '') => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qs.map(([q, a]) => ({ '@type': 'Question', name: prefix + q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
const page = (meta, active, body) => pageHead(meta, active) + body + '\n' + pageFooter();

export function home() {
  const faq = [
    ["Do I need a doctor's referral?", "No. You can make an appointment with us directly. Some medical aids ask for a referral before they pay for hearing aids, and we'll tell you if yours does."],
    ['Does my medical aid pay for a hearing test?', 'Most medical aids cover a diagnostic hearing test. We submit the claim for you, and help with motivations and quotes for hearing aids at no charge.'],
    ['Can I try hearing aids before I buy?', 'Yes. We offer a trial period so you can wear them at home, at work and at church before you decide.'],
    ['Which hearing aid brands do you fit?', "Rexton, Unitron, Widex and Signia, plus Cochlear and Baha implant solutions. We're independent, so we recommend what suits you."],
  ];
  const audiologists = team().filter((m) => m.group === 'audiologist');
  const latest = newsletters().slice(0, 3);
  const wa = whatsapp_link();
  const services = [
    ['test', 'Hearing tests', 'Full diagnostic testing in a soundproof booth, with results explained the same day.', 'services/#hearing-tests'],
    ['child', 'Babies & children', 'Child-friendly testing from birth, school-readiness screening and follow-up.', 'babies-and-children/'],
    ['heart', 'Newborn hearing screening', 'Screening for newborns at Life Eugene Marais Hospital, right across the road.', 'babies-and-children/#newborn'],
    ['wave', 'Tinnitus & hyperacusis', 'Ringing in your ears or sensitivity to sound is treatable. We build a plan around you.', 'services/#tinnitus'],
    ['ear', 'Hearing aids & fittings', 'Rexton, Unitron, Widex and Signia, with a trial period and lifelong aftercare.', 'hearing-aids/'],
    ['shield', 'Ear protection & swim plugs', 'Custom swim plugs and noise protection, plus repairs and the Battery Club.', 'services/#protection'],
  ];
  return page({ path: '', schema: [faqLd(faq)] }, 'home', `<section class="hero">
  <div class="wrap hero-in">
    <div class="hero-text">
      <p class="pill">HPCSA-registered audiologists · Since 1999</p>
      <h1>Audiologists in the Moot, Pretoria, since 1999</h1>
      <p class="lead">Hearing tests for babies, children and adults, tinnitus care and hearing aids, with personal care from a team that knows you by name. <span lang="af">Ons help graag!</span></p>
      <div class="cta-actions">
        <a class="btn btn-primary btn-lg" href="${e(url('contact/#form'))}" data-track="cta_click">Make an appointment</a>
        <span class="cta-alt">or call <a href="tel:${e(setting('phone_intl'))}" data-track="phone_click">${e(setting('phone'))}</a>${(wa) ? ` · <a href="${e(wa)}" data-track="whatsapp_click">WhatsApp us</a>` : ''}</span>
      </div>
      <ul class="ticks">
        <li>${icon('check', 20)} We claim from your medical aid</li>
        <li>${icon('check', 20)} Babies, children &amp; adults</li>
        <li>${icon('check', 20)} Secure parking, wheelchair-friendly</li>
        <li>${icon('check', 20)} Afrikaans &amp; English</li>
      </ul>
    </div>
    <div class="hero-media">
      ${slot_img('home_hero', 'rounded', 'Dr René Hornby with a patient at Gehoor in die Moot', false, '4 / 4.3')}
      <div class="badge-float"><strong>${new Date().getFullYear() - 1999}</strong><span>years caring for<br>Pretoria's hearing</span></div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap band-in">
    <div>
      <h2>Not sure if you need a hearing test?</h2>
      <p>Answer 8 quick questions in our free hearing check, with your result straight away.</p>
    </div>
    <a class="btn btn-outline-light" href="${e(url('services/#hearing-check'))}">Take the hearing check ${icon('arrow', 18)}</a>
  </div>
</section>

<section class="section" aria-labelledby="services-h">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Dienste · Services</p>
      <h2 id="services-h">Hearing care for every stage of life</h2>
      <p class="muted">From your baby's first hearing screen to fitting the latest rechargeable hearing aids, it's all under one roof with the same team.</p>
    </div>
    <div class="grid">
${services.map(([ic, t, d, href]) => `
      <a class="card" href="${e(url(href))}">
        <span class="icon-tile">${icon(ic, 28)}</span>
        <h3>${e(t)}</h3>
        <p>${e(d)}</p>
        <span class="more">Learn more ${icon('arrow', 18)}</span>
      </a>
`).join('')}
    </div>
  </div>
</section>

<section class="section tint" aria-labelledby="visit-h">
  <div class="wrap split">
    <div class="split-text">
      <p class="eyebrow">Your first visit</p>
      <h2 id="visit-h">What to expect, step by step</h2>
      <ol class="steps">
        <li><span class="num">1</span><div><strong>A conversation.</strong> We ask about your hearing, health and the situations you find hardest.</div></li>
        <li><span class="num">2</span><div><strong>A look in your ears.</strong> We check for wax or anything blocking sound.</div></li>
        <li><span class="num">3</span><div><strong>The hearing test.</strong> Painless. You listen in a soundproof booth and press a button when you hear a tone.</div></li>
        <li><span class="num">4</span><div><strong>Your results, explained.</strong> You leave with clear options and a written report, with no pressure to buy.</div></li>
      </ol>
    </div>
    <div class="split-media">
      <div class="panel green">
        <h3>Bring along</h3>
        <ul class="checklist">
          <li>${icon('check', 18)} Your ID and medical aid card</li>
          <li>${icon('check', 18)} A doctor's referral, if you have one</li>
          <li>${icon('check', 18)} Your current hearing aids</li>
          <li>${icon('check', 18)} A list of your medication</li>
          <li>${icon('check', 18)} A family member: a familiar voice helps when we fit hearing aids</li>
        </ul>
      </div>
    </div>
  </div>
</section>

${(audiologists.length) ? `
<section class="section" aria-labelledby="team-h">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Ons span · Our team</p>
      <h2 id="team-h">Qualified, registered and here since 1999</h2>
    </div>
    <div class="team-grid">
${audiologists.map((m) => { const ph = team_photo_url(m); return `
      <article class="person">
        ${ph ? '<img class="photo" src="' + e(ph) + '" alt="' + e(m.name) + '" loading="lazy">' : '<div class="photo img-ph" role="img" aria-label="' + e(m.name) + '"><img src="' + e(url('assets/img/logo-mark.png')) + '" alt=""></div>'}
        <div class="person-body">
          <h3>${e(m.name)}</h3>
          <p class="role">${e(m.role)}</p>
${((m.hpcsa)) ? `          <p class="reg">HPCSA ${e(m.hpcsa)}</p>` : ''}
        </div>
      </article>
`; }).join('')}
    </div>
    <p style="margin-top:24px"><a class="text-link" href="${e(url('about-us/'))}">Meet the whole team ${icon('arrow', 18)}</a></p>
  </div>
</section>
` : ''}

<section class="section tint" aria-labelledby="club-h">
  <div class="wrap grid-2">
    <div class="panel navy">
      <p class="eyebrow" style="color:#B9E38F">Battery Club</p>
      <h2 id="club-h">Buy 5 packs of batteries, get the 6th free</h2>
      <p>Open to everyone, including people who aren't our patients. Ask at reception, or send us a message with your battery size.</p>
      <a class="text-link light" href="${e(url('contact/?subject=battery#form'))}">Join the Battery Club ${icon('arrow', 18)}</a>
    </div>
    <div class="panel" style="background:var(--bg);border:1px solid var(--line)">
      <p class="eyebrow">Mediese fonds · Medical aid</p>
      <h2>We handle your medical aid claims</h2>
      <p class="muted">We submit claims, motivations and quotes to your medical aid for you, free of charge.</p>
      <a class="text-link" href="${e(url('medical-aid/'))}">How medical aid works ${icon('arrow', 18)}</a>
    </div>
  </div>
</section>

${(latest.length) ? `
<section class="section" aria-labelledby="news-h">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Nuusbriewe · Newsletters</p>
      <h2 id="news-h">Latest from the practice</h2>
    </div>
    <div class="news-grid">
${latest.map((n) => `
      <a class="news-card" href="${e(url('newsletters/' + n.slug))}">
        ${((n.cover)) ? `<img class="cover" src="${e(media(n.cover))}" alt="" loading="lazy">` : ''}
        <div class="body"><time datetime="${e(n.date)}">${e(format_date(n.date))}</time><h3>${e(n.title)}</h3></div>
      </a>
`).join('')}
    </div>
  </div>
</section>
` : ''}

<section class="section tint" aria-labelledby="loc-h">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Praktyke · Practices</p>
      <h2 id="loc-h">Two practices in the Moot</h2>
    </div>
    <div class="grid-2">
${practices().map((p) => `
      <div class="loc">
        <div class="loc-body">
          <h3>${e(p.name)}</h3>
          <p style="margin:0">${icon('pin', 18)} ${e(p.street)}, ${e(p.area)}, ${e(p.city)}, ${e(p.code)}</p>
          <p class="muted small" style="margin:0">${e(p.note)}</p>
          <p class="small" style="margin:0">${icon('clock', 18)} ${e(setting('hours'))}</p>
          <a href="${e(p.map)}" target="_blank" rel="noopener"><strong>Get directions</strong></a>
        </div>
      </div>
`).join('')}
    </div>
  </div>
</section>

${members_of()}

<section class="section tint" aria-labelledby="faq-h">
  <div class="wrap">
    <h2 id="faq-h" class="center">Frequently asked questions</h2>
    <div class="faq">
${faq.map(([q, a], i) => `
      <details${i === 0 ? ' open' : ''}><summary>${e(q)}</summary><p>${e(a)}</p></details>
`).join('')}
    </div>
  </div>
</section>

${cta_band()}`);
}

function quiz(qs, id, threshold, high, low) {
  return `  <div class="panel" style="background:var(--bg);border:1px solid var(--line)" data-quiz id="${e(id)}" data-threshold="${threshold}" data-high="${e(high)}" data-low="${e(low)}">
${qs.map((q, i) => `    <div class="quiz-q"><span>${i + 1}. ${e(q)}</span>
      <span class="yn" role="group" aria-label="Answer to question ${i + 1}"><button type="button" value="yes" aria-pressed="false">Yes</button><button type="button" value="no" aria-pressed="false">No</button></span>
    </div>`).join('\n')}
    <p class="quiz-result" role="status" aria-live="polite">Answer the questions to see your result.</p>
    <p class="small muted" style="margin:10px 0 0">This isn't a diagnosis. It helps you decide whether to make an appointment.</p>
  </div>`;
}

export function services() {
  const check = [
    'Do you often ask people to repeat themselves?',
    'Is it hard to follow a conversation in a restaurant or at church?',
    'Do family members say the TV or radio is too loud?',
    'Do people seem to mumble or speak softly?',
    'Is it hard to hear on the phone?',
    "Do you struggle to hear women's or children's voices?",
    'Do you hear ringing, buzzing or hissing in your ears?',
    'Do you avoid social situations because of your hearing?',
  ];
  const tinnitus = [
    'Do you hear ringing, buzzing or hissing most days?',
    'Does it bother you when you try to sleep?',
    'Does it make it hard to concentrate?',
    'Do everyday sounds feel too loud or painful?',
    'Has it lasted longer than 3 months?',
  ];
  return page({ path: 'services/', breadcrumbs: [['Services', 'services/']] }, 'services', `${page_hero('Dienste · Services', 'Hearing tests and hearing care in Pretoria',
    'Everything your ears need under one roof: diagnostic hearing tests, tinnitus care, hearing aids, children\'s audiology, ear protection and repairs.',
    'services_hero', [['Services', 'services/']])}

<section class="section" style="padding-top:24px" aria-labelledby="all-services-h">
  <h2 id="all-services-h" class="sr-only">All our services</h2>
  <div class="wrap grid">
    <a class="card" href="#hearing-tests"><span class="icon-tile">${icon('test', 28)}</span><h3>Hearing tests</h3><p>For adults, from screening to full diagnostic testing.</p></a>
    <a class="card" href="#tinnitus"><span class="icon-tile">${icon('wave', 28)}</span><h3>Tinnitus &amp; hyperacusis</h3><p>Assessment, sound therapy and ongoing support.</p></a>
    <a class="card" href="${e(url('hearing-aids/'))}"><span class="icon-tile">${icon('ear', 28)}</span><h3>Hearing aids</h3><p>Independent advice, trial period and aftercare.</p></a>
    <a class="card" href="${e(url('babies-and-children/'))}"><span class="icon-tile">${icon('child', 28)}</span><h3>Babies &amp; children</h3><p>Newborn screening and child-friendly testing.</p></a>
    <a class="card" href="#protection"><span class="icon-tile">${icon('shield', 28)}</span><h3>Ear protection &amp; swim plugs</h3><p>Custom-made from impressions of your ears.</p></a>
    <a class="card" href="#repairs"><span class="icon-tile">${icon('wrench', 28)}</span><h3>Repairs &amp; batteries</h3><p>Servicing, warranty repairs and the Battery Club.</p></a>
  </div>
</section>

<section class="section tint" id="hearing-tests">
  <div class="wrap split">
    <div class="split-text">
      <p class="eyebrow">Gehoortoetse</p>
      <h2>Diagnostic hearing tests</h2>
      <p>A full hearing assessment takes about an hour in our soundproof booth. It tells us the type and degree of any hearing loss, and whether there's an underlying medical issue that needs a referral.</p>
      <ul class="checklist">
        <li>${icon('check', 18)} Pure-tone and speech testing</li>
        <li>${icon('check', 18)} Middle-ear (tympanometry) testing</li>
        <li>${icon('check', 18)} Results explained the same day, with a written report</li>
        <li>${icon('check', 18)} Reports for your doctor, ENT, employer or medical aid</li>
      </ul>
    </div>
    <div class="split-media">${slot_img('service_tests', 'rounded', 'Hearing test in a soundproof booth', true, '4 / 3')}</div>
  </div>
</section>

<section class="section" id="hearing-check">
  <div class="wrap split">
    <div class="split-text" style="flex-basis:340px">
      <p class="eyebrow">Free hearing check</p>
      <h2>Do I need a hearing test?</h2>
      <p class="muted">Answer these 8 questions honestly. If you answer "yes" to three or more, a hearing test is a good idea. Hearing loss usually creeps up slowly, and the people around you often notice it first.</p>
    </div>
    <div class="split-media" style="flex-basis:520px">
      ${quiz(check, 'quiz-hearing', 3,
        'Your answers suggest a hearing test would be worthwhile. Contact us to make an appointment.',
        'Your hearing seems fine for now. We still recommend a baseline test from age 50, or sooner if things change.')}
    </div>
  </div>
</section>

<section class="section tint" id="tinnitus">
  <div class="wrap">
    <div class="split">
      <div class="split-text">
        <p class="eyebrow">Tinnitus &amp; hiperakusis</p>
        <h2>Tinnitus and hyperacusis treatment</h2>
        <p>Tinnitus is ringing, buzzing or hissing that no one else can hear. Hyperacusis makes everyday sounds feel too loud or even painful. Both are common, and you don't have to "just live with it". There's no one-size-fits-all cure, but most people get real relief with the right plan.</p>
        <ol class="steps">
          <li><span class="num">1</span><div><strong>Full assessment:</strong> a hearing test, tinnitus pitch and loudness matching, and a sound-tolerance check.</div></li>
          <li><span class="num">2</span><div><strong>Understanding it:</strong> knowing what causes your tinnitus takes away much of the fear and stress.</div></li>
          <li><span class="num">3</span><div><strong>Sound therapy:</strong> hearing aids with built-in tinnitus programmes, sound generators or apps.</div></li>
          <li><span class="num">4</span><div><strong>Follow-up:</strong> regular check-ins, and a referral to an ENT or psychologist when needed.</div></li>
        </ol>
      </div>
      <div class="split-media">${slot_img('service_tinnitus', 'rounded', 'Tinnitus consultation', true, '4 / 3')}</div>
    </div>
    <div style="margin-top:40px; max-width:820px">
      <h3>Tinnitus self-check</h3>
      ${quiz(tinnitus, 'quiz-tinnitus', 2,
        'Your answers suggest a tinnitus assessment would help. Contact us to make an appointment.',
        'Your tinnitus seems mild. Keep an eye on it, and come in if it changes or starts to bother you.')}
    </div>
  </div>
</section>

<section class="section" id="protection">
  <div class="wrap split reverse">
    <div class="split-text">
      <p class="eyebrow">Gehoorbeskerming</p>
      <h2>Ear protection and custom swim plugs</h2>
      <p>Noise damage is permanent, but it's preventable. We take impressions of your ears to make protection that fits comfortably all day.</p>
      <ul class="checklist">
        <li>${icon('check', 18)} Custom swim plugs for children with grommets, and for swimmers</li>
        <li>${icon('check', 18)} Hearing protection for shooting, hunting, motorsport and industry</li>
        <li>${icon('check', 18)} Musicians' earplugs that lower volume without muffling sound</li>
        <li>${icon('check', 18)} Sleep plugs and Protec-Ear products</li>
      </ul>
    </div>
    <div class="split-media">${slot_img('service_protection', 'rounded', 'Custom ear protection and swim plugs', true, '4 / 3')}</div>
  </div>
</section>

<section class="section tint" id="repairs">
  <div class="wrap grid-2">
    <div class="panel" style="background:var(--bg);border:1px solid var(--line)">
      <span class="icon-tile">${icon('wrench', 28)}</span>
      <h2 style="margin-top:14px">Repairs and servicing</h2>
      <p class="muted">We clean, check and repair hearing aids of all brands. Warranty repairs are sent to the manufacturer with the courier fee waived. Hearing aids should be serviced at least once a year.</p>
    </div>
    <div class="panel navy">
      <span class="icon-tile">${icon('battery', 28)}</span>
      <h2 style="margin-top:14px">Battery Club</h2>
      <p>Buy 5 packs of hearing aid batteries and get the 6th free. Open to everyone, including people who aren't our patients.</p>
      <a class="text-link light" href="${e(url('contact/?subject=battery#form'))}">Join the Battery Club ${icon('arrow', 18)}</a>
    </div>
  </div>
</section>

${cta_band('Questions about any of our services?')}`);
}

export function about() {
  const all = team();
  const aud = all.filter((m) => m.group === 'audiologist');
  const sup = all.filter((m) => m.group !== 'audiologist');
  return page({ path: 'about-us/', breadcrumbs: [['About us', 'about-us/']] }, 'about-us', `${page_hero('Oor ons · About us', 'Caring for the Moot\'s hearing since 1999',
    'What a privilege it has been to serve the people of the Moot and beyond for more than ' + (new Date().getFullYear() - 1999) + ' years. We\'re an independent practice: we recommend what\'s right for you, not what a manufacturer wants sold.',
    'about_hero', [['About us', 'about-us/']])}

<section class="section" style="padding-top:24px" aria-labelledby="why-h">
  <h2 id="why-h" class="sr-only">Why patients choose us</h2>
  <div class="wrap grid">
    <div class="card"><span class="icon-tile">${icon('heart', 28)}</span><h3>Personal care</h3><p>The same familiar faces, visit after visit, in Afrikaans or English.</p></div>
    <div class="card"><span class="icon-tile">${icon('medical', 28)}</span><h3>We do the paperwork</h3><p>Medical aid claims, motivations and quotes are submitted for you, free of charge.</p></div>
    <div class="card"><span class="icon-tile">${icon('pin', 28)}</span><h3>Easy to visit</h3><p>Two practices, secure on-site parking, and wheelchair-friendly rooms and parking.</p></div>
  </div>
</section>

<section class="section tint" id="team" aria-labelledby="team-h">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Ons span · Our team</p>
      <h2 id="team-h">Meet our audiologists</h2>
      <p class="muted">All our audiologists are registered with the Health Professions Council of South Africa (HPCSA).</p>
    </div>
    <div class="team-grid">
${aud.map((m) => { const ph = team_photo_url(m); return `
      <article class="person">
        ${ph ? '<img class="photo" src="' + e(ph) + '" alt="' + e(m.name) + ', ' + e(m.role) + '" loading="lazy">' : '<div class="photo img-ph" role="img" aria-label="' + e(m.name) + '"><img src="' + e(url('assets/img/logo-mark.png')) + '" alt=""></div>'}
        <div class="person-body">
          <h3>${e(m.name)}</h3>
          <p class="role">${e(m.role)}</p>
${((m.quals)) ? `          <p class="quals">${e(m.quals)}</p>` : ''}
${((m.hpcsa)) ? `          <p class="reg">HPCSA ${e(m.hpcsa)}</p>` : ''}
${((m.bio)) ? `          <p class="bio">${nl2br(e(m.bio))}</p>` : ''}
        </div>
      </article>
`; }).join('')}
    </div>
${(sup.length) ? `
    <h3 style="margin-top:44px">Our friendly support team</h3>
    <ul class="support-list">
${sup.map((m) => { const ph = team_photo_url(m); return `
      <li>${ph ? '<img src="' + e(ph) + '" alt="" loading="lazy">' : '<span class="avatar" aria-hidden="true"></span>'}<span><strong>${e(m.name)}</strong><br><span class="muted small">${e(m.role)}</span></span></li>
`; }).join('')}
    </ul>
` : ''}
    <p class="small muted" style="margin-top:28px">Practice number ${e(setting('practice_no'))} · ${e(setting('legal_name'))}, reg. ${e(setting('company_reg'))}</p>
  </div>
</section>

<section class="section" id="community">
  <div class="wrap split">
    <div class="split-text">
      <p class="eyebrow">Gemeenskap · Community</p>
      <h2>Serving the community</h2>
      <p>We provide newborn hearing screening at Life Eugene Marais Hospital, and work with local schools, care homes and community organisations to make hearing care easier to get.</p>
      <p>Through donation programmes run with manufacturers, we've helped people who could not otherwise afford hearing aids. Ask us about current programmes.</p>
    </div>
    <div class="split-media">${slot_img('about_community', 'rounded', 'Gehoor in die Moot serving the community', true, '4 / 3')}</div>
  </div>
</section>

${members_of()}${cta_band('Come and meet us')}`);
}

export function hearingAids() {
  const myths = [
    ['Smaller always costs more', 'Price depends mostly on the technology inside, not on size. A small aid can be basic, and a larger one can be top of the range.'],
    ['Hearing aids restore normal hearing', "They make sounds and speech much clearer, but they don't make hearing perfect. Realistic expectations make for happier wearers."],
    ['Batteries are a constant hassle', 'Most new hearing aids are rechargeable with a lithium-ion battery. Pop them in the charger at night, the same as your phone.'],
    ['Once fitted, they look after themselves', 'Hearing aids should be serviced at least once a year to keep them working at their best.'],
    ["I'll only need them for special occasions", 'Your brain adapts best when you wear them every day, all day. Part-time wearing makes it harder to get used to them.'],
  ];
  const brands = [
    ['Rexton', 'Reliable, affordable hearing aids, including water-resistant models.'],
    ['Unitron', 'Natural sound and easy-to-use apps.'],
    ['Widex', 'Known for exceptionally natural sound quality.'],
    ['Signia', 'Rechargeable and Bluetooth options with smart features.'],
    ['Cochlear & Baha', 'Implant and bone-conduction solutions for severe hearing loss.'],
    ['Protec-Ear', 'Custom hearing protection and swim plugs.'],
  ];
  return page({ path: 'hearing-aids/', breadcrumbs: [['Hearing aids', 'hearing-aids/']], schema: [faqLd(myths, 'Myth: ')] }, 'hearing-aids', `${page_hero('Gehoorapparate · Hearing aids', 'Hearing aids, chosen around your life',
    'As an independent practice we fit several leading brands, so we can recommend what suits your hearing, your lifestyle and your budget, not what one company wants sold.',
    'hearingaids_hero', [['Hearing aids', 'hearing-aids/']])}

<section class="section" style="padding-top:24px">
  <div class="wrap">
    <div class="section-head">
      <h2>How we choose the right hearing aid with you</h2>
    </div>
    <div class="grid">
      <div class="card"><span class="icon-tile">${icon('test', 28)}</span><h3>1. Your hearing</h3><p>We start with a full hearing test, so the technology matches your type and degree of hearing loss.</p></div>
      <div class="card"><span class="icon-tile">${icon('heart', 28)}</span><h3>2. Your lifestyle</h3><p>Busy restaurants, church, the bushveld, the office: we ask where you most want to hear better.</p></div>
      <div class="card"><span class="icon-tile">${icon('medical', 28)}</span><h3>3. Your budget</h3><p>We explain the options at each price level and what your medical aid will cover.</p></div>
      <div class="card"><span class="icon-tile">${icon('ear', 28)}</span><h3>4. A trial at home</h3><p>Wear them in your real life before you decide.</p></div>
      <div class="card"><span class="icon-tile">${icon('wrench', 28)}</span><h3>5. Fitting &amp; fine-tuning</h3><p>We programme them to your hearing and fine-tune them over the first weeks. Bring a family member: a familiar voice helps.</p></div>
      <div class="card"><span class="icon-tile">${icon('shield', 28)}</span><h3>6. Lifelong aftercare</h3><p>Annual check-ups, cleaning and repairs, with courier fees waived on warranty repairs.</p></div>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap split">
    <div class="split-text">
      <p class="eyebrow">Style &amp; technology</p>
      <h2>Modern hearing aids are small, smart and rechargeable</h2>
      <ul class="checklist">
        <li>${icon('check', 18)} <span><strong>Rechargeable:</strong> charge overnight, wear all day</span></li>
        <li>${icon('check', 18)} <span><strong>Bluetooth:</strong> phone calls and TV streamed straight to your ears</span></li>
        <li>${icon('check', 18)} <span><strong>Apps:</strong> adjust volume and programmes from your phone</span></li>
        <li>${icon('check', 18)} <span><strong>Remote fine-tuning:</strong> on supported models we can make adjustments without you coming in</span></li>
        <li>${icon('check', 18)} <span><strong>Tinnitus programmes:</strong> built-in relief sounds</span></li>
        <li>${icon('check', 18)} <span><strong>Water-resistant</strong> models for an active life</span></li>
      </ul>
    </div>
    <div class="split-media">${slot_img('hearingaids_styles', 'rounded', 'Modern rechargeable hearing aids', true, '4 / 3')}</div>
  </div>
</section>

<section class="section" aria-labelledby="brands-h">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Products &amp; partners</p>
      <h2 id="brands-h">Brands we fit and support</h2>
    </div>
    <div class="grid">
${brands.map(([b, d]) => `
      <div class="card"><h3>${e(b)}</h3><p>${e(d)}</p></div>
`).join('')}
    </div>
  </div>
</section>

<section class="section tint" aria-labelledby="myths-h">
  <div class="wrap">
    <h2 id="myths-h" class="center">Myths about hearing aids</h2>
    <div class="faq">
${myths.map(([q, a], i) => `
      <details${i === 0 ? ' open' : ''}><summary>Myth: ${e(q)}</summary><p>${e(a)}</p></details>
`).join('')}
    </div>
  </div>
</section>

${cta_band('Curious which hearing aid would suit you?', 'Make an appointment for a hearing test and a no-obligation chat about your options.')}`);
}

export function children() {
  const faq = [
    ['My baby "referred" on the newborn screen. Does that mean they are deaf?', "No. A \"refer\" result only means the test needs to be repeated. It often happens because of fluid in the ears or a restless baby. Most babies pass the follow-up test, but it's important to do it promptly."],
    ["How do you test a baby who can't respond?", "Newborn screening measures the ear's own response to soft sounds (otoacoustic emissions) while your baby sleeps. It's quick, painless and safe."],
    ['At what age can my child have a hearing test?', "At any age, from birth. We adapt the test to your child's age and development, often using play."],
  ];
  const signs = [
    ['Birth – 3 months', 'Startles at sudden loud sounds and calms to your voice.'],
    ['4 – 6 months', 'Turns eyes or head towards sounds and enjoys rattles.'],
    ['7 – 12 months', 'Responds to their name, babbles, and understands "no" and "bye-bye".'],
    ['1 – 2 years', 'Points to familiar objects when named, and uses single words that grow into short phrases.'],
    ['2 – 4 years', 'Speaks in sentences, is understood by family, and hears you from another room.'],
    ['School age', "Follows instructions in class, keeps up with reading, and doesn't turn the TV up loud."],
  ];
  return page({ path: 'babies-and-children/', breadcrumbs: [['Babies & children', 'babies-and-children/']], schema: [faqLd(faq)] }, 'babies-and-children', `${page_hero('Babas & kinders · Babies & children', 'Hearing care for babies and children',
    'Good hearing is the foundation of speech, language and learning. We test children of every age, from their first days, gently and with lots of patience.',
    'children_hero', [['Babies & children', 'babies-and-children/']])}

<section class="section tint" id="newborn">
  <div class="wrap split">
    <div class="split-text">
      <p class="eyebrow">Life Eugene Marais Hospital</p>
      <h2>Newborn hearing screening</h2>
      <p>We screen newborns at Life Eugene Marais Hospital, right across the road from our Les Marais practice. The screen takes a few minutes while your baby sleeps, and it doesn't hurt.</p>
      <h3 style="margin-top:20px">The 1-3-6 guideline</h3>
      <ol class="steps">
        <li><span class="num">1</span><div><strong>By 1 month:</strong> hearing screened.</div></li>
        <li><span class="num">3</span><div><strong>By 3 months:</strong> a full diagnostic test if the screen needs follow-up.</div></li>
        <li><span class="num">6</span><div><strong>By 6 months:</strong> support in place, such as hearing aids, if needed.</div></li>
      </ol>
    </div>
    <div class="split-media">${slot_img('children_newborn', 'rounded', 'Newborn hearing screening', true, '4 / 3')}</div>
  </div>
</section>

<section class="section" aria-labelledby="k-h">
  <h2 id="k-h" class="sr-only">At a glance</h2>
  <div class="wrap grid">
    <div class="card"><span class="icon-tile">${icon('child', 28)}</span><h3>Child hearing tests</h3><p>Play-based tests matched to your child's age, plus middle-ear checks for ear infections and fluid.</p></div>
    <div class="card"><span class="icon-tile">${icon('doc', 28)}</span><h3>School-readiness screening</h3><p>Hearing and listening checks before Grade R or Grade 1, with reports for teachers and therapists.</p></div>
    <div class="card"><span class="icon-tile">${icon('shield', 28)}</span><h3>Swim plugs for grommets</h3><p>Custom swim plugs that keep water out after grommets, so your child can keep swimming.</p></div>
  </div>
</section>

<section class="section tint" aria-labelledby="signs-h">
  <div class="wrap">
    <div class="section-head">
      <h2 id="signs-h">Hearing milestones to watch for</h2>
      <p class="muted">If your child isn't doing these things, or you're simply worried, trust your instinct and have their hearing checked.</p>
    </div>
    <div class="table-wrap panel" tabindex="0" role="region" aria-label="Hearing milestones table" style="background:var(--bg);border:1px solid var(--line);padding:8px 16px">
      <table>
        <thead><tr><th scope="col">Age</th><th scope="col">Most children can…</th></tr></thead>
        <tbody>
${signs.map(([age, sign]) => `
          <tr><th scope="row">${e(age)}</th><td>${e(sign)}</td></tr>
`).join('')}
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="faq-h">
  <div class="wrap">
    <h2 id="faq-h" class="center">Questions from parents</h2>
    <div class="faq">
${faq.map(([q, a], i) => `
      <details${i === 0 ? ' open' : ''}><summary>${e(q)}</summary><p>${e(a)}</p></details>
`).join('')}
    </div>
  </div>
</section>

${cta_band('Worried about your child\'s hearing?', 'Contact us. We see babies and children of all ages, and we\'ll explain every step.')}`);
}

export function medicalAid() {
  const faq = [
    ['Will my medical aid pay for hearing aids?', "Most medical aids have a hearing aid benefit, usually with a limit and a benefit cycle (often every three to five years). Some plans pay from savings and others from a separate benefit. We'll check yours for you."],
    ['Do I need a referral or a motivation?', 'Some schemes ask for a referral from a doctor or ENT, and most need a quote and a motivation from the audiologist. We prepare and submit these for you, free of charge.'],
    ["What if I don't have medical aid?", "You're very welcome. Ask us about cash fees for hearing tests, and about hearing aid options at different price levels."],
    ['Is a hearing test covered?', 'Many plans cover a diagnostic hearing test from day-to-day benefits or savings. We submit the claim directly.'],
  ];
  return page({ path: 'medical-aid/', breadcrumbs: [['Medical aid', 'medical-aid/']], schema: [faqLd(faq)] }, 'medical-aid', `${page_hero('Mediese fonds · Medical aid', 'We handle your medical aid, so you don\'t have to',
    'Medical aid rules for hearing care can be confusing. We submit claims, quotes and motivations on your behalf, at no charge, and tell you upfront what you\'ll pay.',
    'medicalaid_hero', [['Medical aid', 'medical-aid/']])}

<section class="section" style="padding-top:24px">
  <div class="wrap split" style="align-items:flex-start">
    <div class="split-text">
      <h2>How it works</h2>
      <ol class="steps">
        <li><span class="num">1</span><div><strong>Tell us your scheme and plan</strong> when you make your appointment.</div></li>
        <li><span class="num">2</span><div><strong>We check your benefits:</strong> hearing tests, hearing aid limits and your benefit cycle.</div></li>
        <li><span class="num">3</span><div><strong>We send the quote and motivation</strong> to your medical aid for pre-authorisation.</div></li>
        <li><span class="num">4</span><div><strong>You know exactly what you'll pay</strong> before anything is ordered. No surprises.</div></li>
      </ol>
    </div>
    <div class="split-media">
      <div class="panel green">
        <h3>Have these ready</h3>
        <ul class="checklist">
          <li>${icon('check', 18)} Your medical aid card (scheme, plan and number)</li>
          <li>${icon('check', 18)} The main member's ID number</li>
          <li>${icon('check', 18)} A referral letter, if your scheme asks for one</li>
          <li>${icon('check', 18)} The date of your last hearing aid claim, if any</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section tint" aria-labelledby="k2-h">
  <h2 id="k2-h" class="sr-only">What is usually covered</h2>
  <div class="wrap grid">
    <div class="card"><span class="icon-tile">${icon('test', 28)}</span><h3>Hearing tests</h3><p>Usually paid from day-to-day benefits or your medical savings account.</p></div>
    <div class="card"><span class="icon-tile">${icon('ear', 28)}</span><h3>Hearing aids</h3><p>Usually a separate appliance benefit with a limit per ear and a benefit cycle.</p></div>
    <div class="card"><span class="icon-tile">${icon('battery', 28)}</span><h3>Repairs &amp; batteries</h3><p>Sometimes covered from savings. Batteries are cheaper through our Battery Club.</p></div>
  </div>
</section>

<section class="section" aria-labelledby="faq-h">
  <div class="wrap">
    <h2 id="faq-h" class="center">Medical aid questions</h2>
    <div class="faq">
${faq.map(([q, a], i) => `
      <details${i === 0 ? ' open' : ''}><summary>${e(q)}</summary><p>${e(a)}</p></details>
`).join('')}
    </div>
  </div>
</section>

${cta_band('Want us to check your benefits?', 'Send us your scheme and plan name with your message and we\'ll find out what\'s covered.')}`);
}

export function newsletterList() {
  const list = newsletters();
  return page({ path: 'newsletters/', breadcrumbs: [['Newsletters', 'newsletters/']] }, 'newsletters', `<section class="page-hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="${e(url())}">Home</a> <span aria-hidden="true">›</span> <a href="${e(url('newsletters/'))}" aria-current="page">Newsletters</a></nav>
    <p class="eyebrow">Nuusbriewe · Newsletters</p>
    <h1>Newsletters</h1>
    <p class="lead">Hearing health tips, new technology and news from the practice.</p>
  </div>
</section>
<section class="section" style="padding-top:24px">
  <div class="wrap">
${(!list.length) ? `
    <div class="panel center"><h2>Our first newsletter is on its way</h2><p class="muted">Check back soon.</p></div>
` : `
    <div class="news-grid">
${list.map((n) => `
      <a class="news-card" href="${e(url('newsletters/' + n.slug))}">
${((n.cover)) ? `
        <img class="cover" src="${e(media(n.cover))}" alt="" loading="lazy">
` : `
        <div class="cover img-ph" style="border-radius:0;aspect-ratio:210/297"><img src="${e(url('assets/img/logo-mark.png'))}" alt=""></div>
`}
        <div class="body">
          <time datetime="${e(n.date)}">${e(format_date(n.date))}</time>
          <h2 style="font-size:1.1rem;margin:0">${e(n.title)}</h2>
${((n.summary)) ? `          <p class="muted small" style="margin:0">${e(n.summary)}</p>` : ''}
        </div>
      </a>
`).join('')}
    </div>
`}
  </div>
</section>
${cta_band()}`);
}

export function privacy() {
  const updated = '4 November 2026';
  const p = PRACTICES;
  return page({ path: 'privacy/', breadcrumbs: [['Privacy policy', 'privacy/']] }, '', `<!-- Template prepared for the practice. Have it reviewed by your compliance adviser before relying on it. -->
<section class="page-hero">
  <div class="wrap narrow">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="${e(url())}">Home</a> › <span aria-current="page">Privacy policy</span></nav>
    <h1>Privacy policy</h1>
    <p class="lead">How we collect, use and protect your personal information, in line with the Protection of Personal Information Act 4 of 2013 (POPIA).</p>
    <p class="small muted">Last updated: ${e(updated)}</p>
  </div>
</section>
<section class="section legal" style="padding-top:16px">
  <div class="wrap narrow">
    <nav class="toc" aria-label="On this page">
      <ol>
        <li><a href="#who">Who we are</a></li><li><a href="#collect">What we collect</a></li><li><a href="#why">Why we use it</a></li>
        <li><a href="#share">Who we share it with</a></li><li><a href="#cookies">Cookies and similar technology</a></li><li><a href="#keep">How long we keep it</a></li>
        <li><a href="#security">How we protect it</a></li><li><a href="#rights">Your rights</a></li><li><a href="#contact-io">Contact our Information Officer</a></li>
      </ol>
    </nav>

    <h2 id="who">1. Who we are</h2>
    <p>${e(setting('legal_name'))}, trading as Gehoor in die Moot (registration ${e(setting('company_reg'))}, practice number ${e(setting('practice_no'))}), is the "responsible party" for personal information collected through this website and at our practices at ${e(p.rietfontein['street'])}, ${e(p.rietfontein['area'])} and ${e(p.lesmarais['street'])}, ${e(p.lesmarais['area'])}, Pretoria.</p>

    <h2 id="collect">2. What we collect</h2>
    <h3>Through this website</h3>
    <ul>
      <li><strong>Contact form:</strong> your name, email address, phone number (optional), preferred practice and language, the topic and your message.</li>
      <li><strong>Technical information:</strong> your IP address is used briefly to block spam and abuse, and is stored only in scrambled (hashed) form.</li>
      <li><strong>Analytics, only if you accept:</strong> anonymous information about the pages you visit, your device type and how you arrived at the site.</li>
    </ul>
    <h3>When you become a patient</h3>
    <p>We collect the health, contact, identity and medical aid information needed to assess and treat you. Health information is special personal information under POPIA and is processed only for your care, as allowed by section 32 of POPIA and the HPCSA's rules on confidentiality.</p>

    <h2 id="why">3. Why we use it</h2>
    <ul>
      <li>To reply to your message and arrange appointments.</li>
      <li>To provide hearing care, and to submit claims, quotes and motivations to your medical aid.</li>
      <li>To keep this website secure and working, and, with your consent, to understand how it is used so we can improve it.</li>
    </ul>
    <p>We never sell your information, and we don't use it for marketing without your consent.</p>

    <h2 id="share">4. Who we share it with</h2>
    <ul>
      <li>Your medical aid scheme, referring doctor or specialist, when needed for your care and with your knowledge.</li>
      <li>Hearing aid manufacturers, for orders, warranties and repairs.</li>
      <li>Service providers who help us run the practice and this website (hosting, email, and Google Analytics if you accept). They may only use the information on our instructions.</li>
      <li>Authorities, when the law requires it.</li>
    </ul>
    <p>Some providers, such as Google, may store information outside South Africa. When this happens we rely on section 72 of POPIA: the recipient must be bound by adequate data protection rules or contract terms.</p>

    <h2 id="cookies">5. Cookies and similar technology</h2>
    <p>When you first visit, we ask whether you accept optional cookies. You can change your choice at any time with the <button type="button" class="linklike" data-consent-open>Cookie settings</button> link at the bottom of every page.</p>
    <div class="table-wrap" tabindex="0" role="region" aria-label="Table, scroll sideways on small screens">
      <table>
        <thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Purpose</th><th scope="col">Kept for</th></tr></thead>
        <tbody>
          <tr><td>gidm-consent</td><td>Essential (browser storage)</td><td>Remembers your cookie choice</td><td>12 months</td></tr>
          <tr><td>gidm-a11y</td><td>Essential (browser storage)</td><td>Remembers your text size and contrast choice</td><td>Until you clear it</td></tr>
          <tr><td>gidm_sid</td><td>Essential (cookie)</td><td>Keeps practice staff logged in to the website portal. Not set for visitors.</td><td>Until the browser closes</td></tr>
          <tr><td>_ga, _ga_*</td><td>Analytics (only if you accept)</td><td>Google Analytics: counts visits and shows which pages are useful</td><td>Up to 2 years</td></tr>
          <tr><td>Google Maps cookies</td><td>Third party (only if you accept or click "Show the map")</td><td>Shows our location maps on the Contact page</td><td>Set by Google</td></tr>
        </tbody>
      </table>
    </div>

    <h2 id="keep">6. How long we keep it</h2>
    <p>Messages sent through the website are deleted from the website system within 12 months, or sooner once they've been dealt with. Patient records are kept for as long as the HPCSA and South African law require.</p>

    <h2 id="security">7. How we protect it</h2>
    <p>The website runs only over an encrypted connection (HTTPS). The staff portal is password-protected, uses limited login attempts and automatic logout, and keeps website messages away from public access. In the practice, records are kept securely, and staff are bound by confidentiality.</p>

    <h2 id="rights">8. Your rights</h2>
    <p>Under POPIA you may:</p>
    <ul>
      <li>ask whether we hold information about you, and request a copy;</li>
      <li>ask us to correct or delete information that is wrong, out of date or no longer needed;</li>
      <li>object to how we use your information, or withdraw your consent;</li>
      <li>complain to the Information Regulator at <a href="https://inforegulator.org.za" rel="noopener" target="_blank">inforegulator.org.za</a>.</li>
    </ul>
    <p>Requests for records can also be made under our PAIA manual, which is available on request.</p>

    <h2 id="contact-io">9. Contact our Information Officer</h2>
    <p>Information Officer: ${e(setting('info_officer'))}<br>Email: <a href="mailto:${e(setting('email'))}">${e(setting('email'))}</a><br>Phone: <a href="tel:${e(setting('phone_intl'))}">${e(setting('phone'))}</a></p>
  </div>
</section>`);
}

export function terms() {
  const updated = '4 November 2026';
  const p = practices();
  return page({ path: 'terms/', breadcrumbs: [['Terms & conditions', 'terms/']] }, '', `<!-- Template prepared for the practice. Have it reviewed by your legal adviser before relying on it. -->
<section class="page-hero">
  <div class="wrap narrow">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="${e(url())}">Home</a> › <span aria-current="page">Terms &amp; conditions</span></nav>
    <h1>Terms &amp; conditions</h1>
    <p class="lead">The terms for using this website. By using the site, you agree to them.</p>
    <p class="small muted">Last updated: ${e(updated)}</p>
  </div>
</section>
<section class="section legal" style="padding-top:16px">
  <div class="wrap narrow">
    <h2>1. About us</h2>
    <p>This website is owned and run by ${e(setting('legal_name'))}, trading as Gehoor in die Moot. The following details are provided under section 43 of the Electronic Communications and Transactions Act 25 of 2002:</p>
    <div class="table-wrap" tabindex="0" role="region" aria-label="Table, scroll sideways on small screens">
      <table>
        <tbody>
          <tr><th scope="row">Legal name</th><td>${e(setting('legal_name'))} (a private company / incorporated practice)</td></tr>
          <tr><th scope="row">Registration number</th><td>${e(setting('company_reg'))}</td></tr>
          <tr><th scope="row">Practice number</th><td>${e(setting('practice_no'))}</td></tr>
          <tr><th scope="row">Directors</th><td>Dr René Hornby</td></tr>
          <tr><th scope="row">Physical addresses</th><td>${p.map((pr) => `${e(pr.street)}, ${e(pr.area)}, ${e(pr.city)}, ${e(pr.code)}<br>`).join('')}</td></tr>
          <tr><th scope="row">Phone</th><td>${e(setting('phone'))}</td></tr>
          <tr><th scope="row">Email</th><td>${e(setting('email'))}</td></tr>
          <tr><th scope="row">Professional body</th><td>Health Professions Council of South Africa (HPCSA). Members of the South African Association of Audiologists and iCAN.</td></tr>
        </tbody>
      </table>
    </div>

    <h2>2. Health information is general, not personal advice</h2>
    <p>The information on this website, including the online hearing and tinnitus self-checks, is general and educational. It is not a diagnosis and doesn't replace an assessment by a qualified audiologist or doctor. If you have sudden hearing loss, ear pain, discharge, dizziness or tinnitus in one ear only, see a doctor or audiologist promptly.</p>

    <h2>3. Appointments</h2>
    <p>Sending a message through the website is a request, not a confirmed appointment. Our reception team will confirm a date and time with you. If you can't make your appointment, please let us know as soon as possible so we can offer the time to someone else.</p>

    <h2>4. Fees and medical aid</h2>
    <p>Our fees are available from reception on request. We submit claims to your medical aid on your behalf. You remain responsible for any amount your medical aid doesn't pay, including co-payments and amounts above your benefit limit. We will tell you about expected costs, and quote for hearing aids, before you commit.</p>

    <h2>5. Products, trials and warranties</h2>
    <p>Hearing aids and accessories carry the manufacturer's warranty. The terms of any trial period, returns and repairs are explained, and given to you in writing, before you buy.</p>

    <h2>6. Using this website</h2>
    <ul>
      <li>Don't misuse the site: for example, by sending spam, trying to access the staff portal without permission, or interfering with how the site works.</li>
      <li>The text, logo, photos and design belong to Gehoor in die Moot or its licensors. You may share links and print pages for personal use, but not copy them for commercial use without permission.</li>
      <li>Product names and logos are trademarks of their owners.</li>
    </ul>

    <h2>7. Links to other websites</h2>
    <p>We link to other websites, such as professional bodies and Google Maps, for your convenience. We are not responsible for their content or privacy practices.</p>

    <h2>8. Limitation of liability</h2>
    <p>We work hard to keep this website accurate and available, but we can't guarantee that it will always be error-free or uninterrupted. To the extent the law allows, we aren't liable for any loss that results from using the website or relying on its general information. Nothing in these terms limits your rights under the Consumer Protection Act 68 of 2008 or any other law that cannot be excluded.</p>

    <h2>9. Privacy</h2>
    <p>Our <a href="${e(url('privacy/'))}">privacy policy</a> explains how we handle personal information and cookies.</p>

    <h2>10. Changes and governing law</h2>
    <p>We may update these terms from time to time; the date at the top shows the latest version. These terms are governed by the laws of the Republic of South Africa.</p>

    <h2>11. Questions</h2>
    <p>Contact us on <a href="tel:${e(setting('phone_intl'))}">${e(setting('phone'))}</a> or <a href="mailto:${e(setting('email'))}">${e(setting('email'))}</a>.</p>
  </div>
</section>`);
}

export function notFound() {
  const links = [
    ['services/', 'Services', 'Hearing tests, tinnitus care, ear protection and repairs'],
    ['hearing-aids/', 'Hearing aids', 'Brands, styles and how we choose with you'],
    ['babies-and-children/', 'Babies & children', "Newborn screening and children's hearing tests"],
    ['medical-aid/', 'Medical aid', 'How claims for hearing care work'],
    ['about-us/', 'About us', 'Meet our audiologists'],
    ['newsletters/', 'Newsletters', 'Hearing tips and practice news'],
  ];
  return page({ path: '', useMeta: true, noindex: true, title: 'Page not found | Gehoor in die Moot', description: 'This page could not be found.' }, '', `<section class="section page-hero">
  <div class="wrap narrow center">
    <p class="eyebrow">Error 404</p>
    <h1>Sorry, we couldn't find that page</h1>
    <p class="lead" style="margin:0 auto 24px">It may have moved when we updated our website. One of these pages should help.</p>
    <div class="cta-actions" style="justify-content:center">
      <a class="btn btn-primary btn-lg" href="${e(url('contact/#form'))}">Make an appointment</a>
      <span class="cta-alt">or go to the <a href="${e(url())}">homepage</a></span>
    </div>
  </div>
</section>
<section class="section" style="padding-top:0" aria-labelledby="popular-h">
  <div class="wrap">
    <h2 id="popular-h" class="center">Popular pages</h2>
    <div class="grid">
${links.map(([href, t, d]) => `
      <a class="card" href="${e(url(href))}"><h3>${e(t)}</h3><p>${e(d)}</p><span class="more">Go to page ${icon('arrow', 18)}</span></a>
`).join('')}
    </div>
  </div>
</section>`);
}

const TOPICS = {
  test: 'Hearing test (adult)', child: 'Baby or child hearing test', tinnitus: 'Tinnitus or sound sensitivity',
  aids: 'Hearing aids', repair: 'Hearing aid service or repair', battery: 'Battery Club',
  protect: 'Ear protection or swim plugs', medical: 'Medical aid question', other: 'Something else',
};
export const CONTACT_FIELDS = ['form-name', 'subject', 'name', 'email', 'phone', 'topic', 'practice', 'lang', 'message', 'consent', 'website'];

/** Hidden copy of the form so Netlify Forms detects it at deploy time (written to public/__forms.html). */
export function formsSkeleton() {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Forms</title></head>
<body>
<!-- Netlify Forms reads this file when the site is deployed. The real form is on /contact/. Do not delete. -->
<form name="contact" data-netlify="true" netlify-honeypot="website" hidden>
  <input type="hidden" name="form-name" value="contact">
  <input name="subject"><input name="name"><input name="email"><input name="phone">
  <input name="topic"><input name="practice"><input name="lang"><textarea name="message"></textarea>
  <input name="consent"><input name="website">
</form>
</body></html>
`;
}

export function contact(params = new URLSearchParams()) {
  const wa = whatsapp_link();
  let topic = params.get('topic') || params.get('subject') || 'test';
  if (!TOPICS[topic]) topic = 'test';
  const body = `<section class="page-hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span aria-hidden="true">›</span> <a href="/contact/" aria-current="page">Contact</a></nav>
    <p class="eyebrow">Kontak · Contact</p>
    <h1>Contact our friendly team</h1>
    <p class="lead">Send us a message and we'll get back to you within one working day to arrange your appointment. Or call us, we're happy to help.</p>
    <ul class="contact-methods">
      <li>${icon('phone', 20)} <a href="tel:${e(setting('phone_intl'))}" data-track="phone_click">${e(setting('phone'))}</a></li>
      <li>${icon('mail', 20)} <a href="mailto:${e(setting('email'))}" data-track="email_click">${e(setting('email'))}</a></li>
${wa ? `      <li>${icon('whatsapp', 20)} <a href="${e(wa)}" data-track="whatsapp_click">WhatsApp us</a></li>\n` : ''}    </ul>
  </div>
</section>

<section class="section" id="form" style="padding-top:32px">
  <div class="wrap split" style="align-items:flex-start">
    <div class="split-text" style="flex-basis:560px">
      <div class="panel" style="background:var(--bg);border:1px solid var(--line);box-shadow:var(--shadow)">
        <h2>Send us a message</h2>
        <div class="form-status" role="status" aria-live="polite"></div>
        <form class="form" id="contact-form" name="contact" method="post" action="/__forms.html" novalidate data-validate data-netlify-ajax netlify-honeypot="website">
          <input type="hidden" name="form-name" value="contact">
          <input type="hidden" name="subject" value="Website enquiry">
          <div class="hp" aria-hidden="true"><label for="website">Leave this empty</label><input type="text" id="website" name="website" tabindex="-1" autocomplete="off"></div>
          <div class="field"><label for="name">Full name</label><input type="text" id="name" name="name" autocomplete="name" required minlength="2" maxlength="100" data-msg="Please enter your name."></div>
          <div class="field"><label for="email">Email address</label><input type="email" id="email" name="email" autocomplete="email" required maxlength="150" data-msg="Please enter a valid email address, like name@example.com."></div>
          <div class="field"><label for="phone">Cellphone <span class="muted">(optional)</span></label><input type="tel" id="phone" name="phone" autocomplete="tel" inputmode="tel" pattern="[\\d\\s\\+\\(\\)\\-]{9,20}" maxlength="20" data-msg="Please check your phone number, for example 082 123 4567."></div>
          <div class="field"><label for="topic">What is it about?</label>
            <select id="topic" name="topic">
${Object.entries(TOPICS).map(([k, v]) => `              <option value="${e(v)}"${k === topic ? ' selected' : ''}>${e(v)}</option>`).join('\n')}
            </select></div>
          <div class="field"><label for="practice">Preferred practice</label>
            <select id="practice" name="practice"><option>Either</option><option>Rietfontein</option><option>Les Marais</option></select></div>
          <div class="field"><label for="lang">Preferred language</label>
            <select id="lang" name="lang"><option>Afrikaans</option><option>English</option></select></div>
          <div class="field full"><label for="message">Your message</label><textarea id="message" name="message" required minlength="5" maxlength="5000" data-msg="Please tell us a little about what you need." placeholder="For example: I'd like a hearing test, mornings suit me best."></textarea></div>
          <div class="full"><label class="consent"><input type="checkbox" id="consent" name="consent" value="Yes" required data-msg="Please tick the box so we may use your details to reply."> <span>I agree that Gehoor in die Moot may use these details to reply to me, as set out in the <a href="/privacy/">privacy policy</a>.</span></label></div>
          <div class="full"><button class="btn btn-primary btn-lg" type="submit">Send message</button> <span class="small muted">We reply within one working day.</span></div>
        </form>
      </div>
    </div>
    <div class="split-media" style="flex-basis:340px">
      <div class="panel">
        <h2 style="font-size:1.3rem">Office hours</h2>
        <p style="margin:0">${icon('clock', 18)} ${e(setting('hours'))}</p>
        <p class="muted small" style="margin:8px 0 0">Closed on weekends and public holidays.</p>
      </div>
      <div class="panel navy" style="margin-top:20px">
        <h2 style="font-size:1.3rem">Good to know</h2>
        <p style="margin:0">You don't need a referral. We claim from your medical aid for you. Both practices have secure parking and are wheelchair-friendly.</p>
      </div>
    </div>
  </div>
</section>

<section class="section tint" aria-labelledby="loc-h">
  <div class="wrap">
    <h2 id="loc-h">Our practices</h2>
    <div class="grid-2">
${practices().map((p) => `      <div class="loc">
        ${slot_img(p.image, '', p.name + ' practice entrance', true, '16 / 9').startsWith('<img') ? slot_img(p.image, '', p.name + ' practice entrance', true, '16 / 9') : ''}
        <div class="map-slot" data-map-src="${e(p.embed)}" data-map-title="Map of the ${e(p.name)} practice">
          <p>Google Maps sets its own cookies, so the map loads only with your permission.</p>
          <button type="button" class="btn btn-outline" data-map-load>Show the map</button>
        </div>
        <div class="loc-body">
          <h3>${e(p.name)}</h3>
          <p style="margin:0">${e(p.street)}, ${e(p.area)}, ${e(p.city)}, ${e(p.code)}</p>
          <p class="muted small" style="margin:0">${e(p.note)}</p>
          <a href="${e(p.map)}" target="_blank" rel="noopener"><strong>Open in Google Maps</strong></a>
        </div>
      </div>`).join('\n')}
    </div>
  </div>
</section>`;
  return page({ path: 'contact/', breadcrumbs: [['Contact', 'contact/']] }, 'contact', body);
}

export function newsletterPage(slug) {
  const all = newsletters();
  const idx = all.findIndex((n) => n.slug === slug);
  if (idx < 0) return null;
  const n = all[idx];
  const newer = all[idx - 1];
  const older = all[idx + 1];
  const desc = n.summary || String(n.text || '').replace(/\s+/g, ' ').slice(0, 150) || 'Newsletter from Gehoor in die Moot audiologists, Pretoria.';
  const cover = n.cover ? media(n.cover) : '';
  const meta = {
    useMeta: true, ogType: 'article', path: 'newsletters/' + n.slug,
    title: `${n.title} – Newsletter | Gehoor in die Moot`, description: desc,
    breadcrumbs: [['Newsletters', 'newsletters/'], [n.title, 'newsletters/' + n.slug]],
    schema: [{ '@context': 'https://schema.org', '@type': 'Article', headline: n.title, datePublished: n.date,
      author: { '@type': 'Organization', name: 'Gehoor in die Moot' },
      publisher: { '@type': 'Organization', name: 'Gehoor in die Moot', logo: { '@type': 'ImageObject', url: absUrl('assets/img/logo-full.png') } } }],
  };
  const body = `<section class="nl-head">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> › <a href="/newsletters/">Newsletters</a> › <span aria-current="page">${e(n.title)}</span></nav>
    <div class="nl-head-in">
      <div class="nl-brand">
        <img src="/assets/img/logo-mark-white.png" alt="" width="64" height="81">
        <div>
          <p class="eyebrow" style="color:#B9E38F;margin:0">Nuusbrief · Newsletter · <time datetime="${e(n.date)}">${e(format_date(n.date))}</time></p>
          <h1 style="margin:4px 0 0">${e(n.title)}</h1>
        </div>
      </div>
      ${n.pdf ? `<a class="btn btn-green" href="${e(media(n.pdf))}" download>${icon('download', 18)} Download PDF</a>` : ''}
    </div>
${n.summary ? `    <p style="margin:18px 0 0;max-width:46em;opacity:.92">${e(n.summary)}</p>\n` : ''}  </div>
</section>

<section class="section tint" style="padding-top:40px">
  <div class="wrap">
    <div class="nl-pages">
${(n.pages || []).length ? n.pages.map((p, i) => `      <figure class="nl-page" style="margin:0"><img src="${e(media(p))}" alt="${e(n.title)}, page ${i + 1} of ${n.pages.length}"${i ? ' loading="lazy"' : ''} width="1200" height="1697"></figure>`).join('\n')
    : (n.pdf ? `      <object class="nl-embed" data="${e(media(n.pdf))}" type="application/pdf" aria-label="${e(n.title)}"><p>Your browser can't show the newsletter here. <a href="${e(media(n.pdf))}">Open the PDF</a>.</p></object>` : '')}
${n.text ? `      <details><summary>Read this newsletter as text (easier with a screen reader or larger text)</summary><div class="nl-text">${e(n.text)}</div></details>\n` : ''}      <nav class="pager" aria-label="More newsletters">
        ${older ? `<a class="btn btn-outline" href="/newsletters/${e(older.slug)}">← ${e(older.title)}</a>` : '<span></span>'}
        ${newer ? `<a class="btn btn-outline" href="/newsletters/${e(newer.slug)}">${e(newer.title)} →</a>` : ''}
      </nav>
    </div>
  </div>
</section>
${cta_band()}`;
  if (cover) meta.image = cover; // made absolute in site function
  return page(meta, 'newsletters', body);
}
