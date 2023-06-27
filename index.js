/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

/* 
import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TouchableHighlight,
    BackHandler,
    Dimensions,
    Navigator
} from 'react-native';

import SunmiInnerScanner, {SunmiScannerView} from 'react-native-sunmi-inner-scanner';
import scannerPrevew from './scannerPrevew';

var {height, width} = Dimensions.get('window');
export default class example extends Component {
    constructor(props){
        super(props);
        this.state={
            result:""
        }
    }

    async _openDefaultScanner(){
        let result = await SunmiInnerScanner.openScanner();
        this.setState({result: JSON.stringify(result)});

    }

    async _openScannerWithOptions(){
        let options={
            showSetting:true,
            showAlbum:true,
            paySound:true,
            payVibrate:true,// V1 not support
        }
        let result = await SunmiInnerScanner.openScannerWithOptions(options);
        this.setState({result: JSON.stringify(result)}
            ,()=>{
                console.log(this.state.result);
            });

    }

    render() {
        return (
            <View style={styles.container}>
                <View><Text>Scan Result 1:{this.state.result}</Text></View>
                <View style={{flex: 1,justifyContent: 'center',alignItems:'center'}}>
                    <TouchableOpacity style={styles.buttonstyle} onPress={() =>this._openDefaultScanner() }>
                        <Text style={{fontSize:16}}>Default Scanner</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonstyle} onPress={() =>this._openScannerWithOptions() }>
                        <Text style={{fontSize:16}}>Default Scanner With Options</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonstyle} onPress={() =>{this.props.navigator.push({
                        component:scannerPrevew,
                        type:'Normal'
                        })}}>
                        <Text style={{fontSize:16}}>Customer Scanner Preview</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:"#fff",
        borderStyle:'solid',
        borderWidth:1,
        borderColor:'#ff0000'
    },
    textview: {
        height: 45,
        backgroundColor:'#696969',
        justifyContent: 'center',
        alignItems:'center'
    },
    textstyle: {
        fontSize: 18,
        color: '#fff',
    },
    buttonstyle:{
        width:width-64,
        height:100,
        marginLeft:32,
        marginRight:32,
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:"#8bc8ef",
        borderRadius:10,
        marginBottom:50
    },
    userSetting:{
        position:'absolute',
        top:12,
        right:10,
        height:20,
        width:20
    },
    userSettingImg:{
        height:20,
        width:20
    },
    scanner:{
        height:400,
        width:400,
        borderStyle:'solid',
        borderWidth:1,
        borderColor:'#ff0000'
    }
}); */