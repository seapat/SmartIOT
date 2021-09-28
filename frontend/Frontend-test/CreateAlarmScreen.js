import React, { useEffect } from "react";
import { Platform, View } from "react-native";
import { Button, Text } from 'react-native-paper';
import Dropdown from "./Dropdown.js";
import HelpButton from "./HelpButton.js";
import styles from "./Styles.js";
import {getLatestData} from "./BackendWrapper.js";

import * as Notifications from 'expo-notifications';
import Session from "./session.js";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const CreateAlarmScreen = ({ navigation, route }) => {
    const [alarmData, setAlarmData] = React.useState([]);
    const [device, setDevice] = React.useState(undefined);
    const [modus, setModus] = React.useState("Normal");
    const [component, setComponent ] = React.useState("All");
    
    const [devices, setDevices] = React.useState({});

    useEffect(() => {
      let currentAlarms = Session.get(()=>{}, 'quinternity@alarms');
      if(currentAlarms != null)  {
        currentAlarms = currentAlarms[Session.get()];
        if(currentAlarms != undefined) {
          setAlarmData(currentAlarms);
        }
      }
    },[]);

    const setAlarm = (first=false) => {
      setAlarmData([...alarmData, {device:device, modus:modus, component:component}]);
      let currentAlarms = Session.get(()=>{}, 'quinternity@alarms');
      if(currentAlarms == null) currentAlarms = {};
      currentAlarms[Session.get()] = alarmData;
      Session.set(currentAlarms, 'quinternity@alarms');
      //setTimeout(() => navigation.goBack(), 500);
    };

    if(devices.length <= 0 || devices.length == undefined) {
      backend.getSensorData(Session.get()).then(function (response) {
        let deviceData = response.msg;
        let tempDevices = [];
        for (let id in deviceData) {
          tempDevices.push(id);
        }
        setDevices(tempDevices);
        setDevice(tempDevices[0]);
      })
    }
    const createNotif = () => {
        if(Platform.OS == "web") {
          return new Promise((resolve) => {alert("Hey"); resolve()});
        } else {
          return Notifications.scheduleNotificationAsync({
            content: {
              title: 'Look at that notification',
              body: "I'm so proud of myself!",
            },
            trigger: null
          })
        }
    }

    console.log("Create Alarm Screen activated");
    return (
      <View style={[styles.container, {
        flexDirection: "column",
      }]}>
        <View style={[styles.centered, { flex: 1 }]}>
            <Text style={{ fontSize: 50 }}>New Alarm</Text>
        </View>
        <View style={[styles.centered, { flex: 1, flexDirection: "row" }]}>
          <Text style={{ fontSize: 20 }}>Sensor:</Text>
          <Dropdown
            data={devices}
            defaultValueByIndex={0}
            onSelect={(selectedItem, index) => {
              setDevice(selectedItem);
            }}
          />
        </View><View style={[styles.centered, { flex: 1, flexDirection: "row" }]}>
          <Text style={{ fontSize: 20 }}>Modus:</Text>
          <Dropdown
            data={["Normal","Sleep","Mold"]}
            defaultValueByIndex={0}
            onSelect={(selectedItem, index) => {
              setModus(selectedItem);
            }}
          />
        </View><View style={[styles.centered, { flex: 1, flexDirection: "row" }]}>
          <Text style={{ fontSize: 20 }}>Component:</Text>
          <Dropdown
            data={["All","Co2","Temperature","Humidity"]}
            defaultValue={component}
            onSelect={(selectedItem, index) => {
              setComponent(selectedItem);
            }}
          />
        </View>
        <View style={{ flex: 1 }} />
        <Button
          onPress={setAlarm}>Set Alarm</Button>
        <View style={{ flex: 1 }} />
      </View>
    );
  }

export default CreateAlarmScreen;
