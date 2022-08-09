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
  * _mnemonic: Frase semilla de la wallet.

  En este caso, la password es la misma que la que se usa para encriptar la wallet.
  Por lo tanto, no es necesario que el usuario ingrese la misma password para desencriptar la wallet.
  Se creará una nueva wallet a partir de la Seed phrase y se guardará en el dispositivo de forma encriptada.
  El archivo wallet.json se creará en la carpeta de documentos del dispositivo.
*/

const newWalletImport = async (_password, _mnemonic) => {
  const storePassword = getStore();

  const wallet = await ethers.Wallet.fromMnemonic(
    _mnemonic,
    `m/44'/60'/0'/0/0`
  );
  storePassword.dispatch({ type: "setAddress", payload: wallet.address });
  const password = _password;

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

export default newWalletImport;
