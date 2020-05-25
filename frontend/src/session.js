const url = 'http://localhost:3000/users'

document.addEventListener('DOMContentLoaded', function(error) {

  // TODO: first check if user is logged in...?

  const div = document.querySelector('#session')
  const userForm = document.createElement('form')
  userForm.innerHTML = `
  <label>Username</label>
  <input name="username">
  <input type="submit">
  `
  userForm.addEventListener('submit', handleSubmit)
  div.appendChild(userForm)

  const sessionIdButton = document.createElement('button')
  sessionIdButton.textContent = "user id"
  sessionIdButton.addEventListener('click', function(event) {
    // https://stackoverflow.com/questions/48299135/pass-jwt-in-header
    fetch(url, {
      headers: {
        'Authorization': window.localStorage.getItem('token')
      }
    }).then(res => {
      console.log(res)
      return res.json()
    }).then(console.log)
  })
  div.appendChild(sessionIdButton)
})

function handleSubmit(event) {
  event.preventDefault()
  console.log(event.target.username.value)
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      username: event.target.username.value
    })
  }).then(res => {
    console.log(res)
    return res.json()
  }).then(json => {
    console.log(json)
    window.localStorage.setItem('token', json.token)
    // auth = json.token
  })
}