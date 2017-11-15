/*
*   Wavify
*   Jquery Plugin to make some nice waves
*/
(function ( $ ) {

    $.fn.wavify = function( options ) {

        //  Options
        //
        //
        var settings = $.extend({
            container: options.container ? options.container : 'body',
            // Height of wave
            height: 200,
            // Amplitude of wave
            amplitude: 100,
            // Animation speed
            speed: .15,
            // Total number of articulation in wave
            bones: 3,
            // Color
            color: 'rgba(255,255,255, 0.20)'
        }, options );

        var wave = this,
            width = $(settings.container).width(),
            height = $(settings.container).height(),
            points = [],
            lastUpdate,
            totalTime = 0;

        //  Set color
        //
        TweenLite.set(wave, {attr:{fill: settings.color}});


        function drawPoints(factor) {
            var points = [];

            for (var i = 0; i <= settings.bones; i++) {
                var x = i/settings.bones * width;
                var sinSeed = (factor + (i + i % settings.bones)) * settings.speed * 100;
                var sinHeight = Math.sin(sinSeed / 100) * settings.amplitude;
                var yPos = Math.sin(sinSeed / 100) * sinHeight  + settings.height;
                points.push({x: x, y: yPos});
            }

            return points;
        }

        function drawPath(points) {
            var SVGString = 'M ' + points[0].x + ' ' + points[0].y;

            var cp0 = {
                x: (points[1].x - points[0].x) / 2,
                y: (points[1].y - points[0].y) + points[0].y + (points[1].y - points[0].y)
            };

            SVGString += ' C ' + cp0.x + ' ' + cp0.y + ' ' + cp0.x + ' ' + cp0.y + ' ' + points[1].x + ' ' + points[1].y;

            var prevCp = cp0;
            var inverted = -1;

            for (var i = 1; i < points.length-1; i++) {
                var cpLength = Math.sqrt(prevCp.x * prevCp.x + prevCp.y * prevCp.y);
                var cp1 = {
                    x: (points[i].x - prevCp.x) + points[i].x,
                    y: (points[i].y - prevCp.y) + points[i].y
                };

                SVGString += ' C ' + cp1.x + ' ' + cp1.y + ' ' + cp1.x + ' ' + cp1.y + ' ' + points[i+1].x + ' ' + points[i+1].y;
                prevCp = cp1;
                inverted = -inverted;
            }

            SVGString += ' L ' + width + ' ' + height;
            SVGString += ' L 0 ' + height + ' Z';
            return SVGString;
        }

        //  Draw function
        //
        //
        function draw() {
            var now = window.Date.now();

            if (lastUpdate) {
                var elapsed = (now-lastUpdate) / 1000;
                lastUpdate = now;

                totalTime += elapsed;

                var factor = totalTime*Math.PI;
                TweenMax.to(wave, settings.speed, {
                    attr:{
                        d: drawPath(drawPoints(factor))
                    },
                    ease: Power1.easeInOut
                });

            } else {
                lastUpdate = now;
            }

            requestAnimationFrame(draw);
        }

        //  Pure js debounce function to optimize resize method
        //
        //
        function debounce(func, wait, immediate) {
            var timeout;
            return function() {
                var context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                }, wait);
                if (immediate && !timeout) func.apply(context, args);
            };
        }

        //  Redraw for resize with debounce
        //
        var redraw = debounce(function() {
            wave.attr('d', '');
            points = [];
            totalTime = 0;
            width = $(settings.container).width();
            height = $(settings.container).height();
            lastUpdate = false;
            setTimeout(function(){
                draw();
            }, 50);
        }, 250);
        $(window).on('resize', redraw);


        //  Execute
        //
        return draw();

    };




}(jQuery));


$('#wave1').wavify({
  height: 20,
  bones: 4,
  amplitude: 10,
  color: 'rgba(238,238,238,1)',
  speed: .1
});

$('#wave2').wavify({
  height: 20,
  bones: 5,
  amplitude: 15,
  color: 'rgba(238,238,238,0.75)',
  speed: .15
});

$('#wave3').wavify({
  height: 20,
  bones: 6,
  amplitude: 20,
  color: 'rgba(238,238,238,0.5)',
  speed: .2
});





var path_coordinates = [];
var map;
function initTabMap() {

  var mapOptions = {
    zoom: 4,
    disableDefaultUI: false,
    streetViewControl: false,
    mapTypeControl: false,
    gestureHandling: 'cooperative',
    backgroundColor: 'hsla(0, 0%, 0%, 0)',
    center: new google.maps.LatLng(16.8865, -24.9918),

    styles: [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#eeeeee"},{"weight":0.8}]},{"featureType":"administrative.country","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"administrative.country","elementType":"labels.text","stylers":[{"hue":"#006dff"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#eeeeee"}]},{"featureType":"administrative.country","elementType":"labels.text.stroke","stylers":[{"color":"#384d69"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#466083"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eeeeee"}]}]
  };

  var mapElement = document.getElementById('map');
  map = new google.maps.Map(mapElement, mapOptions);
}

window.onload = function() {
  initTabMap();
};
    

var config = {
  apiKey: "AIzaSyAmZ292gMrtF3TlJQqcIgKIOLADyZITyRY",
  authDomain: "yachtshepherdmoon-47bbf.firebaseapp.com",
  databaseURL: "https://yachtshepherdmoon-47bbf.firebaseio.com/",
};  
var coordinates = [];
firebase.initializeApp(config);
var database = firebase.database();
database.ref('/track').orderByChild('date').on('value', function(snapshot){
var values = snapshot.val();

for (var key in values) {
    // skip loop if the property is from prototype
    if (!values.hasOwnProperty(key)) continue;
    var obj = values[key];
    coordinates.push({lat: parseFloat(obj['latitude']), lng: parseFloat(obj['longitude'])});
}

var last = coordinates[coordinates.length-1]
var current_loc = new google.maps.LatLng(last['latitude'], last['longitude'])
var sailPath = new google.maps.Polyline({
  path: coordinates,
  geodesic: true,
  strokeColor: '#ff5599',
  strokeOpacity: 1,
  strokeWeight: 2
});

sailPath.setMap(map);
  
  
  
  
})();
