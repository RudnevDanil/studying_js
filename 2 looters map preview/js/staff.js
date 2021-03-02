staffSettings = {
    lines: 2,
    elInLine: 10,
}

staffIds = {
    photo: "staffAddPhoto_", // + counter
    background: "staffAddPhotoBackground_", // + counter
    leftArrow: "staffAddPrevButt",
    rightArrow: "staffAddNextButt",
    removeButton: "staffAddRemoveUserButt",
    fullName: "staffAddPageName",
    position: "staffAddPagePosition",
    ban: "staffAddBannedButton",
}

staffState = {
    currentPage: 0,
    arr: [],
    loadingWait: 0,
    savingInProgress: false,
    loadingInProgress: false,
    removingInProgress: false,
    isBanned: false,
}

let actions_staff = {
    addShow()
    {
        if(!staffState.savingInProgress && !staffState.loadingInProgress && !staffState.removingInProgress && !loupeState.loadingInProgress)
        {
            document.getElementById("staffListPage").style.zIndex = "0";
            document.getElementById("staffAddPage").style.zIndex = "2";
            document.getElementById("staffAddRemoveUserButt").style.zIndex = "0";
            clearStuffAdd()

            if(facesState.checked.length != 0)
            {
                setBan(true);

                for(let i = 0; i < facesState.checked.length; i++)
                    if(facesState.checked[i])
                        staffState.arr.push($("#" + facesIds.img  + i).attr('src'))

                showAddStuffImages(staffState.currentPage)
            }
        }
    },

    listShow()
    {
        if(!staffState.savingInProgress && !staffState.loadingInProgress && !staffState.removingInProgress && !loupeState.loadingInProgress)
        {
            document.getElementById("staffAddPage").style.zIndex = "0";
            document.getElementById("staffListPage").style.zIndex = "2";
            loadLoupe()
        }
    },
}

function staffAddButBanClicked()
{
    if(!staffState.savingInProgress && !staffState.loadingInProgress && !staffState.removingInProgress && !loupeState.loadingInProgress)
    {
        $("#"+staffIds.ban).removeClass(staffState.isBanned ? 'staffBannedRed' : 'staffBannedGreen').addClass(staffState.isBanned ? 'staffBannedGreen' : 'staffBannedRed');
        $("#"+staffIds.ban).text(staffState.isBanned ? "Allow" : "Ban")
        staffState.isBanned = !staffState.isBanned;
    }
}

function setBan(ban)
{
    $("#"+staffIds.ban).removeClass(ban ? 'staffBannedGreen' : 'staffBannedRed').addClass(ban ? 'staffBannedRed' : 'staffBannedGreen');
    $("#"+staffIds.ban).text(ban ? "Ban" : "Allow")
    staffState.isBanned = ban;
}

function clearStuffAdd(isClearArray = true, isDrawImages = true)
{
    if(isClearArray)
    {
        staffState.currentPage = 0;
        staffState.arr = [];
        document.getElementById(staffIds.fullName).value = "";
        document.getElementById(staffIds.position).value = "";
    }

    for(let i = 0; i <  staffSettings.lines; i++)
        for(let j = 0; j < staffSettings.elInLine; j++)
            $("#" + staffIds.background + (i*staffSettings.elInLine + j)).css('z-index', 0)

    if(isDrawImages)
        showAddStuffImages(staffState.currentPage)

    $("#"+staffIds.removeButton).css('z-index', 0)
}

function removePerson()
{
    if(!staffState.savingInProgress && !staffState.loadingInProgress && !staffState.removingInProgress && !loupeState.loadingInProgress)
    {
        //let login = document.getElementById(authFunct.ids.login).value.trim();
        //let pass = document.getElementById(authFunct.ids.pass).value.trim();
        let login = 'admin', pass = '111'; // debug
        let fullName = document.getElementById(staffIds.fullName).value.trim();
        let position = document.getElementById(staffIds.position).value.trim();

        let butId = '#butRemovePerson'
        let imgId = '#imgDeletePerson'
        $(butId).removeClass('butNoFrame').addClass('butFrame');
        $(imgId).removeClass('imgNoFrame').addClass('imgFrame');
        $(butId).removeClass('butRedBorder').removeClass('butGreenBorder').addClass('butYellowBorder');
        $(butId).removeClass('allowedToTouch').addClass('notAllowedToTouch');
        staffState.removingInProgress = true;

        $.post('php/deleteCurrentStaff.php', {login: login, pass: pass, fullName: fullName, position: position}, function (result)
        {
            if(result !== "")
            {
                result = $.parseJSON(result);
                if(result.answer === "done")
                {
                    $(butId).removeClass('butRedBorder').removeClass('butYellowBorder').addClass('butGreenBorder');
                }
                else
                    $(butId).removeClass('butGreenBorder').removeClass('butYellowBorder').addClass('butRedBorder');
            }
            else
                $(butId).removeClass('butGreenBorder').removeClass('butYellowBorder').addClass('butRedBorder');
            $(butId).removeClass('notAllowedToTouch').addClass('allowedToTouch');
            setTimeout(() => {
                $(butId).removeClass('butFrame').addClass('butNoFrame');
                $(imgId).removeClass('imgFrame').addClass('imgNoFrame');
                $(butId).removeClass('butGreenBorder').removeClass('butYellowBorder').removeClass('butRedBorder');
                staffState.removingInProgress = false;
                clearStuffAdd()
                loadStaffList();
            }, 1000);
        });

    }
}

function saveNewPerson()
{
    if(!staffState.savingInProgress && !staffState.loadingInProgress && !staffState.removingInProgress && !loupeState.loadingInProgress)
    {
        //let login = document.getElementById(authFunct.ids.login).value.trim();
        //let pass = document.getElementById(authFunct.ids.pass).value.trim();
        let login = 'admin', pass = '111'; // debug

        let fullName = document.getElementById(staffIds.fullName).value.trim();
        let position = document.getElementById(staffIds.position).value.trim();

        let butId = '#butSaveNewPerson'
        let imgId = '#imgSaveNewPerson'
        $(butId).removeClass('butNoFrame').addClass('butFrame');
        $(imgId).removeClass('imgNoFrame').addClass('imgFrame');
        $(butId).removeClass('butRedBorder').removeClass('butGreenBorder').addClass('butYellowBorder');
        $(butId).removeClass('allowedToTouch').addClass('notAllowedToTouch');
        staffState.savingInProgress = true;
        $.post('php/saveNewStaff.php', {login: login, pass: pass, fullName: fullName, position: position,isBanned: staffState.isBanned ,arr: staffState.arr}, function (result)
        {
            if(result !== "")
            {
                result = $.parseJSON(result);
                if(result.answer === "saving success")
                {
                    $(butId).removeClass('butRedBorder').removeClass('butYellowBorder').addClass('butGreenBorder');
                    clearStuffAdd()
                    loadStaffList();
                    if(facesState.checked.length != 0) {
                        facesRemoveClicked();
                    }
                }
                else
                    $(butId).removeClass('butGreenBorder').removeClass('butYellowBorder').addClass('butRedBorder');
            }
            else
                $(butId).removeClass('butGreenBorder').removeClass('butYellowBorder').addClass('butRedBorder');
            $(butId).removeClass('notAllowedToTouch').addClass('allowedToTouch');
            setTimeout(() => {
                $(butId).removeClass('butFrame').addClass('butNoFrame');
                $(imgId).removeClass('imgFrame').addClass('imgNoFrame');
                $(butId).removeClass('butGreenBorder').removeClass('butYellowBorder').removeClass('butRedBorder');
                staffState.savingInProgress = false;
            }, 3000);
        });
    }
}

function openStaffCard(fullName)
{
    if(fullName === "" || fullName === "loading ...") return false;

    actions_staff.addShow();
    staffState.loadingInProgress = true;
    document.getElementById(staffIds.fullName).value = "loading ...";
    document.getElementById(staffIds.position).value = "loading ...";

    $.get('php/loadStaffCard.php', {login: login, pass: pass, full_name: fullName}, function (result)
    {
        result = $.parseJSON(result);
        if(result.answer === "done")
        {
            for(let val in result.arr)
                staffState.arr.push(result.arr[val][0])

            if(facesState.checked.length != 0) {
                facesRemoveClicked();
            }

            showAddStuffImages(staffState.currentPage)
            document.getElementById(staffIds.fullName).value = result.full_name;
            document.getElementById(staffIds.position).value = result.position;
            setBan(result.isBanned === "1")
        }
        else
            console.log("Loading staff card error")
        staffState.loadingInProgress = false;
        $("#"+staffIds.removeButton).css('z-index', 2)
        $("#defaultOption").attr("selected", "selected");
    });
}

$("#" + ids.staffList).change(function() {openStaffCard($(this).val())});

function loadStaffList()
{
    $.get('php/loadStaffList.php', {login: login, pass: pass}, function (result) {
        result = $.parseJSON(result);
        if(result.answer === "done")
        {
            let listId = "#" + ids.staffList;
            $(listId).empty();

            let keys = [];
            let optgroups = [];
            for(let j = 0; j < result.arr.length; j++)
            {
                let index = keys.indexOf(result.arr[j][1], 0);
                if(index === -1)
                {
                    keys.push(result.arr[j][1])
                    optgroups.push([]);
                    index = keys.indexOf(result.arr[j][1], 0);
                }
                optgroups[index].push(result.arr[j][0])
            }
            $(listId).append("<option id='defaultOption'></option>");
            for(let key of keys.values())
            {
                let str = "<optgroup label='" + key + "'>";
                let index = keys.indexOf(key, 0);
                for(let val of optgroups[index].values())
                    str += "<option>" + val + "</option>";
                str += "</optgroup>";
                $(listId).append(str);
            }

            $("#" + facesIds.staffListSelect).html($(listId).html())
        }
        else
            console.log("Loading staff list error")
    });
}

function removeImg(i,j)
{
    if(staffState.arr.length !== 0)
    {
        staffState.arr.splice(staffSettings.elInLine * staffSettings.lines * staffState.currentPage + i * staffSettings.elInLine + j, 1)
        if(staffState.currentPage * staffSettings.elInLine * staffSettings.lines === staffState.arr.length && staffState.arr.length !== 0)
            staffState.currentPage -= 1;
        showAddStuffImages(staffState.currentPage)
    }
}

function staffAddNextPage()
{
    showAddStuffImages(staffState.currentPage + 1)
}

function staffAddPrevPage()
{
    showAddStuffImages(staffState.currentPage - 1 )
}

function showAddStuffImages(page)
{
    if(staffState.arr.length === 0)
    {
        $("#staffAddPhoto_0").attr('src', './data/photoPlaceholder.jpg');
        $("#" + staffIds.background + (0)).css('z-index', 2)
        return
    }

    clearStuffAdd(false,false)

    let els = staffSettings.lines * staffSettings.elInLine

    if (page === 0)
        $("#"+staffIds.leftArrow).css('z-index', 0)
    else
        $("#"+staffIds.leftArrow).css('z-index', 2)

    if ((page + 1) * els >= staffState.arr.length)
        $("#"+staffIds.rightArrow).css('z-index', 0)
    else
        $("#"+staffIds.rightArrow).css('z-index', 2)

    staffState.currentPage = page

    for(let i = 0; i <  staffSettings.lines; i++)
    {
        for(let j = 0; j < staffSettings.elInLine; j++)
        {
            let counter = i*staffSettings.elInLine + j
            let k = counter + page * els
            if(k < staffState.arr.length)
            {
                $("#staffAddPhoto_" + counter).attr('src', staffState.arr[k]);
                $("#" + staffIds.background + (counter)).css('z-index', 2)
            }
        }
    }
}

$(".addPhoto").bind('change', function()
{
    console.log("opened " + this.files.length)
    staffState.loadingWait = this.files.length
    for(let i = 0; i < this.files.length; i++)
    {
        let fr = new FileReader();
        fr.addEventListener("load", function () {
            //$('#staffAddPhoto_0').attr('src', fr.result);
            staffState.loadingWait -= 1
            staffState.arr.push(fr.result)
            if(staffState.loadingWait === 0)
                showAddStuffImages(staffState.currentPage)
        }, false);
        fr.readAsDataURL(this.files[i]);
    }
});

// ------------------------ loupe ---------------------------
loupeSettings = {
    widthElements: 10,
    heightElements: 4,
}

loupeIds = {
    img: "staffListPhoto_",
    fullName: "staffListPersonName_",
    position: "staffListPersonPosition_",
    background: "photoCardList_",
    leftArrow: "staffListPrevButt",
    rightArrow: "staffListNextButt",
    loading: "staffLoupeLoading",
}

loupeState = {
    currentPage: 0,
}

function staffCardClicked(i)
{
    openStaffCard($("#"+loupeIds.fullName + i).text())
}

function loadLoupe(page = 1)
{
    if(!staffState.savingInProgress && !staffState.loadingInProgress && !staffState.removingInProgress && !loupeState.loadingInProgress)
    {
        //let login = document.getElementById(authFunct.ids.login).value.trim();
        //let pass = document.getElementById(authFunct.ids.pass).value.trim();
        let login = 'admin', pass = '111'; // debug

        let pageSize = loupeSettings.heightElements * loupeSettings.widthElements;

        for(let i = 0; i <  loupeSettings.widthElements; i++)
            for(let j = 0; j < loupeSettings.heightElements; j++)
                $("#" + loupeIds.background + (i*loupeSettings.heightElements + j)).css('z-index', 0)
        $("#"+loupeIds.leftArrow).css('z-index', 0)
        $("#"+loupeIds.rightArrow).css('z-index', 0)
        $("#"+loupeIds.loading).css('z-index', 2)

        $.get('php/loadLoupeList.php', {login: login, pass: pass, page: page, pageSize: pageSize}, function (result) {
            result = $.parseJSON(result);
            if(result.answer === "done")
            {
                loupeState.currentPage = page;
                if(page > 1)
                    $("#"+loupeIds.leftArrow).css('z-index', 2)
                if(page * pageSize  < result.count)
                    $("#"+loupeIds.rightArrow).css('z-index', 2)
                let counterLoupe = 0;
                for(let i in result.arr)
                {
                    $("#"+loupeIds.fullName + counterLoupe).text(result.arr[i][0])
                    $("#"+loupeIds.position + counterLoupe).text(result.arr[i][1])
                    $("#"+loupeIds.img  + counterLoupe).attr('src', result.arr[i][2]);
                    $("#" + loupeIds.background + (counterLoupe)).css('z-index', 2)
                    counterLoupe += 1;
                }
            }
            else
                console.log("Loading staff list error")
            $("#"+loupeIds.loading).css('z-index', 0)
        });
    }
}

function staffLoupePrevPage()
{
    if(loupeState.currentPage > 1)
    {
        loupeState.currentPage -= 1;
        loadLoupe(loupeState.currentPage)
    }
}

function staffLoupeNextPage()
{
    loupeState.currentPage += 1;
    loadLoupe(loupeState.currentPage)
}