## USER(SURVEY CREATOR) PAGES ################################
get '/users/surveys' do
  @surveys = current_user.created_surveys #Survey.where(creator_id: current_user)
  erb :created_surveys
end

get '/users/surveys/:survey_id' do
  redirect "/surveys/#{params[:survey_id]}"
end

get '/users/:id/surveys' do
  @user = User.find(params[:id])
  @surveys = @user.created_surveys # Survey.where(creator_id: @user.id)
  erb :created_surveys_other_user
end
