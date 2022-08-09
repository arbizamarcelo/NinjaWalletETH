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

const getHistory = async () => {
  const address = _address;
  const providerName = _provider;
  const providerLower = providerName.toLowerCase();
  let etherscanProvider = await new ethers.providers.EtherscanProvider(
    providerLower
  );
  etherscanProvider
    .getHistory(address)
    .then((history) => {
      const historyJson = JSON.stringify(history);
      AsyncStorage.setItem("history", historyJson);
      //extract the key and values hash, from, to, value, and timestamp
      const historyArray = [];
      for (let i = 0; i < history.length; i++) {
        const historyObj = {
          hash: history[i].hash,
          from: history[i].from,
          to: history[i].to,
          value: history[i].value / 1000000000000000000,
          Date: new Date(history[i].timestamp * 1000).toLocaleDateString(),
          Time: new Date(history[i].timestamp * 1000).toLocaleTimeString(),
        };
        historyArray.push(historyObj);
      }
      const historyArrayJson = JSON.stringify(historyArray);
      AsyncStorage.setItem("historyArray", historyArrayJson);
      const historyArrayString = historyArrayJson
        .replace(/[{}]/g, "")
        .replace(/[\[\]]/g, "")
        .replace(/,/g, "\n")
        .replace(/value/g, "\nvalue\n")
        .replace(/Date/g, "\nDate\n")
        .replace(/Time/g, "\nTime\n");
      //charge the historyArrayString to a _history variable
      setHistory(historyArrayString);
    })
    .catch((error) => {
      console.log(error);
    });
};

export default getHistory;
