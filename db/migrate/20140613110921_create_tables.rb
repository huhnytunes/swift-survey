class CreateTables < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :username
      t.string :password_hash

      t.timestamps
    end


    create_table :takers do |t|
      t.references :user
      t.references :survey

      t.timestamps
    end


    create_table :surveys do |t|
      t.string :title
      t.references :creator

      t.timestamps
    end


    create_table :questions do |t|
      t.text :content
      t.references :survey

      t.timestamps
    end

    create_table :choices do |t|
      t.text :content
      t.references :question

      t.timestamps
    end


    create_table :responses do |t|
      t.references :choice
      t.references :user

      t.timestamps
    end
  end
end
