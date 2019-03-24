import React from 'react'
import {Animated, Easing} from 'react-native'

export default class extends React.PureComponent {
    constructor(props) {
        super(props);
        this.animatedValue = new Animated.Value(0);
        this.translateDown = {
            transform: [
                {
                    translateY: this.animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0]
                    })
                }
            ]
        };
        this.translateUp = {
            transform: [
                {
                    translateY: this.animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -10]
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
        if (this.context.state.visible !== nextContext.state.visible) {
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
