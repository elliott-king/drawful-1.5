class UsersController < ApplicationController
  def create 
    user = User.create()

    render json: user
  end

  def users_in_game
    user = User.find(params[:user_id])
    # users = user.game.users
    game = user.game

    render json: game, include: [:users]
  end

  def show
    render json: User.find(params[:id])
  end

  def update
    username = params.require(:user).permit(:username)
    user = User.find(params[:id])
    user.update(username)
    render json: user
  end
end
