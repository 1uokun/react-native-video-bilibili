## react-native-video-bilibili
📺 Reproductor de video desarrollado a partir de react-native-video, con diseño de interacción basado en bilibili

Sin enlaces, sin dependencias, solo javascript

## Instalación <a href="https://npmjs.org/package/react-native-video-bilibili"><img alt="npm version" src="http://img.shields.io/npm/v/react-native-video-bilibili.svg?style=flat-square"></a> <a href="https://npmjs.org/package/react-native-video-bilibili"><img alt="npm version" src="http://img.shields.io/npm/dm/react-native-video-bilibili.svg?style=flat-square"></a>
```bash
npm install react-native-video-bilibili
```

### Captura de pantalla
<img src="https://github.com/1uokun/react-native-video-bilibili/blob/master/screenshot/overview.gif" style="width:40%">

### Vista explosionada de UX
<img src="https://github.com/1uokun/react-native-video-bilibili/blob/master/screenshot/ux.png" style="width:40%">

### Vista previa
|Expo SDK 50 | Web Online |
|--|--|
| [<img width="250" alt="expo-video-bilibili" src="https://github.com/1uokun/react-native-video-bilibili/assets/28673261/734bfe6f-28bd-4df5-9fd0-6a3b72b5c467" />](https://expo.dev/accounts/1uokun/projects/expo-video-bilibili) |https://1uokun.github.io/react-native-video-bilibili/index.html|

## Uso

```javascript
import Video from 'react-native-video-bilibili';

<Video
    ref={'player'}
    style={{width:"100%",height:300}}
    source={{uri: "https://media.w3.org/2010/05/sintel/trailer.mp4"}}
/>
```

## Props configurables

 * [...video.props][1]
 * containerStyle
    
   *estilo del contenedor*
 * style
   
   *estilo de react-native-video*
   
 * styles
 
   fusionado profundamente con [VideoPlayerStyles][7]
 * lock🔒
 
   **🌟Bloquea todas las operaciones🌟**
 * [Custom Menus Component](#custom-menus-component)
    
    |Propiedad|Tipo|Argumentos|Descripción|
    |----|----|----|----|
    |renderCenterMenus|node|[state,props](#state-props)|Componentes mostrados en el centro del reproductor, como control de volumen o brillo|
    |renderTopMenus|node|[state,props](#state-props)|Componentes mostrados en la parte superior del reproductor, como título o control de navegación|
    |renderBottomMenus|node|[state,props](#state-props)|Componentes mostrados en la parte inferior del reproductor, como barra de búsqueda o control de tiempo|
    |renderSeekTime|node|[state,props](#state-props)|Componentes mostrados al deslizar izquierda/derecha, como muestra de frames|
    |renderLoading|node|[state,props](#state-props)|Componentes mostrados mientras el video carga (buffering)|
    |children|function|[state,props](#state-props)|`({state,props})=>(<View></View>)`|

    ##### state props
    Pasa todo el `state` y los `props` externos del componente padre `<Provider>` al componente hijo `<Consumer>` basado en [context API][4]

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
## Props de Eventos
 - [...video.props][2]
 - setFullScreen()
 - setNavigator()
 - setSetting()
 
### Manipulación Directa via Ref
 - [...video methods][3]
    ```javascript
       this.player._root.doSth()
    ```
 - setPaused()
    
 - showMenusComponent()
 - showSeekTimerComponent()
 - <del>onOrientationChange({width,height})</del>
 
## Lista de tareas (Todo-list)

#### 1.0

 - [x] [Sistema de Respuesta a Gestos][5]👆
   - Deslizar izquierda/derecha para progreso
   - Deslizar arriba/abajo para brillo (izquierda) / volumen (derecha)
   - Mantener presionado para acelerar
   - Doble toque para pausar
 - [x] [Componente Animado][6]🏄
 - [x] Componente de Menús
 - [x] Componente de Carga (Loading)

#### 1.1

 - [x] añadir props `lock`
 - [x] añadir props `children`

#### 2.0 Características futuras (versión 💰 de pago)

 - [x] Control de volumen nativo
 - [x] Control de brillo nativo
 - [x] Danmaku (comentarios flotantes)



  [1]: https://github.com/react-native-community/react-native-video#configurable-props
  [2]: https://github.com/react-native-community/react-native-video#event-props
  [3]: https://github.com/react-native-community/react-native-video#methods-1
  [4]: https://reactjs.org/docs/context.html
  [5]: https://github.com/1uokun/react-native-video-bilibili/blob/master/lib/ResponderView.js
  [6]: https://github.com/1uokun/react-native-video-bilibili/blob/master/lib/AnimatedComponent.js
  [7]: https://github.com/1uokun/react-native-video-bilibili/blob/master/lib/style/index.js
