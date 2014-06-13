jake = User.create(username: 'jake', password: 'jake')
judy = User.create(username: 'judy', password: 'judy')
simon = User.create(username: 'simon', password: 'simon')
joe = User.create(username: 'joe', password: 'joe')

10.times do 
  Survey.create(title: Faker::Company.catch_phrase, creator_id: rand(1..4))
end 