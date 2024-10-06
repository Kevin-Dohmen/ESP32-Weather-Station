# SPECS
## stuff:
* Arduino:
  * [Seeed Studio Xiao esp32s3 sense](https://www.seeedstudio.com/XIAO-ESP32S3-Sense-p-5639.html) (I used this but without the camera module attached)
  * or [Seeed Studio Xiao esp32s3](https://www.seeedstudio.com/XIAO-ESP32S3-p-5627.html) (without camera module)
* dht sensor:
    * [DHT11](https://elektronicavoorjou.nl/product/dht11-temperatuur-en-vochtigheid-sensor/?gad_source=1&gclid=CjwKCAjwzIK1BhAuEiwAHQmU3tIiWBFGl7Z6ecuS6IeUYpXhmZhkQU80IYyGq5JFfu1sVSwDMZQ0lhoCBGIQAvD_BwE)
* battery:
    * [LiPo Pouch Battery 503035 (3.7V, 500mAh)](https://www.welectron.com/LiPo-Pouch-Battery-503035-37V-500mAh)

## pinout:
* Seeed Studio Xiao esp32s3 sense:
  * DHT11:
    * pin 1: 3.3V
    * pin 2: D4
    * pin 3: GND
  * Battery: (pads on the back)
    * pin 1: battery +
    * pin 2: battery -

## libraries:
* [ArduinoJSON](https://arduinojson.org/?utm_source=meta&utm_medium=library.properties) by Benoit Blanchon
* [Adafruit Unified Sensor](https://github.com/adafruit/Adafruit_Sensor) by Adafruit
* [DHT sensor library](https://github.com/adafruit/DHT-sensor-library) by Adafruit

## possible issues:
* the ESP32 goes into a bootloop
  * change the pins to the correct ones for your board
    * Change the status led pins, the default pins might not exist on your board.  
      This was the case for me, i tried running it on a DOIT ESP32 DEVKIT V1 and it went into a bootloop,  
      changing the dht pin to 4 and the led pins to 18 and 19 fixed this issue for me.
    * You can also disable the status led by setting "enableStatusLed" fo false.
* the DHT sensor is not working
  * Make sure the sensor is connected correctly, the data pin should be connected to pin D2 on the board by default.  
    on the Xiao esp32s3 sense this is physical pin 1 for some reason.
