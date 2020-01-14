import GameObject from '../config/gameObject';
import { Data } from 'phaser';

export const Tutorial = new GameObject({
    create(){
        this.tutorial = {left: {}, right: {}, count: 0};
        this.tutorial.left.text = this.add.text(0, window.innerHeight * .05, 'Press the key Q\nTouch Left\n To tilt to left', { fontFamily:  window.Data.fontFamily});
        this.tutorial.right.text = this.add.text(0, window.innerHeight * .05, 'Press the key E\nTouch Right\n To tilt to Right', { fontFamily:  window.Data.fontFamily});

        this.resizeFont();
        this.tutorial.right.text.y = window.innerHeight;
        this.tutorial.left.text.y = window.innerHeight;
    },
    update(){
        if(window.Data.play == true){
            if(this.tutorial.count == 0){
                if(this.tutorial.right.text.y > window.innerHeight - this.tutorial.right.text.displayHeight-30) this.tutorial.right.text.y -= 10;
                if(this.tutorial.left.text.y > window.innerHeight - this.tutorial.left.text.displayHeight-30) this.tutorial.left.text.y -= 10;
                if(this.tutorial.left.text.y <= window.innerHeight - this.tutorial.left.text.displayHeight-30) this.tutorial.count++;
            }
        }
        
        if((this.tutorial.count > 0 && parseInt(window.Data.score) >= 10) || window.Data.play == false){
            if(this.tutorial.right.text.y < window.innerHeight) this.tutorial.right.text.y += 10;
            if(this.tutorial.left.text.y < window.innerHeight) this.tutorial.left.text.y += 10;
        }
    },
    resizeFont(){
        this.tutorial.left.text.setAlign('center');
        this.tutorial.left.text.setFontSize(18);
        this.tutorial.left.text.setColor(window.Data.textColor);
        this.tutorial.left.text.x = window.innerWidth/2 - this.tutorial.left.text.displayWidth-30;

        this.tutorial.right.text.setAlign('center');
        this.tutorial.right.text.setFontSize(18);
        this.tutorial.right.text.setColor(window.Data.textColor);
        this.tutorial.right.text.x = window.innerWidth/2 + 30;
    }
})