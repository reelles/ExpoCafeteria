import React, { Component } from 'react';
import { StyleSheet, View, Image, TouchableHighlight } from 'react-native';

export default class HeaderNavigator extends Component {
    render() {
        return (
            <View style={estilos.headerNavigator}>
                <View style={estilos.containerNavigator}>
                    <TouchableHighlight style={estilos.botonNavigator} onPress={() => this.props.navigation.openDrawer()}>
                        <Image source={require("./../../images/androidmenu4.png")} />
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const estilos = StyleSheet.create({

    containerImgs: {
        maxWidth: 60,
        width: 30,
        backgroundColor: "red",
        textAlign: "left"
    },
    containerImgsCenter: {
        maxWidth: 60,
        width: 30,
        backgroundColor: "red",
        textAlign: "right"
    },

    container: {
        flex: 1,
        alignItems: 'center',
    },
    containerVerde: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#008735"
    },
    headerNavigator: {
        /* borderBottomColor: "white",
        borderWidth: 1, */
        backgroundColor: "#008735",
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
        width: 200,
        height: 140,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "white"
    },
    textoBoton: {
        color: 'white'
    },
    title: {
        fontSize: 25,
        marginTop: 50,
        color: 'white'
    }
});