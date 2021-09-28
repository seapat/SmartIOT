import {
  useTheme
} from '@react-navigation/native';
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from 'react-native';
import { Button, Card, Text, TouchableRipple} from 'react-native-paper';
import Backend from "./api.js";
import HelpButton from "./HelpButton.js";
import Session from "./session.js";
import styles from './Styles.js'

const MonitoringScreen = ({ navigation }) => {
  const colors = useTheme()["colors"]; // grab colors from global Theme

  console.log("Monitoring activated");
  // template for device squares
  const getDeviceSquareTemplate = (deviceColor,
    id = -1,
    temperature = { data: "loading", color: "green" },
    co2ppm = { data: "loading", color: "green" },
    humidity = { data: "loading", color: "green" },
    mold = { data: "loading", color: "green" },
    pressure = { data: "loading", color: "green" },
    iaq = { data: "loading", color: "green" },
    timestamp = new Date().toLocaleString()) => {
    return <View key={id} style={[styles.centered, {
      flex: 1,
      // borderRadius: 25,
      // borderWidth: 5,
      // borderColor: (["white", "black"].includes(deviceColor) ? colors.text : deviceColor),
      margin: 50
    }]}>
      <Card>
        <Card.Content>
          <Text style={{ fontSize: 40, color: colors.text }}>Device {id}</Text>
          <Text style={{ color: temperature.color, fontSize: 20 }}>Temperature: {temperature.data} C</Text>
          <Text style={{ color: co2ppm.color, fontSize: 20 }}>CO2: {co2ppm.data} ppm</Text>
          <Text style={{ color: humidity.color, fontSize: 20 }}>Humidity: {humidity.data} %</Text>
          <Text style={{ color: mold.color, fontSize: 20 }}>Mold: {mold.data}</Text>
          <Text style={{ color: pressure.color, fontSize: 20 }}>Pressure: {pressure.data}</Text>
          <Text style={{ color: iaq.color, fontSize: 20 }}>IAQ: {iaq.data}</Text>
          <Text style={{ fontSize: 20, color: colors.text }}>Creation: {timestamp.data}</Text>
        </Card.Content>
      </Card>
    </View>;
  }

  //const [deviceData, setDeviceData] = useState({});
  // const [temperature, setTemperature] = useState({data:"loading",color:"green"});
  // const [co2ppm, setCo2ppm] = useState({data:"loading",color:"green"});
  // const [humidity, setHumidity] = useState({data:"loading",color:"green"});
  // const [pressure, setpressure] = useState({data:"loading",color:"green"});
  // const [timestamp, setTimestamp] = useState(new Date().toLocaleString());

  // default, to be replaced.
  const [devices, setDevices] = useState([]);
  const createDeviceSquares = (deviceData) => {
    // all colors are arbitrary atm.
    let tempDevices = [];
    for (let id in deviceData) {
      if (deviceData[id].length > 0) {
        let newestData = deviceData[id][0];
        //setDevices([...devices, getDeviceSquareTemplate("black",
        tempDevices =
          [
            ...tempDevices,
            getDeviceSquareTemplate("black",
              id,
              { data: newestData?.temp, color: "green" }, //temperature
              { data: newestData?.co2, color: "green" }, //co2ppm
              { data: newestData?.humidity, color: "green" }, //humidity
              { data: "unknown", color: "green" }, //Mold
              { data: newestData?.pressure, color: "green" }, //pressure
              { data: newestData?.iaq, color: "green" }, //pressure
              { data: new Date(newestData?.timestamp * 1000).toLocaleString(), color: "green" }), //timestamp
          ];
      }
    }
    setDevices(tempDevices);
  }

  useEffect(() => {
    
    backend.getSensorData(Session.get()).then(function (response) {
      createDeviceSquares(response.msg)
    })
  }, [])

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    backend.getSensorData(Session.get()).then(function (response) {
      createDeviceSquares(response.msg);
    }).finally(() => setRefreshing(false));
  }

  return (
    <ScrollView style={[styles.container, {
      flexDirection: "column"
    }]}
      refreshControl={<RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
      />}>
      <View style={{ flex: 1 }} />
      <View style={[styles.container, {
        flexDirection: "row",
        flex: 1
      }]}>
        <View style={{ flex: 2 }} />
        <View style={[styles.centered, { flex: 6 }]} >
          <Text style={{ fontSize: 50, color: colors.text }}>Monitoring</Text></View>
        <View style={[styles.centered, { flex: 2 }]}>
          {/* For a round ? button we need to use TouchableOpacity, not gonna do that atm. */}
          <HelpButton
            title="Help"
            onPress={() => navigation.navigate("Help", { from: "Monitoring" })}
          />
        </View>
      </View>
      {/* <View style={{ flex: 1 }} /> */}
      {/* <View style={[styles.centered, { flex: 1, flexDirection: "row" }]}>
          <Text style={{fontSize:20}}>Devices:</Text>
          <SelectDropdown
            data={dropDownData}
            defaultValueByIndex={0}
            onSelect={(selectedItem, index) => {
              setInfo(selectedItem, index)
            }}
          />
        </View>
        <View style={[styles.centered, { flex: 1, flexDirection: "row" }]}>
          <Text style={{ fontSize: 20 }}>Modus:</Text>
          <SelectDropdown
            data={["Sleep", "Normal", "Mould"]}
            defaultValueByIndex={0}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index)
            }}
          />
        </View> */}
      {/* <View style={[styles.centered, { flex: 4 }]}>
          <Text style={{ color: temperature.color, fontSize: 20 }}>Temperature: {temperature.data} C</Text>
          <Text style={{ color: co2ppm.color, fontSize: 20 }}>CO2: {co2ppm.data} ppm</Text>
          <Text style={{ color: humidity.color, fontSize: 20 }}>Humidity: {humidity.data} %</Text>
          <Text style={{ color: pressure.color, fontSize: 20 }}>Mould: {pressure.data}</Text>
          <Text style={{ fontSize: 20 }}>{timestamp}</Text>
        </View> */}
      {/*Currently just displays below eachother, pretty meh. */}
      {/* <ScrollView style={{ flex: 5}}> */}
      
      {devices.map((element, index) => { return element })}

      <View key="Add new" style={[styles.centered, {
      flex: 1,
      // borderRadius: 25,
      // borderWidth: 5,
      // borderColor: (["white", "black"].includes(deviceColor) ? colors.text : deviceColor),
      margin: 50
    }]}>
      <Button mode="outlined" onPress={() => {navigation.navigate("Settings", {from:"Monitoring"});}}>Add new device in Settings</Button>
    </View>
      {/* </ScrollView> */}
    </ScrollView>
  );
}

export default MonitoringScreen;