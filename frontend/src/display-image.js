function displayImage() {
  const container = document.getElementById("container");
  container.className = "sp-guess";

  const promptDiv = document.createElement("div");
  promptDiv.id = "prompts";

  const contentDiv = document.getElementById("game-content");
  let score = 0;
  let imagesShown = 0;

  function fetchImage() {
    fetch(drawingsUrl)
      .then((res) => res.json())
      .then(gameLoop);
  }

  function gameLoop(image) {
    if (imagesShown < 5) {
      // clear content in relevant divs
      clearDiv(contentDiv);
      clearDiv(promptDiv);

      // create image element and append that element
      const randomImg = selectRandom(image);
      renderImage(randomImg, contentDiv);

      // passing in the displayed image
      renderPrompts(randomImg);
    } else {
      clearDiv(promptDiv);

      displayScore();
    }
  }

  function displayScore() {
    promptDiv.prepend(createScoreElem(getUsername(), score));
    promptDiv.appendChild(createStartOverBtn);
  }

  async function fetchPrompts() {
    // response awaits the completion of the fetch request before storing the return value
    const response = await fetch(promptsUrl);

    // returns the json
    return response.json();
  }

  async function renderPrompts(image) {
    // fetchPrompts returns a promise. the await keyword forces allPrompts to wait until the promise is resolved
    let allPrompts = await fetchPrompts();
    const correctPrompt = createPromptElement(image, image.prompt);

    appendPromptSet(createPromptElement(correctPrompt), allPrompts, promptDiv);

    container.appendChild(promptDiv);
  }

  promptDiv.addEventListener("click", (e) => {
    if (e.target.dataset.action === "guess") {
      const scoreElement = document.getElementById("score");
      imagesShown++;

      if (e.target.dataset.correct === "true") {
        score++;
        changeElementColor(e.target, "green");
      } else {
        const correctAns = promptDiv.querySelector(`[data-correct="true"]`);
        changeElementColor(correctAns, "green");
        changeElementColor(e.target, "red");
      }

      fetchImage();
    } else if (e.target.value === "start over") {
      clearDiv(contentDiv);
      promptDiv.remove();

      createCanvas(contentDiv);
      addUploadButton(contentDiv);
    }
  });

  fetchImage();
}

function clearDiv(div) {
  div.innerHTML = "";
}

function selectRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function renderImage(image, parent) {
  console.dir(image);

  const imageDiv = document.createElement("div");
  const imageOwner = document.createElement("h3");
  imageOwner.innerHTML = `Drawn by: ${userNameFromUser(image.user)}`;

  const imageElement = document.createElement("img");
  imageElement.src = `${url}images/` + image.file;
  // imageElement.src = "assets/" + image.file;

  imageDiv.appendChild(imageOwner);
  imageDiv.appendChild(imageElement);

  parent.appendChild(imageDiv);
}

function createScoreElem(username, score) {
  const scoreElement = document.createElement("h3");
  scoreElement.innerHTML = `
    <h3>${username}'s score: <span id="score">${score}</span></h3>
  `;

  return scoreElement;
}

function createStartOverBtn() {
  const startOverBtn = document.createElement("button");
  startOverBtn.value = "start over";
  startOverBtn.innerHTML = "Start Over";

  return startOverBtn;
}

function createPromptElement(image, prompt) {
  const promptElement = document.createElement("h2");
  promptElement.dataset.correct =
    image.prompt_id === prompt.id ? "true" : "false";
  promptElement.dataset.action = "guess";
  promptElement.innerHTML = prompt.title.toLowerCase();
  promptElement.dataset.id = prompt.id;

  return promptElement;
}

async function fetchGameInfo(game_id) {
  const response = await fetch(`${gamesUrl}find_game/${game_id}`);

  return response.json();
}

async function appendPromptSet(
  correctPrompt,
  allPrompts,
  promptDiv,
  game_id
) {

  let promptArray = [correctPrompt]
  const game = await fetchGameInfo(game_id);
  const users = game.users;

  allPrompts.forEach((prompt) => {
    if (prompt.id != correctPrompt.id && promptArray.length < users.length){
      promptArray.push(prompt)
    }
  })
  shuffleArray(promptArray)
  promptArray.forEach((prompt) => {
    let element = null
    if (prompt.id == correctPrompt.id) {
      element = createPromptElement({prompt_id: prompt.id}, prompt)
    } else {
      element = createPromptElement({ prompt_id: -1}, prompt)
    }
    promptDiv.appendChild(element)
  })

  promptElementArray.forEach((element) => promptDiv.appendChild(element));

  /* Randomize array in-place using Durstenfeld shuffle algorithm */
  // https://stackoverflow.com/questions/2450954
  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }
}

function changeElementColor(element, color) {
  element.style.color = color;
}
