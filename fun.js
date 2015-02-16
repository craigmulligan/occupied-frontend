// configuration
var FbURL = "https://occupied.firebaseio.com";

var app = angular.module("occupied", ["firebase"]);

// syncs controller to firebase OCCUPIED
app.controller('light', ['$scope', '$firebase',
  function($scope, $firebase) {
    //CREATE A FIREBASE REFERENCE
    var baseRef = new Firebase(FbURL + "/occupied");
    var sync = $firebase(baseRef);
	  // download the data into a local object
	  var syncObject = sync.$asObject();
    
// synchronize the object with a three-way data binding
// click on `index.html` above to see it used in the DOM!
    syncObject.$bindTo($scope, "occupied");
  }
]);

// syncs controller to firebase queue
app.controller('queue', ['$scope', '$firebase',
  function($scope, $firebase) {
    //CREATE A FIREBASE REFERENCE
    var ref = new Firebase(FbURL + "/queue");

    var sync = $firebase(ref);
    $scope.queue = sync.$asArray();

    function add_to_queue(person, number) {
      console.log(person)
        $(".queue").prepend("<li class='alert'>We'll text you when it's your turn.</li>");
        $(".queue li.alert").delay(3000).fadeOut('fast');
        var newPerson = ref.push();
        newPerson.set({ 'name': person });
    } 

    // adds new entry to queue
    $( "#notify" ).click(function() {
      $('.select-container').toggleClass('active');
    });

    $('#people').change(function(){
      var self = $(this);
      var person = self.val();
      var number = self.find(':selected').attr('data-number');
      if ($(".queue li:contains('"+person+"')").length == 0) {
        add_to_queue(person);
      } else {
        $(".queue").prepend("<li class='alert'>Your already in the queue "+person+".</li>");
        $(".queue li.alert").delay(3000).fadeOut('fast');
      }
      $('.select-container').removeClass('active');
    });
      

    // removes oldest entry from queue
    $( "#clear" ).click(function() {
      ref.startAt().limitToFirst(1).once("child_added", function(snapshot) {
        var key = snapshot.key();
        ref.child(key).remove();
      });
    });

     // pulls random wiki-article
    $.getJSON("https://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&prop=extracts&explaintext&exintro=&format=json&callback=?", function (data) {
        $.each(data.query.pages, function(k, v) {
            $.getJSON('https://en.wikipedia.org/w/api.php?action=query&prop=info&pageids='+v.pageid+'&inprop=url&format=json&callback=?', function(url) {
                $.each(url.query.pages, function(key, page) {
                    $scope.wikiLink = page.fullurl 
                    $scope.wikiTitle = page.title
                });
            });
        });
    });

  } //controller

]);