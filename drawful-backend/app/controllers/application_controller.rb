class ApplicationController < ActionController::API

  private
  def encodeJWTToken(payload, exp = 2.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, Rails.application.secrets.secret_key_base)
  end
  def decodeJWTToken(token)
    body = JWT.decode(token, Rails.application.secrets.secret_key_base)[0]
    HashWithIndifferentAccess.new body
  rescue
    nil
  end

  def not_found
    render json: { error: 'not_found' }
  end

  def authorize_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    begin
      # https://medium.com/binar-academy/rails-api-jwt-authentication-a04503ea3248
      decoded = decodeJWTToken(header)
      @current_user = User.find(decoded[:user_id])
    rescue ActiveRecord::RecordNotFound => e
      render json: { errors: e.message }, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: { errors: e.message }, status: :unauthorized
    end
  end
end
