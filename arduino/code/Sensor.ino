#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <ArduinoJson.h>


// -=-=-=-=-=- USER VARIABLES -=-=-=-=-=-
// WiFi credentials
const char *ssid = "SSID";
const char *password = "PW";

// api settings
const char *apiHost = "87.106.224.51:3000"; // IP address of the server
const char *apiKey = "API-KEY";

const bool enableStatusLed = true; // enable status led

// configuration settings
const int statusInterval = 10000; // 10 seconds
const int configInterval = 60000; // 60 seconds

// dybamic configuration (fetched form server)
bool debugMode = false;
String debugHost = "";
int transmitInterval = 10000; // 10 seconds

// error handling variables
int connectionErrorLimit = 5;
int sensorErrorLimit = 5;


// -=-=-=-=-=- SYSTEM VARIABLES/COUNTERS -=-=-=-=-=-
// error counters
int connectionErrorCount = 0;

// timing variables
unsigned long lastStatus = millis() - statusInterval;
unsigned long lastTransmit = millis() - transmitInterval;
unsigned long lastConfig = millis() - configInterval;
unsigned long cTime = millis();

// morse code error messages
int errorMessages[][3] = { // 0 = short, 1 = long
    {0, 0, 1}, // sensor error
    {0, 1, 0}, // connection error
    {0, 1, 1}, // too many connection errors
    {1, 0, 0} // unknown error
};
int longLength = 500;
int shortLength = 100;
int offLength = 100;


// DHT settings
#define DHTPIN 2      // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11 // DHT 22

// leds
#define LEDP 7
#define LEDM 8

#define ACTIVITYLED LED_BUILTIN
const int activityInterval = 1000;
unsigned long lastBlink = millis() - activityInterval;

DHT_Unified dht(DHTPIN, DHTTYPE);

struct Data
{
    float temperature;
    float humidity;
    bool failed;
};

Data readData(int errCount = 0); // Function declaration with default argument

void setup()
{
    Serial.begin(115200);
    // Initialize the DHT sensor
    dht.begin();

    pinMode(ACTIVITYLED, OUTPUT);
    if (enableStatusLed)
    {
        pinMode(LEDP, OUTPUT);
        pinMode(LEDM, OUTPUT);
    }

    enableStatusLedOn();
    delay(100);
    enableStatusLedOff();

    // Connect to WiFi
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi");
    while (WiFi.status() != WL_CONNECTED)
    {   
        errHandler(1); // connection error
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

        enableStatusLedOn();
        sendData();
        enableStatusLedOff();
    }

    // activity led
    if (cTime - lastBlink > activityInterval)
    {
        digitalWrite(ACTIVITYLED, !digitalRead(ACTIVITYLED));
        lastBlink = cTime;
    }

    delay(100);
}

void enableStatusLedOn()
{
    if (enableStatusLed)
    {
        digitalWrite(LEDP, HIGH);
        digitalWrite(LEDM, LOW);
    }
    else{
        digitalWrite(ACTIVITYLED, HIGH);
    }
}

void enableStatusLedOff()
{
    if (enableStatusLed)
    {
        digitalWrite(LEDP, LOW);
        digitalWrite(LEDM, HIGH);
    }
    else{
        digitalWrite(ACTIVITYLED, LOW);
    }
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
            debugHost = String(jsonObject["DebugHost"].as<const char*>());
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

void sendData()
{
    // Read temperature and humidity from DHT sensor
    Data data = readData();
    if (data.failed){
        return;
    }
    float temperature = round(data.temperature * 100) / 100;
    float humidity = round(data.humidity * 100) / 100;

    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print("°C, Humidity: ");
    Serial.print(humidity);
    Serial.println("%");

    // Create JSON payload
    DynamicJsonDocument doc(128);
    doc["api_key"] = apiKey;
    doc["temperature"] = (int)(temperature * 1000);
    doc["humidity"] = (int)(humidity * 1000);
    String strdata;
    serializeJson(doc, strdata);

    Serial.println(strdata);

    // Send data to server
    int httpResponseCode = httpPostJson("data", doc);
}

void sendStatus()
{
    int status = 0; // 0 = OK, 1 = unknown error, 2 = sensor error

    // test if the sensor is connected
    Data data = readData();
    if (data.failed){
        status = 2;
    }
    // Create JSON payload
    DynamicJsonDocument doc(128);
    doc["api_key"] = apiKey;
    doc["status"] = status;
    String strdata;
    serializeJson(doc, strdata);

    Serial.println(strdata);

    // Send data to server
    int httpResponseCode = httpPostJson("status", doc);

    //check for error
    if (httpResponseCode != 200)
    {
        connectionErrorCount++;
        if (connectionErrorCount > connectionErrorLimit)
        {
            errHandler(2); // too many connection errors
            Serial.println("Too many connection errors, restarting");
            ESP.restart();
        }
        errHandler(1); // connection error
    }
    else
    {
        connectionErrorCount = 0;
    }

    if (status == 2)
    {
        errHandler(0); // sensor error
    }
}

int httpPost(String apiCall, String data)
{
    WiFiClient client;
    HTTPClient http;

    String serverName = "http://" + host() + "/" + apiCall;
    http.begin(client, serverName);

    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(data);

    // Free resources
    http.end();

    return httpResponseCode;
}

int httpPostJson(String apiCall, DynamicJsonDocument data)
{
    String strdata;
    serializeJson(data, strdata);

    WiFiClient client;
    HTTPClient http;

    String serverName = "http://" + host() + "/" + apiCall;
    http.begin(client, serverName);

    http.addHeader("Content-Type", "application/json");
    int httpResponseCode = http.POST(strdata);

    // Free resources
    http.end();

    return httpResponseCode;
}

Data readData(int errCount){
    Data data;
    sensors_event_t event;
    dht.temperature().getEvent(&event);
    if (errCount >= sensorErrorLimit){
        errHandler(0); // sensor error
        data.failed = true;
        return data;
    }
    if (!isnan(event.temperature)){ // check if the sensor is connected
        dht.temperature().getEvent(&event);
        data.temperature = round(event.temperature * 100) / 100;
        dht.humidity().getEvent(&event);
        data.humidity = round(event.relative_humidity * 100) / 100;
        data.failed = false;
        return data;
    }
    Serial.println("Sensor not connected, trying again. attempt:" + (String)(errCount+1));
    delay(500);
    data = readData(errCount + 1); // try again if the sensor is not connected
    return data;
}

void errHandler(int errCode)
{
    morseError(errCode);
}

// status led morse error handler
void morseError(int errCode)
{
    for (int i = 0; i < 3; i++)
    {
        if (errorMessages[errCode][i] == 0)
        {
            enableStatusLedOn();
            delay(shortLength);
            enableStatusLedOff();
        }
        else
        {
            enableStatusLedOn();
            delay(longLength);
            enableStatusLedOff();
        }
        delay(offLength);
    }
    delay(longLength);
}
