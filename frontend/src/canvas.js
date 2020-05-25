function addUploadButton(div) {
  const btn = document.createElement("button");
  btn.setAttribute("id", "image-upload-button");
  btn.textContent = "Upload";
  btn.addEventListener("click", (event) => {
    const canvas = document.getElementById("user-image-canvas");
    const prompt = document.getElementById("prompt");
    const dataUrl = canvas.toDataURL("image/png;base64;");

    // https://stackoverflow.com/questions/21707595
    const file = dataURLtoBlob(dataUrl);
    let fd = new FormData();
    fd.append("image", file);
    fd.append("prompt", prompt.dataset.id);
    fd.append("user", getUserId());
    // console.dir(`fd form promp id = ${prompt.dataset.id}`)

    // And send it
    const url = "http://localhost:3000/drawings";
    fetch(url, {
      method: "POST",
      // Should be good by just dropping it in the body
      // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
      body: fd,
    }).then((res) => {
      // console.log('image upload response', res)
      // return res.json()
      // remove canvas elements and render image
      displayImage();
    });
  });

  // Convert dataURL to Blob object
  function dataURLtoBlob(dataURL) {
    // Decode the dataURL
    var binary = atob(dataURL.split(",")[1]);

    // Create 8-bit unsigned array
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }

    // Return our Blob object
    return new Blob([new Uint8Array(array)], { type: "image/png" });
  }

  div.appendChild(btn);
}

function displayPrompt(div) {
  const prompsUrl = "http://localhost:3000/prompts";
  fetch(prompsUrl)
    .then((res) => res.json())
    .then(renderPrompt);

  function renderPrompt(prompts) {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    const promptElement = document.createElement("p");
    promptElement.dataset.id = randomPrompt.id;
    // console.log(promptElement.dataset.id)
    promptElement.id = "prompt";
    promptElement.textContent = randomPrompt.title;

    div.prepend(promptElement);
  }
}

// Taken from https://stackoverflow.com/questions/2368784/
function createCanvas(div) {
  const container = document.getElementById("container");
  container.className = "sp-draw";
  // create canvas element and append it to document body
  const canvas = document.createElement("canvas");

  canvas.setAttribute("id", "user-image-canvas");
  div.appendChild(canvas);

  // some hotfixes... ( ≖_≖)
  // document.body.style.margin = 0;
  // canvas.style.position = 'fixed';

  // get canvas 2D context and set him correct size
  const ctx = canvas.getContext("2d");
  resize();

  // last known position
  const pos = { x: 0, y: 0 };

  // window.addEventListener('resize', resize);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mousedown", setPosition);
  canvas.addEventListener("mouseenter", setPosition);

  // new position from mouse event
  function setPosition(e) {
    var X, Y;
    X = e.pageX || e.clientX || e.offsetX;
    Y = e.pageY || e.clientY || e.offsetY;
    X = X - canvas.offsetLeft;
    Y = Y - canvas.offsetTop;
    pos.x = X;
    pos.y = Y;
  }

  // resize canvas
  function resize() {
    ctx.canvas.width = 300;
    ctx.canvas.height = 300;
    // ctx.canvas.width = window.innerWidth;
    // ctx.canvas.height = window.innerHeight;
  }

  function draw(e) {
    // mouse left button must be pressed
    if (e.buttons !== 1) return;

    ctx.beginPath(); // begin

    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#c0392b";

    ctx.moveTo(pos.x, pos.y); // from
    setPosition(e);
    ctx.lineTo(pos.x, pos.y); // to

    ctx.stroke(); // draw it!
  }

  // pull random prompt and create/display element
  displayPrompt(div);
}
