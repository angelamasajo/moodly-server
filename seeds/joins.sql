--find which plants are on a person's list
SELECT 
  plants.name as plant_name,
  users.user_name as user_name

FROM 
  plants 
  JOIN 
  user_plants
  ON plants.id = user_plants.plant_id
  JOIN 
  users
  ON user_plants.user_id = users.id;