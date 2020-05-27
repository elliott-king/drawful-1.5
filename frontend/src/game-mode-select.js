function gameModeSelect() {
  const gameDiv = createDiv("game-content");
  const container = document.getElementById("container");
  container.className = "h-select";

  const spDiv = createDiv("div-1", "div");
  spDiv.appendChild(createBtnElement("sp", "Play Alone"));
  container.appendChild(spDiv);

  const mpDiv = createDiv("div-2", "div");
  mpDiv.appendChild(createBtnElement("mp", "Play With Friends"));
  container.appendChild(mpDiv);

  container.addEventListener("click", (e) => {
    // console.dir(e.target.dataset.action);
    if (e.target.dataset.action === "sp") {
      container.appendChild(gameDiv);

      spDiv.remove();
      mpDiv.remove();

      createCanvas(gameDiv);
      addUploadButton(gameDiv, "sp");
    } else if (e.target.dataset.action === "mp") {
      // container.appendChild(createDiv("game-content"));

      // spDiv.remove();
      // mpDiv.remove();

      renderMultiplayerChoices();
    }
  });
}

function createBtnElement(action, text) {
  const btn = document.createElement("button");

  if (action) {
    btn.dataset.action = action;
  }

  btn.textContent = text;

  return btn;
}

function createDiv(id, action) {
  const div = document.createElement("div");
  div.id = id;

  if (action) {
    div.dataset.action = action;
  }

  return div;
}
