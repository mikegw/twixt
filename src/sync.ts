import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onChildAdded } from "firebase/database"


const firebaseConfig = {
  apiKey: "AIzaSyBiVEerDSeDFrUaTn8nbY58WAuPr6XtbcQ",
  authDomain: "mw-twixt.firebaseapp.com",
  databaseURL: "https://mw-twixt-default-rtdb.firebaseio.com",
  projectId: "mw-twixt",
  storageBucket: "mw-twixt.appspot.com",
  messagingSenderId: "1048357586138",
  appId: "1:1048357586138:web:652cab4962c73e83e5d1e3",
  measurementId: "G-2DV7T5RWJB"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();

const moves = ref(db, "moves")

export const writeData = (path: string, data: object) => {
  return push(ref(db, path), data)
}

export const subscribe = (path: string, callback: (data: object) => void) => {
  const subscription = ref(db, path)
  onChildAdded(subscription, snapshot => callback(snapshot.val()))
}
