
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableHighlight, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'

import SQLite from 'react-native-sqlite-storage'
import DeviceInfo from 'react-native-device-info';

import Prompt from 'react-native-input-prompt'
import moment from 'moment';
import md5 from 'md5';



class Home extends Component {

    static navigationOptions = {
        headerTitle: (
            <Image resizeMode="cover" source={require("./../../images/chilemat.jpg")} style={{ width: 200, height: 35 }} ></Image>
        ),
        headerStyle: { backgroundColor: '#008735' },
        headerTitleStyle: { color: 'white' }
    }



    constructor(props) {
        super(props);
        this._RecuperaServidorActual = this._RecuperaServidorActual.bind(this)
        this._ConfiguraServidor = this._ConfiguraServidor.bind(this)
        this._RegistraServidor = this._RegistraServidor.bind(this)
        this.state = {
            ServidorActual: "No se ha registrado servidor...",
            VisiblePrompt: false
        }
    }

    /* componentDidMount() {
        //console.log("CARGA DIDMOUNT SERVIDORES")
        this._RecuperaServidorActual()
    } */

    componentDidMount(){
        this.load()
        this.props.navigation.addListener('willFocus', this.load)
    }
    load = () => {
        console.log("-------------------------CARGA COMPONENT DID MOUNT--------------------------")
        this._RecuperaServidorActual()
    }

    async _RecuperaServidorActual() {
        var sa = await AsyncStorage.getItem("ServidorActual");
        //console.log("SERVIDOR ACTUAL RECUPERADO: ", sa)
        if (sa !== null) {
            this.setState({ ServidorActual: sa })
        }
    }

    async _RegistraServidor(EndPoint) {
        await AsyncStorage.setItem("ServidorActual", EndPoint)
        this.setState({ ServidorActual: EndPoint })

        var CrearHash = this.props.navigation.getParam("CrearHash", false)
        var Componente = this.props.navigation.getParam("Componente", "Details")

        console.log("------------------------hash y componente: ", CrearHash, Componente)

        if (CrearHash) {
            console.log("SE CREA EL NUEVO HASH")

            //Falta registrar en BD
            var objDispositivo = {
                Id: 0,
                Nombre: DeviceInfo.getSerialNumber(),
                MD5: md5(DeviceInfo.getSerialNumber()),
                Ano: parseInt(moment(new Date()).format('YYYY')),
                ListaConsumos: []
            }

            fetch(EndPoint + "/api/Dispositivo/CrearDispositivo/",
                {
                    method: 'post',
                    mode: 'cors',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(objDispositivo)
                })
                .then((response) => response.json())
                .then((response) => {

                    //if (response === true) {
                    console.log("-----------------hash registrado correctamente---------------")
                    console.log(response);
                    //}
                    //else {
                    //Alert.alert("ERROR", "Servidor no disponible")
                    //}
                }).catch((error) => {
                    console.log(error);
                    Alert.alert("ERROR", "ERROR AL COMUNICARSE CON EL WEBAPI, COMUNICARSE CON EL EQUIPO DE INFORMATICA")
                });

            await AsyncStorage.setItem("serial", DeviceInfo.getSerialNumber())
            await AsyncStorage.setItem("CafeteriaAbierta", "1")
        }
        else {
            console.log("NO SE CREA HASH")
        }

        console.log("REDIRIGE A DASHBOARD")
        this.props.navigation.navigate(Componente)
    }

    async _ConfiguraServidor(ip) {
        //BORRAR
        ip = ip + "/APICafeteria"

        var EndPoint = "http://" + ip;

        fetch(EndPoint + "/api/Default/ProbarConexion/", { method: 'post' })
            .then((response) => response.json())
            .then((response) => {
                //console.log(response);
                if (response === true) {
                    Alert.alert("Información", "Servidor registrado correctamente")
                    this._RegistraServidor(EndPoint)
                }
                else {
                    Alert.alert("ERROR", "Servidor no disponible")
                }
                this.setState({
                    VisiblePrompt: false
                })
            }).catch((error) => {
                console.log(error);
                this.setState({
                    VisiblePrompt: false
                })
                Alert.alert("ERROR", "Servidor no disponible")
            });



    }

    render() {
        return (
            <View style={estilos.containerImgBck}>
                {/* <View style={estilos.headerNavigator}>
                    <View style={estilos.containerNavigator}>
                        <TouchableHighlight style={estilos.botonNavigator} onPress={() => this.props.navigation.openDrawer()}>
                            <Image source={require("./../../images/androidmenu4.png")} />
                        </TouchableHighlight>
                    </View>
                </View> */}


                <View style={estilos.headerNavigator}>
                    <View style={estilos.containerHorizontalHeader}>
                        <View style={estilos.containerMd}>
                            <TouchableHighlight onPress={() => this.props.navigation.openDrawer()}>
                                <Image source={require("./../../images/androidmenu4.png")} />
                            </TouchableHighlight>

                            <Image style={{ marginLeft: 40 }} source={require("./../../images/chilematHeader.png")} />
                        </View>
                    </View>
                </View>





                <View style={estilos.containerVerde}>
                    <Text style={estilos.title}>Servidor Actual:</Text>
                    <TextInput
                        style={{ height: 50, borderColor: 'white', borderWidth: 1, width: 350, fontSize: 20, textAlign: "center" }}
                        onChangeText={(text) => this.setState({ ServidorActual: text })}
                        value={this.state.ServidorActual}
                        editable={false}
                    />
                    <TouchableHighlight onPress={() => { this.setState({ VisiblePrompt: true }) }} style={estilos.boton}>
                        <Text style={estilos.textoBoton}>Cambiar</Text>
                    </TouchableHighlight>
                    <Prompt
                        visible={this.state.VisiblePrompt}
                        title="Configurar Servidor"
                        placeholder="Ingrese dirección IP del servidor"
                        cancelText="Cancelar"
                        submitText="Aceptar"
                        titleStyle={{ fontSize: 20 }}
                        onCancel={() =>
                            this.setState({
                                VisiblePrompt: false
                            })
                        }
                        onSubmit={(text) =>
                            this._ConfiguraServidor(text)
                        }
                    />
                </View>
            </View>


        );
    }
}

const estilos = StyleSheet.create({

    //drawernavigator

    containerHorizontalHeader: {
        flex: 0,
        height: 48
    },
    containerMd: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },




    headerNavigator: {
        /* borderBottomColor: "white",
        borderWidth: 1, */
        backgroundColor: "#007935",
        flex: 0
    },
    containerNavigator: {
        marginLeft: 15,
        marginTop: 10
    },
    containerImgBck: {

    },
    botonNavigator: {
        width: 64,
        height: 64
    },

    //otro

    containerVerde: {
        flex: 1,
        alignItems: 'center'
    },
    boton: {
        width: 200,
        height: 60,
        backgroundColor: '#008735',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: "gray"
    },
    textoBoton: {
        fontSize: 18,
        color: "white"
    },
    title: {
        alignSelf: "center",
        fontSize: 25,
        marginTop: 50,
        fontWeight: "bold"
    }
});

export default Home;
