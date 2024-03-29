import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import RestaurantsScreen from "./screens/RestaurantsScreen";
import CoursesScreen from "./screens/CoursesScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import UserScreen from "./screens/UserScreen";

const Stack = createStackNavigator();

export const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Restaurants" component={RestaurantsScreen} />
      <Stack.Screen name="Courses" component={CoursesScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="User" component={UserScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
