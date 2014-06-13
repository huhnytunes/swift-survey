## USER(SURVEY CREATOR) PAGES ################################
get '/users/surveys' do
  @surveys = Survey.where(creator_id: current_user)
  erb :created_surveys
end


get '/users/surveys/:survey_id' do
  @survey = Survey.where(survey_id: params[:survey_id])
  erb :survey_stats
end
