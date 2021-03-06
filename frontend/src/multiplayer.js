const mainContainer = document.getElementById("container");
const container = document.getElementById("game-content");

const joinGameUrl = `${gamesUrl}add_user/`;
const getUsersUrl = `${usersUrl}users_in_game/`;
const gameDrawingsUrl = `${drawingsUrl}game_drawings/`;
const startGameUrl = `${gamesUrl}start_game/`;

function addMultiplayerButtons() {
  // Add one multiplayer button ->
  // next screen, join or create room ->
  const mBtn = document.createElement("button");
  mBtn.innerText = "Multiplayer game";
  mBtn.addEventListener("click", renderMultiplayerChoices);
  document.getElementById("game-content").appendChild(mBtn); // TODO: check order
}

function clearContent() {
  document.getElementById("game-content").innerHTML = "";
}

function renderMultiplayerChoices(e) {
  const div1 = document.getElementById("div-1");
  clearDiv(div1);
  const div2 = document.getElementById("div-2");
  clearDiv(div2);

  const newBtn = createBtnElement("newGame", "New game", "large-button");

  newBtn.addEventListener("click", newMultiplayerGame);

  const joinGameForm = document.createElement("form");
  const html = `
    <input type="text" name="code" placeholder="Enter Game Code">
    <input id="large-button" type="submit" value="Join">
  `;
  joinGameForm.innerHTML = html;
  joinGameForm.addEventListener("submit", (e) => {
    e.preventDefault();

    div1.remove();
    div2.remove();

    mainContainer.appendChild(createDiv("game-content"));

    joinGame(e.target.code.value);
  });

  div1.appendChild(newBtn);
  div2.appendChild(joinGameForm);
}

function newMultiplayerGame(e) {
  const mainContainer = document.getElementById("container");
  mainContainer.appendChild(createDiv("game-content"));
  const divs = document.querySelectorAll(`[data-action="div"]`);
  removeElements(divs);

  fetch(gamesUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      user: getUserId(), // User has ID, no username yet
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((json) => {
      renderLobby(json);
      addStartBtn();
    });
}

function setAsStarted() {
  fetch(startGameUrl + getUserId());
}

function addStartBtn() {
  const gameDiv = document.getElementById("game-content");
  const btn = createBtnElement("start", "Start Game", "large-button");

  btn.addEventListener("click", () => {
    setAsStarted();
  });

  gameDiv.appendChild(btn);
}

function joinGame(gameCode) {
  gameCode = gameCode.toUpperCase();
  fetch(joinGameUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      game: {
        code: gameCode,
        user_id: getUserId(),
      },
    }),
  })
    .then((res) => {
      if (res.status === 200) return res.json();
      return { error: `No game was found with code: ${gameCode}` };
    })
    .then((json) => {
      if (!json.error) renderLobby(json);
      else {
        alert(`No lobby found with code: ${gameCode}`);
        gameModeSelect();
      }
    });
}

function check_users() {
  fetch(getUsersUrl + getUserId())
    .then((res) => res.json())
    .then(console.dir);
}

function renderLobby(game) {
  const container = document.getElementById("container");
  container.className = "mp-lobby";

  const contentDiv = document.getElementById("game-content");
  contentDiv.innerHTML = `<h2>Room Code: <span class="purple">${game.code}</span></h2>`;

  // createMultiplayerHeader();
  // addGameCodeNode(game.code)

  // console.log(game);
  renderPlayerDivs(game.users, container);
  playerLobbyLongPoll(container);
}

function renderPlayerDivs(users, parent) {
  // saves players that are currently being displayed
  const currentPlayers = mainContainer.querySelectorAll(`[data-type="player"]`);
  let i = 1;

  if (currentPlayers) {
    i = currentPlayers.length + 1;
  }

  users.forEach((user) => {
    const userDiv = document.createElement("div");
    userDiv.dataset.type = "player";
    userDiv.dataset.id = user.id;
    // index is used to assign correct id
    userDiv.id = `player-${i}`;
    i++;

    const userElem = document.createElement("h1");
    userElem.innerHTML = userNameFromUser(user);

    userDiv.appendChild(userElem);
    parent.appendChild(userDiv);
  });
}

async function fetchUsersFromGame() {
  const response = await fetch(getUsersUrl + getUserId());

  return response.json();
}

async function playerLobbyLongPoll(lobby) {
  const clientSidePlayers = lobby.querySelectorAll(`[data-type="player"]`);
  const playerIds = [...clientSidePlayers].map((player) => player.dataset.id);

  const game = await fetchUsersFromGame();
  const serverSidePlayers = game.users;

  if (game.is_started === true) {
    // && player.count > 1
    removeElements(clientSidePlayers);
    startDrawing();
  } else if (serverSidePlayers.length === 6) {
    removeElements(clientSidePlayers);
    startDrawing();
  } else if (clientSidePlayers.length < serverSidePlayers.length) {
    const newUsers = serverSidePlayers.filter(
      (player) => !playerIds.includes(player.id.toString())
    );

    // add them to the dom
    renderPlayerDivs(newUsers, mainContainer);

    setTimeout(() => {
      playerLobbyLongPoll(lobby);
    }, 4000);
  } else if (clientSidePlayers.length === serverSidePlayers.length) {
    setTimeout(() => {
      playerLobbyLongPoll(lobby);
    }, 4000);
  }
}

function removeElements(elements) {
  elements.forEach((elem) => elem.remove());
}

async function fetchDrawingsFromGame() {
  const response = await fetch(gameDrawingsUrl + getUserId());

  return response.json();
}

function createMultiplayerHeader() {
  const container = document.getElementById("logo");
  const header = document.createElement("div");
  header.setAttribute("id", "game-header");
  container.append(header);
}

function addScoreNode() {
  const header = document.getElementById("game-header");
  const scoreNode = createScoreElem(getUsername(), 0);
  header.append(scoreNode);
  return scoreNode;
}

function addGameCodeNode(code) {
  const header = document.getElementById("game-header");
  const gameNode = document.createElement("h1");
  gameNode.innerHTML = `
    <h3><span id="code">${code}</span></h1>
  `;
  header.append(gameNode);
  return gameNode;
}

function removeGameCodeNode() {
  const codeNode = document.getElementById("code");
  codeNode.remove();
}

function incrementScore() {
  const scoreSpan = document.getElementById("score");
  scoreSpan.innerText = parseInt(scoreSpan.innerText) + 1;
}

function startDrawing() {
  const gameContent = document.getElementById("game-content");
  clearDiv(gameContent);

  createDrawTimer(gameContent, "mp");
  createCanvas(gameContent);
  addUploadButton(gameContent, "mp");
  drawingLongPoll();
}

async function fetchUser() {
  const response = await fetch(usersUrl + getUserId());

  return response.json();
}

async function drawingLongPoll() {
  const game = await fetchUsersFromGame();
  const players = game.users;
  const drawings = await fetchDrawingsFromGame();
  const user = await fetchUser();

  if (players.length === drawings.length) {
    // continue to guessing phase
    checkTurn(drawings, user.game_id);
  } else {
    setTimeout(() => {
      drawingLongPoll();
    }, 4000);
  }
}

// beforehand, fetch all drawings for this game
function checkTurn(drawings, gameId) {
  // Let's sort this just to be careful
  // We need every user to see the same drawing
  drawings.sort((a, b) => a.id > b.id);
  if (drawings.length == 0) {
    endGame();
    // return;
  } else {
    handleDrawingPrompt(drawings, gameId);
  }
}

function endGame() {
  const leftDiv = document.getElementById("game-content");
  const rightDiv = document.getElementById("score");

  leftDiv.innerHTML = "Game is over! ";
  leftDiv.appendChild(createBtnElement("start-over", "Start Over"));

  leftDiv.addEventListener("click", (e) => {
    if (e.target.dataset.action === "start-over") {
      gameModeSelect();
    }
  });
}
