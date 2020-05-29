require 'securerandom'

class DrawingsController < ApplicationController
  def index
    drawings = Drawing.all
    render json: drawings, include: [:prompts]
  end

  # expects json format {user: user_id, prompt: prompt_id}
  def create
    id = SecureRandom.uuid
    puts params[:user]
    puts params[:prompt]
    puts id
    # https://stackoverflow.com/questions/21707595
    File.open("#{Rails.root}/../frontend/assets/#{id}.png", 'wb') do |file|
      file.write(params[:image].read)
    end
    # TODO: maybe check that the file write succeeded?
    u = User.find(params[:user])
    d = Drawing.new
    d.user_id = params[:user]
    d.game = u.game
    dp = DrawingPrompt.create!(prompt_id: params[:prompt], drawing: d, is_correct: true) 
    d.file = "#{id}.png"
    d.save!
  end

  def game_drawings
    user = User.find(params[:user_id])
    drawings = user.game.drawings

    render json: drawings, include: [:user]
  end  

  def prompts
    drawing = Drawing.find(params[:id])
    render json: {prompts: drawing.prompts}
  end

  def correct_prompt
    render json: { correct: Drawing.find(params[:id]).correct_prompt.id }
  end

  def prompt_count
    drawing = Drawing.find(params[:id])
    render json: {count: drawing.prompts.count}
  end

  def add_guess
    drawing = Drawing.find(params[:id])
    user = User.find(params[:user_id])
    prompt = Prompt.find(params[:prompt_id])
    is_correct = params[:is_correct]
    Guess.create(drawing: drawing, user: user, prompt: prompt, is_correct: is_correct)
    render json: drawing
  end

  def guess_count
    drawing = Drawing.find(params[:id])
    render json: {count: drawing.guesses.count}
  end
end
