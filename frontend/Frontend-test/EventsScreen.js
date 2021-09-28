import {
    useTheme
} from '@react-navigation/native';
import React, { useEffect, useState } from "react";
import {Text, View } from 'react-native';
import { VictoryChart, VictoryLine, VictoryTheme } from "victory-native";
import HelpButton from "./HelpButton.js";
import Dropdown from "./Dropdown.js";
import Session from "./session.js";
import styles from './Styles.js';

function updateStatsData(device_hash,time_range){
    console.log(time_range)
    return new Promise(async (resolve, reject) => {
      backend.getStats(Session.get(),device_hash,time_range).then(function (response) {
        resolve(response)
      })
    })
  }

  function prepareData(apiData){
    console.log(apiData)
    var allData = {}
    for(var m in apiData){
      var readyData = []
      for(var i in apiData[m].data){
        // if(i > 20){
        //   break
        // }
        if(apiData[m].data[i][0] == null){
          continue
        }
        readyData.push({x: new Date(apiData[m].data[i][1] * 1000), y: apiData[m].data[i][0]})
      }
      allData[m] = readyData
    }
    console.log(allData)
    return allData
  }


const EventScreen = ({ navigation }) => {
    const colors = useTheme()["colors"]; // grab colors from global Theme

    console.log("Events activated");

    const [devicesDropDown, setDevicesDropdown] = useState({});
    const [device, setDevice] = useState(0);
    const [dataType, setDataType] = useState("temperature");
    const [timeSpan, setTimeSpan] = useState(86400);
    const [apiData, setApiData] = useState({temperature:[],co2:[],pressure:[],humidity:[],iaq:[]});
    const [deviceHash, setDeviceHash] = useState("");
    const [zoomDomain, setZoomDomain] = useState({ x: [new Date(2020, 1, 1), new Date(2021, 1, 1)] });

    useEffect(() => {
      backend.getDevices(Session.get()).then(function (response) {
        var device_ids = []
        for(var i in response){
          var entry = response[i]
          device_ids.push("Device: "+entry['id'])
        }

        setDevicesDropdown(device_ids)
      })
    }, []);
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
            <Text style={{ fontSize: 50, color: colors.text }}>Events</Text></View>
          <View style={[styles.centered, { flex: 2 }]}>
            <HelpButton
              title="Help"
              onPress={() => navigation.navigate("Help", { from: "Events" })}
            />
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <View style={{ flex: 1 }} />
        <View style={[styles.centered, { flex: 1, flexDirection: "row" }]}>
          <Text style={{ fontSize: 20, color: colors.text }}>Device:</Text>
          
          <Dropdown
            data={devicesDropDown}
            defaultValueByIndex={0}
            onSelect={(selectedItem, index) => {
              var id = selectedItem.split(" ")[1]
              setDevice(id)
              backend.getDevices(Session.get()).then(function (response) {
                var device_hash = ""
                for(var i in response){
                  if(parseInt(response[i].id) == parseInt(id)){
                    device_hash = response[i].device_hash
                  }
                }
                setDeviceHash(device_hash)
                updateStatsData(device_hash,timeSpan).then(function(res){
                  setApiData(prepareData(res))
                })
              })
            }}
          />
        </View><View style={[styles.centered, { flex: 1, flexDirection: "row" }]}>
          <Text style={{ fontSize: 20, color: colors.text }}>Component:</Text>
          <Dropdown
            data={["Temperature","CO2","Pressure","Humidity","IAQ"]}
            defaultValueByIndex={0}
            onSelect={(selectedItem, index) => {
              setDataType(selectedItem.toLowerCase())

            }}
          />
        </View><View style={[styles.centered, { flex: 1, flexDirection: "row" }]}>
          <Text style={{ fontSize: 20, color: colors.text }}>Time:</Text>
          <Dropdown
            data={["Last Year","Last Month","Last Day"].reverse()}
            defaultValueByIndex={0}
            onSelect={(selectedItem, index) => {
              var time;
              if(selectedItem == "Last Year"){
                time = 60*60*24*365
              }
              if(selectedItem == "Last Month"){
                time = 60*60*24*30
              }
              if(selectedItem == "Last Day"){
                time = 60*60*24
              }
              console.log("valid time "+ time)
              setTimeSpan(time)

              updateStatsData(deviceHash,time).then(function(res){
                setApiData(prepareData(res))
              })
            }}
          />
        </View>
        <View style={[styles.centered, { flex: 3 }]}>
          <View style={styles.chart}>
          <VictoryChart height={250} theme={VictoryTheme.material}>
          <VictoryLine
            data={apiData[dataType]}
          />
      </VictoryChart>
          </View>
        </View>
    </View>
    );
  }

export default EventScreen;
