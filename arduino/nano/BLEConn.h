#include "Arduino.h"
#include <ArduinoBLE.h>

#ifndef BLEConn_h
#define BLEConn_h

class BLEConn{
  public:
    void start();
    String scanForData();
    void scanNearDevices();
    boolean searchNicla();
  private:
};

#endif
