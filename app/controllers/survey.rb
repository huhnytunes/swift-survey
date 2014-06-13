get '/surveys/new' do

end 

get '/surveys/:id/stats' do
  @survey = Survey.where(survey_id: params[:survey_id])
  erb :survey_stats
end 

get '/surveys/:id/take' do 
  @survey = Survey.where(survey_id: params[:survey_id])
  erb :survey
end   