import React from 'react'
import {
    View,
    StyleSheet
} from 'react-native'

let touchTimer;
class ResponderView extends React.PureComponent {
    static defaultProps = {
        handleSingleTouch : Function(),
        handleDoubleTouch : Function(),
        handleLeftAndRightMove: Function(),
        handleUpAndDownMoveInLeft: Function(),
        handleUpAndDownMoveInRight : Function()
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
     * @param percent:  Number( (currentCoordinate - lastCoordinate) / UIWidth )
     *
     * **/
    handleUpAndDownMoveInRight=(offset,percent)=>{
        this.props.handleUpAndDownMoveInRight(offset,percent)
    };

    handleUpAndDownMoveInLeft=(offset,percent)=>{
        this.props.handleUpAndDownMoveInLeft(offset,percent)
    };

    handleLeftAndRightMove=(offset,percent)=>{
        this.props.handleLeftAndRightMove(offset,percent)
    };

    /**********            Render           **********/

    render(){
        return (
            <View ref={'touchView'}
                  style={styles.touchView}
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
        const {locationX,locationY,timestamp} = e.nativeEvent;
        await this.setState({
            firstCoordinate:{x:locationX,y:locationY},
            firstTimestamp:timestamp
        });
    };

    _onResponderMove=(e)=>{

        e.persist();

        const {pageX,pageY,locationX,locationY,timestamp} = e.nativeEvent;
        const {moveEvent,firstCoordinate,lastCoordinate,firstTimestamp} = this.state;

        if(timestamp-firstTimestamp>300){
            this.refs.touchView.measure(async (ox, oy, width, height, px, py) => {

                await this.setState({lastCoordinate:{x:pageX,y:pageY}});

                if(moveEvent){
                    if(moveEvent==='LeftAndRightMove'){
                        this.handleLeftAndRightMove(lastCoordinate.x-pageX,(lastCoordinate.x-pageX)/width)
                    }else if(moveEvent==='UpAndDownMoveInRight'){
                        this.handleUpAndDownMoveInRight(lastCoordinate.y-pageY,(lastCoordinate.y-pageY)/width)
                    }else if(moveEvent==='UpAndDownMoveInLeft'){
                        this.handleUpAndDownMoveInLeft(lastCoordinate.y-pageY,(lastCoordinate.y-pageY)/width)
                    }
                }else {
                    if(Math.abs(firstCoordinate.x-locationX)> Math.abs(firstCoordinate.y-locationY)){
                        this.handleLeftAndRightMove(lastCoordinate.x-pageX,(lastCoordinate.x-pageX)/width);
                        await this.setState({
                            moveEvent:'LeftAndRightMove'
                        })
                    }else if(locationX>width/2){
                        this.handleUpAndDownMoveInRight(lastCoordinate.y-pageY,(lastCoordinate.y-pageY)/height);
                        await this.setState({
                            moveEvent:'UpAndDownMoveInRight'
                        })
                    }else if(locationX<width/2){
                        this.handleUpAndDownMoveInLeft(lastCoordinate.y-pageY,(lastCoordinate.y-pageY)/height);
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
        opacity:0.5
    }
});

export default ResponderView
