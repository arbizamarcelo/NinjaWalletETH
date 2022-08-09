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

  En este caso, la password es la misma que la que se usa para encriptar la wallet.
  Por lo tanto, no es necesario que el usuario ingrese la misma password para desencriptar la wallet.
  Se creará una nueva wallet y se guardará en el dispositivo de forma encriptada.
  El archivo wallet.json se creará en la carpeta de documentos del dispositivo.
*/

const newWallet = async (_password) => {
  const storePassword = getStore();
  const password = _password;
  const wallet = await ethers.Wallet.createRandom();
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

export default newWallet;
