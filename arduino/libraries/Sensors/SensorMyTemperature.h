#ifndef SENSOR_MY_TEMPERATURE_H_
#define SENSOR_MY_TEMPERATURE_H_

#include <Arduino_BHY2.h>

class SensorMyTemperature : public Sensor {
public:
  SensorMyTemperature() {} 
  SensorMyTemperature(uint8_t id) : Sensor(id), _value(0.), _factor(0.01) {}

  float value() 
  { 
    return _value; 
  }

  void setFactor(float factor)
  {
    _factor = factor;
  }
  void setData(SensorDataPacket &data)
  {
    thisData = data;
    parseTemperature(data, _value, _factor);
  }

  String toString()
  {
    return (String)("Temperature value: " + String(_value, 3)  + "\n");
  }

  void parseTemperature(SensorDataPacket& data, float& value, float scaleFactor) {
    value = data.getInt16(0) * scaleFactor;
  }

  SensorDataPacket getData()
  {
    return thisData;
  }

  float getFactor()
  {
      return _factor;
  }

private:
  SensorDataPacket thisData;
  float _factor;
  float _value;
};

#endif
