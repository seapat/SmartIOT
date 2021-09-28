#ifndef SENSOR_BSEC_H_
#define SENSOR_BSEC_H_

#include <Arduino_BHY2.h>


// !!! This ID requires a higher value for 'SENSOR_DATA_FIXED_LENGTH' (found in Arduino_BHY2.h) which defines the data in bytes that is saved from the FIFO per time unit.
class SensorBSEC: public Sensor {
public:
  SensorBSEC() {} 
    SensorBSEC(uint8_t id) : Sensor(id), _valueTemp(0.), _valueHumid(0.), _valueGas(0.), _valueIAQ(0.), _valueStaticIAQ(0.), _valuebVOC(0.), _valueCO2(0.) {} 

    float valueTemp() 
    { 
      return _valueTemp; 
    }

    float valueHumid() 
    { 
      return _valueHumid; 
    }

    float valueGas() 
    { 
      return _valueGas; 
    }

    float valueIAQ() 
    { 
      return _valueIAQ; 
    }

    float valueStaticIAQ() 
    { 
      return _valueStaticIAQ; 
    }

    float valueCO2()
    { 
      return _valueCO2;  
    }

    float valuebVOC() 
    { 
      return _valuebVOC; 
    }

    float valueIAQacc()
    { 
      return _valuebVOC; 
    }

    // void setFactor(float factor)
    // {
    //   _factor = factor;
    // }
    
    void setData(SensorDataPacket &data)
    {
      thisData = data; // For Print-debugging
      parseTemp(data, _valueTemp); //, _factor);
      parseHumid(data, _valueHumid); //, _factor);
      parseGas(data, _valueGas); //, _factor);
      parseIAQ(data, _valueIAQ); //, _factor);
      parseStaticIAQ(data, _valueStaticIAQ); //, _factor);
      parseCO2(data, _valueCO2); //, _factor);
      parsebVOC(data, _valuebVOC); //, _factor);
    }

    String toString()
    {
      return (String)("BSEC first float value: " + String(_valueTemp, 32)  + "\n");
    }

    void parseTemp(SensorDataPacket& data, float& value) //, float scaleFactor) 
    {
      value = data.getFloat(0);
    }

    void parseHumid(SensorDataPacket& data, float& value) //, float scaleFactor) 
    {
      value = data.getFloat(4);
    }

    void parseGas(SensorDataPacket& data, float& value) //, float scaleFactor) 
    {
      value = data.getFloat(8);
    }

    void parseIAQ(SensorDataPacket& data, float& value) //, float scaleFactor) 
    {
      value = data.getFloat(12);
    }

    void parseStaticIAQ(SensorDataPacket& data, float& value) //, float scaleFactor) 
    {
      value = data.getFloat(16);
    }

    void parseCO2(SensorDataPacket& data, float& value) //, float scaleFactor) 
    {
      value = data.getFloat(20);
    }

    void parsebVOC(SensorDataPacket& data, float& value) //, float scaleFactor) 
    {
      value = data.getFloat(24);
    }

    void parseIAQacc(SensorDataPacket& data, float& value, float scaleFactor) 
    {
      value = data.getUint8(25);
    }

    int arrayLength() 
    {
      return SENSOR_DATA_FIXED_LENGTH;
    }

    SensorDataPacket getData()
    {
      return thisData;
    }

    // float getFactor()
    // {
    //   return _factor;
    // }

  private:
    SensorDataPacket thisData;
    // float _factor;

    float _valueHumid;
    float _valueTemp;
    float _valueGas; 
    float _valueIAQ; 
    float _valueStaticIAQ; 
    float _valuebVOC;
    float _valueCO2;

};

#endif
