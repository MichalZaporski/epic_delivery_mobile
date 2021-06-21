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
} from "react-native";
import { URL } from "../restApiUrl.js";
import { Formik } from "formik";
import colors from "../styles/colors.js";

export default function CheckoutScreen({ route, navigation }) {
  const params = route.params;
  const [items, setItems] = useState(params.cart);

  return (
    <View style={{ flex: 1 }}>
      <Text>{JSON.stringify(params.cart)}</Text>
      <Formik
        initialValues={{
          city: "",
          street: "",
          street_number: "",
          phone_number: "",
        }}
        onSubmit={(values) => console.log(values)}>
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View style={styles.orderContainer}>
            <TextInput
              style={styles.orderInput}
              onChangeText={handleChange("city")}
              placeholder="City name"
              value={values.city}
            />
            <TextInput
              style={styles.orderInput}
              onChangeText={handleChange("street")}
              placeholder="Street name"
              value={values.street}
            />
            <TextInput
              style={styles.orderInput}
              onChangeText={handleChange("street_number")}
              placeholder="Street number"
              value={values.street_number}
            />
            <TextInput
              style={styles.orderInput}
              onChangeText={handleChange("phone_number")}
              placeholder="Phone number"
              value={values.phone_number}
            />

            <TouchableOpacity
              style={styles.submit}
              onPress={handleSubmit}
              title="Order">
              <Text style={styles.submitText}>Order</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  orderContainer: {
    flex: 1,
    alignItems: "center",
  },
  orderInput: {
    width: "80%",
    height: 35,
    borderWidth: 1,
    marginVertical: 10,
    padding: 5,
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
