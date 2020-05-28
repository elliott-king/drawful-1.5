document.addEventListener("DOMContentLoaded", (event) => {
  // const canvasDiv = document.querySelector("#game-content");

  findOrCreateCookie();
  showUsernameForm();
});

const url = "http://localhost:3000/";
const drawingsUrl = `${url}drawings/`;
const promptsUrl = `${url}prompts/`;
const gamesUrl = `${url}games/`;
const usersUrl = `${url}users/`;

