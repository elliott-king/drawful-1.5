class DrawingsController < ApplicationController
  def index
    drawings = Drawing.all
    render json: drawings, only: [:file]
  end
end
