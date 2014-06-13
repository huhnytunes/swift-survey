get '/surveys/new' do

end 

get '/surveys/:id' do
  @survey = Survey.where(survey_id: params[:survey_id])
  erb :survey_stats
end 