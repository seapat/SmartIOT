#include "Arduino.h"
//#include <WiFiNINA.h>
#include "lib/WiFiNINA/src/WiFiNINA.h"


#ifndef ServerConn_h
#define ServerConn_h

class ServerConn{
  public:
    ServerConn(String url, String ssid, String pass);
    void connectWifi();
    void printClient();
    void postData(String id, String co2, String temp, String pressure, String humidity);
    //debug
    void printData();
    

  private:
    void https_post(String body, String path);
    void https_get(String path);
    WiFiSSLClient client;
    int connectionDelay = 5000;
    int status = WL_IDLE_STATUS;
    String Url;
    String Ssid;
    String Pass;
};


#endif
