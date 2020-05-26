Rails.application.routes.draw do
  resources :games
  resources :prompts
  resources :users
  
  get '/games/user_count/:id', to: 'games#user_count'
  post '/games/add_user', to: 'games#add_user', as: 'join_game'

  get '/users/users_in_game/:user_id', to: 'users#users_in_game'

  resources :drawings do
    member do
      get 'prompt_count'
      get 'prompts'
      get 'correct_prompt'
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
