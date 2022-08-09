import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import newWallet from "../functions/CreateNewWallet";
import getStore from "../store/storeSt";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import hashPass from "../functions/HashPassword";

const LoginOpenScreen = () => {
  const storePassword = getStore();

  const navigation = useNavigation();

  const [_password, setPassword] = React.useState("");

  const navigateToWallet = () => {
    navigation.navigate("WalletView");
  };

  const handlePasswordChange = (password) => {
    setPassword(password);
  };

  const checkPasswords = () => {
    if (hashPass(_password) === storePassword.getState()["password"]) {
      storePassword.dispatch({
        type: "setSession",
        payload: "open",
      });
      storePassword.dispatch({
        type: "setError",
        payload: "",
      });
      //console.log(storePassword.getState()); <-- LOG STORE STATE
      navigateToWallet();
    } else {
      alert("Incorrect password");
      storePassword.dispatch({
        type: "setError",
        payload: "Incorrect password",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <MaterialCommunityIcons name="ninja" size={130} color="#c501e2" />
      </Text>
      <Text style={styles.title}>Ninja</Text>
      <Text style={[styles.title, { fontSize: 35, marginTop: -13 }]}>
        Wallet
      </Text>
      <Text style={styles.subTitle}>Sign In to your account</Text>
      <TextInput
        autoCapitalize="none"
        secureTextEntry={true}
        placeholder="Password"
        style={styles.textInput}
        placeholderTextColor="grey"
        onChangeText={handlePasswordChange}
      />

      <TouchableOpacity
        onPress={() => {
          checkPasswords();
        }}
        style={styles.button}
      >
        <Text style={styles.textButton}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#120052',
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 60,
    color: "#c501e2",
    fontWeight: "bold",
    fontFamily: "AppleSDGothicNeo-Bold",
    shadowColor: "#828282",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.3,
    elevation: 3,
  },
  subTitle: {
    fontSize: 15,
    color: "#c501e2",
  },
  button: {
    //backgroundColor: '#c501e2',
    borderWidth: 0,
    backgroundColor: "#c501e2",
    padding: 10,
    marginTop: "10%",
    width: "50%",
    alignSelf: "center",
    borderRadius: 30,
    marginBottom: 30,

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
  textInput: {
    color: "black",
    padding: 10,
    paddingStart: 30,
    borderWidth: 1,
    borderColor: "#c501e2",
    padding: 10,
    width: "80%",
    height: 50,
    marginTop: 20,
    borderRadius: 30,
  },
});

export default LoginOpenScreen;
