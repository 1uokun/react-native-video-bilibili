import React from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'
import ResponderView from './lib/ResponderView'

class VideoPlayer extends React.PureComponent {
    constructor(props){
        super(props);
        this.state={
            content:''
        }
    }

    componentDidMount() {
        setInterval(()=>{
            this.setState({content:'asd'})
        },1000)
    }

    render(){
        return (
            <View ref={'container'}
                  style={styles.container}
            >
                <ResponderView>
                    <Text>{this.state.content}</Text>
                </ResponderView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:'33%',
        minHeight: 200,
        backgroundColor:'#000'
    }
});

export default VideoPlayer
