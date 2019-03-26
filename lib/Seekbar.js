import React from 'react'
import {View,Text} from 'react-native'
import {formatTime} from './util'

class SeekBar extends React.Component {
    static defaultProps = {
        duration:0,
        currentTime:0,
        playableDuration:0,
        horizontal:true
    };

    state={
        duration:this.props.duration,
        currentTime:this.props.currentTime,
        playableDuration:this.props.playableDuration,
    };

    render(){
        const {duration,currentTime,playableDuration} = this.state;
        return (
            <View
                ref={'line'}
                onStartShouldSetResponder={()=>{
                    return true
                }}
                onResponderMove={(e)=>{
                    const {isTouched,zeroPoint,extremePoint,offsetPoint} = this.state;
                    if(isTouched){
                        if(true){
                            if(e.nativeEvent.pageX-zeroPoint.x-offsetPoint.x<0) {
                                this.setState({currentTime: 0})
                            } else if(e.nativeEvent.pageX-zeroPoint.x-offsetPoint.x>extremePoint.x){
                                this.setState({currentTime: extremePoint.x})
                            } else {
                                this.setState({currentTime:e.nativeEvent.pageX-zeroPoint.x-offsetPoint.x})
                            }
                        }else {
                            if(e.nativeEvent.pageY-zeroPoint.y-offsetPoint.y<0) {
                                this.setState({currentTime: 0})
                            } else if(e.nativeEvent.pageY-zeroPoint.y-offsetPoint.y>extremePoint.y){
                                this.setState({currentTime: extremePoint.y})
                            } else {
                                this.setState({currentTime:e.nativeEvent.pageY-zeroPoint.y-offsetPoint.y})
                            }
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
                    height:100,
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor:'transparent'
                }}
            >
                {/******** line ********/}
                <View style={{position:'absolute',width:'100%',height:2,backgroundColor:'#FFFFFF'}} />
                {/******** playableDuration ********/}
                <View style={{position:'absolute',width:(playableDuration/duration*100)+'%',height:2,backgroundColor:'gray'}} />
                {/******** currentTime ********/}
                <View style={{position:'absolute',width:(currentTime/duration*100)+'%',height:2,backgroundColor:'pink'}} />

                <View
                    ref={'point'}
                    onStartShouldSetResponder={(e)=>{
                        console.log(e)
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
                        {position:'absolute',zIndex:9999,paddingVertical:10,justifyContent:'center',alignItems:'center'},
                        {left:this.state.currentTime}
                    ]}
                >
                    {this.props.children}
                </View>
            </View>
        )
    }
}

export default SeekBar;
