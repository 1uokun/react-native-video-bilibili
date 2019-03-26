import React from 'react'
import {View,Text} from 'react-native'
import {formatTime} from './util'

class SeekBar extends React.Component {
    static defaultProps = {
        duration:1,
        jumpCurrentTime:function(){},
        currentTime:0,
        playableDuration:0,
        horizontal:true,
        range: 20,  //按钮允许范围
        lineHeight: 2,//进度条高度
    };

    state={
        left:'0%',
        duration:this.props.duration,
        currentTime:this.props.currentTime,
        playableDuration:this.props.playableDuration,
    };

    // componentWillUpdate(nextProps, nextState, nextContext) {
    //     this.setState({
    //         left:100*nextProps.currentTime/nextProps.duration+'%'
    //     })
    // }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.currentTime<nextProps.duration){
            this.setState({
                left:100*nextProps.currentTime/nextProps.duration+'%'
            })
        }
    }

    render(){
        const {left, duration, currentTime, playableDuration} = this.state;
        return (
            <View
                ref={'line'}
                onStartShouldSetResponder={()=>{
                    return true
                }}
                onResponderMove={async (e)=>{
                    console.log(2)
                    const {isTouched,zeroPoint,extremePoint,offsetPoint} = this.state;
                    if(isTouched){
                        if(e.nativeEvent.pageX-zeroPoint.x-offsetPoint.x<0) {
                            await this.setState({left: '0%'})
                        } else if(e.nativeEvent.pageX-zeroPoint.x-offsetPoint.x>extremePoint.x){
                            await this.setState({left: '100%'})
                        } else {
                            await this.setState({left:100*(e.nativeEvent.pageX-zeroPoint.x-offsetPoint.x)/extremePoint.x+'%'})
                        }
                        this.props.jumpCurrentTime(this.state.left)
                    }
                    return true
                }}
                onResponderRelease={()=>{
                    this.state.isTouched&&
                    this.setState({isTouched:false})
                }}
                style={{
                    flex:1,
                    paddingHorizontal:this.props.range,
                    height:50,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor:'transparent'
                }}
            >
                <View style={{width:'100%'}}>
                    {/******** line ********/}
                    <View style={{width:'100%',height:this.props.lineHeight,backgroundColor:'#FFFFFF'}} />
                    {/******** playableDuration ********/}
                    <View style={{marginTop:this.props.lineHeight*(-1),width:(playableDuration/duration*100)+'%',height:this.props.lineHeight,backgroundColor:'gray'}} />
                    {/******** currentTime ********/}
                    <View style={{marginTop:this.props.lineHeight*(-1),width:(currentTime/duration*100)+'%',height:this.props.lineHeight,backgroundColor:'pink'}} />
                </View>

                <View
                    ref={'point'}
                    onStartShouldSetResponder={(e)=>{
                       console.log(1)
                        e.persist();

                        this.refs.line.measure((ox, oy, lineWidth, lineHeight, linePx, linePy) => {
                            this.refs.point.measure((ox, oy, pointWidth,pointHeight) => {
                                this.setState({
                                    //Line零点
                                    zeroPoint:{
                                        x:linePx,y:linePy
                                    },
                                    //Line极值点
                                    extremePoint:{
                                        x:lineWidth-pointWidth,y:lineHeight-pointHeight
                                    },
                                    //Point偏差点
                                    offsetPoint:{
                                        x:e.nativeEvent.locationX,
                                        y:e.nativeEvent.locationY,
                                    },
                                    //touch state
                                    isTouched:true
                                })
                            });
                        });
                        return false//make the parent line view can also respond to the touch event
                    }}
                    onMoveShouldSetResponder={()=>{
                        return false
                    }}
                    style={[
                        {height:'100%',position:'absolute',zIndex:9999,justifyContent:'center',alignItems:'center',backgroundColor:'transparent'},
                        {opacity:1,left:left},
                        {padding:this.props.range}
                    ]}
                >
                    {this.props.children}
                </View>
            </View>
        )
    }
}

export default SeekBar;

/**
 * left 百分比
 * range 按钮范围 必需有
 *
 * 问题1：left为100%时，跳出线外了
 *
 * 问题2：在播放过程中 滑动跳选时间 应该新建一个变量用于滑动时处于的时间而非video的cuurentTime
 *          当touchUp时，再将这个时间更新给video
 * **/