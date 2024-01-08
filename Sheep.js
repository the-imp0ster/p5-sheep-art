class Sheep {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(0.5, 1.5));
        this.acceleration = createVector();
        // "steering force"
        this.maxForce = 0.05;
        this.maxSpeed = 2.1;
    }

    update(wolves) {
        if (!wolves || wolves.length === 0) return; 

        let closestWolf = wolves[0];
        let distance = this.position.dist(closestWolf.position);
        let minSpeed = this.maxSpeed * 0.5;
        let speed = map(distance, 0, 100, this.maxSpeed * 1.5, this.maxSpeed);
        // * make sure the sheep's speed is at least the minimum speed
        speed = max(speed, minSpeed);
        this.velocity.setMag(speed);

        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }


    applyForce(force) {
        this.acceleration.add(force);
    }

    flock(sheepArray, rocks, wolf) {
        let alignment = this.align(sheepArray);
        let cohesion = this.cohere(sheepArray);
        let separation = this.separate(sheepArray);
        let rockAvoidance = this.avoidRocks(rocks);

        let wolfAvoidance = this.avoidWolf(wolf);

        alignment.mult(1.0);
        cohesion.mult(1.0);
        separation.mult(2);
        rockAvoidance.mult(1.5);
        // i don't like how it behaves with two or more wolves
        // TODO mess with this
        wolfAvoidance.mult(1.5);

        this.applyForce(rockAvoidance);
        this.applyForce(wolfAvoidance);
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
        let perceptionRadius = 175;
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
                // trying to weight this by distance 🤔 (?)
                diff.div(d * d);
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
        let margin = 10;
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
                // TODO need bezier curves for this and had some rough success on local branch BUT
                // sheep stopped understanding that they were on the same z-index as the rocks wtf
                // stronger force if closer to rock
                diff.mult(maxAvoidanceRange / distance);
                steer.add(diff);
            }
        }
        return steer;
    }



    avoidWolf(wolves) {
        let steer = createVector();
        let closestDist = Infinity;
        let closestWolf = null;

        for (let wolf of wolves) {
            let distance = this.position.dist(wolf.position);
            if (distance < closestDist) {
                closestDist = distance;
                closestWolf = wolf;
            }
        }

        if (closestWolf != null) {

            let diff = p5.Vector.sub(this.position, closestWolf.position);
            diff.normalize();
            // closer to wolf = stronger force
            diff.div(closestDist);
            steer.add(diff);
        }
        return steer;
    }
}
