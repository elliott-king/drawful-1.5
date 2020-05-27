function showScoreScreen(drawings, game_id) {
  // get our score
  // get all scores 
  // render to screen
  // force timeout to call: checkTurn(drawings, game_id);
}

function appendUserScore(div, score, username) {
  scoreDiv = document.createElement('div')
  scoreDiv.textContent = `${username}: ${score}`
}

async function getAllScores() {
  let userScores = await fetch(`${usersUrl}all_scores/${getUserId()}`)
  userScores = await(userScores.json())
  console.log(userScores)
  return userScores
  // guesses: attach to user
  // is_correct, not?

  // # times a user wrong: 
  // game.drawings.foreach guesses.foreach do 
  // if guess.user == thisUser, guess.true -> user + 1
  
  // # times a user's prompt was selected 
  // -> game.drawings.foreach do guesses.foreach 
  // if guess.prompt.user = thisUser && guess.correct == False this user fooled someone
  
  //given game id, get all drawings
  // for each user, get their guesses
}
