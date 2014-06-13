get '/surveys/new' do

end 

get '/surveys/:id/stats' do
  @survey = Survey.find(params[:id])
  erb :survey_stats
end 

get '/surveys/:id/take' do 
  @survey = Survey.find(params[:id])
  @questions = @survey.questions
  erb :survey
end   