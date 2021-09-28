#include <Arduino_BHY2.h>
#include <bsec.h>
#include <ArduinoBLE.h>
#include "Nicla_System.h"

// these files can be found in ../libraries/Sensor (change the location of you sketchfolder to compile)
#include "SensorMyTemperature.h"
#include "SensorHumidity.h"
#include "SensorPressure.h"
#include "SensorGas.h"
#include "SensorBSEC.h"
#include "BluetoothID.h"

// !!! This ID requires a value of 25 for 'SENSOR_DATA_FIXED_LENGTH' (found in Arduino_BHY2.h) which defines the data in bytes that is saved from the FIFO per time unit.
//BSEC output only listed here https://colab.research.google.com/drive/1PNhHzF_sS2q04USU3epzt_Vz018CDCex#scrollTo=lp8bU2l99kOn
#define SENSOR_ID_BSEC                            171

// SensorXYZ accel(SENSOR_ID_ACC);
// SensorXYZ gyro(SENSOR_ID_GYRO);
SensorMyTemperature temp(SENSOR_ID_TEMP);
SensorHumidity humid(SENSOR_ID_HUM);
SensorPressure press(SENSOR_ID_BARO);
SensorGas gas(SENSOR_ID_GAS);
SensorBSEC bsecSensor(SENSOR_ID_BSEC);

// Save all Measurement Data in one single Serivce with mult. Characteristics
BLEService sensorDataService(BLE_UUID_ENVIRONMENTAL_SENSING_SERVICE);

// StringCharacteristic is not documented on the arduino website but found here https://github.com/arduino-libraries/ArduinoBLE/pull/5
// requires to specify a String size (integer) in order to work 
BLEStringCharacteristic tempCharacteristic(BLE_UUID_TEMPERATURE,  BLERead | BLENotify, 3);
BLEStringCharacteristic pressCharacteristic(BLE_UUID_PRESSURE,  BLERead | BLENotify, 4);
BLEStringCharacteristic humidCharacteristic(BLE_UUID_HUMIDITY,  BLERead | BLENotify, 3);
BLEStringCharacteristic co2Characteristic(BLE_UUID_CO2,  BLERead | BLENotify, 4);
BLEStringCharacteristic iaqCharacteristic(BLE_UUID_IAQ,  BLERead | BLENotify, 4);
BLEUnsignedCharCharacteristic batteryCharacteristic(BLE_UUID_BATTERY, BLERead | BLENotify);

long previousMillis = 0;
char lastTempMeasure = 0;
short lastPressMeasure = 0;
unsigned short lastCO2Measure = 0;
char lastHumidMeasure = 0;
short lastIAQMeasure = 0;

char oldBatteryLevel = 0;

void setup()
{
  Serial.begin(115200);

  setupSensors();
  setupBluetooth();
}

void loop()
{
  BHY2.update();
  BLEDevice central = BLE.central();

  if (central)
  {
    Serial.print("Connected to central: ");
    Serial.println(central.address());

    while (central.connected()) 
    {
      long currentMillis = millis();
      if (currentMillis - previousMillis >= 5000) {
        previousMillis = currentMillis;

        updateMeasurement(temp.value(), lastTempMeasure, tempCharacteristic, "Temperature");
        updateMeasurement(press.value(), lastPressMeasure, pressCharacteristic, "Pressure");
        updateMeasurement(humid.value(), lastHumidMeasure, humidCharacteristic, "Humidity");
        updateMeasurement(bsecSensor.valueCO2(), lastCO2Measure, co2Characteristic, "CO2 equivalents");
        updateMeasurement(bsecSensor.valueIAQ(), lastIAQMeasure, iaqCharacteristic, "Indoor Air Quality (IAQ)");

        updateBatteryLevel();

      }
    } 
    Serial.print("Disconnected from central: ");
    Serial.println(central.address());

    BLE.advertise();
    Serial.println("Bluetooth device active, waiting for connections...");
  }
}

void updateMeasurement(int16_t curr, int last, BLEStringCharacteristic characteristic, String SensorName)
{
  BHY2.update();
  if (last != curr)
  {
    Serial.print(SensorName);
    Serial.print(" is now: ");
    Serial.println(curr); 
    characteristic.writeValue(String(curr));
    last = curr;
  }
}

// FIXME: incorrect Pin, maybe there is none?
void updateBatteryLevel() {

  int battery = analogRead(A0);
  int batteryLevel = map(battery, 0, 1023, 0, 100);

  if (batteryLevel != oldBatteryLevel) {
    Serial.print("Battery Level % is now: ");
    Serial.println(batteryLevel);
    batteryCharacteristic.writeValue(batteryLevel);
    oldBatteryLevel = batteryLevel;
  }
}

void setupSensors()
{
  BHY2.begin();
  // by bosch
  // accel.configure(1, 0);
  // gyro.configure(1, 0);
  
  // self-made
  temp.configure(1, 0);
  humid.configure(1, 0);
  press.configure(1, 0);
  gas.configure(1, 0);
  bsecSensor.configure(1, 0);
}

void setupBluetooth()
{
  while (!Serial);

  if (!BLE.begin()) 
  {
    Serial.println("starting BLE failed!");
    while (1);
  }

  BLE.setDeviceName("");
  BLE.setLocalName("NiclaSenseMe");
  BLE.setAdvertisedService(sensorDataService);
  BLE.setAdvertisedServiceUuid(BLE_UUID_ENVIRONMENTAL_SENSING_SERVICE);

  sensorDataService.addCharacteristic(tempCharacteristic);
  sensorDataService.addCharacteristic(pressCharacteristic);
  sensorDataService.addCharacteristic(humidCharacteristic);
  sensorDataService.addCharacteristic(co2Characteristic);
  sensorDataService.addCharacteristic(iaqCharacteristic);

  sensorDataService.addCharacteristic(batteryCharacteristic);
  BLE.addService(sensorDataService);

  BLE.advertise();
  Serial.println("Bluetooth device active, waiting for connections...");
}
