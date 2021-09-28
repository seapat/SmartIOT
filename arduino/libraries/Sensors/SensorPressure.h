#ifndef SENSOR_PRESSURE_H_
#define SENSOR_PRESSURE_H_

#include <Arduino_BHY2.h>

// "tools\bhy-controller\src\webserver\parse-scheme.json" inside the unisense-fw-04 library holds information on scale factors
class SensorPressure: public Sensor {
public:
  SensorPressure() {} 
    SensorPressure(uint8_t id) : Sensor(id), _value(0.), _factor(0.008) {} 

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
      parsePressure(data, _value, _factor);
    }

    String toString()
    {
      return (String)("Pressure value: " + String(_value, 3)  + "\n");
    }

    void parsePressure(SensorDataPacket& data, float& value, float scaleFactor) 
    {
      value = data.getUint24(0) * scaleFactor;
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