Rails.application.routes.draw do
  resources :games
  resources :users
  
  get '/games/user_count/:id', to: 'games#user_count'
  get '/games/start_game/:user_id', to: 'games#start_game'
  get '/games/find_game/:game_id', to: 'games#find_game'
  post '/games/add_user', to: 'games#add_user', as: 'join_game'

  get '/users/users_in_game/:user_id', to: 'users#users_in_game'
  get '/users/all_scores/:user_id', to: 'users#all_scores'

  get '/drawings/game_drawings/:user_id', to: 'drawings#game_drawings'
  get '/prompts/random_prompt/', to: 'prompts#random_prompt'
  resources :prompts

  resources :drawings do
    member do
      get 'prompt_count'
      get 'prompts'
      get 'correct_prompt'
      get 'guess_count'
      post 'add_guess'
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
