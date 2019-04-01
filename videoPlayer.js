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

const MenusContext = React.createContext({});

class VideoPlayer extends React.PureComponent {
    static defaultProps = {
        renderCenterMenus:null,
        renderTopMenus:null,
        renderBottomMenus:null,
        renderSeekTime:null,
        volume:100,
        paused:false,
        currentTime:0,
    };

    constructor(props){
        super(props);
        this.state={
            sliderAutoEnable:false,
            seekTimeUpdate:true,
            menusUpdate:true,

            //video props
            volume:this.props.volume,
            paused:this.props.paused,
            duration:0,
            playableDuration:0,
            currentTime:this.props.currentTime,
            currentTime_copy:0,
        }
    }

    /******************** responder event *******************/
    _handleSingleTouch=()=>{
        this.showMenusComponent()
    };

    _handleDoubleTouch=()=>{
        this.onPaused()
    };

    _handleLeftAndRightMove=async (offset,percent)=>{

        //force update in SeekTime component
        this.showSerkTimerComponent();
        this.showMenusComponent();

        //update currentTime
        let duration = this.state.duration;
        let currentTime = this.state.currentTime;
        currentTime+=offset;
        if(currentTime<0){
            await this.setState({currentTime:0})
        }else if(currentTime>duration){
            await this.setState({currentTime:duration})
        }else {
            await this.setState({currentTime:currentTime})
        }

        this.onCurrentTimeProgress(this.state.currentTime);
    };

    _handleLeftAndRightMoveComplete=async ()=>{
        this.onSlidingComplete(this.state.currentTime)
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

    /******************** custom event *******************/
    showSerkTimerComponent=()=>{
        let seekTimeUpdate = this.state.seekTimeUpdate;
        this.setState({seekTimeUpdate:!seekTimeUpdate});
    };
    showMenusComponent=()=>{
        let menusUpdate = this.state.menusUpdate;
        this.setState({menusUpdate:!menusUpdate});
    };


    render(){
        return (
            <MenusContext.Provider value={{
                state:this.state,
                props:{
                    ...this.props,
                    onCurrentTimeProgress:this.onCurrentTimeProgress,
                    onSlidingComplete:this.onSlidingComplete,
                    onPaused:this.onPaused
                },
            }}>
            <View ref={'container'}
                  style={styles.container}
            >
                <Video
                    {...this.props}
                    ref={'player'}
                    source={{uri: "http://v.ysbang.cn/data/video/2015/rkb/2015rkb01.mp4"}}
                    // source={{uri: "http://www.w3school.com.cn/example/html5/mov_bbb.mp4"}}
                    style={{width:'100%',height:'100%',position:'absolute'}}
                    volume={this.state.volume/100}
                    paused={this.state.paused}
                    onLoadStart={ this.onLoadStart }
                    onLoad={  this.onLoad }
                    onProgress={  this.onProgress }
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

                        <TopMenus menusUpdate={this.state.menusUpdate}/>

                    {/********** bottom menus **********/}
                    <View style={[styles.bottomMenusContainer,{opacity:1}]}>
                        <SeekTime seekTimeUpdate={this.state.seekTimeUpdate}/>
                        <BottomMenus menusUpdate={this.state.menusUpdate}/>
                    </View>

                </ResponderView>
            </View>
            </MenusContext.Provider>
        )
    }

    /******************** video event *******************/
    onLoadStart=(e)=>{
    };

    onLoad=async (e)=>{
        await this.setState({
            duration:e.duration,
        })
    };

    onProgress=(e)=>{
        this.state.sliderAutoEnable&&this.setState({currentTime:e.currentTime});
        this.setState({playableDuration:e.playableDuration})
    };

    onPaused=()=>{
        let paused = this.state.paused;
        this.setState({paused:!paused})
    };

    onCurrentTimeProgress=async (value)=>{
        this.showMenusComponent();
        await this.setState({sliderAutoEnable:false,currentTime_copy:value})
    };

    onSlidingComplete=async (value)=>{
        this.refs.player.seek(value);
        await this.setState({sliderAutoEnable:true,currentTime:value,currentTime_copy:value})
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
    componentWillUpdate(nextProps, nextState, nextContext) {
        this.animate(3000)
    }

    render(){
        return (
            <MenusContext.Consumer>
                {({state, props}) =>
                    <Animated.View style={[styles.topMenusContainer,this.Appear,this.Disappear]}>
                        {typeof props.renderTopMenus === 'function' ?

                            props.renderTopMenus(state, props):

                            <View style={{height:30,backgroundColor:'black',opacity:0.5}}>

                            </View>
                        }
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )
    }
}

class BottomMenus extends AnimatedComponent {
    componentWillUpdate(nextProps, nextState, nextContext) {
        this.animate(3000)
    }

    render(){
        return (
            <MenusContext.Consumer>
                {({state, props}) =>
                    <React.Fragment>
                        <Animated.View style={[this.Appear,this.Disappear]}>

                            {typeof props.renderBottomMenus === 'function' ?

                                props.renderBottomMenus(state, props):

                                <View style={{height:30,backgroundColor:'transparent',flexDirection:'row',alignItems:'center'}}>

                                    <TouchableOpacity style={{paddingHorizontal:10}} onPress={props.onPaused}>
                                        <Image source={require('./assets/icon.png')} style={{width:15}} resizeMode={'contain'} />
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
                                                value={state.currentTime}
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
                                        <Text style={{color:'white'}}>{formatTime(state.sliderAutoEnable?state.currentTime:state.currentTime_copy)}</Text>
                                        <Text style={{color:'white'}}>/</Text>
                                        <Text style={{color:'white'}}>{formatTime(state.duration)}</Text>
                                    </View>

                                    <View style={{position:'absolute',width:'100%',height:'100%',backgroundColor:'black',opacity:0.5,zIndex:-1}}/>
                                </View>
                            }
                        </Animated.View>
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
                    <Animated.View style={[this.Appear,this.Disappear,{flexDirection:'row'}]}>
                        {typeof props.renderSeekTime === 'function' ?

                            props.renderSeekTime(state, props):

                            this.state.loadable && <View style={styles.seekTimeModal}>
                                <Text style={{color:'white'}}>{formatTime(state.currentTime)}</Text>
                                <Text style={{color:'white'}}>/</Text>
                                <Text style={{color:'white'}}>{formatTime(state.duration)}</Text>
                            </View>}
                            <View style={{flex:1}}/>
                    </Animated.View>
                }
            </MenusContext.Consumer>
        )

    }
}

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
        backgroundColor:'black',
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:5
    }
});

export default VideoPlayer
