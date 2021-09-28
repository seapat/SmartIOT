#ifndef SENSOR_QUATERNION_H_
#define SENSOR_QUATERNION_H_

#include "Sensor.h"

class SensorQuaternion : public Sensor {
public:
  SensorQuaternion() {} 
  SensorQuaternion(uint8_t id) : Sensor(id), _data() {}

  int16_t x() 
  { 
    return _data.x; 
  }
  int16_t y()
  {
    return _data.y;
  }
  int16_t z()
  {
    return _data.z;
  }
  int16_t w()
  {
    return _data.w;
  }

  void setData(SensorDataPacket &data)
  {
    DataParser::parse(data, _data);
  }

  String toString()
  {
    return _data.toString();
  }

private:
  DataQuaternion _data;
};

#endif
