
function handleDrawingPrompt(drawings, game_id) {
  let drawing = drawings[0];
  let gameContent = document.getElementById("game-content");
  clearDiv(gameContent);
  renderImage(drawing, gameContent);
  if (checkUserMatchesDrawing(drawing)) {
    removeScores();
    setGrid("sp-draw");
    renderUserStall(gameContent, "Players are viewing your Drawing!");
    hasAllPromptsPollCycle(drawing, game_id, drawings);
  } else {
    // TODO: time out user after 30 seconds
    removeScores();
    setGrid("sp-draw");
    const promptForm = createPromptForm(drawing, gameContent);
    promptForm.addEventListener("submit", (event) => {
      event.preventDefault();
      uploadPrompt(drawing, event.target.prompt.value).then(() => {
        clearDiv(gameContent);
        renderUserStall(gameContent, "Waiting for other players...");
        hasAllPromptsPollCycle(drawing, game_id, drawings);
      });
    });
  }
}

function setGrid(grid) {
  const container = document.getElementById("container");
  container.className = grid;
}

function clearPage() {
  clearGameContent();
  removePrompts();
}

function clearGameContent() {
  const gameContent = document.getElementById("game-content");

  clearDiv(gameContent);
}

function removePrompts() {
  const prompDiv = document.getElementById("prompts");

  if (prompDiv) {
    prompDiv.remove();
  }
}

function removeGame() {
  const gameDiv = document.getElementById("game-content");

  if (gameDiv) {
    gameDiv.remove();
  }
}

function removeScores() {
  const scoreDiv = document.getElementById("score");

  if (scoreDiv) {
    scoreDiv.remove();
  }
}

function checkUserMatchesDrawing(drawing) {
  return getUserId() == drawing.user_id;
}

function renderUserStall(div, text) {
  const stall = document.createElement("p");
  stall.innerText = text;
  div.appendChild(stall);
}

// continually checks if all prompts are in
function hasAllPromptsPollCycle(drawing, game_id, drawings) {
  // todo: verify we don't go too deep
  drawingHasAllPrompts(drawing, game_id).then((is_done) => {
    if (is_done) {
      clearPage();
      // debugger
      handlePromptGuesses(drawings, game_id);
    } else {
      // wait 3 seconds & try again
      setTimeout(
        () => hasAllPromptsPollCycle(drawing, game_id, drawings),
        3000
      );
    }
  });
}

// get number of submitted prompts & users, then compare the two vals
function drawingHasAllPrompts(drawing, game_id) {
  return fetch(`${drawingsUrl}${drawing.id}/prompt_count`)
    .then((res) => res.json())
    .then((json) => json.count)
    .then((drawingCount) => {
      return fetch(`${gamesUrl}user_count/${game_id}`)
        .then((res) => res.json())
        .then((json) => json.count)
        .then((userCount) => {
          return parseInt(userCount) <= parseInt(drawingCount);
        });
    });
}

// upload a prompt for a given drawing
function uploadPrompt(drawing, prompt) {
  return fetch(promptsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      user_id: getUserId(),
      drawing: drawing.id,
      is_correct: false,
      title: prompt,
    }),
  })
    .then((res) => {
      console.log("prompt response,", res);
      if (res.status !== 200) {
        console.error("Creation of new prompt failed!", res);
      }
      return res.json();
    })
    .then((json) => {
      console.log("prompt response json,", json);
    });
}

// show form on DOM & return it
function createPromptForm(drawing, contentDiv) {
  promptForm = document.createElement("form");
  promptForm.innerHTML = `
  <p>Give a name to this drawing</p>
	<input type="text" name="prompt" placeholder="Suggest a name">
	<input type="submit">
	`;

  contentDiv.append(promptForm);
  return promptForm;
}
