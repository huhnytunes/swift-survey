get '/surveys/new' do
  erb :create
end

post '/surveys/create' do
  p params
  # survey = Survey.create(title: params[:title], creator_id: current_user)
  # question = Question.create(content: params[:question], survey_id: survey.id)
  # params[:choice].each do |choice|
  #   Choice.create(content: params[:choice], question_id: question.id)
  # end

  redirect '/users/surveys'
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
