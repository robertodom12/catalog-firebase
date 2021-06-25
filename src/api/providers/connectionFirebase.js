import admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert({}),
    databaseURL: '',
    storageBucket : ''
});


function firestore(){
    return admin.firestore()
}

function storage(){
    return admin.storage().bucket()
}

export {
    firestore,
    storage
}