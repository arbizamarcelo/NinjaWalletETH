import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

// Screens
import HomeScreen from "./screens/HomeScreen";
import ImportScreen from "./screens/ImportScreen";
import CreateNewScreen from "./screens/CreateNewScreen";
import SecretKeysScreen from "./screens/SecretKeysScreen";
import LoginScreen from "./screens/LoginScreen";
import WalletScreen from "./screens/WalletScreen";
import LoginImportScreen from "./screens/LoginImportScreen";
import LoginOpenScreen from "./screens/LoginOpenScreen";

import getStore from "./store/storeSt";

const HomeStackNavigator = createNativeStackNavigator();

function MyStack() {
  const storePassword = getStore();

  return (
    <HomeStackNavigator.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStackNavigator.Screen name="HomeScreen" component={HomeScreen} />
      <HomeStackNavigator.Screen
        name="LoginImport"
        component={LoginImportScreen}
        options={{
          headerBackTitleVisible: false,
        }}
      />
      <HomeStackNavigator.Screen
        name="LoginOpen"
        component={LoginOpenScreen}
        options={{
          headerBackTitleVisible: false,
        }}
      />
      <HomeStackNavigator.Screen
        name="Import"
        component={ImportScreen}
        options={{
          headerBackTitleVisible: false,
        }}
      />
      <HomeStackNavigator.Screen
        name="CreateNew"
        component={CreateNewScreen}
        options={{
          headerBackTitleVisible: false,
        }}
      />
      <HomeStackNavigator.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerBackTitleVisible: false,
        }}
      />
      <HomeStackNavigator.Screen
        name="SecretKeys"
        component={SecretKeysScreen}
        options={{
          headerBackTitleVisible: false,
        }}
      />
      <HomeStackNavigator.Screen
        name="WalletView"
        component={WalletScreen}
        options={{
          headerBackTitleVisible: false,
        }}
      />
    </HomeStackNavigator.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: "#c501e2",
      }}
    >
      <Tab.Screen
        name="Home"
        component={MyStack}
        options={{
          tabBarLabel: "Feed",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
          headerShown: false,
        }}
        onPress={() => {
          storePassword.dispatch({
            type: "setSession",
            payload: "closed",
          });
          storePassword.dispatch({
            type: "setAppState",
            payload: "inactive",
          });
          storePassword.dispatch({
            type: "setDeleteAddress",
            payload: "",
          });
          storePassword.dispatch({
            type: "setDeletePassword",
            payload: "",
          });

          console.log(storePassword.getState());
        }}
      />
      <Tab.Screen
        name="LoginOpenScreen"
        component={LoginOpenScreen}
        options={{
          tabBarLabel: "Login",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="login" color={color} size={20} />
          ),
          //headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
