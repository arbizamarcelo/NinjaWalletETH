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
  * _address: Dirección de la wallet.
  * _provider: Nombre del proveedor de la wallet.

  Esta función devuelve el balance de una address para un provider determinado.
  El valor devuelto es un string con dos decimales.
*/

const getBalance = async (_address, _provider) => {
  const address = _address;
  const providerName = _provider;
  const providerLower = providerName.toLowerCase();
  const provider = ethers.getDefaultProvider(providerLower);
  const balance = await provider.getBalance(address);
  const balanceDecimal = parseFloat(ethers.utils.formatEther(balance)).toFixed(
    2
  );
  return balanceDecimal;
};

export default getBalance;
