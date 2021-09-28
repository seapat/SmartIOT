#include "Arduino.h"
#include "Hashing.h"
//#include "SHA256.h"
#include "lib/Crypto/SHA256.h"

#define SHIFT 4

uint8_t key[32];
uint8_t data[32];
uint8_t result[32];

int Hashing::createRandomNumber(){
  randomSeed(analogRead(0));
  return random(UINT8_MAX);
}


//hardcoding a unique id is possible
void Hashing::createHash(){
  SHA256 hash;
  
  
  for (size_t posn = 0; posn < sizeof(key); ++posn){
     key[posn] = (uint8_t)createRandomNumber(); //hash input key
     data[posn] = (uint8_t)createRandomNumber(); //hash input data
     
  }

  hash.resetHMAC(key, sizeof(key));
  hash.update(data, sizeof(data));
  hash.finalizeHMAC(key, sizeof(key), result, 32);
  
}

String Hashing::getHashAsString(){
  byte temp;
  byte temp2;
  char hashcode[65];
  
  for(byte i=0; i < 32; i++){
    temp = result[i] >> SHIFT;
    hashcode[2*i] = numToChar(temp);
    temp = result[i] << SHIFT;
    temp2 = temp >> SHIFT;
    hashcode[(2*i)+1] = numToChar(temp2);
      

    
  }
  hashcode[64] = NULL;
  String res((char*)hashcode);
  
  return res;
}

char Hashing::numToChar(byte num){
  switch(num){
    case 0:
      return '0';
    case 1:
      return '1';
    case 2:
      return '2';
    case 3:
      return '3';
    case 4:
      return '4';
    case 5:
      return '5';
    case 6:
      return '6';
    case 7:
      return '7';
    case 8:
      return '8';
    case 9:
      return '9';
    case 10:
      return 'a';
    case 11:
      return 'b';
    case 12:
      return 'c';
    case 13:
      return 'd';
    case 14:
      return 'e';
    case 15:
      return 'f';
  }
}
