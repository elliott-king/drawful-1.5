// To test, try something like:
// handlePromptGuesses(testDrawings[0], 1)

// Overall guessing functionality
function handlePromptGuesses(drawings, game_id) {
  let drawing = drawings.shift()
  let containerDiv = document.getElementById('game-content')
  if (checkUserMatchesDrawing(drawing)) {
    renderUserStall(containerDiv, 'People are guessing on your drawing')
    hasAllGuessesPollCycle(drawing, game_id)
  } else {
    getPrompts(drawing).then((prompts) => {
      getCorrectPromptId(drawing).then(correctPromptId => {
        renderImage(drawing, containerDiv)
        const promptDiv = displayPrompts(prompts, correctPromptId, containerDiv)
        addGuessHandler(promptDiv, () => {
          submitGuess(drawing).then(() => {
            clearDiv(containerDiv)
            renderUserStall(containerDiv, 'Waiting for all guesses to come in')
            hasAllGuessesPollCycle(drawing, game_id, drawings)
          })
        })
      })
    })
  }
}

// Overly simple: just adds empty Guess object (to increase count of guesses)
function submitGuess(drawing) {
  return fetch(`${drawingUrl}/${drawing.id}/add_guess`, {method: 'POST'})
  .then(res => res.json())
  .then(json => console.log("guess submitted"))
}

function hasAllGuessesPollCycle(drawing, game_id, drawings) {
  promptsHaveAllGuesses(drawing, game_id)
    .then(is_done => {
      if (is_done) {
        clearPage
        checkTurn(drawings, game_id)
      } else {
        // wait 3 seconds & try again
        setTimeout(() => hasAllGuessesPollCycle(drawing, game_id, drawings), 3000)
      }
  })
}

// TODO: not a lot of error checking here
// Checks the number of guesses made against the number of users
function promptsHaveAllGuesses(drawing, game_id) {
  return fetch(`${drawingUrl}/${drawing.id}/guess_count`)
    .then(res => res.json())
    .then(json => {
      const guessCount = json.count
      console.log('guess count json', json)
      return fetch(`${gameUrl}/user_count/${game_id}`)
        .then(res => res.json())
        .then(json => {
          console.log('user count json', json)
          const userCount = json.count
          // User who created the picture will not guess
          return (parseInt(userCount) <= guessCount + 1)
        })
    })
}

// All prompts for a given drawing
function getPrompts(drawing) {
  return fetch(`${drawingUrl}/${drawing.id}/prompts`)
    .then(res => res.json())
    .then(json => {
      console.log(json)
      return json.prompts
    })
}

// Correct prompt id for a given drawing
function getCorrectPromptId(drawing) {
  return fetch(`${drawingUrl}/${drawing.id}/correct_prompt`)
    .then(res => res.json())
    .then(json => json.correct)
}

// Add prompts to containerDiv
function displayPrompts(prompts, correctPromptId, containerDiv) {
  const image = {
    prompt_id: correctPromptId
  }

  const promptDiv = document.createElement("div");
  promptDiv.id = "prompts";
  containerDiv.appendChild(promptDiv)

  let correctPromptElement = null
  prompts.forEach(prompt => {
    if (prompt.id == image.prompt_id) correctPromptElement = createPromptElement(image, prompt)
  })
  // FIXME: appendPromptSet automatically is size 4.
  // Should size to # of players
  appendPromptSet(correctPromptElement, prompts, promptDiv)
  return promptDiv
}

// Handle click on any prompt
function addGuessHandler(promptDiv, onGuessCallback) {
  // TAKEN from display-image
  promptDiv.addEventListener("click", (e) => {
    if (e.target.dataset.action === "guess") {
      // TODO: increment score

      // const scoreElement = document.getElementById("score");
      // imagesShown++;

      if (e.target.dataset.correct === "true") {
        // score++;
        changeElementColor(e.target, "green");
        console.log('You guessed right!')
      } else {
        const correctAns = promptDiv.querySelector(`[data-correct="true"]`);
        changeElementColor(correctAns, "green");
        changeElementColor(e.target, "red");
        console.log('You guessed wrong, sucker')
      }

    }
    // TODO: send to backend whether or not this is correct
    // Currently oversimplified
    onGuessCallback()
  });
}