class Choice < ActiveRecord::Base
  validates :content, presence: true

  belongs_to :question
  has_many :responses

end
