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

    animate(delay=1000) {
        this.appearValue.setValue(0);
        this.disappearValue.setValue(0);
        Animated.stagger(delay,
            [
                Animated.timing(
                    this.appearValue,
                    {
                        toValue: 1,
                        duration: 300,
                        easing: Easing.linear,
                    }
                ),
                Animated.timing(
                    this.disappearValue,
                    {
                        toValue: 1,
                        duration: 300,
                        easing: Easing.linear,
                    }
                ),
            ]
        ).start()
    }
}

export default AnimatedComponent;
