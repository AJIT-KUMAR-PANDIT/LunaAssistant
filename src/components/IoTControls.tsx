import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Switch, Text } from 'react-native-paper';

interface DeviceState {
  name: string;
  isOn: boolean;
  location: string;
}

export default function IoTControls() {
  const [devices, setDevices] = useState<DeviceState[]>([
    { name: "Dad's Room Light", isOn: false, location: "Dad's Room" },
    { name: "Living Room Light", isOn: false, location: "Living Room" },
    { name: "Kitchen Light", isOn: false, location: "Kitchen" },
  ]);

  const handleToggle = async (index: number) => {
    const newDevices = [...devices];
    newDevices[index].isOn = !newDevices[index].isOn;
    setDevices(newDevices);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IoT Controls</Text>
      {devices.map((device, index) => (
        <Card key={device.name} style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={styles.location}>{device.location}</Text>
            </View>
            <Switch
              value={device.isOn}
              onValueChange={() => handleToggle(index)}
              color="#4CAF50"
            />
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  card: {
    marginVertical: 5,
    backgroundColor: '#333',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceName: {
    color: '#fff',
    fontSize: 16,
  },
  location: {
    color: '#888',
    fontSize: 12,
  },
});