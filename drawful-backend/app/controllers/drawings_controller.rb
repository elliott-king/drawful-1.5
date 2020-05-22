require 'securerandom'

class DrawingsController < ApplicationController
  def index
    drawings = Drawing.all
    render json: drawings, only: [:file]
  end

  def create
    puts params[:image]
    puts params[:user]
    puts params[:prompt]
    id = SecureRandom.uuid
    # https://stackoverflow.com/questions/21707595
    File.open("#{Rails.root}/../frontend/assets/#{id}.png", 'wb') do |file|
      file.write(params[:image].read)
    end
    # TODO: maybe check that the file write succeeded?
    d = Drawing.new
    d.user = User.first # TODO: attach to params[:user], when implemented
    # TODO: d.prompt should be assigned
    d.file = "#{id}.png"
    d.save!
  end
end
