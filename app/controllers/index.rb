get '/' do 
  if session[:user_id] == nil 
    erb :index
  else 
    erb :homepage
  end 
end 

post '/login' do
  @user = User.find_by(username: params[:user][:username])
  if @user.nil? || !@user.authenticate(params[:user][:password])
    @login_invalid = true 
    erb :index 
  else 
    session[:user_id] = @user.id 
    erb :homepage
  end 
end 

post '/register' do 
  @user = User.new(username: params[:user][:username], password: params[:user][:password])
  if !@user.save
    @register_invalid = true
    erb :index
  else
    session[:user_id] = @user.id
    erb :homepage
  end 
end 
