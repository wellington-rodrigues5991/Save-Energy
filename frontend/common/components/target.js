import React,{Component} from 'react';
import Koji from '@withkoji/vcc';
import Timer from './timer';

export default class Target extends Component{
    constructor(props){
        super(props);

        let step = document.body.getBoundingClientRect().height/10;
        step = step * 7;

        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.oldTop = (document.body.getBoundingClientRect().height/10) * 3;
        this.top = (document.body.getBoundingClientRect().height/10) * 3;
        this.active = false;

        this.select = React.createRef();
        this.start = this.start.bind(this);
        this.move = this.move.bind(this);
        this.end = this.end.bind(this);
        this.tempo = this.tempo.bind(this);

        this.timer = {left: Koji.config.general.timer*1000, step:(Koji.config.general.timer * 1000)/100}

        this.state = {angle: 0, top: step, x: {top: step, left: (document.body.getBoundingClientRect().width/2) - 25}}
    }

    reset(){
        let step = document.body.getBoundingClientRect().height/10;
        step = step * 7;

        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.top = parseFloat(document.getElementById('target').style.top);
        this.active = false;
        this.setState({angle: 0, top: step, x: {top: step, left: (document.body.getBoundingClientRect().width/2) - 25}})
        this.timer = {left: Koji.config.general.timer*1000, step:(Koji.config.general.timer * 1000)/100}
    }

    start(e){
        if(e.changedTouches != undefined) e = {clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY}
        this.x = e.clientX;
        this.y = e.clientY;
        this.angle = this.state.angle;
        this.top = parseFloat(document.getElementById('target').style.top);

        this.active = true;
        this.time = Date.now();

        this.timer = {left: Koji.config.general.timer*1000, step:(Koji.config.general.timer * 1000)/100}
        this.tempo();

        console.log(e.clientY)
        
    }

    tempo(){
        if (this.timer.left <= 0 && this.active) {
            this.timer = {left: Koji.config.general.timer*1000, step:(Koji.config.general.timer * 1000)/100}
            this.end();
        } else if(this.active) {
            this.timer.left-= this.timer.step;
            setTimeout(this.tempo, this.timer.step);
        }
    }

    move(e){
        if(!this.active) return;
        if(e.changedTouches != undefined) e = {clientX: e.changedTouches[0].clientX, clientY: e.changedTouches[0].clientY};

        let delta = {};
        delta.clientX = e.clientX - this.x;
        delta.clientY = e.clientY - this.y;

        let wstep = (document.body.getBoundingClientRect().width/2)/60;
        let angle = (delta.clientX + (this.angle));

        angle = Math.min(Math.max(angle, -(document.body.getBoundingClientRect().width/2)), (document.body.getBoundingClientRect().width/2));
        delta.clientX = delta.clientX;

        delta.clientY = this.top + delta.clientY;

        this.setState({angle: angle, top: delta.clientY});
    }

    end(){
        if(this.active){
            this.active = false;
            this.props.shoot(this.select.current.children[0].getBoundingClientRect(), document.getElementById('audio'));

            let step = document.body.getBoundingClientRect().height/10;
            step = step * 7;

            this.select.current.className = 'mira back';
            this.reset();

            let sprites = document.getElementsByClassName('sprites');

            for(let i = 0; i < sprites.length; i++){
                let pos = sprites[i].getBoundingClientRect();
                let limit = sprites[i].parentNode.parentNode.parentNode.getBoundingClientRect();
                let shoot = this.select.current.children[0].getBoundingClientRect();
                
                if(shoot.x > pos.x && shoot.x < pos.left+pos.width){
                    if(shoot.y > pos.y && shoot.y < pos.y+pos.height){
                        if(limit.top > pos.y + ((pos.width+10)/2)) {
                            let x = (shoot.x + 20) - sprites[i].getBoundingClientRect().x;
                            let y = (shoot.y + 20) - sprites[i].getBoundingClientRect().y;
                            let ctx = sprites[i].getContext("2d");
                            let alpha = ctx.getImageData(x, y, 10, 10);

                            for(let e = 0; e < alpha.data.length; e = e+4){
                                if(alpha.data[e] > 0){
                                    e = alpha.data.length; 
                                    document.getElementById('audioimpact').play();
                                }           
                            }
                        }               
                    }
                }
            }
            
            
            setTimeout(function(){
                if(this.select.current == undefined) return;
                this.select.current.className = 'mira';
                this.reset();                
                window.hit = false;
            }.bind(this), 200)
        }
    }

    render(){
        return(
            <div
            onTouchMove={this.move} onMouseMove={this.move} 
            onTouchEnd={this.end} onMouseUp={this.end} onMouseOut={this.end}
            id='mira'>
                <div onTouchStart={this.start} onMouseDown={this.start} ref={this.select} className='mira' style={{transform: 'translateX('+this.state.angle+'px)'}}>
                    <div id='target' style={{top:this.state.top+'px', background:'url('+Koji.config.images.target+')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
                        {this.active && <Timer time={this.timer.left/1000}  base={Koji.config.general.timer} />}
                    </div>
                </div>                             
            </div>
        );
    }
}