$(document).ready(() => {
    $('.collapsible').collapsible();

    let userDetail = JSON.parse(localStorage.getItem("userDetail"));
    $("#welcome").text("Saved articles of " + userDetail.userName)

    // add note button event handler
    $(document).on("click", ".addNote", function (e) {
        e.preventDefault()
        const id = $(this).data("id")
        const user = "#user-" + id;
        const note = "#note-" + id;
        const datas = {
            user: $(user).val().trim(),
            note: $(note).val().trim()
        }
        
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