function setUsernameOrPlay() {
  if (usernameExists()) {
    gameModeSelect();
  } else {
    showUsernameForm();
  }
}

function showUsernameForm() {
  const container = document.getElementById("container");
  const gameDiv = createDiv("game-content", "game");
  setGrid("sp-draw");
  const form = createUsernameForm(gameDiv);

  container.appendChild(gameDiv);
  gameDiv.appendChild(form);
}

function gameModeSelect() {
  removeGame();
  removeScores();
  const container = document.getElementById("container");
  const gameDiv = createDiv("game-content");
  container.className = "h-select";

  const spDiv = createDiv("div-1", "div");
  spDiv.appendChild(createBtnElement("sp", "Play Alone", "large-button"));
  container.appendChild(spDiv);

  const mpDiv = createDiv("div-2", "div");
  mpDiv.appendChild(
    createBtnElement("mp", "Play With Friends", "large-button")
  );
  container.appendChild(mpDiv);

  // const usernameDiv = createDiv("div-2", "div");
  // usernameDiv.appendChild(createUsernameForm(usernameDiv));

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

function createBtnElement(action, text, id) {
  const btn = document.createElement("button");

  if (id) {
    btn.id = id;
  }

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
