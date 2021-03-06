function addUploadButton(div, mode) {
  const btn = document.createElement("button");
  btn.setAttribute("id", "image-upload-button");
  btn.textContent = "Upload";
  btn.addEventListener("click", (event) => submitDrawingFunction(div, mode));

  div.appendChild(btn);
}

function createDrawTimer(div, mode) {
  const timer = document.createElement('p')
  timer.setAttribute('id', 'timer')
  div.appendChild(timer)

  createDrawingTimeout(() => submitDrawingFunction(div, mode), 35000)
}

function createDrawingTimeout(callback, ms) {
  let seconds = (ms / 1000)
  seconds = Math.ceil(seconds)

  timerInterval(callback, seconds)
}

function timerInterval(callback, cycles) {
  const timer = document.getElementById('timer')
  if (!timer) return 
  if (cycles < 1) {
    return callback()
  }
  timer.textContent = cycles
  setTimeout(() => timerInterval(callback, cycles - 1), 1000)
}

function removeTimer() {
  const timer = document.getElementById('timer')
  if (timer) timer.remove()
}

function submitDrawingFunction(div, mode) {
  removeTimer()
  const canvas = document.getElementById("user-image-canvas");
  const prompt = document.getElementById("prompt");
  const dataUrl = canvas.toDataURL("image/png;base64;");

  // https://stackoverflow.com/questions/21707595
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
  const file = dataURLtoBlob(dataUrl);

  createDrawing({user_id: getUserId(), prompt_id: prompt.dataset.id, file: file})
    .then((res) => {
      if (mode === "sp") displayImage();
      else if (mode === "mp") renderWaitScreen(div)
    })
}

function displayPrompt(div) {
  fetch(`${promptsUrl}random_prompt`)
    .then((res) => res.json())
    .then(renderPrompt)

  function renderPrompt(randomPrompt) {
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

function renderWaitScreen(parent) {
  console.dir(parent);
  clearDiv(parent);
  const waitMsg = document.createElement("h2");
  waitMsg.textContent = "Please wait while the other players finish drawing";

  parent.appendChild(waitMsg);
}
