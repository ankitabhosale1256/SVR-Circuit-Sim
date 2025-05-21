export const availableComponents = [
  // Microcontrollers and Boards
  { name: 'Arduino Uno', tag: 'wokwi-arduino-uno' },
  { name: 'Arduino Mega', tag: 'wokwi-arduino-mega' },
  { name: 'Arduino Nano', tag: 'wokwi-arduino-nano' },
  { name: 'ESP32', tag: 'wokwi-esp32' },
  { name: 'Raspberry Pi Pico', tag: 'wokwi-pi-pico' },
  { name: 'STM32', tag: 'wokwi-stm32' },
  { name: 'ATtiny85', tag: 'wokwi-attiny85' },

  // LEDs and Lighting
  { name: 'LED', tag: 'wokwi-led' },
  { name: 'RGB LED', tag: 'wokwi-rgb-led' },
  { name: 'NeoPixel', tag: 'wokwi-neopixel' },
  { name: 'LED Bar Graph', tag: 'wokwi-led-bar-graph' },
  { name: 'LED Ring', tag: 'wokwi-led-ring' },

  // Displays
  { name: '7-Segment Display', tag: 'wokwi-7segment' },
  { name: 'SSD1306 OLED Display', tag: 'wokwi-ssd1306' },
  { name: 'ILI9341 TFT LCD', tag: 'wokwi-ili9341' },
  { name: 'LCD 16x2', tag: 'wokwi-lcd1602' },
  { name: 'LCD 20x4', tag: 'wokwi-lcd2004' },

  // Sensors
  { name: 'Ultrasonic Sensor', tag: 'wokwi-hc-sr04' },
  { name: 'DHT22 Temperature/Humidity Sensor', tag: 'wokwi-dht22' },
  { name: 'Temperature Sensor (NTC)', tag: 'wokwi-ntc-temperature-sensor' },
  { name: 'PIR Motion Sensor', tag: 'wokwi-pir-sensor' },
  { name: 'Photoresistor', tag: 'wokwi-photoresistor' },
  { name: 'VOC Sensor', tag: 'wokwi-voc-sensor' },

  // Input Devices
  { name: 'Push Button', tag: 'wokwi-pushbutton' },
  { name: 'Slide Potentiometer', tag: 'wokwi-slide-potentiometer' },
  { name: 'Potentiometer', tag: 'wokwi-potentiometer' },
  { name: 'Keypad', tag: 'wokwi-membrane-keypad' },
  { name: 'Rotary Encoder', tag: 'wokwi-rotary-encoder' },

  // Output Devices
  { name: 'Buzzer', tag: 'wokwi-buzzer' },
  { name: 'Servo Motor', tag: 'wokwi-servo' },
  { name: 'DC Motor', tag: 'wokwi-dc-motor' },
  { name: 'Relay Module', tag: 'wokwi-relay-module' },

  // Other Components
  { name: 'Resistor', tag: 'wokwi-resistor' },
  { name: 'Capacitor', tag: 'wokwi-capacitor' },
  { name: 'Shift Register', tag: 'wokwi-74hc595' },
  { name: 'SD Card Module', tag: 'wokwi-sd-card' },
  { name: 'EEPROM', tag: 'wokwi-eeprom' },
  { name: 'Real-Time Clock (RTC)', tag: 'wokwi-ds3231' },

  // Custom and Miscellaneous
  { name: 'Breadboard', tag: 'wokwi-breadboard' },
  { name: 'Dip Switch', tag: 'wokwi-dip-switch' },
  { name: 'Logic Analyzer', tag: 'wokwi-logic-analyzer' }
];