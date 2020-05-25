Rails.application.routes.draw do
  resources :games
  resources :prompts
  resources :users
  resources :drawings
  
  post '/games/add_user', to: 'games#add_user', as: 'join_game'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
