class Sheep {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(0.5, 1.5));
        this.acceleration = createVector();
        // "steering force"
        this.maxForce = 0.05;
        this.maxSpeed = 2;
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

    flock(sheepArray, rocks) {
        let alignment = this.align(sheepArray);
        let cohesion = this.cohere(sheepArray);
        let separation = this.separate(sheepArray);
        let rockAvoidance = this.avoidRocks(rocks);

        // Weight these forces (change these values to adjust behavior)
        alignment.mult(1.0);
        cohesion.mult(0.7);
        separation.mult(2);
        rockAvoidance.mult(1.5);

        this.applyForce(rockAvoidance);
        this.applyForce(alignment);
        this.applyForce(cohesion);
        this.applyForce(separation);

    }

    align(sheepArray) {
        let perceptionRadius = 50;
        let steering = createVector();
        let total = 0;

        for (let other of sheepArray) {
            let d = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );

            if (other !== this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    cohere(sheepArray) {
        let perceptionRadius = 90;
        let steering = createVector();
        let total = 0;

        for (let other of sheepArray) {
            let d = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );

            if (other !== this && d < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    separate(sheepArray) {
        let perceptionRadius = 40;
        let steering = createVector();
        let total = 0;

        for (let other of sheepArray) {
            let d = dist(
                this.position.x,
                this.position.y,
                other.position.x,
                other.position.y
            );

            if (other !== this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d); // Weight by distance
                steering.add(diff);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }

        return steering;
    }

    showSheep() {
        strokeWeight(8);
        stroke(255);
        point(this.position.x, this.position.y);

    }

    checkEdges() {
        let margin = 10; // Distance from the edge before the sheep turns around
        let turnForce = createVector(0, 0);

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

    avoidRocks(rocks) {
        let steer = createVector();
        let maxAvoidanceRange = 10;

        for (let rock of rocks) {
            let distance = this.position.dist(rock.position);
            if (distance < maxAvoidanceRange + rock.radius) {
                let diff = p5.Vector.sub(this.position, rock.position);
                diff.normalize();
                diff.mult(maxAvoidanceRange / distance); // Stronger force if closer to rock
                steer.add(diff);
            }
        }

        return steer;
    }

}
