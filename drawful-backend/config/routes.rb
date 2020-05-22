Rails.application.routes.draw do
  resources :prompts
  resources :users
  resources :drawings
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
