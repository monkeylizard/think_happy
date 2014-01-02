module ThoughtsHelper
  require 'open-uri'
  require 'json'
  
  def random_thought(thoughts)
    len = thoughts.length
    thoughts[rand(len)]["message"]
  end
  
  def n_random_thoughts n
    s = open("http://happyfuncorp.com/thoughts.json?n=#{2000+n}").read
    t = JSON.load(s)
    thoughts = []
    n.times { thoughts.push random_thought t }
    thoughts
  end
end
