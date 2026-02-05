const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");

// عند الضغط على YES
yesBtn.addEventListener("click", () => {
  document.body.innerHTML = `
    <div style="text-align:center; padding:40px;">
      <h1 style="font-size:44px;">❤️ YAY!!! ❤️</h1>
      <p style="font-size:20px;">Best decision ever 😘</p>
      <h2 style="margin-top:20px;">I love you ❤️</h2>
    </div>
  `;
});

// زر NO يهرب
noBtn.addEventListener("mouseover", () => {
  const x = Math.random() * (window.innerWidth - 120);
  const y = Math.random() * (window.innerHeight - 60);

  noBtn.style.position = "absolute";
  noBtn.style.left = x + "px";
  noBtn.style.top  = y + "px";
});
