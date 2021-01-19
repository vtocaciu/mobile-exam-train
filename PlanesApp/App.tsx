import { StatusBar } from 'expo-status-bar';
import React, { LegacyRef, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Registration } from './Screens/Registration';
import { Manage } from './Screens/Manage';
import Menu, { MenuDivider, MenuItem, MenuProps } from "react-native-material-menu";
import { Button } from 'react-native-elements';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Registration"  screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
           

            return <Ionicons name='settings' size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'red',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Registration" component={Registration}/>
        <Tab.Screen name="Manage" component={Manage} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
