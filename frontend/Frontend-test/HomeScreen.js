import {
    useTheme
} from '@react-navigation/native';
import React from "react";
import { Image, Text, View } from 'react-native';
import HelpButton from "./HelpButton.js";
import Dropdown from "./Dropdown.js";
import styles from './Styles.js'

const HomeScreen = ({ navigation }) => {
    const colors = useTheme()["colors"]; // grab colors from global Theme

    console.log("Home activated");
    return (
      <View style={[styles.container, {
        flexDirection: "column"
      }]}>
        <View style={{ flex: 1 }} />
        <View style={[styles.container, {
          flexDirection: "row"
        }]}>
          <View style={{ flex: 2 }} />
          <View style={[styles.centered, { flex: 6 }]} >
            <Text style={{ fontSize: 50, color: colors.text }}>HOME</Text></View>
          <View style={[styles.centered, { flex: 2 }]}>
            {/* For a round ? button we need to use TouchableOpacity, not gonna do that atm. */}
            <HelpButton
              title="Help"
              onPress={() => navigation.navigate("Help", { from: "Home" })}
            />
          </View>
        </View>

        <View style={{ flex: 1 }} />
        <View style={[styles.centered, { flex: 2 }]}>
          <Image
            style={{ width: "95%", height: undefined, aspectRatio: 1, resizeMode: 'contain' }}
            source={require("./assets/logo_small_lr_o_trennstrich.png")} />
        </View>
        <View style={{ flex: 1 }} />
        <View style={[styles.centered, { flex: 1, flexDirection: "row" }]}>
          <Text style={{ fontSize: 20, color: colors.text}}>Modus:</Text>
          <Dropdown
            data={["Sleep", "Normal", "Mould"]}
            defaultValueByIndex={0}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index)
            }}
          />
        </View>
        <View style={[styles.centered, { flex: 1 }]}>
          <Text style={{ color: "darkorange", fontSize: 20, color: colors.text }}>Status: Medium</Text>
        </View>
        <View style={{ flex: 3 }} />
      </View>
    );
  }

export default HomeScreen;