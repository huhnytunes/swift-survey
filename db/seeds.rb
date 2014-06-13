jake = User.create(username: 'jake', password: 'jake')
judy = User.create(username: 'judy', password: 'judy')
simon = User.create(username: 'simon', password: 'simon')
joe = User.create(username: 'joe', password: 'joe')

# Create 10 surveys...creators will be random
10.times do 
  Survey.create(title: Faker::Company.catch_phrase, creator_id: rand(1..4))
end 

surveys = Survey.all

# Create 10 questions for each survey
surveys.each do |survey|
  10.times do
    Question.create(content: Faker::Company.bs , survey_id: survey.id)
  end
end

questions = Question.all

# Create 4 choices for each question
questions.each do |question|
  4.times do
    Choice.create(question_id: question.id, content: Faker::Company.bs)
  end
end

# Users will response to all questions
users = User.all
questions.each do |question|
  choices = question.choices
  users.each do |user|
    Response.create(choice_id: choices.sample.id, user_id: user.id)
  end
end




