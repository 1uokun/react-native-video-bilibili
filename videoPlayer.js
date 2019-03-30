import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    Animated,
    Easing,
    TouchableOpacity
} from 'react-native'
import ResponderView from './lib/ResponderView'
import AnimatedComponent from './lib/AnimatedComponent'

// context
const MenusContext = React.createContext({});

class VideoPlayer extends React.PureComponent {
    static defaultProps = {
        renderCenterMenus:null,
        renderTopMenus:null,
        renderBottomMenus:null,
        volume:100,
        paused:false,
        currentTime:0,
    };

    constructor(props){
        super(props);
        this.state={
            visible:false,

            //video props
            volume:this.props.volume,
            paused:this.props.paused,
            currentTime:this.props.currentTime,
        }
    }

    _handleSingleTouch=()=>{
        let visible = this.state.visible;
        this.setState({visible:!visible})
    };

    _handleDoubleTouch=()=>{
        console.log('双击')
    };

    _handleLeftAndRightMove=(offset,percent)=>{
        console.log('seek timer',offset,percent)
    };

    _handleUpAndDownMoveInLeft=(offset,percent)=>{
        console.log('light control',offset,percent)
    };

    _handleUpAndDownMoveInRight=(offset,percent)=>{
        let volume = this.state.volume;
        volume+=offset;
        if(volume<0){
            this.setState({volume:1});//dont ask me why
            this.setState({volume:0})
        }else if(volume>100){
            this.setState({volume:99});
            this.setState({volume:100})
        }else {
            this.setState({volume:volume})
        }
    };

    render(){
        return (
            <MenusContext.Provider value={{state:this.state,props:this.props}}>
            <View ref={'container'}
                  style={styles.container}
            >
                <ResponderView
                    handleSingleTouch={this._handleSingleTouch}
                    handleDoubleTouch={this._handleDoubleTouch}
                    handleLeftAndRightMove={this._handleLeftAndRightMove}
                    handleUpAndDownMoveInLeft={this._handleUpAndDownMoveInLeft}
                    handleUpAndDownMoveInRight={this._handleUpAndDownMoveInRight}
                >
                    {/********** center menus **********/}

                        <CenterMenus volume={this.state.volume}/>

                    {/********** top menus **********/}

                        {/*<TopMenus />*/}

                    {/********** bottom menus **********/}

                        <BottomMenus visible={this.state.visible}/>

                </ResponderView>
            </View>
            </MenusContext.Provider>
        )
    }
}

class CenterMenus extends AnimatedComponent {
    constructor(props){
        super(props);
        this.state={
            loadable:false
        };
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.setState({loadable:true});
        this.animate()
    }

    render(){
        return (
            <MenusContext.Consumer>
                {({state, props}) =>
                    this.state.loadable && <Animated.View
                        style={[styles.centerMenusContainer,this.Appear,this.Disappear]}>
                        {typeof props.renderCenterMenus === 'function' ?

                            props.renderCenterMenus(state, props) :

                            <View style={[styles.modal]}>
                                <View style={[styles.modal, {
                                    opacity: 0.5,
                                    position: 'absolute',
                                    backgroundColor: '#000000'
                                }]}/>
                                <Image source={require('./assets/icon.png')} style={{width: 20, marginHorizontal: 10}}
                                       resizeMode={'contain'}/>
                                <View style={styles.progress}>
                                    <View style={[styles.readProgress, {width: state.volume + '%'}]}/>
                                </View>
                            </View>
                        }
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )
    }
}

class TopMenus extends AnimatedComponent {
    componentWillUpdate(nextProps, nextState, nextContext) {
        this.animate()
    }

    render(){
        return (
            <MenusContext.Consumer>
                {({state, props}) =>
                    <Animated.View style={[styles.topMenusContainer,this.Appear,this.Disappear]}>
                        {typeof props.renderTopMenus === 'function' ?

                            props.renderTopMenus(state, props):

                            <View style={{height:30,backgroundColor:'red'}}>

                            </View>
                        }
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )
    }
}

class BottomMenus extends AnimatedComponent {
    constructor(props){
        super(props);
        this.state={
            loadable:false
        };
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.setState({loadable:true});
        this.animate()
    }

    render(){
        return (
            <MenusContext.Consumer>
                {({state, props}) =>
                    this.state.loadable && <Animated.View style={[styles.bottomMenusContainer,this.Appear,this.Disappear]}>
                        {typeof props.renderBottomMenus === 'function' ?

                            props.renderBottomMenus(state, props):

                            <View style={{height:30,backgroundColor:'yellow'}}>

                            </View>
                        }
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )
    }
}

TopMenus.contextType = MenusContext;
// BottomMenus.contextType = MenusContext;
// CenterMenus.contextType = MenusContext;

const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:'33%',
        minHeight: 200,
        backgroundColor:'#000'
    },
    // center menus
    centerMenusContainer:{
        position:'absolute',
        width:'100%',
        height:'100%',
        justifyContent:'center'
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
        height:2,
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
        justifyContent: 'flex-end',
        opacity:0
    },
});

export default VideoPlayer
