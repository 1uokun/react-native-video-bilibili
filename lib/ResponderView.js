import React from 'react'
import {
    View,
    StyleSheet
} from 'react-native'

let touchTimer;
class ResponderView extends React.PureComponent {
    static defaultProps = {
        handleSingleTouch : function(){},
        handleDoubleTouch : function(){},
        handleLeftAndRightMove: function(){},
        handleLeftAndRightMoveComplete: function(){},
        handleUpAndDownMoveInLeft: function(){},
        handleUpAndDownMoveInRight : function(){}
    };
    constructor(props){
        super(props);
        this.state={
            firstCoordinate:{x:0,y:0}, // for judging LeftAndRightMove
            firstTimestamp:0,          // for preventing misoperation
            lastCoordinate:{x:0,y:0},  // for calculating move offset
            moveEvent:null,            // Responder Event
        }
    }

    /**********           Handle Event           **********/

    handleSingleTouch=(e)=>{
        this.props.handleSingleTouch(e)
    };

    handleDoubleTouch=(e)=>{
        this.props.handleDoubleTouch(e)
    };

    /**
     * moveEventType: ['UpAndDownMoveInRight','UpAndDownMoveInLeft','LeftAndRightMove']
     *
     * @param offset:   Number( currentCoordinate - lastCoordinate )
     *
     * **/
    handleUpAndDownMoveInRight=(offset)=>{
        this.props.handleUpAndDownMoveInRight(offset)
    };

    handleUpAndDownMoveInLeft=(offset)=>{
        this.props.handleUpAndDownMoveInLeft(offset)
    };

    handleLeftAndRightMove=(offset)=>{
        this.props.handleLeftAndRightMove(offset)
    };

    /**********            Render           **********/

    render(){
        return (
            <View ref={'touchView'}
                  {...this.props}
                  style={[styles.touchView,this.props.style]}
                  onStartShouldSetResponder={this._onStartShouldSetResponder}
                  onResponderGrant={this._onResponderGrant}
                  onResponderMove={this._onResponderMove}
                  onResponderRelease={this._onResponderRelease}
            >
                {this.props.children}
            </View>
        )
    }

    /**********           Life Cycle           **********/

    componentWillUnmount() {
        clearTimeout(touchTimer)
    }


    /**********    Gesture Responder System    **********/

    _onStartShouldSetResponder=(e)=>{
        if(touchTimer){
            this.handleDoubleTouch(e);
            clearTimeout(touchTimer)
        }
        return true
    };

    _onResponderGrant=async (e)=>{
        const {pageX,pageY,locationX,locationY,timestamp} = e.nativeEvent;
        this.refs.touchView.measure(async (ox, oy, width, height, px, py) => {
            await this.setState({
                firstCoordinate:{x:locationX,y:locationY},
                firstTimestamp:timestamp,
                lastCoordinate:{x:pageX,y:pageY}
            });
        })
    };

    _onResponderMove=async (e)=>{

        e.persist();

        const {pageX,pageY,locationX,locationY,timestamp} = e.nativeEvent;
        const {moveEvent,firstCoordinate,lastCoordinate,firstTimestamp} = this.state;

        if(timestamp-firstTimestamp>300){

            await this.setState({lastCoordinate:{x:pageX,y:pageY}});

            this.refs.touchView.measure(async (ox, oy, width, height, px, py) => {

                if(moveEvent){
                    if(moveEvent==='LeftAndRightMove'){
                        this.handleLeftAndRightMove(pageX-lastCoordinate.x)
                    }else if(moveEvent==='UpAndDownMoveInRight'){
                        this.handleUpAndDownMoveInRight(lastCoordinate.y-pageY)
                    }else if(moveEvent==='UpAndDownMoveInLeft'){
                        this.handleUpAndDownMoveInLeft(lastCoordinate.y-pageY)
                    }
                }else {
                    if(Math.abs(firstCoordinate.x-locationX)> Math.abs(firstCoordinate.y-locationY)){
                        this.handleLeftAndRightMove(pageX-lastCoordinate.x);
                        await this.setState({
                            moveEvent:'LeftAndRightMove'
                        })
                    }else if(locationX>width/2){
                        this.handleUpAndDownMoveInRight(lastCoordinate.y-pageY);
                        await this.setState({
                            moveEvent:'UpAndDownMoveInRight'
                        })
                    }else if(locationX<width/2){
                        this.handleUpAndDownMoveInLeft(lastCoordinate.y-pageY);
                        await this.setState({
                            moveEvent:'UpAndDownMoveInLeft'
                        })
                    }
                }
            });
        }
    };

    _onResponderRelease=(e)=>{

        const {moveEvent} = this.state;
        if(moveEvent){
            moveEvent=='LeftAndRightMove'&&this.props.handleLeftAndRightMoveComplete();
            this.setState({
                moveEvent:null,
                firstTimestamp:e.nativeEvent.timestamp
            })
        }else {
            if(!touchTimer){
                touchTimer = setTimeout(()=>{
                    this.handleSingleTouch(e);
                    touchTimer=undefined
                },300)
            }else {
                touchTimer=undefined
            }
        }
    }
}

const styles = StyleSheet.create({
    touchView:{
        flex:1,
        backgroundColor: 'transparent',
        opacity:1
    }
});

export default ResponderView
