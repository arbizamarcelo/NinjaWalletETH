import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import getBalance from "../functions/GetBalance";
import moreWallet from "../functions/MoreWallet";
import sendTransaction from "../functions/SendTransaction";
import importNewWallet from "../functions/ImportNewWallet";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import getStore from "../store/storeSt";
import SelectList from "react-native-dropdown-select-list";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import hashPass from "../functions/HashPassword";

const WalletScreen = () => {
  const storePassword = getStore();

  const arrAddressInit = storePassword.getState().address[0];

  const navigation = useNavigation();

  const [_selectedNetwork, setSelectedNetwork] = React.useState("Ropsten");
  const [_selectedAddress, setSelectedAddress] = React.useState(arrAddressInit);
  const [_walletSelected, setWalletSelected] = React.useState({});
  const [importText, setImportText] = useState("");
  const [importPass, setImportPass] = useState("");
  const [_amount, setAmount] = React.useState("");
  const [_to, setTo] = React.useState("");
  const [_history, setHistory] = useState(null);
  const [_balance, setBalance] = React.useState(0);

  const [modalVisibleImport, setModalVisibleImport] = useState(false);
  const [modalVisibleWallet, setModalVisibleWallet] = useState(false);
  const [modalVisiblePK, setModalVisiblePK] = useState(false);
  const [modalVisibleMN, setModalVisibleMN] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (_history != null) {
      Alert.alert("History", _history);
      setHistory(null);
    }
  }, [_history]);

  /*
    Esta función desencripta las wallets en el dispositivo alojadas en el archivo wallet.json
    y devuelve la wallet que coincida con la address que esté seleccionada.
  */
  const getWalletDecryptAllWallets = async () => {
    const storeP = storePassword.getState()["password"];
    const filePath = FileSystem.documentDirectory + "wallet.json";
    FileSystem.readAsStringAsync(filePath).then(async (json) => {
      const newObj = JSON.parse(json);
      for (let i = 0; i < newObj.length; i++) {
        await ethers.Wallet.fromEncryptedJson(newObj[i], storeP).then(
          async (wallet) => {
            if (wallet.address === _selectedAddress) {
              setWalletSelected(wallet);
              return wallet;
            }
          }
        );
      }
    });
  };

  const getHistory = async () => {
    const address = _selectedAddress;
    const providerName = _selectedNetwork;
    const providerLower = providerName.toLowerCase();
    let etherscanProvider = await new ethers.providers.EtherscanProvider(
      providerLower
    );
    etherscanProvider
      .getHistory(address)
      .then((history) => {
        const historyJson = JSON.stringify(history);
        AsyncStorage.setItem("history", historyJson);
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
        setHistory(historyArrayString);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /*
    Esta función devuelve un array con las addresses de las wallets alojadas en el archivo wallet.json.
    En este caso las mismas coinciden con las que están alojadas en el store.
    Este array será utilizado para mostrar las addresses en un SelectList.
  */
  const getAddress = () => {
    const arrAddress = storePassword.getState().address;
    return arrAddress.map((address) => {
      const value = `${address.substring(0, 4)}...${address.substr(
        address.length - 3
      )}`;
      return {
        key: address,
        value: value,
      };
    });
  };

  const dataDropdown = [
    { value: "Ethereum" },
    { value: "Goerli" },
    { value: "Kovan" },
    { value: "Rinkeby" },
    { value: "Ropsten" },
  ];

  const handlePressHistory = async () => {
    await getHistory();
  };

  const handleSelectedNetworkChange = (selectedNetwork) => {
    setSelectedNetwork(selectedNetwork);
  };

  const handleBalanceChange = async () => {
    const balance = await getBalance(_selectedAddress, _selectedNetwork);
    setBalance(balance);
  };

  const handlePressMoreWallet = async () => {
    await moreWallet(storePassword.getState()["password"]);
    const wallet = await AsyncStorage.getItem("wallet");
    const address = JSON.parse(wallet).address;
    //console.log(storePassword.getState()); <-- LOG STORE STATE
    getAddress();
  };

  const handleWalletSelected = async () => {
    const wallet = await getWalletDecryptAllWallets();
  };

  const handleSendTransaction = async () => {
    await sendTransaction(
      _amount,
      _to,
      _walletSelected.privateKey,
      _selectedNetwork
    );
  };

  const handleAmountSend = (amount) => {
    setAmount(amount);
  };

  const handleToSend = (to) => {
    setTo(to);
  };

  const handleToImportText = (text) => {
    setImportText(text);
  };

  const handleToImportPass = (text) => {
    const pass = hashPass(text);
    setImportPass(pass);
  };

  const handleImport = async () => {
    await importNewWallet(importText, storePassword.getState()["password"]);
  };

  return (
    <View style={styles.container}>
      <SelectList
        data={dataDropdown}
        setSelected={setSelectedNetwork}
        selected={_selectedNetwork}
        placeholder="Select a network"
        boxStyles={styles.boxStyles}
        dropdownStyles={styles.dropdownStyles}
        dropdownItemStyles={styles.dropdownItemStyle}
        onSelect={() => {
          handleSelectedNetworkChange(_selectedNetwork);
        }}
      />
      <SelectList
        data={getAddress()}
        setSelected={setSelectedAddress}
        selected={_selectedAddress}
        placeholder="Select an Address"
        boxStyles={styles.boxStyles}
        dropdownStyles={styles.dropdownStyles}
        dropdownItemStyles={styles.dropdownItemStyle}
        onSelect={() => {
          setSelectedAddress(_selectedAddress);

          handleWalletSelected();
        }}
      />
      <Text style={styles.firstBalance}>
        {_balance}
        <Text style={styles.symbol}>ETH</Text>
      </Text>

      <TouchableOpacity
        onPress={() => {
          handleWalletSelected();
          setModalVisible(true);
        }}
        style={[styles.button, styles.primaryButton]}
      >
        <Text style={styles.textButton}>TRANSFER</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          handleBalanceChange();
        }}
        style={[
          styles.button,
          styles.secondaryButton,
          { backgroundColor: "#e4aaf0", borderWidth: 0 },
        ]}
      >
        <Text style={[styles.textButton, { color: "#f1f1f1" }]}>
          GET BALANCE
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleBalanceChange();
          setModalVisibleImport(true);
        }}
        style={[
          styles.button,
          styles.secondaryButton,
          { backgroundColor: "#e4aaf0", borderWidth: 0 },
        ]}
      >
        <Text style={[styles.textButton, { color: "#f1f1f1" }]}>
          IMPORT WALLET
        </Text>
      </TouchableOpacity>

      <View
        style={{
          width: "80%",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={styles.box}>
          <TouchableOpacity
            onPress={() => {
              handlePressMoreWallet();
              setModalVisibleWallet(true);
            }}
            style={[styles.roundedButton, styles.button]}
          >
            <Text style={[styles.textButton, { color: "#c501e2" }]}>
              <MaterialIcons name="add" size={19} color="#c501e2" />
            </Text>
          </TouchableOpacity>
          <Text style={styles.textButtonSecundary}>New</Text>
        </View>
        <View style={styles.box}>
          <TouchableOpacity
            onPress={() => {
              setModalVisiblePK(true);
            }}
            style={[styles.roundedButton, styles.button]}
          >
            <Text style={[styles.textButton, { color: "#c501e2" }]}>
              <Fontisto name="key" size={17} color="#c501e2" />
            </Text>
          </TouchableOpacity>
          <Text style={styles.textButtonSecundary}>Key</Text>
        </View>
        <View style={styles.box}>
          <TouchableOpacity
            onPress={() => {
              setModalVisibleMN(true);
            }}
            style={[styles.roundedButton, styles.button]}
          >
            <Text style={[styles.textButton, { color: "#c501e2" }]}>
              <MaterialCommunityIcons name="seed" size={20} color="#c501e2" />
            </Text>
          </TouchableOpacity>
          <Text style={styles.textButtonSecundary}>Seeds</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={handlePressHistory}
        style={[styles.button, styles.secondaryButton]}
      >
        <Text style={[styles.textButton, { color: "#c501e2" }]}>History</Text>
      </TouchableOpacity>

      <View
        style={{
          width: "80%",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <View style={styles.box}>
          <TouchableOpacity
            onPress={() => {
              storePassword.dispatch({
                type: "setSession",
                payload: "closed",
              });
              //console.log(storePassword.getState()); <-- LOG STORE STATE
              navigation.navigate("LoginOpen");
            }}
            style={[
              styles.roundedButton,
              styles.button,
              { backgroundColor: "#969696", borderWidth: 0 },
            ]}
          >
            <Text style={[styles.textButton, { color: "#c501e2" }]}>
              <AntDesign name="close" size={17} color="#f1f1f1" />
            </Text>
          </TouchableOpacity>
          <Text style={styles.textButtonSecundary}>Close</Text>
        </View>
        <View style={styles.box}>
          <TouchableOpacity
            onPress={() => {
              storePassword.dispatch({
                type: "setSession",
                payload: "closed",
              });
              storePassword.dispatch({
                type: "setAppState",
                payload: "inactive",
              });
              storePassword.dispatch({
                type: "setDeleteAddress",
                payload: "",
              });
              storePassword.dispatch({
                type: "setDeletePassword",
                payload: "",
              });

              //console.log(storePassword.getState()); <-- LOG STORE STATE
              navigation.navigate("HomeScreen");
            }}
            style={[
              styles.roundedButton,
              styles.button,
              { backgroundColor: "#969696", borderWidth: 0 },
            ]}
          >
            <Text style={[styles.textButton, { color: "#c501e2" }]}>
              <AntDesign name="deleteuser" size={18} color="#f1f1f1" />
            </Text>
          </TouchableOpacity>
          <Text style={styles.textButtonSecundary}>Delete</Text>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Send Transaction</Text>

            <TextInput
              placeholder="0.00"
              placeholderTextColor="grey"
              fontSize={50}
              onChangeText={handleAmountSend}
            />
            <Text style={styles.modalText}>ETH</Text>
            <TextInput
              placeholder="Address to transfer"
              placeholderTextColor="grey"
              onChangeText={handleToSend}
            />
            <Pressable
              style={[
                styles.button1,
                styles.buttonClose,
                { backgroundColor: "#e4aaf0" },
              ]}
              onPress={() => {
                handleSendTransaction();
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.textStyle}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleImport}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisibleImport(!modalVisibleImport);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Introduce Private Key</Text>

            <TextInput
              placeholder="0x0123..."
              placeholderTextColor="grey"
              onChangeText={handleToImportText}
            />
            <Pressable
              style={[
                styles.button1,
                styles.buttonClose,
                { backgroundColor: "#e4aaf0" },
              ]}
              onPress={() => {
                handleImport();
                setModalVisibleImport(!modalVisibleImport);
              }}
            >
              <Text style={styles.textStyle}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleWallet}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisibleWallet(!modalVisibleWallet);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={[styles.modalText, { fontSize: 20 }]}>
              Congratulations!
            </Text>
            <Text style={styles.modalText}>New address added</Text>
            <Pressable
              style={[
                styles.button1,
                styles.buttonClose,
                { backgroundColor: "#e4aaf0" },
              ]}
              onPress={() => {
                setModalVisibleWallet(!modalVisibleWallet);
              }}
            >
              <Text style={styles.textStyle}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisiblePK}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisiblePK(!modalVisiblePK);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Please introduce your password</Text>

            <TextInput
              autoCapitalize="none"
              secureTextEntry={true}
              placeholder="Password"
              placeholderTextColor="grey"
              onChangeText={handleToImportPass}
            />
            <Pressable
              style={[
                styles.button1,
                styles.buttonClose,
                { backgroundColor: "#e4aaf0" },
              ]}
              onPress={() => {
                setModalVisiblePK(!modalVisiblePK);
                if (importPass === storePassword.getState()["password"]) {
                  Alert.alert("Private key", _walletSelected.privateKey);
                } else {
                  alert("Password incorrect");
                }
                setImportPass(null);
              }}
            >
              <Text style={styles.textStyle}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleMN}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisibleMN(!modalVisibleMN);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Please introduce your password</Text>

            <TextInput
              autoCapitalize="none"
              secureTextEntry={true}
              placeholder="Password"
              placeholderTextColor="grey"
              onChangeText={handleToImportPass}
            />
            <Pressable
              style={[
                styles.button1,
                styles.buttonClose,
                { backgroundColor: "#e4aaf0" },
              ]}
              onPress={() => {
                setModalVisibleMN(!modalVisibleMN);
                if (importPass === storePassword.getState()["password"]) {
                  if (!_walletSelected._mnemonic()) {
                    alert("Seeds do not exist");
                  } else {
                    Alert.alert(
                      "Seed phrase",
                      _walletSelected._mnemonic().phrase
                    );
                  }
                  setImportPass(null);
                } else {
                  alert("Password incorrect");
                }
              }}
            >
              <Text style={styles.textStyle}>Confirm</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const space = 55;
const styles = StyleSheet.create({
  container: {
    marginTop: space,
    flex: 1,
    paddingVertical: 30,
    paddingHorizontal: 5,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
  },
  address: {
    fontSize: 10,
    color: "#c501e2",
    fontWeight: "bold",
    marginTop: 10,
  },
  firstBalance: {
    fontSize: 65,
    color: "#c501e2",
    fontWeight: "bold",
    marginTop: 10,
  },
  symbol: {
    fontSize: 20,
    color: "#c501e2",
  },
  button: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    marginVertical: 20,
    borderRadius: 30,

    // Shadow
    shadowColor: "#828282",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    elevation: 1,
  },
  primaryButton: {
    backgroundColor: "#c501e2",
    width: "50%",
    alignSelf: "center",
    borderColor: "#c501e2",
  },
  textButton: {
    fontSize: 15,
    textAlign: "center",
    color: "white",
  },
  secondaryButton: {
    width: "50%",
    borderWidth: 1,
    borderColor: "#c501e2",
    color: "#c501e2",
  },
  roundedButton: {
    width: 40,
    borderColor: "#c501e2",
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

    shadowColor: "#c501e2",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    elevation: 1,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 45,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button1: {
    marginTop: "10%",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  boxStyles: {
    borderWidth: 0,
    position: "relative",
  },
  dropdownStyles: {
    width: "100%",
    borderWidth: 0,
    marginTop: 10,
    top: -20,
    borderRadius: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  dropdownItemStyle: {
    alignItems: "center",
    textAlign: "center",
    width: "100%",
  },
  textButtonSecundary: {
    color: "#828282",
    marginTop: -10,
    textAlign: "center",
  },
});

export default WalletScreen;
