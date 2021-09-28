import {
    useTheme
} from '@react-navigation/native';
import React, { useState, useEffect } from "react";
import { View, Image, Text, TextInput } from "react-native";
import { Button, } from 'react-native-paper';
import Session from "./session.js";
import styles from './Styles.js'
import Backend from "./api.js";
import { updateData } from './BackendWrapper.js';
const backend = new Backend("SERVER URL HERE");

export default function LoginScreen ({ navigation }) {
    const colors = useTheme()["colors"]; // grab colors from global Theme

    console.log("Login screen activated");
    // Check if required
    const skipLoginIfNotNull = (session) => {
      if(session != null) {
        updateData();
        navigation.navigate("Tabs", {from:"Login"});
      }
    }
    // After this call session should be completely synchronous.
    let session = Session.get(skipLoginIfNotNull); // async callback
    useEffect(() => {
      skipLoginIfNotNull(session); // sync check (it may not do async callback)
    }, []); // only do it once

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginInfo, setloginInfo] = useState("");
    const [loginInfoVisible, setloginInfoVisible] = useState(false);
    //temp place
    const login = () => {
      // Attempt login
      console.log(username)
      console.log(password)
      backend.login(username, password).then(data => {
        //Save session id
        Session.set(data);
        // reset and switch.
        setUsername("")
        setPassword("")
        updateData();
        navigation.navigate("Tabs", {from:"Login"})
        //Maybe some way to stop people from going back to login screen?
      }).catch(data => {
        setloginInfo(data);
        setloginInfoVisible(true);
      })
    };
    const register = () => {
      // Register (automatically logs in as well, may not be wanted.)
      backend.registerUser(username, password).then((data) => {
        login();
      }).catch((data) => {
        setloginInfo(data);
        setloginInfoVisible(true);
      })
    };

    const activateDemo = () => {
      Session.set("8383ac6ab372349e80f6c9317f50eecdcbc03b4f585f51adf2510106b04fc08f");
      console.log(Session.get());
      navigation.navigate("Tabs", {from:"Login"});
    }

    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Image source={require("./assets/logo_small_lr_o_trennstrich.png")} style={styles.logo} />
        { loginInfoVisible && <View>
          <Text style={{color:"red"}}>{loginInfo}</Text>
        </View>}
        <View style={styles.linput}>
          <TextInput 
            value={username}
            style={styles.linputbox}
            // label="Username"
            placeholder="Username"
            secureTextEntry={false}
            onChangeText={(username) => setUsername(username)}
          />
          <TextInput 
            value={password}
            style={styles.linputbox}
            placeholder="Password"
            // label="Password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
          />
        </View>
        <View style={styles.lbuttons}>
          <View style={styles.lbutton}><Button onPress={login}>Login</Button></View>
          <View style={styles.lbutton}><Button onPress={register}>Register</Button></View>
        </View>
        <View style={styles.lbutton}><Button mode="contained" onPress={activateDemo}>DEMO MODE</Button></View>
      </View>
    );
  }
