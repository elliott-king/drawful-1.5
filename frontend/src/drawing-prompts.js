const promptUrl = "http://localhost:3000/prompts";
const drawingUrl = "http://localhost:3000/drawings";
const testDrawingsShort = [
  {
    id: 9,
    file: "IMG_8201.JPG",
    user_id: 4,
    created_at: "2020-05-22T17:32:22.150Z",
    updated_at: "2020-05-22T17:32:22.150Z",
    prompt_id: null,
    game_id: null,
  },
  {
    id: 10,
    file: "IMG_8203.JPG",
    user_id: 4,
    created_at: "2020-05-22T17:32:22.175Z",
    updated_at: "2020-05-22T17:32:22.175Z",
    prompt_id: null,
    game_id: null,
  },
];
const testDrawings = [
  {
    id: 9,
    file: "IMG_8201.JPG",
    user_id: 4,
    created_at: "2020-05-22T17:32:22.150Z",
    updated_at: "2020-05-22T17:32:22.150Z",
    prompt_id: null,
    game_id: null,
  },
  {
    id: 10,
    file: "IMG_8203.JPG",
    user_id: 4,
    created_at: "2020-05-22T17:32:22.175Z",
    updated_at: "2020-05-22T17:32:22.175Z",
    prompt_id: null,
    game_id: null,
  },
  {
    id: 11,
    file: "1ba812d6-588f-4010-8dbb-dc61eabe61d2.png",
    user_id: 4,
    created_at: "2020-05-22T17:32:45.690Z",
    updated_at: "2020-05-22T17:32:45.690Z",
    prompt_id: null,
    game_id: null,
  },
  {
    id: 12,
    file: "471c0813-fc34-4637-9454-2ea86009aee3.png",
    user_id: 4,
    created_at: "2020-05-22T17:36:42.445Z",
    updated_at: "2020-05-22T17:36:42.445Z",
    prompt_id: null,
    game_id: null,
  },
  {
    id: 13,
    file: "014e942e-2202-4a8b-a021-ba6097e10be7.png",
    user_id: 4,
    created_at: "2020-05-22T19:26:25.556Z",
    updated_at: "2020-05-22T19:26:25.556Z",
    prompt_id: null,
    game_id: null,
  },
  {
    id: 14,
    file: "a2cad0d5-88e5-4a05-be17-6b7de24cce75.png",
    user_id: 4,
    created_at: "2020-05-22T19:27:46.550Z",
    updated_at: "2020-05-22T19:27:46.550Z",
    prompt_id: null,
    game_id: null,
  },
  {
    id: 15,
    file: null,
    user_id: 4,
    created_at: "2020-05-25T16:39:41.244Z",
    updated_at: "2020-05-25T16:39:41.244Z",
    prompt_id: null,
    game_id: 1,
  },
  {
    id: 16,
    file: "55c0d214-9a7d-411f-896d-2e96864841ed.png",
    user_id: 39,
    created_at: "2020-05-25T18:02:26.908Z",
    updated_at: "2020-05-25T18:04:09.222Z",
    prompt_id: null,
    game_id: null,
  },
];
// NOTE: testing data only

// To test this, comment out everything in index.js, and add handleDrawingPrompt(testDrawings[7], 1)
// You may have to change the game_id depending on your db
// You can also put your user_id in one of the test drawings, to try that route if you want
function handleDrawingPrompt(drawings, game_id) {
  let drawing = drawings[0];
  let gameContent = document.getElementById("game-content");
  if (checkUserMatchesDrawing(drawing)) {
    renderUserStall(gameContent, "This is your drawing!");
    hasAllPromptsPollCycle(drawing, game_id, drawing);
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
  let div = document.getElementById("game-content");
  clearDiv(div);
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

