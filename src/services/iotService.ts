export async function toggleDevice(deviceName: string, state: boolean): Promise<void> {
  // Mock API call to IoT service
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% success rate
        console.log(`Device ${deviceName} turned ${state ? 'on' : 'off'}`);
        resolve();
      } else {
        reject(new Error('Failed to toggle device'));
      }
    }, 500);
  });
}
