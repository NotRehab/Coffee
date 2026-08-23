import { type FormEvent, useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  Coffee,
  Minus,
  Plus,
  X,
} from 'lucide-react';

type DaybreakRoast = {
  id: string;
  code: string;
  name: string;
  origin: string;
  process: string;
  notes: string;
  detail: string;
  price: number;
  color: string;
  mood: string;
};

type DaybreakBasketLine = DaybreakRoast & { quantity: number };

const daybreakRoasts: DaybreakRoast[] = [
  {
    id: 'pissente',
    code: 'R.01',
    name: 'Pissente Pour Over',
    origin: 'Colombia / washed',
    process: 'light roast',
    notes: 'citrus · cacao · walnut',
    detail: 'A bright, clean cup with a soft walnut finish. The one to brew before the city gets loud.',
    price: 28,
    color: '#b7d3cc',
    mood: 'clear',
  },
  {
    id: 'second-bloom',
    code: 'R.02',
    name: 'Second Bloom',
    origin: 'Ethiopia / natural',
    process: 'light roast',
    notes: 'plum · tea · sandalwood',
    detail: 'A floral, patient cup for the unhurried hour between waking and beginning.',
    price: 30,
    color: '#d9c8a4',
    mood: 'slow',
  },
  {
    id: 'after-rain',
    code: 'R.03',
    name: 'After Rain',
    origin: 'Brazil / pulped natural',
    process: 'medium-light',
    notes: 'fig · molasses · cedar',
    detail: 'Round and low-toned, with a finish that stays close. Keep it beside an open book.',
    price: 29,
    color: '#c9b7b4',
    mood: 'grounded',
  },
];

const daybreakRoutes = [
  { id: 'clear', label: 'I need a clear hour', short: 'clear' },
  { id: 'slow', label: 'I can take my time', short: 'slow' },
  { id: 'grounded', label: 'Keep me grounded', short: 'grounded' },
];

export function NotrehabCoffeeDaybreakIndex() {
  const [selectedMood, setSelectedMood] = useState('clear');
  const [basket, setBasket] = useState<DaybreakBasketLine[]>([]);
  const [basketOpen, setBasketOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const activeRoast = daybreakRoasts.find((roast) => roast.mood === selectedMood) ?? daybreakRoasts[0];
  const quantity = basket.reduce((sum, line) => sum + line.quantity, 0);
  const total = basket.reduce((sum, line) => sum + line.quantity * line.price, 0);
  const basketSummary = useMemo(
    () => (quantity === 0 ? 'your bag is quiet' : `${quantity} ${quantity === 1 ? 'object' : 'objects'} selected`),
    [quantity],
  );

  const addToBasket = (roast: DaybreakRoast) => {
    setBasket((current) => {
      const existing = current.find((line) => line.id === roast.id);
      if (existing) {
        return current.map((line) =>
          line.id === roast.id ? { ...line, quantity: line.quantity + 1 } : line,
        );
      }
      return [...current, { ...roast, quantity: 1 }];
    });
    setMessage(`${roast.code} placed in your bag`);
  };

  const adjustBasket = (id: string, delta: number) => {
    setBasket((current) =>
      current.flatMap((line) => {
        if (line.id !== id) return [line];
        const nextQuantity = line.quantity + delta;
        return nextQuantity > 0 ? [{ ...line, quantity: nextQuantity }] : [];
      }),
    );
  };

  const submitDispatch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <div className="ncd-shell">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .ncd-shell {
              --ncd-canvas: #f6f3eb;
              --ncd-paper: #fbfaf5;
              --ncd-paper-deep: #ebe7dc;
              --ncd-ink: #172a32;
              --ncd-muted: #718087;
              --ncd-line: rgba(23, 42, 50, .2);
              --ncd-line-soft: rgba(23, 42, 50, .11);
              --ncd-blue: #2365a6;
              --ncd-coral: #d16f5e;
              --ncd-sea: #dcece7;
              --ncd-night: #183a4a;
              position: relative;
              min-height: 100dvh;
              overflow: hidden;
              color: var(--ncd-ink);
              background: var(--ncd-canvas);
              font-family: 'DM Sans', sans-serif;
            }
            .ncd-shell *, .ncd-shell *::before, .ncd-shell *::after { box-sizing: border-box; }
            .ncd-shell::after {
              content: '';
              position: fixed;
              inset: 0;
              z-index: 30;
              pointer-events: none;
              opacity: .025;
              mix-blend-mode: multiply;
              background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='.45'/%3E%3C/svg%3E");
            }
            .ncd-shell button, .ncd-shell input { font: inherit; }
            .ncd-shell button { cursor: pointer; }
            .ncd-shell button:focus-visible, .ncd-shell input:focus-visible { outline: 2px solid var(--ncd-blue); outline-offset: 4px; }
            .ncd-mono, .ncd-eyebrow { font-family: 'Space Mono', monospace; }
            .ncd-eyebrow {
              color: var(--ncd-muted);
              font-size: 10px;
              letter-spacing: .13em;
              line-height: 1.35;
              text-transform: uppercase;
            }
            .ncd-header {
              min-height: 78px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 clamp(18px, 4vw, 62px);
              border-bottom: 1px solid var(--ncd-line);
              background: rgba(251, 250, 245, .74);
            }
            .ncd-brand {
              display: flex;
              align-items: center;
              gap: 11px;
              padding: 0;
              border: 0;
              color: var(--ncd-ink);
              background: transparent;
              text-align: left;
            }
            .ncd-brand-mark {
              width: 21px;
              height: 21px;
              display: grid;
              place-items: center;
              color: var(--ncd-paper);
              background: var(--ncd-blue);
              border-radius: 50%;
              font-size: 11px;
              font-weight: 900;
            }
            .ncd-brand-name {
              font-size: 13px;
              font-weight: 900;
              letter-spacing: -.055em;
              text-transform: uppercase;
            }
            .ncd-brand-caption {
              padding-left: 12px;
              border-left: 1px solid var(--ncd-line);
              color: var(--ncd-muted);
              font-size: 8px;
              letter-spacing: .11em;
              text-transform: uppercase;
            }
            .ncd-header-right { display: flex; align-items: center; gap: clamp(15px, 3.2vw, 45px); }
            .ncd-header-link, .ncd-bag-toggle {
              padding: 6px 0;
              border: 0;
              border-bottom: 1px solid transparent;
              color: var(--ncd-ink);
              background: transparent;
              font-family: 'Space Mono', monospace;
              font-size: 10px;
              letter-spacing: .1em;
              text-transform: uppercase;
            }
            .ncd-header-link:hover, .ncd-bag-toggle:hover { color: var(--ncd-blue); border-color: var(--ncd-blue); }
            .ncd-bag-toggle { display: flex; align-items: center; gap: 10px; }
            .ncd-bag-count {
              min-width: 20px;
              height: 20px;
              display: grid;
              place-items: center;
              border: 1px solid currentColor;
              border-radius: 50%;
              font-size: 9px;
            }
            .ncd-workbench {
              display: grid;
              grid-template-columns: minmax(260px, .72fr) minmax(460px, 1.45fr) minmax(220px, .62fr);
              min-height: 645px;
              border-bottom: 1px solid var(--ncd-ink);
            }
            .ncd-intro {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              min-width: 0;
              padding: clamp(28px, 4.5vw, 67px) clamp(21px, 3.4vw, 53px) 32px;
              border-right: 1px solid var(--ncd-line);
              background: var(--ncd-paper);
            }
            .ncd-index { display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid var(--ncd-line); }
            .ncd-index strong { color: var(--ncd-blue); font-weight: 400; }
            .ncd-intro h1 {
              max-width: 320px;
              margin: auto 0 17px;
              color: var(--ncd-ink);
              font-family: 'Instrument Serif', Georgia, serif;
              font-size: clamp(4rem, 6.2vw, 7.2rem);
              font-weight: 400;
              letter-spacing: -.075em;
              line-height: .77;
            }
            .ncd-intro h1 em { color: var(--ncd-coral); }
            .ncd-intro-copy { max-width: 260px; margin: 0 0 20px; color: var(--ncd-muted); font-size: 12px; line-height: 1.62; }
            .ncd-intro-foot { display: flex; align-items: flex-end; justify-content: space-between; gap: 15px; }
            .ncd-coordinate { color: var(--ncd-muted); font-size: 8px; letter-spacing: .1em; line-height: 1.6; text-transform: uppercase; }
            .ncd-arrow-mark { color: var(--ncd-blue); }
            .ncd-selector {
              position: relative;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              min-width: 0;
              padding: clamp(22px, 4vw, 56px) clamp(21px, 4.2vw, 69px) 31px;
              overflow: hidden;
              color: var(--ncd-ink);
              background: var(--ncd-sea);
            }
            .ncd-selector::before {
              content: 'NOT / DAYBREAK 01';
              position: absolute;
              top: 24px;
              right: 25px;
              color: rgba(23, 42, 50, .4);
              font-family: 'Space Mono', monospace;
              font-size: 9px;
              letter-spacing: .14em;
              writing-mode: vertical-rl;
            }
            .ncd-selector::after {
              content: '';
              position: absolute;
              right: -90px;
              bottom: -125px;
              width: 250px;
              height: 250px;
              border: 1px solid rgba(35, 101, 166, .25);
              border-radius: 50%;
              box-shadow: 0 0 0 22px rgba(35, 101, 166, .06), 0 0 0 44px rgba(35, 101, 166, .045);
            }
            .ncd-selector-top { display: flex; align-items: center; justify-content: space-between; gap: 15px; }
            .ncd-selector-top .ncd-eyebrow { color: rgba(23, 42, 50, .62); }
            .ncd-selector h2 {
              max-width: 410px;
              margin: 17px 0 10px;
              color: var(--ncd-ink);
              font-family: 'Instrument Serif', Georgia, serif;
              font-size: clamp(2.6rem, 4.5vw, 5.2rem);
              font-weight: 400;
              letter-spacing: -.08em;
              line-height: .78;
            }
            .ncd-selector h2 span { color: var(--ncd-blue); font-style: italic; }
            .ncd-selector-note { max-width: 300px; margin: 0; color: rgba(23, 42, 50, .68); font-size: 12px; line-height: 1.58; }
            .ncd-choice-list { position: relative; z-index: 1; margin: 35px 0 auto; border-top: 1px solid rgba(23, 42, 50, .38); }
            .ncd-choice {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 15px;
              padding: 15px 0 14px;
              border: 0;
              border-bottom: 1px solid rgba(23, 42, 50, .22);
              color: rgba(23, 42, 50, .6);
              background: transparent;
              text-align: left;
              transition: color 180ms ease, padding 180ms ease;
            }
            .ncd-choice:hover, .ncd-choice.is-active { padding-left: 10px; color: var(--ncd-ink); }
            .ncd-choice.is-active { color: var(--ncd-blue); }
            .ncd-choice-label { display: flex; align-items: baseline; gap: 12px; }
            .ncd-choice-number { font-family: 'Space Mono', monospace; font-size: 9px; }
            .ncd-choice-text { font-size: 13px; font-weight: 500; letter-spacing: -.02em; }
            .ncd-choice svg { opacity: 0; transition: opacity 180ms ease, transform 180ms ease; }
            .ncd-choice.is-active svg, .ncd-choice:hover svg { opacity: 1; transform: translateX(2px); }
            .ncd-selector-foot { position: relative; z-index: 1; display: flex; justify-content: space-between; gap: 20px; padding-top: 23px; color: rgba(23, 42, 50, .54); font-size: 9px; line-height: 1.55; }
            .ncd-selector-foot strong { color: var(--ncd-blue); font-weight: 400; }
            .ncd-product-panel {
              min-width: 0;
              display: flex;
              flex-direction: column;
              padding: clamp(22px, 4vw, 56px) clamp(20px, 3vw, 43px) 30px;
              background: var(--ncd-paper);
            }
            .ncd-product-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--ncd-line); }
            .ncd-product-head .ncd-eyebrow { color: var(--ncd-blue); }
            .ncd-product-head-code { color: var(--ncd-muted); font-family: 'Space Mono', monospace; font-size: 10px; }
            .ncd-product-art {
              position: relative;
              flex: 1;
              min-height: 300px;
              display: grid;
              place-items: center;
              overflow: hidden;
              margin: 16px 0 21px;
              border: 1px solid var(--ncd-ink);
              background: #b7d3cc;
            }
            .ncd-product-art::before {
              content: 'NOT';
              position: absolute;
              color: rgba(23, 42, 50, .08);
              font-family: 'Instrument Serif', Georgia, serif;
              font-size: clamp(8rem, 17vw, 14rem);
              font-style: italic;
              letter-spacing: -.14em;
              transform: rotate(-14deg);
            }
            .ncd-art-crosshair { position: absolute; inset: 16px; border: 1px solid rgba(23, 42, 50, .22); }
            .ncd-art-crosshair::before, .ncd-art-crosshair::after { content: ''; position: absolute; background: rgba(23, 42, 50, .17); }
            .ncd-art-crosshair::before { top: 50%; left: 0; width: 100%; height: 1px; }
            .ncd-art-crosshair::after { top: 0; left: 50%; width: 1px; height: 100%; }
            .ncd-bag-art {
              position: relative;
              z-index: 1;
              width: clamp(140px, 24%, 205px);
              aspect-ratio: .68;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #f4efe4;
              border: 1px solid rgba(23, 42, 50, .28);
              border-radius: 4px 4px 12px 12px;
              box-shadow: 14px 19px 25px rgba(23, 42, 50, .14);
              transform: rotate(3deg);
              transition: transform 280ms ease;
            }
            .ncd-product-art:hover .ncd-bag-art { transform: rotate(-2deg) translateY(-7px); }
            .ncd-bag-art::before { content: ''; position: absolute; inset: 0 0 auto; height: 9%; border-bottom: 1px solid rgba(23, 42, 50, .22); background: repeating-linear-gradient(90deg, rgba(23, 42, 50, .13) 0 2px, transparent 2px 6px); }
            .ncd-bag-label { width: 71%; height: 60%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; border: 1px solid var(--ncd-ink); text-align: center; }
            .ncd-bag-label strong { font-size: 9px; font-weight: 900; letter-spacing: .04em; text-transform: uppercase; }
            .ncd-bag-label span { max-width: 95%; color: var(--ncd-blue); font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(1.25rem, 2.6vw, 2.3rem); font-style: italic; line-height: .78; }
            .ncd-bag-label small { max-width: 80%; color: var(--ncd-muted); font-family: 'Space Mono', monospace; font-size: 7px; line-height: 1.35; text-transform: uppercase; }
            .ncd-art-label { position: absolute; color: rgba(23, 42, 50, .66); font-family: 'Space Mono', monospace; font-size: 8px; letter-spacing: .08em; text-transform: uppercase; }
            .ncd-art-label.top { top: 25px; left: 27px; }
            .ncd-art-label.bottom { right: 27px; bottom: 25px; }
            .ncd-product-info { display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; }
            .ncd-product-info h3 { margin: 0 0 6px; font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(1.55rem, 2.25vw, 2.2rem); font-weight: 400; letter-spacing: -.055em; line-height: .86; }
            .ncd-product-info p { margin: 0; color: var(--ncd-muted); font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: .03em; text-transform: lowercase; }
            .ncd-product-price { font-family: 'Space Mono', monospace; font-size: 11px; white-space: nowrap; }
            .ncd-product-actions { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-top: 17px; }
            .ncd-detail-button, .ncd-add-button {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 8px 0;
              border: 0;
              border-bottom: 1px solid var(--ncd-blue);
              color: var(--ncd-ink);
              background: transparent;
              font-family: 'Space Mono', monospace;
              font-size: 9px;
              letter-spacing: .06em;
              text-transform: uppercase;
              transition: color 180ms ease, gap 180ms ease;
            }
            .ncd-detail-button:hover { gap: 13px; color: var(--ncd-blue); }
            .ncd-add-button { padding: 11px 13px; border: 1px solid var(--ncd-blue); color: var(--ncd-paper); background: var(--ncd-blue); }
            .ncd-add-button:hover { border-color: var(--ncd-coral); background: var(--ncd-coral); }
            .ncd-product-detail { max-width: 390px; margin: 15px 0 0; padding: 12px 0 2px; border-top: 1px solid var(--ncd-line); color: var(--ncd-muted); font-size: 11px; line-height: 1.55; animation: ncd-fade-in 220ms ease both; }
            @keyframes ncd-fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            .ncd-summary-band { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; border-bottom: 1px solid var(--ncd-ink); background: var(--ncd-ink); }
            .ncd-summary-cell { min-height: 144px; display: flex; flex-direction: column; justify-content: space-between; padding: 21px clamp(20px, 4vw, 62px); background: var(--ncd-paper); }
            .ncd-summary-cell.dark { background: var(--ncd-blue); color: var(--ncd-paper); }
            .ncd-summary-cell.dark .ncd-eyebrow { color: rgba(251, 250, 245, .72); }
            .ncd-summary-title { max-width: 320px; margin: 0; color: var(--ncd-ink); font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(1.8rem, 3.1vw, 3.15rem); font-weight: 400; letter-spacing: -.065em; line-height: .84; }
            .ncd-summary-cell.dark .ncd-summary-title { color: var(--ncd-paper); }
            .ncd-summary-detail { max-width: 360px; margin: 0; color: var(--ncd-muted); font-size: 11px; line-height: 1.45; }
            .ncd-summary-cell.dark .ncd-summary-detail { color: rgba(251, 250, 245, .72); }
            .ncd-notes { padding: 36px clamp(20px, 4vw, 62px) 55px; border-bottom: 1px solid var(--ncd-line); background: var(--ncd-canvas); }
            .ncd-notes-head { display: flex; align-items: center; justify-content: space-between; gap: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--ncd-ink); }
            .ncd-notes-head h2 { margin: 0; color: var(--ncd-ink); font-family: 'Instrument Serif', Georgia, serif; font-size: 27px; font-weight: 400; letter-spacing: -.06em; }
            .ncd-notes-head button { display: inline-flex; align-items: center; gap: 8px; padding: 6px 0; border: 0; color: var(--ncd-blue); background: transparent; font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: .08em; text-transform: uppercase; }
            .ncd-note-grid { display: grid; grid-template-columns: 1.4fr .8fr .8fr; gap: 1px; margin-top: 1px; background: var(--ncd-ink); }
            .ncd-note-card { min-height: 195px; display: flex; flex-direction: column; justify-content: space-between; padding: 17px; background: var(--ncd-paper); transition: background 180ms ease; }
            .ncd-note-card:hover { background: var(--ncd-sea); }
            .ncd-note-card:first-child { min-height: 245px; background: var(--ncd-night); color: var(--ncd-paper); }
            .ncd-note-tag { color: var(--ncd-coral); font-family: 'Space Mono', monospace; font-size: 8px; letter-spacing: .1em; text-transform: uppercase; }
            .ncd-note-card h3 { max-width: 320px; margin: 0; color: var(--ncd-ink); font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(1.7rem, 3vw, 2.9rem); font-weight: 400; letter-spacing: -.07em; line-height: .82; }
            .ncd-note-card:first-child h3 { color: var(--ncd-paper); }
            .ncd-note-card p { max-width: 230px; margin: 0; color: var(--ncd-muted); font-size: 11px; line-height: 1.5; }
            .ncd-note-card:first-child p { color: rgba(251, 250, 245, .67); }
            .ncd-dispatch { display: grid; grid-template-columns: 1fr 1fr; gap: 35px; padding: 55px clamp(20px, 4vw, 62px) 67px; border-bottom: 1px solid var(--ncd-ink); background: var(--ncd-paper); }
            .ncd-dispatch h2 { margin: 0; color: var(--ncd-ink); font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(4.3rem, 9vw, 9rem); font-weight: 400; letter-spacing: -.08em; line-height: .74; }
            .ncd-dispatch h2 em { color: var(--ncd-coral); }
            .ncd-dispatch-copy { align-self: end; max-width: 370px; }
            .ncd-dispatch-copy p { margin: 0 0 17px; color: var(--ncd-muted); font-size: 12px; line-height: 1.65; }
            .ncd-email-form { display: flex; max-width: 380px; border-bottom: 1px solid var(--ncd-ink); }
            .ncd-email-form input { flex: 1; min-width: 0; padding: 11px 0; border: 0; outline: 0; color: var(--ncd-ink); background: transparent; font-family: 'Space Mono', monospace; font-size: 10px; }
            .ncd-email-form input::placeholder { color: var(--ncd-muted); }
            .ncd-email-form button { padding: 11px 0 11px 15px; border: 0; color: var(--ncd-blue); background: transparent; font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: .08em; text-transform: uppercase; }
            .ncd-success { display: inline-flex; align-items: center; gap: 9px; color: var(--ncd-blue); font-family: 'Space Mono', monospace; font-size: 10px; text-transform: uppercase; }
            .ncd-footer { display: flex; justify-content: space-between; gap: 15px; padding: 19px clamp(20px, 4vw, 62px) 24px; color: var(--ncd-muted); font-family: 'Space Mono', monospace; font-size: 8px; letter-spacing: .09em; text-transform: uppercase; background: var(--ncd-canvas); }
            .ncd-drawer-backdrop { position: fixed; inset: 0; z-index: 40; border: 0; background: rgba(23, 42, 50, .34); animation: ncd-fade-in 180ms ease both; }
            .ncd-drawer { position: fixed; z-index: 41; top: 0; right: 0; width: min(100%, 430px); height: 100dvh; display: flex; flex-direction: column; padding: 25px clamp(20px, 4vw, 36px); border-left: 1px solid var(--ncd-ink); background: var(--ncd-paper); animation: ncd-drawer-in 300ms cubic-bezier(.2,.8,.2,1) both; }
            @keyframes ncd-drawer-in { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
            .ncd-drawer-top { display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; border-bottom: 1px solid var(--ncd-ink); }
            .ncd-drawer-top h2 { margin: 0; color: var(--ncd-ink); font-family: 'Instrument Serif', Georgia, serif; font-size: 2.7rem; font-weight: 400; letter-spacing: -.08em; }
            .ncd-close { padding: 5px; border: 0; color: var(--ncd-ink); background: transparent; }
            .ncd-drawer-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 13px; color: var(--ncd-muted); text-align: center; }
            .ncd-drawer-empty h3 { margin: 0; color: var(--ncd-ink); font-family: 'Instrument Serif', Georgia, serif; font-size: 2.2rem; font-weight: 400; letter-spacing: -.07em; }
            .ncd-drawer-empty p { max-width: 220px; margin: 0; font-size: 11px; line-height: 1.5; }
            .ncd-line-item { display: grid; grid-template-columns: 51px 1fr auto; gap: 13px; align-items: center; padding: 17px 0; border-bottom: 1px solid var(--ncd-line); }
            .ncd-line-swatch { height: 71px; display: grid; place-items: center; color: var(--ncd-ink); font-family: 'Space Mono', monospace; font-size: 8px; writing-mode: vertical-rl; border: 1px solid var(--ncd-ink); }
            .ncd-line-item h3 { margin: 0 0 4px; color: var(--ncd-ink); font-family: 'Instrument Serif', Georgia, serif; font-size: 18px; font-weight: 400; letter-spacing: -.04em; }
            .ncd-line-item p { margin: 0; color: var(--ncd-muted); font-family: 'Space Mono', monospace; font-size: 9px; }
            .ncd-quantity { display: flex; align-items: center; gap: 9px; margin-top: 11px; }
            .ncd-quantity button { width: 21px; height: 21px; display: grid; place-items: center; padding: 0; border: 1px solid var(--ncd-line); color: var(--ncd-ink); background: transparent; }
            .ncd-quantity button:hover { border-color: var(--ncd-blue); color: var(--ncd-blue); }
            .ncd-quantity span { font-family: 'Space Mono', monospace; font-size: 9px; }
            .ncd-remove { align-self: end; padding: 0; border: 0; color: var(--ncd-muted); background: transparent; font-family: 'Space Mono', monospace; font-size: 8px; }
            .ncd-remove:hover { color: var(--ncd-coral); }
            .ncd-drawer-bottom { margin-top: auto; padding-top: 18px; border-top: 1px solid var(--ncd-ink); }
            .ncd-total { display: flex; justify-content: space-between; margin-bottom: 17px; font-family: 'Space Mono', monospace; font-size: 10px; text-transform: uppercase; }
            .ncd-checkout { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 14px; border: 1px solid var(--ncd-blue); color: var(--ncd-paper); background: var(--ncd-blue); font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: .08em; text-transform: uppercase; }
            .ncd-checkout:hover { border-color: var(--ncd-coral); background: var(--ncd-coral); }
            .ncd-toast { position: fixed; z-index: 70; right: 21px; bottom: 21px; max-width: min(330px, calc(100vw - 42px)); padding: 12px 15px; border: 1px solid var(--ncd-ink); color: var(--ncd-paper); background: var(--ncd-ink); font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: .04em; animation: ncd-fade-in 180ms ease both; }
            @media (max-width: 960px) {
              .ncd-workbench { grid-template-columns: minmax(230px, .75fr) minmax(400px, 1.25fr); }
              .ncd-product-panel { grid-column: 2; grid-row: 1; }
              .ncd-selector { grid-column: 1; grid-row: 1; }
              .ncd-intro { grid-column: 1 / -1; grid-row: 2; min-height: 280px; border-right: 0; border-top: 1px solid var(--ncd-line); }
              .ncd-intro h1 { margin-top: 40px; }
            }
            @media (max-width: 680px) {
              .ncd-header { min-height: 66px; }
              .ncd-brand-caption, .ncd-header-link { display: none; }
              .ncd-workbench { display: flex; flex-direction: column; }
              .ncd-selector { min-height: 520px; order: 1; }
              .ncd-product-panel { min-height: 610px; order: 2; }
              .ncd-intro { min-height: 400px; order: 3; }
              .ncd-selector::before { top: 21px; }
              .ncd-product-art { min-height: 330px; }
              .ncd-summary-band, .ncd-dispatch { grid-template-columns: 1fr; }
              .ncd-summary-cell { min-height: 135px; }
              .ncd-note-grid { grid-template-columns: 1fr; }
              .ncd-note-card, .ncd-note-card:first-child { min-height: 200px; }
              .ncd-dispatch { gap: 38px; }
              .ncd-footer { flex-direction: column; align-items: flex-start; }
            }
            @media (prefers-reduced-motion: reduce) {
              .ncd-shell *, .ncd-shell *::before, .ncd-shell *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
            }
          `,
        }}
      />

      <header className="ncd-header">
        <button className="ncd-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
          <span className="ncd-brand-mark" aria-hidden="true">I</span>
          <span className="ncd-brand-name">NOTrehab Coffee</span>
          <span className="ncd-brand-caption">a notrehab object / daybreak index</span>
        </button>
        <div className="ncd-header-right">
          <button className="ncd-header-link" onClick={() => document.getElementById('ncd-notes')?.scrollIntoView({ behavior: 'smooth' })}>Notes</button>
          <button className="ncd-bag-toggle" onClick={() => setBasketOpen(true)} aria-expanded={basketOpen} aria-controls="ncd-bag">
            Bag <span className="ncd-bag-count">{quantity}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="ncd-workbench" aria-label="Build your morning">
          <div className="ncd-intro">
            <div className="ncd-index ncd-eyebrow">
              <span><strong>Daybreak index</strong> / choose a route</span>
              <span>01—03</span>
            </div>
            <div>
              <h1>Make room<br />to <em>arrive.</em></h1>
              <p className="ncd-intro-copy">A softer way into the collection. Start with how the morning feels, then find the object that belongs beside it.</p>
            </div>
            <div className="ncd-intro-foot">
              <span className="ncd-coordinate ncd-mono">40° 42' 46" N<br />74° 00' 21" W</span>
              <ArrowDownRight className="ncd-arrow-mark" size={25} strokeWidth={1} aria-hidden="true" />
            </div>
          </div>

          <div className="ncd-selector">
            <div>
              <div className="ncd-selector-top ncd-eyebrow">
                <span>Field guide / 01</span>
                <span>Brooklyn, NY</span>
              </div>
              <h2>What kind<br />of <span>hour?</span></h2>
              <p className="ncd-selector-note">The same small ritual, three different temperatures. Choose a route and we will put one object on the table.</p>
            </div>
            <div className="ncd-choice-list" role="tablist" aria-label="Choose a morning mood">
              {daybreakRoutes.map((route, index) => (
                <button
                  key={route.id}
                  role="tab"
                  aria-selected={selectedMood === route.id}
                  className={`ncd-choice ${selectedMood === route.id ? 'is-active' : ''}`}
                  onClick={() => {
                    setSelectedMood(route.id);
                    setShowNotes(false);
                  }}
                >
                  <span className="ncd-choice-label">
                    <span className="ncd-choice-number">0{index + 1}</span>
                    <span className="ncd-choice-text">{route.label}</span>
                  </span>
                  <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
                </button>
              ))}
            </div>
            <div className="ncd-selector-foot ncd-mono">
              <span>Selected route<br /><strong>{activeRoast.code} / {daybreakRoutes.find((route) => route.id === selectedMood)?.short}</strong></span>
              <span>follow the light<br />to re-route</span>
            </div>
          </div>

          <div className="ncd-product-panel">
            <div className="ncd-product-head">
              <span className="ncd-eyebrow">Your object / released</span>
              <span className="ncd-product-head-code">{activeRoast.code} — 250g</span>
            </div>
            <div className="ncd-product-art" style={{ backgroundColor: activeRoast.color }}>
              <span className="ncd-art-crosshair" aria-hidden="true" />
              <span className="ncd-art-label top">{activeRoast.process}</span>
              <div className="ncd-bag-art">
                <div className="ncd-bag-label">
                  <strong>NOT / coffee</strong>
                  <span>{activeRoast.name}</span>
                  <small>{activeRoast.origin}</small>
                </div>
              </div>
              <span className="ncd-art-label bottom">object study / {activeRoast.code}</span>
            </div>
            <div className="ncd-product-info">
              <div>
                <h3>{activeRoast.name}</h3>
                <p>{activeRoast.notes}</p>
              </div>
              <span className="ncd-product-price">${activeRoast.price}.00</span>
            </div>
            <div className="ncd-product-actions">
              <button className="ncd-detail-button" onClick={() => setShowNotes((current) => !current)} aria-expanded={showNotes}>
                {showNotes ? 'Close field note' : 'Read field note'}
                <ChevronDown size={13} className={showNotes ? 'rotate-180' : ''} aria-hidden="true" />
              </button>
              <button className="ncd-add-button" onClick={() => addToBasket(activeRoast)}>
                Add object <Plus size={13} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
            {showNotes && <p className="ncd-product-detail" key={activeRoast.id}>{activeRoast.detail}</p>}
          </div>
        </section>

        <section className="ncd-summary-band" aria-label="Collection details">
          <div className="ncd-summary-cell">
            <span className="ncd-eyebrow">The useful pause / 02</span>
            <p className="ncd-summary-title">Drink slowly.<br />Nothing to prove.</p>
            <p className="ncd-summary-detail">Roasted in small lots, labelled clearly, released when the cup is ready to say something.</p>
          </div>
          <div className="ncd-summary-cell dark">
            <span className="ncd-eyebrow">Current rhythm / every other thursday</span>
            <p className="ncd-summary-title">Three objects.<br />One good hour.</p>
            <p className="ncd-summary-detail">250g whole bean / light to medium-light / Brooklyn, New York</p>
          </div>
        </section>

        <section className="ncd-notes" id="ncd-notes">
          <div className="ncd-notes-head">
            <h2>Counter notes</h2>
            <button onClick={() => setMessage('Three notes are filed for your next pour')}>
              {basketSummary} <ArrowRight size={13} aria-hidden="true" />
            </button>
          </div>
          <div className="ncd-note-grid">
            <article className="ncd-note-card">
              <span className="ncd-note-tag">Note 01 / water</span>
              <h3>Good water is half the recipe.</h3>
              <p>A short note on minerals, temperature, and why your tap might be the best place to start.</p>
            </article>
            <article className="ncd-note-card">
              <span className="ncd-note-tag">Note 02 / time</span>
              <h3>Morning, without the performance.</h3>
              <p>There is no right way to take your time.</p>
            </article>
            <article className="ncd-note-card">
              <span className="ncd-note-tag">Note 03 / form</span>
              <h3>Notes on the object.</h3>
              <p>Packaging studies from our table to yours.</p>
            </article>
          </div>
        </section>

        <section className="ncd-dispatch" aria-label="Join the dispatch">
          <h2>Enter the<br /><em>dispatch.</em></h2>
          <div className="ncd-dispatch-copy">
            {subscribed ? (
              <span className="ncd-success"><Check size={14} /> Dispatch confirmed.</span>
            ) : (
              <>
                <p>New releases, field notes, and objects in progress. No noise. We write when there is something worth putting on the line.</p>
                <form className="ncd-email-form" onSubmit={submitDispatch}>
                  <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your email address" aria-label="Email address" />
                  <button type="submit">Join dispatch</button>
                </form>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="ncd-footer">
        <span>© 2024 NOT coffee / a notrehab object</span>
        <span>Move with intent.</span>
        <span className="ncd-mono">Brooklyn / NY</span>
      </footer>

      {basketOpen && (
        <>
          <button className="ncd-drawer-backdrop" onClick={() => setBasketOpen(false)} aria-label="Close bag" />
          <aside className="ncd-drawer" id="ncd-bag" role="dialog" aria-modal="true" aria-label="Your bag">
            <div className="ncd-drawer-top">
              <h2>Your bag <span className="ncd-eyebrow">({quantity})</span></h2>
              <button className="ncd-close" onClick={() => setBasketOpen(false)} aria-label="Close bag"><X size={18} strokeWidth={1.4} /></button>
            </div>
            {basket.length === 0 ? (
              <div className="ncd-drawer-empty">
                <Coffee size={24} strokeWidth={1} />
                <h3>Bag is clear.</h3>
                <p>Choose a route above and place one good object on the table.</p>
              </div>
            ) : (
              <div>
                {basket.map((line) => (
                  <div className="ncd-line-item" key={line.id}>
                    <div className="ncd-line-swatch" style={{ backgroundColor: line.color }}>NOT / {line.code}</div>
                    <div>
                      <h3>{line.name}</h3>
                      <p>${line.price}.00 / 250g</p>
                      <div className="ncd-quantity">
                        <button onClick={() => adjustBasket(line.id, -1)} aria-label={`Decrease ${line.name}`}><Minus size={11} /></button>
                        <span>{line.quantity}</span>
                        <button onClick={() => adjustBasket(line.id, 1)} aria-label={`Increase ${line.name}`}><Plus size={11} /></button>
                      </div>
                    </div>
                    <button className="ncd-remove" onClick={() => setBasket((current) => current.filter((item) => item.id !== line.id))}>Remove</button>
                  </div>
                ))}
              </div>
            )}
            {basket.length > 0 && (
              <div className="ncd-drawer-bottom">
                <div className="ncd-total"><span>Total</span><span>${total}.00</span></div>
                <button className="ncd-checkout" onClick={() => setMessage('Checkout is being prepared for the next release')}>
                  Continue to checkout <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      {message && (
        <button className="ncd-toast" onClick={() => setMessage('')} role="status" aria-label="Dismiss message">
          {message}
        </button>
      )}
    </div>
  );
}

export default NotrehabCoffeeDaybreakIndex;