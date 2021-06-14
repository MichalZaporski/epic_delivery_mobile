import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { URL } from "../restApiUrl.js";

export default function CoursesScreen(navigation) {
  const [isLoading, setLoading] = useState(true);
  const [dataCourses, setDataCourses] = useState([]);
  const API_URL = URL;
  const params = navigation.route.params;
  const [cart, setCart] = useState({});

  // fetching data (courses of particular restayrant)
  useEffect(() => {
    fetch(
      `${API_URL}/api/v1/restaurants/${params.restaurant_id}/courses/search`
    )
      .then((response) => response.json())
      .then((json) => setDataCourses(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  const changeCartStatus = (item_id) => {
    if (cart.hasOwnProperty(item_id))
      setCart((oldCart) => {
        oldCart[item_id] += 1;
        return { ...oldCart };
      });
    else setCart((oldCart) => ({ ...oldCart, [item_id]: 1 }));
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <Image
          style={styles.restaurantImage}
          source={{ uri: API_URL + params.image }}
        />

        <View style={styles.restaurantInfoContainer}>
          <View style={styles.restaurantInfoLeft}>
            <Text style={styles.RestaurantTextName}>{params.name}</Text>
            <Text style={styles.RestaurantTextDescription}>
              {params.address}
            </Text>
            <Text style={styles.RestaurantTextDescription}>
              Call: {params.phone_number}
            </Text>
          </View>
          <View style={styles.restaurantInfoRight}>
            <View style={styles.displayInRow}>
              <Image
                style={styles.starImage}
                source={require("../assets/star.png")}
              />
              <Text style={styles.opinionText}>4/5</Text>
            </View>
            <View style={styles.displayInRow}>
              <Image
                style={styles.starImage}
                source={require("../assets/people.png")}
              />
              <Text style={styles.opinionText}>11</Text>
            </View>
          </View>
        </View>

        <View style={styles.coursesContainer}>
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <FlatList
              data={dataCourses}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                //chaning status of the cart
                <TouchableOpacity onPress={() => changeCartStatus(item.id)}>
                  <View style={styles.singleCourse}>
                    <Text style={styles.courseTextName}>{item.name}</Text>
                    <Text style={styles.courseTextDescription}>
                      {item.description}
                    </Text>
                    <Text style={styles.courseTextPrice}>{item.price}</Text>
                  </View>
                  <Image
                    style={styles.plusImage}
                    source={require("../assets/plus_sign.png")}
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>

      <View style={styles.cartBottom}>
        <Text>{JSON.stringify(cart)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  restaurantImage: {
    width: "100%",
    height: 160,
    borderBottomWidth: 4,
    borderColor: "#000",
  },
  restaurantInfoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 4,
    borderColor: "#a1190d",
    backgroundColor: "#f4f4f4",
    flexDirection: "row",
  },
  RestaurantTextName: {
    fontSize: 25,
    fontWeight: "500",
    color: "#444b4c",
  },
  RestaurantTextDescription: {
    fontSize: 18,
    fontWeight: "300",
    color: "#444b4c",
  },
  restaurantInfoLeft: {
    flex: 3,
  },
  restaurantInfoRight: {
    flex: 1,
    paddingTop: 15,
  },
  starImage: {
    width: 25,
    height: 25,
    marginRight: 9,
  },
  displayInRow: {
    flexDirection: "row",
    marginBottom: 13,
  },
  opinionText: {
    fontWeight: "500",
    fontSize: 16,
  },
  coursesContainer: {
    flex: 1,
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#fff",
  },
  singleCourse: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    margin: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#afa5ab",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  courseTextName: {
    fontSize: 22,
    fontWeight: "500",
    color: "#444b4c",
  },
  courseTextDescription: {
    fontSize: 17,
    fontWeight: "300",
    color: "#444b4c",
    marginBottom: 5,
  },
  courseTextPrice: {
    fontSize: 21,
    color: "#a1190d",
  },
  plusImage: {
    width: 30,
    height: 30,
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  cartBottom: {
    height: 85,
    borderTopWidth: 2,
    borderColor: "#a1190d",
  },
});
