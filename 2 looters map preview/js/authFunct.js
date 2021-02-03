let authFunct =
{
    ids: {
        login: "authInputLogin",
        pass: "authInputPass",
        newUser: "authNewUserButt",
        submitButt: "authTry",
        submitButtImg: "authTryButtImg",
        errorField: "authErrText",
    },

    isAuthorized: false,

    tryAuth() {
        let login = document.getElementById(authFunct.ids.login).value.trim();
        let pass = document.getElementById(authFunct.ids.pass).value.trim();

        $.get('php/auth.php', {login: login, pass: pass}, function (result) {
            authFunct.isAuthorized = $.parseJSON(result).answer === "done";
            $('#authErrText').html(authFunct.isAuthorized ? "Successful" : "Wrong login or password");
            $('#authErrText').removeClass(authFunct.isAuthorized ?'redAuthErr':'greenAuthErr').addClass(authFunct.isAuthorized ?'greenAuthErr':'redAuthErr');
        });
    },

    tryRegister() {
        let login = document.getElementById(authFunct.ids.login).value.trim();
        let pass = document.getElementById(authFunct.ids.pass).value.trim();

        $.get('php/register.php', {login: login, pass: pass}, function (result) {
            authFunct.isAuthorized = $.parseJSON(result).answer === "done";
            $('#authErrText').html(authFunct.isAuthorized ? "Successful" : "Login is busy");
            $('#authErrText').removeClass(authFunct.isAuthorized ?'redAuthErr':'greenAuthErr').addClass(authFunct.isAuthorized ?'greenAuthErr':'redAuthErr');
        });
    },

    submitClicked(){
        let animEl = document.getElementById(authFunct.ids.submitButtImg);
        animEl.style.animation = 'none';
        animEl.offsetHeight; /* trigger reflow */
        animEl.style.animation = "1s linear 0s 1 normal none running spin";

        // add checks
        let login = document.getElementById(authFunct.ids.login).value.trim();
        let pass = document.getElementById(authFunct.ids.pass).value.trim();
        if (login.length >= 5 && pass.length >= 3)
        {
            if($("#" + authFunct.ids.newUser).is('.checked'))
                authFunct.tryRegister();
            else
                authFunct.tryAuth();

        }
        else
        {
            $('#authErrText').html("Too short " + (login.length >= 5 ? "password" : "login"));
            $('#authErrText').removeClass('greenAuthErr').addClass('redAuthErr');
        }
    },
}