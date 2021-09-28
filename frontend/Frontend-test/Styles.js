import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    root: {
        width: '100%',
    },
    table: {
        minWidth: 650,
        maxWidth: 1000,
    },
    container: {
        flex: 1,
        //   backgroundColor: '#fff',
        //    alignItems: 'center',
        //    justifyContent: 'center',
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        marginBottom: 10,
        width: 216,
        height: 36
    },
    lbuttons: {
        flexDirection: "row",
    },
    lbutton: {
        margin: 10
    },
    linput: {
        alignItems: "center",
    },
    linputbox: {
        margin: 5,
        backgroundColor: "#fff",
       borderRadius: 30,
     },
    chart: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5fcff"
    },
    ampelcontainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ampel:{
        alignItems: 'center',
        width: 80,
        height: 200,
        backgroundColor: "#303030",
        borderRadius: 10,
    },
    emptycircle:{
        position: "relative",
        backgroundColor:"#484848",
        height: 40,
        width: 40,
        borderRadius: 40,
        marginTop: 20

    },
    ampelred:{
        shadowColor: "#DC143C",
        backgroundColor: "#DC143C",
    },
    ampelorange:{
        shadowColor: "#FFA500",
        backgroundColor: "#FFA500",
    },
    ampelgreen:{
        shadowColor: "#00FF00",
        backgroundColor: "#00FF00",
    },
    shadoweffect:{
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,
        elevation: 13,
    }
});