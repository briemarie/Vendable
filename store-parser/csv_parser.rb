require 'CSV'

store_hash = {'safeway.csv' => 'safeway', 'costco.csv' => 'costco', 'whole_foods.csv' => 'whole_foods', 'fresh_n_easy.csv' => 'fresh_n_easy'}

giant_array = []

store_hash.each do |k, v|

  current_store = CSV.readlines(k)
  items = []
  name = []
  price = []

  current_store.each do |row|
    items << row
  end

  items.each do |item|
    div_item = item.to_s.split('$')
    name << div_item[0]
    price << div_item[1]
  end

  name.each do |item|
    new_item = item.to_s
    items << new_item.slice!("\\n\\n")
    items << new_item.slice!("\\n")
    items << new_item.gsub!("[", '')
    items << new_item.gsub!("\"", '')
    items << new_item.strip!
  end

  price.each do |item|
    new_item = item.to_s
    items << new_item.slice!("\\n\\n")
    items << new_item.gsub!("]", '')
    items << new_item.gsub!("\"", '')
    items << new_item.strip!
  end

  object = name.zip(price)

  obj_hash = {}

  object.map do |item|
    new_item = item[0].split("  ")
    item[0] = new_item.shift().sub("\\", "")

    new_item = item[1].split(" ")
    item[1] = new_item.shift().sub("\\n", "")
  end

  object.each do |item|
    new_obj = Hash[ 'type', item[0],  'store', v, 'price', item[1] ]
    giant_array.push(new_obj)
  end
end

 # p giant_array













