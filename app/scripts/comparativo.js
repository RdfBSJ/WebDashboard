var server;
var listaEmpresas = {};
var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
var colores = ['#FF0F00', '#FF6600', '#FF9E01', '#FCD202', '#F8FF01', '#B0DE09', '#04D215', '#0D8ECF', '#0D52D1', '#2A0CD0', '#8A0CCF', '#CD0D74', '#754DEB', '#DDDDDD', '#333333'];

$(function () {
    server = Servidor();

    GetUserInfo();
    GetUserImage();
    GetUserMenu();

    ObtenerAnios();
    ObtenerMeses();
    ObtenerEmpresas();
    
    ControlFiltros();
    FiltrarGrafico();

    ObtenerDatos();
    ObtenerDatos2();
    ObtenerDatos3();
    ObtenerDatos4();
});



function ObtenerAnios() {
    var objeto = {};
    var jqxhr = $.ajax({
        type: 'GET',
        url: 'http://' + server + '/APIAlaro/Dashboard/Indicadores.svc/Anios',
        data: JSON.stringify(objeto),
        crossDomain: true,
        dataType: "json",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('ticket')
        }
    });
    jqxhr.done(function (data) {
        if (data.length > 0) {
            $("#Anios").empty();
            $("#Anios2").empty();
            $("#Anios3").empty();
            $("#Anios4").empty();
            $(data).each(function (key, value) {
                var $li = '<li><a href="' + value + '" data-action="anios"><b>Año:</b>  ' + value + '</a></li>'
                $("#Anios").append($li);
                $("#Anios2").append($li);
                $("#Anios3").append($li);
                $("#Anios4").append($li);
            })
            var $divider = '<li class="divider"></li>';
            $("#Anios").append($divider);
            $("#Anios2").append($divider);
            $("#Anios3").append($divider);
            $("#Anios4").append($divider);
        }
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function ObtenerMeses() {
    //$("#Meses").empty();
    //$("#Meses2").empty();
    $("#Meses3").empty();
    $(meses).each(function (key, value) {
        var $li = '<li><a href="' + key + '" data-action="meses">' + value + '</a></li>'
        //$("#Meses").append($li);
        //$("#Meses2").append($li);
        $("#Meses3").append($li);
    })
    var $divider = '<li class="divider"></li>';
    //$("#Meses").append($divider);
    //$("#Meses2").append($divider);
    $("#Meses3").append($divider);
    //var $otherli = '<li><a href="javascript:void(0)" data-action="mes">Quitar mes</a></li>';
    //$("#Meses").append($otherli);
}

function ObtenerEmpresas() {
    var objeto = {};
    var jqxhr = $.ajax({
        type: 'GET',
        url: 'http://' + server + '/APIAlaro/Dashboard/Indicadores.svc/Empresas',
        data: JSON.stringify(objeto),
        crossDomain: true,
        dataType: "json",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('ticket')
        }
    });
    jqxhr.done(function (data) {
        if (data.length > 0) {
            $("#Empresas").empty();
            $("#Empresas2").empty();
            $("#Empresas3").empty();
            $(data).each(function (index, obj) {
                var $li = '<li><a href="' + obj.IdEmpresa + '" data-action="empresas">' + obj.Empresa + '</a></li>'
                $("#Empresas").append($li);
                $("#Empresas2").append($li);
                $("#Empresas3").append($li);
            })
            var $divider = '<li class="divider"></li>';
            $("#Empresas").append($divider);
            $("#Empresas2").append($divider);
            $("#Empresas3").append($divider);
        }
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function ObtenerSucursales(IdEmpresa) {
    var objeto = {}

    var jqxhr = $.ajax({
        type: 'GET',
        url: 'http://' + server + '/APIAlaro/Dashboard/Indicadores.svc/Sucursales/' + IdEmpresa,
        data: JSON.stringify(objeto),
        crossDomain: true,
        dataType: "json",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('ticket')
        }
    });
    jqxhr.done(function (data) {
        if (data.length > 0) {
            $("#Sucursales").empty();
            $(data).each(function (index, obj) {
                var $li = '<li><a href="' + obj.IdSucursal + '" data-action="sucursales">' + obj.Sucursal + '</a></li>'
                $("#Sucursales").append($li);
            })
            var $divider = '<li class="divider"></li>';
            $("#Sucursales").append($divider);
        }
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function ControlFiltros() {
    var fecha = new Date();
    var anio = fecha.getFullYear();
    var mes = fecha.getMonth();

    $('#spnAnio').text(anio);
    //$('#spnMes').text(meses[mes]);
    $('#spnAnio2').text(anio);
    //$('#spnMes2').text(meses[mes]);
    $('#spnAnio3').text(anio);
    $('#spnAnio4').text(anio);
    $('#spnMes3').text(meses[mes]);

    $('#Mes').val(mes + 1);
    $('#Anio').val(anio);
    $('#IdEmpresa').val(1);

    $('body').on('click', '.Filtros a', function (e) {
        e.preventDefault();
        var accion = $(this).attr('data-action');
        switch (accion) {
            case 'anios':
                $('#Anio').val(parseInt($(this).attr('href')));
                $('#spnAnio').text(parseInt($(this).attr('href')));
                $('#spnAnio2').text(parseInt($(this).attr('href')));
                $('#spnAnio3').text(parseInt($(this).attr('href')));
                $('#spnAnio4').text(parseInt($(this).attr('href')));
                break;
            case 'meses':
                $('#Mes').val((parseInt($(this).attr('href'))) + 1);
                $('#spnMes3').text(meses[parseInt($(this).attr('href'))]);
                break;
            case 'empresas':
                $('#IdEmpresa').val(parseInt($(this).attr('href')));
                $('#spnEmpresa').text($(this).text());
                $('#spnEmpresa2').text($(this).text());
                $('#spnEmpresa3').text($(this).text());
                ObtenerSucursales(parseInt($(this).attr('href')));
                break;
            case 'sucursales':
                $('#IdSucursal').val(parseInt($(this).attr('href')));
                $('#spnSucursales').text($(this).text());
                break;
            default:
                break;
        }
    })
}

function FiltrarGrafico() {
    $("#FiltroGrafico").submit(function (e) {
        e.preventDefault();
        ObtenerDatos();
        ObtenerDatos2();
        ObtenerDatos3();
        ObtenerDatos4();
        return false;
    })
}


function ObtenerDatos() {
    var objeto = { "objeto": { "Anio": $('#Anio').val(), "Mes": $('#Mes').val() } };

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'http://' + server + '/APIAlaro/Dashboard/Indicadores.svc/Empresas/GastoUtilidad',
        data: JSON.stringify(objeto),
        crossDomain: true,
        dataType: "json",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('ticket')
        }
    });
    jqxhr.done(function (data) {
        if (data.length > 0) {

            var newdata = [];
            $.each(data, function (index, obj) {
                var indice = NumeroAleatorio(0, colores.length);
                obj["color"] = ColorAleatorio();
                newdata.push(obj);
            })

            CrearGrafico(newdata);
            CrearTablaDetalle(newdata);
        }
        else {
            NotificacionAutocerrada('white', 'bottom right', 'Gráfico empresas', 'No se encontraron datos en la respuesta del servidor para el gráfico por empresas.');
            console.log('No se encontraron datos en la respuesta del servidor para el gráfico por empresas.');
            $("#container").empty();
            $('#detalle-grafico1').empty();
        }
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function CrearGrafico(data) {
    var chart = AmCharts.makeChart("container", {
        "theme": "light",
        "type": "serial",
        "startDuration": 1,
        "dataProvider": data,
        "valueAxes": [{
            "position": "left",
            "title": "Gasto vs Utilidad",
            //"axisAlpha": 0,
            "gridAlpha": 0,
            "labelFunction": function (value) {
                return accounting.formatMoney(value)
            }
        }],
        "graphs": [
            {
                //"balloonText": "Gasto: <b>[[value]]</b>",
                "balloonFunction": function (item) {
                    return "Gasto: <b>" + accounting.formatMoney(item.values.value) + "</b>"
                },
                "colorField": "color",
                "fillAlphas": 0.85,
                "id": "gphGasto",
                "lineAlpha": 0.1,
                "title": "Gast",
                "type": "column",
                "topRadius": 1,
                "valueField": "GastoTotal"
            },
            {
                //"balloonText": "Utilidad: <b>[[value]]</b>",
                "balloonFunction": function (item) {
                    return "Utilidad: <b>" + accounting.formatMoney(item.values.value) + "</b>"
                },
                "colorField": "color",
                "fillAlphas": 0.85,
                "id": "gphUtilidad",
                "lineAlpha": 0.1,
                "title": "Util",
                "type": "column",
                "topRadius": 1,
                "valueField": "UtilidadTotal"
            }
        ],
        "depth3D": 40,
        "angle": 30,
        "chartCursor": {
            "categoryBalloonEnabled": false,
            "cursorAlpha": 0,
            "zoomable": false
        },
        "categoryField": "Empresa",
        "categoryAxis": {
            "gridPosition": "start",
            "axisAlpha": 0,
            "gridAlpha": 0,
            "labelRotation": 30
        },
        "export": {
            "enabled": true
        },
        "responsive": {
            "enabled": true,
        }
    }, 0);
}

function CrearTablaDetalle(data) {
    var jqxhr = $.ajax({
        beforeSend: function () {
        },
        type: "GET",
        url: "views/tables/detalle-grafico1.html",
        data: {},
        dataType: "html",
        contentType: "application/html; charset=utf-8"
    });
    jqxhr.done(function (p) {
        $('#detalle-grafico1').empty();
        $.template('primer-detalle', p);
        $.tmpl('primer-detalle', data).appendTo('#detalle-grafico1');
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}


function ObtenerDatos2() {
    var objeto = {
        "objeto": {
            "IdEmpresa": $('#IdEmpresa').val(),
            "Anio": $('#Anio').val(),
            "Mes": $('#Mes').val(),
            "IdSucursal": 0,
            "Opcion": "EMPRESA"
        }
    }

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'http://' + server + '/APIAlaro/Dashboard/Indicadores.svc/Meses/GastoUtilidad',
        data: JSON.stringify(objeto),
        crossDomain: true,
        dataType: "json",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('ticket')
        }
    });
    jqxhr.done(function (data) {
        if (data.length > 0) {
            var newdata = [];
            $.each(data, function (index, obj) {
                var indice = NumeroAleatorio(0, colores.length);
                obj["color"] = ColorAleatorio();
                newdata.push(obj);
            })
            CrearGrafico2(newdata);
            CrearTablaDetalle2(newdata);
        }
        else {
            NotificacionAutocerrada('white', 'bottom right', 'Gráfico meses', 'No se encontraron datos en la respuesta del servidor para el gráfico de meses por empresa.');
            console.log('No se encontraron datos en la respuesta del servidor para el gráfico de meses por empresa.');
            $("#container2").empty();
            $('#detalle-grafico2').empty();
        }
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function CrearGrafico2(data) {
    var chart = AmCharts.makeChart("container2", {
        "theme": "light",
        "type": "serial",
        "startDuration": 1,
        "dataProvider": data,
        "valueAxes": [{
            "position": "left",
            "title": "Gasto vs Utilidad",
            //"axisAlpha": 0,
            "gridAlpha": 0,
            "labelFunction": function (value) {
                return accounting.formatMoney(value)
            }
        }],
        "graphs": [
            {
                //"balloonText": "Gasto: <b>[[value]]</b>",
                "balloonFunction": function (item) {
                    return "Gasto: <b>" + accounting.formatMoney(item.values.value) + "</b>"
                },
                "colorField": "color",
                "fillAlphas": 0.85,
                "id": "gphGasto",
                "lineAlpha": 0.1,
                "title": "Gast",
                "type": "column",
                "topRadius": 1,
                "valueField": "GastoTotal"
            },
            {
                //"balloonText": "Utilidad: <b>[[value]]</b>",
                "balloonFunction": function (item) {
                    return "Utilidad: <b>" + accounting.formatMoney(item.values.value) + "</b>"
                },
                "colorField": "color",
                "fillAlphas": 0.85,
                "id": "gphUtilidad",
                "lineAlpha": 0.1,
                "title": "Util",
                "type": "column",
                "topRadius": 1,
                "valueField": "UtilidadTotal"
            }
        ],
        "depth3D": 40,
        "angle": 30,
        "chartCursor": {
            "categoryBalloonEnabled": false,
            "cursorAlpha": 0,
            "zoomable": false
        },
        "categoryField": "Meses",
        "categoryAxis": {
            "gridPosition": "start",
            "axisAlpha": 0,
            "gridAlpha": 0,
            "labelRotation": 30
        },
        "export": {
            "enabled": true
        },
        "responsive": {
            "enabled": true
        }
    }, 0);
}

function CrearTablaDetalle2(data) {
    var jqxhr = $.ajax({
        beforeSend: function () {
        },
        type: "GET",
        url: "views/tables/detalle-grafico2.html",
        data: {},
        dataType: "html",
        contentType: "application/html; charset=utf-8"
    });
    jqxhr.done(function (p) {
        $('#detalle-grafico2').empty();
        $.template('segundo-detalle', p);
        $.tmpl('segundo-detalle', data).appendTo('#detalle-grafico2');
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}


function ObtenerDatos3() {
    var objeto = { "objeto": { "IdEmpresa": $('#IdEmpresa').val(), "Anio": $('#Anio').val(), "Mes": $('#Mes').val() } }

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'http://' + server + '/APIAlaro/Dashboard/Indicadores.svc/Conceptos/Gasto',
        data: JSON.stringify(objeto),
        crossDomain: true,
        dataType: "json",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('ticket')
        }
    });
    jqxhr.done(function (data) {
        if (data.length > 0) {
            var newdata = [];
            $.each(data, function (index, obj) {
                var indice = NumeroAleatorio(0, colores.length);
                obj["color"] = ColorAleatorio();
                newdata.push(obj);
            })
            CrearGrafico3(newdata);
            CrearTablaDetalle3(newdata);
        }
        else {
            NotificacionAutocerrada('white', 'bottom right', 'Gráfico conceptos', 'No se encontraron datos en la respuesta del servidor para el gráfico por conceptos.');
            console.log('No se encontraron datos en la respuesta del servidor para el gráfico por conceptos.');
            $("#container3").empty();
            $('#detalle-grafico3').empty();
        }
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function CrearGrafico3(data) {
    //console.log(data);
    var chart = AmCharts.makeChart("container3", {
        "theme": "light",
        "type": "serial",
        "startDuration": 1,
        "dataProvider": data,
        "valueAxes": [{
            "position": "left",
            "title": "Gasto por concepto",
            //"axisAlpha": 0,
            "gridAlpha": 0,
            "labelFunction": function (value) {
                return accounting.formatMoney(value)
            }
        }],
        "graphs": [
            {
                //"balloonText": "Gasto: <b>[[value]]</b>",
                "balloonFunction": function (item) {
                    return "Gasto: <b>" + accounting.formatMoney(item.values.value) + "</b>"
                },
                "colorField": "color",
                "fillAlphas": 0.85,
                "id": "gphGasto",
                "lineAlpha": 0.1,
                "title": "Gast",
                "type": "column",
                "topRadius": 1,
                "valueField": "GastoTotal"
            }
        ],
        "depth3D": 40,
        "angle": 30,
        "chartCursor": {
            "categoryBalloonEnabled": false,
            "cursorAlpha": 0,
            "zoomable": false
        },
        "categoryField": "Concepto",
        "categoryAxis": {
            "gridPosition": "start",
            "axisAlpha": 0,
            "gridAlpha": 0,
            "labelRotation": 30
        },
        "export": {
            "enabled": true
        },
        "responsive": {
            "enabled": true
        }
    }, 0);
}

function CrearTablaDetalle3(data) {
    var jqxhr = $.ajax({
        beforeSend: function () {
        },
        type: "GET",
        url: "views/tables/detalle-grafico3.html",
        data: {},
        dataType: "html",
        contentType: "application/html; charset=utf-8"
    });
    jqxhr.done(function (p) {
        $('#detalle-grafico3').empty();
        $.template('tercer-detalle', p);
        $.tmpl('tercer-detalle', data).appendTo('#detalle-grafico3');
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}


function ObtenerDatos4() {
    var objeto = {
        "objeto": {
            "IdEmpresa": $('#IdEmpresa').val(),
            "Anio": $('#Anio').val(),
            "Mes": $('#Mes').val(),
            "IdSucursal": $('#IdSucursal').val(),
            "Opcion": "SUCURSAL"
        }
    }

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'http://' + server + '/APIAlaro/Dashboard/Indicadores.svc/Meses/GastoUtilidad',
        data: JSON.stringify(objeto),
        crossDomain: true,
        dataType: "json",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('ticket')
        }
    });
    jqxhr.done(function (data) {
        if (data.length > 0) {
            var newdata = [];
            $.each(data, function (index, obj) {
                var indice = NumeroAleatorio(0, colores.length);
                obj["color"] = ColorAleatorio();
                newdata.push(obj);
            })
            CrearGrafico4(newdata);
            CrearTablaDetalle4(newdata);
        }
        else {
            NotificacionAutocerrada('white', 'bottom right', 'Gráfico meses', 'No se encontraron datos en la respuesta del servidor para el gráfico de meses por sucursal.');
            console.log('No se encontraron datos en la respuesta del servidor para el gráfico de meses por sucursal.');
            $("#container4").empty();
            $('#detalle-grafico4').empty();
        }
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function CrearGrafico4(data) {
    var chart = AmCharts.makeChart("container4", {
        "theme": "light",
        "type": "serial",
        "startDuration": 1,
        "dataProvider": data,
        "valueAxes": [{
            "position": "left",
            "title": "Gasto vs Utilidad",
            //"axisAlpha": 0,
            "gridAlpha": 0,
            "labelFunction": function (value) {
                return accounting.formatMoney(value)
            }
        }],
        "graphs": [
            {
                //"balloonText": "Gasto: <b>[[value]]</b>",
                "balloonFunction": function (item) {
                    return "Gasto: <b>" + accounting.formatMoney(item.values.value) + "</b>"
                },
                "colorField": "color",
                "fillAlphas": 0.85,
                "id": "gphGasto",
                "lineAlpha": 0.1,
                "title": "Gast",
                "type": "column",
                "topRadius": 1,
                "valueField": "GastoTotal"
            },
            {
                //"balloonText": "Utilidad: <b>[[value]]</b>",
                "balloonFunction": function (item) {
                    return "Utilidad: <b>" + accounting.formatMoney(item.values.value) + "</b>"
                },
                "colorField": "color",
                "fillAlphas": 0.85,
                "id": "gphUtilidad",
                "lineAlpha": 0.1,
                "title": "Util",
                "type": "column",
                "topRadius": 1,
                "valueField": "UtilidadTotal"
            }
        ],
        "depth3D": 40,
        "angle": 30,
        "chartCursor": {
            "categoryBalloonEnabled": false,
            "cursorAlpha": 0,
            "zoomable": false
        },
        "categoryField": "Meses",
        "categoryAxis": {
            "gridPosition": "start",
            "axisAlpha": 0,
            "gridAlpha": 0,
            "labelRotation": 30
        },
        "export": {
            "enabled": true
        },
        "responsive": {
            "enabled": true
        }
    }, 0);
}

function CrearTablaDetalle4(data) {
    var jqxhr = $.ajax({
        beforeSend: function () {
        },
        type: "GET",
        url: "views/tables/detalle-grafico2.html",
        data: {},
        dataType: "html",
        contentType: "application/html; charset=utf-8"
    });
    jqxhr.done(function (p) {
        $('#detalle-grafico4').empty();
        $.template('cuarto-detalle', p);
        $.tmpl('cuarto-detalle', data).appendTo('#detalle-grafico4');
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

function ColorAleatorio() {
    hexadecimal = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F")
    color_aleatorio = "#";
    for (i = 0; i < 6; i++) {
        posarray = NumeroAleatorio(0, hexadecimal.length)
        color_aleatorio += hexadecimal[posarray]
    }
    return color_aleatorio
}

function NumeroAleatorio(inferior, superior) {
    numPosibilidades = superior - inferior
    aleat = Math.random() * numPosibilidades
    aleat = Math.floor(aleat)
    return parseInt(inferior) + aleat
}




function GetUserInfo() {
    var data = JSON.parse(window.atob(localStorage.getItem('user')));
    var jqxhr = $.ajax({
        beforeSend: function () {
        },
        type: "GET",
        url: "views/logged/user-info.html",
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
    var data = JSON.parse(window.atob(localStorage.getItem('user')));
    var jqxhr = $.ajax({
        beforeSend: function () {
        },
        type: "GET",
        url: "views/logged/user-image.html",
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
    var data = JSON.parse(window.atob(localStorage.getItem('user')));
    var jqxhr = $.ajax({
        beforeSend: function () {
        },
        type: "GET",
        url: "views/logged/user-menu.html",
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