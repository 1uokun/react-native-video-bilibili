import React, { Component } from 'react';
import Video from 'react-native-video';
import {
    View
} from 'react-native'

export default class VideoPlayer extends Component {

    static defaultProps = {
        toggleResizeModeOnFullscreen:   true,
        playInBackground:               false,
        playWhenInactive:               false,
        showOnStart:                    true,
        resizeMode:                     'contain',
        paused:                         false,
        repeat:                         false,
        volume:                         0,
        muted:                          false,
        title:                          '',
        rate:                           1,
    };

    constructor(props){
        super(props);
        this.state={
            resizeMode: this.props.resizeMode,
            paused: this.props.paused,
            muted: this.props.muted,
            volume: this.props.volume,
            rate: this.props.rate,
        };

        this.events = {
            onError: this.props.onError || this._onError.bind( this ),
            onBack: this.props.onBack || this._onBack.bind( this ),
            onEnd: this.props.onEnd || this._onEnd.bind( this ),
            onScreenTouch: this._onScreenTouch.bind( this ),
            onEnterFullscreen: this.props.onEnterFullscreen,
            onExitFullscreen: this.props.onExitFullscreen,
            onLoadStart: this._onLoadStart.bind( this ),
            onProgress: this._onProgress.bind( this ),
            onLoad: this._onLoad.bind( this ),
            onPause: this.props.onPause,
            onPlay: this.props.onPlay,
        };
    }



    render(){
        return (
            <View>
                <Video
                    { ...this.props }
                    ref={ videoPlayer => this.player.ref = videoPlayer }

                    resizeMode={ this.state.resizeMode }
                    volume={ this.state.volume }
                    paused={ this.state.paused }
                    muted={ this.state.muted }
                    rate={ this.state.rate }

                    onLoadStart={ this.events.onLoadStart }
                    onProgress={ this.events.onProgress }
                    onError={ this.events.onError }
                    onLoad={ this.events.onLoad }
                    onEnd={ this.events.onEnd }

                    style={[this.props.style]}

                    source={ this.props.source }
                />
            </View>
        )
    }
}
