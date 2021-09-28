import {
  useTheme
} from '@react-navigation/native';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import { Button, Banner, Card, Switch } from 'react-native-paper';
import HelpButton from "./HelpButton.js";
import styles from "./Styles"
import Dropdown from "./Dropdown.js";
import Session from "./session.js";
import { PreferencesContext } from "./PreferencesContext.js";
// import BackgroundTask from 'react-native-background-task';

import { getLatestData, updateData, poll } from "./BackendWrapper.js";

import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


// BackgroundTask.define(() => {
//   console.log('Hello from a background task')

//   Notifications.scheduleNotificationAsync({
//     content: {
//       title: 'Look at that notification',
//       body: "I'm so proud of myself!",
//     },
//     trigger: {
//       seconds: 2
//     },
//   });
//   BackgroundTask.finish()
// })



const AlarmScreen = ({ navigation }) => {
  const [alarmCards, setAlarmCards] = React.useState([]);
  const colors = useTheme()["colors"]; // grab colors from global Theme
  // fires once every 15m.. rip. max 30s to execute.
  // useEffect(() => {
  //   BackgroundTask.schedule()
  // }, [])


  const [devicesDropDown, setDevicesDropdown] = useState({});
  const [deviceHash, setDeviceHash] = useState("");
  const [moldScore, setMoldScore] = useState(0);

  var ampelstyles = ["ampelred", "ampelorange", "ampelgreen"]
  const [ampelColor, setAmpelColor] = useState(ampelstyles);

  useEffect(() => {
    backend.getDevices(Session.get()).then(function (response) {
      var device_ids = []
      for (var i in response) {
        var entry = response[i]
        device_ids.push("Device: " + entry['id'])
      }

      setDevicesDropdown(device_ids)
    })
  }, []);

  useEffect(() => {
    let alarms = Session.get(() => {}, 'quinternity@alarms');
    if(alarms == null) return;

    let alarm = alarms[Session.get()];
    if(alarm != undefined) {
      let cards = [];
      alarm.forEach((element, i) => {
      cards.push(getCardForAlarm(element, i));
      })
      setAlarmCards(cards);
    }
  }, [])

    const removeCard = (id) => {
      let alarms = Session.get(() => {}, 'quinternity@alarms');
      if(alarms == null) return;

      let cardData = alarms[Session.get()];
      cardData.splice(id, 1);

      alarms[Session.get()] = cardData;
      Session.set(alarms, 'quinternity@alarms');

      let cards = [];
      cardData.forEach((element, i) => {
      cards.push(getCardForAlarm(element, i));
      })
      setAlarmCards(cards);
    }

    const getCardForAlarm = (alarmData, id) => {
      let card = <Card key={id} mode="outlined" onLongPress={() => {removeCard(id)}}>  
      <Card.Content  key={id}>
        <Text style={{ fontSize: 40, color: colors.text }}>Device {alarmData?.device}</Text>
        <Text style={{ color: colors.text, fontSize: 20 }}>Modus: {alarmData?.modus}</Text>
        <Text style={{ color: colors.text, fontSize: 20 }}>Component: {alarmData?.component}</Text>
      </Card.Content>
    </Card>
      return card;
    }
  
  console.log("Alarm activated");
  return (
      <ScrollView style={[styles.container, {
        flexDirection: "column"
      }]}>
        <WarningBanner />
        <View style={{ flex: 1 }} />
        <View style={[styles.container, {
          flexDirection: "row"
        }]}>
          <View style={{ flex: 2 }} />
          <View style={[styles.centered, { flex: 6 }]} >
            <Text style={{ fontSize: 50, color: colors.text }}>Alarm</Text>
          </View>
          <View style={[styles.centered, { flex: 2 }]}>
            <HelpButton
              title="Help"
              onPress={() => navigation.navigate("Help", { from: "Alarm" })}
            />
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 1 }} />
        <View style={[styles.centered, { flex: 1, flexDirection: "row" }]}>

          <Dropdown
            data={devicesDropDown}
            defaultValueByIndex={0}
            onSelect={(selectedItem, index) => {
              var id = selectedItem.split(" ")[1]
              backend.getDevices(Session.get()).then(function (response) {
                var device_hash = ""
                for (var i in response) {
                  if (parseInt(response[i].id) == parseInt(id)) {
                    device_hash = response[i].device_hash
                  }
                }
                backend.getAmpelScore(Session.get(), device_hash).then(function (ampelresponse) {
                  setMoldScore(ampelresponse.score)
                  if (ampelresponse.score <= 5) {
                    setAmpelColor(['emptycircle', 'emptycircle', 'ampelgreen'])
                  }
                  if (ampelresponse.score > 5 && ampelresponse.score <= 10) {
                    setAmpelColor(['emptycircle', 'ampelorange', 'ampelgreen'])
                  }
                  if (ampelresponse.score >= 10 && ampelresponse.score <= 18) {
                    setAmpelColor(['emptycircle', 'ampelorange', 'emptycircle'])
                  }
                  if (ampelresponse.score >= 18) {
                    setAmpelColor(['ampelred', 'emptycircle', 'emptycircle'])
                  }
                })
                setDeviceHash(device_hash)
              })
            }}
          />
        </View>

        <View style={styles.ampelcontainer}>
          <View style={styles.ampel}>
            <View style={[styles.emptycircle, styles[ampelColor[0]], styles.shadoweffect]}>
            </View>
            <View style={[styles.emptycircle, styles[ampelColor[1]], styles.shadoweffect]}>
            </View>
            <View style={[styles.emptycircle, styles[ampelColor[2]], styles.shadoweffect]}>
            </View>
          </View>
          <Text style={[styles.centered, { fontSize: 15, color: colors.text, margin: 20 }]}>Current mold score: {moldScore}</Text>
        </View>

        <View style={[styles.centered, { flex: 1, flexDirection: "row", colors:colors.text }]}>
          <Button style={[{ margin: 10 }]}
            mode="contained"
            onPress={() => navigation.navigate("CreateAlarm", { from: "Alarm" })}
          >
            Add new Alarm
          </Button><Text style={{color: colors.text}}>Long press to delete!</Text>
          </View>
        <Text style={[styles.centered, { fontSize: 20, color: colors.text, flex:1 }]}>Alarme:</Text>
        <ScrollView style={{flex:4}}>
          {alarmCards.map((element, index) => { return element })}
        </ScrollView>
      </ScrollView>
  );
}


const WarningBanner = (props) => {

  const { isThemeDark, setIsThemeDark, operationMode, setOperationMode} = React.useContext(PreferencesContext);

  const [reason, setReason] = React.useState("");
  const [device, setDevice] = React.useState("");
  const [fix, setFix] = React.useState("");

  const [visible, setVisible] = React.useState(false); // init with visible == false

  // checkData(); // run once manually on component load
  setInterval(checkData, 60000);

  new Proxy(updateData, {
    apply: function (targetFunc, thisArg, argumentsList) {
      console.log("proxy works");
    }
  })

  function checkData() {
    let latestData = getLatestData();
    console.log(latestData);

    if (!visible) {

      // let tempDevices = []

      latestData.forEach((data, device) => {

        if (operationMode == "sleep") {
          if (data.get("temp") > 19) { //FIXME: this value is too low (due to demonstration)
            setReason("Sleeping temperature is too high.");
            setFix("cool your room. ['?' for more tips]");
            setDevice(device.toString());
            // tempDevices.push(device);
            setVisible(true);
            console.log("showing Banner ...")
          }
        }
        else {
          if (data.get("co2") > 2000) {
            setReason("CO2 is too high.");
            setFix("air your room (open a window). ['?' for more tips]");
            setDevice(device.toString());
            // tempDevices.push(device);
            setVisible(true);
            console.log("showing Banner ...")
          }
          else if (data.get("temp") > 35) { //FIXME: this value is too low (due to demonstration)
            setReason("Temperature is too high.");
            setFix("cool your room. ['?' for more tips]");
            setDevice(device.toString());
            // tempDevices.push(device);
            setVisible(true);
            console.log("showing Banner ...")
          }
        }
      })
      // setDevice(tempDevices.join(", "));

    } else {
      console.log("no (new) banner loaded")
    }
  }

  return (
    <Banner onLoad={() => this.updateData()}
      visible={visible}
      actions={[
        {
          label: 'Dismiss',
          onPress: () => setVisible(false),
        },
      ]}
      icon="information-outline"
    >
      Device: {device}{"\n"}
      Reason: {reason}{"\n"}
      Fix: You should {fix}{"\n"}
      {new Date().toLocaleString()}
    </Banner>
  );
};

export default AlarmScreen;
