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

/*
  Parámetros:
  * _password: Contraseña de la wallet.

  Esta función desencripta la wallet y devuelve la misma.
  Lo hará con el password que le pasemos desde el archivo wallet.json.
*/

const decryptWalletStd = async (_password) => {
  const fileName = "wallet.json";
  const filePath = FileSystem.documentDirectory + fileName;
  const file = await FileSystem.readAsStringAsync(filePath);
  const json = await JSON.parse(file);
  const wallet = await ethers.Wallet.fromEncryptedJson(json, _password);
  return wallet;
};

export default decryptWalletStd;
