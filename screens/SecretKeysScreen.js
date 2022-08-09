import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import getStore from "../store/storeSt";
import decryptWalletStd from "../functions/DecryptStd";

const SecretKeysScreen = () => {
  const storePassword = getStore();

  const navigation = useNavigation();

  const [_seeds, setSeeds] = React.useState("");

  const handleSeeds = async () => {
    const dec = await decryptWalletStd(storePassword.getState()["password"]);
    const seedsPhrase = dec._mnemonic().phrase;
    setSeeds(seedsPhrase);
    //console.log(seedsPhrase); // <------------- SEEDS
  };

  const navigateToImportKeys = () => {
    navigation.navigate("Import");
    //console.log(storePassword.getState()); <-- LOG STORE STATE
    decryptWalletStd(storePassword.getState()["password"]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Secret Keys</Text>
      <Text style={styles.subTitle}>Please copy your secret seeds</Text>
      <View style={styles.viewStyle}>
        <Text style={styles.childStyle}>{_seeds}</Text>
      </View>
      <TouchableOpacity onPress={() => handleSeeds()} style={styles.button}>
        <Text style={styles.textButton}>Show seeds</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigateToImportKeys();
          //console.log(storePassword.getState()); <-- LOG STORE STATE
        }}
        style={styles.button}
      >
        <Text style={styles.textButton}>Ready</Text>
      </TouchableOpacity>
    </View>
  );
};
const space = 55;
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

    shadowColor: "##828282",
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
    color: "white",
    padding: 10,
    paddingStart: 30,
    borderWidth: 1,
    borderColor: "#828282",
    padding: 10,
    height: 50,
    marginTop: 20,
    borderRadius: 30,

    // Shadow
    shadowColor: "#828282",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    elevation: 1,
  },

  viewStyle: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    padding: space,
    marginTop: 20,
    marginBottom: 20,
    //backgroundColor: 'yellow',
  },
  childStyle: {
    width: "80%",
    color: "#c501e2",
    marginBottom: space,
    fontSize: 25,
    textAlign: "center",
  },
});

export default SecretKeysScreen;
