function displayImage() {
  const container = document.getElementById("container");
  container.className = "sp-guess";

  const promptDiv = document.createElement("div");
  promptDiv.id = "prompts";

  const drawingsUrl = "http://localhost:3000/drawings/";
  const promptsUrl = "http://localhost:3000/prompts/";
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
    promptDiv.prepend(createScoreElem(score));
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

    appendPromptSet(correctPrompt, allPrompts, promptDiv);

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
  const imageElement = document.createElement("img");
  imageElement.src = "assets/" + image.file;

  parent.appendChild(imageElement);
}

function createScoreElem(score) {
  const scoreElement = document.createElement("h1");
  scoreElement.innerHTML = `
    <h1>final score: <span id="score">${score}</span></h1>
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
  promptElement.innerHTML = prompt.title;

  return promptElement;
}

function appendPromptSet(correctPrompt, allPrompts, promptDiv) {
  // needs to be a set to prevent duplicate elements
  const promptElementsSet = new Set();
  promptElementsSet.add(correctPrompt);

  // selects 3 random prompts, creates an element, and adds it to the array alongside the correct prompt
  while (promptElementsSet.size < 4) {
    let randomPrompt =
      allPrompts[Math.floor(Math.random() * allPrompts.length)];
    if (randomPrompt !== correctPrompt) {
      // TODO: I changed this, it was previously throwing a ReferenceError
      promptElementsSet.add(createPromptElement({prompt_id: -1}, randomPrompt));
    }
  }

  // The randomization was not working, the correct element was always first
  const promptElementArray = Array.from(promptElementsSet)
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
  shuffleArray(promptElementArray)

  promptElementArray.forEach((element) => promptDiv.appendChild(element));
}

function changeElementColor(element, color) {
  element.style.color = color;
}
