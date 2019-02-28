
// Google sign-in function 
function onSignIn(googleUser) {

    // Useful data for your client-side scripts:
    const profile = googleUser.getBasicProfile();
    const userObj = {
        userName: profile.getName(),
        email: profile.getEmail()
    }
    console.log(userObj)

    // ajax call to add users
    $.ajax({
        method: "POST",
        url: '/user',
        data: userObj
    })
    .then((data) => { 
        console.log(data)
        localStorage.setItem("userDetail", JSON.stringify({ userId: data.id,userName: data.userName}));
        window.location.href = '/userPage/'+data.id
    })
    .catch(err => console.log(err))

}

$(document).ready(() => {

    // Get user id from the local storage.
    // let userId = JSON.parse(localStorage.getItem("userId"));

    // The API object contains methods for each kind of request we'll make
    // var API = {
    //   saveUser: function (user) {
    //     return $.ajax({
    //       headers: {
    //         "Content-Type": "application/json"
    //       },
    //       type: "POST",
    //       url: "api/users",
    //       data: JSON.stringify(user)
    //     })
    //   }
    // };



    //Google sign in script from docs
    // function onSignIn(googleUser) {

    //   // Useful data for your client-side scripts:
    //   var profile = googleUser.getBasicProfile();

    //   // The ID token you need to pass to your backend:
    //   var id_token = googleUser.getAuthResponse().id_token;

    //   // User data from google account
    //   var userObject = {
    //     FullName: profile.getName(),
    //     email: profile.getEmail()
    //   }
    //   console.log(userObject)
    // ajax call to add notes
    //   $.ajax({
    //     method: "POST",
    //     url: '/users',
    //     data: {
    //         user: $(user).val().trim(),
    //         note: $(note).val().trim()
    //     }
    // })
    //     .then((data) => { window.location.href = '/' })
    //     .catch(err => console.log(err))

    // API call to get the data from backend and redirect to logged in page
    //   API.saveUser(userObject).then(function (dbuser) {
    // localStorage.setItem("userId", JSON.stringify({ userId: dbuser[0].id }));
    //     window.location.href = "/userPage";
    //   })
    // }

    $('.collapsible').collapsible();

    // add note button event handler
    $(document).on("click", ".addNote", function (e) {
        e.preventDefault()
        const id = $(this).data("id")
        const user = "#user-" + id;
        const note = "#note-" + id;

        // ajax call to add notes
        $.ajax({
            method: "POST",
            url: '/articles/' + id,
            data: {
                user: $(user).val().trim(),
                note: $(note).val().trim()
            }
        })
            .then((data) => { window.location.href = '/' })
            .catch(err => console.log(err))
    })

});