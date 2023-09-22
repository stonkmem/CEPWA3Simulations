class CoriolisSeeder {
    constructor() {
        this._s = createVector(0, 10); //s stores the position vector w.r.t. the rotating frame
        this.freezeS = this.s;
        this._theta = 270;
        this.v = createVector(5 * sin(0), 5 * cos(0)); //v stores the velocity vector of the particle w.r.t. the rotating frame
        this.v_f = createVector(5 * sin(0), 5 * cos(0));
        this.freezeTheta = 0;
    }
    rot_prime(a) {
        let s = sin(theta);
        let c = cos(theta);
        return createVector(a.x * c - a.y * s + width / 2, a.x * s + a.y * c + height / 2);
    }
    rot_freezeTheta(a) {
        s = sin(this.freezeTheta);
        c = cos(this.freezeTheta);
        return createVector(a.x * c - a.y * s, a.x * s + a.y * c);
    }
    displayStrapped() {
        strokeWeight(2);
        this.r = this.rot_prime(this.s); //r stores the rotated position vector in the observer frame
        this.r_hat = p5.Vector.normalize(this.r);
        this.v = createVector(5 * sin(this.theta), 5 * cos(this.theta));
        this.v_hat = p5.Vector.normalize(this.v);
        fill(0); stroke(0);
        circle(this.r.x, this.r.y, 15);
        strokeWeight(4);stroke(96, 75, 0);
        line(width/2, height/2, this.r.x, this.r.y);
        strokeWeight(2);stroke(0);

        //DISPLAY APPPLIED VELOCITY
        fill(150, 255, 150); stroke(100, 255, 100);
        push();
        applyMatrix(cos(theta), sin(theta), -sin(theta), cos(theta), this.r.x, this.r.y);
        this.v = this.v.mult(7.5);
        line(0, 0, this.v.x, this.v.y);
        applyMatrix(this.v_hat.x, this.v_hat.y, -this.v_hat.y, this.v_hat.x, this.v.x, this.v.y);
        triangle(0,5,5*2,0,0,-1*5);
        pop();

        //DISPLAY TANGENTIAL VELOCITY
        fill(0, 0, 255); stroke(0, 0, 255);
        push();
        applyMatrix(cos(theta), sin(theta), -sin(theta), cos(theta), this.r.x, this.r.y);
        this.tan_v = createVector(0, 0, -10*omega).cross(createVector(0, this._s.y, 0)).mult(10/21);
        this.tan_v_hat = p5.Vector.normalize(this.tan_v);
        line(0, 0, this.tan_v.x, this.tan_v.y);
        applyMatrix(this.tan_v_hat.x, this.tan_v_hat.y, -this.tan_v_hat.y, this.tan_v_hat.x, this.tan_v.x, this.tan_v.y);
        triangle(0,5,5*2,0,0,-1*5);
        pop();

        //DISPLAY TOTAL VELOCITY
        fill(0, 0, 0); stroke(0, 0, 0);
        push();
        applyMatrix(cos(theta), sin(theta), -sin(theta), cos(theta), this.r.x, this.r.y);
        this.tan_v_hat = p5.Vector.normalize(this.tan_v);
        this.v_f = p5.Vector.add(this.tan_v, this.v);
        this.v_f_hat = p5.Vector.normalize(this.v_f);
        line(0, 0, this.v_f.x, this.v_f.y);
        applyMatrix(this.v_f_hat.x, this.v_f_hat.y, -this.v_f_hat.y, this.v_f_hat.x, this.v_f.x, this.v_f.y);
        triangle(0,5,5*2,0,0,-1*5);
        pop();

        this.freezeTheta = theta;
        this.freezeS = this.s;
    } 

    transition(){
        this.freezeLoc = createVector(this.s.x, this.s.y);
    }

    displayProjected() {
        push();
        applyMatrix(cos(this.freezeTheta), sin(this.freezeTheta), -sin(this.freezeTheta), cos(this.freezeTheta), width/2, height/2);
        strokeWeight(2);
        fill(0); stroke(0);
        if(dist(0, 0, this.s.x, this.s.y)<height/2-110){
            this.s.add(p5.Vector.mult(this.v_f, 0.05));
        }
        else{
            theta += omega;
        }
        circle(this.s.x, this.s.y, 15); //ACTUAL BALL
        stroke(125);
        pop();
        
        stroke(125);
        line(this.rot_prime(this.freezeLoc).x, this.rot_prime(this.freezeLoc).y, this.rot_prime(this.s).x, this.rot_prime(this.s).y);

        fill(125); stroke(125);
        push();
        applyMatrix(cos(theta), sin(theta), -sin(theta), cos(theta), this.rot_prime(this.freezeLoc).x, this.rot_prime(this.freezeLoc).y);
        
        line(0, 0, this.v_f.x, this.v_f.y);
        pop();

        stroke(125);
        line(width/2 + this.rot_freezeTheta(this.s).x, height/2 + this.rot_freezeTheta(this.s).y, width/2 + this.rot_freezeTheta(this.freezeLoc).x, height/2 + this.rot_freezeTheta(this.freezeLoc).y);

        push();
        applyMatrix(cos(this.freezeTheta), sin(this.freezeTheta), -sin(this.freezeTheta), cos(this.freezeTheta), this.rot_freezeTheta(this.freezeLoc).x + width/2, this.rot_freezeTheta(this.freezeLoc).y + height/2);
        stroke(125);fill(125);
        line(0, 0, this.v_f.x, this.v_f.y);
        applyMatrix(this.v_f_hat.x, this.v_f_hat.y, -this.v_f_hat.y, this.v_f_hat.x, this.v_f.x, this.v_f.y);
        triangle(0,5,5*2,0,0,-1*5);
        pop();

        push();
        applyMatrix(cos(theta), sin(theta), -sin(theta), cos(theta), width/2, height/2);
        stroke(200, 200, 200, 0.5);fill(200, 200, 200, 0.5);
        circle(this.s.x, this.s.y, 15);
        pop();


        if(dist(this.s.x, this.s.y, 0, 0)<height/2-110){
            if(frameCount%2===0){
                pointArr.push(new pointSeed(width/2 + this.s.x * cos(this.freezeTheta) - this.s.y * sin(this.freezeTheta), height/2 + this.s.x * sin(this.freezeTheta) + this.s.y * cos(this.freezeTheta), theta, (200, 200, 200)));
            }
        }
        for (let i = 0; i < pointArr.length; i += 1) {
            pointArr[i].displayRot();
        }
    }
    get s() {
        return this._s;
    }
    set s(y) {
        this._s = createVector(0, y);
    }
    get theta() {
        return this._theta;
    }
    set theta(inTheta) {
        this._theta = inTheta;
    }
}
