class GamesController < ApplicationController
  # before_action :find_game, only: [:show]
  # before_action :find_user, only: [:add_user, :user_count]

  def create
    game = Game.create
    game.code = (0...4).map { (65 + rand(26)).chr }.join
    game.save
    user = User.find(params[:user])
    user.game = game 
    user.save 

    # byebug
    render json: game, include: [:users]
  end

  def add_user
    user = User.find_by(id: add_user_params[:user_id])
    game = Game.find_by(code: add_user_params[:code])

    if game.user_count < 4
      user.game = game
      user.save

      render json: game, include: [:users]
    else 
      render json: { error: "This lobby is full" }
    end
  end

  def user_count
    render json: {count: Game.find(params[:id]).user_count}
  end

  def show
    # game = Game.find(params[:game_id])
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
  
  private 
  
  def find_game 
    game = Game.find(params[:game_id])
  end

  def find_user
    user = User.find_by(id: add_user_params[:user_id])
  end

  def add_user_params
    params.require(:game).permit(:code, :user_id)
  end
end
