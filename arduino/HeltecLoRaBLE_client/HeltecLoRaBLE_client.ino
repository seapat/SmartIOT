#include "BLEDevice.h"
#include <WiFi.h>
#include <HTTPClient.h>

// this file can be found in ../libraries/Sensor (change the location of you sketchfolder to compile)
#include "BluetoothID.h"

#define WIFI_SSID         ""
#define WIFI_PASSWORD     ""
#define HTTPS_POST_DATA   ".../sensor_api/post_data"
#define HTTPS_REG_DEVICE  ".../register_device"

// remote service 
static BLEUUID serviceUUID(BLE_UUID_ENVIRONMENTAL_SENSING_SERVICE);

// hardcoded array of BLE UUIDs to create Characteristic Objects, use array to colelct measuremetns
const char* charIDs[] = {BLE_UUID_CO2, BLE_UUID_TEMPERATURE, BLE_UUID_PRESSURE, BLE_UUID_HUMIDITY, BLE_UUID_IAQ}; // 
BLERemoteCharacteristic* remoteChars[(sizeof(charIDs) / sizeof(charIDs[0]))];
const byte charIDLength = (sizeof(charIDs) / sizeof(charIDs[0])); // 5
std::string measurements[charIDLength];

static boolean doConnect = false;
static boolean connected = false;
static BLEAdvertisedDevice* myDevice;

class MyClientCallback : public BLEClientCallbacks 
{
  void onConnect(BLEClient* pclient) 
  {
  }

  void onDisconnect(BLEClient* pclient) 
  {
    connected = false;
    Serial.println("onDisconnect");
  }
};

bool connectToServer() 
{
  Serial.print("Forming a connection to ");
  Serial.println(myDevice->getAddress().toString().c_str());
  
  BLEClient*  pClient  = BLEDevice::createClient();
  Serial.println(" - Created client");

  pClient->setClientCallbacks(new MyClientCallback());

  // Connect to the remove BLE Server.
  pClient->connect(myDevice); 
  Serial.println(" - Connected to server");
  pClient->setMTU(517); //set client to request maximum MTU from server (default is 23 otherwise)

  // reference to server's service
  BLERemoteService* pRemoteService = pClient->getService(serviceUUID);
  if (pRemoteService == nullptr) 
  {
    Serial.print("Failed to find service UUID: ");
    Serial.println(serviceUUID.toString().c_str());
    pClient->disconnect();
    return false;
  }
  Serial.println(" - Found service");

  for (byte idx = 0; idx < charIDLength; idx++)
  {
    // reference to characteristics
    BLERemoteCharacteristic* pRemoteCharacteristic = pRemoteService->getCharacteristic(charIDs[idx]);
    remoteChars[idx] = pRemoteCharacteristic;

    // handle error
    if (pRemoteCharacteristic == nullptr) 
    {
      Serial.print("Failed to find characteristic UUID: ");
      Serial.println(charIDs[idx]);
      pClient->disconnect();
      return false;
    }
    Serial.print(" - Found characteristic:\t");
    Serial.println(charIDs[idx]);

    // Read inital values
    if(pRemoteCharacteristic->canRead()) 
    {
      std::string value = pRemoteCharacteristic->readValue();
      Serial.print(" - Inital value:\t\t");
      Serial.println(String(value.c_str()));
    }
  }
  connected = true;
  return true;
}
/**
 * Scan for BLE servers and find the first one that advertises the service we are looking for.
 */
class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks 
{
 /**
   * Called for each advertising BLE server.
   */
  void onResult(BLEAdvertisedDevice advertisedDevice) 
  {
    Serial.print("BLE Advertised Device found: ");
    Serial.println(advertisedDevice.toString().c_str());

    // We have found a device, let us now see if it contains the service we are looking for.
    if (advertisedDevice.haveServiceUUID() && advertisedDevice.isAdvertisingService(serviceUUID)) 
    {
      // TODO: This prevents connecting multiple devices at the same time.
      BLEDevice::getScan()->stop();
      
      myDevice = new BLEAdvertisedDevice(advertisedDevice);
      doConnect = true;
    }
  }
};

void scanForService()
{
  // setup scanner and use active scanning for 5 seconds.
  BLEScan* pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setInterval(1349);
  pBLEScan->setWindow(449);
  pBLEScan->setActiveScan(true);
  pBLEScan->start(5, false);
}

void setup() 
{
  Serial.begin(115200);
  Serial.println("Starting Arduino BLE Client application...");
  BLEDevice::init("");

  Serial.println();
  Serial.println(charIDLength);
  Serial.println();

  scanForService();

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Success! \n Connected to WiFi network: ");
  Serial.println(WiFi.localIP());

}

void loop() 
{
  // doConnect -> found the desired BLE Server
  // connected -> connected to desired BLE Server
  if (doConnect) {
    if (connectToServer()) {
      Serial.println("We are now connected to the BLE Server.");
    } else {
      Serial.println("We have failed to connect to the server");
    }
    doConnect = false;
  }

  // read out caracterisitcs
  if (connected) 
  {
    // read data
    for (byte idx = 0; idx < charIDLength; idx++)
    {
      std::string readout = remoteChars[idx]->readValue();
      Serial.print("Current Value is ");
      Serial.print(String(readout.c_str()) );
      Serial.print("\t -> ");
      Serial.println(charIDs[idx]);

      measurements[idx] = readout;
    }
    // send to server
    sendPostRequest();
  }
  else
  {
    Serial.println("Scanning for Service ...");
    scanForService();
  }
  delay(5000);

}

void sendPostRequest()
{
 // {"device_id":256SHA, "co2": xxxx, "temp": xxx, "pressure":xxxx, "humidity":xxx, "iaq":xxx}

  // send only if still connected
  if ((WiFi.status() == WL_CONNECTED)) 
  { 
    String json =
      String("{\"device_hash\":\"b29f63636a8d56a4dbaa9123ff7afe8cb601c1104d40f34c1a3226b572b60341\",")
      + String("\"co2\":")        + measurements[0].c_str() 
      + String(", \"temp\":")     + measurements[1].c_str() 
      + String(", \"pressure\":") + measurements[2].c_str() 
      + String(", \"humidity\":") + measurements[3].c_str()
      + String(", \"iaq\":") + measurements[4].c_str()
      + String("}");

    WiFiClient client;
    HTTPClient http;

    http.begin(client, HTTPS_POST_DATA);

    http.addHeader("Content-Type", "application/json");

    byte httpResponseCode = http.POST(json);

    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    http.end();
  }
  else
  {
    Serial.println("WiFi disconnected, nothing sent...");
  }
}
