import React from 'react'
import {View,StyleSheet} from 'react-native'

class SeekBar extends React.Component {
    state={
        left:0,
        top:0,
    };

    render(){
        const {horizontal,lineStyle,readLineStyle} = this.props;
        return (
            <View
                ref={'line'}
                onStartShouldSetResponder={()=>{
                    return true
                }}
                onResponderMove={(e)=>{
                    const {isTouched,zeroPoint,extremePoint,offsetPoint} = this.state;
                    if(isTouched){
                        if(horizontal){
                            if(e.nativeEvent.pageX-zeroPoint.x-offsetPoint.x<0) {
                                this.setState({left: 0})
                            } else if(e.nativeEvent.pageX-zeroPoint.x-offsetPoint.x>extremePoint.x){
                                this.setState({left: extremePoint.x})
                            } else {
                                this.setState({left:e.nativeEvent.pageX-zeroPoint.x-offsetPoint.x})
                            }
                        }else {
                            if(e.nativeEvent.pageY-zeroPoint.y-offsetPoint.y<0) {
                                this.setState({top: 0})
                            } else if(e.nativeEvent.pageY-zeroPoint.y-offsetPoint.y>extremePoint.y){
                                this.setState({top: extremePoint.y})
                            } else {
                                this.setState({top:e.nativeEvent.pageY-zeroPoint.y-offsetPoint.y})
                            }
                        }
                    }
                    return true
                }}
                onResponderRelease={()=>{
                    this.state.isTouched&&
                    this.setState({isTouched:false})
                }}
                style={
                    horizontal?
                        [styles.lineHorizontal, lineStyle]:
                        [styles.lineVertical, lineStyle]
                }
            >
                {/******** already line ********/}
                <View style={horizontal? [styles.readLineHorizontal,readLineStyle, {width:this.state.left}]: [styles.readLineVertical,readLineStyle, {height:this.state.top}]}/>
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
                        {position:'absolute'},
                        horizontal?{left:this.state.left}:{top:this.state.top}
                    ]}
                >
                    {this.props.children}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    lineHorizontal:{
        width:'100%',
        height:2,
        backgroundColor:'yellow',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20
    },
    lineVertical:{
        height:'100%',
        width:2,
        backgroundColor:'yellow',
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 20
    },

    readLineHorizontal:{
        position:'absolute',
        height:'100%',
        backgroundColor:'green',
    },
    readLineVertical:{
        position:'absolute',
        width:'100%',
        backgroundColor:'green',
    }
});

export default SeekBar;
