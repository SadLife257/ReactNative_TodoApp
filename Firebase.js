import * as firebase from "firebase/compat";

const firebaseConfig = {
    apiKey: "AIzaSyDL7tcNJbaabTFeaX9JTAs0LptMztgO6V0",
    authDomain: "reacttodoapp-a82d1.firebaseapp.com",
    projectId: "reacttodoapp-a82d1",
    storageBucket: "reacttodoapp-a82d1.appspot.com",
    messagingSenderId: "157509406216",
    appId: "1:157509406216:web:b713cd064d732f0ece4bbd",
    measurementId: "G-QWVB4RQ5J6"
};

class Firebase {
    constructor(callback) {
        this.init(callback)
    }

    init(callback) {
        if(!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        firebase.auth().onAuthStateChanged(user => {
            if(user){
                callback(null, user)
            }
            else {
                firebase.auth()
                        .signInAnonymously()
                        .catch(error => {
                            callback(error)
                        });
            }
        });
    }

    getLists(callback) {
        let ref = this.ref.orderBy('name')

        this.unsubsrice = ref.onSnapshot(snapshot => {
            lists = [];

            snapshot.forEach(doc => {
                lists.push({id: doc.id, ...doc.data()});
            });

            callback(lists);
        })
    }

    addList(list) {
        let ref = this.ref;

        ref.add(list);
    }

    updateList(list) {
        let ref = this.ref;

        ref.doc(list.id).update(list);
    }

    deleteList(list){
        let ref = this.ref;

        ref.doc(list.id).delete()
    }

    get userId() {
        return firebase.auth().currentUser.uid;
    }

    get ref() {
        return firebase.firestore()
                       .collection("users")
                       .doc(this.userId)
                       .collection("lists")
    }

    detach() {
        this.unsubsrice();
    }
}

export default Firebase;