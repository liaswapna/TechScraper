$(document).ready(() => {

    // Get user id from the local storage.
    let userDetail = JSON.parse(localStorage.getItem("userDetail"));
    $("#welcome").text("Welcome " + userDetail.userName)

    $('.collapsible').collapsible();

    // add note button event handler
    $(document).on("click", ".addNote", function (e) {
        e.preventDefault()
        const articleId = $(this).data("id")
        const userId = userDetail.userId
        const user = "#user-" + articleId;
        const note = "#note-" + articleId;
        const data = {
            user: $(user).val().trim(),
            note: $(note).val().trim()
        }
        console.log(articleId+"   "+userId)
        console.log(data)
        // ajax call to add notes
        $.ajax({
            method: "POST",
            url: '/addUserNote/'+userId+'/'+articleId,
            data: data
        })
            .then((data) => { window.location.href = '/userPage/'+userDetail.userId })
            .catch(err => console.log(err))
    })

    // Save the article
    $(document).on("click", ".saveArticle", function (e) {
        e.preventDefault()
        const data ={
            articleId: $(this).data("id"),
            userId: userDetail.userId
        }
        console.log(data)
        // ajax call to add notes
        $.ajax({
            method: "PUT",
            url: '/updateSave',
            data: data
        })
            .then((data) => {})
            .catch(err => console.log(err))
    })


    // User log out from google sign in  
    $("#logout").on("click", function () {
        function signOut() {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function () {
                alert("signed out");
            });
        }
        signOut();
        window.location.href = "/";
    });
});