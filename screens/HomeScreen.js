import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import getStore from "../store/storeSt";
import { State } from "react-native-gesture-handler";

const HomeScreen = () => {
  const navigation = useNavigation();

  const storePassword = getStore();

  storePassword.dispatch({
    type: "setDeleteAddress",
    payload: "",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("LoginImport")}
        style={styles.button}
      >
        <Text style={styles.textButton}>Import Wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          storePassword.dispatch({
            type: "setAppState",
            payload: "active",
          });
          // console.log(storePassword.getState()); <-- LOG STORE STATE
          navigation.navigate("Login");
        }}
        style={styles.button}
      >
        <Text style={styles.textButton}>Create New Wallet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    color: "#c501e2",
    fontWeight: "bold",
    textAlign: "center",

    // Shadow
    shadowColor: "#828282",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    elevation: 3,
  },
  button: {
    //backgroundColor: '#c501e2',
    borderWidth: 0,
    backgroundColor: "#c501e2",
    padding: 10,
    marginTop: "20%",
    width: "50%",
    alignSelf: "center",
    borderRadius: 30,

    shadowColor: "#828282",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    elevation: 3,
  },
  textButton: {
    fontSize: 15,
    textAlign: "center",
    color: "white",
  },
  subTitle: {
    fontSize: 15,
    color: "#c501e2",
  },
  textInput: {
    color: "white",
    padding: 10,
    paddingStart: 30,
    borderWidth: 1,
    borderColor: "#c501e2",
    padding: 10,
    width: "80%",
    height: 50,
    marginTop: 20,
    borderRadius: 30,

    // Shadow
    shadowColor: "#828282",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    elevation: 1,
  },
});

export default HomeScreen;
