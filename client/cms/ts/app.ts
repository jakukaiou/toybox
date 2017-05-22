import FirebaseControl from './../../firebase/fireBaseControl';

class ToyBoxApp {
    public firebase:FirebaseControl;

    constructor(){
        console.log("client/cms/index.js");
        this.firebase = new FirebaseControl();

        window.onload = ()=>{
            console.log('this is awesome app');
        }
    }
}

new ToyBoxApp();