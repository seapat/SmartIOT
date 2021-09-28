#include "Arduino.h"
#include "ServerConn.h"
//#include <WiFiNINA.h>
#include "lib/WiFiNINA/src/WiFiNINA.h"


//Endpoints


ServerConn::ServerConn(String url, String ssid, String pass){
  Url = url;
  Ssid = ssid;
  Pass = pass;
  Serial.begin(9600);
}


void ServerConn::connectWifi(){
  
  while(!Serial);

  char temp1[Ssid.length()];
  char temp2[Ssid.length()];
  Ssid.toCharArray(temp1, Ssid.length()+1);
  Pass.toCharArray(temp2, Pass.length()+1);
  

  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true);
  }

  while(status != WL_CONNECTED){
    Serial.print("Connect to network:");
    Serial.println(Ssid);

    status = WiFi.begin(temp1,temp2);

    delay(connectionDelay);
  }

  Serial.println("Connected!");
}

void ServerConn::printClient(){
  while (client.available()) {
    char c = client.read();
    Serial.write(c);
  }

  
  if (!client.connected()) {
    client.stop();
  }
}

void ServerConn::postData(String id, String co2, String temp, String pressure, String humidity){
  String body = "{\"device_hash\":\"" + id + "\",\"co2\":\"" + co2 + "\",\"temp\":\"" + temp + "\",\"pressure\":\"" + pressure + "\",\"humidity\":\"" + humidity + "\"}";
  String path = "/sensor_api/post_data";
  Serial.println(body);
  https_post(body,path);
}

//debug
void ServerConn::printData(){
  
}

void ServerConn::https_post(String body, String path){
  char temp[Url.length()];
  Url.toCharArray(temp,Url.length()+1);
  if(client.connect(temp, 443)) {
    //client.println("POST /sensor_api_user/register_user HTTP/1.1");
    client.print("POST ");
    client.print(path);
    client.println(" HTTP/1.1");
    client.print("Host: ");
    client.println(String(Url));
    client.println("Content-Type: application/json");
    client.print("Content-Length: ");
    client.println(body.length());
    client.println();
    client.println(body);
    client.println("Connection: close");
    //client.println();
    Serial.println("Request sent"); 
  }
}



void ServerConn::https_get(String path){
  
}
