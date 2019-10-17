import React,{Component} from 'react';
import Koji from '@withkoji/vcc';

export default class Life extends Component{
    constructor(props){
        super(props);

        this.bottom = 70;
        this.opacity = 1;
    }

    componentDidMount(){
        this.bottom = 50;
        setTimeout(function(){
            this.bottom = 120;
            this.opacity = 0;
        }.bind(this), 1);
    }

    render(){
        let score = this.props.point.score;

        if(score > 0) score = '+'+score;

        return(
            <div style={{position:'absolute', width:'100%', bottom: this.bottom+'%', opacity:this.opacity, transition:'all 2s'}}>
                {this.props.point.score != undefined && <div style={{width: '60px', margin: '0 auto', marginBottom:'20px'}}>
                    <div style={{lineHeihgt:'30px', height:'30px', textAlign:'left !important'}}>{score}</div>
                </div>}
                {this.props.point.life != undefined && <div style={{width: '60px', margin: '0 auto'}}>
                    <div style={{width: '30px', height:'30px', background:'url('+Koji.config.images.life+')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}></div>
                    <div style={{marginLeft:'40px', lineHeihgt:'30px', marginTop:'-30px', height:'30px', textAlign:'left !important'}}>{this.props.point.life}</div>
                </div>}
            </div>
        );
    }
}