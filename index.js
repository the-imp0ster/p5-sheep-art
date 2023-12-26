let sheepFlock = [];
let rocks = [];
let wolves = [];

function setup() {
    createCanvas(600, 600);
    // make the sheep as per for loop (40 seems to work well on 600 x 600 canvas)
    for (let i = 0; i < 30; i++) {
        sheepFlock.push(new Sheep(random(width), random(height)));
    }

    // make the rocks
    rocks.push(new Rock(100, 300, 15));
    rocks.push(new Rock(500, 200, 10));
    rocks.push(new Rock(80, 70, 10));

    // make the wolves (wolf rn, i don't like how they behave with two on the canvas yet)
    wolves.push(new Wolf(random(width), random(height)));
    // wolves.push(new Wolf(random(width), random(height)));
}

function draw() {
    background("green");

    for (let sheep of sheepFlock) {
        sheep.flock(sheepFlock, rocks, wolves);
        sheep.checkEdges();
        sheep.update(wolves);
        sheep.showSheep();
    }

    for (let rock of rocks) {
        rock.showRocks();
    }

    for (let wolf of wolves) {
        wolf.chase(sheepFlock);
        wolf.checkEdges();
        wolf.update(sheepFlock, rocks);
        wolf.show();
    }
}
