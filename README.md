# Sheep, Wolf, Rocks

## Some Notes

Sheep, Wolf, Rocks is a simulation program written with p5.js (on an html canvas) that is meant to simulate the movement of a flock of sheep around their pen while navigating rocks and predators.

I kinda threw this together with the intention of it being purely a one-time artistic simulation thing but it's ending up being a boppin exploration of simulating force mechanics.

So here are a few notes about my thought process for this program and the items and forces I've added and hope to add.

## Iteration I: Before the Wolf

### Sheep

The first iteration of the program was a predator-less flock of sheep exhibiting typical flocking behaviours while moving around an enclosure and navigating around rocks. I did this using a few "forces" for the sheep class: alignment, cohesion, and separation.  These three forces were applied individually using a force application function.

**Alignment:** Each sheep in the flock adjusts its direction to match the *average heading* of other nearby sheep.  The goal for this rule was to provide the sheep with a sort of unified movement direction.

**Cohesion:** This force steers a sheep towards the *average position* of its neighbors, this helps the flock appear to stick together.

**Separation:** I wanted the sheep to avoid overcrowding and trampling.  The separation force steers a sheep *away from its immediate neighbors*, creating visible, but not unnatural, spacing within the flock.

### Rocks

I also placed three rocks that the sheep avoid during their movement around their enclosure.

**Rock Avoidance:** I added an additional force to the sheep class that informs the sheep where the rocks are and prevents them from occupying the same space on the canvas (repelling them, sort of).  

## Iteration II: Adding the Wolf

Adding the wolf introduced more complexity to the simulation than I thought it would. The sheep's behaviour evolved from simple flocking mechanics to include real-time responses to a moving threat (much more realistic). 
The biggest piece to this was keeping all the forces balanced to keep the essence of flocking behaviour while incorporating the survival instincts of the sheep in the presence of a predator.

### Wolf Forces

**Predator Avoidance:** With the wolf introduced as a predator the sheep class needed an additional avoidance force was. I wanted this force *to take precedence over all other forces when needed*.

**Speed Adjustment:** I also felt that the simulation would be more realistic if the sheep could dynamically respond to the presence of the wolf. So, the closer a sheep is to the wolf, the stronger the avoidance force that is applied to it. This force is calculated by finding the direction away from the wolf and inversely scaling it based on the distance to the wolf.  Both the sheep class and the wolf class have a maximum speed.

The existing flocking behaviour (alignment, cohesion, separation) had to be balanced with the new survival instinct of avoiding the wolf. So while the sheep do try to stick together and move as a unit, their immediate response to a nearby wolf takes priority.

## Stuff I Want to Add/Upgrade

The sheep certainly do avoid the rocks as well as the boundaries of the canvas.  But they don't do it gracefully; they sort of ricochet off and it ends up looking kind of arcade-ish and not realistic.  Bezier curves were suggested to add a gradual, smooth avoidance of the obstacle rather than having them erratically bounce off.  I've had some success already with the Bezier curves locally as I learn about the math and how to apply it to these types of forces.  Super cool and I think it will make a huge difference.


