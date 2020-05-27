function gameModeSelect() {
  const gameDiv = createDiv("game-content");
  const container = document.getElementById("container");
  container.className = "h-select";

  const gameButtonDiv = createDiv("div-1", "div");
  gameButtonDiv.appendChild(createBtnElement("sp", "Play Alone"));
  gameButtonDiv.appendChild(createBtnElement("mp", "Play With Friends"));
  container.appendChild(gameButtonDiv);

  const usernameDiv = createDiv("div-2", "div");
  usernameDiv.appendChild(createUsernameForm(usernameDiv))
  container.appendChild(usernameDiv);

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
