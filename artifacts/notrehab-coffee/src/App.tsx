import { type CSSProperties, type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUp, Check, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Router as WouterRouter, Switch, useLocation } from 'wouter';

type Product = {
  id: string;
  name: string;
  note: string;
  price: number;
  origin: string;
  release: string;
  process: string;
};

type BagItem = Product & { quantity: number };

const queryClient = new QueryClient();

const products: Product[] = [
  {
    id: 'night-vector',
    name: 'Pissente Pour Over',
    note: 'citrus / cacao / walnut',
    price: 28,
    origin: 'Colombia / washed',
    release: 'R.01',
    process: 'light roast',
  },
  {
    id: 'still-signal',
    name: 'Second Bloom',
    note: 'plum / tea / sandalwood',
    price: 30,
    origin: 'Ethiopia / natural',
    release: 'R.02',
    process: 'light roast',
  },
  {
    id: 'low-orbit',
    name: 'After Rain',
    note: 'fig / molasses / cedar',
    price: 29,
    origin: 'Brazil / pulped natural',
    release: 'R.03',
    process: 'medium-light',
  },
];

const statements = [
  'good coffee asks for a little time.',
  'begin where the water meets the ground.',
  'a small ritual can hold a whole morning.',
  'keep what is essential. let the rest go.',
  'notice what changes when you slow down.',
  'arrive at the first clear hour.',
];

const brandMotion = [
  { text: 'NOT Rehab Coffee', label: 'the full name' },
  { text: '!RehabCoffee', label: 'the signal emerges' },
  { text: 'TCoffee', label: 'the coffee remains' },
];
const ritualTotal = 4;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Home() {
  const [clicks, setClicks] = useState(0);
  const [tBounds, setTBounds] = useState<{ left: number; right: number } | null>(null);
  const brandMotionRef = useRef<HTMLHeadingElement>(null);
  const brandTRef = useRef<HTMLSpanElement>(null);
  const [awake, setAwake] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [bag, setBag] = useState<BagItem[]>([]);
  const [toast, setToast] = useState('');
  const [email, setEmail] = useState('');
  const [signedUp, setSignedUp] = useState(false);
  const unlocked = clicks >= ritualTotal;
  const brandState = brandMotion[clicks >= ritualTotal ? brandMotion.length - 1 : 0];
  const brandPhase = Math.min(clicks, ritualTotal);
  const total = useMemo(() => bag.reduce((sum, item) => sum + item.price * item.quantity, 0), [bag]);
  const itemCount = useMemo(() => bag.reduce((sum, item) => sum + item.quantity, 0), [bag]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2700);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!pulse) return;
    const timer = window.setTimeout(() => setPulse(false), 700);
    return () => window.clearTimeout(timer);
  }, [pulse]);

  useEffect(() => {
    if (clicks >= ritualTotal) return;
    const motion = brandMotionRef.current;
    const t = brandTRef.current;
    if (!motion || !t) return;

    const measureT = () => {
      const motionRect = motion.getBoundingClientRect();
      const tRect = t.getBoundingClientRect();
      setTBounds({
        left: tRect.left - motionRect.left,
        right: tRect.right - motionRect.left,
      });
    };

    measureT();
    const observer = new ResizeObserver(measureT);
    observer.observe(motion);
    observer.observe(t);
    window.addEventListener('resize', measureT);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measureT);
    };
  }, [clicks]);

  const handleBeanClick = () => {
    if (unlocked) return;
    setAwake(true);
    setPulse(true);
    setClicks((current) => current + 1);
  };

  const addToBag = (product: Product) => {
    setBag((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setToast(`${product.name} added / ${product.release}`);
  };

  const removeFromBag = (id: string) => setBag((current) => current.filter((item) => item.id !== id));
  const changeQuantity = (id: string, delta: number) => {
    setBag((current) => current.flatMap((item) => {
      if (item.id !== id) return [item];
      const quantity = item.quantity + delta;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  };

  const submitSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email.trim()) setSignedUp(true);
  };

  return (
    <main className="page-shell noise">
      <header className="site-nav">
        <a href="#top" className="wordmark" data-testid="link-home">
          <span className="wordmark-mark" aria-hidden="true">I</span>
          <span className="wordmark-main">NOTrehab Coffee</span>
          <span className="wordmark-sub">a notrehab object / 01</span>
        </a>
        <nav className="nav-links" aria-label="Main navigation">
          <a
            href={unlocked ? '#collection' : '#top'}
            onClick={(event) => {
              if (!unlocked) {
                event.preventDefault();
                setAwake(true);
                setToast('Six activations open the collection');
              }
            }}
            data-testid="link-shop"
          >
            Collection
          </a>
          <a href="#journal" data-testid="link-journal">Notes</a>
          <button className="nav-cart" onClick={() => setCartOpen(true)} aria-expanded={cartOpen} aria-controls="shopping-bag" data-testid="button-open-bag">
            Bag <span className="cart-count" data-testid="text-cart-count">{itemCount}</span>
          </button>
        </nav>
      </header>

      <section className="hero" id="top" aria-label="NOT coffee entry">
        <div className="hero-meta eyebrow">
          <span><strong>NOTrehab Coffee</strong> — object archive</span>
          <span>Brooklyn · New York</span>
        </div>
        <div className="hero-title">
          <p className="hero-overline eyebrow">coffee / release 01</p>
          <h1
            ref={brandMotionRef}
            className={`brand-motion brand-phase-${brandPhase}`}
            aria-label={brandState.text}
            style={tBounds ? {
              '--t-left-px': `${tBounds.left}px`,
              '--t-right-px': `${tBounds.right}px`,
            } as CSSProperties : undefined}
          >
            <span
              className="brand-not-track"
              aria-hidden="true"
              style={{
                width: tBounds ? `${tBounds.left}px` : '0px',
              }}
            >
              <span className="brand-not">NO</span>
            </span>
            <span
              className="brand-rehab-track"
              aria-hidden="true"
              style={tBounds ? {
                left: `${tBounds.right}px`,
                width: `calc(100% - ${tBounds.right}px)`,
              } : undefined}
            >
              <span className="brand-rehab">Rehab</span>
            </span>
            <span className="brand-t-mask" aria-hidden="true">
              <span ref={brandTRef} className="brand-t">T</span>
            </span>
            <span className="brand-coffee" aria-hidden="true">Coffee</span>
          </h1>
          <p>Pissente Pour Over — for the first clear hour</p>
        </div>
        <p className="hero-side-note">A small coffee practice from the people behind notrehab.com. Touch the object when you are ready.</p>
        <div className="route-diagram" aria-hidden="true">
          <svg viewBox="0 0 132 108">
            <path d="M4 86 C28 86, 26 22, 58 28 S86 89, 126 12" />
            <path d="M4 64 L25 64 L35 47 L62 47" />
            <circle cx="4" cy="86" r="3" /><circle cx="58" cy="28" r="3" /><circle cx="126" cy="12" r="3" />
          </svg>
           <span className="route-label mono">ritual / 06 pauses</span>
        </div>
        <button
          className={`bean-stage ${awake ? 'is-awake' : ''} ${pulse ? 'is-pulsing' : ''} ${unlocked ? 'is-revealed' : ''}`}
          onMouseEnter={() => setAwake(true)}
          onMouseLeave={() => setAwake(false)}
          onClick={handleBeanClick}
           aria-label={unlocked ? 'Coffee collection revealed below' : `Activate coffee ritual, moment ${Math.min(clicks + 1, ritualTotal)} of ${ritualTotal}`}
          aria-describedby="bean-instruction"
          data-testid="button-awaken-bean"
        >
          <span className="bean" />
          {!unlocked && <span className="bean-hint">{awake ? 'click to continue' : 'hover / click to begin'}</span>}
          {clicks > 0 && !unlocked && <span className="statement" key={clicks}>{statements[clicks - 1]}</span>}
        </button>
        <p className="bean-instruction eyebrow" id="bean-instruction" aria-live="polite">
          {unlocked ? 'Collection unlocked / scroll to inspect the objects.' : `${clicks} of ${ritualTotal} activations / ${brandState.label}`}
        </p>
        <div className="hero-coordinate eyebrow">40° 42' 46" N / 74° 00' 21" W</div>
        <div className="hero-index eyebrow"><strong>{String(Math.min(clicks + 1, ritualTotal)).padStart(2, '0')}</strong> / 04</div>
        <div className="click-progress" aria-label={`${clicks} of ${ritualTotal} activations revealed`}>
          <span className="progress-label eyebrow">activate</span>
          {statements.map((statement, index) => <span className={`progress-dot ${clicks > index ? 'active' : ''}`} key={statement} />)}
        </div>
        <ArrowDown size={15} strokeWidth={1} className="absolute bottom-6 left-1/2 -translate-x-1/2" aria-hidden="true" />
      </section>

      {unlocked && (
        <section className="shop-reveal" id="collection" aria-label="Coffee releases">
          <div className="shop-header">
            <div>
              <span className="eyebrow field-marker">The collection / released</span>
              <h2>Three <span>objects.</span></h2>
            </div>
            <p className="shop-note"><strong>From the white room</strong><br />Roasted in small lots and released when ready. Three coffees with a clear point of view, made for the pleasure of staying a little longer.</p>
          </div>
          <div className="product-grid">
            {products.map((product, index) => <ProductCard key={product.id} product={product} featured={index === 0} onAdd={addToBag} />)}
          </div>
        </section>
      )}

      <section className="section section-rule manifesto" id="about">
        <div><span className="eyebrow field-marker">A note on making / 00</span></div>
        <div className="manifesto-copy">
          <h2>Make room<br />to <em>arrive.</em></h2>
          <p>NOT coffee is an exercise in the useful pause. We look for coffees with a clear point of view, roast them with restraint, then let the object become quiet enough for the cup to speak.</p>
          <span className="small-note">No performance required.<br />Small lots / clear labels.<br />Roasted in Brooklyn, NY.</span>
        </div>
      </section>

      <section className="ritual-band" id="ritual">
        <div className="section">
          <div className="ritual-layout">
            <div>
              <span className="eyebrow field-marker">The morning ritual / 01</span>
              <h2 className="ritual-title">A cup is<br />a <em>waypoint.</em></h2>
            </div>
            <div className="ritual-list">
              {[
                ['01', 'Start with the water', 'Fresh, soft water is the quiet infrastructure. Give it a clean surface to work from.'],
                ['02', 'Measure without fuss', 'A 1:16 ratio is a place to begin. The cup is data; your attention is the instrument.'],
                ['03', 'Wait for the bloom', 'Forty-five seconds. Notice what rises, then let the route continue.'],
                ['04', 'Drink before it cools', 'No optimization at the finish line. The best cup is the one you are present for.'],
              ].map(([number, title, copy]) => (
                <div className="ritual-row" key={number}>
                  <span className="ritual-number">{number}</span>
                  <div><h3>{title}</h3><p>{copy}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section origin-section" id="origin">
        <div className="origin-layout">
          <div>
            <span className="eyebrow field-marker">Where it begins / 02</span>
            <h2>Follow the<br /><span>flavour.</span></h2>
          </div>
          <div className="origin-copy">
            <p>We look for coffees with a shape to them: something bright at first contact, something warm underneath, a finish that stays around for another sip. Nothing engineered for speed, and nothing lost in the roast.</p>
            <div className="origin-specs">
              <div className="origin-spec"><small>roast window</small><strong>light / steady</strong></div>
              <div className="origin-spec"><small>format</small><strong>250g whole bean</strong></div>
              <div className="origin-spec"><small>release</small><strong>every other thursday</strong></div>
              <div className="origin-spec"><small>intention</small><strong>drink slowly</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section packaging" id="future">
        <div>
          <span className="eyebrow field-marker">Objects for the counter / 03</span>
          <h2>Things<br />that hold<br /><span>time.</span></h2>
        </div>
        <div className="packaging-copy">
          <p>The coffee is only the beginning. We are working on a small family of useful things for the counter: thick paper, dark wood, clear glass — objects that make one more minute feel considered.</p>
          <div className="packaging-card" aria-label="Packaging studies in thick paper, dark wood and clear glass">
            <div className="package-wood" aria-hidden="true" />
            <div className="package-glass" aria-hidden="true"><span>R.01</span></div>
            <div className="package-sketch"><span>NOT / coffee</span></div>
          </div>
          <button className="field-link" onClick={() => setToast('Object note queued for the next dispatch')} data-testid="button-packaging-notes">
            Read object note <ArrowRight size={13} />
          </button>
        </div>
      </section>

      <section className="section" id="journal">
        <div className="journal-head section-rule">
          <h2>Counter notes</h2><span className="eyebrow">observations / 03 files</span>
        </div>
        <div className="journal-grid">
          <article className="journal-item">
            <span className="journal-tag">NOTE 01 / WATER</span>
            <h3>Good water is half the recipe.</h3>
            <p>A short note on minerals, temperature, and why your tap might be the best place to start.</p>
          </article>
          <article className="journal-item">
            <span className="journal-tag">NOTE 02 / TIME</span>
            <h3>Morning, without the performance.</h3>
            <p>There is no right way to take your time.</p>
          </article>
          <article className="journal-item">
            <span className="journal-tag">NOTE 03 / FORM</span>
            <h3>Notes on the object.</h3>
            <p>Packaging studies from our table to yours.</p>
          </article>
        </div>
      </section>

      <section className="section newsletter" id="dispatch">
        <h2>Enter the<br /><span>dispatch.</span></h2>
        <div className="newsletter-copy">
          {signedUp ? <span className="signup-success" data-testid="status-signup-success"><Check size={13} /> Dispatch confirmed.</span> : (
            <>
              <p>New releases, field notes, and objects in progress. No noise. We write when there is something worth putting on the line.</p>
              <form className="email-form" onSubmit={submitSignup}>
                <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="your email address" aria-label="Email address" data-testid="input-email" />
                <button type="submit" data-testid="button-signup">Join dispatch</button>
              </form>
            </>
          )}
        </div>
      </section>

      <footer className="footer">
        <span>© 2024 NOT coffee / a notrehab object</span>
        <a href="#top" data-testid="link-back-top">Back to entry <ArrowUp size={12} aria-hidden="true" /></a>
        <span>Move with intent.</span>
      </footer>

      {cartOpen && <CartDrawer items={bag} total={total} onClose={() => setCartOpen(false)} onRemove={removeFromBag} onChangeQuantity={changeQuantity} onCheckout={() => setToast('Checkout is being prepared for the next release')} />}
      {toast && <div className="toast-note" role="status" data-testid="status-toast">{toast}</div>}
    </main>
  );
}

function ProductCard({ product, featured, onAdd }: { product: Product; featured: boolean; onAdd: (product: Product) => void }) {
  return (
    <article className={`product-card ${featured ? 'featured' : ''} product-${product.id}`} data-release={product.release} data-testid={`card-product-${product.id}`}>
      <div className="bag-wrap">
        <div className="bag">
          <span className="bag-roast">{product.process}<br />roasted weekly</span>
          <div className="bag-label">
            <strong>NOT / coffee</strong>
            <span>{product.name}</span>
            <small>{product.origin}</small>
          </div>
          <span className="bag-weight">250g / 01</span>
        </div>
      </div>
      <div className="product-info">
        <div><div className="product-name">{product.name}</div><div className="product-note">{product.note}</div></div>
        <span className="product-price">${product.price}.00</span>
      </div>
      <button className="add-button" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to bag`} data-testid={`button-add-${product.id}`}>
        Acquire object <Plus size={13} strokeWidth={1.5} />
      </button>
    </article>
  );
}

function CartDrawer({ items, total, onClose, onRemove, onChangeQuantity, onCheckout }: { items: BagItem[]; total: number; onClose: () => void; onRemove: (id: string) => void; onChangeQuantity: (id: string, delta: number) => void; onCheckout: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <>
      <button className="cart-drawer-backdrop" onClick={onClose} aria-label="Close shopping bag" data-testid="button-close-backdrop" />
      <aside className="cart-drawer" id="shopping-bag" aria-label="Shopping bag" aria-modal="true" role="dialog">
        <div className="drawer-top">
          <h2>Your bag <span className="eyebrow">({items.length})</span></h2>
          <button className="close-button" onClick={onClose} aria-label="Close shopping bag" data-testid="button-close-bag"><X size={18} strokeWidth={1.4} /></button>
        </div>
        {items.length === 0 ? (
          <div className="drawer-empty"><ShoppingBag size={22} strokeWidth={1} /><p>Bag is clear.</p><span className="small-note">Activate the collection to acquire an object.</span></div>
        ) : (
          <div>
            {items.map((item) => (
              <div className="drawer-item" key={item.id} data-testid={`row-bag-item-${item.id}`}>
                <div className="drawer-swatch">NOT / {item.release}</div>
                <div>
                  <h3>{item.name}</h3>
                  <p>${item.price}.00 · {item.quantity} ×</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button className="remove-button" onClick={() => onChangeQuantity(item.id, -1)} aria-label={`Decrease ${item.name}`} data-testid={`button-decrease-${item.id}`}><Minus size={12} /></button>
                    <span className="mono text-[.63rem]">{item.quantity}</span>
                    <button className="remove-button" onClick={() => onChangeQuantity(item.id, 1)} aria-label={`Increase ${item.name}`} data-testid={`button-increase-${item.id}`}><Plus size={12} /></button>
                  </div>
                </div>
                <button className="remove-button" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name} from bag`} data-testid={`button-remove-${item.id}`}>Remove</button>
              </div>
            ))}
          </div>
        )}
        {items.length > 0 && (
          <div className="drawer-bottom">
            <div className="total-row"><span>Total</span><span data-testid="text-cart-total">${total}.00</span></div>
            <button className="checkout-button" onClick={onCheckout} data-testid="button-checkout">Continue to checkout <ArrowRight size={14} className="inline ml-2" /></button>
          </div>
        )}
      </aside>
    </>
  );
}

export default App;