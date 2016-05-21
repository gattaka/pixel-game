/// <reference path="exp.ts"/>
/// <reference path="../lib/createjs/createjs.d.ts"/>

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

var user = new Student("Jane", "M.", "User");

function run() {
    var CANVAS_ID = "theCanvas";
    var canvas = document.getElementById(CANVAS_ID);
    canvas.style.backgroundColor = "#b1ecff";
    var stage: createjs.Stage = new createjs.Stage(CANVAS_ID);

    var fpsLabel = new createjs.Text("-- fps", "bold 18px Arial", "#00f");
    stage.addChild(fpsLabel);
    fpsLabel.x = 10;
    fpsLabel.y = 10;

    /*-----------*/
    /* Time init */
    /*-----------*/
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(60);

    function handleTick(event) {
        stage.update();
    }
}