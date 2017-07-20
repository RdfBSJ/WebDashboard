var server;

$(function () {
    server = Servidor();
    LoginUsuario();
})

function LoginUsuario() {
    var submit = false;
    $("#frm-login-usuario").submit(function (e) {
        e.preventDefault();
        var formData = $(this).serialize();
        var values = GetValues(formData.replace(/\+/g, ' '));
        var objUsuario = { "credenciales": values }
        var jqxhr = $.ajax({
            beforeSend: function () {
            },
            type: 'POST',
            url: 'http://' + server + '/APIAlaro/Cliente/Autenticacion.svc/Login',
            data: JSON.stringify(objUsuario),
            crossDomain: true,
            dataType: "json",
            contentType: "application/json"
        });
        jqxhr.done(function (data) {
            if (data.Autenticado == true) {
                localStorage.setItem("ticket", data.Token);
                localStorage.setItem("session", data.IdSesion);
                Notificacion('success', 'bottom right', 'Autenticado', 'El token fue generado correctamente y está cifrado en el cliente.');
                console.log('El token fue generado correctamente y está cifrado en el cliente.')
                IniciarAplicacion(data.IdSesion);
            }
            else {
                Notificacion('error', 'bottom right', 'Error', data.Mensaje);
                console.log(data.Mensaje);
            }
        });
        jqxhr.fail(function (err) {
            console.log(err.responseText);
        });
        jqxhr.always(function (sts) {
        });

        return false;
    })
}

function IniciarAplicacion(sesionid) {
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
        console.log(data);
        if (data.Autenticado) {
            localStorage.setItem('user', window.btoa(JSON.stringify(data)));
            window.location.replace("index.html");
        }
        else {
            Notificacion('error', 'bottom right', 'Error', data.Mensaje);
        }
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function GetValues(query) {
    var setValue = function (root, path, value) {
        if (path.length > 1) {
            var dir = path.shift();
            if (typeof root[dir] == 'undefined') {
                root[dir] = path[0] == '' ? [] : {};
            }

            arguments.callee(root[dir], path, value);
        } else {
            if (root instanceof Array) {
                root.push(value);
            } else {
                root[path] = value;
            }
        }
    };
    var nvp = query.split('&');
    var data = {};
    for (var i = 0 ; i < nvp.length ; i++) {
        var pair = nvp[i].split('=');
        var name = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);

        var path = name.match(/(^[^\[]+)(\[.*\]$)?/);
        var first = path[1];
        if (path[2]) {
            //case of 'array[level1]' || 'array[level1][level2]'
            path = path[2].match(/(?=\[(.*)\]$)/)[1].split('][')
        } else {
            //case of 'name'
            path = [];
        }
        path.unshift(first);

        setValue(data, path, value);
    }
    return data;
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