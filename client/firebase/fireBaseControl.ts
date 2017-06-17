import * as firebase from 'firebase';
import CONFIG from './config';

export default class FirebaseControl {
    public firebaseApp:firebase.app.App;
    public firebaseAuth:firebase.auth.Auth;
    public firebaseDB:firebase.database.Database;

    constructor(){
        this.firebaseApp = this.init();
        this.firebaseAuth = this.firebaseApp.auth();
        this.firebaseDB = this.firebaseApp.database();

        console.log('firebase ready');
    }

    private init(){
        return firebase.initializeApp({
                    apiKey: CONFIG.FIREBASE_APIKEY,
                    authDomain: CONFIG.FIREBASE_AUTHDOMAIN,
                    databaseURL: CONFIG.FIREBASE_DBURL,
                    projectId: CONFIG.FIREBASE_PROJECTID,
                    storageBucket: CONFIG.FIREBASE_SBUCKET,
                    messagingSenderId: CONFIG.FIREBASE_MESSAGINGID
                });
    }
}