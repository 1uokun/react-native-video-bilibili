import React from 'react'
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
type InputItemStyle = {
    container: ViewStyle;
    touchView: ViewStyle;
    centerMenusContainer: ViewStyle;
    topMenusContainer: ViewStyle;
    bottomMenusContainer: ViewStyle;
    seekTimeModal: ViewStyle;
    modal: ViewStyle;
    progress: ViewStyle;
    readProgress: ViewStyle;
}
declare interface VideoProps {
    onLoad?: void;
    onError?: void;
    onBuffer?: void;
    onProgress?: void;
    muted?: boolean;
    volume?: number;
    paused?: boolean;
    currentTime?: number,
    style: StyleProp<ViewStyle>;
    [key: string]: any;
}
interface VideoPlayerProps extends VideoProps{
    renderCenterMenus?: (state: object, props: VideoPlayerProps) => React.ReactNode;
    renderTopMenus?: (state: object, props: VideoPlayerProps) => React.ReactNode;
    renderBottomMenus?: (state: object, props: VideoPlayerProps) => React.ReactNode;
    renderSeekTime?: (state: object, props: VideoPlayerProps) => React.ReactNode;
    renderLoading?: (state: object, props: VideoPlayerProps) => React.ReactNode;
    setFullScreen?: () => void,
    setNavigator?: () => void,
    setSetting?: () => void,
    styles?: Partial<InputItemStyle>,
    children?: JSX.Element[] | JSX.Element;
}
declare class VideoPlayer extends React.PureComponent<VideoPlayerProps> {
    showSeekTimerComponent: () => void;
    showMenusComponent: () => void;
    toggleMenusComponent: () => void;
    render(): JSX.Element;

    setPaused: () => void;
}

export default VideoPlayer;
