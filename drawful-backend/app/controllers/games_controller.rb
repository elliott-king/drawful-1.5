class GamesController < ApplicationController
  def create
    game = Game.create
    game.code = (0...4).map { (65 + rand(26)).chr }.join
    game.save
    user = User.find(params[:user])
    user.game = game 
    user.save 

    byebug
    render json: game
  end

  def show
    game = Game.find(params[:game_id])
    # include users, drawings
    # IF not_started: return game & users
    if !game.is_started
      render json: {users: game.users}
    elsif game.is_started && game.drawings.count == game.users.count
      render json: {drawings: game.drawings}
      
    else 
      render json: {"error" => "you should not be here"}
    end

    # if started, return game & users -> JS will infer game has started, then request for prompt (POST)
    # when finished w/ drawing, POST create it w/ game id
    # setTimeout(2 seconds or something), then:
    # IF started && # drawings == # users, then...
    # send all drawings to frontend

    # LOOP UNTIL DONE W/ DRAWINGS: 

    # (make sure on frontend, don't display theirs)

    # (POST fake prompts, create prompt & associate it w/ drawing) post will have to include drawing_id:
    # (after x seconds, send all POSTS)
    # (long poll to see if one prompt has been sent through)
    # GET to single drawings, count # prompts, check if # users == this.users.size

    # (on frontend, display & choose each prompt for each drawing)
    # (GET to drawing, display prompts)
    # (drawing, click prompt => increment score if correct) //TODO: if wrong, increment other player's score
    
    # END LOOP

    # show their score (on frontend)
    # link to main page?
  end
  
end
