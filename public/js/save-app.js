$(document).ready(() => {
    $('.collapsible').collapsible();

    let userDetail = JSON.parse(localStorage.getItem("userDetail"));
    $("#welcome").text("Saved articles of " + userDetail.userName)

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
            url: '/addUserNoteSavePage/'+userId+'/'+articleId,
            data: data
        })
            .then((data) => { window.location.href = '/savePage/'+userDetail.userId })
            .catch(err => console.log(err))
    })

    
});