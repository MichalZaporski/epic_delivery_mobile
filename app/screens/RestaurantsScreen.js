import { URL } from "../restApiUrl.js";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StatusBar,
  Button,
  TouchableOpacity,
} from "react-native";

export default function RestaurantsScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [dataRestaurants, setDataRestaurants] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const API_URL = URL;

  // fetching data (restaurants) from REST API
  useEffect(() => {
    fetch(`${API_URL}/api/v1/restaurants/search`)
      .then((response) => response.json())
      .then((json) => setDataRestaurants(json))
      .catch((error) => console.error(error));

    fetch(`${API_URL}/api/v1/categories`)
      .then((response) => response.json())
      .then((json) => setDataCategories(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  // View

  return (
    <View style={styles.background}>
      <View style={styles.topBar}>
        <Text style={styles.epicText}>Epic delivery</Text>
        <Image
          style={styles.hamburgerMenuImage}
          source={require("../assets/hamburger_menu.png")}
        />
      </View>
      <View style={styles.restaurantsContainer}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={dataRestaurants}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                // data for CourseScreen
                onPress={() =>
                  navigation.navigate("Courses", {
                    restaurant_id: item.id,
                    name: item.name,
                    address: `${item.city}, ${item.street} ${item.street_number}`,
                    phone_number: item.phone_number,
                    opinion: item.opinion,
                    opinions_number: item.opinions_number,
                    image: item.image,
                    categories: item.categories,
                  })
                }>
                <View style={styles.singleRestaurant}>
                  <Image
                    style={styles.restaurantImage}
                    source={{ uri: API_URL + item.image }}
                  />
                  <Text style={styles.restaurantsTextName}>{item.name}</Text>
                  <Text style={styles.restaurantsTextDesc}>
                    {item.description}
                  </Text>
                  <Text style={styles.restaurantsTextAddress}>
                    {item.city}, {item.street} {item.street_number}
                  </Text>
                  <View style={styles.categoriesContainer}>
                    {item.categories.map((category, key) => (
                      <View key={key} style={styles.categoryView}>
                        <Text style={styles.categoryText}>{category}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      <View style={styles.bottomNavigation}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  topBar: {
    height: 70,
    width: "100%",
    backgroundColor: "#a1190d",
    borderBottomWidth: 1,
    borderColor: "black",
    justifyContent: "center",
  },
  epicText: {
    color: "#fff",
    paddingLeft: 20,
    fontSize: 25,
    fontWeight: "300",
  },
  hamburgerMenuImage: {
    position: "absolute",
    width: 40,
    height: 40,
    right: 20,
    top: 15,
  },
  bottomNavigation: {
    width: "100%",
    height: 70,
    backgroundColor: "#f4f4f4",
    borderTopWidth: 2,
    borderColor: "#a1190d",
  },
  restaurantsContainer: {
    flex: 1,
    flexWrap: "nowrap",
  },
  singleRestaurant: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    //padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    //opacity: 0.9,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#afa5ab",
  },
  restaurantImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    borderBottomWidth: 2,
    borderColor: "#afa5ab",
  },
  restaurantsTextName: {
    fontSize: 25,
    textAlign: "left",
    width: "90%",
    marginTop: 5,
    marginBottom: 5,
    fontWeight: "500",
    color: "#444b4c",
  },
  restaurantsTextDesc: {
    fontSize: 17,
    textAlign: "justify",
    width: "90%",
    fontWeight: "300",
    marginBottom: 3,
    color: "#444b4c",
  },
  restaurantsTextAddress: {
    fontSize: 19,
    textAlign: "left",
    width: "90%",
    marginBottom: 14,
    fontWeight: "400",
    color: "#444b4c",
  },
  categoriesContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 12,
    left: 10,
    width: "100%",
  },
  categoryView: {
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#a1190d",
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 13,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 15,
    fontWeight: "200",
    color: "white",
  },
});
