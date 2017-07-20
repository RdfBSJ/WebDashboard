var server;

$(function () {
    server = Servidor();
    var valido = localStorage.getItem('ticket') !== null ? true : false;
    if (valido) {
        TrackingSession();
        var usr_exist = localStorage.getItem('user') !== null ? true : false;
        if (usr_exist) {
            NotificacionAutocerrada('success', 'top right', 'Sesión iniciada', 'Bienvenido a Indicadores Alaro.');
            ViewData();
            ControlMenuOpciones();
        }
        else {
            ViewLogout();
        }
    }
    else {
        ViewLogout();
    }
});

function TrackingSession() {
    var sesionid = localStorage.getItem('session');
    var usuario = {};
    var jqxhr = $.ajax({
        beforeSend: function () {
        },
        type: 'GET',
        url: 'http://' + server + '/APIAlaro/Cliente/Autenticacion.svc/Sesion/' + sesionid,
        data: usuario,
        crossDomain: true,
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('ticket')
        }
    });
    jqxhr.done(function (data) {
        if (data.Autenticado) {
            localStorage.setItem('user', window.btoa(JSON.stringify(data)));
        }
        else {
            ViewLogout();
        }
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function ControlMenuOpciones() {
    $('body').on('click', '.referencias a', function (e) {
        e.preventDefault();
        var accion = $(this).attr('data-action');
        switch (accion) {
            case 'gasto':
                ViewDataDrilldown();
                break;
            case 'gasto-utilidad':
                ViewData();
                break;
            case 'logout':
                ViewLogout();
                break;
            default:
                break;
        }
    })
}


function ViewDataDrilldown() {
    var data = {};
    var jqxhr = $.ajax({
        beforeSend: function () {
        },
        type: "GET",
        url: "views/graficas/datosdrill.html",
        data: {},
        dataType: "html",
        contentType: "application/html; charset=utf-8"
    });
    jqxhr.done(function (p) {
        $('#vistas').empty();
        $.template('data', p);
        $.tmpl('data', data).appendTo('#vistas');
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function ViewData() {
    var data = {};
    var jqxhr = $.ajax({
        beforeSend: function () {
        },
        type: "GET",
        url: "views/graficas/datos.html",
        data: {},
        dataType: "html",
        contentType: "application/html; charset=utf-8"
    });
    jqxhr.done(function (p) {
        $('#vistas').empty();
        $.template('data', p);
        $.tmpl('data', data).appendTo('#vistas');
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function ViewLogout() {
    var data = {};
    var jqxhr = $.ajax({
        beforeSend: function () {
        },
        type: "GET",
        url: "views/cuenta/logout.html",
        data: {},
        dataType: "html",
        contentType: "application/html; charset=utf-8"
    });
    jqxhr.done(function (p) {
        $('#vistas').empty();
        $.template('logout', p);
        $.tmpl('logout', data).appendTo('#vistas');
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

function NotificacionAutocerrada(tipo, posicion, titulo, mensaje) {
    //tipo:info,success,warning,error,black,white
    //posicion: bottom left, bottom right, top left, top right
    $.Notification.autoHideNotify(
        tipo,
        posicion,
        titulo,
        mensaje
    )
}