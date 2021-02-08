let settings = {

}

let state = {

}

function init()
{


}

let ids = {
    go: "goBackground",
}

function goClicked(){
    $("#" + ids.go).removeClass('goNotBordered').addClass('goBordered');

    setTimeout(() => {
        $("#" + ids.go).removeClass('goBordered').addClass('goNotBordered');
    }, 1000);

}