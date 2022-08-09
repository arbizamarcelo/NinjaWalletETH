import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import getStore from "../store/storeSt";

/*
  Parámetros:
  * _password: Contraseña de la wallet.

  Esta función crea una wallet nueva y la guarda encriptada en el archivo wallet.json.
  La encriptación se hace con la password que le pasemos.
*/

const moreWallet = async (_password) => {
  const storePassword = getStore();
  const wallet = await ethers.Wallet.createRandom();
  const password = _password;

  storePassword.dispatch({ type: "setAddress", payload: wallet.address });

  let encryptPromise = await wallet.encrypt(password);

  await AsyncStorage.setItem("wallet", encryptPromise);

  const filePath = FileSystem.documentDirectory + "wallet.json";
  FileSystem.readAsStringAsync(filePath)
    .then(async (json) => {
      const newObj = JSON.parse(json);
      newObj.push(encryptPromise);
      const newJSON = JSON.stringify(newObj);
      await FileSystem.writeAsStringAsync(filePath, newJSON);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default moreWallet;
