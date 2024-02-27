## react-native-video-bilibili
📺react-native-video二次开发视频播放器，交互设计参考bilibili

No link, no dependencies, only javascript

## Install <a href="https://npmjs.org/package/react-native-video-bilibili"><img alt="npm version" src="http://img.shields.io/npm/v/react-native-video-bilibili.svg?style=flat-square"></a> <a href="https://npmjs.org/package/react-native-video-bilibili"><img alt="npm version" src="http://img.shields.io/npm/dm/react-native-video-bilibili.svg?style=flat-square"></a>
```bash
npm install react-native-video-bilibili
```

### Screenshot
<img src="https://github.com/1uokun/react-native-video-bilibili/blob/master/screenshot/overview.gif" style="width:40%">

### UX exploded view
<img src="https://github.com/1uokun/react-native-video-bilibili/blob/master/screenshot/ux.png" style="width:40%">

### Preview
|Expo SDK 50 | Web Online |
|--|--|
| [<img width="250" alt="expo-video-bilibili" src="https://github.com/1uokun/react-native-video-bilibili/assets/28673261/734bfe6f-28bd-4df5-9fd0-6a3b72b5c467" />](https://expo.dev/accounts/1uokun/projects/expo-video-bilibili) |https://1uokun.github.io/react-native-video-bilibili/index.html|

## Usage

```javascript
import Video from 'react-native-video-bilibili';

<Video
    ref={'player'}
    style={{width:"100%",height:300}}
    source={{uri: "https://media.w3.org/2010/05/sintel/trailer.mp4"}}
/>
```

## Configurable props

 * [...video.props][1]
 * containerStyle
    
   *container style*
 * style
   
   *react-native-video style*
   
 * styles
 
   deep merge styles with [VideoPlayerStyles][7]
 * lock🔒
 
   **🌟Lock all operations🌟**
 * [Custom Menus Component](#custom-menus-component)
    
    |Property|Type|Arguments|Description|
    |----|----|----|----|
    |renderCenterMenus|node|[state,props](#state-props)|Components displayed in the middle of the player, like volume or light control|
    |renderTopMenus|node|[state,props](#state-props)|Components displayed in the top of the player, like title or navigation control|
    |renderBottomMenus|node|[state,props](#state-props)|Components displayed in the bottom of the player, like seek bar or seek time control|
    |renderSeekTime|node|[state,props](#state-props)|Components displayed when you slide left and right, like show each frame of picture|
    |renderLoading|node|[state,props](#state-props)|Components displayed when video is buffering, like show buffering loading|
    |children|function|[state,props](#state-props)|`({state,props})=>(<View></View>)`|

    ##### state props
    Pass all `state` and external `props` of the parent component`<Provider>` to the child component`<Consumer>` based on [context API][4]

    **Provider**
    ```jsx harmony
    <Provider value={{
        state:this.state,
        props:{
            ...this.props,
            onCurrentTimeProgress:this.onCurrentTimeProgress,
            onSlidingComplete:this.onSlidingComplete,
            setPaused:this.setPaused
        },
    }}>
    </Provider>
    ```
    
    **Consumer**
    ```jsx harmony
    <Consumer>
        {({state, props}) =>
            <Animated.View>
                {props.renderCenterMenus(state, props)}
            </Animated.View>
        }
    </Consumer>
    ```
## Event props
 - [...video.props][2]
 - setFullScreen()
 - setNavigator()
 - setSetting()
 
### Ref Direct Manipulation
 - [...video methods][3]
    ```javascript
       this.player._root.doSth()
    ```
 - setPaused()
    
 - showMenusComponent()
 - showSeekTimerComponent()
 - <del>onOrientationChange({width,height})</del>
 
## Todo-list

#### 1.0

 - [x] [Gesture Responder System][5]👆
   - 左右滑动进度条
   - 上下滑动亮度（左）/声音（右）
   - 长按加速
   - 双击暂停
 - [x] [Animated Component][6]🏄
 - [x] Menus Component
 - [x] Loading Component
 
> if you accept `Link` the other library,please refer to 
> https://github.com/abbasfreestyle/react-native-af-video-player

#### 1.1

 - [x] add `lock` props
 - [x] add `children` props

#### 2.0 Future features(💰paid version)

 - [x] Native volume control
 - [x] Native light control
 - [x] 弹幕



  [1]: https://github.com/react-native-community/react-native-video#configurable-props
  [2]: https://github.com/react-native-community/react-native-video#event-props
  [3]: https://github.com/react-native-community/react-native-video#methods-1
  [4]: https://reactjs.org/docs/context.html
  [5]: https://github.com/1uokun/react-native-video-bilibili/blob/master/lib/ResponderView.js
  [6]: https://github.com/1uokun/react-native-video-bilibili/blob/master/lib/AnimatedComponent.js
  [7]: https://github.com/1uokun/react-native-video-bilibili/blob/master/lib/style/index.js
