class Question < ActiveRecord::Base
  validates :content, presence: true

  belongs_to :survey
  has_many :choices
  has_many :responses, through: :choices

  def as_json(options={})
  	{id: self.id, content: self.content, choices: self.choices}
  end
  
  def choice_percents 
  	response_count = self.responses.length 
  	self.choices.map do |choice|
  		{id: choice.id, percent: (1.0 * choice.responses.length / response_count), content: choice.content}
  	end
  end

end
