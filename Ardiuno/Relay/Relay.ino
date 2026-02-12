 #define RELAY_PIN 22  // Relay control pin

void setup() {
  Serial.begin(115200);

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Relay OFF at start (active LOW)

  Serial.println("=== Relay Simulation: 10s ON, 5s OFF ===");
}

void loop() {
  // Relay ON (active LOW)
  digitalWrite(RELAY_PIN, LOW);
  Serial.println("Relay ON ✅");
  delay(10000); // 10 seconds ON

  // Relay OFF
  digitalWrite(RELAY_PIN, HIGH);
  Serial.println("Relay OFF ❌");
  delay(5000); // 5 seconds OFF
}
