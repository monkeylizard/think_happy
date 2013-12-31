require 'spec_helper'

describe "Thoughts" do
  describe "New" do
    it "should have the content 'Anagramish Thoughts'" do
      visit '/thoughts/new'
      expect(page).to have_content('Anagramish Thoughts')
    end
  end
end
