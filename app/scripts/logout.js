$(function () {
    var valido = localStorage.getItem('ticket') !== null ? true : false;
    if (valido) {
        localStorage.removeItem('ticket');
        localStorage.removeItem('user');
        localStorage.removeItem('session');
        Notificacion('info', 'top left', 'Sesión cerrada', 'Su cuenta de usuario ha sido cerrada correctamente.');
        console.log('El token fue removido del cliente y su sesión fue cerrada.')
        ViewLogin();
    }
    else {
        localStorage.removeItem('ticket');
        localStorage.removeItem('user');
        localStorage.removeItem('session');
        Notificacion('black', 'top left', 'Bienvenido', 'Ingrese sus credenciales para iniciar una sesión.');
        console.log('No se encontro ningún token válido, no hay ninguna sesión.')
        ViewLogin();
    }
});

function ViewLogin() {
    var data = {};
    var jqxhr = $.ajax({
        beforeSend: function () {
            GetUserImage();
            GetUserInfo();
            GetUserMenu();
        },
        type: "GET",
        url: "views/cuenta/login.html",
        data: {},
        dataType: "html",
        contentType: "application/html; charset=utf-8"
    });
    jqxhr.done(function (p) {
        $('#vistas').empty();
        $.template('login', p);
        $.tmpl('login', data).appendTo('#vistas');
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function GetUserInfo() {
    var data = {};
    var jqxhr = $.ajax({
        beforeSend: function () {
        },
        type: "GET",
        url: "views/logout/user-info.html",
        data: {},
        dataType: "html",
        contentType: "application/html; charset=utf-8"
    });
    jqxhr.done(function (p) {
        $('#user-info').empty();
        $.template('info', p);
        $.tmpl('info', data).appendTo('#user-info');
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function GetUserImage() {
    var data = {};
    var jqxhr = $.ajax({
        beforeSend: function () {
        },
        type: "GET",
        url: "views/logout/user-image.html",
        data: {},
        dataType: "html",
        contentType: "application/html; charset=utf-8"
    });
    jqxhr.done(function (p) {
        $('#user-image').empty();
        $.template('image', p);
        $.tmpl('image', data).appendTo('#user-image');
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function GetUserMenu() {
    var data = {};
    var jqxhr = $.ajax({
        beforeSend: function () {
        },
        type: "GET",
        url: "views/logout/user-menu.html",
        data: {},
        dataType: "html",
        contentType: "application/html; charset=utf-8"
    });
    jqxhr.done(function (p) {
        $('#user-menu').empty();
        $.template('menu', p);
        $.tmpl('menu', data).appendTo('#user-menu');
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function Notificacion(tipo, posicion, titulo, mensaje) {
    //tipo:info,success,warning,error,black,white
    //posicion: bottom left, bottom right, top left, top right
    $.Notification.notify(
        tipo,
        posicion,
        titulo,
        mensaje
    )
}