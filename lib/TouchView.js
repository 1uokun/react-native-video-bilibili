import React from 'react'
import {View} from 'react-native'

let touchTimer;
class TouchView extends React.PureComponent {
    //单机事件
    handleSingleTouch=async ()=>{
        this.props.handleSingleTouch&&this.props.handleSingleTouch();
    };

    //双击事件
    handleDoubleTouch=()=>{
        alert(123)
        this.props.handleDoubleTouch&&this.props.handleDoubleTouch();
    };

    //2S内无点击事件

    //滑动事件 _onResponderGrant _onResponderRelease

    //左边上下滑动事件
    handleUpAndDownMoveInLeft=(offset)=>{
        this.props.handleUpAndDownMoveInLeft&&this.props.handleUpAndDownMoveInLeft(offset);
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
                  removeClippedSubviews
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

        const {pageX,pageY,timestamp} = e.nativeEvent;
        await this.setState({firstCoordinate:{x:pageX,y:pageY}});

        // if(touchTimer){
        //     this.handleDoubleTouch();
        //     clearTimeout(touchTimer);
        // }
        if(timestamp-this.state.timestamp<300){ //两次点击小于300ms
            await this.setState({isSingleTouch:false});
            // clearTimeout(touchTimer);
            this.handleDoubleTouch();
        }else {
            this.setState({isSingleTouch:true,timestamp:e.nativeEvent.timestamp});
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
     * @event record lastCoordinate
     * **/
    _onResponderGrant=async (e)=>{
        const {pageX,pageY} = e.nativeEvent;
        await this.setState({lastCoordinate:{x:pageX,y:pageY}});
    };

    _onResponderReject=(e)=>{

    };

    _onResponderMove=(e)=>{

        e.persist();

        const {pageX,pageY,timestamp} = e.nativeEvent;
        const {firstCoordinate,lastCoordinate,moveEvent} = this.state;
        if(timestamp-this.state.timestamp<300){
            this.state.isSingleTouch&&this.setState({isSingleTouch:false});
            return false
        }

        /**
         * 判断方向，保证手势单一事件
         *
         * @moveEvent LeftAndRightMove      左右滑动
         * @moveEvent UpAndDownMoveInRight  右侧上下滑动
         * @moveEvent UpAndDownMoveInLeft   左侧上下滑动
         *
         * **/
        function isCurrentEvent(type){return Boolean(moveEvent===type||moveEvent===null)}
        this.refs.root.measure(async (ox, oy, width, height, px, py) => {
            //location 是相对坐标  滑动时 会动态监听不同的view 而非点击时的那个view
            //这里还是要用page 绝对坐标
            await this.setState({firstCoordinate:{x:pageX,y:pageY}});
            if(isCurrentEvent('LeftAndRightMove')&&Math.abs(lastCoordinate.x-pageX)> Math.abs(lastCoordinate.y-pageY)){
                this.handleLeftAndRightMove((firstCoordinate.x-pageX)/width);
                this.setState({
                    lastCoordinate:{x:pageX,y:pageY},
                    moveEvent:'LeftAndRightMove'
                })
            }else if(isCurrentEvent('UpAndDownMoveInRight')&&pageX>width/2){
                this.handleUpAndDownMoveInRight(firstCoordinate.y-pageY);
                this.setState({
                    moveEvent:'UpAndDownMoveInRight'
                })
            }else if(isCurrentEvent('UpAndDownMoveInLeft')){
                this.handleUpAndDownMoveInLeft(firstCoordinate.y-pageY);
                this.setState({
                    moveEvent:'UpAndDownMoveInLeft'
                })
            }
        });
    };

    /**
     * if _onStartShouldSetResponder return true
     *
     * @event touchUp
     * **/
    _onResponderRelease=async (e)=>{
        // if(this.state.isSingleTouch){
            setTimeout(()=>{
                this.state.isSingleTouch&&this.handleSingleTouch();
            },300);
        // }else {
        //     this.setState({isSingleTouch:true});
        // }
        await this.setState({timestamp:e.nativeEvent.timestamp,moveEvent:null});

    };

    _onResponderTerminationRequest=()=>{
        return true
    };

    _onResponderTerminate=(e)=>{
    };
}

export default TouchView;
