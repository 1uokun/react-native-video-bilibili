import React, { Component } from 'react';
import Video from 'react-native-video';
import {
    View,
    Animated,
    Dimensions,
    StyleSheet,
    Image,
    TouchableWithoutFeedback
} from 'react-native'
import AinmateComponent from './lib/animate'

const MenusContext = React.createContext({});

let timer;
export default class VideoPlayer extends Component {

    constructor(props){
        super(props);
        this.state={
            visible:true,
            orientation:'PORTRAIT'
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

    }

    toggleMenus=async ()=>{
        let visible = this.state.visible;
        await this.setState({visible:!visible});
        if(this.state.visible){
            timer = setTimeout(()=>{
                this.setState({visible:false})
            },2000);
        }else {
            clearTimeout(timer)
        }
    };



    render(){
        return (
            <MenusContext.Provider value={this.state}>
                <View style={[styles[this.state.orientation],styles.container]}
                      onStartShouldSetResponder={this.toggleMenus}
                >
                    {/******* top menus *******/}
                    <TopMenus/>

                    {/******* bottom menus *******/}
                    <BottomMenus />
                </View>
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
                    <Animated.View style={[visible?this.translateDown:this.translateUp,visible?this.Appear:this.Disappear,{flexDirection: 'row',justifyContent: 'space-between'}]}>
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
