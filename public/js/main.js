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



  var mapElement = $('#map');
  function waitForMap() {
    setTimeout(function() {
      if ($('#map-tab').is(':visible')) {
        initTabMap();
      } else {
        waitForMap();
      }
    }, 100);
  }

  waitForMap();

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




(function(){
    
  function initTabMap() {
    var mapOptions = {
      zoom: 4,
      disableDefaultUI: false,
      streetViewControl: false,
      mapTypeControl: false,
      gestureHandling: 'cooperative',
      backgroundColor: 'hsla(0, 0%, 0%, 0)',
      center: new google.maps.LatLng(36.4678, -8.81016),

      styles: [{"featureType":"all","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"administrative","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"color":"#eeeeee"},{"weight":0.8}]},{"featureType":"administrative.country","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"administrative.country","elementType":"labels.text","stylers":[{"hue":"#006dff"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#eeeeee"}]},{"featureType":"administrative.country","elementType":"labels.text.stroke","stylers":[{"color":"#384d69"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"on"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#466083"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#eeeeee"}]}]
    };

    var mapElement = document.getElementById('map');
    map = new google.maps.Map(mapElement, mapOptions);
    var flightPlanCoordinates
    $.getJSON("/logbook.json", function(json) {
        flightPlanCoordinates = 
        console.log(json); // this will show the info it in firebug console
    });

     var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Las Palmas</h1>'+
      '<div id="bodyContent">'+
      '<img class="bodyImage" src="/imgs/gallery/img_9514.jpg"></img>' +
      '</div>'+
      '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      var marker = new google.maps.Marker({
        position: {lat: 28.127461, lng: -15.425689},
        map: map,
        title: 'Las Palmas'
      });
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });


    var flightPlanCoordinates = [
      {lat: 58.038, lng: 11.3263},
      {lat: 56.3933, lng: 11.0355},
      {lat: 54.4475, lng: 10.242},
      {lat: 53.8872, lng: 7.9659},
      {lat: 52.9092, lng: 4.3885},
      {lat: 51.3797, lng: 1.7815},
      {lat: 50.8748, lng: 0.9175},
      {lat: 50.7398, lng: -0.7428},
      {lat: 50.4813, lng: -1.542},
      {lat: 49.6658, lng: -3.3005},
      {lat: 48.5948, lng: -4.9888},
      {lat: 47.9995, lng: -5.5248},
      {lat: 45.8407, lng: -7.3567},
      {lat: 43.5887, lng: -9.1327},
      {lat: 42.5792, lng: -9.1698},
      {lat: 42.318, lng: -8.8757},
      {lat: 39.91, lng: -9.3718},
      {lat: 39.1245, lng: -9.4368},
      {lat: 38.4337, lng: -9.3682},
      {lat: 36.975, lng: -8.9273},
      {lat: 36.8557, lng: -8.8102},
      {lat: 37.107704, lng: -8.673827},
      {lat: 36.85566, lng: -8.81016},
      {lat: 36.66716, lng: -8.931},
      {lat: 36.46783, lng: -9.05116},
      {lat: 36.27266, lng: -9.20583},
      {lat: 36.0895, lng: -9.36183},
      {lat: 34.778, lng: -10.4527},
      {lat: 32.4737, lng: -12.1508},
      {lat: 30.1897, lng: -13.9087},
      {lat: 28.2305, lng: -15.3292},


    ];
        var flightPath = new google.maps.Polyline({
          path: flightPlanCoordinates,
          geodesic: true,
          strokeColor: '#ff5599',
          strokeOpacity: 1,
          strokeWeight: 2
        });

        flightPath.setMap(map);

  }

  var config = {
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.firebaseapp.com",
    databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
    storageBucket: "<BUCKET>.appspot.com",
    messagingSenderId: "<SENDER_ID>",
  };

  firebase.initializeApp(config);

  initTabMap();
  
  
})();
