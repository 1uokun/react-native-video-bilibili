import React from "react";
import {Animated, Easing} from "react-native";

class AnimatedComponent extends React.PureComponent {
    constructor(props){
        super(props);
        this.appearValue = new Animated.Value(0);
        this.disappearValue = new Animated.Value(0);
        this.Appear = {
            opacity: this.appearValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
            }),
        };
        this.Disappear = {
            opacity: this.disappearValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
            })
        };
    }

    animate() {
        this.appearValue.setValue(0);
        this.disappearValue.setValue(0);
        Animated.stagger(1500,
            [
                Animated.timing(
                    this.appearValue,
                    {
                        toValue: 1,
                        duration: 300,
                        easing: Easing.in,
                    }
                ),
                Animated.timing(
                    this.disappearValue,
                    {
                        toValue: 1,
                        duration: 300,
                        easing: Easing.in,
                    }
                ),
            ]
        ).start()
    }

    appearAnimate(duration) {
        this.appearValue.setValue(0);
        Animated.timing(
            this.appearValue,
            {
                toValue: 1,
                duration: duration,
                easing: Easing.linear
            }
        ).start();
    }

    disappearAnimate(duration) {
        this.disappearValue.setValue(0);
        Animated.timing(
            this.disappearValue,
            {
                toValue: 1,
                duration: duration,
                easing: Easing.linear
            }
        ).start()
    }
}

export default AnimatedComponent;
