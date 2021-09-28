#include "Arduino.h"
#include "BLEConn.h"
#include <ArduinoBLE.h>

BLEDevice server;
BLECharacteristic values;
byte dataArray[512];

void BLEConn::start(){
  BLE.begin();
  Serial.println("Start scanning");
  BLE.scan();
}


String BLEConn::scanForData(){
  BLE.begin();
  BLE.scanForUuid("0000181a-0000-1000-8000-00805f9b34fb");
  Serial.println("Scanning...");

  server = BLE.available();

  if(server){
    Serial.println("found server");
    values = server.characteristic("0x181A");
    if(values){
      Serial.println("found characteristic");
      values.readValue(dataArray, 512);
      String temperature((char*)dataArray);
      BLE.end();
      return temperature;
    }
  }
}

boolean BLEConn::searchNicla(){
  BLEDevice peripheral = BLE.available();
  
  if(peripheral){
    if(peripheral.localName() == "Galaxy A50"){
      Serial.println("found Nicla");
      BLE.end();
      return true;
    }else{
      return false;
    }
  }
}

void BLEConn::scanNearDevices(){
  

  BLEDevice peripheral = BLE.available();

  if (peripheral.localName() ==  "Galaxy A50") {
    // discovered a peripheral
    Serial.println("Discovered a Nicla");
    Serial.println("-----------------------");

    // print address
    Serial.print("Address: ");
    Serial.println(peripheral.address());

    // print the local name, if present
    if (peripheral.hasLocalName()) {
      Serial.print("Local Name: ");
      Serial.println(peripheral.localName());
    }

    // print the advertised service UUIDs, if present
    if (peripheral.hasAdvertisedServiceUuid()) {
      Serial.print("Service UUIDs: ");
      BLEService tempService = peripheral.service(0);
      for (int i = 0; i < peripheral.advertisedServiceUuidCount(); i++) {
        Serial.print(peripheral.advertisedServiceUuid(i));
        Serial.print(" ");
      }
      Serial.println();
      Serial.print("Anzahl characteristics");
      Serial.println(tempService.characteristicCount());
    }

    // print the RSSI
    Serial.print("RSSI: ");
    Serial.println(peripheral.rssi());

    Serial.println();
  }
  
}
