import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { DrawerNavigator } from 'react-navigation'
import Home from './Home'
import Dashboard from './Dashboard'

export default DrawerNavigator(
    {
        Home: {screen: Home},
        Details: {screen: Dashboard}
    },
    {
        drawerWidth: 250
    }
)