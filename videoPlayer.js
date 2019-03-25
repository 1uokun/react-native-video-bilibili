import React, { Component } from 'react';
// import Video from 'react-native-video';
import {
    Animated,
    View,
    Dimensions,
    StyleSheet,
    Image,
    TouchableWithoutFeedback
} from 'react-native'
import AnimatedComponent from './lib/AnimatedComponent'
import TouchView from './lib/TouchView'
import SeekBar from "./lib/Seekbar";

// context
const MenusContext = React.createContext({});

// timer
let centerMenusTimer;

export default class VideoPlayer extends Component {
    static defaultProps = {
        volume:             100,
        renderTopMenus:           null,
        renderBottomMenus:        null,
    };

    constructor(props){
        super(props);
        this.state={
            //page props
            visible:true,
            orientation:'PORTRAIT',
            isTouched:false,

            //video props
            volume:this.props.volume,
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

    /******* right touchMove event *******/
    handleUpAndDownMoveInRight=(offset)=>{
        let volume = this.state.volume;
        volume+=offset;
        if( volume<0){
            this.setState({volume:0})
        }else if(volume>100){
            this.setState({volume:100})
        }else {
            this.setState({volume:volume})
        }
    };

    /******* left touchMove event *******/
    handleUpAndDownMoveInLeft=(offset)=>{
        //need your pull request to complete control the root light
    };

    toggleMenus=()=>{
        let visible = this.state.visible;
        this.setState({visible:!visible})
    };


    render(){
        return (
            <MenusContext.Provider value={{state:this.state,props:this.props}}>
                <TouchView style={[styles[this.state.orientation],styles.container]}
                           handleSingleTouch={this.toggleMenus}
                           handleUpAndDownMoveInRight={this.handleUpAndDownMoveInRight}
                >

                    {/******* top menus *******/}
                    <View style={{flex:1,justifyContent:'flex-start'}}>
                        <TopMenus/>
                    </View>

                    {/******* center menus *******/}
                    <CenterMenus />

                    {/******* bottom menus *******/}
                    <View style={{flex:1,justifyContent:'flex-end'}}>
                        <BottomMenus/>
                    </View>
                </TouchView>
            </MenusContext.Provider>
        )
    }
}

class TopMenus extends AnimatedComponent {
    render(){
        return (
            <MenusContext.Consumer>
                {({state,props})=>
                    <Animated.View onStartShouldSetResponder={()=>{return true}} style={[this.state.topMenusTranslate,state.visible?this.Appear:this.Disappear,{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center'}]}>
                        {typeof props.renderTopMenus === 'function'?
                            <React.Fragment>
                                {props.renderTopMenus()}
                            </React.Fragment>:
                            <React.Fragment>
                                <TouchableWithoutFeedback>
                                    <Image source={require('./assets/icon.png')} />
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback>
                                    <Image source={require('./assets/icon.png')} />
                                </TouchableWithoutFeedback>
                            </React.Fragment>
                        }
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )
    }
}
class BottomMenus extends AnimatedComponent {
    render(){
        return (
            <MenusContext.Consumer>
                {({state,props})=>
                    <Animated.View onStartShouldSetResponder={()=>{return true}} style={[this.state.bottomMenusTranslate,state.visible?this.Appear:this.Disappear,{flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center'}]}>
                        {typeof props.renderBottomMenus === 'function'?
                            <React.Fragment>
                                {props.renderBottomMenus()}
                            </React.Fragment>:
                            <React.Fragment>
                                <TouchableWithoutFeedback>
                                    <Image source={require('./assets/icon.png')} style={{width:15,marginHorizontal:10}} resizeMode={'contain'}/>
                                </TouchableWithoutFeedback>
                                {/******* seek bar *******/}
                                <SeekBar horizontal>
                                    <View style={{width:10,height:10,borderRadius:5,backgroundColor:'red'}}/>
                                </SeekBar>
                            </React.Fragment>
                        }
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )
    }
}

class CenterMenus extends AnimatedComponent {
    state={
        visible:false
    };

    //overload
    animate(){}

    async componentWillReceiveProps(nextProps,nextContext){
        if(this.context.state.volume!==nextContext.state.volume){
            await clearTimeout(centerMenusTimer);
            centerMenusTimer = setTimeout(()=>{
                this.setState({visible:false})
            },1500);
            !this.state.visible&&this.setState({visible:true})
        }
    }

    render(){
        return (
            <MenusContext.Consumer>
                {({state,props}) =>
                    <Animated.View style={[this.state.visible?this.Disappear:this.Appear,styles.modal]}>
                        <View style={[styles.modal, {opacity: 0.5, position: 'absolute', backgroundColor: '#000000'}]}/>
                        <Image source={require('./assets/icon.png')} style={{width: 20, marginHorizontal: 10}}
                               resizeMode={'contain'}/>
                        <View style={styles.progress}>
                            <View style={[styles.readProgress, {width: state.volume+'%'}]}/>
                        </View>
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )
    }
}

TopMenus.contextType = MenusContext;
BottomMenus.contextType = MenusContext;
CenterMenus.contextType = MenusContext;

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#000000',
        justifyContent:'center'
    },
    PORTRAIT:{
        width:'100%',
        height:'30%',
        minHeight: 220,
    },
    LANDSCAPE:{
        width:'100%',
        height:'100%',
    },
    modal:{
        alignSelf:'center',
        position:'absolute',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        width:120,
        height:40,
        borderRadius:5,
        backgroundColor:'transparent',
        // opacity:0
    },
    progress:{
        flex:1,
        marginRight:10,
        height:2,
        backgroundColor:'white'
    },
    readProgress:{
        position:'absolute',
        height:2,
        backgroundColor:'pink'
    }
});
