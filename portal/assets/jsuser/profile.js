// Back to Login
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        location.replace("login.html")
    }
    loadUser();
})

function loadUser() {
    const user = firebase.auth().currentUser;
    const UserName = user.displayName;
    const UserEmail = user.email;
    const UserRoll_No = user.photoURL;

    // Profile Name
    document.getElementById("user-name-card").innerHTML = UserName + " / " + UserRoll_No;

    // Profile Forms
    document.getElementById("profile-email").value = UserEmail;
    document.getElementById("new-name").value = UserName;
    document.getElementById("new-phone").value = UserRoll_No;

    //Tickets Form
    document.getElementById("u_roll").value = UserRoll_No;
    document.getElementById("u_name").value = UserName;

    // CStore Form
    document.getElementById("cstore_roll").value = UserRoll_No;
    document.getElementById("cstore_name").value = UserName;

    // Calculate Certificates Issued
    firebase.database().ref('Students/' + UserRoll_No).on('value', function (snapshot) {
        data = snapshot.val();
        document.getElementById("total_certificates_issued").innerHTML = data.No;
    });

    // Calculate Certificates Added
    firebase.database().ref('CStore/' + UserRoll_No).on('value', function (snapshot) {
        document.getElementById("total_certificates_issued_cstore").innerHTML = snapshot.numChildren();

    });

    //My Certificates
    viewStudent(UserRoll_No);

    //CStore
    getCStoreCertificates(UserRoll_No);

    //Tickets
    getTicketsDetails(UserRoll_No);
    calculateTickets(UserRoll_No);
}

// Logout Function with Prompt
function logoutwithprompt() {
    Swal.fire({
        icon: 'question',
        title: 'Are you sure you want to logout?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`
    }).then((result) => {
        if (result.isConfirmed) {
            firebase.auth().signOut()
        }
    })
}
function logout() {
    firebase.auth().signOut()
}


// Change Password Function
function changePass() {
    var Alert = document.getElementById("profileCredentialAlert");
    const newPassword = document.getElementById("new-password").value;
    if (newPassword != "") {
        document.getElementById("changePassButton").disabled = true;
        document.getElementById("changePassButton").value = 'Loading..';
        const user = firebase.auth().currentUser;
        user.updatePassword(newPassword).then(() => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Password Updated Successfully!</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
            document.getElementById("changePassButton").value = 'Successful';
            setTimeout(logout, 5000)

        }).catch((error) => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>${error.message}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
            document.getElementById("changePassButton").value = 'Try Again';
        });
    }
    else {
        AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Enter a Valid Password</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        Alert.innerHTML += AlertText;
    }
}

// Update Email Function
function updateemail() {
    var Alert = document.getElementById("profileCredentialAlert");
    const email = document.getElementById("newemail").value;
    if (email != "") {
        document.getElementById("updateemailButton").disabled = true;
        document.getElementById("updateemailButton").value = 'Loading..';
        const user = firebase.auth().currentUser;
        user.updateEmail(email).then(() => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Email Updated Successfully!</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
            window.setTimeout(function () { location.reload() }, 3000)
        }).catch((error) => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>${error.message}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
        });
    }
    else {
        AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Enter a Valid Email Address</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        Alert.innerHTML += AlertText;
    }
}

// Update Name Function
function updatename() {
    var Alert = document.getElementById("profileUpdateAlert");
    const name = document.getElementById("new-name").value;
    if (name != "") {
        document.getElementById("updatenameButton").disabled = true;
        document.getElementById("updatenameButton").value = 'Loading..';
        const user = firebase.auth().currentUser;
        user.updateProfile({
            displayName: name
        }).then(() => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Name Updated Successfully</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
        }).catch((error) => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>${error.message}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
        });
    }
    else {
        AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Enter a Valid Name</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        Alert.innerHTML += AlertText;
    }
}

//Update Roll No Function
function updatephone() {
    var Alert = document.getElementById("profileUpdateAlert");
    const phone = document.getElementById("new-phone").value;
    if (phone != "") {
        document.getElementById("updatephoneButton").disabled = true;
        document.getElementById("updatephoneButton").value = 'Loading..';
        const user = firebase.auth().currentUser;
        user.updateProfile({
            photoURL: phone
        }).then(() => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Roll No Updated Successfully</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
        }).catch((error) => {
            AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>${error.message}</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
            Alert.innerHTML += AlertText;
        });
    }
    else {
        AlertText = `
            <div class="alert alert-secondary  alert-dismissible fade show text-center mb-1" role="alert">
                <strong>Enter a Valid Roll No</strong>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>`;
        Alert.innerHTML += AlertText;
    }

}

// Delete Profile Function
function deleteprofile() {
    var A = confirm("Are you sure you want to delete your profile?");
    if (A == true) {
        const user = firebase.auth().currentUser;
        user.delete().then(() => {
            Toast.fire({ icon: 'success', title: 'Profile Deleted Successfully!' });
            alert("Profile Deleted Successfully")
        }).catch((error) => {
            Toast.fire({ icon: 'error', title: error.message });
        });
    }

}