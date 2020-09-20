// To test, try something like:
// handlePromptGuesses(testDrawings[0], 1)

// Overall guessing functionality
function handlePromptGuesses(drawings, game_id) {
  let drawing = drawings.shift();
  let containerDiv = document.getElementById("game-content");
  let mainContainer = document.getElementById("container");
  getPrompts(drawing).then((prompts) => {
    getCorrectPromptId(drawing).then((correctPromptId) => {
      renderImage(drawing, containerDiv);
      const promptDiv = displayPrompts(
        prompts,
        correctPromptId,
        mainContainer,
        game_id
      );
      if (checkUserMatchesDrawing(drawing)) {
        renderUserStall(containerDiv, "People are guessing on your drawing");
        hasAllGuessesPollCycle(drawing, game_id, drawings);
      } else {
        const instruction = document.createElement("p");
        instruction.innerText = "Guess the real name!";
        containerDiv.appendChild(instruction);
        addGuessHandler(promptDiv, function (promptId, isCorrect) {
          submitGuess(drawing, promptId, isCorrect).then(() => {
            clearDiv(containerDiv);
            renderUserStall(containerDiv, "Waiting for all guesses to come in");
            hasAllGuessesPollCycle(drawing, game_id, drawings);
          });
        });
      }
    });
  });
}

// Overly simple: just adds empty Guess object (to increase count of guesses)
function submitGuess(drawing, promptId, isCorrect) {
  return fetch(`${drawingsUrl}${drawing.id}/add_guess`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      user_id: getUserId(),
      prompt_id: promptId,
      is_correct: isCorrect,
    }),
  })
    .then((res) => res.json())
    .then((json) => console.log("guess submitted", json));
}

function hasAllGuessesPollCycle(drawing, game_id, drawings) {
  promptsHaveAllGuesses(drawing, game_id).then((is_done) => {
    if (is_done) {
      clearPage();
      // checkTurn(drawings, game_id);
      showScoreScreen(drawings, game_id, drawing);
    } else {
      // wait 3 seconds & try again
      setTimeout(
        () => hasAllGuessesPollCycle(drawing, game_id, drawings),
        3000
      );
    }
  });
}

// TODO: not a lot of error checking here
// Checks the number of guesses made against the number of users
function promptsHaveAllGuesses(drawing, game_id) {
  return fetch(`${drawingsUrl}${drawing.id}/guess_count`)
    .then((res) => res.json())
    .then((json) => {
      const guessCount = json.count;
      return fetch(`${gamesUrl}user_count/${game_id}`)
        .then((res) => res.json())
        .then((json) => {
          const userCount = json.count;
          // User who created the picture will not guess
          return parseInt(userCount) <= guessCount + 1;
        });
    });
}

// All prompts for a given drawing
function getPrompts(drawing) {
  return fetch(`${drawingsUrl}${drawing.id}/prompts`)
    .then((res) => res.json())
    .then((json) => {
      return json.prompts;
    });
}

// Correct prompt id for a given drawing
function getCorrectPromptId(drawing) {
  return fetch(`${drawingsUrl}${drawing.id}/correct_prompt`)
    .then((res) => res.json())
    .then((json) => json.correct);
}

// Add prompts to containerDiv
function displayPrompts(prompts, correctPromptId, containerDiv, game_id) {
  const image = {
    prompt_id: correctPromptId,
  };

  containerDiv.className = "sp-guess";

  const promptDiv = document.createElement("div");
  promptDiv.id = "prompts";
  containerDiv.appendChild(promptDiv);

  let correct_prompt = null;
  prompts.forEach((prompt) => {
    if (prompt.id == image.prompt_id) {
      correct_prompt = prompt;
    }
  });
  appendPromptSet(correct_prompt, prompts, promptDiv, game_id);
  return promptDiv;
}

// Handle click on any prompt
function addGuessHandler(promptDiv, onGuessCallback) {
  // TAKEN from display-image
  let isCorrect = false;
  promptDiv.addEventListener("click", (e) => {
    if (e.target.dataset.action === "guess") {
      if (e.target.dataset.correct === "true") {
        // incrementScore()
        changeElementColor(e.target, "green");
        isCorrect = true;
      } else {
        const correctAns = promptDiv.querySelector(`[data-correct="true"]`);
        changeElementColor(correctAns, "green");
        changeElementColor(e.target, "red");
      }
    }
    const promptId = e.target.dataset.id;
    // TODO: maybe make this so it is not an ugly callback?
    onGuessCallback(promptId, isCorrect);
  });
}
