{"filter":false,"title":"world.js","tooltip":"/html/js/world.js","undoManager":{"mark":100,"position":100,"stack":[[{"start":{"row":128,"column":34},"end":{"row":129,"column":0},"action":"insert","lines":["",""],"id":34867},{"start":{"row":129,"column":0},"end":{"row":129,"column":11},"action":"insert","lines":["           "]}],[{"start":{"row":129,"column":11},"end":{"row":130,"column":0},"action":"insert","lines":["",""],"id":34868},{"start":{"row":130,"column":0},"end":{"row":130,"column":11},"action":"insert","lines":["           "]}],[{"start":{"row":130,"column":11},"end":{"row":136,"column":6},"action":"insert","lines":["var coord = render.pixelsToTiles(x, y);","     var clsn = isCollisionByTiles(coord.x, coord.y);","     if (typeof collisionLabel !== \"undefined\") {","       var index = tilesMap.indexAt(coord.x, coord.y);","       var type = tilesMap.map[index];","       collisionLabel.text = \"tile x: \" + clsn.result.x + \" y: \" + clsn.result.y + \" clsn: \" + clsn.hit + \" index: \" + index + \" type: \" + type;","     }"],"id":34869}],[{"start":{"row":130,"column":44},"end":{"row":130,"column":45},"action":"remove","lines":["x"],"id":34870},{"start":{"row":130,"column":44},"end":{"row":130,"column":51},"action":"insert","lines":["mouse.x"]}],[{"start":{"row":130,"column":53},"end":{"row":130,"column":54},"action":"remove","lines":["y"],"id":34871},{"start":{"row":130,"column":53},"end":{"row":130,"column":60},"action":"insert","lines":["mouse.x"]}],[{"start":{"row":130,"column":59},"end":{"row":130,"column":60},"action":"remove","lines":["x"],"id":34872}],[{"start":{"row":130,"column":59},"end":{"row":130,"column":60},"action":"insert","lines":["y"],"id":34873}],[{"start":{"row":99,"column":0},"end":{"row":117,"column":0},"action":"remove","lines":["       /*---------*/","       /* Pointer */","       /*---------*/","       (function() {","         pointer = new createjs.Shape();","         var g = pointer.graphics;","         g.setStrokeStyle(1);","         g.beginFill(\"rgba(255,255,0,0.5)\");","         g.beginStroke(\"#000\");","         g.rect(0, 0, resources.TILE_SIZE * 2, resources.TILE_SIZE * 2);","         game.stage.addChild(pointer);","         pointer.visible = false;","         game.stage.addEventListener(\"stagemousemove\", function(event) {","           mouse.x = event.stageX;","           mouse.y = event.stageY;","           movePointer(mouse.x, mouse.y);","         });","       })();",""],"id":34874}],[{"start":{"row":50,"column":28},"end":{"row":50,"column":29},"action":"remove","lines":[" "],"id":34875},{"start":{"row":111,"column":0},"end":{"row":111,"column":11},"action":"remove","lines":["           "]},{"start":{"row":113,"column":0},"end":{"row":113,"column":6},"action":"insert","lines":["      "]},{"start":{"row":114,"column":0},"end":{"row":114,"column":3},"action":"insert","lines":["   "]},{"start":{"row":114,"column":8},"end":{"row":114,"column":11},"action":"insert","lines":["   "]},{"start":{"row":115,"column":0},"end":{"row":115,"column":6},"action":"insert","lines":["      "]},{"start":{"row":116,"column":7},"end":{"row":116,"column":13},"action":"insert","lines":["      "]},{"start":{"row":117,"column":0},"end":{"row":117,"column":6},"action":"insert","lines":["      "]},{"start":{"row":118,"column":0},"end":{"row":118,"column":6},"action":"insert","lines":["      "]}],[{"start":{"row":118,"column":12},"end":{"row":119,"column":0},"action":"insert","lines":["",""],"id":34876},{"start":{"row":119,"column":0},"end":{"row":119,"column":11},"action":"insert","lines":["           "]}],[{"start":{"row":421,"column":7},"end":{"row":421,"column":8},"action":"insert","lines":["/"],"id":34877}],[{"start":{"row":421,"column":8},"end":{"row":421,"column":9},"action":"insert","lines":["/"],"id":34878}],[{"start":{"row":121,"column":70},"end":{"row":122,"column":0},"action":"insert","lines":["",""],"id":34879},{"start":{"row":122,"column":0},"end":{"row":122,"column":11},"action":"insert","lines":["           "]}],[{"start":{"row":122,"column":11},"end":{"row":122,"column":71},"action":"insert","lines":["//console.log(\"click \" + event.stageX + \":\" + event.stageY);"],"id":34880}],[{"start":{"row":122,"column":11},"end":{"row":122,"column":12},"action":"remove","lines":["/"],"id":34881}],[{"start":{"row":122,"column":11},"end":{"row":122,"column":12},"action":"remove","lines":["/"],"id":34882}],[{"start":{"row":122,"column":24},"end":{"row":122,"column":67},"action":"remove","lines":["click \" + event.stageX + \":\" + event.stageY"],"id":34883},{"start":{"row":122,"column":24},"end":{"row":122,"column":42},"action":"insert","lines":["mouse.down = false"]}],[{"start":{"row":122,"column":42},"end":{"row":122,"column":43},"action":"insert","lines":["\""],"id":34884}],[{"start":{"row":105,"column":67},"end":{"row":106,"column":0},"action":"insert","lines":["",""],"id":34885},{"start":{"row":106,"column":0},"end":{"row":106,"column":11},"action":"insert","lines":["           "]}],[{"start":{"row":106,"column":11},"end":{"row":106,"column":45},"action":"insert","lines":["console.log(\"mouse.down = false\");"],"id":34886}],[{"start":{"row":106,"column":37},"end":{"row":106,"column":42},"action":"remove","lines":["false"],"id":34887},{"start":{"row":106,"column":37},"end":{"row":106,"column":41},"action":"insert","lines":["true"]}],[{"start":{"row":120,"column":0},"end":{"row":120,"column":11},"action":"remove","lines":["           "],"id":34888}],[{"start":{"row":122,"column":38},"end":{"row":122,"column":50},"action":"remove","lines":["mouserelease"],"id":34889},{"start":{"row":122,"column":38},"end":{"row":122,"column":45},"action":"insert","lines":["pressup"]}],[{"start":{"row":50,"column":24},"end":{"row":50,"column":25},"action":"remove","lines":["2"],"id":34890}],[{"start":{"row":50,"column":24},"end":{"row":50,"column":25},"action":"insert","lines":["1"],"id":34891}],[{"start":{"row":45,"column":0},"end":{"row":46,"column":0},"action":"remove","lines":["   var pointer;",""],"id":34892}],[{"start":{"row":45,"column":0},"end":{"row":46,"column":0},"action":"remove","lines":["",""],"id":34893}],[{"start":{"row":102,"column":20},"end":{"row":103,"column":0},"action":"insert","lines":["",""],"id":34894},{"start":{"row":103,"column":0},"end":{"row":103,"column":9},"action":"insert","lines":["         "]}],[{"start":{"row":103,"column":9},"end":{"row":103,"column":41},"action":"insert","lines":["stage.enableMouseOver(frequency)"],"id":34895}],[{"start":{"row":103,"column":9},"end":{"row":103,"column":10},"action":"insert","lines":["g"],"id":34896}],[{"start":{"row":103,"column":10},"end":{"row":103,"column":11},"action":"insert","lines":["a"],"id":34897}],[{"start":{"row":103,"column":11},"end":{"row":103,"column":12},"action":"insert","lines":["m"],"id":34898}],[{"start":{"row":103,"column":12},"end":{"row":103,"column":13},"action":"insert","lines":["e"],"id":34899}],[{"start":{"row":103,"column":13},"end":{"row":103,"column":14},"action":"insert","lines":["."],"id":34900}],[{"start":{"row":103,"column":36},"end":{"row":103,"column":45},"action":"remove","lines":["frequency"],"id":34901},{"start":{"row":103,"column":36},"end":{"row":103,"column":37},"action":"insert","lines":["2"]}],[{"start":{"row":103,"column":37},"end":{"row":103,"column":38},"action":"insert","lines":["0"],"id":34902}],[{"start":{"row":103,"column":39},"end":{"row":103,"column":40},"action":"insert","lines":[";"],"id":34903}],[{"start":{"row":103,"column":36},"end":{"row":103,"column":37},"action":"remove","lines":["2"],"id":34904}],[{"start":{"row":103,"column":36},"end":{"row":103,"column":37},"action":"insert","lines":["1"],"id":34905}],[{"start":{"row":111,"column":0},"end":{"row":111,"column":1},"action":"insert","lines":["/"],"id":34906}],[{"start":{"row":111,"column":1},"end":{"row":111,"column":2},"action":"insert","lines":["*"],"id":34907}],[{"start":{"row":119,"column":0},"end":{"row":119,"column":1},"action":"insert","lines":["*"],"id":34908}],[{"start":{"row":119,"column":1},"end":{"row":119,"column":2},"action":"insert","lines":["/"],"id":34909}],[{"start":{"row":109,"column":10},"end":{"row":109,"column":11},"action":"insert","lines":["/"],"id":34910}],[{"start":{"row":109,"column":11},"end":{"row":109,"column":12},"action":"insert","lines":["/"],"id":34911}],[{"start":{"row":110,"column":11},"end":{"row":110,"column":12},"action":"insert","lines":["/"],"id":34912}],[{"start":{"row":110,"column":12},"end":{"row":110,"column":13},"action":"insert","lines":["/"],"id":34913}],[{"start":{"row":109,"column":10},"end":{"row":109,"column":11},"action":"remove","lines":["/"],"id":34914}],[{"start":{"row":109,"column":10},"end":{"row":109,"column":11},"action":"remove","lines":["/"],"id":34915}],[{"start":{"row":110,"column":11},"end":{"row":110,"column":12},"action":"remove","lines":["/"],"id":34916}],[{"start":{"row":110,"column":11},"end":{"row":110,"column":12},"action":"remove","lines":["/"],"id":34917}],[{"start":{"row":108,"column":72},"end":{"row":109,"column":0},"action":"insert","lines":["",""],"id":34918},{"start":{"row":109,"column":0},"end":{"row":109,"column":11},"action":"insert","lines":["           "]}],[{"start":{"row":109,"column":11},"end":{"row":109,"column":21},"action":"insert","lines":["mouse.down"],"id":34919}],[{"start":{"row":109,"column":11},"end":{"row":109,"column":12},"action":"insert","lines":["i"],"id":34920}],[{"start":{"row":109,"column":12},"end":{"row":109,"column":13},"action":"insert","lines":["f"],"id":34921}],[{"start":{"row":109,"column":13},"end":{"row":109,"column":14},"action":"insert","lines":[" "],"id":34922}],[{"start":{"row":109,"column":14},"end":{"row":109,"column":15},"action":"insert","lines":["("],"id":34923}],[{"start":{"row":109,"column":25},"end":{"row":109,"column":26},"action":"insert","lines":["ú"],"id":34924}],[{"start":{"row":109,"column":25},"end":{"row":109,"column":26},"action":"remove","lines":["ú"],"id":34925}],[{"start":{"row":109,"column":25},"end":{"row":109,"column":26},"action":"insert","lines":[")"],"id":34926}],[{"start":{"row":109,"column":26},"end":{"row":109,"column":27},"action":"insert","lines":[" "],"id":34927}],[{"start":{"row":109,"column":27},"end":{"row":109,"column":28},"action":"insert","lines":["{"],"id":34928}],[{"start":{"row":111,"column":34},"end":{"row":112,"column":0},"action":"insert","lines":["",""],"id":34929},{"start":{"row":112,"column":0},"end":{"row":112,"column":11},"action":"insert","lines":["           "]}],[{"start":{"row":112,"column":11},"end":{"row":112,"column":12},"action":"insert","lines":["}"],"id":34930}],[{"start":{"row":110,"column":11},"end":{"row":110,"column":13},"action":"insert","lines":["  "],"id":34931},{"start":{"row":111,"column":0},"end":{"row":111,"column":2},"action":"insert","lines":["  "]},{"start":{"row":113,"column":0},"end":{"row":113,"column":11},"action":"insert","lines":["           "]},{"start":{"row":114,"column":0},"end":{"row":114,"column":11},"action":"insert","lines":["           "]},{"start":{"row":115,"column":11},"end":{"row":115,"column":22},"action":"insert","lines":["           "]},{"start":{"row":116,"column":0},"end":{"row":116,"column":2},"action":"insert","lines":["  "]},{"start":{"row":116,"column":13},"end":{"row":116,"column":22},"action":"insert","lines":["         "]},{"start":{"row":117,"column":0},"end":{"row":117,"column":4},"action":"insert","lines":["    "]},{"start":{"row":117,"column":17},"end":{"row":117,"column":24},"action":"insert","lines":["       "]},{"start":{"row":118,"column":13},"end":{"row":118,"column":24},"action":"insert","lines":["           "]},{"start":{"row":119,"column":0},"end":{"row":119,"column":11},"action":"insert","lines":["           "]},{"start":{"row":120,"column":11},"end":{"row":120,"column":22},"action":"insert","lines":["           "]},{"start":{"row":121,"column":0},"end":{"row":121,"column":11},"action":"insert","lines":["           "]}],[{"start":{"row":103,"column":9},"end":{"row":103,"column":10},"action":"insert","lines":["/"],"id":34932}],[{"start":{"row":103,"column":10},"end":{"row":103,"column":11},"action":"insert","lines":["/"],"id":34933}],[{"start":{"row":122,"column":12},"end":{"row":123,"column":0},"action":"insert","lines":["",""],"id":34934},{"start":{"row":123,"column":0},"end":{"row":123,"column":9},"action":"insert","lines":["         "]}],[{"start":{"row":123,"column":9},"end":{"row":123,"column":47},"action":"insert","lines":["object.onmouseup=function(){myScript};"],"id":34935}],[{"start":{"row":123,"column":9},"end":{"row":123,"column":15},"action":"remove","lines":["object"],"id":34936},{"start":{"row":123,"column":9},"end":{"row":123,"column":10},"action":"insert","lines":["g"]}],[{"start":{"row":123,"column":10},"end":{"row":123,"column":11},"action":"insert","lines":["a"],"id":34937}],[{"start":{"row":123,"column":11},"end":{"row":123,"column":12},"action":"insert","lines":["m"],"id":34938}],[{"start":{"row":123,"column":12},"end":{"row":123,"column":13},"action":"insert","lines":["e"],"id":34939}],[{"start":{"row":123,"column":13},"end":{"row":123,"column":14},"action":"insert","lines":["."],"id":34940}],[{"start":{"row":123,"column":14},"end":{"row":123,"column":15},"action":"insert","lines":["c"],"id":34941}],[{"start":{"row":123,"column":15},"end":{"row":123,"column":16},"action":"insert","lines":["a"],"id":34942}],[{"start":{"row":123,"column":16},"end":{"row":123,"column":17},"action":"insert","lines":["n"],"id":34943}],[{"start":{"row":123,"column":14},"end":{"row":123,"column":17},"action":"remove","lines":["can"],"id":34944},{"start":{"row":123,"column":14},"end":{"row":123,"column":26},"action":"insert","lines":["cancelBubble"]}],[{"start":{"row":123,"column":14},"end":{"row":123,"column":26},"action":"remove","lines":["cancelBubble"],"id":34945}],[{"start":{"row":123,"column":14},"end":{"row":123,"column":15},"action":"insert","lines":["c"],"id":34946}],[{"start":{"row":123,"column":15},"end":{"row":123,"column":16},"action":"insert","lines":["a"],"id":34947}],[{"start":{"row":123,"column":16},"end":{"row":123,"column":17},"action":"insert","lines":["n"],"id":34948}],[{"start":{"row":123,"column":14},"end":{"row":123,"column":17},"action":"remove","lines":["can"],"id":34949},{"start":{"row":123,"column":14},"end":{"row":123,"column":20},"action":"insert","lines":["canvas"]}],[{"start":{"row":124,"column":9},"end":{"row":124,"column":10},"action":"insert","lines":["/"],"id":34952}],[{"start":{"row":124,"column":10},"end":{"row":124,"column":11},"action":"insert","lines":["/"],"id":34953}],[{"start":{"row":123,"column":42},"end":{"row":123,"column":52},"action":"remove","lines":["myScript};"],"id":34954}],[{"start":{"row":123,"column":21},"end":{"row":123,"column":42},"action":"remove","lines":["onmouseup=function(){"],"id":34955},{"start":{"row":123,"column":21},"end":{"row":123,"column":56},"action":"insert","lines":["object.addEventListener(\"mouseup\", "]}],[{"start":{"row":123,"column":21},"end":{"row":123,"column":27},"action":"remove","lines":["object"],"id":34956}],[{"start":{"row":123,"column":21},"end":{"row":123,"column":22},"action":"remove","lines":["."],"id":34957}],[{"start":{"row":123,"column":49},"end":{"row":123,"column":66},"action":"insert","lines":["function(event) {"],"id":34958}],[{"start":{"row":124,"column":9},"end":{"row":124,"column":11},"action":"insert","lines":["  "],"id":34959}],[{"start":{"row":51,"column":11},"end":{"row":51,"column":12},"action":"remove","lines":["0"],"id":34960},{"start":{"row":51,"column":11},"end":{"row":51,"column":25},"action":"insert","lines":["MOUSE_COOLDOWN"]}],[{"start":{"row":422,"column":16},"end":{"row":422,"column":17},"action":"remove","lines":["+"],"id":34961}],[{"start":{"row":422,"column":16},"end":{"row":422,"column":17},"action":"insert","lines":["-"],"id":34962}],[{"start":{"row":423,"column":20},"end":{"row":423,"column":21},"action":"remove","lines":[">"],"id":34963}],[{"start":{"row":423,"column":20},"end":{"row":423,"column":21},"action":"insert","lines":["<"],"id":34964}],[{"start":{"row":423,"column":21},"end":{"row":423,"column":22},"action":"remove","lines":["="],"id":34965}],[{"start":{"row":423,"column":21},"end":{"row":423,"column":22},"action":"insert","lines":["="],"id":34966}],[{"start":{"row":423,"column":23},"end":{"row":423,"column":37},"action":"remove","lines":["MOUSE_COOLDOWN"],"id":34967}],[{"start":{"row":423,"column":23},"end":{"row":423,"column":24},"action":"insert","lines":["0"],"id":34968}],[{"start":{"row":426,"column":20},"end":{"row":426,"column":21},"action":"remove","lines":["0"],"id":34969},{"start":{"row":426,"column":20},"end":{"row":426,"column":34},"action":"insert","lines":["MOUSE_COOLDOWN"]}]]},"ace":{"folds":[],"scrolltop":5547,"scrollleft":0,"selection":{"start":{"row":425,"column":30},"end":{"row":425,"column":30},"isBackwards":false},"options":{"tabSize":2,"useSoftTabs":true,"guessTabSize":false,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":395,"state":"no_regex","mode":"ace/mode/javascript"}},"timestamp":1455480400994,"hash":"0ae0c32f3efd86b2f6bae3cc451cbc6dc0b6d842"}