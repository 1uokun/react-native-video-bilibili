import React from 'react'
import {View} from 'react-native'

class Touch extends React.Component {
    //单机事件
    handleSingleTouch=()=>{

    };

    //双击事件
    handleDoubleTouch=()=>{

    };

    //2S内无点击事件

    //滑动事件 _onResponderGrant _onResponderRelease

    //左边上下滑动事件
    handleUpAndDownMoveInLeft=(offset)=>{

    };

    //右边上下滑动事件
    handleUpAndDownMoveInRight=(offset)=>{

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
            moveEvent:null    //滑动事件记录，避免多种事件冲突
        }
    }



    render(){
        return (
            <View {...this.props}
                  ref={'luokun'}
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
        const {locationX,locationY,timestamp} = e.nativeEvent;
        await this.setState({firstCoordinate:{x:locationX,y:locationY}});
        if(timestamp-this.state.timestamp<300){ //两次点击小于300ms
            this.handleDoubleTouch()
        }else {
            this.handleSingleTouch()
        }
        return true
    };

    _onMoveShouldSetResponder=(e)=>{
        console.log(1,'如果 View 不是响应者，那么在每一个触摸点开始移动（没有停下也没有离开屏幕）时再询问一次：是否愿意响应触摸交互呢',e)
        // return true
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
        // console.log(1,'现在要开始响应触摸事件了。这也是需要做高亮的时候，使用户知道他到底点到了哪里。\n', e.nativeEvent)
    };

    _onResponderReject=(e)=>{
        // console.log(1,'View响应者现在“另有其人”而且暂时不会“放权”，请另作安排。',e)
    };

    _onResponderMove=async (e)=>{
        // console.log(1,'用户正在屏幕上移动手指时（没有停下也没有离开屏幕）',e.nativeEvent)
        const {locationX,locationY} = e.nativeEvent;
        const {firstCoordinate,lastCoordinate,moveEvent} = this.state;
        function isCurrentEvent(type){return Boolean(moveEvent===type||!moveEvent)}
        if(isCurrentEvent('LeftAndRightMove')&&Math.abs(lastCoordinate.x-locationX)> Math.abs(lastCoordinate.y-locationY)){
            this.refs.luokun.measure((ox, oy, width, height, px, py) => {
                this.handleLeftAndRightMove((locationX-firstCoordinate.x)/width)
            });
            this.setState({lastCoordinate:{x:locationX,y:locationY}, moveEvent:'LeftAndRightMove'})

        }else {
            this.refs.luokun.measure((ox, oy, width, height, px, py) => {
                if(isCurrentEvent('UpAndDownMoveInRight')&&locationX>width/2){
                    this.handleUpAndDownMoveInRight((firstCoordinate.y-locationY)/height);
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
            });

        }
    };

    /**
     * if _onStartShouldSetResponder return true
     *
     * @event touchUp
     * **/
    _onResponderRelease=(e)=>{
        this.setState({timestamp:e.nativeEvent.timestamp,moveEvent:null});
        // console.log(1,' 触摸操作结束时触发，比如"touchUp"（手指抬起离开屏幕）',e)
    };

    _onResponderTerminationRequest=(e)=>{
        // console.log(1,'有其他组件请求接替响应者，当前的 View 是否“放权”？返回 true 的话则释放响应者权力。',e)
        // return true
        return false
    };

    _onResponderTerminate=(e)=>{
        // console.log(1,'响应者权力已经交出。这可能是由于其他 View 通过onResponderTerminationRequest请求的，也可能是由操作系统强制夺权（比如 iOS 上的控制中心或是通知中心）',e)
    };
}

export default Touch;
