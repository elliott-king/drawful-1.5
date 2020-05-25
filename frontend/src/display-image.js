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
      .then(renderImage);
  }

  function renderImage(image) {
    if (imagesShown < 5) {
      // clear content in relevant divs
      contentDiv.innerHTML = "";
      promptDiv.innerHTML = "";

      // create image element and append that element
      const imageElement = document.createElement("img");
      const randomImg = image[Math.floor(Math.random() * image.length)];

      imageElement.src = "assets/" + randomImg.file;

      contentDiv.appendChild(imageElement);
      // passing in the displayed image
      renderPrompts(randomImg);
    } else {
      promptDiv.innerHTML = "";

      displayScore();
    }
  }

  function displayScore() {
    const scoreElement = document.createElement("h1");
    const startOverBtn = document.createElement("button");
    startOverBtn.value = "start over";
    startOverBtn.innerHTML = "Start Over";

    scoreElement.innerHTML = `
      <h1>final score: <span id="score">${score}</span></h1>
    `;

    promptDiv.prepend(scoreElement);
    promptDiv.appendChild(startOverBtn);
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
    // needs to be a set to prevent duplicate elements
    const promptElementsSet = new Set();
    promptElementsSet.add(correctPrompt);

    // selects 3 random prompts, creates an element, and adds it to the array alongside the correct prompt
    while (promptElementsSet.size < 4) {
      let randomPrompt =
        allPrompts[Math.floor(Math.random() * allPrompts.length)];
      if (randomPrompt !== correctPrompt) {
        promptElementsSet.add(createPromptElement(image, randomPrompt));
      }
    }

    promptElementsSet.forEach((element) => promptDiv.appendChild(element));
    container.appendChild(promptDiv);
  }

  function createPromptElement(image, prompt) {
    const promptElement = document.createElement("h2");
    promptElement.dataset.correct =
      image.prompt_id === prompt.id ? "true" : "false";
    promptElement.dataset.action = "guess";
    promptElement.innerHTML = prompt.title;

    return promptElement;
  }

  promptDiv.addEventListener("click", (e) => {
    console.dir(e.target.value);
    if (e.target.dataset.action === "guess") {
      const scoreElement = document.getElementById("score");
      imagesShown++;

      if (e.target.dataset.correct === "true") {
        score++;
        e.target.style.color = "green";
      } else {
        const correctAns = promptDiv.querySelector(`[data-correct="true"]`);
        correctAns.style.color = "green";
        e.target.style.color = "red";
      }

      fetchImage();
    } else if (e.target.value === "start over") {
      contentDiv.innerHTML = "";
      promptDiv.remove();

      createCanvas(contentDiv);
      addUploadButton(contentDiv);
    }
  });

  fetchImage();
}
