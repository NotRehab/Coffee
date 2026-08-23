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

type Roast = {
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

type BasketLine = Roast & { quantity: number };

const roasts: Roast[] = [
  {
    id: 'pissente',
    code: 'R.01',
    name: 'Pissente Pour Over',
    origin: 'Colombia / washed',
    process: 'light roast',
    notes: 'citrus · cacao · walnut',
    detail: 'Bright at first contact. A clean, warm finish for the first clear hour.',
    price: 28,
    color: '#ec694d',
    mood: 'clear',
  },
  {
    id: 'second-bloom',
    code: 'R.02',
    name: 'Second Bloom',
    origin: 'Ethiopia / natural',
    process: 'light roast',
    notes: 'plum · tea · sandalwood',
    detail: 'A little floral, a little patient. For mornings that have nowhere to rush.',
    price: 30,
    color: '#7b8b6a',
    mood: 'slow',
  },
  {
    id: 'after-rain',
    code: 'R.03',
    name: 'After Rain',
    origin: 'Brazil / pulped natural',
    process: 'medium-light',
    notes: 'fig · molasses · cedar',
    detail: 'Round and low-toned. The cup to keep beside a book or an open window.',
    price: 29,
    color: '#d1a14f',
    mood: 'grounded',
  },
];

const routeSteps = [
  { id: 'clear', label: 'I need a clear hour', short: 'clear' },
  { id: 'slow', label: 'I can take my time', short: 'slow' },
  { id: 'grounded', label: 'Keep me grounded', short: 'grounded' },
];

export function NotrehabCoffeeRitualConsole() {
  const [selectedMood, setSelectedMood] = useState('clear');
  const [basket, setBasket] = useState<BasketLine[]>([]);
  const [basketOpen, setBasketOpen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const activeRoast = roasts.find((roast) => roast.mood === selectedMood) ?? roasts[0];
  const quantity = basket.reduce((sum, line) => sum + line.quantity, 0);
  const total = basket.reduce((sum, line) => sum + line.quantity * line.price, 0);

  const basketSummary = useMemo(
    () => (quantity === 0 ? 'your bag is quiet' : `${quantity} ${quantity === 1 ? 'object' : 'objects'} selected`),
    [quantity],
  );

  const addToBasket = (roast: Roast) => {
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

  const removeLine = (id: string) => setBasket((current) => current.filter((line) => line.id !== id));

  const submitDispatch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <div className="nrc-shell">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .nrc-shell {
              --nrc-paper: #ede9df;
              --nrc-paper-light: #f5f1e8;
              --nrc-ink: #201d1d;
              --nrc-muted: #78716a;
              --nrc-line: rgba(32, 29, 29, .19);
              --nrc-orange: #e85e43;
              --nrc-plum: #332527;
              --nrc-plum-light: #493638;
              min-height: 100dvh;
              color: var(--nrc-ink);
              background: var(--nrc-paper);
              font-family: 'DM Sans', sans-serif;
              overflow: hidden;
              position: relative;
            }
            .nrc-shell *, .nrc-shell *::before, .nrc-shell *::after { box-sizing: border-box; }
            .nrc-shell::after {
              content: '';
              pointer-events: none;
              position: fixed;
              inset: 0;
              opacity: .025;
              z-index: 30;
              mix-blend-mode: multiply;
              background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='.45'/%3E%3C/svg%3E");
            }
            .nrc-shell button, .nrc-shell input { font: inherit; }
            .nrc-shell button { cursor: pointer; }
            .nrc-shell button:focus-visible, .nrc-shell input:focus-visible { outline: 1px solid var(--nrc-orange); outline-offset: 4px; }
            .nrc-mono { font-family: 'Space Mono', monospace; }
            .nrc-serif { font-family: 'Instrument Serif', Georgia, serif; }
            .nrc-eyebrow {
              color: var(--nrc-muted);
              font-family: 'Space Mono', monospace;
              font-size: 10px;
              letter-spacing: .14em;
              line-height: 1.35;
              text-transform: uppercase;
            }
            .nrc-header {
              min-height: 76px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 clamp(18px, 4vw, 62px);
              border-bottom: 1px solid var(--nrc-line);
            }
            .nrc-brand {
              display: flex;
              align-items: center;
              gap: 11px;
              color: var(--nrc-ink);
              text-decoration: none;
            }
            .nrc-brand-mark {
              width: 20px;
              height: 20px;
              display: grid;
              place-items: center;
              color: var(--nrc-paper);
              background: var(--nrc-ink);
              font-size: 11px;
              font-weight: 900;
              transform: skew(-12deg);
            }
            .nrc-brand-name {
              font-size: 13px;
              font-weight: 900;
              letter-spacing: -.05em;
              text-transform: uppercase;
            }
            .nrc-brand-caption {
              padding-left: 12px;
              color: var(--nrc-muted);
              border-left: 1px solid var(--nrc-line);
              font-family: 'Space Mono', monospace;
              font-size: 8px;
              letter-spacing: .12em;
              text-transform: uppercase;
            }
            .nrc-header-right { display: flex; align-items: center; gap: clamp(15px, 3.2vw, 45px); }
            .nrc-header-link, .nrc-bag-toggle {
              padding: 6px 0;
              border: 0;
              border-bottom: 1px solid transparent;
              color: var(--nrc-ink);
              background: transparent;
              font-family: 'Space Mono', monospace;
              font-size: 10px;
              letter-spacing: .1em;
              text-transform: uppercase;
            }
            .nrc-header-link:hover, .nrc-bag-toggle:hover { color: var(--nrc-orange); border-color: var(--nrc-orange); }
            .nrc-bag-toggle { display: flex; align-items: center; gap: 10px; }
            .nrc-bag-count {
              min-width: 19px;
              height: 19px;
              display: grid;
              place-items: center;
              border: 1px solid currentColor;
              border-radius: 50%;
              font-size: 9px;
            }
            .nrc-workbench {
              display: grid;
              grid-template-columns: minmax(260px, .72fr) minmax(460px, 1.45fr) minmax(220px, .62fr);
              min-height: 645px;
              border-bottom: 1px solid var(--nrc-ink);
            }
            .nrc-intro {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              min-width: 0;
              padding: clamp(28px, 4.5vw, 67px) clamp(21px, 3.4vw, 53px) 32px;
              border-right: 1px solid var(--nrc-line);
            }
            .nrc-index { display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 1px solid var(--nrc-line); }
            .nrc-index strong { color: var(--nrc-orange); font-weight: 400; }
            .nrc-intro h1 {
              max-width: 310px;
              margin: auto 0 17px;
              font-size: clamp(3.5rem, 6vw, 6.9rem);
              font-weight: 900;
              letter-spacing: -.105em;
              line-height: .78;
              text-transform: uppercase;
            }
            .nrc-intro h1 em {
              color: var(--nrc-orange);
              font-family: 'Instrument Serif', Georgia, serif;
              font-size: 1.1em;
              font-weight: 400;
              letter-spacing: -.05em;
              text-transform: none;
            }
            .nrc-intro-copy { max-width: 260px; margin: 0 0 20px; color: var(--nrc-muted); font-size: 12px; line-height: 1.6; }
            .nrc-intro-foot { display: flex; align-items: flex-end; justify-content: space-between; gap: 15px; }
            .nrc-coordinate { color: var(--nrc-muted); font-size: 8px; letter-spacing: .1em; line-height: 1.6; text-transform: uppercase; }
            .nrc-arrow-mark { color: var(--nrc-orange); }
            .nrc-selector {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              min-width: 0;
              padding: clamp(22px, 4vw, 56px) clamp(21px, 4.2vw, 69px) 31px;
              background: var(--nrc-plum);
              color: var(--nrc-paper-light);
              position: relative;
              overflow: hidden;
            }
            .nrc-selector::before {
              content: 'NOT / OBJECT 01';
              position: absolute;
              top: 24px;
              right: 25px;
              color: rgba(245, 241, 232, .36);
              font-family: 'Space Mono', monospace;
              font-size: 9px;
              letter-spacing: .14em;
              writing-mode: vertical-rl;
            }
            .nrc-selector-top { display: flex; align-items: center; justify-content: space-between; gap: 15px; }
            .nrc-selector .nrc-eyebrow { color: rgba(245, 241, 232, .57); }
            .nrc-selector h2 { margin: 17px 0 10px; font-size: clamp(2.15rem, 4vw, 4.8rem); font-weight: 900; letter-spacing: -.105em; line-height: .78; text-transform: uppercase; }
            .nrc-selector h2 span { color: var(--nrc-orange); }
            .nrc-selector-note { max-width: 300px; margin: 0; color: rgba(245, 241, 232, .62); font-size: 12px; line-height: 1.55; }
            .nrc-choice-list { margin: 35px 0 auto; border-top: 1px solid rgba(245, 241, 232, .34); }
            .nrc-choice {
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 15px;
              padding: 15px 0 14px;
              border: 0;
              border-bottom: 1px solid rgba(245, 241, 232, .23);
              color: rgba(245, 241, 232, .58);
              background: transparent;
              text-align: left;
              transition: color 180ms ease, padding 180ms ease;
            }
            .nrc-choice:hover, .nrc-choice.is-active { padding-left: 10px; color: var(--nrc-paper-light); }
            .nrc-choice.is-active { color: var(--nrc-orange); }
            .nrc-choice-label { display: flex; align-items: baseline; gap: 12px; }
            .nrc-choice-number { font-family: 'Space Mono', monospace; font-size: 9px; }
            .nrc-choice-text { font-size: 13px; font-weight: 500; letter-spacing: -.02em; }
            .nrc-choice svg { opacity: 0; transition: opacity 180ms ease, transform 180ms ease; }
            .nrc-choice.is-active svg, .nrc-choice:hover svg { opacity: 1; transform: translateX(2px); }
            .nrc-selector-foot { display: flex; justify-content: space-between; gap: 20px; padding-top: 23px; color: rgba(245, 241, 232, .42); font-size: 9px; line-height: 1.55; }
            .nrc-selector-foot strong { color: var(--nrc-orange); font-weight: 400; }
            .nrc-product-panel {
              min-width: 0;
              display: flex;
              flex-direction: column;
              padding: clamp(22px, 4vw, 56px) clamp(20px, 3vw, 43px) 30px;
              background: var(--nrc-paper-light);
            }
            .nrc-product-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; border-bottom: 1px solid var(--nrc-line); padding-bottom: 16px; }
            .nrc-product-head .nrc-eyebrow { color: var(--nrc-orange); }
            .nrc-product-head-code { color: var(--nrc-muted); font-family: 'Space Mono', monospace; font-size: 10px; }
            .nrc-product-art {
              flex: 1;
              min-height: 300px;
              position: relative;
              display: grid;
              place-items: center;
              overflow: hidden;
              margin: 16px 0 21px;
              border: 1px solid var(--nrc-ink);
              background: #d7d1c5;
            }
            .nrc-product-art::before {
              content: 'NOT';
              position: absolute;
              color: rgba(32, 29, 29, .07);
              font-size: clamp(6rem, 15vw, 12rem);
              font-weight: 900;
              letter-spacing: -.14em;
              transform: rotate(-14deg);
            }
            .nrc-art-crosshair { position: absolute; inset: 16px; border: 1px solid rgba(32, 29, 29, .23); }
            .nrc-art-crosshair::before, .nrc-art-crosshair::after { content: ''; position: absolute; background: rgba(32,29,29,.19); }
            .nrc-art-crosshair::before { top: 50%; left: 0; width: 100%; height: 1px; }
            .nrc-art-crosshair::after { top: 0; left: 50%; width: 1px; height: 100%; }
            .nrc-bag-art {
              width: clamp(140px, 24%, 205px);
              aspect-ratio: .68;
              position: relative;
              z-index: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--nrc-paper-light);
              box-shadow: 17px 20px 25px rgba(32, 29, 29, .18);
              clip-path: polygon(4% 2%, 96% 2%, 100% 98%, 0 98%);
              transform: rotate(3deg);
              transition: transform 280ms ease;
            }
            .nrc-product-art:hover .nrc-bag-art { transform: rotate(-2deg) translateY(-7px); }
            .nrc-bag-art::before { content: ''; position: absolute; inset: 0 0 auto; height: 9%; border-bottom: 1px solid rgba(32, 29, 29, .22); background: repeating-linear-gradient(90deg, rgba(32,29,29,.13) 0 2px, transparent 2px 6px); }
            .nrc-bag-label { width: 71%; height: 60%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 9px; border: 1px solid var(--nrc-ink); text-align: center; }
            .nrc-bag-label strong { font-size: 9px; font-weight: 900; letter-spacing: .04em; text-transform: uppercase; }
            .nrc-bag-label span { max-width: 95%; font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(1.25rem, 2.6vw, 2.3rem); font-style: italic; line-height: .78; }
            .nrc-bag-label small { max-width: 80%; color: var(--nrc-muted); font-family: 'Space Mono', monospace; font-size: 7px; line-height: 1.35; text-transform: uppercase; }
            .nrc-art-label { position: absolute; color: var(--nrc-muted); font-family: 'Space Mono', monospace; font-size: 8px; letter-spacing: .08em; text-transform: uppercase; }
            .nrc-art-label.top { top: 25px; left: 27px; }
            .nrc-art-label.bottom { right: 27px; bottom: 25px; }
            .nrc-product-info { display: flex; justify-content: space-between; align-items: flex-start; gap: 15px; }
            .nrc-product-info h3 { margin: 0 0 6px; font-size: clamp(1.05rem, 1.8vw, 1.45rem); font-weight: 900; letter-spacing: -.06em; text-transform: uppercase; }
            .nrc-product-info p { margin: 0; color: var(--nrc-muted); font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: .03em; text-transform: lowercase; }
            .nrc-product-price { font-family: 'Space Mono', monospace; font-size: 11px; white-space: nowrap; }
            .nrc-product-actions { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-top: 17px; }
            .nrc-detail-button, .nrc-add-button {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 8px 0;
              border: 0;
              border-bottom: 1px solid var(--nrc-orange);
              color: var(--nrc-ink);
              background: transparent;
              font-family: 'Space Mono', monospace;
              font-size: 9px;
              letter-spacing: .06em;
              text-transform: uppercase;
              transition: color 180ms ease, gap 180ms ease;
            }
            .nrc-detail-button:hover, .nrc-add-button:hover { gap: 13px; color: var(--nrc-orange); }
            .nrc-add-button { padding: 11px 13px; border: 1px solid var(--nrc-ink); background: var(--nrc-ink); color: var(--nrc-paper-light); }
            .nrc-add-button:hover { border-color: var(--nrc-orange); background: var(--nrc-orange); color: var(--nrc-ink); }
            .nrc-product-detail { max-width: 390px; margin: 15px 0 0; padding: 12px 0 2px; border-top: 1px solid var(--nrc-line); color: var(--nrc-muted); font-size: 11px; line-height: 1.55; animation: nrc-fade-in 220ms ease both; }
            @keyframes nrc-fade-in { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
            .nrc-summary-band { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; border-bottom: 1px solid var(--nrc-ink); background: var(--nrc-ink); }
            .nrc-summary-cell { min-height: 144px; display: flex; flex-direction: column; justify-content: space-between; padding: 21px clamp(20px, 4vw, 62px); background: var(--nrc-paper); }
            .nrc-summary-cell.dark { background: var(--nrc-orange); }
            .nrc-summary-title { max-width: 320px; margin: 0; font-size: clamp(1.3rem, 2.8vw, 2.8rem); font-weight: 900; letter-spacing: -.08em; line-height: .86; text-transform: uppercase; }
            .nrc-summary-cell.dark .nrc-summary-title { color: var(--nrc-ink); }
            .nrc-summary-detail { max-width: 360px; margin: 0; color: var(--nrc-muted); font-size: 11px; line-height: 1.45; }
            .nrc-summary-cell.dark .nrc-summary-detail { color: rgba(32,29,29,.67); }
            .nrc-notes { padding: 36px clamp(20px, 4vw, 62px) 55px; border-bottom: 1px solid var(--nrc-line); }
            .nrc-notes-head { display: flex; align-items: center; justify-content: space-between; gap: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--nrc-ink); }
            .nrc-notes-head h2 { margin: 0; font-size: 20px; font-weight: 900; letter-spacing: -.07em; text-transform: uppercase; }
            .nrc-notes-head button { display: inline-flex; align-items: center; gap: 8px; padding: 6px 0; border: 0; color: var(--nrc-orange); background: transparent; font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: .08em; text-transform: uppercase; }
            .nrc-note-grid { display: grid; grid-template-columns: 1.4fr .8fr .8fr; gap: 1px; margin-top: 1px; background: var(--nrc-ink); }
            .nrc-note-card { min-height: 195px; display: flex; flex-direction: column; justify-content: space-between; padding: 17px; background: var(--nrc-paper-light); }
            .nrc-note-card:first-child { background: var(--nrc-plum); color: var(--nrc-paper-light); }
            .nrc-note-tag { color: var(--nrc-orange); font-family: 'Space Mono', monospace; font-size: 8px; letter-spacing: .1em; text-transform: uppercase; }
            .nrc-note-card h3 { max-width: 320px; margin: 0; font-size: clamp(1.45rem, 2.7vw, 2.65rem); font-weight: 900; letter-spacing: -.09em; line-height: .82; text-transform: uppercase; }
            .nrc-note-card p { max-width: 230px; margin: 0; color: var(--nrc-muted); font-size: 11px; line-height: 1.5; }
            .nrc-note-card:first-child p { color: rgba(245,241,232,.62); }
            .nrc-dispatch { display: grid; grid-template-columns: 1fr 1fr; gap: 35px; padding: 55px clamp(20px, 4vw, 62px) 67px; border-bottom: 1px solid var(--nrc-ink); }
            .nrc-dispatch h2 { margin: 0; font-size: clamp(3.6rem, 8vw, 8rem); font-weight: 900; letter-spacing: -.11em; line-height: .76; text-transform: uppercase; }
            .nrc-dispatch h2 em { color: var(--nrc-orange); font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; text-transform: none; }
            .nrc-dispatch-copy { align-self: end; max-width: 370px; }
            .nrc-dispatch-copy p { margin: 0 0 17px; color: var(--nrc-muted); font-size: 12px; line-height: 1.65; }
            .nrc-email-form { display: flex; max-width: 380px; border-bottom: 1px solid var(--nrc-ink); }
            .nrc-email-form input { flex: 1; min-width: 0; padding: 11px 0; border: 0; outline: 0; color: var(--nrc-ink); background: transparent; font-family: 'Space Mono', monospace; font-size: 10px; }
            .nrc-email-form input::placeholder { color: var(--nrc-muted); }
            .nrc-email-form button { padding: 11px 0 11px 15px; border: 0; color: var(--nrc-orange); background: transparent; font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: .08em; text-transform: uppercase; }
            .nrc-success { display: inline-flex; align-items: center; gap: 9px; color: var(--nrc-orange); font-family: 'Space Mono', monospace; font-size: 10px; text-transform: uppercase; }
            .nrc-footer { display: flex; justify-content: space-between; gap: 15px; padding: 19px clamp(20px, 4vw, 62px) 24px; color: var(--nrc-muted); font-family: 'Space Mono', monospace; font-size: 8px; letter-spacing: .09em; text-transform: uppercase; }
            .nrc-drawer-backdrop { position: fixed; inset: 0; z-index: 40; border: 0; background: rgba(32,29,29,.43); animation: nrc-fade-in 180ms ease both; }
            .nrc-drawer { position: fixed; z-index: 41; top: 0; right: 0; width: min(100%, 430px); height: 100dvh; display: flex; flex-direction: column; padding: 25px clamp(20px, 4vw, 36px); background: var(--nrc-paper-light); border-left: 1px solid var(--nrc-ink); animation: nrc-drawer-in 300ms cubic-bezier(.2,.8,.2,1) both; }
            @keyframes nrc-drawer-in { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
            .nrc-drawer-top { display: flex; align-items: center; justify-content: space-between; padding-bottom: 20px; border-bottom: 1px solid var(--nrc-ink); }
            .nrc-drawer-top h2 { margin: 0; font-size: 2.4rem; font-weight: 900; letter-spacing: -.1em; text-transform: uppercase; }
            .nrc-close { padding: 5px; border: 0; color: var(--nrc-ink); background: transparent; }
            .nrc-drawer-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 13px; color: var(--nrc-muted); text-align: center; }
            .nrc-drawer-empty h3 { margin: 0; font-size: 1.9rem; font-weight: 900; letter-spacing: -.09em; text-transform: uppercase; }
            .nrc-drawer-empty p { max-width: 220px; margin: 0; font-size: 11px; line-height: 1.5; }
            .nrc-line-item { display: grid; grid-template-columns: 51px 1fr auto; gap: 13px; align-items: center; padding: 17px 0; border-bottom: 1px solid var(--nrc-line); }
            .nrc-line-swatch { height: 71px; display: grid; place-items: center; color: var(--nrc-ink); font-family: 'Space Mono', monospace; font-size: 8px; writing-mode: vertical-rl; border: 1px solid var(--nrc-ink); }
            .nrc-line-item h3 { margin: 0 0 4px; font-size: 13px; font-weight: 900; letter-spacing: -.04em; text-transform: uppercase; }
            .nrc-line-item p { margin: 0; color: var(--nrc-muted); font-family: 'Space Mono', monospace; font-size: 9px; }
            .nrc-quantity { display: flex; align-items: center; gap: 9px; margin-top: 11px; }
            .nrc-quantity button { width: 21px; height: 21px; display: grid; place-items: center; padding: 0; border: 1px solid var(--nrc-line); color: var(--nrc-ink); background: transparent; }
            .nrc-quantity button:hover { border-color: var(--nrc-orange); color: var(--nrc-orange); }
            .nrc-quantity span { font-family: 'Space Mono', monospace; font-size: 9px; }
            .nrc-remove { align-self: end; padding: 0; border: 0; color: var(--nrc-muted); background: transparent; font-family: 'Space Mono', monospace; font-size: 8px; }
            .nrc-remove:hover { color: var(--nrc-orange); }
            .nrc-drawer-bottom { margin-top: auto; padding-top: 18px; border-top: 1px solid var(--nrc-ink); }
            .nrc-total { display: flex; justify-content: space-between; margin-bottom: 17px; font-family: 'Space Mono', monospace; font-size: 10px; text-transform: uppercase; }
            .nrc-checkout { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 14px; border: 1px solid var(--nrc-ink); color: var(--nrc-paper-light); background: var(--nrc-ink); font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: .08em; text-transform: uppercase; }
            .nrc-checkout:hover { border-color: var(--nrc-orange); background: var(--nrc-orange); color: var(--nrc-ink); }
            .nrc-toast { position: fixed; z-index: 70; right: 21px; bottom: 21px; max-width: min(330px, calc(100vw - 42px)); padding: 12px 15px; border: 1px solid var(--nrc-ink); color: var(--nrc-paper-light); background: var(--nrc-ink); font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: .04em; animation: nrc-fade-in 180ms ease both; }
            @media (max-width: 960px) {
              .nrc-workbench { grid-template-columns: minmax(230px, .75fr) minmax(400px, 1.25fr); }
              .nrc-product-panel { grid-column: 2; grid-row: 1; }
              .nrc-selector { grid-column: 1; grid-row: 1; }
              .nrc-intro { grid-column: 1 / -1; grid-row: 2; min-height: 280px; border-right: 0; border-top: 1px solid var(--nrc-line); }
              .nrc-intro h1 { margin-top: 40px; }
            }
            @media (max-width: 680px) {
              .nrc-header { min-height: 66px; }
              .nrc-brand-caption, .nrc-header-link { display: none; }
              .nrc-workbench { display: flex; flex-direction: column; }
              .nrc-selector { min-height: 520px; order: 1; }
              .nrc-product-panel { min-height: 610px; order: 2; }
              .nrc-intro { min-height: 400px; order: 3; }
              .nrc-selector::before { top: 21px; }
              .nrc-selector h2 { max-width: 300px; }
              .nrc-product-art { min-height: 330px; }
              .nrc-summary-band, .nrc-dispatch { grid-template-columns: 1fr; }
              .nrc-summary-cell { min-height: 135px; }
              .nrc-note-grid { grid-template-columns: 1fr; }
              .nrc-note-card, .nrc-note-card:first-child { min-height: 200px; }
              .nrc-dispatch { gap: 38px; }
              .nrc-footer { flex-direction: column; align-items: flex-start; }
            }
            @media (prefers-reduced-motion: reduce) {
              .nrc-shell *, .nrc-shell *::before, .nrc-shell *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
            }
          `,
        }}
      />

      <header className="nrc-header">
        <button className="nrc-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
          <span className="nrc-brand-mark" aria-hidden="true">I</span>
          <span className="nrc-brand-name">NOTrehab Coffee</span>
          <span className="nrc-brand-caption">a notrehab object / 01</span>
        </button>
        <div className="nrc-header-right">
          <button className="nrc-header-link" onClick={() => document.getElementById('nrc-notes')?.scrollIntoView({ behavior: 'smooth' })}>Notes</button>
          <button className="nrc-bag-toggle" onClick={() => setBasketOpen(true)} aria-expanded={basketOpen} aria-controls="nrc-bag">
            Bag <span className="nrc-bag-count">{quantity}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="nrc-workbench" aria-label="Build your morning">
          <div className="nrc-intro">
            <div className="nrc-index nrc-eyebrow">
              <span><strong>Morning console</strong> / choose a route</span>
              <span>01—03</span>
            </div>
            <div>
              <h1>Make room<br />to <em>arrive.</em></h1>
              <p className="nrc-intro-copy">A smaller way into the collection. Start with how the morning feels, not with a tasting note.</p>
            </div>
            <div className="nrc-intro-foot">
              <span className="nrc-coordinate nrc-mono">40° 42' 46" N<br />74° 00' 21" W</span>
              <ArrowDownRight className="nrc-arrow-mark" size={25} strokeWidth={1} aria-hidden="true" />
            </div>
          </div>

          <div className="nrc-selector">
            <div>
              <div className="nrc-selector-top nrc-eyebrow">
                <span>Field guide / 01</span>
                <span>Brooklyn, NY</span>
              </div>
              <h2>What kind<br />of <span>hour?</span></h2>
              <p className="nrc-selector-note">The same ritual, three different temperatures. Choose a route and we will put one object on the table.</p>
            </div>
            <div className="nrc-choice-list" role="tablist" aria-label="Choose a morning mood">
              {routeSteps.map((step, index) => (
                <button
                  key={step.id}
                  role="tab"
                  aria-selected={selectedMood === step.id}
                  className={`nrc-choice ${selectedMood === step.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedMood(step.id)}
                >
                  <span className="nrc-choice-label">
                    <span className="nrc-choice-number">0{index + 1}</span>
                    <span className="nrc-choice-text">{step.label}</span>
                  </span>
                  <ArrowRight size={14} strokeWidth={1.5} aria-hidden="true" />
                </button>
              ))}
            </div>
            <div className="nrc-selector-foot nrc-mono">
              <span>Selected route<br /><strong>{activeRoast.code} / {routeSteps.find((step) => step.id === selectedMood)?.short}</strong></span>
              <span>swipe the field<br />to re-route</span>
            </div>
          </div>

          <div className="nrc-product-panel">
            <div className="nrc-product-head">
              <span className="nrc-eyebrow">Your object / released</span>
              <span className="nrc-product-head-code">{activeRoast.code} — 250g</span>
            </div>
            <div className="nrc-product-art" style={{ backgroundColor: activeRoast.color }}>
              <span className="nrc-art-crosshair" aria-hidden="true" />
              <span className="nrc-art-label top">{activeRoast.process}</span>
              <div className="nrc-bag-art">
                <div className="nrc-bag-label">
                  <strong>NOT / coffee</strong>
                  <span>{activeRoast.name}</span>
                  <small>{activeRoast.origin}</small>
                </div>
              </div>
              <span className="nrc-art-label bottom">object study / {activeRoast.code}</span>
            </div>
            <div className="nrc-product-info">
              <div>
                <h3>{activeRoast.name}</h3>
                <p>{activeRoast.notes}</p>
              </div>
              <span className="nrc-product-price">${activeRoast.price}.00</span>
            </div>
            <div className="nrc-product-actions">
              <button className="nrc-detail-button" onClick={() => setShowNotes((current) => !current)} aria-expanded={showNotes}>
                {showNotes ? 'Close field note' : 'Read field note'}
                <ChevronDown size={13} className={showNotes ? 'rotate-180' : ''} aria-hidden="true" />
              </button>
              <button className="nrc-add-button" onClick={() => addToBasket(activeRoast)}>
                Add object <Plus size={13} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
            {showNotes && <p className="nrc-product-detail" key={activeRoast.id}>{activeRoast.detail}</p>}
          </div>
        </section>

        <section className="nrc-summary-band" aria-label="Collection details">
          <div className="nrc-summary-cell">
            <span className="nrc-eyebrow">The useful pause / 02</span>
            <p className="nrc-summary-title">Drink slowly.<br />Nothing to prove.</p>
            <p className="nrc-summary-detail">Roasted in small lots, labelled clearly, released when the cup is ready to say something.</p>
          </div>
          <div className="nrc-summary-cell dark">
            <span className="nrc-eyebrow">Current rhythm / every other thursday</span>
            <p className="nrc-summary-title">Three objects.<br />One good hour.</p>
            <p className="nrc-summary-detail">250g whole bean / light to medium-light / Brooklyn, New York</p>
          </div>
        </section>

        <section className="nrc-notes" id="nrc-notes">
          <div className="nrc-notes-head">
            <h2>Counter notes</h2>
            <button onClick={() => setMessage('Three notes are filed for your next pour')}>
              {basketSummary} <ArrowRight size={13} aria-hidden="true" />
            </button>
          </div>
          <div className="nrc-note-grid">
            <article className="nrc-note-card">
              <span className="nrc-note-tag">Note 01 / water</span>
              <h3>Good water is half the recipe.</h3>
              <p>A short note on minerals, temperature, and why your tap might be the best place to start.</p>
            </article>
            <article className="nrc-note-card">
              <span className="nrc-note-tag">Note 02 / time</span>
              <h3>Morning, without the performance.</h3>
              <p>There is no right way to take your time.</p>
            </article>
            <article className="nrc-note-card">
              <span className="nrc-note-tag">Note 03 / form</span>
              <h3>Notes on the object.</h3>
              <p>Packaging studies from our table to yours.</p>
            </article>
          </div>
        </section>

        <section className="nrc-dispatch" aria-label="Join the dispatch">
          <h2>Enter the<br /><em>dispatch.</em></h2>
          <div className="nrc-dispatch-copy">
            {subscribed ? (
              <span className="nrc-success"><Check size={14} /> Dispatch confirmed.</span>
            ) : (
              <>
                <p>New releases, field notes, and objects in progress. No noise. We write when there is something worth putting on the line.</p>
                <form className="nrc-email-form" onSubmit={submitDispatch}>
                  <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your email address" aria-label="Email address" />
                  <button type="submit">Join dispatch</button>
                </form>
              </>
            )}
          </div>
        </section>
      </main>

      <footer className="nrc-footer">
        <span>© 2024 NOT coffee / a notrehab object</span>
        <span>Move with intent.</span>
        <span className="nrc-mono">Brooklyn / NY</span>
      </footer>

      {basketOpen && (
        <>
          <button className="nrc-drawer-backdrop" onClick={() => setBasketOpen(false)} aria-label="Close bag" />
          <aside className="nrc-drawer" id="nrc-bag" role="dialog" aria-modal="true" aria-label="Your bag">
            <div className="nrc-drawer-top">
              <h2>Your bag <span className="nrc-eyebrow">({quantity})</span></h2>
              <button className="nrc-close" onClick={() => setBasketOpen(false)} aria-label="Close bag"><X size={18} strokeWidth={1.4} /></button>
            </div>
            {basket.length === 0 ? (
              <div className="nrc-drawer-empty">
                <Coffee size={24} strokeWidth={1} />
                <h3>Bag is clear.</h3>
                <p>Choose a route above and place one good object on the table.</p>
              </div>
            ) : (
              <div>
                {basket.map((line) => (
                  <div className="nrc-line-item" key={line.id}>
                    <div className="nrc-line-swatch" style={{ backgroundColor: line.color }}>NOT / {line.code}</div>
                    <div>
                      <h3>{line.name}</h3>
                      <p>${line.price}.00 / 250g</p>
                      <div className="nrc-quantity">
                        <button onClick={() => adjustBasket(line.id, -1)} aria-label={`Decrease ${line.name}`}><Minus size={11} /></button>
                        <span>{line.quantity}</span>
                        <button onClick={() => adjustBasket(line.id, 1)} aria-label={`Increase ${line.name}`}><Plus size={11} /></button>
                      </div>
                    </div>
                    <button className="nrc-remove" onClick={() => removeLine(line.id)}>Remove</button>
                  </div>
                ))}
              </div>
            )}
            {basket.length > 0 && (
              <div className="nrc-drawer-bottom">
                <div className="nrc-total"><span>Total</span><span>${total}.00</span></div>
                <button className="nrc-checkout" onClick={() => setMessage('Checkout is being prepared for the next release')}>
                  Continue to checkout <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            )}
          </aside>
        </>
      )}

      {message && (
        <button className="nrc-toast" onClick={() => setMessage('')} role="status" aria-label="Dismiss message">
          {message}
        </button>
      )}
    </div>
  );
}

export default NotrehabCoffeeRitualConsole;