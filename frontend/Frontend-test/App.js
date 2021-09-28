import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme, NavigationContainer, useTheme
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from "react";
import { StyleSheet, useColorScheme } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AlarmScreen from "./AlarmScreen.js";
import CreateAlarmScreen from "./CreateAlarmScreen.js";
import EventsScreen from "./EventsScreen.js";
import HelpScreen from "./HelpScreen.js";
// import HomeScreen from "./HomeScreen.js";
import LoginScreen from "./LoginScreen.js";
import MonitoringScreen from "./MonitoringScreen.js";
import SettingsScreen from "./SettingsScreen.js";
import styles from './Styles.js'
import { Provider as PaperProvider, DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme } from 'react-native-paper';
import { PreferencesContext } from "./PreferencesContext.js";

import backendWrapper from "./BackendWrapper.js";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const CombinedDefaultTheme = {
  ...PaperDefaultTheme,
  ...NavigationDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    ...NavigationDefaultTheme.colors,
    text: "black" //Otherwise it seems to be some weird gray, for.. some reason?
  },
};
const CombinedDarkTheme = {
  ...PaperDarkTheme,
  ...NavigationDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors,
  },
};

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Monitoring"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Monitoring') {
            iconName = focused ? 'information-outline' : 'information'; 
          } else if (route.name === 'Events') {
            iconName = focused ? 'chart-line' : 'chart-areaspline-variant';
          } else if (route.name === 'Alarm') {
            iconName = focused ? 'alarm-light-outline' : 'alarm-light';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'cog-outline' : 'cog';
          }
          
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        }
      })}
      tabBarOptions={{
        tabStyle: {
          justifyContent: 'center'
        },
        showIcon: false
      }}>
      <Tab.Screen name="Monitoring" component={MonitoringScreen} />
      <Tab.Screen name="Events" component={EventsScreen} />
      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      <Tab.Screen name="Alarm" component={AlarmScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>);
}

export default function App() {

  const scheme = useColorScheme();
  const [isThemeDark, setIsThemeDark] = React.useState(scheme === 'dark');
  const [operationMode, setOperationMode] = React.useState("Normal");

  let theme = isThemeDark ? CombinedDarkTheme : CombinedDefaultTheme;

  // Setup function you can call everywhere...
  // const toggleTheme = React.useCallback(() => {
  //   return setIsThemeDark(!isThemeDark);
  // }, [isThemeDark]);

  const preferences = React.useMemo(
    () => ({
      //toggleTheme,
      isThemeDark,
      setIsThemeDark,
      operationMode,
      setOperationMode,
    }),
    [/*toggleTheme,*/ isThemeDark, setIsThemeDark, operationMode, setOperationMode,]
  );

  return (
    <PreferencesContext.Provider value={preferences}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Tabs" options={{ headerShown: false }} component={Tabs} />
            <Stack.Screen name="Help" component={HelpScreen} />
            <Stack.Screen name="CreateAlarm" options={{ title: "Create Alarm" }} component={CreateAlarmScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </PreferencesContext.Provider>
  );
}

