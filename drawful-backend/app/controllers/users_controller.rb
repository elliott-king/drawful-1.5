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

  def all_scores
    user = User.find(params[:user_id])
    game = user.game 
    drawings = game.drawings

    scores = {}
    game.users.each do |user|
      scores[user.id] = 0
    end

    drawings.each do |drawing|
      drawing.guesses.each do |guess|
        user_id = guess.user.id 
        if guess.is_correct
          scores[user_id] += 1
        else 
          user_who_fooled_you = guess.prompt.user.id
          if user_who_fooled_you != guess.user.id
            scores[user_who_fooled_you] += 1
          end
        end
      end
    end
    render json: {scores: scores}
  end
end
