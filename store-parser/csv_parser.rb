require 'CSV'

fruit = CSV.readlines('safeway-best.csv')
items = []
name = []
price = []


fruit.each do |row|
  row.to_s.strip
  items << row[3]

end

# name.delete_if{|i| i == ""}
# price.delete_if{|i| i == ""}

# price.each do |string|
#   string.slice!("\n")
#   string.slice!("<strong>·</strong>\n")
#   string.gsub!(/\s/,'')
# end

# print name
# print price

p items



