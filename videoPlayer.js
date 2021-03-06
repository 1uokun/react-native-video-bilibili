import React from 'react'
import {
    View,
    Text,
    Image,
    Animated,
    Platform,
    ProgressBarAndroid,
    ProgressViewIOS,
    Slider,
    TouchableOpacity,
    Button
} from 'react-native'
import ResponderView from './lib/ResponderView'
import AnimatedComponent from './lib/AnimatedComponent'
import {formatTime,deepMergeStyle} from './lib/util'
import Video from 'react-native-video'
import {styles as VideoPlayerStyles} from "./lib/style";

const MenusContext = React.createContext({});

class VideoPlayer extends React.PureComponent {
    static defaultProps = {
        onLoad:function(){},
        onError:function(){},
        onBuffer:function(){},
        onProgress:function(){},
        renderCenterMenus:null,
        renderTopMenus:null,
        renderBottomMenus:null,
        renderSeekTime:null,
        renderLoading:null,
        setFullScreen:function(){},
        setNavigator:function(){},
        setSetting:function(){},
        volume:1,
        paused:false,
        currentTime:0,
    };

    constructor(props){
        super(props);
        this.state={
            orientation:'portrait',//landscape

            pointerEvents:'none',

            //shouldComponentUpdate
            sliderAutoEnable:true,

            //video props
            muted:this.props.muted,
            volume:this.props.volume,
            paused:this.props.paused,
            duration:0,
            playableDuration:0,
            currentTime:this.props.currentTime,
            currentTime_copy:0,
            isBuffering:true,
            error:undefined
        };
    }










    /******************** responder event *******************/
    _handleSingleTouch=()=>{
        this.toggleMenusComponent()
    };

    _handleDoubleTouch=()=>{
        this.setPaused()
    };

    _handleLeftAndRightMove=async (offset)=>{

        //show component when touch move
        this.showSeekTimerComponent();
        this.showMenusComponent();

        //update currentTime
        let duration = this.state.duration;
        let currentTime = this.state.currentTime;

        currentTime+=offset;
        if(currentTime<0){
            await this.setState({currentTime:0});
        }else if(currentTime>duration){
            await this.setState({currentTime:duration});
        }else {
            await this.setState({currentTime:currentTime});
        }

        this.onCurrentTimeProgress(Math.floor(this.state.currentTime))

    };

    _handleLeftAndRightMoveComplete=async ()=>{
        await this.onSlidingComplete(this.state.currentTime)
    };

    _handleUpAndDownMoveInLeft=(offset)=>{
        console.log('light control',offset)
    };

    _handleUpAndDownMoveInRight=(offset)=>{
        let volume = this.state.volume;
        volume+=offset/100;
        if(volume<=0){
            this.setState({volume:0,muted:true})
        }else if(volume>1){
            this.setState({volume:1,muted:false});
        }else {
            this.setState({volume:volume,muted:false})
        }
    };





    /******************** custom event *******************/
    showSeekTimerComponent=()=>{
        this.refs._seekTime.show();
    };
    showMenusComponent=()=>{
        this.refs._topMenus.show();
        this.refs._bottomMenus.show();
    };
    toggleMenusComponent=()=>{
        this.refs._topMenus.toggle();
        this.refs._bottomMenus.toggle();
    };


    render(){
        const {pointerEvents,isBuffering,paused} = this.state;
        const {children,controls} = this.props;
        return (
            <MenusContext.Provider value={{
                state:this.state,
                props:{
                    ...this.props,
                    onCurrentTimeProgress:this.onCurrentTimeProgress,
                    onSlidingComplete:this.onSlidingComplete,
                    setPaused:this.setPaused
                },
                styles:deepMergeStyle(VideoPlayerStyles,this.props.styles)
            }}>
            <View style={[VideoPlayerStyles.container,this.props.containerStyle]}>
                <Video
                    resizeMode={"contain"}
                    hideShutterView={false}
                    {...this.props}
                    children={undefined}
                    ref={c => {
                        this._root = c
                    }}
                    muted={this.state.muted}
                    volume={this.state.volume}
                    paused={this.state.paused}
                    onLoad={  this.onLoad }
                    onError={ this.onError }
                    onBuffer={ this.onBuffer }
                    onProgress={  this.onProgress }
                />
                {!controls&&<ResponderView
                    style={VideoPlayerStyles.touchView}
                    pointerEvents={pointerEvents}
                    handleSingleTouch={this._handleSingleTouch}
                    handleDoubleTouch={this._handleDoubleTouch}
                    handleLeftAndRightMove={this._handleLeftAndRightMove}
                    handleLeftAndRightMoveComplete={this._handleLeftAndRightMoveComplete}
                    handleUpAndDownMoveInLeft={this._handleUpAndDownMoveInLeft}
                    handleUpAndDownMoveInRight={this._handleUpAndDownMoveInRight}
                >
                    {/********** loading **********/}

                        {isBuffering&&!paused&&<Loading />}

                    {/********** center menus **********/}

                        <CenterMenus volume={this.state.volume}/>

                    {/********** top menus **********/}

                        <TopMenus paused={this.state.paused} ref={'_topMenus'} />

                    {/********** bottom menus **********/}
                    <View style={VideoPlayerStyles.bottomMenusContainer}>
                        <SeekTime ref={'_seekTime'} />
                        <BottomMenus paused={this.state.paused} ref={'_bottomMenus'} />
                    </View>

                    {/********** custom view **********/}
                    {!!children&&<MenusContext.Consumer>
                        {children}
                    </MenusContext.Consumer>}

                </ResponderView>}
            </View>
            </MenusContext.Provider>
        )
    }

    /******************** video event *******************/
    onLoad=(e)=>{
        this.setState({
            duration:e.duration,
            orientation:e.naturalSize&&e.naturalSize.orientation
        },()=>{
            this.state.pointerEvents!=='auto'&&this.setState({pointerEvents:'auto'});
        });
        if(this.props.onLoad){
            this.props.onLoad(e)
        }
    };

    onError=(e)=>{
        this.setState({error:e});
        if(this.props.onError){
            this.props.onError(e)
        }
    };

    onBuffer=(e)=>{
        this.setState({isBuffering:e.isBuffering,error:undefined});
        if(this.props.onBuffer){
            this.props.onBuffer(e)
        }
    };

    onProgress=(e)=>{
        this.state.sliderAutoEnable&&this.setState({currentTime:e.currentTime});
        this.setState({playableDuration:e.playableDuration,isBuffering:false,error:undefined});
        if(this.props.onProgress){
            this.props.onProgress(e)
        }
    };

    setPaused=()=>{
        let paused = this.state.paused;
        this.setState({paused:!paused})
    };

    onCurrentTimeProgress=(value)=>{
        this.showMenusComponent();
        this.setState({sliderAutoEnable:false,currentTime_copy:value})
    };

    onSlidingComplete=async (value)=>{
        await this.setState({currentTime:value});

        //video seek appointed time
        this._root.seek(value);

        setTimeout(()=>{
            this.setState({sliderAutoEnable:true})
        },0)
    }
}

/**
 * CenterMenus
 * @props renderCenterMenus
 * **/
class CenterMenus extends AnimatedComponent {

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.show()
    }

    render(){
        return (
            <MenusContext.Consumer>
                {({state, props, styles}) =>
                    <Animated.View
                        style={[styles.centerMenusContainer,{opacity:this.opacityAnimate}]}>
                        {typeof props.renderCenterMenus === 'function' ?

                            props.renderCenterMenus(state, props) :

                            <View style={[styles.modal]}>
                                <View style={[styles.modal, {
                                    opacity: 0.5,
                                    position: 'absolute',
                                    backgroundColor: '#000000'
                                }]}/>
                                <Image source={state.muted?require('./assets/volume-off-outline.png'):require('./assets/volume-up-outline.png')} style={{width: 20, marginHorizontal: 10}}
                                       resizeMode={'contain'}/>
                                <View style={styles.progress}>
                                    {Platform.OS==='android'?
                                        <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={state.volume} color={'pink'} style={{height:2}}/>
                                        :
                                        <ProgressViewIOS trackTintColor="#FFFFFF" progressTintColor="pink" progress={state.volume} style={{height:2}}/>
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

/**
 * TopMenus
 * @props renderTopMenus
 * **/
class TopMenus extends AnimatedComponent {

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.show()
    }

    render(){
        return (
            <MenusContext.Consumer>
                {({state, props, styles}) =>
                    <Animated.View style={[this.slideDown,styles.topMenusContainer]}>
                        {typeof props.renderTopMenus === 'function' ?

                            props.renderTopMenus(state, props):

                            <View style={{height:50,marginTop:-30,backgroundColor:'transparent',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                    <TouchableOpacity style={{paddingHorizontal:20}} onPress={props.setNavigator}>
                                        <Image source={require('./assets/back.png')} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{paddingHorizontal:20}} onPress={props.setSetting}>
                                        <Image source={require('./assets/dots.png')} />
                                    </TouchableOpacity>
                                <View style={{position:'absolute',width:'100%',height:'100%',backgroundColor:'black',opacity:0.5,zIndex:-1}}/>
                            </View>
                        }
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )
    }
}

/**
 * BottomMenus
 * @props renderBottomMenus
 * **/
class BottomMenus extends AnimatedComponent {

    componentWillUpdate(nextProps, nextState, nextContext) {
        this.show()
    }

    render(){
        return (
            <MenusContext.Consumer>
                {({state, props, styles}) =>
                    <React.Fragment>
                        <Animated.View style={this.slideUp}>
                            {typeof props.renderBottomMenus === 'function' ?

                                props.renderBottomMenus(state, props):

                                <View style={{height:50,backgroundColor:'transparent',flexDirection:'row',alignItems:'center'}}>

                                    <TouchableOpacity style={{paddingHorizontal:20}} onPress={props.setPaused}>
                                        <Image source={state.paused?require('./assets/play.png'):require('./assets/pause.png')} />
                                    </TouchableOpacity>

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
                                                value={Math.floor(state.currentTime)}
                                                maximumValue={state.duration}
                                                minimumTrackTintColor={'pink'}
                                                maximumTrackTintColor={'white'}
                                                thumbTintColor={'pink'}
                                                thumbStyle={{backgroundColor:'red'}}
                                                thumbImage={require('./assets/icon_bilibili.png')}
                                                onSlidingComplete={props.onSlidingComplete}
                                                onValueChange={props.onCurrentTimeProgress}
                                        />
                                    </View>

                                    <View style={{flexDirection:'row',alignItems:'center',}}>
                                        <Text style={{color:'white'}}>{formatTime(state.sliderAutoEnable?state.currentTime:state.currentTime_copy)}</Text>
                                        <Text style={{color:'white'}}>/</Text>
                                        <Text style={{color:'white'}}>{formatTime(state.duration)}</Text>
                                    </View>

                                    <TouchableOpacity style={{paddingHorizontal:20,backgroundColor:'transparent'}} onPress={props.setFullScreen}>
                                        <Image source={state.orientation==='portrait'?require('./assets/fullscreen.png'):require('./assets/fullscreen-exit.png')} />
                                    </TouchableOpacity>

                                    <View style={{position:'absolute',width:'100%',height:'100%',backgroundColor:'black',opacity:0.5,zIndex:-1}}/>
                                </View>
                            }
                        </Animated.View>
                        {Platform.OS==='android'?
                            <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={!!state.duration?state.currentTime/state.duration:0} color={'pink'} style={{height:3}}/>
                            :
                            <ProgressViewIOS trackTintColor="#FFFFFF" progressTintColor="pink" progress={!!state.duration?state.currentTime/state.duration:0} style={{height:3}}/>
                        }
                    </React.Fragment>
                }
            </MenusContext.Consumer>
        )
    }
}


/**
 * SeekTime
 * @props renderSeekTime
 * **/
class SeekTime extends AnimatedComponent {
    render(){
        return (
            <MenusContext.Consumer>
                {({state, props, styles}) =>
                    <Animated.View style={{opacity:this.opacityAnimate}}>
                        {typeof props.renderSeekTime === 'function' ?

                            props.renderSeekTime(state, props):

                            <View style={styles.seekTimeModal}>
                                <Text style={{color:'white'}}>{formatTime(state.currentTime)}</Text>
                                <Text style={{color:'white'}}>/</Text>
                                <Text style={{color:'white'}}>{formatTime(state.duration)}</Text>
                            </View>}
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )

    }
}


/**
 * Loading Component
 * **/
class Loading extends React.PureComponent {

    onReplay(){
        // UNDO: How to replay when android error (video unavailable)? #930
    }
    render(){
        return (
            <MenusContext.Consumer>
                {({state, props, styles}) =>
                    <View style={styles.centerMenusContainer}>
                        {typeof props.renderLoading === 'function' ?

                            props.renderLoading(state, props) :

                            !!state.error?
                                <React.Fragment>
                                    <Text style={{color: '#FFFFFF'}}>加载失败</Text>
                                    <Button title={"重试"} onPress={this.onReplay.bind(this)} color={'pink'}/>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <Image source={require('./assets/acfun.png')} resizeMode={'contain'}/>
                                    <Text style={{color: '#FFFFFF'}}>正在缓冲...</Text>
                                </React.Fragment>
                        }
                    </View>
                }
            </MenusContext.Consumer>
        )
    }
}


export default VideoPlayer
