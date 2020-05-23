class UsersController < ApplicationController
  def create 
    user = User.create()

    render json: user
  end
end
