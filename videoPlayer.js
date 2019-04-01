import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    Animated,
    Platform,
    ProgressBarAndroid,
    ProgressViewIOS,
    Slider,
    TouchableOpacity
} from 'react-native'
import ResponderView from './lib/ResponderView'
import AnimatedComponent from './lib/AnimatedComponent'
import {formatTime} from './lib/util'
import Video from 'react-native-video'

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
            sliderAutoEnable:false,
            seekTime:0,
            _currentTime_copy:0,

            //video props
            volume:this.props.volume,
            paused:this.props.paused,
            duration:0,
            playableDuration:0,
            currentTime:this.props.currentTime,
        }
    }

    _handleSingleTouch=()=>{
        let visible = this.state.visible;
        this.setState({visible:!visible})
    };

    _handleDoubleTouch=()=>{
        let paused = this.state.paused;
        this.setState({paused:!paused})
    };

    _handleLeftAndRightMove=async (offset,percent)=>{
        await this.setState({sliderAutoEnable:false});
        let seekTime = this.state.seekTime;
        seekTime=seekTime*(1+percent);
        this.setState({seekTime:seekTime})
    };

    _handleLeftAndRightMoveComplete=async ()=>{
        let seekTime = this.state.seekTime;
        await this.setState({sliderAutoEnable:true,currentTime:seekTime});
    };

    _handleUpAndDownMoveInLeft=(offset,percent)=>{
        console.log('light control',offset,percent)
    };

    _handleUpAndDownMoveInRight=(offset,percent)=>{
        let volume = this.state.volume;
        volume+=offset;
        if(volume<0){
            this.setState({volume:1});//don't ask me why
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
            <MenusContext.Provider value={{
                state:this.state,
                props:{
                    ...this.props,
                    onCurrentTimeProgress:this.onCurrentTimeProgress,
                    onSlidingComplete:this.onSlidingComplete
                },
            }}>
            <View ref={'container'}
                  style={styles.container}
            >
                <Video
                    ref={'player'}
                    source={{uri: "https://media.w3.org/2010/05/sintel/trailer.mp4"}}
                    // source={{uri: "http://www.w3school.com.cn/example/html5/mov_bbb.mp4"}}
                    style={{width:'100%',height:'100%',position:'absolute'}}
                    volume={this.state.volume}
                    paused={this.state.paused}
                    onLoadStart={ this.onLoadStart }
                    onLoad={  this.onLoad }
                    onProgress={  this.onProgress }
                    onError={  (e)=>{console.log('onError',e)} }
                    onEnd={  (e)=>{console.log('onEnd',e)} }
                />
                <ResponderView
                    handleSingleTouch={this._handleSingleTouch}
                    handleDoubleTouch={this._handleDoubleTouch}
                    handleLeftAndRightMove={this._handleLeftAndRightMove}
                    handleLeftAndRightMoveComplete={this._handleLeftAndRightMoveComplete}
                    handleUpAndDownMoveInLeft={this._handleUpAndDownMoveInLeft}
                    handleUpAndDownMoveInRight={this._handleUpAndDownMoveInRight}
                >
                    {/********** center menus **********/}

                        <CenterMenus volume={this.state.volume}/>

                    {/********** top menus **********/}

                        {/*<TopMenus visible={this.state.visible}/>*/}

                    {/********** bottom menus **********/}
                    <View style={[styles.bottomMenusContainer,{opacity:1}]}>
                        <SeekTime seekTime={this.state.seekTime}/>
                        <BottomMenus visible={this.state.visible}/>
                    </View>

                </ResponderView>
            </View>
            </MenusContext.Provider>
        )
    }

    onLoadStart=(e)=>{
    };

    onLoad=async (e)=>{
        await this.setState({
            duration:e.duration,
        })
    };

    onProgress=(e)=>{
        this.state.sliderAutoEnable&&this.setState({currentTime:e.currentTime,seekTime:e.currentTime});
        this.setState({playableDuration:e.playableDuration})
    };

    onCurrentTimeProgress=(value)=>{
        this.setState({sliderAutoEnable:false,seekTime:value});
    };

    onSlidingComplete=(value)=>{
        this.setState({sliderAutoEnable:true,currentTime:value,seekTime:value});
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
                                    {Platform.OS==='android'?
                                        <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={state.volume/100} color={'pink'} style={{height:2}}/>
                                        :
                                        <ProgressViewIOS trackTintColor="#FFFFFF" progressTintColor="pink" progress={state.volume/100} style={{height:2}}/>
                                    }
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
    constructor(props){
        super(props);
        this.state={
            loadable:false
        };
    }

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.setState({loadable:true});
        this.animate(2000)
    }

    render(){
        return (
            <MenusContext.Consumer>
                {({state, props}) =>
                    this.state.loadable && <Animated.View style={[styles.topMenusContainer,this.Appear,this.Disappear]}>
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
        };
    }

    render(){
        return (
            <MenusContext.Consumer>
                {({state, props}) =>
                    <React.Fragment>
                        <View>
                            {typeof props.renderBottomMenus === 'function' ?

                                props.renderBottomMenus(state, props):

                                <View style={{height:30,backgroundColor:'transparent',flexDirection:'row',alignItems:'center'}}>
                                    <Image source={require('./assets/icon.png')} style={{width:15}} resizeMode={'contain'} />

                                    {/********** seek bar **********/}
                                    <View style={{flex:1,justifyContent:'center',backgroundColor:'transparent'}}>

                                        {/********** playableDuration **********/}
                                        <Slider style={{width:'100%',position:'absolute'}}
                                                value={state.playableDuration}
                                                maximumValue={state.duration}
                                                minimumTrackTintColor={'gray'}
                                                maximumTrackTintColor={'transparent'}
                                                thumbTintColor={'transparent'}
                                                thumbImage={require('./assets/icon_empty.png')}
                                        />

                                        {/********** currentTime **********/}
                                        <Slider style={{flex:1}}
                                                // step={1}
                                                value={state.sliderAutoEnable?state.currentTime:state.seekTime}
                                                maximumValue={state.duration}
                                                minimumTrackTintColor={'pink'}
                                                maximumTrackTintColor={'gray'}
                                                thumbTintColor={'pink'}
                                                thumbStyle={{backgroundColor:'red'}}
                                                thumbImage={require('./assets/icon_bilibili.png')}
                                                onSlidingComplete={props.onSlidingComplete}
                                                onValueChange={props.onCurrentTimeProgress}
                                        />
                                    </View>

                                    <View style={{flexDirection:'row',alignItems:'center',}}>
                                        <Text style={{color:'white'}}>{formatTime(state.currentTime)}</Text>
                                        <Text style={{color:'white'}}>/</Text>
                                        <Text style={{color:'white'}}>{formatTime(state.duration)}</Text>
                                    </View>
                                </View>
                            }
                        </View>
                        {Platform.OS==='android'?
                            <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={state.currentTime/state.duration} color={'pink'} style={{height:3}}/>
                            :
                            <ProgressViewIOS trackTintColor="#FFFFFF" progressTintColor="pink" progress={state.currentTime/state.duration} style={{height:3}}/>
                        }
                    </React.Fragment>
                }
            </MenusContext.Consumer>
        )
    }
}


class SeekTime extends AnimatedComponent {
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
                    this.state.loadable && <Animated.View style={[styles.seekTimeModal,this.Appear,this.Disappear]}>
                        <Text style={{color:'#000'}}>{formatTime(state.seekTime)}</Text>
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )

    }
}

// TopMenus.contextType = MenusContext;
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
        justifyContent: 'flex-end',
    },

    //seek time modal
    seekTimeModal:{
        width:200,
        height:30,
        backgroundColor:'red'
    }
});

export default VideoPlayer
