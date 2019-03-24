import React from 'react'
import {View} from 'react-native'

class TouchView extends React.PureComponent {
    //单机事件
    handleSingleTouch=()=>{
        this.props.handleSingleTouch&&this.props.handleSingleTouch();
    };

    //双击事件
    handleDoubleTouch=()=>{
        alert(1234)
    };

    //2S内无点击事件

    //滑动事件 _onResponderGrant _onResponderRelease

    //左边上下滑动事件
    handleUpAndDownMoveInLeft=(offset)=>{

    };

    //右边上下滑动事件
    handleUpAndDownMoveInRight=(offset)=>{
        this.props.handleUpAndDownMoveInRight&&this.props.handleUpAndDownMoveInRight(offset);
    };

    //左右滑动事件
    handleLeftAndRightMove=(offset)=>{
    };

    /**
     * 点击事件是向下（子到父）穿透的
     *
     * 需求1：点击子， 父 要记录时间，但不响应其他事件
     * 需求2：锁屏
     * **/

    constructor(props){
        super(props);
        this.state={
            timestamp:0,    //时间戳
            firstCoordinate:{x:0,y:0},//点击事件触发时第一次的坐标轴
            lastCoordinate:{x:0,y:0}, //滑动事件中上一次的坐标轴
            moveEvent:null,    //滑动事件记录，避免多种事件冲突

            isSingleTouch:true //是否是单一触摸事件，默认为true
        }
    }



    render(){
        return (
            <View {...this.props}
                  ref={'root'}
                  onStartShouldSetResponder={this._onStartShouldSetResponder}
                  onMoveShouldSetResponder={this._onMoveShouldSetResponder}
                  onResponderGrant={this._onResponderGrant}
                  onResponderReject={this._onResponderReject}
                  onResponderMove={this._onResponderMove}
                  onResponderRelease={this._onResponderRelease}
                  onResponderTerminationRequest={this._onResponderTerminationRequest}
                  onResponderTerminate={this._onResponderTerminate}
            >
                {this.props.children}
            </View>
        )
    }

    _onStartShouldSetResponder=async (e)=>{

        /** https://fb.me/react-event-pooling **/
        e.persist();

        const {locationX,locationY,timestamp} = e.nativeEvent;
        await this.setState({firstCoordinate:{x:locationX,y:locationY}});
        if(timestamp-this.state.timestamp<300){ //两次点击小于300ms
            await this.setState({isSingleTouch:false});
            this.handleDoubleTouch();
        }else {
            this.setState({timestamp:e.nativeEvent.timestamp});
        }

        if(!!this.props.onStartShouldSetResponder){
            this.props.onStartShouldSetResponder(e)
        }else {
            return true
        }
    };

    _onMoveShouldSetResponder=()=>{
        return false
    };


    /**
     * if _onStartShouldSetResponder return true
     *
     * @event lastCoordinate
     * **/
    _onResponderGrant=async (e)=>{
        const {locationX,locationY} = e.nativeEvent;
        await this.setState({lastCoordinate:{x:locationX,y:locationY}});
    };

    _onResponderReject=(e)=>{

    };

    _onResponderMove=(e)=>{

        e.persist();

        const {locationX,locationY} = e.nativeEvent;
        const {firstCoordinate,lastCoordinate,moveEvent} = this.state;
        /**
         * 判断方向，保证手势单一事件
         *
         * @moveEvent LeftAndRightMove      左右滑动
         * @moveEvent UpAndDownMoveInRight  右侧上下滑动
         * @moveEvent UpAndDownMoveInLeft   左侧上下滑动
         *
         * **/
        function isCurrentEvent(type){return Boolean(moveEvent===type||!moveEvent)}
        this.state.isSingleTouch&&this.setState({isSingleTouch:false});

        this.refs.root.measure((ox, oy, width, height, px, py) => {
            if(locationY>0&&locationX>0&&locationY<height&&locationX<width){//手势移出范围后取消响应
                this.setState({firstCoordinate:{x:locationX,y:locationY}});
                if(isCurrentEvent('LeftAndRightMove')&&Math.abs(lastCoordinate.x-locationX)> Math.abs(lastCoordinate.y-locationY)){
                    this.handleLeftAndRightMove((firstCoordinate.x-locationX)/width);
                    this.setState({
                        lastCoordinate:{x:locationX,y:locationY},
                        moveEvent:'LeftAndRightMove'
                    })
                }else if(isCurrentEvent('UpAndDownMoveInRight')&&locationX>width/2){
                    this.handleUpAndDownMoveInRight(firstCoordinate.y-locationY);
                    this.setState({
                        lastCoordinate:{x:locationX,y:locationY},
                        moveEvent:'UpAndDownMoveInRight'
                    })
                }else if(isCurrentEvent('UpAndDownMoveInLeft')){
                    this.handleUpAndDownMoveInLeft((firstCoordinate.y-locationY)/height);
                    this.setState({
                        lastCoordinate:{x:locationX,y:locationY},
                        moveEvent:'UpAndDownMoveInLeft'
                    })
                }
            }
        });
    };

    /**
     * if _onStartShouldSetResponder return true
     *
     * @event touchUp
     * **/
    _onResponderRelease=async (e)=>{
        this.setState({timestamp:e.nativeEvent.timestamp,isSingleTouch:true,moveEvent:null});
    };

    _onResponderTerminationRequest=(e)=>{
        return true
    };

    _onResponderTerminate=(e)=>{
    };
}

export default TouchView;
