document.addEventListener("DOMContentLoaded", (event) => {
  // const canvasDiv = document.querySelector("#game-content");

  findOrCreateCookie();
  setUsernameOrPlay();
});

const url = "https://drawful-1-5.herokuapp.com/"
const drawingsUrl = `${url}drawings/`
const promptsUrl = `${url}prompts/`
const gamesUrl = `${url}games/`
const usersUrl = `${url}users/`