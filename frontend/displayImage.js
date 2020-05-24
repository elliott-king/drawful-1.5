function displayImage() {
  const drawingsUrl = "http://localhost:3000/drawings/"
  const imageDiv = document.getElementById("user-image-create")
  console.log('hi')

  function fetchImage() {
    console.log("test")
    fetch(drawingsUrl)
      .then(res => res.json())
      .then(renderImage)
  }

  function renderImage(image) {
    imageDiv.innerHTML = ''

    const imageElement = document.createElement("img")
    const randomFile = image[Math.floor(Math.random() * image.length)].file
    imageElement.src = "assets/" + randomFile
    imageElement.id = 'test'
    console.dir(imageElement)

    imageDiv.appendChild(imageElement)
  }

  fetchImage()
}
