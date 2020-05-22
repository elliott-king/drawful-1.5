class PromptsController < ApplicationController
  def index
    prompts = Prompt.all
    render json: prompts
  end
end
