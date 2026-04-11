/**
 * Mock data for development when Gemini API key is not configured.
 */

const getMockParseResult = (rawText) => {
  // Generate a contextual mock based on common keywords
  const text = rawText.toLowerCase();

  let title = 'Smart IoT Project';
  const bom = [];
  const skills = [];

  if (text.includes('robot') || text.includes('motor')) {
    title = 'Autonomous Robot Build';
    bom.push(
      { hardware_name: 'Arduino Mega 2560', quantity: 1, notes: 'Main controller' },
      { hardware_name: 'L298N Motor Driver', quantity: 2, notes: 'For DC motors' },
      { hardware_name: 'DC Gear Motor', quantity: 4, notes: '12V, 200RPM' },
      { hardware_name: 'Ultrasonic Sensor HC-SR04', quantity: 3, notes: 'Obstacle detection' },
      { hardware_name: 'LiPo Battery 11.1V', quantity: 1, notes: '2200mAh' },
      { hardware_name: 'Chassis Kit', quantity: 1, notes: 'Aluminum frame' },
      { hardware_name: 'Jumper Wires', quantity: 40, notes: 'Male-to-male and male-to-female' },
      { hardware_name: 'Breadboard', quantity: 1, notes: '830-point' },
    );
    skills.push('Embedded C/C++', 'Soldering', 'PCB Design', 'Motor Control', 'Sensor Integration', 'CAD/3D Printing');
  } else if (text.includes('weather') || text.includes('sensor') || text.includes('temperature')) {
    title = 'Weather Monitoring Station';
    bom.push(
      { hardware_name: 'Raspberry Pi 4', quantity: 1, notes: '4GB RAM recommended' },
      { hardware_name: 'BME280 Sensor', quantity: 1, notes: 'Temperature, humidity, pressure' },
      { hardware_name: 'OLED Display 0.96"', quantity: 1, notes: 'I2C, SSD1306' },
      { hardware_name: 'SD Card 32GB', quantity: 1, notes: 'For data logging' },
      { hardware_name: 'Weatherproof Enclosure', quantity: 1, notes: 'IP65 rated' },
      { hardware_name: 'Micro USB Power Supply', quantity: 1, notes: '5V 3A' },
    );
    skills.push('Python', 'Linux/Raspberry Pi', 'I2C Communication', 'Data Visualization', 'API Development');
  } else if (text.includes('drone') || text.includes('fly') || text.includes('quadcopter')) {
    title = 'Custom FPV Drone Build';
    bom.push(
      { hardware_name: 'Flight Controller (F4)', quantity: 1, notes: 'Betaflight compatible' },
      { hardware_name: 'Brushless Motor 2306', quantity: 4, notes: '2400KV' },
      { hardware_name: 'ESC 4-in-1 45A', quantity: 1, notes: 'BLHeli_S' },
      { hardware_name: 'FPV Camera', quantity: 1, notes: '1200TVL CMOS' },
      { hardware_name: 'Video Transmitter', quantity: 1, notes: '5.8GHz 600mW' },
      { hardware_name: 'LiPo Battery 4S', quantity: 2, notes: '1500mAh 100C' },
      { hardware_name: 'Carbon Fiber Frame 5"', quantity: 1, notes: '' },
      { hardware_name: 'Propellers 5"', quantity: 8, notes: '5x4.5x3 tri-blade' },
    );
    skills.push('Soldering', 'PID Tuning', 'RF Systems', 'Firmware Flashing', 'LiPo Safety', 'FPV Systems');
  } else {
    // Generic IoT project
    title = 'Smart IoT Device';
    bom.push(
      { hardware_name: 'ESP32 DevKit', quantity: 1, notes: 'Wi-Fi + Bluetooth' },
      { hardware_name: 'Assorted Sensors Kit', quantity: 1, notes: 'Temperature, light, motion' },
      { hardware_name: 'OLED Display 1.3"', quantity: 1, notes: 'I2C interface' },
      { hardware_name: 'Breadboard', quantity: 1, notes: '830-point' },
      { hardware_name: 'Jumper Wires', quantity: 30, notes: 'Assorted' },
      { hardware_name: 'USB-C Cable', quantity: 1, notes: 'For programming' },
      { hardware_name: '3.7V LiPo Battery', quantity: 1, notes: '1000mAh' },
    );
    skills.push('Arduino/ESP32 Programming', 'Basic Electronics', 'Wi-Fi Networking', 'MQTT Protocol', 'Cloud Integration');
  }

  return { title, extrapolated_BOM: bom, required_skills: skills };
};

const getMockHardwareMatches = () => [
  {
    _id: 'mock_hw_1',
    name: 'Raspberry Pi 4 Model B',
    description: '4GB RAM, running Raspbian Buster',
    category: 'compute',
    availability_status: 'available',
    owner_id: { name: 'Alice Chen', email: 'alice@example.com', avatar_url: '' },
    score: 0.94,
  },
  {
    _id: 'mock_hw_2',
    name: 'Arduino Mega 2560',
    description: 'With CNC shield attached',
    category: 'compute',
    availability_status: 'available',
    owner_id: { name: 'Bob Kumar', email: 'bob@example.com', avatar_url: '' },
    score: 0.87,
  },
  {
    _id: 'mock_hw_3',
    name: 'Oscilloscope Rigol DS1054Z',
    description: '50MHz 4-channel',
    category: 'sensor',
    availability_status: 'available',
    owner_id: { name: 'Carol Joshi', email: 'carol@example.com', avatar_url: '' },
    score: 0.72,
  },
];

const getMockMentorMatches = () => [
  {
    _id: 'mock_mentor_1',
    name: 'Dr. Priya Sharma',
    skills: ['Embedded Systems', 'PCB Design', 'RTOS'],
    bio: '10+ years in embedded systems design. Professor at IIT.',
    availability: true,
    score: 0.91,
  },
  {
    _id: 'mock_mentor_2',
    name: 'Rahul Gupta',
    skills: ['Python', 'Machine Learning', 'Computer Vision'],
    bio: 'ML engineer specializing in edge AI deployment.',
    availability: true,
    score: 0.85,
  },
  {
    _id: 'mock_mentor_3',
    name: 'Sneha Patel',
    skills: ['CAD', '3D Printing', 'Mechanical Design'],
    bio: 'Product designer with maker-space experience.',
    availability: true,
    score: 0.78,
  },
];

module.exports = { getMockParseResult, getMockHardwareMatches, getMockMentorMatches };
