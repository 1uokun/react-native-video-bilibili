import React, { Component } from 'react';
import Video from 'react-native-video';
import {
    View,
    Easing,
    Animated,
} from 'react-native'

const {Provider,Consumer} = React.createContext({});

export default class VideoPlayer extends Component {

    constructor(props){
        super(props);
        this.state={
            visible:false,
        };
    }

    showMenus=()=>{
        this.setState({visible:true})
    };



    render(){
        return (
            <Provider value={{visible:false}}>
                <View style={{flex:1}}
                      onStartShouldSetResponder={this.showMenus}
                >
                    {/******* top menus *******/}
                    <TopMenus />
                    {/******* right menus *******/}
                    <RightMenus />
                    {/******* progress line *******/}
                    <ProgressLine />
                    {/******* bottom menus *******/}
                    <BottomMenus />
                </View>
            </Provider>
        )
    }
}

class TopMenus extends React.Component {
    constructor(props){
        super(props);
        this.animatedValue = new Animated.Value(0)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.slideToDown()
    }

    slideToDown=()=>{
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 300,
                easing: Easing.linear
            }
        ).start()
    };

    render(){
        return (
            <Consumer>
                {({visible})=>
                    <Animated.View style={{flex:1,height:40}}>

                    </Animated.View>
                }
            </Consumer>
        )
    }
}