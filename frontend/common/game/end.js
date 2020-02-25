import GameObject from '../config/gameObject';

export const End = new GameObject({
	create(){
        this.end = this.add.text(0, 0, 'Play Again', {fontFamily: window.Config.font.family, color: window.Config.color.text, backgroundColor: window.Config.color.secundary});
        this.end.setFontSize(36);
        this.end.setPadding(15, 10, 15, 10);
        this.end.y = window.innerHeight * 1.5;
        this.end.setInteractive();
        this.end.on('pointerup', () => {
            if(!window.Config.go){
                window.Config.state = 'game';

                console.log(this.startPlugs())
                this.startPlugs();
            }
        });
    },  
    update(){
        if(window.Config.state == 'die'){
            if(this.music.on && this.music.die != undefined && this.music.die.isPlaying == false) this.music.die.play();
            if(this.end.y > window.innerHeight - this.end.displayHeight - 40) this.end.y -= 20;
            else this.end.y = window.innerHeight - this.end.displayHeight - 40;
        }
        if(window.Config.state != 'die'){
            if(this.music.die != undefined) this.music.die.stop();
            if(this.end.y < window.innerHeight * 1.5) this.end.y += 30;
            else this.end.y = window.innerHeight * 1.5;
        }

        this.end.x = (window.innerWidth - this.end.displayWidth) / 2;
    }
})