import React,{Component} from 'react';
import Layer from './Layer';
import Target from './target';
import Score from './score';
import Life from './life';

import Koji from '@withkoji/vcc';

export default class Game extends Component{
    constructor(props){
        super(props);

        this.state = {
            left: 0, 
            direction : parseFloat(Koji.config.general.speed),
            x: 0,
            y: 0
        }

        this.score = 0;
        this.life = parseFloat(Koji.config.general.lifes);
        this.play = false;

        this.shootPosition = {};
        this.audio = null;
        this.loop = this.loop.bind(this);
        this.shoot = this.shoot.bind(this);
        this.changeDirection = this.changeDirection.bind(this);
        this.checkPosition = this.checkPosition.bind(this);
    }

    loop(){
        if(this.play){
            this.setState({
                left: (this.state.left + 1),
                direction: this.state.direction + (Koji.config.general.multiplier/10000)
            });
            requestAnimationFrame(this.loop);
        }
    }
    
    shoot(pos, test){
        let sprites = document.getElementsByClassName('sprites');
        this.shootPosition = pos;
        this.audio = test;
    }

    checkPosition(pos, limit, callback){
        let shoot = this.shootPosition;
        if(shoot.x > pos.x && shoot.x < pos.left+pos.width){
            if(shoot.y > pos.y && shoot.y < pos.y+pos.height){
                if(limit.top > this.shootPosition.y + ((this.shootPosition.width+10)/2)) {
                    callback(this.shootPosition, this, this.audio);
                    this.shootPosition = {}
                }               
            }
        }
    }

    lose(){
        window.score = this.score;
        this.play = false;
        this.props.die();
    }

    componentDidMount(){
        setTimeout(() => {
            this.play = true;
            requestAnimationFrame(this.loop)
        }, 1200);
    }

    changeDirection(){
        this.setState({direction: (this.state.direction > 0 ? parseFloat(Koji.config.general.speed)*-1 : parseFloat(Koji.config.general.speed))});
    }
    render(){
        let life = parseFloat(this.life);
        let amount = (this.props.amount / 2).toFixed(0);

        if(document.body.getBoundingClientRect().width > 375) amount = amount * ((document.body.getBoundingClientRect().width / 375).toFixed(0))

        if(life < 0) life = 0;
        if(this.life == 0 && this.play) this.lose();
        
        return(
            <ul ref={this.select} className="container" onClick={this.changeDirection}>
                <Layer 
                    key={0} 
                    state={this.state} 
                    height={2 * this.props.position} 
                    distance={2 * this.props.distance}
                    direction = {0 % 2 > 0 ? 1 : -1}
                    check={this.checkPosition}
                    amount={amount}
                />
                <Layer 
                    key={1} 
                    state={this.state} 
                    height={1 * this.props.position} 
                    distance={1 * this.props.distance}
                    direction = {1 % 2 > 0 ? 1 : -1}
                    check={this.checkPosition}
                    amount={amount}
                />
                <Layer 
                    key={2} 
                    state={this.state} 
                    height={0 * this.props.position} 
                    distance={0 * this.props.distance}
                    direction = {2 % 2 > 0 ? 1 : -1}
                    check={this.checkPosition}
                    amount={amount}
                />
                <Target shoot={this.shoot}/>
                <Score points={this.score}/>
                <Life points={life}/>
            </ul>
        );
    }
}