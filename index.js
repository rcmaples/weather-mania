$(document).ready(function(){
   locate();

$('.btn-toggle').click(function() {
    $(this).find('.btn').toggleClass('active');
    var unitStr = $('.active').text().replace(/[^FC]/g,'');
    if (unitStr === "C"){
        //alert("C!");
        displayForecast(eachDay, "C");
        displayToday("C");
    } else if (unitStr === "F") {
        //alert("F!")
        displayForecast(eachDay, "F");
        displayToday("F");
    }
     if ($(this).find('.btn-primary').size()>0) {
        $(this).find('.btn').toggleClass('btn-primary');
    }
    if ($(this).find('.btn-danger').size()>0) {
        $(this).find('.btn').toggleClass('btn-danger');
    }
    if ($(this).find('.btn-success').size()>0) {
        $(this).find('.btn').toggleClass('btn-success');
    }
    if ($(this).find('.btn-info').size()>0) {
        $(this).find('.btn').toggleClass('btn-info');
    }

    $(this).find('.btn').toggleClass('btn-default');



});


});

var unit = "";
var long =0;
var lats=0;
var dayMinTemp;
var dayMaxTemp;
var eachDay;
var current;
var data;

function locate(){
    if (!navigator.geolocation){
        alert("Geolocation is not supported by your browser.")
        return;
    }

    function success(position){
        long = position.coords.longitude;
        lats = position.coords.latitude;
        getWeather();
    }

    function error(){
        alert("Unable to retrieve your location.")
    }

    navigator.geolocation.getCurrentPosition(success, error);
}

function getWeather(){
    var apiKey = "68450551e08b28310efc04d3f4604168";
        $.ajax({
            type: "POST",
            url: 'https://api.forecast.io/forecast/'+apiKey+'/'+lats+','+long+'?exclude=[minutely,hourly,alerts,flags]',
            dataType: 'jsonp',
            jsonp: 'callback',
            success: function(data) {
                console.log(data);
                current = data.currently;
                eachDay = data.daily;
                displayToday("F");
                displayForecast(eachDay, "F")
                changeBG(current);
            },
            error: function(err) { alert("ERROR "+err); },
        }); // end ajax
}; // end getWeather

function displayToday(is){
    unit = is;
    $('.today-icon').html('<i class="wi wi-forecast-io-'+current.icon+'"></i>');
    $('.today-summary').html(current.summary);
    if (is === "F"){
       $('.today-temp').html(Math.round(current.temperature) + '&deg; ' + unit);
    } else if (is === "C") {
       $('.today-temp').html(Math.round((((current.temperature - 32)*5)/9)) + '&deg; ' + unit);
    }
}
//console.log(data);

function changeBG(){
  //console.log(current);
  if (current.temperature > 80){
     $('body').addClass("hot");
     } else if (current.temperature <= 80 && current.temperature >= 40) {
       $('body').addClass("mild");
       } else if (current < 40){
         $('body').addClass("cold");
         }
}

//var testData;
//testData = !!! this data has been moved to ./test-data.json !!!
//eachDay = testData.daily;
//console.log(eachDay.data[1]);

function displayForecast(info, si){
    unit = si;
    for (var i = 1; i<6; i++){
        var day = info.data[i];
        var dayTime = epochToHuman(day.time).replace(/\W\d{2}:\d{2}:\d{2}.+/g,'').substring(0,3);
        var daySummary = day.summary;
        var dayIcon = day.icon;


    if (si === "F"){
        dayMinTemp = Math.round(day.temperatureMin);
        dayMaxTemp = Math.round(day.temperatureMax);
    } else {
        dayMinTemp = Math.round((((day.temperatureMin - 32)*5)/9));
        dayMaxTemp = Math.round((((day.temperatureMax - 32)*5)/9));
    }

    $('div .forecast:nth-child('+ i +')').html(
        '<div class="day_name">'+dayTime+'</div>'+'<div class="day_icon"><i class="wi-small wi-forecast-io-'+dayIcon+'"></i></div>'+'<div class="day_sum"><p>'+daySummary+'</p></div>'+        '<div class="day_lohi"><table style="width:100%"><tr><th>LO:</th><th>HI:</th></tr><tr><td>'+dayMinTemp+'&deg;'+unit+'</td><td>'+dayMaxTemp+'&deg;'+unit+'</td></tr></table></div>'
        );
    }
}

function epochToHuman(int){
    var input = int;
    var epoch=input;
        var outputtext="";
        var extraInfo=0;
        if(input>=100000000000000){
            epoch=Math.round(input/1000000);
            input=Math.round(input/1000);
        }else if(input>=100000000000){
            epoch=Math.round(input/1000);
        }else{
            if(input>10000000000)extraInfo=1;input=(input*1000);
        }
    var datum=new Date(input);
    if(isValidDate(datum)){
       return(datum.toUTCString());
    }
}

function isValidDate(d){
    if(Object.prototype.toString.call(d)!=="[object Date]")
        return false;
        return!isNaN(d.getTime());
}
