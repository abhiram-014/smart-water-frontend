import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getDatabase, 
  ref, 
  onValue, 
  off 
} from "firebase/database";

// 🔥 Full Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyChhssEhBI32K_nnsZVwB7JQJnNcDRPArI",
  authDomain: "smart-water-management-14d85.firebaseapp.com",
  databaseURL: "https://smart-water-management-14d85-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-water-management-14d85",
  storageBucket: "smart-water-management-14d85.firebasestorage.app",
  messagingSenderId: "979091131550",
  appId: "1:979091131550:web:6e8e2b4515ee217ce2bf8f",
  measurementId: "G-3VMQ3SR5Q1"
};


// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Initialize Analytics (only works in browser environment)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

// 🔹 Initialize Realtime Database
const database = getDatabase(app);

export class FirebaseService {
  constructor() {
    this.listeners = new Map();
  }

  // 🔁 Listen to real-time sensor data
  listenToSensorData(callback) {
    const sensorRef = ref(database, "sensorData");

    const unsubscribe = onValue(
      sensorRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          callback(data);
        }
      },
      (error) => {
        console.error("Error listening to sensor data:", error);
        callback(null);
      }
    );

    this.listeners.set("sensorData", unsubscribe);
    return unsubscribe;
  }

  // ⛔ Stop listening to specific key
  stopListening(key) {
    if (this.listeners.has(key)) {
      const sensorRef = ref(database, key);
      off(sensorRef);
      this.listeners.delete(key);
    }
  }

  // ⛔ Stop all listeners
  stopAllListeners() {
    this.listeners.forEach((_, key) => {
      const sensorRef = ref(database, key);
      off(sensorRef);
    });
    this.listeners.clear();
  }

  // 📥 Get sensor data once
  async getSensorData() {
    try {
      const sensorRef = ref(database, "sensorData");

      return new Promise((resolve, reject) => {
        onValue(
          sensorRef,
          (snapshot) => {
            resolve(snapshot.val());
          },
          (error) => {
            reject(error);
          },
          { onlyOnce: true }
        );
      });
    } catch (error) {
      console.error("Error getting sensor data:", error);
      return null;
    }
  }

  // 📊 Determine parameter status
  getParameterStatus(parameter, value) {
    const ranges = {
      TDS: {
        excellent: [0, 300],
        good: [300, 600],
        warning: [600, 900],
        danger: [900, Infinity]
      },
      Temperature: {
        excellent: [20, 25],
        good: [15, 30],
        warning: [10, 35]
      },
      Turbidity: {
        excellent: [0, 1],
        good: [1, 4],
        warning: [4, 10],
        danger: [10, Infinity]
      },
      pH: {
        excellent: [6.5, 8.5],
        good: [6.0, 9.0],
        warning: [5.5, 9.5]
      }
    };

    const range = ranges[parameter];
    if (!range) return "unknown";

    if (range.excellent && value >= range.excellent[0] && value <= range.excellent[1])
      return "excellent";

    if (range.good && value >= range.good[0] && value <= range.good[1])
      return "good";

    if (range.warning && value >= range.warning[0] && value <= range.warning[1])
      return "warning";

    return "danger";
  }

  // 🕒 Format timestamp
  formatTimestamp(timestamp) {
    if (!timestamp) return new Date();
    return new Date(timestamp);
  }
}

export default new FirebaseService();
