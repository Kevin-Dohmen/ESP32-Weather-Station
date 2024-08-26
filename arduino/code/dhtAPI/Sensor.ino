#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <ArduinoJson.h>

// WiFi credentials
const char *ssid = "SSID";
const char *password = "PW";

// api settings
const char *apiHost = "87.106.224.51:3000"; // IP address of the server
const char *apiKey = "API-KEY";

// configuration settings
const int statusInterval = 10000;  // 10 seconds
const int configInterval = 60000; // 60 seconds

// dybamic configuration (fetched form server)
bool debugMode = false;
String debugHost = "";
int transmitInterval = 10000; // 10 seconds

// timing variables
unsigned long lastStatus = millis() - statusInterval;
unsigned long lastTransmit = millis() - transmitInterval;
unsigned long lastConfig = millis() - configInterval;
unsigned long cTime = millis();

// DHT settings
#define DHTPIN 2      // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11 // DHT 11

// leds
#define LEDP 7
#define LEDM 8

#define ACTIVITYLED LED_BUILTIN
const int activityInterval = 1000;
unsigned long lastBlink = millis() - activityInterval;

DHT_Unified dht(DHTPIN, DHTTYPE);

void setup()
{
    Serial.begin(115200);
    // Initialize the DHT sensor
    dht.begin();

    pinMode(ACTIVITYLED, OUTPUT);
    pinMode(LEDP, OUTPUT);
    pinMode(LEDM, OUTPUT);

    statusLedOn();
    delay(100);
    statusLedOff();

    // Connect to WiFi
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.print(".");
    }
    Serial.println(" connected!");
    Serial.print("ip address: ");
    Serial.println(WiFi.localIP());
}

void loop()
{
    cTime = currentTime();
    // Get configuration
    if ((cTime - lastConfig) > configInterval)
    {
        lastConfig += configInterval;
        getConfig();
    }

    // Send status
    if ((cTime - lastStatus) > statusInterval)
    {
        lastStatus += statusInterval;
        Serial.println("Sending status");
        sendStatus();
    }

    // Send data
    if ((cTime - lastTransmit) > transmitInterval)
    {
        lastTransmit += transmitInterval;
        Serial.println("Sending data");

        statusLedOn();
        sendData();
        statusLedOff();
    }

    // activity led
    if (cTime - lastBlink > activityInterval)
    {
        digitalWrite(ACTIVITYLED, !digitalRead(ACTIVITYLED));
        lastBlink = cTime;
    }

    delay(100);
}

void statusLedOn(){
  digitalWrite(LEDP, HIGH);
  digitalWrite(LEDM, LOW);
}

void statusLedOff(){
  digitalWrite(LEDP, LOW);
  digitalWrite(LEDM, HIGH);
}

unsigned long currentTime()
{
    return millis();
}

String host()
{
    if (debugMode)
    {
        return String(debugHost);
    }
    else
    {
        return String(apiHost);
    }
}

void getConfig()
{
    // Send request to server
    if (WiFi.status() == WL_CONNECTED)
    {
        WiFiClient client;
        HTTPClient http;

        // Your Domain name with URL path or IP address with path
        String serverName = "http://" + host() + "/config/" + apiKey;
        http.begin(client, serverName);

        int httpResponseCode = http.GET();

        if (httpResponseCode > 0)
        {
            Serial.print("HTTP Response code: ");
            Serial.println(httpResponseCode);
            String payload = http.getString();
            Serial.println(payload);
            // Parse JSON payload
            DynamicJsonDocument doc(128);
            deserializeJson(doc, payload);
            JsonObject jsonObject = doc.as<JsonObject>();

            // Access JSON data
            if (jsonObject["Interval"].is<int>())
            {
                // The value is an integer
                transmitInterval = jsonObject["Interval"].as<int>() * 1000;
                debugMode = jsonObject["Debug"].as<bool>();
                debugHost = (String)jsonObject["DebugHost"];
            }
            else
            {
                // The value is not an integer
                // Handle the error or provide a default value
                Serial.println("Error: transmit_interval is not an integer");
            }
        }
        else
        {
            Serial.print("Error code: ");
            Serial.println(httpResponseCode);
        }

        // Free resources
        http.end();
    }
    else
    {
        Serial.println("WiFi Disconnected");
    }
}

void sendData()
{
    // Read temperature and humidity from DHT sensor
    sensors_event_t event;
    dht.temperature().getEvent(&event);
    float temperature = round(event.temperature * 100) / 100;
    dht.humidity().getEvent(&event);
    float humidity = round(event.relative_humidity * 100) / 100;

    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print("°C, Humidity: ");
    Serial.print(humidity);
    Serial.println("%");

    // Create JSON payload
    DynamicJsonDocument doc(128);
    doc["api_key"] = apiKey;
    doc["temperature"] = (int)(temperature*1000);
    doc["humidity"] = (int)(humidity*1000);
    String data;
    serializeJson(doc, data);

    Serial.println(data);

    // Send data to server
    if (WiFi.status() == WL_CONNECTED)
    {
        WiFiClient client;
        HTTPClient http;

        // Your Domain name with URL path or IP address with path
        String serverName = "http://" + host() + "/data";
        http.begin(client, serverName);

        http.addHeader("Content-Type", "application/json");
        int httpResponseCode = http.POST(data);

        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);

        // Free resources
        http.end();
    }
    else
    {
        Serial.println("WiFi Disconnected");
    }
}


void sendStatus()
{
    int status = 0; // 0 = OK, 1 = unknown error, 2 = sensor error

    // test if the sensor is connected
    sensors_event_t event;
    dht.temperature().getEvent(&event);
    if (isnan(event.temperature))
    {
        status = 2;
    }
    // Create JSON payload
    DynamicJsonDocument doc(128);
    doc["api_key"] = apiKey;
    doc["status"] = status;
    String data;
    serializeJson(doc, data);

    Serial.println(data);

    // Send data to server
    if (WiFi.status() == WL_CONNECTED)
    {
        WiFiClient client;
        HTTPClient http;

        // Your Domain name with URL path or IP address with path
        String serverName = "http://" + host() + "/status";
        http.begin(client, serverName);

        http.addHeader("Content-Type", "application/json");
        int httpResponseCode = http.POST(data);

        Serial.print("HTTP Response code: ");
        Serial.println(httpResponseCode);

        // Free resources
        http.end();
    }
    else
    {
        Serial.println("WiFi Disconnected");
    }
}