import React, { Component } from 'react';
// import Video from 'react-native-video';
import {
    View,
    Animated,
    Dimensions,
    StyleSheet,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback, Easing
} from 'react-native'
import AinmateComponent from './lib/animate'
import TouchView from './lib/TouchView'
import SeekBar from "./lib/Seekbar";

const MenusContext = React.createContext({});

let timer;
export default class VideoPlayer extends Component {

    constructor(props){
        super(props);
        this.animatedValue = new Animated.Value(0);
        this.state={
            visible:true,
            orientation:'PORTRAIT',
            isTouched:false
        };
    }

    componentDidMount() {
        {/******* listen orientation *******/}
        Dimensions.addEventListener('change',(e)=>{
            const {width,height} = e.window;
            if(width>height){
                this.setState({orientation:'LANDSCAPE'})
            }else {
                this.setState({orientation:'PORTRAIT'})
            }
        });

        this.animate()
    }

    toggleMenus=async ()=>{
        let visible = this.state.visible;
        await this.setState({visible:!visible});
        // if(this.state.visible){
        //     timer = setTimeout(()=>{
        //         this.setState({visible:false})
        //     },2000);
        // }else {
        //     clearTimeout(timer)
        // }
    };

    onResponderMove=(event)=>{
        console.log('滑动不放手',event)
    };

    onResponderRelease=(event)=>{
        console.log('触摸操作结束时触发',event)
    };

    animate() {
        this.animatedValue.setValue(0);
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 300,
                easing: Easing.linear
            }
        ).start()
    }

    render(){
        return (
            <MenusContext.Provider value={this.state}>
                <TouchView style={[styles[this.state.orientation],styles.container]}>

                    {/******* top menus *******/}
                    <TopMenus/>

                    {/******* bottom menus *******/}
                    <BottomMenus />

                    {/******* seek bar *******/}
                    <SeekBar horizontal>
                        <View style={{width:20,height:20,borderRadius:10,backgroundColor:'red'}}/>
                    </SeekBar>
                </TouchView>
            </MenusContext.Provider>
        )
    }
}

class TopMenus extends AinmateComponent {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <MenusContext.Consumer>
                {({visible})=>
                    <Animated.View style={[visible?this.translateDown:this.translateUp,visible?this.Appear:this.Disappear,{flexDirection: 'row',justifyContent: 'space-between',backgroundColor: 'red'}]}>
                        <TouchableWithoutFeedback>
                            <Image source={require('./assets/icon.png')} />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback>
                            <Image source={require('./assets/icon.png')} />
                        </TouchableWithoutFeedback>
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )
    }
}
class BottomMenus extends AinmateComponent {
    render(){
        return (
            <MenusContext.Consumer>
                {({visible})=>
                    <Animated.View style={[visible?this.translateUp:this.translateDown,visible?this.Appear:this.Disappear,{flexDirection: 'row',justifyContent: 'space-between'}]}>
                        <TouchableWithoutFeedback>
                            <Image source={require('./assets/icon.png')} />
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback>
                            <Image source={require('./assets/icon.png')} />
                        </TouchableWithoutFeedback>
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )
    }
}

TopMenus.contextType = MenusContext;
BottomMenus.contextType = MenusContext;

const styles = StyleSheet.create({
    container:{
        // width:200,
        flex:1,
        marginBottom:200,
        // margin:100,
        backgroundColor: '#000000',
        justifyContent:'space-between'
    },
    PORTRAIT:{
        width:'100%',
        height:'30%',
        minHeight: 220,
    },
    LANDSCAPE:{
        width:'100%',
        height:'100%',
    }
});
