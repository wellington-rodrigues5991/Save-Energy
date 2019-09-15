import React,{Component} from 'react';

export default class HowToPlay extends Component{
    constructor(arg){
        super(arg);

        this.x = 0;
    }

    render(){
        return(
            <div id="how" style={{opacity: (this.props.score < 0.08 ? '1' : '0')}}>
                <ul>
                    <li>Click/Tap above the {this.props.player} to go down.</li>
                    <li>Click/Tap below the {this.props.player} to go up.</li>
                </ul>
                
            </div>
        )
    }
}

//<HowToPlay time={window.game.score} y={fish.position.y} x={fish.position.x} size={fish.size} />