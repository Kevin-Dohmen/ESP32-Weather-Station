#include <WiFi.h>
#include <WebServer.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

// WiFi credentials
const char* ssid = "SSID";
const char* password = "PW";


// Data Server settings
const char* dataServerHost = "129.168.2.7:3000"; // IP address of the server
const int transmitInterval = 10000; // 10 seconds

unsigned long lastTransmit = millis() - transmitInterval;


// DHT settings
#define DHTPIN 2     // Digital pin connected to the DHT sensor
#define DHTTYPE DHT22  // DHT 22

#define LEDP 7
#define LEDM 8

#define ACTIVITYLED LED_BUILTIN
const int activityInterval = 1000;
unsigned long lastBlink = millis() - activityInterval;

DHT_Unified dht(DHTPIN, DHTTYPE);

WebServer server(3015);

void setup() {
  Serial.begin(115200);
  // Initialize the DHT sensor
  dht.begin();

  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println(" connected!");
  Serial.print("ip address: ");
  Serial.println(WiFi.localIP());

  pinMode(ACTIVITYLED, OUTPUT);
  pinMode(LEDP, OUTPUT);
  pinMode(LEDM, OUTPUT);
  digitalWrite(LEDP, HIGH);
  digitalWrite(LEDM, LOW);

  // Start the server
  server.on("/getSensor", handleDataRequest);
  server.on("/status", handleStatusRequest);
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
  if (millis() - lastBlink > activityInterval) {
    digitalWrite(ACTIVITYLED, !digitalRead(ACTIVITYLED));
    lastBlink = millis();
  }
  if (millis() - lastTransmit > transmitInterval) {
    Serial.println("Transmitting data");
    lastTransmit = millis();
  }
}

void statusLedOn(){
  digitalWrite(LEDP, HIGH);
  digitalWrite(LEDM, LOW);
}

void statusLedOff(){
  digitalWrite(LEDP, LOW);
  digitalWrite(LEDM, HIGH);
}

void handlePostRequest() {
  // sends a POST request to the server host set in the dataServerHost variable
  // with the temperature and humidity data
  // check if sensor is connected
  sensors_event_t tempEvent;
  sensors_event_t humEvent;

  dht.temperature().getEvent(&tempEvent);
  dht.humidity().getEvent(&humEvent);

  if (isnan(tempEvent.temperature) || isnan(humEvent.relative_humidity)) {
    server.send(500, "text/plain", "Sensor error");
    Serial.println("Sensor error");
    return;
  }
}

void handleStatusRequest() {
  // check if sensor is connected
  sensors_event_t tempEvent;
  sensors_event_t humEvent;

  dht.temperature().getEvent(&tempEvent);
  dht.humidity().getEvent(&humEvent);

  if (isnan(tempEvent.temperature) || isnan(humEvent.relative_humidity)) {
    server.send(500, "text/plain", "Sensor error");
    Serial.println("Sensor error");
    return;
  }
  Serial.println("Sensor OK");

  // check if usb is connected
  if (Serial) {
    server.send(200, "text/plain", "USB connected");
    Serial.println("USB connected");
    return;
  }

  server.send(200, "text/plain", "OK");
}

void handleDataRequest() {
  statusLedOn();
  sensors_event_t tempEvent;
  sensors_event_t humEvent;

  dht.temperature().getEvent(&tempEvent);
  dht.humidity().getEvent(&humEvent);

  if (isnan(tempEvent.temperature) || isnan(humEvent.relative_humidity)) {
    server.send(500, "text/plain", "Sensor error");
    return;
  }

  // Debugging output
  Serial.print("Temperature: ");
  Serial.println(tempEvent.temperature);
  Serial.print("Humidity: ");
  Serial.println(humEvent.relative_humidity);

  String tempString = String(tempEvent.temperature, 2);
  String humString = String(humEvent.relative_humidity, 0);
  String json = "{\"temperature\": \"" + tempString + "\", \"humidity\": \"" + humString + "\"}";

  // Debugging output
  Serial.print("JSON: ");
  Serial.println(json);

  server.send(200, "application/json", json);
  delay(100);
  statusLedOff();
}
