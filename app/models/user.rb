class User < ActiveRecord::Base
  validates :username, presence: true, uniqueness: true
  validates :password_hash, presence: true

  has_many :created_surveys, class_name:'Survey', foreign_key: :creator_id

  has_many :takers
  has_many :taken_surveys, through: :takers, source: :survey

  has_many :responses
end
