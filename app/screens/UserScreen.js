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
  Button,
} from "react-native";
import colors from "../styles/colors.js";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserScreen({ navigation }) {
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [newLogin, setNewLogin] = useState(0);
  const [dataOrders, setDataOrders] = useState([]);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [newQueryAmonut, setNewQueryAmount] = useState(0);
  const API_URL = URL;

  // check if is logged
  useEffect(() => {
    getOrders();
  }, [newLogin]);

  const getOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("JWT");
      if (token !== null) {
        console.log(token);
        fetch(`${API_URL}/api/v1/users/orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((json) => setDataOrders(json))
          .catch((error) => console.error(error))
          .finally(() => {
            setLoading(false);
            setIsLogged(true);
            setLoginModalVisible(false);
          });
      } else {
        setLoading(false);
        setLoginModalVisible(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleLogin = (email, password) => {
    setIsPending(true);

    fetch(`${API_URL}/api/v1/authentication`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then((response) => {
        setIsPending(false);
        if (response.ok) {
          response
            .json()
            .then((json) =>
              storeUser(json.token, json.name).then(() =>
                setNewLogin(newLogin + 1)
              )
            );
        } else console.log("niepoprawne dane");
      })
      .catch((error) => {
        console.error(error);
        //setError(true);
      });
  };

  const storeUser = async (token, name) => {
    try {
      await AsyncStorage.setItem("JWT", token);
      await AsyncStorage.setItem("name", name);
    } catch (e) {
      // saving error
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("JWT");
      await AsyncStorage.removeItem("name");
      setIsLogged(false);
    } catch (e) {
      // saving error
    }
  };

  return (
    <View>
      <Button onPress={() => logout()}>wyloguj</Button>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View>
          {isLogged ? (
            <Text>{JSON.stringify(dataOrders)}</Text>
          ) : (
            <Text>Musisz sie zalogowac</Text>
          )}
        </View>
      )}
      <Text>siemaa</Text>
      <Modal
        animationType="slide"
        visible={loginModalVisible}
        transparent={true}>
        <View style={styles.filterModal}>
          <TouchableOpacity onPress={() => setLoginModalVisible(false)}>
            <Image style={styles.xImage} source={require("../assets/x.png")} />
          </TouchableOpacity>

          <Text style={styles.filterText}>E-mail:</Text>
          <TextInput
            onChangeText={setLoginEmail}
            style={styles.filterInput}
            value={loginEmail}
          />

          <Text style={styles.filterText}>Password:</Text>
          <TextInput
            onChangeText={setLoginPassword}
            style={styles.filterInput}
            value={loginPassword}
            secureTextEntry={true}
          />

          <TouchableOpacity
            style={styles.submit}
            onPress={() => {
              setNewQueryAmount(newQueryAmonut + 1);
              handleLogin(loginEmail, loginPassword);
            }}>
            <Text style={styles.submitText}>Login</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    position: "absolute",
    bottom: 130,
    left: "2.5%",
    height: "auto",
    width: "95%",
    margin: "auto",
    backgroundColor: colors.backgroundWhite,
    borderRadius: 25,
    borderWidth: 4,
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
