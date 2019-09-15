import React,{Component} from 'react';

export default class HowToPlay extends Component{
    constructor(arg){
        super(arg);

        this.x = 0;
    }

    render(){
        return(
            <div id="how" style={{opacity: (this.props.score < 0.08 ? '1' : '0')}}>
                <div className='how' style={{width:this.props.size.width+'px', height:this.props.size.height+'px', position:'absolute', top: this.props.y+'px', left: this.props.x+'px'}}>
                    <div style={{position:'absolute', bottom:'100%', width:'100%'}}>
                        <div style={{position:'absolute', left:'-30px', width:'calc(100% + 60px)', top:'-150px', opacity:'0.7'}}>Click/Tap above the {this.props.player} to go down.</div>
                        <div className='bol' style={{position:'absolute', left:'calc(50% - 20px)', top:'-60px'}}>
                            <div className='bol' style={{width: '35px', height: '35px', animation: 'bol .95s infinite'}}>
                                <div className='bol' style={{width: '30px', height: '30px', animation: 'bol 1s infinite'}}></div>
                            </div>
                        </div>
                    </div>
                    <div style={{position:'absolute', top:'100%', width:'100%'}}>
                        <div style={{position:'absolute', left:'-30px', width:'calc(100% + 60px)', bottom:'-150px', opacity:'0.7'}}>Click/Tap below the {this.props.player} to go up.</div>
                        <div className='bol' style={{position:'absolute', left:'calc(50% - 20px)', bottom:'-60px'}}>
                            <div className='bol' style={{width: '35px', height: '35px', animation: 'bol .95s infinite'}}>
                                <div className='bol' style={{width: '30px', height: '30px', animation: 'bol 1s infinite'}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

//<HowToPlay time={window.game.score} y={fish.position.y} x={fish.position.x} size={fish.size} />