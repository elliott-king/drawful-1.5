document.addEventListener("DOMContentLoaded", (event) => {
  // const canvasDiv = document.querySelector("#game-content");

  findOrCreateCookie();
  setUsernameOrPlay();
});

const url = "http://localhost:3000/" // DONOTSUBMIT
const drawingsUrl = `${url}drawings/`
const promptsUrl = `${url}prompts/`
const gamesUrl = `${url}games/`
const usersUrl = `${url}users/`
const presignedUrl = `${url}presigned_url/`