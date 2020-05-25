Rails.application.routes.draw do
  resources :games
  resources :prompts
  resources :users
  
  get '/games/get_users/:user_id', to: 'games#get_users'
  post '/games/add_user', to: 'games#add_user', as: 'join_game'
  resources :drawings do
    member do
      get 'prompt_count'
      get 'prompts'
      get 'correct_prompt'
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
