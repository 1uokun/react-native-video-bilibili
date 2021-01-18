## react-native-video-bilibili`alpha`
📺react-native-video二次开发视频播放器，交互设计参考bilibili

No link, no dependencies, only javascript

```bash
npm install git+https://git@github.com/1uokun/react-native-video-bilibili.git
```

### Screenshot
<img src="https://github.com/1uokun/react-native-video-bilibili/blob/master/screenshot/overview.gif" style="width:40%">

### UX exploded view
<img src="https://github.com/1uokun/react-native-video-bilibili/blob/master/screenshot/ux.png" style="width:40%">

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
 - [x] [Animated Component][6]🏄
 - [x] Menus Component
 - [x] Loading Component
 
> if you accept `Link` the other library,please refer to 
> https://github.com/abbasfreestyle/react-native-af-video-player

#### 1.1

 - [x] add `lock` props
 - [x] add `children` props

#### 2.0 Future features

 - [ ] Native volume control
 - [ ] Native light control
 - [ ] 弹幕



  [1]: https://github.com/react-native-community/react-native-video#configurable-props
  [2]: https://github.com/react-native-community/react-native-video#event-props
  [3]: https://github.com/react-native-community/react-native-video#methods-1
  [4]: https://reactjs.org/docs/context.html
  [5]: https://github.com/1uokun/react-native-video-bilibili/blob/master/lib/ResponderView.js
  [6]: https://github.com/1uokun/react-native-video-bilibili/blob/master/lib/AnimatedComponent.js
  [7]: https://github.com/1uokun/react-native-video-bilibili/blob/master/lib/style/index.js
