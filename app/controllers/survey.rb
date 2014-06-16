get '/surveys/new' do
  erb :create
end

post '/surveys/create' do
  p params
  num_of_questions = params.length - 1
  question_number = 1
  p params["1"][1]
  survey = Survey.create(title: params[:title], creator_id: current_user.id)
  num_of_questions.times do
    question = Question.create(content: params[question_number.to_s][0], survey_id: survey.id)
    params[question_number.to_s][1].each do |index, content|
      Choice.create(content: content, question_id: question.id)
    end
    question_number += 1
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
