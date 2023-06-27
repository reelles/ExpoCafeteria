import React, { Component } from 'react'
import { View, SafeAreaView, Dimensions, ScrollView, Image } from 'react-native'
import { createAppContainer, createStackNavigator, createDrawerNavigator, DrawerItems } from 'react-navigation'
import Home from './src/components/Home'
import Dashboard from './src/components/Dashboard'
import Servidores from './src/components/Servidores'
import Reporte from './src/components/Reporte'
import HeaderNavigator from './src/components/HeaderNavigator';


/* const RootStack = createStackNavigator(
  {
    Home: Home,
    Details: Dashboard,
    Servidores: Servidores,
    Reporte: Reporte
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}  */

 export default class App extends React.Component {
  render() {
    return (
      <Apps />
    )
  }
} 

const CustomDrawerComponent = (props) => (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={{ height: 150, backgroundColor: 'green', alignItems: 'center', justifyContent: 'center' }} >
      <Image source={require('./images/chilematmini3.jpg')} style={{ height: 120, width: 120, borderRadius: 60 }} />
    </View>
    <ScrollView>
      <DrawerItems {...props} />
    </ScrollView>
  </SafeAreaView>
)

const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: Home,
    Details: Dashboard,
    Servidores: Servidores,
    Reporte: Reporte
  },
  {
    contentComponent: CustomDrawerComponent,
    drawerWidth: 250,
    contentOptions: {
      activeTintColor: 'orange'
    }
  } 
)

const Apps = createAppContainer(AppDrawerNavigator) 