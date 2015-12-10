var express = require('express');
var router = express.Router();
var gm = require('gm').subClass({imageMagick: true});
var image_store_path = __dirname + "/";

router.get('/upload/:manips/:image_name', function(req, res) {
  var manips = filter_manipulations(req.params.manips)
  var image_path = image_store_path + req.params.image_name;
  var image = create_image(image_path, manips, function(err, result){
    res.sendFile(result);
  });
});


function filter_manipulations(params){
  var manipulations = [];

  params.split(",").forEach(function(param) {
    var kvPair = param.split("_");
    var key = kvPair[0];
    var value = kvPair[1];
    var temp = {};
    temp[key] = value;
    manipulations.push(temp);
  });

  return manipulations;
}


function create_image(image_path, manips, cb) {

  var isHeight = false
  var valHeight = 0
  var isWidth = false
  var valWidth = 0
  var isFill = false

  manips.forEach(function(manip) {
    if(manip.hasOwnProperty("h")){
      isHeight = true
      valHeight = manip["h"]
    }
    if(manip.hasOwnProperty("w")){
      isWidth = true
      valWidth = manip["w"]
    }
    if(manip.hasOwnProperty("c_fill")){
      isFill = true
    }
  });

  var image = gm(image_path)

  if (isWidth && isHeight) {
    image = image.resize(valWidth, valHeight);
  }

  if (isFill) {
    image = image.gravity("center").extent(valWidth, valHeight);
  }

  image.write(image_path + "modified.png", function(err) {
    if(err) { console.log("saving error\n" + err.message); return; }
    cb(err, image_path + ".png");
  });
}

module.exports = router;
