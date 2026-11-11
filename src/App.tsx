import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDown, ArrowRight, Award, Check, ChevronLeft, ChevronRight, Compass,
  Camera, Crown, Gamepad2, Globe2, MapPin, Menu, Music2, Play, RotateCcw,
  Sparkles, X, ZoomIn,
} from 'lucide-react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

type SectionId = 'home' | 'discover' | 'tourism' | 'history' | 'people' | 'food' | 'traditions' | 'games' | 'gallery'

const photos = [
  { src: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1400&q=85', alt: 'Piața Unirii din Timișoara', label: 'Timișoara, orașul florilor' },
  { src: 'https://images.unsplash.com/photo-1524498250077-390f9e378fc0?auto=format&fit=crop&w=1200&q=85', alt: 'Peisaj montan din Banat', label: 'Munții Banatului' },
  { src: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=85', alt: 'Stradă europeană', label: 'Moșteniri care se întâlnesc' },
  { src: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=1200&q=85', alt: 'Masă cu mâncare tradițională', label: 'Gustul de acasă' },
  { src: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1200&q=85', alt: 'Arhitectură istorică', label: 'Istorie la fiecare pas' },
  { src: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=85', alt: 'Pădure verde', label: 'Natura, mereu aproape' },
]

const destinations = [
  { name: 'Timișoara', type: 'Oraș european', image: photos[0].src, text: 'Orașul cu trei piețe, patru culturi și o energie care nu stă locului.', tags: ['Piața Unirii', 'Bastionul Theresia'] },
  { name: 'Cheile Nerei', type: 'Parc național', image: photos[1].src, text: 'Ape turcoaz, chei calcaroase și trasee care se țin minte.', tags: ['Ochiul Beiului', 'Cascada Bigăr'] },
  { name: 'Băile Herculane', type: 'Stațiune istorică', image: photos[4].src, text: 'Un oraș balnear cu istorie romană și arhitectură imperială.', tags: ['Valea Cernei', 'Cazinoul'] },
]

const timeline = [
  ['Secolul II', 'Dacia romană', 'Banatul devine un coridor important între Dunăre și inima provinciei Dacia.'],
  ['1552', 'Cetatea Timișoarei', 'Cucerirea otomană schimbă pentru aproape 165 de ani chipul orașului.'],
  ['1716', 'Epoca habsburgică', 'Principele Eugeniu de Savoia cucerește Timișoara; începe modernizarea Banatului.'],
  ['Secolul XVIII', 'Colonizarea șvabilor', 'Se așază comunități germane, sârbești, maghiare și bulgare. Diversitatea devine identitate.'],
  ['1867–1918', 'Modernizare și cultură', 'Timișoara primește tramvai electric, iluminat public și o viață culturală efervescentă.'],
  ['1989', 'Revoluția începe aici', 'Timișoara aprinde scânteia libertății. 20 decembrie devine prima zi de libertate.'],
]

const quiz = [
  { category: 'Istorie', question: 'În ce an a început Revoluția Română la Timișoara?', options: ['1987', '1989', '1990', '1918'], answer: 1, image: photos[0].src },
  { category: 'Geografie', question: 'Unde se află Lacul Ochiul Beiului?', options: ['În Cheile Nerei', 'Pe Semenic', 'Lângă Oravița', 'În Munții Poiana Ruscă'], answer: 0, image: photos[1].src },
  { category: 'Personalități', question: 'Cine este pionierul aviației născut la Binținți?', options: ['Traian Vuia', 'Eftimie Murgu', 'Victor Babeș', 'Francesco Illy'], answer: 0, image: photos[2].src },
  { category: 'Gastronomie', question: 'Ce sunt gomboții cu prune?', options: ['Pâinici sărate', 'Găluște dulci cu prune', 'Un sos picant', 'O supă rece'], answer: 1, image: photos[3].src },
  { category: 'Port popular', question: 'Cum se numește piesa dreptunghiulară purtată peste fustă?', options: ['Opreg', 'Catrință', 'Brâu', 'Năframă'], answer: 0, image: photos[4].src },
  { category: 'Tradiții', question: 'Ce acompaniază de obicei jocul bănățean?', options: ['Taragotul și vioara', 'Cimpoiul scoțian', 'Harpa', 'Pianul'], answer: 0, image: photos[5].src },
  { category: 'Multiculturalitate', question: 'Ce definește cel mai bine Banatul?', options: ['O singură tradiție', 'Întâlnirea mai multor comunități', 'Doar peisajele montane', 'Un singur grai'], answer: 1, image: photos[0].src },
  { category: 'Turism', question: 'Ce oraș este cunoscut pentru morile de apă de la Rudăria?', options: ['Eftimie Murgu', 'Lugoj', 'Jimbolia', 'Reșița'], answer: 0, image: photos[1].src },
]

const mapPlaces = [
  { name: 'Timișoara', coords: [45.7489, 21.2087] as [number, number], text: 'Capitala culturală a Banatului, cu piețe baroce și o istorie multiculturală.', image: photos[0].src },
  { name: 'Băile Herculane', coords: [44.879, 22.412] as [number, number], text: 'Stațiune balneară atestată din epoca romană, în Valea Cernei.', image: photos[4].src },
  { name: 'Cheile Nerei', coords: [44.914, 21.857] as [number, number], text: 'Parc național cu lacuri carstice și trasee spectaculoase.', image: photos[1].src },
  { name: 'Oravița', coords: [45.032, 21.689] as [number, number], text: 'Orașul primei căi ferate montane din România.', image: photos[2].src },
]

const markerIcon = new L.Icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] })

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState<number | null>(null)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [stamps, setStamps] = useState<string[]>(() => JSON.parse(localStorage.getItem('banat-stamps') || '[]'))
  const [quickIndex, setQuickIndex] = useState(0)
  const [quickScore, setQuickScore] = useState(0)
  const [quickAnswer, setQuickAnswer] = useState<number | null>(null)
  const [compare, setCompare] = useState(54)

  useEffect(() => { localStorage.setItem('banat-stamps', JSON.stringify(stamps)) }, [stamps])
  const go = (id: SectionId) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); if (id !== 'home' && !stamps.includes(id)) setStamps((s) => [...s, id]) }
  const currentQuestion = quiz[quizIndex]
  const quickQuestions = [
    ['Care este supranumele Timișoarei?', ['Orașul luminilor', 'Mica Vienă', 'Orașul de aur'], 1],
    ['Ce înseamnă „no” în graiul bănățean?', ['Un salut / interjecție', 'O mâncare', 'Un dans'], 0],
    ['Ce se găsește la Rudăria?', ['Morile de apă', 'Mine de aur', 'Castele'], 0],
    ['Care este un ingredient des întâlnit în papricaș?', ['Boiaua', 'Vanilia', 'Cacao'], 0],
    ['Ce fluviu marchează sudul Banatului?', ['Dunărea', 'Oltul', 'Mureșul'], 0],
  ]

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={() => go('home')} aria-label="Acasă">
          <span className="brand-mark">B</span><span><strong>BANAT</strong><small>povestea locului dintre lumi</small></span>
        </button>
        <nav className={menuOpen ? 'nav-open' : ''}>
          {(['discover', 'tourism', 'history', 'people', 'food', 'traditions', 'games', 'gallery'] as SectionId[]).map((id) => <button key={id} onClick={() => go(id)}>{({ discover: 'Descoperă', tourism: 'Turism', history: 'Istorie', people: 'Oameni', food: 'Gusturi', traditions: 'Tradiții', games: 'Jocuri', gallery: 'Galerie' } as Record<string, string>)[id]}</button>)}
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        <div className="header-progress"><span style={{ width: `${Math.min(100, stamps.length / 8 * 100)}%` }} /></div>
      </header>

      <main>
        <section id="home" className="hero-section">
          <div className="hero-image" />
          <div className="hero-overlay" />
          <div className="ornament ornament-left" /><div className="ornament ornament-right" />
          <motion.div className="hero-content" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}>
            <p className="eyebrow light"><span /> ROMÂNIA DIN CLASĂ ÎN CLASĂ</p>
            <h1>Bine ai venit<br /><em>în Banat!</em></h1>
            <p className="hero-lede">Descoperă locul unde tradiția întâlnește diversitatea.</p>
            <div className="hero-actions"><button className="button button-gold" onClick={() => go('discover')}>Pornește aventura <ArrowRight size={17} /></button><button className="button button-ghost" onClick={() => go('tourism')}>Descoperă regiunea <Compass size={17} /></button></div>
            <div className="hero-note"><span className="line" /> <span>O poveste spusă de oameni, locuri și gusturi</span></div>
          </motion.div>
          <button className="scroll-cue" onClick={() => go('discover')}><span>SCROLL TO EXPLORE</span><ArrowDown size={18} /></button>
          <div className="hero-location"><MapPin size={14} /> 45°45′N · 21°13′E</div>
        </section>

        <section id="discover" className="intro-section section-pad">
          <div className="section-kicker">01 — LOCUL DINTRE LUMI</div>
          <div className="intro-grid"><div><h2>Banatul nu se <em>vizitează.</em><br />Se simte.</h2></div><div><p className="lead-text">La răscruce de imperii, limbi și drumuri, Banatul a învățat să transforme diferențele într-o forță. Aici, o piață poate ascunde trei secole de istorie, iar o masă poate aduna cinci feluri de a spune „acasă”.</p><button className="text-link" onClick={() => go('history')}>Citește povestea noastră <ArrowRight size={16} /></button></div></div>
          <div className="stat-row"><div><strong>4+</strong><span>comunități istorice<br />care trăiesc împreună</span></div><div><strong>3</strong><span>piețe emblematice<br />în inima Timișoarei</span></div><div><strong>1989</strong><span>anul în care libertatea<br />a început aici</span></div><div className="stamp-card"><Award size={22} /><span>PAȘAPORTUL TĂU</span><strong>{stamps.length}/8 ștampile</strong></div></div>
        </section>

        <section id="tourism" className="dark-section section-pad">
          <div className="section-heading"><div><div className="section-kicker gold">02 — DRUMURI ȘI DESTINAȚII</div><h2>Frumuseți care<br /><em>nu încap într-o hartă.</em></h2></div><button className="round-button" onClick={() => go('gallery')}><ArrowRight /></button></div>
          <div className="destination-grid">{destinations.map((d, i) => <motion.article className={`destination-card ${i === 1 ? 'featured' : ''}`} key={d.name} whileHover={{ y: -7 }}><img src={d.image} alt={d.name} /><div className="card-shade" /><div className="destination-copy"><span>{d.type}</span><h3>{d.name}</h3><p>{d.text}</p><div className="tag-row">{d.tags.map(t => <small key={t}>{t}</small>)}</div></div><span className="card-number">0{i + 1}</span></motion.article>)}</div>
          <div className="map-wrapper"><div className="map-intro"><div className="section-kicker gold">HARTA VIE A BANATULUI</div><h3>Unde vrei să<br /><em>ajungi astăzi?</em></h3><p>Alege un punct de pe hartă și lasă-te purtat de povestea lui.</p></div><MapContainer center={[45.2, 21.55]} zoom={7} scrollWheelZoom={false} className="map"><TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />{mapPlaces.map(p => <Marker key={p.name} position={p.coords} icon={markerIcon}><Popup><img src={p.image} alt="" /><strong>{p.name}</strong><p>{p.text}</p></Popup></Marker>)}</MapContainer></div>
        </section>

        <section id="history" className="history-section section-pad"><div className="section-kicker">03 — TIMPUL CARE A RĂMAS</div><div className="history-head"><h2>O istorie cu<br /><em>multe voci.</em></h2><p>Banatul nu are o singură poveste. Are straturi. Fiecare epocă a lăsat ceva în urmă — o clădire, un cuvânt, un gust.</p></div><div className="timeline">{timeline.map(([date, title, text], i) => <motion.div className={`timeline-item ${i === 5 ? 'active' : ''}`} key={date} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}><div className="timeline-date">{date}</div><div className="timeline-dot" /><div className="timeline-content"><h3>{title}</h3><p>{text}</p></div></motion.div>)}</div></section>

        <section id="people" className="people-section section-pad"><div className="split-image"><img src={photos[2].src} alt="Arhitectură europeană" /><div className="image-caption">Timișoara · un oraș deschis către lume</div></div><div className="people-copy"><div className="section-kicker">04 — OAMENI CU IDEI MARI</div><h2>Banatul se<br /><em>inventează mereu.</em></h2><p>De la primul avion cu motor al lui Traian Vuia la gustul inconfundabil al cafelei Illy, oamenii locului au dus curiozitatea mai departe.</p><div className="person-list"><div><strong>Traian Vuia</strong><span>Pionier al aviației · Binținți</span></div><div><strong>Johnny Weissmuller</strong><span>Campion olimpic · Timișoara</span></div><div><strong>Francesco Illy</strong><span>Fondatorul unei culturi a cafelei</span></div></div><button className="text-link" onClick={() => go('games')}>Întâlnește-i în joc <Gamepad2 size={16} /></button></div></section>

        <section id="food" className="food-section section-pad"><div className="section-kicker gold">05 — GUSTUL DE ACASĂ</div><div className="food-head"><h2>Rețete care<br /><em>spun povești.</em></h2><p>În Banat, masa e locul unde diferențele se așază una lângă alta și devin sărbătoare.</p></div><div className="food-cards"><div className="food-feature"><img src={photos[3].src} alt="Mâncare tradițională" /><div><span>REȚETA BUNICII</span><h3>Gomboți<br />cu prune</h3><p>Moi, aurii, pudrați cu pesmet și amintiri.</p></div></div><div className="food-list">{['Papricaș cu găluște', 'Pogăcele cu jumări', 'Plăcintă bănățeană'].map((x, i) => <div key={x}><span>0{i + 1}</span><div><h3>{x}</h3><p>{['Un fel de mâncare ce poartă amprenta bucătăriei șvăbești.', 'Gustul sărat al sărbătorilor și al meselor lungi.', 'Foi subțiri, umpluturi generoase și multă răbdare.'][i]}</p></div><ArrowRight size={18} /></div>)}</div></div></section>

        <section id="traditions" className="traditions-section section-pad"><div className="tradition-copy"><div className="section-kicker">06 — CE SE DĂ MAI DEPARTE</div><h2>Tradiția nu<br /><em>stă pe loc.</em></h2><p>Se mută din curte în curte, din cântec în cântec, dintr-o generație în alta. Și se schimbă puțin, ca să rămână vie.</p><div className="guide"><div className="guide-avatar">BB</div><div><strong>Bădia Banat</strong><p>„No, hai să-ți arăt ce comori avem pe-aici!”</p></div></div></div><div className="tradition-art"><div className="embroidered-circle">✦<span>✦</span></div><div className="tradition-note"><Music2 size={18} /><strong>Jocul bănățean</strong><span>ritm, comunitate, bucurie</span></div></div></section>

        <section id="games" className="games-section section-pad"><div className="section-heading"><div><div className="section-kicker">07 — ÎNVAȚĂ JUCÂNDU-TE</div><h2>Comoara<br /><em>Banatului.</em></h2></div><div className="game-progress"><span>{quizIndex < 8 ? `Misiunea ${quizIndex + 1} din 8` : 'Misiune completă'}</span><div><i style={{ width: `${quizIndex / 8 * 100}%` }} /></div></div></div><div className="quiz-card">{quizIndex < 8 ? <><div className="quiz-photo"><img src={currentQuestion.image} alt="" /><span>{currentQuestion.category}</span><div className="mission-number">0{quizIndex + 1}</div></div><div className="quiz-body"><p className="eyebrow">MISIUNEA EXPLORATORULUI</p><h3>{currentQuestion.question}</h3><div className="answers">{currentQuestion.options.map((option, i) => <button key={option} className={selectedAnswer === i ? (i === currentQuestion.answer ? 'correct' : 'wrong') : ''} disabled={selectedAnswer !== null} onClick={() => { setSelectedAnswer(i); if (i === currentQuestion.answer) setQuizScore(s => s + 1) }}>{option}{selectedAnswer !== null && i === currentQuestion.answer && <Check size={17} />}</button>)}</div>{selectedAnswer !== null && <div className="quiz-next"><span>{selectedAnswer === currentQuestion.answer ? 'Exact! Ai găsit o nouă piesă din poveste.' : `Răspunsul corect era: ${currentQuestion.options[currentQuestion.answer]}`}</span><button className="button button-dark" onClick={() => { setQuizIndex(i => i + 1); setSelectedAnswer(null) }}>{quizIndex === 7 ? 'Vezi rezultatul' : 'Misiunea următoare'} <ArrowRight size={16} /></button></div>}</div></> : <div className="quiz-result"><Award size={42} /><p className="eyebrow">FELICITĂRI, EXPLORATORULE</p><h3>{quizScore}/8 răspunsuri corecte</h3><p>Ai descoperit Banatul pas cu pas. Certificatul tău simbolic este gata!</p><div className="certificate"><Crown size={24} /><strong>EXPLORATOR AL BANATULUI</strong><small>ROMÂNIA DIN CLASĂ ÎN CLASĂ · 2026</small></div><button className="button button-dark" onClick={() => { setQuizIndex(0); setQuizScore(0); setSelectedAnswer(null) }}><RotateCcw size={16} /> Reia aventura</button></div>}</div>
          <div className="mini-games"><div><Sparkles size={20} /><strong>Vorbește bănățeană!</strong><p>Potrivește graiul locului cu sensul lui.</p><button onClick={() => alert('No, înseamnă un salut prietenos și un fel de a spune „hai să povestim”!')}>Joacă acum <ArrowRight size={15} /></button></div><div><Globe2 size={20} /><strong>Banat în 60 de secunde</strong><p>Cinci întrebări. Un minut. Cât de departe ajungi?</p><button onClick={() => { setQuickIndex(0); setQuickScore(0); setQuickAnswer(null); document.getElementById('quick-quiz')?.scrollIntoView({ behavior: 'smooth' }) }}>Pornește cronometrul <Play size={15} /></button></div></div>
        </section>

        <section id="quick-quiz" className="quick-section section-pad"><div className="quick-inner"><div><div className="section-kicker gold">MINI-JOC · BANAT ÎN 60 DE SECUNDE</div><h2>Testează-ți<br /><em>instinctul bănățean.</em></h2></div><div className="quick-box">{quickIndex < 5 ? <><span className="timer">0:{60 - quickIndex * 11}</span><p>{quickQuestions[quickIndex][0] as string}</p><div className="quick-options">{(quickQuestions[quickIndex][1] as string[]).map((a, i) => <button key={a} className={quickAnswer === i ? (i === quickQuestions[quickIndex][2] ? 'correct' : 'wrong') : ''} disabled={quickAnswer !== null} onClick={() => { setQuickAnswer(i); if (i === quickQuestions[quickIndex][2]) setQuickScore(s => s + 1) }}>{a}</button>)}</div>{quickAnswer !== null && <button className="button button-gold small" onClick={() => { setQuickIndex(i => i + 1); setQuickAnswer(null) }}>Următoarea <ArrowRight size={15} /></button>}</> : <><Award size={30} /><h3>Scor: {quickScore}/5</h3><button className="button button-gold small" onClick={() => { setQuickIndex(0); setQuickScore(0); setQuickAnswer(null) }}>Joacă din nou</button></>}</div></div></section>

        <section id="gallery" className="gallery-section section-pad"><div className="section-heading"><div><div className="section-kicker">08 — PRIVELIȘTI DE PĂSTRAT</div><h2>Banatul,<br /><em>într-o mie de cadre.</em></h2></div><button className="text-link" onClick={() => setGalleryOpen(0)}>Vezi fullscreen <ZoomIn size={16} /></button></div><div className="gallery-grid">{photos.map((p, i) => <button key={p.src} className={`gallery-tile tile-${i}`} onClick={() => setGalleryOpen(i)}><img src={p.src} alt={p.alt} /><span>{p.label}</span></button>)}</div><div className="then-now"><div className="then-now-copy"><div className="section-kicker gold">TRECUTUL ÎN PREZENT</div><h2>Timișoara<br /><em>atunci și acum.</em></h2><p>Un oraș se schimbă. O atmosferă rămâne. Trage de linie și privește două timpuri deodată.</p></div><div className="compare"><img src={photos[4].src} alt="Timișoara atunci" /><div className="compare-after" style={{ width: `${compare}%` }}><img src={photos[0].src} alt="Timișoara acum" /></div><input type="range" min="10" max="90" value={compare} onChange={(e) => setCompare(Number(e.target.value))} /><div className="compare-label left">ATUNCI</div><div className="compare-label right">ACUM</div></div></div></section>
      </main>

      <footer><div className="footer-brand"><span className="brand-mark">B</span><div><strong>BANAT</strong><small>POVESTEA LOCULUI DINTRE LUMI</small></div></div><p>Un proiect educațional pentru „România din clasă în clasă”.<br />Făcut cu respect pentru loc, oameni și povești.</p><div className="footer-actions"><button onClick={() => go('home')}>Înapoi la început <ArrowUpIcon /></button><Camera size={18} /></div></footer>
      <AnimatePresence>{galleryOpen !== null && <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button className="lightbox-close" onClick={() => setGalleryOpen(null)}><X /></button><button className="lightbox-arrow prev" onClick={() => setGalleryOpen((galleryOpen + photos.length - 1) % photos.length)}><ChevronLeft /></button><img src={photos[galleryOpen].src} alt={photos[galleryOpen].alt} /><button className="lightbox-arrow next" onClick={() => setGalleryOpen((galleryOpen + 1) % photos.length)}><ChevronRight /></button><p>{photos[galleryOpen].label}</p></motion.div>}</AnimatePresence>
    </div>
  )
}

function ArrowUpIcon() { return <ArrowDown size={16} style={{ transform: 'rotate(180deg)' }} /> }

export default App
