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
import TouchComponent from './lib/touch'

const MenusContext = React.createContext({});

let timer;
export default class VideoPlayer extends Component {

    constructor(props){
        super(props);
        this.animatedValue = new Animated.Value(0);
        this.state={
            visible:true,
            orientation:'PORTRAIT',
            left:20
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
                <TouchComponent style={[styles[this.state.orientation],styles.container]}>

                    {/******* top menus *******/}
                    <TopMenus/>

                    {/******* bottom menus *******/}
                    <BottomMenus />

                    {/******* seek timer *******/}
                    <View
                        onStartShouldSetResponder={(e)=>{
                            console.log('parent',e.nativeEvent.locationX,e)
                            // this.setState({left:e.nativeEvent.locationX})
                            return true
                        }}
                        onResponderMove={(e)=>{
                            console.log('move',e.nativeEvent)
                            this.setState({left:e.nativeEvent.locationX})
                        }}
                        style={{width:'100%',height:20,justifyContent:'center',backgroundColor:'green'}}
                    >
                        <View
                            onStartShouldSetResponder={(e)=>{
                                console.log('点到我了',e.nativeEvent.locationX,e)
                                return false
                            }}
                            onMoveShouldSetResponder={(e)=>{
                                return false
                            }}
                            style={{position:'absolute',left:this.state.left,height:20,width:20,borderRadius:10,backgroundColor:'#fff'}}
                        />

                    </View>
                </TouchComponent>
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