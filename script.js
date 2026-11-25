const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const note = document.getElementById("note");
const yesView = document.getElementById("yesView");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// What the No button says each time it runs away
const noLines = [
  "No",
  "Are you sure?",
  "Really sure?",
  "Think again",
  "Aya, please",
  "Look at the other button",
  "Last chance",
  "Not this one"
];

let tries = 0;
let tx = 0;
let ty = 0;
let lastDodge = 0;

// The No button runs away: works with a mouse, a finger, and the keyboard
function dodge(event) {
  if (event) event.preventDefault();
  const now = Date.now();
  if (now - lastDodge < 350) return; // a tap fires pointerdown + click; count it once
  lastDodge = now;
  tries += 1;

  if (tries >= noLines.length) {
    noBtn.style.opacity = "0";
    noBtn.style.pointerEvents = "none";
    noBtn.setAttribute("aria-hidden", "true");
    noBtn.tabIndex = -1;
    note.hidden = false;
    yesBtn.focus({ preventScroll: true });
    return;
  }

  noBtn.textContent = noLines[tries];

  const rect = noBtn.getBoundingClientRect();
  const baseLeft = rect.left - tx;
  const baseTop = rect.top - ty;
  const margin = 16;
  const maxX = window.innerWidth - rect.width - margin;
  const maxY = window.innerHeight - rect.height - margin;
  const yes = yesBtn.getBoundingClientRect();

  let x = margin;
  let y = margin;
  for (let i = 0; i < 30; i += 1) {
    x = margin + Math.random() * Math.max(0, maxX - margin);
    y = margin + Math.random() * Math.max(0, maxY - margin);
    const overlapsYes =
      x < yes.right + 24 && x + rect.width > yes.left - 24 &&
      y < yes.bottom + 24 && y + rect.height > yes.top - 24;
    const farEnough = Math.hypot(x - rect.left, y - rect.top) > 140;
    if (!overlapsYes && farEnough) break;
  }

  tx = x - baseLeft;
  ty = y - baseTop;
  noBtn.style.transform = `translate(${tx}px, ${ty}px)`;

  // Yes grows a little every time she tries to say no
  yesBtn.style.setProperty("--grow", Math.min(1 + tries * 0.07, 1.5).toFixed(2));
}

noBtn.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") dodge(); });
noBtn.addEventListener("pointerdown", dodge);
noBtn.addEventListener("click", dodge);

window.addEventListener("resize", () => {
  tx = 0;
  ty = 0;
  noBtn.style.transform = "";
});

// Petals fall once when she says yes
function petalRain() {
  if (reduceMotion) return;
  const colours = ["#ff8fa3", "#ffd9df", "#fff4f2", "#f2c14e", "#ff5c7a"];
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 46; i += 1) {
    const p = document.createElement("span");
    p.className = "petal";
    p.style.setProperty("--x", `${Math.random() * 100}vw`);
    p.style.setProperty("--s", `${10 + Math.random() * 14}px`);
    p.style.setProperty("--c", colours[i % colours.length]);
    p.style.setProperty("--dur", `${3.6 + Math.random() * 3}s`);
    p.style.setProperty("--delay", `${Math.random() * 1.8}s`);
    p.style.setProperty("--dx", `${(Math.random() - 0.5) * 180}px`);
    p.style.setProperty("--rot", `${(Math.random() - 0.5) * 1080}deg`);
    p.addEventListener("animationend", () => p.remove());
    frag.appendChild(p);
  }
  document.body.appendChild(frag);
}

function sayYes() {
  document.body.classList.add("said-yes");
  yesView.hidden = false;
  petalRain();
  document.getElementById("yesTitle").focus({ preventScroll: true });
}

yesBtn.addEventListener("click", sayYes);

// Opening the link with #yes shows the answer screen directly
if (location.hash === "#yes") sayYes();
