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

export default function UserScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [dataRestaurants, setDataRestaurants] = useState([]);
  const API_URL = URL;

  // useEffect(() => {
  //   fetch(`${API_URL}/api/v1/users/1/orders`) // zmienic to xd
  //     .then((response) => response.json())
  //     .then((json) => setDataOrders(json))
  //     .catch((error) => console.error(error))
  //     .finally(() => setLoading(false));
  // }, []);

  return <Text>Siema</Text>;
}
