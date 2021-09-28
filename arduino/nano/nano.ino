//use WiFiNINA.h for Arduino Nano 33 IoT (Wifi chip: u-blox NINA-W102)
//for Arduino Portenta H7 use WiFi.h (Wifi chip: Murata 1DX), same syntax for both libraries

#include <WiFiNINA.h>
#include <SPI.h>
#include "ServerConn.h"
#include "Hashing.h"
#include "BLEConn.h"

//https://teamprojekt.layerreiss.com doesn't work here



String ssid = "";//include SSID here
String pass = ""; //include wifi password here
String url = "teamprojekt.layerreiss.com";


ServerConn connection(url, ssid, pass);
Hashing hashing;
BLEConn bleConnection;
String hashString;
String dataString;



void setup() {
  Serial.begin(9600);
  
  bleConnection.start();
  
    
  
  //hashing_setup();
  //post_setup();
  
}

void loop() {

  //dataString = bleConnection.scanForData();
  
  if(bleConnection.searchNicla()){
    Serial.println("Found Nicla...");
    connection.connectWifi();
    connection.postData("b29f63636a8d56a4dbaa9123ff7afe8cb601c1104d40f34c1a3226b572b60341","36","36","1","1");
    connection.printClient();
    delay(30000);
  }
  //Serial.print(dataString);
  //hasing_print();
  
  
  
}

void post_setup(){
  //connection.connectWifi();
  connection.postData("b29f63636a8d56a4dbaa9123ff7afe8cb601c1104d40f34c1a3226b572b60341","36","36","1","1");
}

void hashing_setup(){
  hashing.createHash();
  hashString = hashing.getHashAsString();
}

void hasing_print(){
  Serial.println(hashString);
  Serial.println(hashString.length());
}

//Message:
// GET page HTTP/1.1
// Host: URL
// Connection: close
// empty line

//void https_get(){
//  if(client.connect(URL, 443)) {
//    client.println("GET / HTTP/1.1"); 
//    client.print("Host: ");
//    client.println(String(URL));
//    client.println("Connection: close");
//    client.println();
//    Serial.println("Request sent");
//  }
//}
//
////empty lines must be set
////Message:
//// POST path HTTP/1.1
//// Host: URL
//// Content-Type: application/json
//// Content-Length: length
//// empty line
//// body
//// Connection: close
//// empty line
//void https_post(String body, String path){
//  if(client.connect(URL, 443)) {
//    //client.println("POST /sensor_api_user/register_user HTTP/1.1");
//    client.print("POST ");
//    client.print(path);
//    client.println(" HTTP/1.1");
//    Serial.print("POST ");
//    Serial.print(path);
//    Serial.println(" HTTP/1.1");
//    client.print("Host: ");
//    client.println(String(URL));
//    client.println("Content-Type: application/json");
//    client.print("Content-Length: ");
//    client.println(body.length());
//    client.println();
//    client.println(body);
//    client.println("Connection: close");
//    //client.println();
//    Serial.println("Request sent"); 
//  }
//}
//
//void printClient(){
//  
//}
//
//void connectWifi(){
//  while(!Serial);
//
//  char temp[ssid.length()];
//  ssid.toCharArray(temp, ssid.length()+1);
//
//  if (WiFi.status() == WL_NO_MODULE) {
//    Serial.println("Communication with WiFi module failed!");
//    // don't continue
//    while (true);
//  }
//
//  while(status != WL_CONNECTED){
//    Serial.print("Connect to network:");
//    Serial.println(temp);
//
//    status = WiFi.begin(temp,pass);
//
//    delay(connectionDelay);
//  }
//
//  Serial.println("Connected!");
//}
