import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import MachinesScreen from './src/screens/MachinesScreen';
import MachineDetailScreen from './src/screens/MachineDetailScreen';
import MachineFormScreen from './src/screens/MachineFormScreen';
import MaintenanceScreen from './src/screens/MaintenanceScreen';
import MaintenanceDetailScreen from './src/screens/MaintenanceDetailScreen';
import AddMaintenanceScreen from './src/screens/AddMaintenanceScreen';
import JadwalScreen from './src/screens/JadwalScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const icons = {
  Home: ['home', 'home-outline'],
  Machines: ['hardware-chip', 'hardware-chip-outline'],
  Maintenance: ['construct', 'construct-outline'],
  Jadwal: ['calendar', 'calendar-outline'],
  Profile: ['person-circle', 'person-circle-outline'],
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { height: 62, paddingBottom: 8, paddingTop: 6 },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={icons[route.name][focused ? 0 : 1]} size={size} color={color} />
        ),
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'FixLog' }} />
      <Tab.Screen name="Machines" component={MachinesScreen} options={{ title: 'Daftar Mesin' }} />
      <Tab.Screen name="Maintenance" component={MaintenanceScreen} options={{ title: 'Pemeliharaan' }} />
      <Tab.Screen name="Jadwal" component={JadwalScreen} options={{ title: 'Jadwal Perawatan' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile & About' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },
          }}>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="MachineDetail" component={MachineDetailScreen} options={{ title: 'Detail Mesin' }} />
          <Stack.Screen
            name="MachineForm"
            component={MachineFormScreen}
            options={({ route }) => ({ title: route.params?.machine ? 'Edit Mesin' : 'Tambah Mesin' })}
          />
          <Stack.Screen name="MaintenanceDetail" component={MaintenanceDetailScreen} options={{ title: 'Detail Pemeliharaan' }} />
          <Stack.Screen name="AddMaintenance" component={AddMaintenanceScreen} options={{ title: 'Tambah Pemeliharaan' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}