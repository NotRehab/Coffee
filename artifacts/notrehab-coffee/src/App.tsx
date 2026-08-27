import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ShoppingBag } from 'lucide-react';

const products = [
  {
    id: 1,
    name: "PISSENTE POUR OVER",
    note: "Citrus • Cacao • Walnut",
    price: 28,
    origin: "Colombia • Washed",
    image: "https://picsum.photos/id/1015/2000/1400",
    statement: "good coffee asks for a little time.",
    info: [
      { label: "ALTITUDE", value: "1,900 m" },
      { label: "VARIETAL", value: "Castillo" },
      { label: "ROAST", value: "Light" },
      { label: "YIELD", value: "Small lot" },
    ],
  },
  {
    id: 2,
    name: "SECOND BLOOM",
    note: "Plum • Tea • Sandalwood",
    price: 30,
    origin: "Ethiopia • Natural",
    image: "https://picsum.photos/id/106/2000/1400",
    statement: "begin where the water meets the ground.",
    info: [
      { label: "ALTITUDE", value: "2,200 m" },
      { label: "VARIETAL", value: "Heirloom" },
      { label: "ROAST", value: "Light" },
      { label: "YIELD", value: "Natural" },
    ],
  },
  {
    id: 3,
    name: "AFTER RAIN",
    note: "Fig • Molasses • Cedar",
    price: 29,
    origin: "Brazil • Pulped Natural",
    image: "https://picsum.photos/id/201/2000/1400",
    statement: "a small ritual can hold a whole morning.",
    info: [
      { label: "ALTITUDE", value: "1,100 m" },
      { label: "VARIETAL", value: "Catuai" },
      { label: "ROAST", value: "Medium" },
      { label: "YIELD", value: "Pulped" },
    ],
  },
];

const noise =
  "data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E";

// Shared vanishing line — Coffee sits just right of it so ! lands under the clip.
const BRAND_CLIP = "4.6em";
const BRAND_STEP_X = "4.555em";
const BRAND_BANG_X = "4.35em";
const BRAND_COFFEE_X = "4.72em";
const BRAND_COFFEE_Y = "0.92em";

// Start a little closer, then teaser, then full merge into !, then ! falls.
const REST_NOT = "1.15em";
const REST_REHAB = "-1.35em";
const TEASER_NOT = "1.7em";
const TEASER_REHAB = "-2.05em";
const FULL_NOT = "3.55em";
const FULL_REHAB = "-4.35em";

export default function App() {
  const [phase, setPhase] = useState(0); // 0 = hero, 1 = catalog
  const [bag, setBag] = useState<number[]>([]);
  // 0 rest → 1 teaser → 2 merge into ! (top) → 3 ! falls to Coffee → 4 catalog
  const [ritual, setRitual] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const wheelLock = useRef(false);
  const bangSettledRef = useRef(false);
  const [bangSettled, setBangSettled] = useState(false);

  const addToBag = (id: number) => setBag((b) => [...b, id]);

  // Catalog paging — same "one small scroll or click anywhere" as the hero.
  // Pages: product 0,1,2 then feedback (index 3).
  const [catalogIndex, setCatalogIndex] = useState(0);
  const catalogWheelLock = useRef(false);
  // Direction of the last page change: 1 = forward (page down), -1 = back (page up)
  const [catalogDir, setCatalogDir] = useState(1);

  const advanceCatalog = useCallback(() => {
    setCatalogDir(1);
    setCatalogIndex((i) => Math.min(i + 1, products.length));
  }, []);

  const backCatalog = useCallback(() => {
    setCatalogDir(-1);
    setCatalogIndex((i) => Math.max(i - 1, 0));
  }, []);

  useEffect(() => {
    if (ritual >= 4) setPhase(1);
  }, [ritual]);

  const advanceRitual = useCallback(() => {
    setRitual((r) => {
      // Wait for the fallen ! to settle before leaving for catalog
      if (r === 3 && !bangSettledRef.current) return 3;
      return Math.min(r + 1, 4);
    });
  }, []);

  useEffect(() => {
    if (phase !== 0) return;
    const el = heroRef.current;
    if (!el) return;
    const onWheel = (e: Event) => {
      const we = e as globalThis.WheelEvent;
      we.preventDefault();
      if (wheelLock.current) return;
      if (Math.abs(we.deltaY) < 10) return;
      wheelLock.current = true;
      advanceRitual();
      window.setTimeout(() => {
        wheelLock.current = false;
      }, 520);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [phase, advanceRitual]);

  const notX = ritual === 0 ? REST_NOT : ritual === 1 ? TEASER_NOT : FULL_NOT;
  const rehabX = ritual === 0 ? REST_REHAB : ritual === 1 ? TEASER_REHAB : FULL_REHAB;
  // Words stay visible while they squash into ! (ritual 2), gone once ! exists
  const merging = ritual >= 2;
  const falling = ritual >= 3;

  useEffect(() => {
    if (ritual < 3) {
      setBangSettled(false);
      bangSettledRef.current = false;
      return;
    }
    const t = window.setTimeout(() => {
      setBangSettled(true);
      bangSettledRef.current = true;
    }, 900);
    return () => window.clearTimeout(t);
  }, [ritual]);

  const hint =
    ritual === 0
      ? "click or scroll — they want to move"
      : ritual === 1
        ? "again — let them meet"
        : ritual === 2
          ? "scroll — drop the signal"
          : bangSettled
            ? "scroll — the catalog rises"
            : "watch it settle";

  return (
    <div className="relative font-sans">
      <div
        className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03] mix-blend-multiply"
        style={{ backgroundImage: `url(${noise})` }}
      />

      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.section
            key="hero"
            ref={heroRef}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: "-100vh",
              transition: { duration: 0.42, ease: [0.4, 0, 0.2, 1] },
            }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
            className="min-h-screen flex flex-col items-center justify-center relative bg-[#f2f0ea] overflow-hidden cursor-pointer select-none"
            onClick={advanceRitual}
          >
            {[...Array(14)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full bg-[#684837]/30"
                style={{
                  width: 3 + (i % 4) * 2,
                  height: 3 + (i % 4) * 2,
                  left: `${(i * 7.3) % 100}%`,
                  top: `${(i * 13.7) % 100}%`,
                }}
                animate={{ y: [0, -40, 0], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 6 + (i % 5), repeat: Infinity, ease: "easeInOut" }}
              />
            ))}

            <div className="text-center z-10 w-full px-6 pointer-events-none">
              <p className="mb-8 text-sm tracking-[6px] font-mono text-[#d94f2b] uppercase">
                Move with intent
              </p>

              <div
                className="relative mx-auto font-black tracking-[-0.08em] text-[#12110f]"
                style={{
                  fontSize: "clamp(3.1rem, 13.5vw, 9.6rem)",
                  lineHeight: 0.78,
                  width: "9.2em",
                  height: "1.78em",
                }}
              >
                {/* LEFT track — clips at shared line only during the merge. NOT rests on the far left. */}
                <div
                  className="absolute left-0 top-0 z-[1]"
                  style={{
                    width: BRAND_CLIP,
                    height: "0.86em",
                    overflow: merging ? "hidden" : "visible",
                  }}
                >
                  <motion.span
                    initial={{ opacity: 0, x: "0.6em" }}
                    animate={{
                      // Stay visible while sliding in; squash into the ! instead of vanishing first
                      opacity: merging ? 0 : 1,
                      x: notX,
                      scaleX: merging ? 0.08 : 1,
                      color: merging ? "#d94f2b" : "#12110f",
                    }}
                    transition={{
                      opacity: {
                        duration: merging ? 0.45 : 0.7,
                        delay: merging ? 0.35 : 0.08,
                      },
                      scaleX: {
                        duration: merging ? 0.55 : 0.3,
                        delay: merging ? 0.15 : 0,
                        ease: [0.4, 0, 0.2, 1],
                      },
                      color: { duration: 0.35, delay: merging ? 0.1 : 0 },
                      x: {
                        type: "spring",
                        stiffness: merging ? 130 : ritual === 1 ? 260 : 150,
                        damping: merging ? 15 : ritual === 1 ? 24 : 17,
                        mass: 0.85,
                      },
                    }}
                    className="absolute left-0 top-0 origin-right whitespace-nowrap"
                  >
                    NOT
                  </motion.span>
                </div>

                {/* RIGHT track — same clip line, but only clips during the merge. REHAB starts inset from the far right. */}
                <div
                  className="absolute top-0 z-[1]"
                  style={{
                    left: BRAND_CLIP,
                    width: `calc(100% - ${BRAND_CLIP})`,
                    height: "0.86em",
                    overflow: merging ? "hidden" : "visible",
                  }}
                >
                  <motion.span
                    initial={{ opacity: 0, x: "-0.6em" }}
                    animate={{
                      opacity: merging ? 0 : 1,
                      x: rehabX,
                      scaleX: merging ? 0.08 : 1,
                      color: merging ? "#d94f2b" : "#12110f",
                    }}
                    transition={{
                      opacity: {
                        duration: merging ? 0.45 : 0.7,
                        delay: merging ? 0.35 : 0.08,
                      },
                      scaleX: {
                        duration: merging ? 0.55 : 0.3,
                        delay: merging ? 0.15 : 0,
                        ease: [0.4, 0, 0.2, 1],
                      },
                      color: { duration: 0.35, delay: merging ? 0.1 : 0 },
                      x: {
                        type: "spring",
                        stiffness: merging ? 130 : ritual === 1 ? 260 : 150,
                        damping: merging ? 15 : ritual === 1 ? 24 : 17,
                        mass: 0.85,
                      },
                    }}
                    className="absolute top-0 origin-left whitespace-nowrap"
                    style={{ right: 0 }}
                  >
                    REHAB
                  </motion.span>
                </div>

                {/* Coffee — already placed */}
                <motion.span
                  initial={{ opacity: 0, y: "0.1em" }}
                  animate={{ opacity: 1, y: "0em" }}
                  transition={{ duration: 0.9, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute z-[2] whitespace-nowrap"
                  style={{ left: BRAND_COFFEE_X, top: BRAND_COFFEE_Y }}
                >
                  COFFEE
                </motion.span>

                {/* NOT+REHAB merge into ! on the clip, then ! falls to Coffee */}
                <MergeFallBang merged={merging} falling={falling} />
              </div>

              <motion.p
                animate={{ opacity: bangSettled ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 text-base tracking-[8px] font-mono text-[#12110f]/50 uppercase"
              >
                ! Coffee — the signal remains
              </motion.p>
            </div>

            <div className="absolute bottom-16 flex flex-col items-center gap-3 text-sm tracking-[4px] font-mono text-[#12110f]/70 pointer-events-none">
              <motion.span
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown size={22} />
              </motion.span>
              <span className="text-center text-[11px] tracking-[3px] opacity-70 uppercase">
                {hint}
              </span>
            </div>
          </motion.section>
        )}

        {phase === 1 && (
          <motion.div
            key="catalog"
            initial={{ opacity: 0, y: "40vh" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="fixed top-8 right-8 z-50 flex items-center gap-3 text-xs tracking-widest font-mono">
              <button
                onClick={() => {
                  setPhase(0);
                  setRitual(0);
                }}
                className="text-[#12110f]/60 hover:text-[#d94f2b] transition-colors"
              >
              ← RITUAL
              </button>
              <span className="flex items-center gap-2 text-[#12110f]">
                <ShoppingBag size={16} /> {bag.length}
              </span>
            </div>

            {/* Paged catalog — one slide at a time, advance on small scroll or click */}
            <div
              className="relative h-screen overflow-hidden"
              onWheel={(e) => {
                if (catalogWheelLock.current) return;
                if (Math.abs(e.deltaY) < 10) return;
                catalogWheelLock.current = true;
                if (e.deltaY > 0) advanceCatalog();
                else backCatalog();
                window.setTimeout(() => {
                  catalogWheelLock.current = false;
                }, 520);
              }}
            >
              <AnimatePresence mode="sync" custom={catalogDir}>
                {catalogIndex < products.length ? (
                  <CatalogSlide
                    key={products[catalogIndex].id}
                    product={products[catalogIndex]}
                    index={catalogIndex}
                    total={products.length}
                    dir={catalogDir}
                    onAdd={() => addToBag(products[catalogIndex].id)}
                    onAdvance={advanceCatalog}
                    onBack={backCatalog}
                  />
                ) : (
                  <FeedbackSlide key="feedback" dir={catalogDir} onBack={backCatalog} />
                )}
              </AnimatePresence>
            </div>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 text-[10px] tracking-[4px] font-mono text-[#12110f]/50 uppercase">
              scroll — one small scroll to move
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Ritual 2: NOT + REHAB squash into an orange ! on the clip line (top).
 * Ritual 3: that same ! falls straight down and settles beside Coffee.
 */
function MergeFallBang({
  merged,
  falling,
}: {
  merged: boolean;
  falling: boolean;
}) {
  // Formed at top while words merge; then drops
  const show = merged;
  const atBottom = falling;

  return (
    <motion.span
      className="absolute z-[4] text-[#d94f2b] font-black"
      style={{ left: BRAND_BANG_X }}
      initial={false}
      animate={
        !show
          ? { opacity: 0, scale: 0.2, y: "0.05em" }
          : !atBottom
            ? { opacity: 1, scale: 1, y: "0em" }
            : { opacity: 1, scale: 1, y: BRAND_COFFEE_Y }
      }
      transition={
        !show
          ? { duration: 0.15 }
          : !atBottom
            ? {
                // Born from the merge — grows as the words squash in
                opacity: { duration: 0.35, delay: 0.28 },
                scale: {
                  type: "spring",
                  stiffness: 380,
                  damping: 16,
                  mass: 0.7,
                  delay: 0.22,
                },
                y: { duration: 0.2 },
              }
            : {
                // Fall + settle
                y: { type: "spring", stiffness: 130, damping: 11, mass: 1.15 },
                scale: { type: "spring", stiffness: 260, damping: 14 },
                opacity: { duration: 0.1 },
              }
      }
    >
      !
    </motion.span>
  );
}

/**
 * The "!!" mark drawn as two exclamation marks whose dots blink like eyes.
 * When `blink` is true, the dots squash closed (like eyelids) and reopen.
 */
function BlinkingBangs({ blink }: { blink: boolean }) {
  return (
    <span className="inline-flex items-start">
      {[0, 1].map((i) => (
        <span key={i} className="relative inline-block leading-none">
          <span aria-hidden>!</span>
          {/* the dot — blinks like an eye */}
          <motion.span
            className="absolute left-1/2 -translate-x-1/2 block bg-current"
            style={{ bottom: "0.04em", width: "0.16em", height: "0.16em", borderRadius: "50%" }}
            animate={
              blink
                ? { scaleY: 0.08, opacity: 0.6, transition: { duration: 0.12, ease: "easeIn" } }
                : { scaleY: 1, opacity: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
            }
          />
        </span>
      ))}
    </span>
  );
}

function FeedbackSlide({ onBack, dir }: { onBack?: () => void; dir?: number }) {
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  // Blink the "!!" dots like eyes when the user scrolls on this last slide.
  const [blink, setBlink] = useState(false);
  const blinkLock = useRef(false);
  // Capture the direction once at mount time so the exit matches the entry
  // direction even if the user reverses direction while on this slide.
  const dirRef = useRef(dir ?? 1);
  const d = dirRef.current;
  // Directional fan: forward slides in from the right, back slides in from the left.
  const fromX = d > 0 ? 120 : -120;
  const toX = d > 0 ? -120 : 120;

  const triggerBlink = () => {
    if (blinkLock.current) return;
    blinkLock.current = true;
    setBlink(true);
    window.setTimeout(() => {
      setBlink(false);
      blinkLock.current = false;
    }, 900);
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: fromX, rotateY: d > 0 ? -14 : 14, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
      exit={{ opacity: 0, x: toX, rotateY: d > 0 ? 14 : -14, scale: 0.96 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1200 }}
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#12110f] text-[#f2f0ea] px-8"
      onWheel={(e) => {
        if (Math.abs(e.deltaY) < 10) return;
        triggerBlink();
      }}
    >
      <div className="absolute right-8 top-8 text-[18vw] font-black text-white/5 leading-none select-none pointer-events-none">
        <BlinkingBangs blink={blink} />
      </div>

      <div className="max-w-2xl w-full space-y-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-xs tracking-[6px] font-mono text-[#d94f2b] uppercase mb-6">
            Last slide
          </p>
          <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter">
            tell us how
            <br />
            was it!
          </h2>
          <p className="mt-6 font-serif italic text-white/50 text-lg">
            a cup, a ritual, a small signal — leave a note if you felt something.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (!note.trim()) return;
                setSent(true);
              }}
            >
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="it tasted like…"
                className="w-full bg-transparent border border-white/25 focus:border-[#d94f2b] outline-none p-5 text-lg font-serif italic placeholder:text-white/30 resize-none"
              />
              <button
                type="submit"
                className="px-10 py-5 bg-[#d94f2b] text-[#f2f0ea] text-xs tracking-widest font-mono hover:bg-[#f2f0ea] hover:text-[#12110f] transition-colors"
              >
                SEND THE SIGNAL
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="thanks"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-3xl md:text-4xl font-black tracking-tight text-[#d94f2b]">
                received.
              </p>
              <p className="font-serif italic text-white/50">
                thanks for moving with intent.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {onBack && (
        <button
          onClick={onBack}
          className="absolute bottom-8 left-8 text-[10px] tracking-[4px] font-mono text-white/40 hover:text-[#d94f2b] transition-colors uppercase"
        >
          ← prev
        </button>
      )}
    </motion.section>
  );
}

/**
 * Flip-clock / odometer number. When `value` changes, the old digit flips
 * down (rotates away) and the new digit flips in from the top — like a
 * split-flap clock. Used for the catalog page numbers.
 */
function FlipNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const [flipping, setFlipping] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current === value) return;
    prevRef.current = value;
    setFlipping(true);
    // Flip the top half down, then swap the digit and flip the bottom half in.
    const t = window.setTimeout(() => {
      setDisplay(value);
      setFlipping(false);
    }, 380);
    return () => window.clearTimeout(t);
  }, [value]);

  const text = String(display).padStart(2, "0");

  return (
    <div className="relative inline-block overflow-hidden leading-none">
      {/* static current digit */}
      <span
        className="block transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: flipping ? "rotateX(90deg)" : "rotateX(0deg)",
          transformOrigin: "center bottom",
        }}
      >
        {text}
      </span>
      {/* incoming digit flips in from the top */}
      <span
        aria-hidden
        className="absolute inset-0 block transition-transform duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: flipping ? "rotateX(0deg)" : "rotateX(-90deg)",
          transformOrigin: "center top",
          opacity: flipping ? 1 : 0,
        }}
      >
        {String(value).padStart(2, "0")}
      </span>
    </div>
  );
}

function CatalogSlide({
  product,
  index,
  total,
  onAdd,
  onAdvance,
  onBack,
  dir,
}: {
  product: (typeof products)[number];
  index: number;
  total: number;
  onAdd: () => void;
  onAdvance: () => void;
  onBack: () => void;
  dir?: number;
}) {
  const [revealed, setRevealed] = useState(false);

  // Capture the direction once at mount time so the exit always matches the
  // direction this slide entered with — even if the user reverses direction
  // while this slide is on screen.
  const dirRef = useRef(dir ?? 1);
  const d = dirRef.current;

  const panelPositions = [
    { top: "12%", left: "6%" },
    { top: "30%", right: "5%" },
    { bottom: "14%", left: "8%" },
    { bottom: "28%", right: "10%" },
  ];

  // Directional fan: forward (page down) slides in from the right,
  // back (page up) slides in from the left.
  const fromX = d > 0 ? 120 : -120;
  const toX = d > 0 ? -120 : 120;

  return (
    <motion.section
      initial={{ opacity: 0, x: fromX, rotateY: d > 0 ? -14 : 14, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
      exit={{ opacity: 0, x: toX, rotateY: d > 0 ? 14 : -14, scale: 0.96 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transformPerspective: 1200,
        background: index % 2 === 0 ? "#f2f0ea" : "#f8f4eb",
      }}
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <div className="absolute right-8 top-8 text-[18vw] font-black text-[#12110f]/5 leading-none select-none">
        <FlipNumber value={index + 1} />
      </div>

      <AnimatePresence>
        {revealed &&
          product.info.map((info, i) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, scale: 0.7, rotate: i % 2 === 0 ? -6 : 6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.23, 1, 0.32, 1] }}
              className="absolute z-20 w-40 md:w-52 bg-[#f2f0ea] border border-[#12110f] p-4 shadow-[8px_10px_0_rgba(18,17,15,0.12)]"
              style={panelPositions[i % panelPositions.length]}
            >
              <div className="text-[9px] tracking-[3px] font-mono text-[#d94f2b] uppercase mb-2">
                {info.label}
              </div>
              <div className="text-xl font-black text-[#12110f] leading-none">
                {info.value}
              </div>
            </motion.div>
          ))}
      </AnimatePresence>

      <div className="max-w-7xl w-full px-8 md:px-16 grid md:grid-cols-2 gap-12 items-center">
        <motion.div className="relative">
          <motion.button
            onClick={() => setRevealed((r) => !r)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
            className="block w-full cursor-pointer bg-transparent p-0 border-0 text-left"
            aria-label={`Toggle info for ${product.name}`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full aspect-[4/5] object-cover shadow-2xl"
            />
          </motion.button>
          <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[#d94f2b] mix-blend-multiply opacity-20" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="space-y-6"
        >
          <div className="uppercase tracking-[4px] text-xs font-mono text-[#d94f2b]">
            {product.origin}
          </div>
          <h2 className="text-5xl md:text-7xl font-black leading-none tracking-tighter text-[#12110f]">
            {product.name}
          </h2>
          <p className="text-2xl font-serif italic text-[#5c4033]">{product.note}</p>
          <p className="font-serif italic text-[#12110f]/50 text-lg">
            “{product.statement}”
          </p>

          <div className="flex items-center gap-8 pt-4">
            <div className="text-4xl font-black text-[#12110f]">${product.price}</div>
            <button
              onClick={onAdd}
              className="px-10 py-5 bg-[#12110f] text-white text-xs tracking-widest font-mono hover:bg-[#d94f2b] transition-colors"
            >
              ADD TO BAG
            </button>
          </div>

          <div className="flex items-center gap-8 pt-4 text-[10px] tracking-[4px] font-mono text-[#12110f]/40 uppercase">
            <button onClick={onBack} className="hover:text-[#d94f2b] transition-colors">
              ← prev
            </button>
            <span>
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <button onClick={onAdvance} className="hover:text-[#d94f2b] transition-colors">
              next →
            </button>
          </div>

          <div className="text-[10px] tracking-[4px] font-mono text-[#12110f]/40 uppercase pt-2">
            click the object to inspect · scroll to move
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
