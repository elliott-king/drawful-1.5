gameUrl = "http://localhost:3000/games"

function addMultiplayerButtons() {
  // Add one multiplayer button ->
  // next screen, join or create room ->
  const mBtn = document.createElement('button')
  mBtn.innerText = "Multiplayer game"
  mBtn.addEventListener('click', renderMultiplayerChoices)
  document.getElementById('game-content').appendChild(mBtn) // TODO: check order

}

function clearContent() {
  document.getElementById('game-content').innerHTML = ""
}

function renderMultiplayerChoices(e) {
  clearContent()
  const newBtn = document.createElement('button')
  newBtn.innerText = "New game"
  // newBtn.addEventListener('click', (e) => console.log('new game clicked'))
  newBtn.addEventListener('click', newMultiplayerGame)

  const joinGameForm = document.createElement('form')
  const html = `
  <label>Code</label><input type="text">
  <input type="submit">Join</input>
  `
  joinGameForm.innerHTML = html
  joinGameForm.addEventListener('submit', (e) => console.log('join game clicked'))
  // joinGameForm.addEventListener('submit', joinGame)

  const contentDiv = document.getElementById('game-content')
  contentDiv.append(newBtn)
  contentDiv.append(joinGameForm)
}

function newMultiplayerGame(e) {
  console.log('User id', getUserId(), 'creating new game...')
  fetch(gameUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      user: getUserId() // User has ID, no username yet
    })
  }).then(res => {
    console.log(res)
    return res.json()
  }).then(json => {
    console.log
    // renderLobby(json)
  })
}