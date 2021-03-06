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

  def start_game
    user = User.find(params[:user_id])
    game = user.game

    game.is_started = true
    game.save
  end
  
  def add_user
    user = User.find_by(id: add_user_params[:user_id])
    game = Game.find_by(code: add_user_params[:code])

    if game.user_count < 6
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

  def find_game 
    game = Game.find(params[:game_id])

    render json: game, include: [:users]
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
  end
  
  private 
  

  def find_user
    user = User.find_by(id: add_user_params[:user_id])
  end

  def add_user_params
    params.require(:game).permit(:code, :user_id)
  end
end
