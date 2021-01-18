import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container:{
        backgroundColor:'transparent',
        overflow:'hidden',
        justifyContent:'center',
        alignItems:'center'
    },
    touchView:{
        position:'absolute',
        width:'100%',
        height:'100%',
        backgroundColor:'transparent'
    },

    // center menus
    centerMenusContainer:{
        position:'absolute',
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center'
    },
    modal:{
        alignSelf:'center',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        width:120,
        height:40,
        borderRadius:5,
        backgroundColor:'transparent',
    },
    progress:{
        flex:1,
        marginRight:10,
        // height:2,
        backgroundColor:'white'
    },
    readProgress:{
        position:'absolute',
        height:2,
        backgroundColor:'pink'
    },

    // top menus
    topMenusContainer:{
        flex:1,
        justifyContent: 'flex-start'
    },

    //bottom menus
    bottomMenusContainer:{
        flex:1,
        justifyContent: 'flex-end'
    },

    //seek time modal
    seekTimeModal:{
        backgroundColor:'black',
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:5
    }
});
