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

get '/surveys/:id' do
  @survey = Survey.find(params[:id])
  erb :survey
end

get '/surveys/:id/questions' do
  questions = Survey.find(params[:id]).questions
  content_type :json
  [Survey.find(params[:id]).title, questions].to_json
end

post '/surveys/:id/finish' do
  questions = JSON.parse(params[:qs], {:symbolize_names => true})
  current_user.saveResponses(params[:id],questions)
  status 200
end