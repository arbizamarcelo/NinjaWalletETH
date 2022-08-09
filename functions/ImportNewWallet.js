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
  * _privateKey: Clave privada de la wallet.

  Esta función se utiliza para importar una wallet desde una privateKey
  y luego se encripta e inserta en el archivo wallet.json.
  La encriptación se hace con la password que le pasemos.
*/

const importNewWallet = async (privateKeytoImport, _password) => {
  const storePassword = getStore();
  const password = _password;
  const wallet = new ethers.Wallet(privateKeytoImport);
  storePassword.dispatch({ type: "setAddress", payload: wallet.address });

  let encryptPromise = await wallet.encrypt(password);

  await AsyncStorage.setItem("wallet", encryptPromise);

  const json = encryptPromise;
  const fileName = "wallet.json";
  const filePath = FileSystem.documentDirectory + fileName;
  const newObj = [];
  newObj.push(json);
  const newJSON = JSON.stringify(newObj);
  await FileSystem.writeAsStringAsync(filePath, newJSON);
};

export default importNewWallet;
