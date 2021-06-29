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
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import colors from "../styles/colors.js";
import { Picker } from "@react-native-picker/picker";

export default function RestaurantsScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [dataRestaurants, setDataRestaurants] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [cityName, setCityName] = useState("");
  const [selectedRaiting, setSelectedRaiting] = useState("");
  const [newQueryAmonut, setNewQueryAmount] = useState(0);
  const API_URL = URL;
  const raiting_notes = ["1", "2", "3", "4", "5"];

  // fetching data (restaurants) from REST API
  useEffect(() => {
    let queryURL = `${API_URL}/api/v1/restaurants/search?`;

    if (selectedCategory.length > 0) {
      queryURL += `&category_name=${selectedCategory}`;
    }

    if (restaurantName.length > 0) {
      queryURL += `&name=${restaurantName}`;
    }

    if (cityName.length > 0) {
      queryURL += `&city=${cityName}`;
    }

    if (selectedRaiting.length > 0) {
      queryURL += `&opinion=${selectedRaiting}`;
    }

    // console.log(queryURL);

    fetch(queryURL)
      .then((response) => response.json())
      .then((json) => setDataRestaurants(json))
      .catch((error) => console.error(error));

    fetch(`${API_URL}/api/v1/categories`)
      .then((response) => response.json())
      .then((json) => setDataCategories(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [newQueryAmonut]);

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
      <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Image
            source={require("../assets/maps.png")}
            style={styles.filterImage}
          />
        </TouchableOpacity>
        <Modal
          animationType="slide"
          visible={filterModalVisible}
          transparent={true}>
          <View style={styles.filterModal}>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Image
                style={styles.xImage}
                source={require("../assets/x.png")}
              />
            </TouchableOpacity>

            <Text style={styles.filterText}>Choose category:</Text>
            <Picker
              style={styles.picker}
              selectedValue={selectedCategory}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedCategory(itemValue);
              }}>
              <Picker.Item label="Category" value="" />
              {dataCategories.map((item, index) => {
                return (
                  <Picker.Item
                    label={item.category_name}
                    value={item.category_name}
                    key={index.id}
                  />
                );
              })}
            </Picker>

            <Text style={styles.filterText}>Restaurant name::</Text>
            <TextInput
              onChangeText={setRestaurantName}
              style={styles.filterInput}
              placeholder="Ex.: panda"
              value={restaurantName}
            />

            <Text style={styles.filterText}>City name:</Text>
            <TextInput
              onChangeText={setCityName}
              style={styles.filterInput}
              placeholder="Ex.: Poznań"
              value={cityName}
            />

            <Text style={styles.filterText}>Minimal rating:</Text>
            <Picker
              style={styles.picker}
              selectedValue={selectedRaiting}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedRaiting(itemValue);
              }}>
              <Picker.Item label="Raiting" value="" />
              {raiting_notes.map((item, index) => {
                return <Picker.Item label={item} value={item} key={index.id} />;
              })}
            </Picker>

            <TouchableOpacity
              style={styles.submit}
              onPress={() => {
                setFilterModalVisible(false);
                setNewQueryAmount(newQueryAmonut + 1);
              }}>
              <Text style={styles.submitText}>Search</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
          <Image
            source={require("../assets/filter.png")}
            style={styles.filterImage}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("User")}>
          <Image
            source={require("../assets/person.png")}
            style={styles.filterImage}
          />
        </TouchableOpacity>
      </View>
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
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
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
  filterImage: {
    width: 40,
    height: 40,
  },
  filterModal: {
    height: "auto",
    width: "95%",
    margin: "auto",
    backgroundColor: colors.backgroundWhite,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: colors.mainMaroon,
    padding: 15,
  },
  picker: {
    width: "70%",
    fontSize: 15,
    borderColor: colors.mainMaroon,
  },
  filterInput: {
    borderBottomWidth: 1,
    borderColor: colors.mainMaroon,
    fontSize: 15,
  },
  filterText: {
    marginTop: 20,
    marginBottom: 4,
    fontSize: 18,
  },
  submit: {
    width: "60%",
    height: 35,
    backgroundColor: colors.mainMaroon,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    marginBottom: 15,
    marginHorizontal: "auto",
  },
  submitText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "400",
  },
  xImage: {
    position: "absolute",
    width: 20,
    height: 20,
    top: 10,
    right: 10,
  },
});
