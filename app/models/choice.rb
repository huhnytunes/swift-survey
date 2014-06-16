class Choice < ActiveRecord::Base
  validates :content, presence: true

  belongs_to :question
  has_many :responses

  def as_json(options={})
  	{id: self.id, content: self.content}
  end

end
