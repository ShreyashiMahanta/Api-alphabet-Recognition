import  React,{Component} from 'react';
import { 
    StyleSheet,
    View,
    Button
} from 'react-native';
import ImagePicker from 'expo-image-picker';
import Permissions from 'expo-permissions';

export default class ImageApp extends React.Component{
    state = {
        image : null
    }

getPermissionsForImage = async ()=>{
    if(Platform.OS !== 'android')
{
    const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted'){
        alert("We will need camera permissions to access your camera roll.")
        }
    }

}

pickImage = async () =>{
    try{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaType: ImagePicker.MediaTypeOptions.All,
            allowsEditing : true,
            aspect : [12,8],
            quality : 1
        })
        if(!results.cancelled){
            this.setState({
                image : result.data
            })
            console.log(result.uri)
            this.uploadImage(result.uri)
        }
    }
    catch(err){
        console.log(err)
    }
}

uploadImage = async (uri) =>{
    const data = new FormData()
    let filename = uri.split('/')[uri.split('/').length]
    let type =   `image/${uri.split('.')[uri.split('.').lenght - 1]}`
    const uploadFile = {
     uri : uri,
     name : filename,
     type : type
    }
    data.append("Alphabet",uploadFile)
    fetch('https://5459843be0f5.ngrok.io',{
        method = "POST",
        body = data,
        header = {'content-type' : 'multipart/form-data'}
    }).then(response => {response.json()}).then(result => {
        console.log("Yay!Success",result)
    }).catch((err)=>{
        console.log(err)
    })
}

componentDidMount(){
    this.getPermissionsForImage();
}
    render() {
        let {image} = this.state
        return(
            <View style = {styles.view}>

                <Button
                onPress={this.pickImage}
                title = "Pick an image from the camera roll"
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    view : {
        flex : 1,
        alingnItems : 'center',
        justifyContent : 'center'
    }
})