function displayImage() {
  const drawingsUrl = "http://localhost:3000/drawings/"
  const imageDiv = document.getElementById("show-image")

  function fetchImage() {
    fetch(drawingsUrl)
      .then(res => res.json())
      .then(renderImage)
  }

  function renderImage(image) {
    imageDiv.innerHTML = ''

    const imageElement = document.createElement("img")
    const randomFile = image[Math.floor(Math.random() * image.length)].file
    imageElement.src = randomFile

    imageDiv.appendChild(imageElement)
  }

  fetchImage()
}

displayImage()
