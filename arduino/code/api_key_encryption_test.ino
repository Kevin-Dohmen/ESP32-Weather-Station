#include <Arduino.h>
#include <Crypto.h>
#include <RSA.h>
#include <Base64.h>

const char* publicKey = "-----BEGIN PUBLIC KEY-----\n..."
                        "-----END PUBLIC KEY-----\n";

const char* apiKey = "your_api_key_here";

void setup() {
  Serial.begin(115200);

  // Initialize RSA
  RSA rsa;
  rsa.setPublicKey(publicKey);

  // Encrypt the API key
  size_t encryptedLen = rsa.getOutputLength(strlen(apiKey));
  byte encrypted[encryptedLen];
  rsa.encrypt((const byte*)apiKey, strlen(apiKey), encrypted);

  // Encode the encrypted API key in base64
  char encoded[Base64.encodedLength(encryptedLen)];
  Base64.encode(encoded, (char*)encrypted, encryptedLen);

  // Print the encoded encrypted API key
  Serial.println(encoded);
}

void loop() {
  // Nothing to do here
}