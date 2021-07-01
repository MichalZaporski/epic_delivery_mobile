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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Formik } from "formik";
import * as yup from "yup";

const reviewSchema = yup.object({
  order: yup.object({
    opinion: yup
      .number()
      .typeError("Please, put a number.")
      .required("Opinion can't be blank.")
      .min(1, "Minimal opinion is 1!")
      .max(5, "Maximal opinion is 5!"),
  }),
});

export default function UserScreen({ navigation }) {
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [newLogin, setNewLogin] = useState(0);
  const [dataOrders, setDataOrders] = useState([]);
  const [userName, setUserName] = useState("");
  const [tokenState, setTokenState] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [rateModalVisible, setRateModalVisible] = useState(false);
  const [newQueryAmonut, setNewQueryAmount] = useState(0);
  const [newOpinionAmonut, setNewOpinionAmount] = useState(0);
  const [currentOrderId, setCurrentOrderId] = useState(0);
  const API_URL = URL;

  // check if is logged
  useEffect(() => {
    getOrders();
  }, [newLogin, newOpinionAmonut]);

  const getOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("JWT");
      const name = await AsyncStorage.getItem("name");
      const id = await AsyncStorage.getItem("id");
      if (token !== null) {
        //console.log(id);
        setUserName(name);
        setTokenState(token);
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
              storeUser(json.token, json.name, json.id).then(() =>
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

  const storeUser = async (token, name, id) => {
    try {
      await AsyncStorage.setItem("JWT", token);
      await AsyncStorage.setItem("name", name);
      await AsyncStorage.setItem("id", id.toString());
    } catch (e) {
      // saving error
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("JWT");
      await AsyncStorage.removeItem("name");
      await AsyncStorage.removeItem("id");
      setIsLogged(false);
      setLoginModalVisible(true);
    } catch (e) {
      // saving error
    }
  };

  const handleSubmit = (values) => {
    //console.log(123123);
    fetch(`${API_URL}/api/v1/orders/${currentOrderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenState}`,
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        setIsPending(false);
        if (!response.ok) throw new Error(response.status);
        else setRateModalVisible(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <View style={styles.topBar}>
        <Text style={styles.epicText}>Epic delivery</Text>
      </View>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View style={{ flex: 1 }}>
          {isLogged ? (
            <View style={{ flex: 1 }}>
              <Text style={styles.helloText}>Hello {userName}!</Text>
              <TouchableOpacity onPress={() => logout()} style={styles.logout}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>

              <FlatList
                data={dataOrders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setCurrentOrderId(item.id);
                      setRateModalVisible(true);
                      //console.log(item.id);
                    }}>
                    <View style={styles.singleOrder}>
                      <Text style={styles.orderText}>Order ID: {item.id}</Text>

                      <Text style={styles.orderText}>
                        Restaurant: {item.restaurant}
                      </Text>

                      <Text style={styles.orderText}>
                        Order date: {item.created_at}
                      </Text>

                      <Text style={styles.orderText}>
                        Place: {item.city}, {item.street} {item.street_number}
                      </Text>

                      <Text style={styles.orderText}>Food ordered:</Text>

                      {item.courses.map((category, key) => (
                        <Text key={key} style={styles.orderCoursesText}>
                          -- {category}
                        </Text>
                      ))}

                      <Text style={styles.orderText}>
                        Status: {item.status}
                      </Text>

                      <Text style={styles.orderText}>
                        Opinion: {item.opinion}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : (
            <Text style={styles.helloText}>Sign in to see your orders! </Text>
          )}
        </View>
      )}
      <Modal
        animationType="slide"
        visible={loginModalVisible}
        transparent={true}>
        <View style={styles.filterModal}>
          <TouchableOpacity
            style={styles.xImageContainer}
            onPress={() => setLoginModalVisible(false)}>
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

      <Modal
        animationType="slide"
        visible={rateModalVisible}
        transparent={true}>
        <View style={styles.filterModal}>
          <Formik
            validationSchema={reviewSchema}
            style={{ flex: 1 }}
            initialValues={{
              order: {
                opinion: "",
              },
            }}
            onSubmit={(values) => {
              handleSubmit(values);
            }}>
            {({
              handleChange,
              handleSubmit,
              handleBlur,
              errors,
              touched,
              values,
            }) => (
              <View>
                <TouchableOpacity
                  onPress={() => setRateModalVisible(false)}
                  style={styles.xImageContainer}>
                  <Image
                    style={styles.xImage}
                    source={require("../assets/x.png")}
                  />
                </TouchableOpacity>
                <Text style={styles.filterText}>Rate order from 1 to 5:</Text>
                <TextInput
                  style={styles.filterInput}
                  onChangeText={handleChange("order.opinion")}
                  placeholder="Ex. 4"
                  value={values.order.opinion}
                  onBlur={handleBlur("order.opinion")}
                  keyboardType="numeric"
                />
                <Text style={{ color: colors.mainMaroon }}>
                  {errors.order &&
                    touched.order &&
                    touched.order.opinion &&
                    errors.order.opinion}
                </Text>

                <TouchableOpacity
                  style={styles.submit}
                  onPress={() => {
                    handleSubmit();
                    setNewOpinionAmount(newOpinionAmonut + 1);
                  }}
                  title="Rate">
                  <Text style={styles.submitText}>Rate</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
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
  filterModal: {
    position: "absolute",
    bottom: "30%",
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
    alignSelf: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "400",
  },
  xImageContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  xImage: {
    width: 20,
    height: 20,
  },
  helloText: {
    fontSize: 22,
    textAlign: "left",
    marginLeft: 15,
    marginVertical: 8,
    fontWeight: "500",
    color: "#444b4c",
  },
  logout: {
    alignSelf: "flex-start",
    marginLeft: 15,
    width: 100,
    height: 30,
    backgroundColor: colors.mainMaroon,
    borderRadius: 4,
    justifyContent: "center",
  },
  logoutText: {
    textAlign: "center",
    color: "#fff",
  },
  singleOrder: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#afa5ab",
    paddingVertical: 6,
  },
  orderText: {
    fontSize: 16,
    textAlign: "left",
    width: "90%",
    marginBottom: 4,
    fontWeight: "400",
    color: "#444b4c",
  },
  orderCoursesText: {
    textAlign: "left",
    width: "90%",
    marginLeft: 20,
    fontSize: 14,
  },
});
