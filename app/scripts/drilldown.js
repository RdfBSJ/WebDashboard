var server;
var listaEmpresas = {};
var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

$(function () {
    server = Servidor();
    ObtenerAnios();
    ObtenerMeses();
    ObtenerEmpresas();
    ControlFiltros();
    FiltrarGrafico();

    ObtenerDatos();
    ObtenerDatos2();
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
            $(data).each(function (key, value) {
                var $li = '<li><a href="' + value + '" data-action="anios"><b>Año:</b>  ' + value + '</a></li>'
                $("#Anios").append($li);
                $("#Anios2").append($li);
            })
            var $divider = '<li class="divider"></li>';
            $("#Anios").append($divider);
            $("#Anios2").append($divider);
        }
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function ObtenerMeses() {
    $("#Meses").empty();
    $("#Meses2").empty();
    $(meses).each(function (key, value) {
        var $li = '<li><a href="' + key + '" data-action="meses">' + value + '</a></li>'
        $("#Meses").append($li);
        $("#Meses2").append($li);
    })
    var $divider = '<li class="divider"></li>';
    $("#Meses").append($divider);
    $("#Meses2").append($divider);
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
            $(data).each(function (index, obj) {
                var $li = '<li><a href="' + obj.IdEmpresa + '" data-action="empresas">' + obj.Empresa + '</a></li>'
                $("#Empresas").append($li);
            })
            var $divider = '<li class="divider"></li>';
            $("#Empresas").append($divider);
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
    $('#spnMes').text(meses[mes]);
    $('#spnAnio2').text(anio);
    $('#spnMes2').text(meses[mes]);

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
                break;
            case 'meses':
                $('#Mes').val((parseInt($(this).attr('href'))) + 1);
                $('#spnMes').text(meses[parseInt($(this).attr('href'))]);
                $('#spnMes2').text(meses[parseInt($(this).attr('href'))]);
                break;
            case 'empresas':
                $('#IdEmpresa').val(parseInt($(this).attr('href')));
                $('#spnEmpresa').text($(this).text());
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
        return false;
    })
}



function ObtenerDatos() {
    var objeto = {
        "objeto": {
            "Anio": $('#Anio').val(),
            "Mes": $('#Mes').val()
        }
    };
    var jqxhr = $.ajax({
        type: 'POST',
        url: 'http://' + server + '/APIAlaro/Dashboard/Indicadores.svc/General/Drilldown',
        data: JSON.stringify(objeto),
        crossDomain: true,
        dataType: "json",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('ticket')
        }
    });
    jqxhr.done(function (data) {
        if (data.serie.length > 0) {
            CrearGrafico(data);
            CrearTablaGastoGeneralEmpresa(data);
            FiltrarTablaGastoGeneralEmpresa();
        }
        else {
            console.log('No se encontraron datos en la respuesta del servidor.');
            $("#container").empty();
            $('#gastosGeneral').empty();
            $("#gastosEmpresa").empty();
        }
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function CrearTablaGastoGeneralEmpresa(data) {
    var jqxhr = $.ajax({
        beforeSend: function () {
            $("#gastosEmpresa").empty();
        },
        type: "GET",
        url: "views/tables/gastos-general.html",
        data: {},
        dataType: "html",
        contentType: "application/html; charset=utf-8"
    });
    jqxhr.done(function (p) {
        $('#gastosGeneral').empty();
        $.template('gastos-general', p);
        $.tmpl('gastos-general', data.serie).appendTo('#gastosGeneral');
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function FiltrarTablaGastoGeneralEmpresa() {
    $('body').on('click', '#gastosGeneral a', function (e) {
        e.preventDefault();

        var idEmp = $(this).attr('href');
        ObtenerGastoPorServiciosDeEmpresa(idEmp);
    })
}

function ObtenerGastoPorServiciosDeEmpresa(idEmpresa) {
    var objeto = { "objeto": { "IdEmpresa": idEmpresa, "Anio": $('#Anio').val(), "Mes": $('#Mes').val() } }
    var jqxhr = $.ajax({
        type: 'POST',
        url: 'http://' + server + '/APIAlaro/Dashboard/Indicadores.svc/Empresa/Conceptos',
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
            $.get("views/tables/gastos-servicio-empresa-general.html", function (p) {
                $("#gastosEmpresa").empty();
                $.template("gastos-empresa-conceptos", p);
                $.tmpl("gastos-empresa-conceptos", data).appendTo('#gastosEmpresa');
            });
        }
        else {
            console.log('No se encontraron datos en la respuesta del servidor.');
        }
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function CrearGrafico(serie) {
    // Create the chart
    Highcharts.chart('container', {
        chart: {
            type: 'column',
        },
        title: {
            text: 'Gráfica del gasto por empresa durante el periodo ' + $('#Anio').val()
        },
        subtitle: {
            text: 'Click en las columnas para ver el concepto de gasto.'
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Gasto en pesos mexicanos ($)'
            },
            labels: {
                formatter: function () {
                    return accounting.formatMoney(this.value);
                }
            }
        },
        legend: {
            enabled: false
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal'
                    },
                    yAxis: {
                        labels: {
                            align: 'left',
                            x: 0,
                            y: -5
                        },
                        title: {
                            text: null
                        }
                    },
                    subtitle: {
                        text: null
                    },
                    credits: {
                        enabled: false
                    }
                }
            }]
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return accounting.formatMoney(this.point.y);
                    }
                }
            }
        },
        tooltip: {
            formatter: function () {
                return '<span style="font-size:11px">' + this.series.name + '</span><br><span style="color:' + this.point.color + '">' + this.point.name + '</span>: <b>' + accounting.formatMoney(this.point.y) + '</b> del total<br/>'
            }
        },
        series: [{
            name: 'Empresa:',
            colorByPoint: true,
            data: serie.serie
        }],
        drilldown: {
            series: serie.serie_drilldown
        }
    });
}


function ObtenerDatos2() {
    var objeto = {
        "objeto": {
            "IdEmpresa": $('#IdEmpresa').val(),
            "Anio": $('#Anio').val(),
            "Mes": $('#Mes').val()
        }
    }
    
    var jqxhr = $.ajax({
        type: 'POST',
        url: 'http://' + server + '/APIAlaro/Dashboard/Indicadores.svc/Empresa/Drilldown',
        data: JSON.stringify(objeto),
        crossDomain: true,
        dataType: "json",
        contentType: "application/json",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('ticket')
        }
    });
    jqxhr.done(function (data) {
        if (data.serie.length > 0) {
            CrearGrafico2(data);
            CrearTablaGastoGeneralSucursal(data);
            FiltrarTablaGastoGeneralSucursal();
        }
        else {
            $("#container2").empty();
            $('#gastosGSucursal').empty();
            $("#gastosSSucursal").empty();
        }
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function CrearTablaGastoGeneralSucursal(data) {
    var jqxhr = $.ajax({
        beforeSend: function () {
            $("#gastosSSucursal").empty();
        },
        type: "GET",
        url: "views/tables/gastos-sucursal.html",
        data: {},
        dataType: "html",
        contentType: "application/html; charset=utf-8"
    });
    jqxhr.done(function (p) {
        console.log(data.serie);
        $('#gastosGSucursal').empty();
        $.template('gastos-sucursal', p);
        $.tmpl('gastos-sucursal', data.serie).appendTo('#gastosGSucursal');
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function FiltrarTablaGastoGeneralSucursal() {
    $('body').on('click', '#gastosGSucursal a', function (e) {
        e.preventDefault();

        var idSuc = $(this).attr('href');
        ObtenerGastoPorServiciosDeSucursal(idSuc);
    })
}

function ObtenerGastoPorServiciosDeSucursal(idSucursal) {
    var objeto = {
        "objeto": {
            "IdEmpresa": $('#IdEmpresa').val(),
            "IdSucursal": idSucursal,
            "Anio": $('#Anio').val(),
            "Mes": $('#Mes').val()
        }
    }
    var jqxhr = $.ajax({
        type: 'POST',
        url: 'http://' + server + '/APIAlaro/Dashboard/Indicadores.svc/Sucursal/Conceptos',
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
            $.get("views/tables/gastos-servicio-sucursal-general.html", function (p) {
                $("#gastosSSucursal").empty();
                $.template("gastos-sucursal-conceptos", p);
                $.tmpl("gastos-sucursal-conceptos", data).appendTo('#gastosSSucursal');
            });
        }
        else {
            console.log('No se encontraron datos en la respuesta del servidor.');
        }
    });
    jqxhr.fail(function (err) {
    });
    jqxhr.always(function (sts) {
    });
}

function CrearGrafico2(serie) {
    // Create the chart
    Highcharts.chart('container2', {
        chart: {
            type: 'column',
        },
        title: {
            text: 'Gráfica del gasto por sucursal durante el periodo ' + $('#Anio').val()
        },
        subtitle: {
            text: 'Click en las columnas para ver el concepto de gasto.'
        },
        xAxis: {
            type: 'category'
        },
        yAxis: {
            title: {
                text: 'Gasto en pesos mexicanos ($)'
            },
            labels: {
                formatter: function () {
                    return accounting.formatMoney(this.value);
                }
            }
        },
        legend: {
            enabled: false
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal'
                    },
                    yAxis: {
                        labels: {
                            align: 'left',
                            x: 0,
                            y: -5
                        },
                        title: {
                            text: null
                        }
                    },
                    subtitle: {
                        text: null
                    },
                    credits: {
                        enabled: false
                    }
                }
            }]
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        return accounting.formatMoney(this.point.y);
                    }
                }
            }
        },
        tooltip: {
            formatter: function () {
                return '<span style="font-size:11px">' + this.series.name + '</span><br><span style="color:' + this.point.color + '">' + this.point.name + '</span>: <b>' + accounting.formatMoney(this.point.y) + '</b> del total<br/>'
            }
        },
        series: [{
            name: 'Sucursal:',
            colorByPoint: true,
            data: serie.serie
        }],
        drilldown: {
            series: serie.serie_drilldown
        }
    });
}



function AjustarGrafico() {
    $("#adjustGraph").on('click', function () {
        ObtenerDatos();
        ObtenerDatos2();
    })
}