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
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  Switch,
} from "react-native";
import numberToCurrency from "../helpers/NumberToCurrency";
import { URL } from "../restApiUrl.js";
import { Formik } from "formik";
import colors from "../styles/colors.js";
//import { Switch } from "@ant-design/react-native";

export default function CheckoutScreen({ route, navigation }) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);
  const [isPersonalPickup, setIsPersonalPickup] = useState(false);
  const params = route.params;
  const [items, setItems] = useState(params.cart);
  const API_URL = URL;

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
    const display_text = courses.map((course) => {
      if (course.id in cart) {
        return (
          <View style={styles.singularCourse}>
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
    <View style={styles.orderContainer}>
      <Text style={styles.startText}>Collect Epic order!</Text>
      {displayCourses(params.cart, params.courses)}
      <View style={styles.summaryView}>
        <Text style={styles.summaryText}>
          Summary: {numberToCurrency(countCummary(params.cart, params.courses))}
        </Text>
      </View>

      <Text style={styles.textOne}>Fill in the details!</Text>

      <Formik
        style={{ flex: 1 }}
        initialValues={{
          order: {
            city: "",
            street: "",
            street_number: "",
            phone_number: "",
            note: "",
            items: params.cart,
            personal_pickup: false,
          },
        }}
        onSubmit={(values) => handleSubmit(values)}>
        {({ handleChange, setFieldValue, handleSubmit, values }) => (
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
              <TextInput
                style={styles.orderInput}
                onChangeText={handleChange("order.city")}
                placeholder="City name"
                value={values.order.city}
              />
            )}

            {!isPersonalPickup && (
              <TextInput
                style={styles.orderInput}
                onChangeText={handleChange("order.street")}
                placeholder="Street name"
                value={values.order.street}
              />
            )}

            {!isPersonalPickup && (
              <TextInput
                style={styles.orderInput}
                onChangeText={handleChange("order.street_number")}
                placeholder="Street number"
                value={values.order.street_number}
              />
            )}
            <TextInput
              style={styles.orderInput}
              onChangeText={handleChange("order.phone_number")}
              placeholder="Phone number"
              value={values.order.phone_number}
            />
            <TextInput
              style={styles.orderInput}
              onChangeText={handleChange("order.note")}
              placeholder="Note for your order"
              value={values.order.note}
            />

            {!isPending && (
              <TouchableOpacity
                style={styles.submit}
                onPress={handleSubmit}
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
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    paddingTop: 50,
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
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
