#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "SSID";
const char* password = "PW";

// api settings
const char *apiHost = "192.168.3.7:3000"; // IP address of the server
const char *apiKey = "sum stuff";

// configuration settings
const int statusInterval = 5000;   // 5 seconds
const int configInterval = 60000;  // 60 seconds

int transmitInterval = 5000; // 10 seconds
unsigned long timeOffset = 0;


unsigned long lastStatus = millis() - statusInterval;
unsigned long lastTransmit = millis() - transmitInterval;
unsigned long lastConfig = millis() - configInterval;

// DHT settings
#define DHTPIN 2      // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11 // DHT 11

DHT_Unified dht(DHTPIN, DHTTYPE);

void setup()
{
    Serial.begin(115200);
    // Initialize the DHT sensor
    dht.begin();

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
    // Get configuration
    if ((currentTime() - lastConfig) > configInterval)
    {
        lastConfig += configInterval;
        getConfig();
    }

    // Send status
    if ((currentTime() - lastStatus) > statusInterval)
    {
        lastStatus += statusInterval;
        Serial.println("Sending status");
        // sendStatus();
    }

    // Send data
    if ((currentTime() - lastTransmit) > transmitInterval)
    {
        lastTransmit += transmitInterval;
        Serial.println("Sending data");
        sendData();
    }
}

unsigned long currentTime()
{
    return millis() + timeOffset;
}

void getConfig()
{
    // Send request to server
    if (WiFi.status() == WL_CONNECTED)
    {
        WiFiClient client;
        HTTPClient http;

        // Your Domain name with URL path or IP address with path
        String serverName = "http://" + String(apiHost) + "/config/" + apiKey;
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
            int transmitInterval = jsonObject["transmit_interval"];
            unsigned long timeOffset = jsonObject["time_offset"];
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
    doc["temperature"] = temperature;
    doc["humidity"] = humidity;
    String data;
    serializeJson(doc, data);

    Serial.println(data);

    // Send data to server
    if (WiFi.status() == WL_CONNECTED)
    {
        WiFiClient client; 
        HTTPClient http;

        // Your Domain name with URL path or IP address with path
        String serverName = "http://" + String(apiHost) + "/data";
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
