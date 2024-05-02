import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.teslatps.app',
  appName: 'Tesla Tps',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
