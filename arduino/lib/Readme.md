# Notes

- **Unisense-fw-04.zip**: the package includes some Arduino libraries and examples to help with the interaction with the sensors using different interfaces: UART/ESLOV/BLE/USB, included the participants could also find the README file which has a brief but clear guide on how to use the libraries and examples for different scenarios.
- **BHI260AP FW**: The board has already been pre-programmed (on one of the 2 SPI Flash chips connected to BHI260) with a BHI260AP FW that contains some of the basic features such as sensor fusion and BSEC output. For detailsabout the FW description please check the documentation here: <https://driv>e.google.com/drive/u/0/folders/1bkwchTeA04c67yDru5imMFW9SOXrRaTk
- **bhy260ap_fw_basic-flash.fw**: as mentioned above, this is the same FW that is pre-programmed on the flash connected to BHI260, in case the user wants to reprogram the flash, this is the file to use
- **bhy260ap_fw_basic-ram.fw**: the BHI260 could boot from flash or ram, this is the FW to be used if the user wants to boot the BHI260 from RAM. Note: the libraries provided (unisense-fw-0.4.zip) instructs the BHI260 to boot from flash so this is not used.
- nicla-sense-me-libs.zip contains **Arduino_BHY2** and **Arduino_BHY2_HOST** which are required for reading the sensor data
- Crypto.zip is distributed under the terms of the MIT license. See also [Github](https://github.com/rweather/arduinolibs)
