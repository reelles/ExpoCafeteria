import React, { Component } from 'react';
import { StyleSheet, Text, View, DeviceEventEmitter, Image, TouchableHighlight, ScrollView, Alert, BackHandler } from 'react-native';
import SunmiInnerPrinter from 'react-native-sunmi-inner-printer';
import SunmiInnerScanner, { SunmiScannerView } from 'react-native-sunmi-inner-scanner';
import moment from "moment";
import SQLite from 'react-native-sqlite-storage'
import AsyncStorage from '@react-native-community/async-storage'
import md5 from 'md5';
import DeviceInfo from 'react-native-device-info';
import HeaderNavigator from './HeaderNavigator';

const ServicioAgua = 1;
const ServicioCafe = 2;
const ServicioTe = 3;

const FichaAguaBase64 = ",/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABGAAD/4QOPaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ODkzZDViZjEtMDgyMS00NTE5LTg4NmItY2Y5Yzg0MWE1MGRiIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkMzMzk0MzJBOEVBMzExRTk5QkFEQ0U1MEZCOEQzMzdFIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY4QTExNUZBOEM5MTExRTk5QkFEQ0U1MEZCOEQzMzdFIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODkzZDViZjEtMDgyMS00NTE5LTg4NmItY2Y5Yzg0MWE1MGRiIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YTkyZGE1NmYtOGRiYS1kYTRhLWI2YzYtNTlkYjM1MGZmNmNkIi8+IDwv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";
const FichaCafeBase64 = ",/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABGAAD/4QOPaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ODkzZDViZjEtMDgyMS00NTE5LTg4NmItY2Y5Yzg0MWE1MGRiIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY4QTExNUY3OEM5MTExRTk5QkFEQ0U1MEZCOEQzMzdFIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY4QTExNUY2OEM5MTExRTk5QkFEQ0U1MEZCOEQzMzdFIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODkzZDViZjEtMDgyMS00NTE5LTg4NmItY2Y5Yzg0MWE1MGRiIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YTkyZGE1NmYtOGRiYS1kYTRhLWI2YzYtNTlkYjM1MGZmNmNkIi8+IDwv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";
const FichaTeBase64 = ",/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABGAAD/4QOPaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ODkzZDViZjEtMDgyMS00NTE5LTg4NmItY2Y5Yzg0MWE1MGRiIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkMzMzk0MzJFOEVBMzExRTk5QkFEQ0U1MEZCOEQzMzdFIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkMzMzk0MzJEOEVBMzExRTk5QkFEQ0U1MEZCOEQzMzdFIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ODkzZDViZjEtMDgyMS00NTE5LTg4NmItY2Y5Yzg0MWE1MGRiIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YTkyZGE1NmYtOGRiYS1kYTRhLWI2YzYtNTlkYjM1MGZmNmNkIi8+IDwv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";

moment.updateLocale('es', {
    months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
    monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
    weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
    weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
    weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
});

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this._ImprimeResumenParcial = this._ImprimeResumenParcial.bind(this)
        this._CerrarCafeteria = this._CerrarCafeteria.bind(this)
        this._DeleteSQliteDBAndPrint = this._DeleteSQliteDBAndPrint.bind(this)
        this._CargaEndpoint = this._CargaEndpoint.bind(this)
        this.state = {
            printer_status: "",
            ServidorActual: ""
        }
    }

    static navigationOptions = {
        title: 'Servicios',
        headerStyle: { backgroundColor: '#008735' },
        headerTitleStyle: { color: 'white' }
    }

    /* componentDidMount() {
        console.log("CARGA DIDMOUNT DASHBOARD Y VALIDA QUE HAYA SERVIDOR")
        this._CargaEndpoint();
    } */

    componentDidMount() {
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

    }

    componentWillMount() {
        console.log("CARGA WILLMOUNT DASHBOARD Y VALIDA QUE HAYA SERVIDOR")
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
        console.log("CARGA WILLUNMOUNT DASHBOARD Y VALIDA QUE HAYA SERVIDOR")
        this._printerStatusListener.remove();
    }

    async _openDefaultScanner(servicio) {
        console.log("ABRE SCANNER")

        var intServicioElegido = 0;
        switch (servicio) {
            case "agua":
                intServicioElegido = ServicioAgua
                break;
            case "cafe":
                intServicioElegido = ServicioCafe
                break;
            case "te":
                intServicioElegido = ServicioTe
                break;
        }

        let result = await SunmiInnerScanner.openScanner();

        console.log("barcode result", result)
        if (result.value.includes("002019") === false) {
            Alert.alert("ERROR", "El código de barras no corresponde al formato")
            return;
        }

        let db = SQLite.openDatabase({ name: 'cafeteriadb.db', createFromLocation: "~cafeteriadb.db" });
        db.transaction((tx) => {
            tx.executeSql('insert into Cafeteria (Usuario, Servicio, FechaHora) values (?,?,?)', [result.value, intServicioElegido, moment(new Date()).format("DD-MM-YYYY HH:mm:ss.SSS")], (tx, results) => {
                console.log("Insert realizado...", tx, results);
                this._printRecieve(results.insertId, servicio, result)
            });
        });
    }

    async _printRecieve(insertId, servicio, resultBarcode) {
        let ImageBase64 = "";
        switch (servicio) {
            case "agua":
                console.log("servicio aguita")
                console.log(resultBarcode)
                ImageBase64 = FichaAguaBase64
                break;
            case "cafe":
                console.log("servicio cafesito")
                ImageBase64 = FichaCafeBase64
                break;
            case "te":
                console.log("servicio tesito")
                ImageBase64 = FichaTeBase64
                break;
        }

        try {
            await SunmiInnerPrinter.setAlignment(1);
            await SunmiInnerPrinter.setFontSize(30);
            await SunmiInnerPrinter.printOriginalText("Cafetería Expo 2019\n");
            await SunmiInnerPrinter.setFontSize(15);
            await SunmiInnerPrinter.printOriginalText("Ticket Nro: " + insertId + "\n\n");
            await SunmiInnerPrinter.printBitmap(ImageBase64, 300, 300);
            await SunmiInnerPrinter.printOriginalText("\n\n");
            await SunmiInnerPrinter.setFontSize(15);
            await SunmiInnerPrinter.printOriginalText("Fecha: " + moment(new Date()).format('Do [de] MMMM, h:mm:ss a'));
            await SunmiInnerPrinter.printOriginalText("\n\n\n\n");
        } catch (e) {
            console.log(e)
            alert("print error." + e.message);
        }
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

    async _LimpiaServidor() {
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

                <View style={estilos.container}>
                    <TouchableHighlight onPress={() => this._openDefaultScanner("agua")} style={estilos.botonServicio}>
                        <Image source={require("./../../images/aguanvo.jpg")} />
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this._openDefaultScanner("cafe")} style={estilos.botonServicio}>
                        <Image source={require("./../../images/cafenvo.jpg")} />
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this._openDefaultScanner("te")} style={estilos.botonServicio}>
                        <Image source={require("./../../images/tenvo.jpg")} />
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}


const estilos = StyleSheet.create({

    containerHorizontalHeader: {
        flex: 0,
        height: 48
    },
    containerMd: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },

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
    headerNavigator: {
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