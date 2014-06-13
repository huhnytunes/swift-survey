get '/' do 
  @surveys = Survey.all 
  if session[:user_id] == nil 
    puts "hey"
    erb :index
  else 
    @user = User.find(current_user.id)
    erb :homepage
  end 
end 

post '/login' do
  @user = User.find_by(username: params[:user][:username])
  if @user.nil? || !@user.authenticate(params[:user][:password])
    @login_invalid = true 
    puts 'if'
    erb :index 
  else 
    puts 'else'
    session[:user_id] = @user.id 
    redirect '/'
  end 
end 

post '/register' do 
  @user = User.new(username: params[:user][:username], password: params[:user][:password])
  if !@user.save
    @register_invalid = true
    erb :index
  else
    session[:user_id] = @user.id
    redirect '/'
  end 
end 

post '/logout' do 
  current_user = nil 
  erb :index
end 
