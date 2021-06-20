import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
} from "react-native";
import { URL } from "../restApiUrl.js";
import numberToCurrency from "../helpers/NumberToCurrency";
import { Picker } from "@react-native-picker/picker";

export default function CoursesScreen(navigation) {
  const [isLoading, setLoading] = useState(true);
  const [dataCourses, setDataCourses] = useState([]);
  const [cart, setCart] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(); // zmienic cos tu moze
  const [minPrice, setMinPrice] = useState();
  const [maxPirce, setMaxPrice] = useState();
  const [newQueryAmonut, setNewQueryAmount] = useState(0);
  const API_URL = URL;
  const params = navigation.route.params;

  // fetching data (courses of particular restayrant)
  useEffect(() => {
    let queryURL = `${API_URL}/api/v1/restaurants/${params.restaurant_id}/courses/search?`;
    if (
      typeof selectedCategory != "undefined" &&
      selectedCategory.length != 0
    ) {
      queryURL += `&category=${selectedCategory}`;
    }

    if (typeof minPrice != "undefined") {
      queryURL += `&price_min=${minPrice}`;
    }

    if (typeof maxPirce != "undefined") {
      queryURL += `&price_max=${maxPirce}`;
    }
    // console.log(queryURL);

    fetch(queryURL)
      .then((response) => response.json())
      .then((json) => setDataCourses(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [newQueryAmonut]);

  // adding items to the cart
  const changeCartStatus = (item_id) => {
    if (cart.hasOwnProperty(item_id))
      setCart((oldCart) => {
        oldCart[item_id] += 1;
        return { ...oldCart };
      });
    else setCart((oldCart) => ({ ...oldCart, [item_id]: 1 }));
  };

  // displaying items in a cart (bootom view)
  const displayCartItems = (items) => {
    // length == 2 is when cart object is {}
    if (JSON.stringify(items).length == 2) {
      return "Add items to the cart.";
    } else {
      let result = "";
      // key - course id, value - quantity
      for (let [key, value] of Object.entries(items)) {
        let course = dataCourses.find((c) => c.id == key);

        result += `${value} x: ${course.name} ${numberToCurrency(
          course.price * value
        )}\n`;
      }
      return result;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
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

        <View style={styles.filter}>
          <Picker
            style={styles.picker}
            selectedValue={selectedCategory}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedCategory(itemValue)
            }>
            <Picker.Item label="Category" value="" />
            {params.categories.map((item, index) => {
              return <Picker.Item label={item} value={item} key={index} />;
            })}
          </Picker>
          <TextInput
            onChangeText={setMinPrice}
            style={styles.placeholderPrice}
            placeholder="Min. price"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.placeholderPrice}
            onChangeText={setMaxPrice}
            placeholder="Max. price"
            keyboardType="numeric"
          />
          <TouchableOpacity
            onPress={() => setNewQueryAmount(newQueryAmonut + 1)}>
            <Image
              style={styles.searchImage}
              source={require("../assets/search.png")}
            />
          </TouchableOpacity>
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
                    <Text style={styles.courseTextPrice}>
                      {numberToCurrency(item.price)}
                    </Text>
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
      </SafeAreaView>

      <TouchableOpacity>
        <View style={styles.cartBottom}>
          <Image
            style={styles.cartImage}
            source={require("../assets/cart.png")}
          />
          <Text style={styles.cartText}>{displayCartItems(cart)}</Text>
          <Image
            style={styles.arrowImage}
            source={require("../assets/right_arrow.png")}
          />
        </View>
      </TouchableOpacity>
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
  filter: {
    padding: 12,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#afa5ab",
    padding: 5,
    marginHorizontal: 10,
    width: "25%",
    color: "#444b4c",
  },
  placeholderPrice: {
    borderWidth: 1,
    borderColor: "#afa5ab",
    padding: 5,
    marginHorizontal: 10,
    width: "25%",
    color: "#444b4c",
  },
  searchImage: {
    width: 35,
    height: 35,
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
    height: 110,
    borderTopWidth: 2,
    borderColor: "#a1190d",
    overflow: "scroll",
    justifyContent: "center",
  },
  cartImage: {
    width: 50,
    height: 50,
    position: "absolute",
    left: 20,
    top: 30,
  },
  cartText: {
    marginVertical: 5,
    paddingLeft: 90,
    fontSize: 17,
    fontWeight: "500",
    color: "#444b4c",
  },
  arrowImage: {
    width: 60,
    height: 60,
    position: "absolute",
    right: 8,
    top: 25,
  },
});
