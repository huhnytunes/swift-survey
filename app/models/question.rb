class Question < ActiveRecord::Base
  validates :content, presence: true

  belongs_to :survey
  has_many :choices
  has_many :responses, through: :choices
  
end
