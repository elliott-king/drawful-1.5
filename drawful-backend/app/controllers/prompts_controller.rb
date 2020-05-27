class PromptsController < ApplicationController
  def index
    prompts = Prompt.all
    render json: prompts
  end

  def create
    drawing = Drawing.find(params[:drawing])
    user = User.find(params[:user_id])
    prompt = Prompt.create!(title: params[:title], user: user)
    dp = DrawingPrompt.create!(drawing: drawing, prompt: prompt, is_correct: params[:is_correct])
    render json: prompt
  end
end
