/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableHighlight, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'

import { Icon, Header, Left, Right } from 'native-base'

import SQLite from 'react-native-sqlite-storage'
import DeviceInfo from 'react-native-device-info';

class Home extends Component {

  /* static navigationOptions = {
   drawerIcon: (tintColor) => (
     <Icon name="home"  style={{ fontSize: 24 , color: tintColor  }}  />
   )
 } */

  static navigationOptions = {
    headerTitle: (
      <Image resizeMode="cover" source={require("./../../images/chilemat.jpg")} style={{ width: 200, height: 35 }} ></Image>
    ),
    headerStyle: { backgroundColor: '#008735' },
    headerTitleStyle: { color: 'white' }
  }

  constructor(props) {
    super(props);
  }

  async onLogin() {
    var CafeteriaAbierta = await AsyncStorage.getItem("CafeteriaAbierta");

    //Si la cafeteria está abierta
    if (CafeteriaAbierta === "1") {
      console.log("--------CAFETERIA SE ENCUENTRA ABIERTA----------")
      this.props.navigation.navigate('Details')
    }
    //Si la cafetería está cerrada
    else {
      var serial = await AsyncStorage.getItem("serial");
      //Si esta registrado el hash se abre la cafeteria
      if (serial !== null && serial !== undefined) {
        console.log("--------CAFETERIA CERRADA, SE ABRE CAFETERIA PARA NUEVO DÍA ----------")
        await AsyncStorage.setItem("CafeteriaAbierta", "1");
        this.props.navigation.navigate('Details')
      }
      //Si no está registrado el hash redirige a servidores, una vez q se registre el servidor se registra el hash y se redirige al dashboard
      else {
        console.log("--------CAFETERIA CERRADA, SE ABRE SERVIDORES PARA CREAR HASH Y ABRIR CAFETERÍA ----------")
        this.props.navigation.navigate("Servidores", {
          CrearHash: true,
          Componente: "Details"
        })
      }
    }
  }


  render() {
    return (

      <ImageBackground style={estilos.containerImgBck} source={require("./../../images/cafee.jpeg")}>
        <View style={estilos.container}>
          <Text style={estilos.title}>App Cafetería Expo 2019</Text>
          <TouchableHighlight onPress={() => { this.onLogin() }} style={estilos.boton}>
            <Text style={estilos.textoBoton}>INGRESAR</Text>
          </TouchableHighlight>
        </View>
      </ImageBackground>


    );
  }
}

const estilos = StyleSheet.create({
  containerImgBck: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerNavigator: {
    marginLeft: 15,
    marginTop: 10
  },
  containerVerde: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#008735"
  },
  boton: {
    width: 300,
    height: 60,
    backgroundColor: '#008735',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1
  },
  botonServicio: {
    width: 250,
    height: 150,
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white"
  },
  textoBoton: {
    color: 'white',
    fontSize: 24,
    fontWeight: "bold"
  },
  title: {
    alignSelf: "center",
    fontSize: 25,
    marginTop: 50,
    color: 'white',
    fontWeight: "bold"
  }
});

export default Home;
