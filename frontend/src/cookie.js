async function findOrCreateCookie() {
  if (
    !document.cookie ||
    getUserId() == "null" ||
    getUserId() === "" ||
    getUserId() === "undefined"
  ) {
    const user = await postUser();
    // console.dir(user);

    document.cookie = `user_id=${user.id}`;
    // console.dir(document.cookie);
  }

  async function postUser() {
    const res = await fetch(usersUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res.json();
  }
}

async function setUsername(username) {
  const userId = getUserId();
  const response = await fetch(`${usersUrl}${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  });

  json = await response.json();
  sessionStorage.setItem("username", json.username);
  return json.username;
}

function getUserId() {
  const userId = document.cookie.replace(
    /(?:(?:^|.*;\s*)user_id\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  return userId;
}

function usernameExists() {
  if (sessionStorage.getItem("username")) {
    return true;
  }
}

function getUsername() {
  const storedName = localStorage.getItem("username");
  if (storedName) return storedName;
  else return getUserId();
}

function userNameFromUser(user) {
  if (!user.username) return user.id;
  return user.username;
}

function createUsernameForm(parentDiv) {
  const form = document.createElement("form");
  form.innerHTML = `
  <input type="text" name="username" placeholder="Enter a user name">
  <input id="large-button" type="submit">
  `;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setUsername(event.target.username.value).then((json) => {
      parentDiv.innerHTML = json;
      gameModeSelect();
    });
  });
  return form;
}

async function clearUser() {
  document.cookie = `user_id=`;
  localStorage.clear();
  sessionStorage.clear();
}

