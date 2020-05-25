require 'securerandom'

class DrawingsController < ApplicationController
  def index
    drawings = Drawing.all
    render json: drawings 
  end

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
    d = Drawing.new
    d.user = User.first # TODO: attach to params[:user], when implemented
    d.prompt_id = params[:prompt]
    # TODO: d.prompt should be assigned
    d.file = "#{id}.png"
    d.save!
  end

  # private
  #   def drawing_params
  #     params.require(:drawing).permit(:file, :user, :prompt)
  #   end
end
