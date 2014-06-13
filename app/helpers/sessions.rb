helpers do

  def current_user
    @user ||= User.find(session[:user_id]) if session[:user_id]
  end

  def current_user=(value)
    session[:user_id] = value
  end

end
