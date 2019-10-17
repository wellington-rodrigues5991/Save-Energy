import React,{Component} from 'react';
import Koji from '@withkoji/vcc';

import Score from './miniscore';

export default class Item extends Component{
    constructor(props){
        super(props);

        this.selector = React.createRef();
        this.animate = this.animate.bind(this);
        this.die = this.die.bind(this);
        this.draw = this.draw.bind(this);

        this.active = true;
        this.move = 300;
        this.direction = .1;

        this.random = Math.random();
        this.state = {image: null, point: false};
        this.score = {point: false, score: {score: 0, life: 0}};

        this.outScreen = {state: false, count: 0};
        this.actual = {content: window.images[0][0], i : 0};

        this.multiplicador = 1;
    }

    componentDidMount(){   
        this.multiplicador = parseFloat(this.selector.current.parentNode.parentNode.style.transform.split('translateZ(')[1]) * -1;
        this.multiplicador = (this.multiplicador == 0 ? 1 : (this.multiplicador < 300 ? 2 : 8));

        this.selector.current.children[0].style.position = 'absolute';
        this.selector.current.children[0].style.bottom = '0px';
        
        this.selector.current.children[0].width = this.selector.current.getBoundingClientRect().width;
        this.selector.current.children[0].height = this.selector.current.getBoundingClientRect().height;

        this.draw();
    }
    
    componentDidUpdate(){
        this.animate();

        let body = document.body.getBoundingClientRect();
        let target = this.selector.current.getBoundingClientRect();

        if(this.selector.current.children[0].style.transition != ''){
            if(target.right < body.left || target.left > body.right){
                this.selector.current.children[0].style.removeProperty('transition')
                this.selector.current.children[0].style.removeProperty('transform');
                this.active = true;
            }
        }
    }

    animate(){
        this.move += this.direction;
        if(this.move <= 1) this.direction = parseFloat(Koji.config.general.speed)*2;
        if(this.move >= (document.body.getBoundingClientRect().height * .25)) this.direction = (parseFloat(Koji.config.general.speed)*2)*-1;

        let bound = this.selector.current.getBoundingClientRect();
        if(this.outScreen.state && this.outScreen.count == 1){
            this.draw();
            this.score = {point: false, score: {score: 0, life: 0}};
        }
        if(bound.left+bound.width < 0 || bound.left > document.body.getBoundingClientRect().width){
            this.outScreen.state = false;
            this.outScreen.count = 0;
        }
        if(bound.left+bound.width > 0 || bound.left < document.body.getBoundingClientRect().width){
            this.outScreen.state = true;
            this.outScreen.count = this.outScreen.count + 1;
        }
        
        this.props.check(this.selector.current.children[0].getBoundingClientRect(), this.selector.current.parentNode.parentNode.getBoundingClientRect(), this.die);
    }

    die(pos, game, audio){
        if(!this.active) return;

        this.active = false;
        let check = this.check(pos);
        if(check.result){          
            let point = {};
            if(this.actual.content == window.images[0][this.actual.i]) { 
                game.score = parseInt(game.score) + parseInt(check.score); 
                point.score = parseInt(check.score);
            }
            else if(this.actual.content == window.images[1][this.actual.i]) {
                game.score = parseInt(game.score) - parseInt(check.score);
                game.life--;
                
                point.life = -1;
                point.score = parseInt(check.score)*-1;
            }
            else if(this.actual.content == window.images[2][this.actual.i]) {
                game.life--; 
                
                point.life = -1;
            }

            //audio.play();

            this.score = {point: true, score: point};

            this.selector.current.children[0].style.transition = 'all 1s';
            this.selector.current.children[0].style.transform = 'rotateX(70deg)';
        }else{
            this.active = true;
        }
    }

    check(shoot){
        let block = this.selector.current.parentNode.parentNode.getBoundingClientRect();      
        let pos = this.selector.current.children[0].getBoundingClientRect();

        let x = (shoot.x + 20) - this.selector.current.children[0].getBoundingClientRect().x;
        let y = (shoot.y + 20) - this.selector.current.children[0].getBoundingClientRect().y;

        let ctx = this.selector.current.children[0].getContext("2d");

        let alpha = ctx.getImageData(x, y, 10, 10);
        let retorno = false;

        let shootCtx = window.sprites.shoot.getContext("2d");
        
        let tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.selector.current.children[0].width;
        tempCanvas.height = this.selector.current.children[0].height;

        let imageData = ctx.getImageData((x-5), (y-5), 20, 20);
        let shootData = shootCtx.getImageData(0, 0, 20, 20);

        let data = ctx.createImageData(1,1);
        
        for(let i = 0; i < alpha.data.length; i = i+4){
          if(alpha.data[i] > 0){
            retorno = true;
            i = alpha.data.length;

            let size = {x:0, y:0}
            
            for(let e = 0; e < 20*20; e++){ 
              let tempX = parseFloat((e/20).toString().split('.', 1)[0]);
              if(size.x != tempX){
                size.x = tempX;
                size.y = 0;
              }
              if(imageData.data[(e*4)+3] == 255 && shootData.data[(e*4)+3] == 255){
                data.data[0] = shootData.data[e*4];
                data.data[1] = shootData.data[(e*4)+1];
                data.data[2] = shootData.data[(e*4)+2];
                data.data[3] = shootData.data[(e*4)+3];
                
                ctx.putImageData(data, (x-5)+size.x, (y-5)+size.y);
              }
              size.y = size.y + 1;
            }            
          }
        }

        return {result: retorno, score: (((pos.y+pos.height)-block.y) * this.multiplicador).toFixed(0)};
    }

    draw(){
        let canvas = this.selector.current.children[0];
        this.random = Math.random();


        if((this.random > .7 && this.multiplicador == 1) || (this.random > .6 && this.multiplicador == 2) || (this.random > .5 && this.multiplicador == 8)){
            this.actual.i = Math.floor(Math.random()*window.images[0].length);
            this.actual.content = window.images[0][this.actual.i];
        }
        if((this.random < .3 && this.multiplicador == 1) || (this.random < .2 && this.multiplicador == 2) || (this.random < .1 && this.multiplicador == 8)){
            this.actual.i = Math.floor(Math.random()*window.images[1].length);
            this.actual.content = window.images[1][this.actual.i];
        }        
        if((this.random < .7 && this.random > .3 && this.multiplicador == 1) || (this.random < .6 && this.random > .2 && this.multiplicador == 2) || (this.random < .5 && this.random > .1 && this.multiplicador == 8)){
            this.actual.i = Math.floor(Math.random()*window.images[2].length);
            this.actual.content = window.images[2][this.actual.i];
        }
        
        let image = this.actual.content;

        let size = {
            width: 0,
            height: 0,
            x: 0,
            y:0,
            ratio: {h: image.naturalWidth/image.naturalHeight, v:image.naturalHeight/image.naturalWidth},
            calculate(){
                let width = canvas.width;
                let height = canvas.height;
                
                if(image.naturalWidth <= image.naturalHeight){
                    if(width < height){
                        this.height = width * this.ratio.v;
                        this.width = width; 

                        this.y =(height-this.height);
                    }
                    else{
                        this.height = height;
                        this.width = height * this.ratio.h; 

                        this.x = (width-this.width)/2;
                    }
                }else{
                    this.height = width * this.ratio.v;
                    this.width = width; 

                    this.y = (height-this.height)
                }
            }
        }

        size.calculate();
        
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height)
        canvas.getContext("2d").drawImage(image, size.x, size.y, size.width, size.height)
    }

    render(){
        const style = this.props.style;
        
        style.transform = 'translateY('+this.move+'px) rotateX(0deg)';
        style.transformOrigin = 'bottom center';
        
        
        return(
            <div style={style} ref={this.selector} className='content'>
                <canvas className='sprites'/>
                {this.score.point && <Score point={this.score.score} />}
            </div>
        );
    }
}