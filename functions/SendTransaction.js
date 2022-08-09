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
  * _amount: Cantidad en ETH a enviar.
  * _to: Dirección a la que se enviará el ETH.
  * _privatekey: Clave privada de la wallet que enviará el ETH.
  * _provider: Nombre del proveedor de la wallet.

  Esta función envia ETH a una dirección determinada para un proveedor determinado.
*/


const sendTransaction = async (_amount, _to, _privatekey, _provider) => {
  const addressTo = _to;
  const privateKey = _privatekey;
  const amount = _amount;
  const providerName = _provider;
  const providerLower = providerName.toLowerCase();
  const provider = ethers.getDefaultProvider(providerLower);
  const wallet = new ethers.Wallet(privateKey, provider);
  const amountWei = ethers.utils.parseEther(amount);

  const transaction = {
    to: addressTo,
    value: amountWei,
  };

  let sendPromise = wallet.sendTransaction(transaction);
  sendPromise
    .then((transaction) => {
      //console.log(transaction); <-- LOG TRANSACTION
    })
    .catch((error) => {
      console.log(error);
    });
};

export default sendTransaction;
