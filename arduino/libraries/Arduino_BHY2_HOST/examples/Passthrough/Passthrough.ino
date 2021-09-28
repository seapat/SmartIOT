/* 
 * This sketch allows to control nicla from a PC.
 * Upload this sketch on an arduino board connected to nicla 
 * through the eslov connector. Then connect the same arduino board
 * to your PC.
 * Now you can use the arduino-bhy tool, written in golang, 
 * to control nicla from either the PC command line or from a web page.
*/

#include "Arduino.h"
#include "Arduino_BHY2_HOST.h"

// Set DEBUG to true in order to enable debug print
#define DEBUG false

Serial_ SerialUSB2(USBDevice);

void setup()
{
  Serial.begin(115200);
  Serial1.begin(115200);
  SerialUSB2.begin(115200);
#if DEBUG
  // When the passthrough is enabled, Serial is busy ->
  // so it cannot be used for debugging. Serial1 is used instead
  BHY2_HOST.debug(Serial1);
#endif

  BHY2_HOST.begin(true);
}

void loop()
{
  if (Serial1.available()) {
    SerialUSB2.write(Serial1.read());
  }
  BHY2_HOST.update();
}
