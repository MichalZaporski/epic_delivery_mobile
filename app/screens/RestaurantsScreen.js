import { URL } from "../restApiUrl.js";
import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";

export default function WelcomeScreen(props) {
  const [isLoading, setLoading] = useState(true);
  const [dataRestaurants, setDataRestaurants] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const API_URL = URL;

  // fetching data from REST API
  useEffect(() => {
    fetch(API_URL + "/api/v1/restaurants/search")
      .then((response) => response.json())
      .then((json) => setDataRestaurants(json))
      .catch((error) => console.error(error));

    fetch(API_URL + "/api/v1/categories")
      .then((response) => response.json())
      .then((json) => setDataCategories(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  // View
  return (
    <View style={styles.background}>
      <View style={styles.topBar}></View>
      <View style={styles.restaurantsContainer}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={dataRestaurants}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
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
              </View>
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
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
  },
  topBar: {
    height: 70,
    width: "100%",
    backgroundColor: "#A13941FF",
  },
  bottomNavigation: {
    width: "100%",
    height: 70,
    backgroundColor: "#F3DB74FF",
  },
  restaurantsContainer: {
    flex: 1,
    flexWrap: "nowrap",
    paddingLeft: 15,
    paddingRight: 15,
  },
  singleRestaurant: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fdfeff",
    //padding: 20,
    margin: 20,
    //opacity: 0.9,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#afa5ab",
    // minHeight: 200,
    //overflow: "visible",
  },
  restaurantImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 2,
    borderColor: "#afa5ab",
  },
  restaurantsTextName: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "left",
    width: "90%",
    marginTop: 5,
    marginBottom: 5,
  },
  restaurantsTextDesc: {
    fontSize: 17,
    textAlign: "justify",
    width: "90%",
    fontWeight: "300",
    marginBottom: 3,
  },
  restaurantsTextAddress: {
    fontSize: 19,
    textAlign: "left",
    width: "90%",
    marginBottom: 5,
  },
});
