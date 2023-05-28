import pandas as pd
from annoy import AnnoyIndex
# Read the CSV file
data = pd.read_csv("travel_history.csv")

# Create a user-city matrix
user_city_matrix = pd.crosstab(data["User"], data["City_id"])
# Build a dictionary to map city IDs to names
city_names = dict(zip(data["City_id"], data["Locations"]))

# Build an Annoy index for the user-city matrix
annoy_index = AnnoyIndex(user_city_matrix.shape[1], metric='angular')
for i, row in enumerate(user_city_matrix.values):
    annoy_index.add_item(i, row)
annoy_index.build(100)  # Number of trees, higher value gives better precision

def recommend_locations_annoy(user, annoy_index, user_city_matrix, top_n=3):
    user_index = user_city_matrix.index.get_loc(user)
    
    # Find the most similar users using Annoy
    similar_users_indices = annoy_index.get_nns_by_item(user_index, top_n + 1)[1:]
    similar_users = user_city_matrix.index[similar_users_indices]
    # Get the cities visited by the most similar users
    visited_cities = user_city_matrix.loc[similar_users].sum()
    
    # Remove the cities already visited by the given user
    visited_cities = visited_cities[user_city_matrix.loc[user] == 0]
    
    # Recommend the top cities
    recommended_cities = visited_cities.sort_values(ascending=False).head(top_n).index
    recommended_cities = [city_names[c] for c in recommended_cities]  # Replace IDs with names
    
    
    return recommended_cities

    

# Test the recommendation function
user = "User5"
recommended_cities = recommend_locations_annoy(user, annoy_index, user_city_matrix)
print(f"Recommended cities for {user}: {', '.join(map(str, recommended_cities))}")
