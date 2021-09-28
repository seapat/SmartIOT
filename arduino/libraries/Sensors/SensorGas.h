#ifndef SENSOR_GAS_H_
#define SENSOR_GAS_H_

#include <Arduino_BHY2.h>

// "tools\bhy-controller\src\webserver\parse-scheme.json" inside the unisense-fw-04 library holds information on scale factors
class SensorGas: public Sensor {
public:
  SensorGas() {} 
    SensorGas(uint8_t id) : Sensor(id), _value(0.), _factor(1) {} 

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
      parseGas(data, _value, _factor);
    }

    String toString()
    {
      return (String)("Gas raw value: " + String(_value, 32)  + "\n");
    }

    void parseGas(SensorDataPacket& data, float& value, float scaleFactor) 
    {
      value = data.getUint32(0) * scaleFactor;
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