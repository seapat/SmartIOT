# Arduino

## Setup

In order to compile from this location, all you need to do is change the location fo the sketchbook directory inside the settings of the Arduine IDE:
`File->Preferences: "sketchbook lovation:..."` -> set it to the "./arduino" subdir.

## Folder structure

### Libraries

Contains all code that is shared between multiple sketches, either self-written or taken from a 3rd party.

### NiclaBLE_server

This, contains the code for conducting sensor measurements using the Nicla Sense Me and sending them via BLE to a BLE Client.
THe Measurements include: temperature, Humidity, Pressure, CO2 equivalents and the Indoor Air Qualtiy (IAQ).
The corresponding UUIDs can be found in `/arduino/libraries/Constants/BluetoothID.h`.

### HeltecLoRaBLE_client

Contains the Sketch for the board "LoRa 32 WiFi BLE (V2)", which is used to collect data from the Nicla Sense Me and send them to the Backend via WiFi using a HTTP POST Request.

### nano

Contains the Sketch for the board "Arduino Nano IoT", which is used to collect data from the Nicla Sense Me and send them to the Backend via WiFi using a HTTP POST Request.

### lib

Contains source code from external ressources, not everything is used.

## Connection to Backend (?)

https_request.ino zeigt ein Beispielprogramm für eine GET request an https://teamprojekt.layerreiss.com/sensor_api. <br>
Eine WiFi-Verbindung wird nach Eingabe von SSID und Passwort ebenfalls hergestellt. <br>
Anpassungsmöglichkeiten sind durch Kommentare markiert. <br>

Der Arduino Nicla Sense ME unterstützt nur Bluetooth, kein WiFi. <br>
Hierfür kann entweder eine Bluetoothverbindung zu einem entsprechenden Board (Arduino Nano 33 IoT, Arduino Portenta H7) aufgebaut werden oder ein WiFi Shield angeschlossen werden (wahrscheinlich veraltet). <br>

Arduino Nano 33 IoT (Wifi chip: u-blox NINA-W102): verwendet Bibliothek: <WiFiNINA.h> <br>
Arduino Portenta H7 (Wifi chip: Murata 1DX): verwendet Bibliothek: <WiFi.h> <br>
beide Bibliotheken verwenden die gleichen Funktionen, der Code kann dementsprechend übernommen werden. <br>
