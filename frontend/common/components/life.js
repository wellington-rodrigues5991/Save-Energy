import React,{Component} from 'react';
import Koji from '@withkoji/vcc';

export default class Life extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let image = [];
        for(let i = 0; i < parseFloat(Koji.config.general.lifes); i++){
            let style = {width: '20px', height:'20px', background:'url('+Koji.config.images.life+')', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', marginLeft:'10px', float:'left'};
            
            if(i >= this.props.points) style.opacity = '0.3';
            image.push(<div key={i} style={style}></div>)
        }
        return(
            <div id='life'>
            {image.map(function(){return arguments[0]})}
            </div>
        );
    }
}