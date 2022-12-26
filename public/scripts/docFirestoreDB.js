const doctorDetails = document.querySelector('.doctorDetails');
const ud = document.getElementById("ud")
const ypd = document.getElementById("ypd")
const editProfile = document.querySelector('#editProfile');

function createUserCollection(user) {
    firebase.firestore().collection('doctors').doc(user.uid).set({
        role: "doctor",
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        phone: "",
        speciality: "",
        portfolioURL: "",
        experience:""
    })
}

async function getUserInfo(userID) {
    if (userID) {
        const userInfoSnap = await firebase.firestore().collection('users').doc(userID).get()
        const userInfo = userInfoSnap.data()
        if (userInfo) {
            doctorDetails.innerHTML = `
        <div class="card" style="width: 24rem;height: 600px;">
            <img id="proimg" src="./assets/student.png" class="card-img-top" alt="..." style="height: 380px;">
            <div class="card-body">
                <h5 class="card-title"><h3>${userInfo.name}</h3></h5>
                <p class="card-text">                
                <ul>
                    <li>Email: ${userInfo.email}</li>
                    <li>Phone: ${userInfo.phone}</li>           
                </ul>
                </p>
                <a href="#" class="btn btn-primary">Profile</a>
            </div>
        </div>
        `
        }
    }
    else {
        doctorDetails.innerHTML = `
        <h3>Please login</h3>
        `
    }
}

async function getUserInfoRealTime(userID) {
    if (userID) {
        const userDocRef = await firebase.firestore().collection('doctors').doc(userID)
        userDocRef.onSnapshot((doc) => {
            if (doc.exists) {
                const userInfo = doc.data()
                if (userInfo) {
                    doctorDetails.innerHTML = `
                <div class="card" style="width: 24rem;height: 650px;">
                    <img id="proimg" src="./assets/student.png" class="card-img-top rounded-circle" alt="..." style="height: 380px;">
                    <div class="card-body">
                        <h5 class="card-title"><h3>${userInfo.name}</h3></h5>
                        <p class="card-text">                
                        <ul>
                            <li class="list-group-item">Email: ${userInfo.email}</li>
                            <li class="list-group-item">Phone: ${userInfo.phone}</li>           
                            <li class="list-group-item">experience: ${userInfo.experience}</li>           
                            <li class="list-group-item">portfolio url: <a href="${userInfo.portfolioURL}"> open </a> </li>           
                            <li class="list-group-item">speciality: ${userInfo.speciality}</li>           
                        </ul>
                        </p>
                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                            Edit Profile
                        </button>
                    </div>
                </div>
                `

                editProfile["name"].value = userInfo.name
                editProfile["phoneNo"].value = userInfo.phone
                editProfile["experience"].value = userInfo.experience
                editProfile["portfolio url"].value = userInfo.portfolioURL
                editProfile["speciality"].value = userInfo.speciality

                if(firebase.auth().currentUser.photoURL){
                    console.log(document.querySelector('#proimg'))
                    document.querySelector('#proimg').src = firebase.auth().currentUser.photoURL
                }
                }
            }
        })
    }
    else {
        doctorDetails.innerHTML = `
        <h3>Please login</h3>
        `
    }
}

function updateUserProfile(e){
    e.preventDefault();
    const userDocRef = firebase.firestore().collection('doctors').doc(firebase.auth().currentUser.uid)
    userDocRef.update({
        name:editProfile["name"].value,
        phone:editProfile["phoneNo"].value,
        experience:editProfile["experience"].value,
        portfolioURL:editProfile["portfolio url"].value,
        speciality:editProfile["speciality"].value
    })
}

function uploadImage(e){
    console.log(e.target.files[0]);
    const uid=firebase.auth().currentUser.uid
    const fileRef = firebase.storage().ref().child(`/doctors/${uid}/profile`)
    const uploadTask = fileRef.put(e.target.files[0]);

    uploadTask.on('state_changed', 
  (snapshot) => {
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    if(progress==100){
        alert('uploaded')
    }
    
  }, 
  (error) => {
    console.log(error);
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      console.log('File available at', downloadURL);
  document.querySelector('#proimg').src = downloadURL;
      firebase.auth().currentUser.updateProfile({
        photoURL:downloadURL
      })
    });
  }
);
}

function allUserDetails(){
    ud.style.display="block";
    ypd.style.display="block";
    const userRef = firebase.firestore().collection("users")
    var unsubscribeUser = userRef.onSnapshot(querySnap=>{
        querySnap.docs.forEach(doc=>{
            const info = doc.data()
            console.log(info);
            ud.innerHTML += `<div class="card" style="width: 18rem;">
            <div class="card-body">
            <button type="submit" onclick="" class="btn btn-primary mb-4">
                Add new Record
            </button>
              <h5 class="card-title">Name - ${info.name}</h5>
              <ul class="list-group">
                    <li class="list-group-item">Email - ${info.email}</li>
                    <li class="list-group-item">Experience - ${info.experience}</li>
                    <li class="list-group-item">Phone - ${info.phone}</li>
                    <li class="list-group-item">Speciality - ${info.speciality}</li>
             </ul>
             <a href="${info.portfolioURL}" class="btn btn-primary">open</a>
            </div>
          </div>`
        })
    })
}

function hideAllUserDetails(){
    ud.style.display="none";
    ypd.style.display="none";
}