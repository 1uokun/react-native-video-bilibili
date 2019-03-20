import React from 'react'
import {Animated, Easing} from 'react-native'

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.animatedValue = new Animated.Value(0);
        this.translateDown = {
            transform: [
                {
                    translateY: this.animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-30, 0]
                    })
                }
            ]
        };
        this.translateUp = {
            transform: [
                {
                    translateY: this.animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -30]
                    })
                }
            ]
        };
        this.Appear = {
            opacity: this.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
            })
        };
        this.Disappear = {
            opacity: this.animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
            })
        };
    }

    componentDidMount() {
        this.animate()
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (this.context.visible !== nextContext.visible) {
            this.animate()
        }
    }

    animate() {
        this.animatedValue.setValue(0);
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 300,
                easing: Easing.linear
            }
        ).start()
    }
}
