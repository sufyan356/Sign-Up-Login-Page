var showPassword = document.getElementById("passwordChecked");
var formDiv = document.querySelector(".formDiv");
var latestEmail;
var latestPassword;

function showPasswordFunction() {
    var signUpPassword = document.getElementById("password");

    if (signUpPassword.type === "password") {
        signUpPassword.type = "text";
        var showAndHidePass = document.querySelector(".showAndHidePass");
        showAndHidePass.innerHTML = "HIDE PASSWORD";
    } else {
        signUpPassword.type = "password";
        var showAndHidePass = document.querySelector(".showAndHidePass");
        showAndHidePass.innerHTML = "SHOW PASSWORD";
    }
}
function signUpFunction(event) {
    var signUpEmail = document.getElementById("email").value;
    var signUpPassword = document.getElementById("password").value;
    event.preventDefault();
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(signUpEmail)) {
        swal("Invalid Email!..", "Please Enter Correct Format", "error");
    } 

    else if (signUpPassword.length < 8) {
        swal("Invalid Password!..", "At least 8 characters", "error");
    } 

    else {
        // Check for duplicate email
        const usersData = localStorage.getItem("users");
        let getUsersData = usersData ? JSON.parse(usersData) : []
        let checkEmailStatus = 0;
        let checkPasswordStatus = 0;
        getUsersData.forEach(function(ele){
            if ( ele.email === signUpEmail ) {
                checkEmailStatus = 1;
            }
            if( ele.password === signUpPassword ){
                checkPasswordStatus = 1;
            }
        });

        if (checkEmailStatus) {
            swal("Email Already Exist!..", "Please Enter Valid Email", "error");
        } 
         else{

            if(checkPasswordStatus){
                swal("Password Already Exist!..", "Please Enter Valid Password", "error");
            }
            else{
                console.log("Email is successfully registered");

                    var usersRecord = {
                        email: signUpEmail,
                        password: signUpPassword
                    };

                    // Encrypt Password Here: 
                    let hash = ".E31e20]QDhn";
                    let password = usersRecord.password;
                    const encrypted = CryptoJS.AES.encrypt(password, hash).toString();
                    usersRecord.password = encrypted;
                    getUsersData.push(usersRecord);

                    localStorage.setItem("users", JSON.stringify(getUsersData))
                    setTimeout(function () {
                        location.href = 'signIn.html';
                    }, 4000);

                    swal({
                        title: "Sign Up Successfully!",
                        icon: "success",
                    });
            }
            
        } 
    }
}


function signInFunction() {
    let signInEmail = document.getElementById("L_email").value ;
    let signInPassword = document.getElementById("password").value ;
    let checkEmailStatus = 0;
    const usersData = localStorage.getItem("users");
    let AllUser = usersData ? JSON.parse(usersData) : []

    AllUser.forEach(function (user) {
        try {
            let decrypted = CryptoJS.AES.decrypt(user.password, ".E31e20]QDhn").toString(CryptoJS.enc.Utf8);
            
            console.log(decrypted);
            if (user.email === signInEmail) {
                checkEmailStatus = 1;

                if (decrypted === signInPassword) {
                    swal("CONGRATULATIONS!", "Login Successfully!", "success");
                    localStorage.setItem("latestUser" , JSON.stringify(signInEmail))
                    setTimeout(function () {
                        location.href = 'welcomePage.html';
                    }, 2000);
                } else {
                    swal("Login Failed!", "Incorrect Password", "error");
                }
            }
        } catch (error) {
            console.log(error.message);
            console.log(error.code);

            alert('Error decrypting password. Invalid encryption key or corrupted data.');
            return;
        }
    });

// Check if the email was not found in the loop
if (checkEmailStatus === 0) {
    swal("Login Failed!", "Incorrect Email", "error");
}

}

function loginLink(){
    location.href = "signIn.html";
}
function signUpLink(){
    location.href = "index.html";
}