$(document).ready(function () {

    const parent = $(".bubbles-container");
    $(".bubble").each(function () {
        $(this).css("left", getRandom(parent.width() - $(this).width()).toString() + "px");
        $(this).css("top", getRandom(parent.height() - $(this).height()).toString() + "px");

        runAnimation(new Bubble($(this), parent));
    });

});

const FPS = 60;

/**
 * A Bubble instance
 * @param element (JQuery element)
 * @param parent(JQuery element)
 * @constructor a bubble instance.
 */
function Bubble(element, parent) {
    this.target = element; this.parent = parent;
    this.xStep = (getRandom(4) <= 2) ? 2 : -2;
    this.yStep = (getRandom(4) <= 2) ? 1 : -1;
    this.x = function () { return this.target.position().left; };
    this.y = function () { return this.target.position().top; };
    this.setX = function (value) { this.target.css("left", Math.ceil(value)); };
    this.setY = function (value) { this.target.css("top", Math.ceil(value)); };
    this.move = function () {
            this.setX(this.x() + this.xStep);
            this.setY(this.y() + this.yStep);
        };
    this.checkDirectionSteps = function (){
        if (this.x() + this.xStep >= this.parent.width() - this.target.width()){
            this.xStep = -this.xStep;
        }
        if (this.x() + this.xStep <= 0){
            this.xStep = -this.xStep;
        }
        if (this.y() + this.yStep >= this.parent.height() - this.target.height()){
            this.yStep =- this.yStep;
        }
        if (this.y() + this.yStep <= 0){
            this.yStep =- this.yStep;
        }
    }
}

/**
 * runs the animation on the bubble.
 * @param bubble (Bubble instance)
 */
function runAnimation(bubble){
    setInterval(()=> {
        bubble.checkDirectionSteps();
        bubble.move();
        }, 1000/FPS)
}

/**
 * Returns a float between 0 and max (Excluded)
 * @param max (Float).
 * @return {number}
 */
function getRandom(max) {
    return Math.random() * max;
}