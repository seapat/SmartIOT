#include <Arduino_BHY2.h>
#include <bsec.h>

#include "SensorMyTemperature.h"
#include "SensorHumidity.h"
#include "SensorPressure.h"
#include "SensorGas.h"
#include "SensorBSEC.h"

// !!! This ID requires a higher value for 'SENSOR_DATA_FIXED_LENGTH' (found in Arduino_BHY2.h) which defines the data in bytes that is saved from the FIFO per time unit.
#define SENSOR_ID_BSEC  171 //BSEC output only listed here https://colab.research.google.com/drive/1PNhHzF_sS2q04USU3epzt_Vz018CDCex#scrollTo=lp8bU2l99kOn

SensorXYZ accel(SENSOR_ID_ACC);
SensorXYZ gyro(SENSOR_ID_GYRO);
SensorMyTemperature temp(SENSOR_ID_TEMP);

SensorHumidity humid(SENSOR_ID_HUM);
SensorPressure press(SENSOR_ID_BARO);
SensorGas gas(SENSOR_ID_GAS);
SensorBSEC bsecSensor(SENSOR_ID_BSEC);

void setup()
{
  Serial.begin(115200);

  BHY2.begin();

  // These are important to start measurements!
  accel.configure(1, 0);
  gyro.configure(1, 0);
  temp.configure(1, 0);

  humid.configure(1, 0);
  press.configure(1, 0);
  gas.configure(1, 0);
  bsecSensor.configure(1, 0);
}

void loop()
{
  static auto longTime = millis();

  // Update function should be continuously polled
  BHY2.update();

  if (millis() - longTime >= 5000) {
    longTime = millis();

    Serial.println(String("besec temp: ") + String(bsecSensor.valueTemp()));
    Serial.println(String("besec humid: ") + String(bsecSensor.valueHumid()));
    Serial.println(String("besec Gas: ") + String(bsecSensor.valueGas()));
    Serial.println(String("besec IAQ: ") + String(bsecSensor.valueIAQ()));
    Serial.println(String("besec static IAQ: ") + String(bsecSensor.valueStaticIAQ()));
    Serial.println(String("besec CO2: ") + String(bsecSensor.valueCO2()));
    Serial.println(String("besec b-VOC: ") + String(bsecSensor.valuebVOC()));
    Serial.println(String("besec IAQ accuracy: ") + String(bsecSensor.valueIAQacc()));
    Serial.println(String("besec Array size: ") + String(bsecSensor.arrayLength()));
    Serial.println();
    Serial.println(String("temperature: ") + String(temp.value()));
    Serial.println(String("humidity: ") + String(humid.value()));
    Serial.println(String("gas: ") + String(gas.value()));
    Serial.println(String("pressure: ") + String(press.value()));
    // Serial.println(String("acceleration: ") + accel.toString());
    // Serial.println(String("gyroscope: ") + gyro.toString());
    Serial.println();
   
  }
}
