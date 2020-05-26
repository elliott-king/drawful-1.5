class UsersController < ApplicationController
  def create 
    user = User.create()

    render json: user
  end

  def users_in_game
    user = User.find(params[:user_id])
    users = user.game.users

    render json: users
  end

  def show
    render json: User.find(params[:id])
  end
end
