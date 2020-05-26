async function findOrCreateCookie() {
  const usersUrl = "http://localhost:3000/users";

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

function getUserId() {
  const userId = document.cookie.replace(
    /(?:(?:^|.*;\s*)user_id\s*\=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  return userId;
}
