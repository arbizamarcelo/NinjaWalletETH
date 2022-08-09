import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import decryptWalletStd from "../functions/DecryptStd";
import getStore from "../store/storeSt";

const ImportScreen = () => {
  const storePassword = getStore();

  const navigation = useNavigation();

  const [_seedsInput, setSeedsInput] = React.useState("");

  const handleSeedsInputChange = (seedsInput) => {
    setSeedsInput(seedsInput);
  };

  const handleSeedsFromStore = async () => {
    const dec = await decryptWalletStd(storePassword.getState()["password"]);
    const seedsPhrase = dec._mnemonic().phrase;

    if (seedsPhrase === _seedsInput) {
      storePassword.dispatch({
        type: "setError",
        payload: "",
      });
      storePassword.dispatch({
        type: "setSession",
        payload: "open",
      });
      //console.log(storePassword.getState()); <-- LOG STORE STATE
      alert("Successfully imported");

      navigation.navigate("WalletView");
    } else {
      alert("Seeds do not match");
      storePassword.dispatch({
        type: "setError",
        payload: "Seeds do not match",
      });
      //console.log(storePassword.getState()); <-- LOG STORE STATE
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Import Wallet</Text>
      <Text style={styles.subTitle}>Insert your seed phrase</Text>

      <TextInput
        autoCapitalize="none"
        placeholder="Insert your seed phrase"
        style={[styles.childStyle, styles.textInput, styles.textArea]}
        placeholderTextColor="grey"
        onChangeText={handleSeedsInputChange}
      />

      <TouchableOpacity
        onPress={() => {
          handleSeedsFromStore();
        }}
        style={styles.button}
      >
        <Text style={styles.textButton}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};
const space = 5;
const styles = StyleSheet.create({
  container: {
    marginTop: space,
    flex: 1,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    color: "#c501e2",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "10%",

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
    height: 50,
    marginTop: 20,
    borderRadius: 30,
  },

  viewStyle: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    padding: space,
    marginTop: 20,
    marginBottom: 20,
  },
  childStyle: {
    width: "50%",
    borderWidth: 1,
    marginBottom: space,
  },
  textArea: {
    height: 100,
    width: "80%",
    borderWidth: 1,
    borderColor: "#c501e2",
    padding: 10,
    marginTop: 20,
    borderRadius: 30,
  },
});

export default ImportScreen;