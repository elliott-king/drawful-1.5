async function findOrCreateCookie() {
  if (!document.cookie || getUserId() == "null" || getUserId() === "" || getUserId() === "undefined") {
    const user = await postUser();
    console.dir(user);

    document.cookie = `user_id=${user.id}`;
    console.dir(document.cookie);
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
  const userId = getUserId()
  const response = await fetch(`${usersUrl}${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      username: username
    })
  })

  json = await res.json()
  console.log('set username', json)
}

function getUserId() {
  const userId = document.cookie.replace(
    /(?:(?:^|.*;\s*)user_id\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  return userId;
}
