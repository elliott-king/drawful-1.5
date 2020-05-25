document.addEventListener("DOMContentLoaded", (event) => {
  const canvasDiv = document.querySelector("#game-content");

  createCanvas(canvasDiv);
  addUploadButton(canvasDiv);
  findOrCreateCookie();
  // addMultiplayerButtons()
});
