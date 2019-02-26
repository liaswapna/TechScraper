$(document).ready(() => {
    $('.collapsible').collapsible();
    $(document).on("click", ".addNote", function (e) {
        e.preventDefault()
        const id = $(this).data("id")
        const user = "#user-" + id;
        const note = "#note-" + id;
        // const note = $(id).val().trim();
        // console.log($("#note").val())
        const datas = {
            user: $(user).val().trim(),
            note: $(note).val().trim()
        }
        console.log(datas)
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