#include "Arduino.h"
//#include "SHA256.h"
#include "lib/Crypto/SHA256.h"


#ifndef Hashing_h
#define Hashing_h

class Hashing {
  public:
    void createHash();
    String getHashAsString();
    
  private:
    SHA256 hash;
    int createRandomNumber();
    char numToChar(byte num);
};


#endif
