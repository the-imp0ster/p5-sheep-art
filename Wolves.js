// wolves that chase the sheep around

class Wolf {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 3));
        this.acceleration = createVector();
        this.maxForce = 0.1;
        // trying to play with the wolf speed vs the sheep speed
        this.maxSpeed = 3;
    }

    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    chase(sheepArray) {
        let closestDist = Infinity;
        let closestSheep = null;
    
        // chasing the closest sheep
        for (let sheep of sheepArray) {
            let d = this.position.dist(sheep.position);
            if (d < closestDist) {
                closestDist = d;
                closestSheep = sheep;
            }
        }
    
        if (closestSheep != null) {
            let desired = p5.Vector.sub(closestSheep.position, this.position);
            desired.setMag(this.maxSpeed);
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxForce);
            this.applyForce(steer);
        }
    }

    checkEdges() {
        let margin = 10;
        let turnForce = createVector();

        if (this.position.x < margin) {
            turnForce.x = this.maxSpeed;
        } else if (this.position.x > width - margin) {
            turnForce.x = -this.maxSpeed;
        }

        if (this.position.y < margin) {
            turnForce.y = this.maxSpeed;
        } else if (this.position.y > height - margin) {
            turnForce.y = -this.maxSpeed;
        }

        this.applyForce(turnForce);
    }

    

    show() {
        strokeWeight(8);
        stroke(128, 0, 0);
        point(this.position.x, this.position.y);
    }
}
