
import React, { useState, useEffect } from "react";
import { ScrollView, View } from 'react-native';
// import HelpButton from "./HelpButton.js";
// import styles from './Styles.js'
import { useTheme, Provider, List, TouchableRipple, Switch, Button, TextInput, Card, Text, Menu } from 'react-native-paper';
import { PreferencesContext } from "./PreferencesContext.js";
// for testing deletion
import AsyncStorage from '@react-native-async-storage/async-storage';
import Backend from "./api.js";
import Session from "./session.js";
import Dropdown from "./Dropdown.js";

const SettingsScreen = ({ navigation }) => {


  const [forceUpdates, setForceUpdates] = useState(0); // integer state
  const forceUpdate = () => { setForceUpdates(forceUpdates + 1) }

  const theme = useTheme();
  const { isThemeDark, setIsThemeDark, operationMode, setOperationMode} = React.useContext(PreferencesContext);

  const [devices, setDevices] = React.useState([]);
  useEffect(() => {
    backend.getDevices(Session.get()).then((data) => {
      let devices = [];
      let device; // id
      for (device in data) {
        devices.push(<View key={device}><Text>{"\t" + data[device].name || "\tUnnamed"} ({data[device].id}): {data[device].device_hash}</Text></View>);
      }
      setDevices(devices);
    }).catch(err => console.log("Getting devices failed: " + err))
  }, [])

  const [deviceHash, setDeviceHash] = React.useState('');
  const [deviceInfo, setdeviceInfo] = useState("");
  const [deviceInfoVisible, setdeviceInfoVisible] = useState(false);
  console.log("Settings activated");

  const addDevice = () => {
    // manual update aftewards would be nice
    backend.registerDevice(deviceHash, Session.get()).then((data) => {
      setdeviceInfoVisible(true);
      setdeviceInfo(data.msg);
      setTimeout(() => setdeviceInfoVisible(false), 5000);
    }).catch((data) => {
      setdeviceInfoVisible(true);
      setdeviceInfo(data);
      setTimeout(() => setdeviceInfoVisible(false), 30000);
    })
  }

  return (
    <Provider theme={theme}>
      <ScrollView >
        <List.Section title="General settings">
          <List.Item
            title="Dark Theme"
            left={() => <List.Icon icon="folder" />}
            right={() =>
                <Switch
                  value={isThemeDark} onValueChange={() => { setIsThemeDark(!isThemeDark); forceUpdate() }}
                />
            } />
          <List.Item
            title="Mode"
            left={() => <List.Icon icon="folder" />}
            right={() =>
                <Dropdown
                  data={["Normal","Sleep","Mold"]}
                  defaultValueByIndex={0}
                  onSelect={(selectedItem, index) => {
                    setOperationMode(selectedItem);
                  }}
                />
            }
          />
        </List.Section>

        <List.Accordion title="Devices" mode="flat">
          <View>{devices}</View>

        </List.Accordion>
        <Card>
          <Card.Content>
            {deviceInfoVisible && <View>
              <Text style={{ color: "red" }}>{deviceInfo}</Text>
            </View>}
            <TextInput label="Device Hash"
              value={deviceHash}
              onChangeText={text => setDeviceHash(text)}
            ></TextInput>
            <Button mode="contained" onPress={addDevice}> Add Device</Button>
          </Card.Content>
        </Card>
        <List.Section title="Users">

        </List.Section>

        <List.Section title="About">
          <List.Item title="Authors: David Layer-Reiss, Leandro Risoli, Leon Pfletschinger, Sean Klein, Luca Marie Dürkop" />
          <List.Item title="Source: ~github link here~" left={() => <List.Icon icon="github" />} />
        </List.Section>
        <Button onPress={() => { AsyncStorage.removeItem('quinternity@session').then(() => { console.log("Deleted Session data") }).catch(console.error) }}>
          Logout
        </Button>
      </ScrollView>
    </Provider>
  );
}

export default SettingsScreen;
