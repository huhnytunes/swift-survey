get '/surveys/new' do
  erb :create
end

post '/surveys/create' do
  survey = Survey.create(title: params[:title], creator_id: current_user)
  question = Question.create(content: params[:question], survey_id: survey.id)
  params[:choice].each do |choice|
    choice_index = 1
    Choice.create(content: params[:choice][choice_index],question_id: question.id)
    choice_index += 1
  end

  redirect '/users/surveys'
end

get '/surveys/:id/stats' do
  @survey = Survey.where(survey_id: params[:survey_id])
  erb :survey_stats
end

get '/surveys/:id/take' do
  @survey = Survey.where(survey_id: params[:survey_id])
  erb :survey
end
