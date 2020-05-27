const promptUrl = "http://localhost:3000/prompts";
const gameUrl = "http://localhost:3000/games";
const drawingUrl = "http://localhost:3000/drawings";

function handleDrawingPrompt(drawings, game_id) {
  let drawing = drawings[0];
  let gameContent = document.getElementById("game-content");
  if (checkUserMatchesDrawing(drawing)) {
    renderUserStall(gameContent, "This is your drawing!");
    hasAllPromptsPollCycle(drawing, game_id, drawings);
  } else {
    // TODO: time out user after 30 seconds
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
  return fetch(`${drawingUrl}/${drawing.id}/prompt_count`)
    .then((res) => res.json())
    .then((json) => json.count)
    .then((drawingCount) => {
      return fetch(`${gameUrl}/user_count/${game_id}`)
        .then((res) => res.json())
        .then((json) => json.count)
        .then((userCount) => {
          return parseInt(userCount) <= parseInt(drawingCount);
        });
    });
}

// upload a prompt for a given drawing
function uploadPrompt(drawing, prompt) {
  return fetch(promptUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
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
	<label>New Prompt</label>
	<input type="text" name="prompt" value="Suggest a name">
	<input type="submit">
	`;

  clearDiv(contentDiv);
  // TODO: taken from display-image.js... refactor?
  renderImage(drawing, contentDiv);

  contentDiv.append(promptForm);
  return promptForm;
}
