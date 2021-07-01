import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
} from "react-native";
import numberToCurrency from "../helpers/NumberToCurrency";
import { URL } from "../restApiUrl.js";
import colors from "../styles/colors.js";
import { Formik } from "formik";
import * as yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";

const reviewSchema = yup.object({
  order: yup.object({
    city: yup.string().max(35, "City name must be at most 35 characters!"),
    street: yup.string().max(35, "Street name must be at most 35 characters!"),
    street_number: yup
      .string()
      .max(8, "Street nr must be at most 8 characters!"),
    phone_number: yup
      .string()
      .required("Phone nr is required!")
      .min(7, "Phone nr must be at least 7 characters!")
      .max(11, "Phone nr must be at most 11 characters!"),
    note: yup.string().max(50, "Note must be at most 50 characters!"),
  }),
});

export default function CheckoutScreen({ route, navigation }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);
  const [isPersonalPickup, setIsPersonalPickup] = useState(false);
  const [userId, setUserId] = useState(null);
  const params = route.params;
  const [items, setItems] = useState(params.cart);
  const API_URL = URL;

  useEffect(() => {
    getId();
  }, []);

  const getId = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      if (id !== null) {
        setUserId(id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = (values) => {
    setIsPending(true);

    fetch(`${API_URL}/api/v1/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
      .then((response) => {
        setIsPending(false);
        if (!response.ok) throw new Error(response.status);
        else console.log(response);
      })
      .catch((error) => {
        console.error(error);
        setError(true);
      });
  };

  const displayCourses = (cart, courses) => {
    const display_text = courses.map((course, key) => {
      if (course.id in cart) {
        return (
          <View style={styles.singularCourse} key={key}>
            <Text style={styles.courseText}>
              {cart[course.id]} x: {course.name} -{" "}
              {numberToCurrency(course.price * cart[course.id])}
            </Text>
          </View>
        );
      }
    });
    return display_text;
  };

  const countCummary = (cart, courses) => {
    let sum = 0;
    for (const course of courses) {
      if (course.id in cart) {
        sum += course.price * cart[course.id];
      }
    }
    return sum;
  };

  return (
    <ScrollView>
      <View style={styles.orderContainer}>
        <Text style={styles.startText}>Collect Epic order!</Text>
        {displayCourses(params.cart, params.courses)}
        <View style={styles.summaryView}>
          <Text style={styles.summaryText}>
            Summary:{" "}
            {numberToCurrency(countCummary(params.cart, params.courses))}
          </Text>
        </View>

        <Text style={styles.textOne}>Fill in the details!</Text>

        <Formik
          validationSchema={reviewSchema}
          style={{ flex: 1 }}
          initialValues={{
            order: {
              user_id: "",
              city: "",
              street: "",
              street_number: "",
              phone_number: "",
              note: "",
              items: params.cart,
              personal_pickup: false,
            },
          }}
          //onSubmit={(values) => console.log(values)}>
          onSubmit={(values) => {
            values.order.user_id = userId;
            //console.log(JSON.stringify(values));
            handleSubmit(values);
          }}>
          {({
            handleChange,
            setFieldValue,
            handleSubmit,
            handleBlur,
            errors,
            touched,
            values,
          }) => (
            <View style={styles.form}>
              <View style={styles.switchContainer}>
                <Text style={styles.pickupText}>Wanna pick up personally?</Text>
                <Switch
                  trackColor={{ false: "#767577", true: colors.fontGray }}
                  thumbColor={isPersonalPickup ? colors.mainMaroon : "#f4f3f4"}
                  onValueChange={() => {
                    setIsPersonalPickup(!isPersonalPickup);
                    setFieldValue(
                      "order.personal_pickup",
                      !values.order.personal_pickup
                    );
                  }}
                  value={isPersonalPickup}
                />
              </View>
              {!isPersonalPickup && (
                <View style={{ width: "100%", alignItems: "center" }}>
                  <TextInput
                    style={styles.orderInput}
                    onChangeText={handleChange("order.city")}
                    placeholder="City name"
                    value={values.order.city}
                    onBlur={handleBlur("order.city")}
                  />
                  <Text style={{ color: colors.mainMaroon }}>
                    {errors.order &&
                      touched.order &&
                      touched.order.city &&
                      errors.order.city}
                  </Text>
                </View>
              )}

              {!isPersonalPickup && (
                <View style={{ width: "100%", alignItems: "center" }}>
                  <TextInput
                    style={styles.orderInput}
                    onChangeText={handleChange("order.street")}
                    placeholder="Street name"
                    value={values.order.street}
                    onBlur={handleBlur("order.street")}
                  />
                  <Text style={{ color: colors.mainMaroon }}>
                    {errors.order &&
                      touched.order &&
                      touched.order.street &&
                      errors.order.street}
                  </Text>
                </View>
              )}

              {!isPersonalPickup && (
                <View style={{ width: "100%", alignItems: "center" }}>
                  <TextInput
                    style={styles.orderInput}
                    onChangeText={handleChange("order.street_number")}
                    placeholder="Street number"
                    value={values.order.street_number}
                    onBlur={handleBlur("order.street_number")}
                  />
                  <Text style={{ color: colors.mainMaroon }}>
                    {errors.order &&
                      touched.order &&
                      touched.order.street_number &&
                      errors.order.street_number}
                  </Text>
                </View>
              )}
              <TextInput
                style={styles.orderInput}
                onChangeText={handleChange("order.phone_number")}
                placeholder="Phone number"
                value={values.order.phone_number}
                onBlur={handleBlur("order.phone_number")}
                keyboardType="numeric"
              />
              <Text style={{ color: colors.mainMaroon }}>
                {errors.order &&
                  touched.order &&
                  touched.order.phone_number &&
                  errors.order.phone_number}
              </Text>

              <TextInput
                style={styles.orderInput}
                onChangeText={handleChange("order.note")}
                placeholder="Note for your order"
                value={values.order.note}
                onBlur={handleBlur("order.note")}
              />
              <Text style={{ color: colors.mainMaroon }}>
                {errors.order &&
                  touched.order &&
                  touched.order.note &&
                  errors.order.note}
              </Text>

              {!isPending && (
                <TouchableOpacity
                  style={styles.submit}
                  onPress={() => {
                    handleSubmit();
                    navigation.navigate("Restaurants");
                  }}
                  title="Order">
                  <Text style={styles.submitText}>Order</Text>
                </TouchableOpacity>
              )}

              {isPending && (
                <TouchableOpacity style={styles.submit}>
                  <Text style={styles.submitText}>Ordering...</Text>
                </TouchableOpacity>
              )}

              {error && (
                <Text style={styles.courseText}>
                  Something went wrong... try again later.
                </Text>
              )}
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    paddingTop: 50,
    flex: 1,
    alignItems: "center",
    //backgroundColor: "#fff",
  },
  startText: {
    color: colors.fontGray,
    fontSize: 32,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginLeft: "5%",
  },
  singularCourse: {
    width: "90%",
    backgroundColor: colors.backgroundWhite,
    paddingLeft: 30,
    paddingVertical: 4,
    marginTop: 15,
    borderWidth: 2,
    borderColor: colors.mainMaroon,
    borderRadius: 4,
  },
  courseText: {
    color: colors.fontGray,
    fontSize: 18,
    fontWeight: "500",
  },
  summaryView: {
    width: "100%",
    backgroundColor: colors.backgroundWhite,
    paddingLeft: 50,
    paddingVertical: 4,
    marginTop: 15,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.mainMaroon,
  },
  summaryText: {
    color: colors.fontGray,
    fontSize: 20,
    fontWeight: "700",
  },
  textOne: {
    marginTop: 25,
    marginBottom: 10,
    color: colors.fontGray,
    fontSize: 22,
    fontWeight: "600",
    alignSelf: "flex-start",
    marginLeft: "5%",
    textDecorationLine: "underline",
  },
  form: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    marginLeft: "5%",
  },
  pickupText: {
    fontSize: 16,
    marginRight: 16,
  },
  orderInput: {
    width: "90%",
    height: 35,
    borderWidth: 1,
    marginVertical: 10,
    padding: 5,
    backgroundColor: colors.backgroundWhite,
  },
  submit: {
    width: "80%",
    height: 45,
    backgroundColor: colors.mainMaroon,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "400",
  },
});
