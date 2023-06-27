import React, { Component } from 'react';
import { StyleSheet, Text, View, DeviceEventEmitter, Image, TouchableHighlight, ScrollView, Alert, BackHandler } from 'react-native';
import SunmiInnerPrinter from 'react-native-sunmi-inner-printer';
import moment from "moment";
import SQLite from 'react-native-sqlite-storage'
import AsyncStorage from '@react-native-community/async-storage'
import md5 from 'md5';
import DeviceInfo from 'react-native-device-info';
import HeaderNavigator from './HeaderNavigator';

moment.updateLocale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
});

export default class Reporte extends Component {

    constructor(props) {
        super(props);
        this._ImprimeResumenParcial = this._ImprimeResumenParcial.bind(this)
        this._CerrarCafeteria = this._CerrarCafeteria.bind(this)
        this._DeleteSQliteDBAndPrint = this._DeleteSQliteDBAndPrint.bind(this)
        this._CargaEndpoint = this._CargaEndpoint.bind(this)
        this.state = {
            printer_status: "",
            ServidorActual: "",
            CantAgua: "",
            CantCafe: "",
            CantTe: ""
        }
    }

    static navigationOptions = {
        title: 'Reporte',
        headerStyle: { backgroundColor: '#008735' },
        headerTitleStyle: { color: 'white' }
    }

    /* componentDidMount() {
        console.log("CARGA DIDMOUNT REPORTE")
        this._CargaEndpoint();
    } */

    componentDidMount(){
        this.load()
        this.props.navigation.addListener('willFocus', this.load)
    }
    load = () => {
        console.log("-------------------------CARGA COMPONENT DID MOUNT--------------------------")
        this._CargaEndpoint();
    }

    async _CargaEndpoint() {
        var srv = await AsyncStorage.getItem("ServidorActual")
        if (srv !== null) {
            this.setState({ ServidorActual: srv })
        }
        else {
            Alert.alert("Información", "Debe configurar servidor")
            this.props.navigation.navigate("Servidores", {
                CrearHash: false,
                Componente: "Details"
            })
        }

        //Carga datos
        try {
            let db = SQLite.openDatabase({ name: 'cafeteriadb.db', createFromLocation: "~cafeteriadb.db" });
            db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Cafeteria', [], (tx, results) => {
                    console.log("Query completed, state informe parcial");

                    var arr = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        let row = results.rows.item(i);
                        arr.push(row)
                    }

                    var CantAgua = arr.filter(function (ele) {
                        return ele.Servicio === 1;
                    }).length;
                    var CantCafe = arr.filter(function (ele) {
                        return ele.Servicio === 2;
                    }).length;
                    var CantTe = arr.filter(function (ele) {
                        return ele.Servicio === 3;
                    }).length;

                    this.setState({ 
                        CantAgua: CantAgua, 
                        CantCafe: CantCafe, 
                        CantTe: CantTe 
                    })

                    console.log(arr)
                    console.log(CantAgua, CantCafe,CantTe)

                });
            });
        } catch (e) {
            console.log(e)
            alert("print error." + e.message);
        }

    }

    componentWillMount() {
        try {
            this._printerStatusListener = DeviceEventEmitter.addListener('PrinterStatus', action => {
                switch (action) {
                    case SunmiInnerPrinter.Constants.NORMAL_ACTION:
                        // your code
                        this.setState({
                            printer_status: "printer normal"
                        });
                        break;
                    case SunmiInnerPrinter.Constants.OUT_OF_PAPER_ACTION:
                        // your code
                        this.setState({
                            printer_status: "printer out out page"
                        });
                        break;
                    case SunmiInnerPrinter.Constants.COVER_OPEN_ACTION:
                        // your code
                        this.setState({
                            printer_status: "printer cover open"
                        });
                        break;
                    default:
                        // your code
                        this.setState({
                            printer_status: "printer status:" + action
                        });
                }
            });
        } catch (e) {
            this.setState({
                printer_status: "printer error:" + e.message
            });
        };
    }

    componentWillUnmount() {
        this._printerStatusListener.remove();
    }

    async _CalculaResumen(tipo) {
        try {
            let db = SQLite.openDatabase({ name: 'cafeteriadb.db', createFromLocation: "~cafeteriadb.db" });
            db.transaction((tx) => {
                tx.executeSql('SELECT * FROM Cafeteria', [], (tx, results) => {
                    console.log("Query completed, state informe parcial");

                    var arr = [];
                    for (let i = 0; i < results.rows.length; i++) {
                        let row = results.rows.item(i);
                        arr.push(row)
                    }
                    if (tipo === "parcial") {
                        this._ImprimeResumenParcial(arr)
                    } else if (tipo === "total") {
                        this._CerrarCafeteria(arr)
                    }
                });
            });
        } catch (e) {
            console.log(e)
            alert("print error." + e.message);
        }
    }

    async _ImprimeResumenParcial(arrInformeParcial) {

        console.log("INFORME PARCIAL:", arrInformeParcial)
        var CantAgua = arrInformeParcial.filter(function (ele) {
            return ele.Servicio === 1;
        }).length;
        var CantCafe = arrInformeParcial.filter(function (ele) {
            return ele.Servicio === 2;
        }).length;
        var CantTe = arrInformeParcial.filter(function (ele) {
            return ele.Servicio === 3;
        }).length;

        await SunmiInnerPrinter.setAlignment(1);
        await SunmiInnerPrinter.setFontSize(30);
        await SunmiInnerPrinter.printOriginalText("Reporte Parcial Cafetería\n\n");

        await SunmiInnerPrinter.setFontSize(20);
        await SunmiInnerPrinter.printOriginalText("AGUA: " + CantAgua + "\n");
        await SunmiInnerPrinter.setFontSize(20);
        await SunmiInnerPrinter.printOriginalText("CAFE: " + CantCafe + "\n");
        await SunmiInnerPrinter.setFontSize(20);
        await SunmiInnerPrinter.printOriginalText("TE  : " + CantTe + "\n\n");
        await SunmiInnerPrinter.setFontSize(20);
        await SunmiInnerPrinter.printOriginalText("Total: " + (CantAgua + CantCafe + CantTe));

        await SunmiInnerPrinter.printOriginalText("\n\n");
        await SunmiInnerPrinter.setFontSize(15);
        await SunmiInnerPrinter.printOriginalText("Fecha: " + moment(new Date()).format('Do [de] MMMM, h:mm:ss a'));
        await SunmiInnerPrinter.printOriginalText("\n\n\n\n");
    }

    async _CerrarCafeteria(arrInforme) {

        var Endpoint = await AsyncStorage.getItem("ServidorActual");

        console.log("CIERRE DE CAFETERÍA:", arrInforme)

        var arrConsumos = [];
        for (var i = 0; i < arrInforme.length; i++) {
            arrConsumos.push({
                Id: 1,
                IdProducto: arrInforme[i].Servicio,
                IdCodigoBarra: arrInforme[i].Usuario,
                FechaHora: arrInforme[i].FechaHora
            })
        }

        var objConsumo = {
            Id: 1,
            Nombre: DeviceInfo.getSerialNumber(),
            MD5: md5(DeviceInfo.getSerialNumber()),
            Ano: parseInt(moment(new Date()).format('YYYY')),
            ListaConsumos: arrConsumos
        }

        console.log("objConsumo", objConsumo)

        fetch(Endpoint + '/api/Consumo/IngresarConsumos/', {
            method: 'POST',
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(objConsumo)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("responseJson", responseJson)
                if (responseJson === true) {
                    this._DeleteSQliteDBAndPrint(arrInforme)
                    //alert("CAFETERIA CERRADA CORRECTAMENTE")
                    Alert.alert(
                        'Información',
                        'Cafetería cerrada correctamente.',
                        [
                            { text: 'Aceptar', onPress: () => BackHandler.exitApp() }
                        ],
                        { cancelable: false },
                    );
                } else {
                    alert("RESPUESTA ERRÓNEA DEL API, CONTACTAR AL EQUIPO DE INFORMPATICA")
                }
            })
            .catch((error) => {
                console.error(error);
            });

        console.log("------------------------ENVIADO AL SERVIDOR-----------------------------")
    }

    //elimina registro sqlite, hash dispositivo
    async _DeleteSQliteDBAndPrint(arrInforme) {

        var CantAgua = arrInforme.filter(function (ele) {
            return ele.Servicio === 1;
        }).length;
        var CantCafe = arrInforme.filter(function (ele) {
            return ele.Servicio === 2;
        }).length;
        var CantTe = arrInforme.filter(function (ele) {
            return ele.Servicio === 3;
        }).length;

        let db = SQLite.openDatabase({ name: 'cafeteriadb.db', createFromLocation: "~cafeteriadb.db" });
        if (arrInforme.length > 0) {
            db.executeSql("delete from Cafeteria");
        }

        await AsyncStorage.setItem("CafeteriaAbierta", "0")

        await SunmiInnerPrinter.setAlignment(1);
        await SunmiInnerPrinter.setFontSize(30);
        await SunmiInnerPrinter.printOriginalText("Cierre de Cafetería\n\n");
        await SunmiInnerPrinter.setFontSize(20);
        await SunmiInnerPrinter.printOriginalText("AGUA: " + CantAgua + "\n");
        await SunmiInnerPrinter.setFontSize(20);
        await SunmiInnerPrinter.printOriginalText("CAFE: " + CantCafe + "\n");
        await SunmiInnerPrinter.setFontSize(20);
        await SunmiInnerPrinter.printOriginalText("TE  : " + CantTe + "\n\n");
        await SunmiInnerPrinter.setFontSize(20);
        await SunmiInnerPrinter.printOriginalText("Total: " + (CantAgua + CantCafe + CantTe));
        await SunmiInnerPrinter.printOriginalText("\n\n");
        await SunmiInnerPrinter.setFontSize(15);
        await SunmiInnerPrinter.printOriginalText("Fecha: " + moment(new Date()).format('Do [de] MMMM, h:mm:ss a'));
        await SunmiInnerPrinter.printOriginalText("\n\n\n\n");
    }

    /* async _LimpiaServidor() {
        await AsyncStorage.removeItem("ServidorActual")
        Alert.alert("Servidor Removido")
    }

    async _LimpiaSerial() {
        await AsyncStorage.removeItem("serial")
        Alert.alert("Serial Removida")
    }

    async _LimpiaCajaAbierta() {
        await AsyncStorage.removeItem("CafeteriaAbierta")
        Alert.alert("Cafeteria Removida")
    } */

    render() {
        return (
            <View style={estilos.containerImgBck}>
                {/* <HeaderNavigator /> */}

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




                <View style={estilos.containerHorizontal}>
                    <View style={estilos.containerMd}>
                        <Image source={require("./../../images/aguanvo.jpg")} />
                        <Text style={estilos.textoCantidadAgua}>{this.state.CantAgua + " un."}</Text>
                    </View>
                </View>
                <View style={estilos.containerHorizontal}>
                    <View style={estilos.containerMd}>
                        <Image source={require("./../../images/cafenvo.jpg")} />
                        <Text style={estilos.textoCantidadCafe}>{this.state.CantCafe + " un."}</Text>
                    </View>
                </View>
                <View style={estilos.containerHorizontal}>
                    <View style={estilos.containerMd}>
                        <Image source={require("./../../images/tenvo.jpg")} />
                        <Text style={estilos.textoCantidadTe}>{this.state.CantTe + " un."}</Text>
                    </View>
                </View>
                <View style={estilos.containerHorizontal}>
                    <View style={estilos.containerMd}>
                        <TouchableHighlight onPress={() => { this._CalculaResumen("parcial") }} style={estilos.botonImprimir}>
                            <Text style={estilos.textoBotonReporte}>Imprimir Resumen</Text>
                        </TouchableHighlight>
                        <TouchableHighlight onPress={() => { this._CalculaResumen("total") }} style={estilos.botonCerrar}>
                            <Text style={estilos.textoBotonReporte}>Cerrar Cafetería</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>

        );
    }
}


const estilos = StyleSheet.create({

    containerHorizontal: {
        flex: 0,
        height: 130
    },
    textoCantidadAgua: {
        fontSize: 48,
        fontWeight: "bold",
        marginTop: 40,
        color: "lightblue",
        marginLeft: 40
    },
    textoCantidadCafe: {
        fontSize: 48,
        fontWeight: "bold",
        marginTop: 40,
        color: "brown",
        marginLeft: 40
    },
    textoCantidadTe: {
        fontSize: 48,
        fontWeight: "bold",
        marginTop: 40,
        color: "darkorange",
        marginLeft: 40
    },
    containerMd: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    botonImprimir: {
        width: 150,
        height: 60,
        backgroundColor: "green",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: "gray",
        marginLeft: 20
    },
    botonCerrar: {
        width: 150,
        height: 60,
        backgroundColor: "orange",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: "gray",
        marginLeft: 20
    },
    textoBotonReporte: {
        fontSize: 18,
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
    },




    //drawernavigator

    containerHorizontalHeader: {
        flex: 0,
        height: 48
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
    containerVerde: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "#008735"
    }
});