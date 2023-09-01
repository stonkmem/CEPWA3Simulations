class pointSeed{
    constructor(x, y, t, color){
        this.x = x;
        this.y = y;
        this.theta_t = t;
        this.m = 50;
        this.triangle = 5;
        this.color = color;
    }
    rot_prime(a, b){
        let theta_prime = theta - this.theta_t;
        a -= width/2;
        b -= height/2;
        s = sin(theta_prime);
        c = cos(theta_prime);
        return createVector(a*c - b*s + width/2, a*s + b*c + height/2);
    }
    displayRot(){
        this.s = this.rot_prime(this.x, this.y);
        fill(this.color);stroke(this.color);
        circle(this.s.x, this.s.y, 15); 
    }
    displayAccVec(){
        strokeWeight(3);
        stroke(255, 0, 0);
        this.s = this.rot_prime(this.x, this.y);
        this.mag_r = dist(this.s.x, this.s.y, width/2, height/2);
        this.r_hat = createVector(width/2, height/2).sub(this.s);
        this.r_hat.normalize();
        this.a_vec = p5.Vector.mult(this.r_hat, this.m * this.mag_r * omega * omega).mult(2.5);
        this.r_hat.normalize();
        if(this.m * this.mag_r * omega * omega>0){
            line(this.s.x, this.s.y, this.s.x+this.a_vec.x, this.s.y+this.a_vec.y);
            push();
            applyMatrix(this.r_hat.x, this.r_hat.y, +this.r_hat.y, -this.r_hat.x, this.s.x+this.a_vec.x, this.s.y+this.a_vec.y);
            fill(255, 0, 0);
            triangle(0,this.triangle,this.triangle*2,0,0,-1*this.triangle);
            pop();
        }
    }
    displayVelVec(){
        strokeWeight(3);
        stroke(0, 0, 255);
        this.s = this.rot_prime(this.x, this.y);
        let omega_vec = createVector(0, 0, -omega);
        this.r_vec = createVector(width/2, height/2).sub(this.s);
        this.v_vec = this.r_vec.cross(omega_vec).mult(2.5);
        if(this.v_vec.mag()>0){
            line(this.s.x, this.s.y, this.s.x+this.v_vec.x, this.s.y+this.v_vec.y);
            push();
            this.v_hat = p5.Vector.normalize(this.v_vec);
            applyMatrix(this.v_hat.x, this.v_hat.y, -this.v_hat.y, this.v_hat.x, this.s.x+this.v_vec.x, this.s.y+this.v_vec.y);
            fill(0, 0, 255);
            triangle(0,this.triangle,this.triangle*2,0,0,-1*this.triangle);
            pop();
        }
    }
}