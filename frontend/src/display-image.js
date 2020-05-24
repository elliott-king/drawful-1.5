function displayImage() {
  const drawingsUrl = "http://localhost:3000/drawings/"
  const promptsUrl = "http://localhost:3000/prompts/"
  const imageDiv = document.getElementById("game-content")
  let score = 0

  function fetchImage() {
    fetch(drawingsUrl)
      .then(res => res.json())
      .then(renderImage)
  }

  function renderImage(image) {
    imageDiv.innerHTML = ''

    const imageElement = document.createElement("img")
    const randomImg = image[Math.floor(Math.random() * image.length)]

    imageElement.src = "assets/" + randomImg.file

    displayScore()
    imageDiv.appendChild(imageElement)

    // passing in the displayed image
    renderPrompts(randomImg)
  }

  function displayScore() {
    const scoreElement = document.createElement("h1")
    scoreElement.innerHTML = `
      <h1>score: <span id="score">${score}</span></h1>
    `

    imageDiv.prepend(scoreElement)
  }

  async function fetchPrompts() {
    // response awaits the completion of the fetch request before storing the return value
    const response = await fetch(promptsUrl)

    // returns the json
    return response.json()
  }

  async function renderPrompts(image) {
    // fetchPrompts returns a promise. the await keyword forces allPrompts to wait until the promise is resolved
    let allPrompts = await fetchPrompts()  
    const correctPrompt = createPromptElement(image, image.prompt)
    // needs to be a set to prevent duplicate elements
    const promptElementsSet = new Set()
    promptElementsSet.add(correctPrompt)

    // selects 3 random prompts, creates an element, and adds it to the array alongside the correct prompt
    while(promptElementsSet.size < 4) {
      let randomPrompt = allPrompts[Math.floor(Math.random() * allPrompts.length)]
      if (randomPrompt !== correctPrompt) {
        promptElementsSet.add(createPromptElement(image, randomPrompt))
      }
    }

    promptElementsSet.forEach(element => imageDiv.appendChild(element))
  }

  function createPromptElement(image, prompt) {
    const promptElement = document.createElement("h2")
    promptElement.dataset.correct = image.prompt_id === prompt.id ? "true" : "false"
    promptElement.dataset.action = "guess"
    promptElement.innerHTML = prompt.title

    return promptElement
  }
  
  imageDiv.addEventListener("click", e => {
    if (e.target.dataset.action === "guess") {
      const scoreElement = document.getElementById("score")
      if (e.target.dataset.correct === "true") {
        scoreElement.innerHTML++
        score = scoreElement.innerHTML
      }
    }
  })

  fetchImage()
}
