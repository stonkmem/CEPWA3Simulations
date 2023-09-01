class Button{
    constructor(x, y, w, h){
        this.x = map(x, 0, 1536, 0, width);
        this.y = map(y, 0, 725, 0, height);
        this.w = map(w, 0, 1536, 0, width);
        this.h = map(h, 0, 725, 0, height);
    }
    display(){
        rectMode(CENTER);
        rect(this.x, this.y, this.w, this.h);
    }
    clicked(){
        if(mouseX>this.x-this.w/2 && mouseX<this.x+this.w/2 && mouseY>this.y-this.h/2 && mouseY<this.y+this.h/2){return true;}
        else{return false;}
    }
}