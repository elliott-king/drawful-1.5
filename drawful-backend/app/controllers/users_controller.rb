class UsersController < ApplicationController
  before_action :authorize_request, only: [:index]

  def index
    render json: @current_user 
  end

  def create
    puts params.require(:user).permit(:username)
    user = User.find_or_create_by(params.require(:user).permit(:username))
    # https://medium.com/binar-academy/rails-api-jwt-authentication-a04503ea3248
    token = encodeJWTToken(user_id: user.id)
    time = Time.now + 24.hours.to_i
    render json: { user: user, token: token, exp: time.strftime("%m-%d-%Y %H:%M")}, status: :ok
  end
end
