class Rock {
    constructor(x, y, radius) {
        this.position = createVector(x, y);
        this.radius = radius;
    }

    showRocks() {
        fill("darkslategrey");
        strokeWeight(0);
        // stroke(255);
        ellipse(this.position.x, this.position.y, this.radius * 2);
    }
}

