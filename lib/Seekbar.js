import React from 'react'
import {View,Text} from 'react-native'
import {formatTime} from './util'

class SeekBar extends React.Component {
    static defaultProps = {
        duration:1,
        currentTime:0,
        playableDuration:0,
        horizontal:true,
        range: 20,  //按钮允许范围
    };

    state={
        // left:100*this.props.currentTime/this.props.duration+'%',
        left:'100%',
        extremePoint:{x:0,y:0},
    };

    // componentWillUpdate(nextProps, nextState, nextContext) {
    //     this.setState({
    //         left:100*nextProps.currentTime/nextProps.duration+'%'
    //     })
    // }

    // componentWillReceiveProps(nextProps, nextContext) {
    //     if(nextProps.currentTime<nextProps.duration){
    //         this.setState({
    //             left:100*nextProps.currentTime/nextProps.duration+'%'
    //         })
    //     }
    // }

    render(){
        const {left,extremePoint} = this.state;
        return (
            <View
                ref={'line'}
                onStartShouldSetResponder={()=>{
                    return true
                }}
                onResponderMove={(e)=>{
                    const {isTouched,zeroPoint,extremePoint,offsetPoint} = this.state;
                    if(isTouched){

                        if(e.nativeEvent.pageX-zeroPoint.x-offsetPoint.x<0) {
                            this.setState({left: 0})
                        } else if(e.nativeEvent.pageX-zeroPoint.x-offsetPoint.x>extremePoint.x){
                            this.setState({left: extremePoint.x})
                        } else {
                            this.setState({left:e.nativeEvent.pageX-zeroPoint.x-offsetPoint.x})
                        }

                    }
                    return true
                }}
                onResponderRelease={()=>{
                    this.state.isTouched&&
                    this.setState({isTouched:false})
                }}
                style={{
                    flex:1,
                    height:50,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor:'red'
                }}
            >
                {/******** line ********/}
                <View style={{position:'absolute',width:'100%',height:2,backgroundColor:'#FFFFFF'}} />
                {/******** playableDuration ********/}
                {/*<View style={{position:'absolute',width:(playableDuration/duration*100)+'%',height:2,backgroundColor:'gray'}} />*/}
                {/******** currentTime ********/}
                {/*<View style={{position:'absolute',width:(currentTime/duration*100)+'%',height:2,backgroundColor:'pink'}} />*/}

                <View
                    ref={'point'}
                    onStartShouldSetResponder={(e)=>{
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
                                        // x:lineWidth-pointWidth+this.props.range*2,y:lineHeight-pointHeight
                                        x:lineWidth-pointWidth,y:lineHeight-pointHeight
                                    },
                                    //Point偏差点
                                    offsetPoint:{
                                        // x:e.nativeEvent.locationX-this.props.range,
                                        // y:e.nativeEvent.locationX-this.props.range,
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
                        {left:left},
                        // {padding:this.props.range}
                    ]}
                >
                    {this.props.children}
                </View>
            </View>
        )
    }
}

export default SeekBar;
