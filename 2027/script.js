// Twelve stars for twelve months: tap the glowing star to connect the heart.

const promises = [
  ["January", "To begin this year the way I want to begin every year for the rest of my life: loving you more than I did the year before."],
  ["February", "To be your Valentine again, and to hold your hand like it's the very first time I ever held it."],
  ["March", "To give you the new phone you deserve, so every \"good morning\", every \"I miss you\" and every \"I love you\" reaches you a little faster."],
  ["April", "To find our home. A door that's ours, a light that's always on, and no more saying goodbye to you at the end of the night."],
  ["May", "To build that home with you, piece by piece, until every corner of it feels like us."],
  ["June", "To fall asleep beside you and wake up to your face, every single morning, for the rest of my life."],
  ["July", "To make you laugh in our kitchen, dance with you in our living room, and turn ordinary days into our favourite memories."],
  ["August", "To hold you close on the hard days and remind you that you will never carry anything alone again."],
  ["September", "To keep dreaming with you about our own little family: children with your smile, your kindness, and our love in their hearts."],
  ["October", "To be the husband you're proud of today, and one day, the father our children run to."],
  ["November", "To thank God for you every day, because you are the answer to prayers I didn't even know how to say."],
  ["December", "To end this year in our own home, with you in my arms, and our forever only just beginning."]
];

const NS = "http://www.w3.org/2000/svg";
const starsG = document.getElementById("stars");
const linesG = document.getElementById("lines");
const monthEl = document.getElementById("month");
const promiseEl = document.getElementById("promise");
const countEl = document.getElementById("count");
const barEl = document.getElementById("bar");
const finale = document.getElementById("finale");

// Twelve points around a heart curve, starting at the top centre and going clockwise
const points = promises.map((_, k) => {
  const t = (k * 2 * Math.PI) / promises.length;
  const x = 16 * Math.sin(t) ** 3;
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  return [x, y];
});

let step = 0;
const starEls = [];

function el(tag, attrs) {
  const node = document.createElementNS(NS, tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

points.forEach(([x, y], k) => {
  const g = el("g", { class: "star", "data-k": k, "aria-label": `${promises[k][0]} star` });
  g.appendChild(el("circle", { class: "halo", cx: x, cy: y, r: 1.8 }));
  g.appendChild(el("circle", { class: "core", cx: x, cy: y, r: 0.62 }));
  g.appendChild(el("circle", { class: "hit", cx: x, cy: y, r: 2.6 }));
  // month initial sits outside the heart
  const len = Math.hypot(x, y - 2) || 1;
  const label = el("text", { class: "label", x: x + ((x) / len) * 2.6, y: y + ((y - 2) / len) * 2.6 + 0.4 });
  label.textContent = promises[k][0].slice(0, 3);
  g.appendChild(label);
  g.addEventListener("click", () => tap(k));
  g.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tap(k); }
  });
  starsG.appendChild(g);
  starEls.push(g);
});

function line(a, b) {
  const [x1, y1] = points[a];
  const [x2, y2] = points[b];
  linesG.appendChild(el("path", { class: "link", d: `M${x1} ${y1} L${x2} ${y2}`, pathLength: 1 }));
}

function setNext() {
  starEls.forEach((s, k) => {
    const isNext = k === step;
    s.classList.toggle("next", isNext);
    s.setAttribute("tabindex", isNext ? "0" : "-1");
    s.setAttribute("role", isNext ? "button" : "img");
  });
}

function show(month, text) {
  monthEl.textContent = month;
  promiseEl.textContent = text;
  [monthEl, promiseEl].forEach((n) => { n.classList.remove("swap"); void n.offsetWidth; n.classList.add("swap"); });
}

function tap(k) {
  if (k !== step) {
    promiseEl.textContent = "Try the glowing star.";
    return;
  }
  const s = starEls[k];
  s.classList.remove("next");
  s.classList.add("done");
  if (k > 0) line(k - 1, k);
  show(promises[k][0], promises[k][1]);
  step += 1;
  countEl.textContent = `${step} of ${promises.length} stars`;
  barEl.style.transform = `scaleX(${step / promises.length})`;

  if (step === promises.length) {
    line(promises.length - 1, 0); // close the heart
    starEls.forEach((st) => { st.setAttribute("tabindex", "-1"); st.setAttribute("role", "img"); });
    setTimeout(() => document.body.classList.add("complete"), 300);
    setTimeout(openFinale, 1800);
    return;
  }
  setNext();
  starEls[step].focus({ preventScroll: true });
}

function openFinale() {
  document.body.classList.add("finale-open");
  finale.hidden = false;
  document.getElementById("finaleTitle").focus({ preventScroll: true });
}

document.getElementById("again").addEventListener("click", () => {
  finale.hidden = true;
  document.body.classList.remove("complete", "finale-open");
  linesG.innerHTML = "";
  starEls.forEach((s) => s.classList.remove("done"));
  step = 0;
  countEl.textContent = `0 of ${promises.length} stars`;
  barEl.style.transform = "scaleX(0)";
  show("Your stars are waiting", "Start with the brightest star in the heart.");
  setNext();
  starEls[0].focus({ preventScroll: true });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !finale.hidden) document.getElementById("again").click();
});

setNext();

// A still field of background stars, drawn once per resize
const canvas = document.getElementById("sky");
function drawSky() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  let seed = 2027;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const count = Math.round((w * h) / 5200);
  for (let i = 0; i < count; i += 1) {
    const x = rnd() * w;
    const y = rnd() * h;
    const r = rnd() < 0.92 ? 0.4 + rnd() * 0.7 : 1.1 + rnd() * 0.8;
    ctx.globalAlpha = 0.25 + rnd() * 0.6;
    ctx.fillStyle = rnd() < 0.15 ? "#ffe2a3" : "#e9e4f5";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
drawSky();
let resizeTimer;
window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(drawSky, 150); });

// Preview helper: open with #done to see the finished heart
if (location.hash === "#done") promises.forEach((_, k) => tap(k));
