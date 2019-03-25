import React from 'react'
import {Animated, Easing} from 'react-native'

const offset = 30;
const duration = 600;
export default class extends React.PureComponent {
    constructor(props) {
        super(props);
        this.animatedValue = new Animated.Value(0);
        this.state={
            topMenusTranslate : {
                transform: [
                    {
                        translateY: this.animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, offset]
                        })
                    }
                ]
            },
            bottomMenusTranslate : {
                transform: [
                    {
                        translateY: this.animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, offset*(-1)]
                        })
                    }
                ]
            }
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

            this.animatedValue.stopAnimation(async (oneTimeRotate) => {
                await this.setState({
                    topMenusTranslate : {
                        transform: [
                            {
                                translateY: this.animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: nextContext.state.visible?
                                        [(1-oneTimeRotate)*offset, offset]:
                                        [(oneTimeRotate)*offset, 0]
                                })
                            }
                        ]
                    },
                    bottomMenusTranslate : {
                        transform: [
                            {
                                translateY: this.animatedValue.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: nextContext.state.visible?
                                        [(1-oneTimeRotate)*offset*(-1), offset*(-1)]:
                                        [(oneTimeRotate)*offset*(-1), 0]
                                })
                            }
                        ]
                    },
                });
                this.animatedValue.setValue(0);
                Animated.timing(
                    this.animatedValue,
                    {
                        toValue: 1,
                        duration: duration*oneTimeRotate,
                        easing: Easing.linear
                    }
                ).start()
            })
        }
    }

    animate() {
        this.animatedValue.setValue(0);
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: duration,
                easing: Easing.linear
            }
        ).start()
    }
}
