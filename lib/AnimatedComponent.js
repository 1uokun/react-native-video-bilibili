import React from "react";
import {Animated, Easing} from "react-native";

class AnimatedComponent extends React.PureComponent {
    constructor(props){
        super(props);
        this.opacityAnimate = new Animated.Value(0);
        this.show=this.show.bind(this);
        this.toggle=this.toggle.bind(this);
    }

    show(){
        this.animateStagger.apply(this,arguments)
    }

    toggle(){
        this.animateToggle.apply(this,arguments)
    }

    animateStagger(delay=2000) {
        Animated.stagger(delay,
            [
                Animated.timing(
                    this.opacityAnimate,
                    {
                        toValue: 1,
                        duration: 300,
                        easing: Easing.linear,
                    }
                ),
                Animated.timing(
                    this.opacityAnimate,
                    {
                        toValue: 0,
                        duration: 300,
                        easing: Easing.linear,
                    }
                ),
            ]
        ).start()
    }

    animateToggle(delay=2000){
        if(this.opacityAnimate._value===0){
            this.animateStagger(delay);
        }else {
            Animated.timing(
                this.opacityAnimate,
                {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.linear,
                }
            ).start()
        }
    }
}

export default AnimatedComponent;
