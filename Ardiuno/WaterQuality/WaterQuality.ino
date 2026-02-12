#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// Wi-Fi credentials
#define WIFI_SSID "Paadu_Gajala"
#define WIFI_PASSWORD "12345678"

// Firebase credentials
#define API_KEY "AIzaSyAMHEnJOoeymPaVMEuLM_ywLc7uuAm-uSM"
#define DATABASE_URL "smartwatersystem-74f77-default-rtdb.asia-southeast1.firebasedatabase.app"

// Sensor pins
#define PH_PIN 35
#define TDS_PIN 34
#define TURBIDITY_PIN 33

// OLED config
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);

  // OLED Init
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println("SSD1306 allocation failed");
    for (;;);
  }
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println("Water System Init...");
  display.display();

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n✅ Wi-Fi connected!");
  Serial.print("IP: ");
  Serial.println(WiFi.localIP());

  // Firebase configuration
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  // Anonymous sign-in
  if (Firebase.signUp(&config, &auth, "", "")) {
    Serial.println("✅ Firebase sign-up successful");
    signupOK = true;
  } else {
    Serial.printf("❌ Firebase sign-up failed: %s\n", config.signer.signupError.message.c_str());
  }

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
}

void loop() {
  if (Firebase.ready() && signupOK && millis() - sendDataPrevMillis > 5000) {
    sendDataPrevMillis = millis();

    // Read pH
    int phRaw = analogRead(PH_PIN);
    float phVoltage = (phRaw / 4095.0) * 3.3;
    float pH = 7.5 + ((1.57 - phVoltage) / 0.18);

    // Read TDS
    int tdsRaw = analogRead(TDS_PIN);
    float tdsVoltage = (tdsRaw / 4095.0) * 3.3;
    float tdsValue = (133.42 * pow(tdsVoltage, 3) - 255.86 * pow(tdsVoltage, 2) + 857.39 * tdsVoltage) * 0.5;

    // Read Turbidity
    int turbidityRaw = analogRead(TURBIDITY_PIN);
    float turbidityVoltage = (turbidityRaw / 4095.0) * 3.3;
    float turbidityNTU = ((turbidityVoltage - 2.5) * -112.0 + 100.0) / 10.0;

    // Send to Firebase
    if (Firebase.RTDB.setFloat(&fbdo, "/sensorData/pH", pH)) Serial.printf("✅ pH sent: %.2f\n", pH);
    else Serial.print("❌ pH Error: "); Serial.println(fbdo.errorReason());

    if (Firebase.RTDB.setFloat(&fbdo, "/sensorData/TDS", tdsValue)) Serial.printf("✅ TDS sent: %.2f ppm\n", tdsValue);
    else Serial.print("❌ TDS Error: "); Serial.println(fbdo.errorReason());

    if (Firebase.RTDB.setFloat(&fbdo, "/sensorData/Turbidity", turbidityNTU)) Serial.printf("✅ Turbidity sent: %.2f NTU\n", turbidityNTU);
    else Serial.print("❌ Turbidity Error: "); Serial.println(fbdo.errorReason());

    // Display on OLED
    display.clearDisplay();
    display.setCursor(0, 0);
    display.print("pH: "); display.println(pH, 2);
    display.print("TDS: "); display.print(tdsValue, 1); display.println(" ppm");
    display.print("Turb: "); display.print(turbidityNTU, 1); display.println(" NTU");
    display.display();
  }  
}