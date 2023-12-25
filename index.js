// Contents of index.js
let sheepFlock = [];
let rocks = [];

function setup() {
    createCanvas(600, 600);
    // create the sheep
    for (let i = 0; i < 40; i++) {
        sheepFlock.push(new Sheep(random(width), random(height)));
    }

    // create the rocks
    rocks.push(new Rock(100, 300, 20));
    rocks.push(new Rock(500, 200, 10));
    rocks.push(new Rock(80, 70, 10));
}

function draw() {
    background("green");

    for (let sheep of sheepFlock) {
        sheep.flock(sheepFlock, rocks);
        sheep.checkEdges();
        sheep.update();
        sheep.showSheep();
    }

    for (let rock of rocks) {
        rock.showRocks();
    }
}
