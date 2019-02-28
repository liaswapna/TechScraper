
// Google sign-in function 
function onSignIn(googleUser) {

    // Useful data for your client-side scripts:
    const profile = googleUser.getBasicProfile();
    const userObj = {
        userName: profile.getName(),
        email: profile.getEmail()
    }

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
            url: '/articlesNote/' + id,
            data: {
                user: $(user).val().trim(),
                note: $(note).val().trim()
            }
        })
            .then((data) => { window.location.href = '/' })
            .catch(err => console.log(err))
    })

});