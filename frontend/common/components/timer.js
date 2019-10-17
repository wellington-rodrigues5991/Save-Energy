import React,{Component} from 'react';
import Koji from '@withkoji/vcc';

export default class Timer extends Component{
    constructor(props){
        super(props);

        this.state = {opacity: 0} 
    }

    componentDidMount(){
        this.setState({opacity: 1})
    }

    render(){
        let base = (this.props.base == undefined ? 1 : this.props.base);
        let time = (this.props.time == undefined ? 0 : this.props.time);
        let step = ((parseFloat(base) - parseFloat(time))/parseFloat(base)) * 126;
        if(step/125 > 1 && this.state.opacity > 0) this.setState({opacity: 0})
        
        return(
            <div id='timer' style={{opacity: this.state.opacity, transform:'scale(2)'}}>
                <svg viewBox="25 25 50 50" >
                    <circle 
                        cx="50" 
                        cy="50" 
                        r="20" 
                        fill="none" 
                        stroke={Koji.config.settings.primary} 
                        strokeWidth="3"
                        style={{
                            strokeDasharray: step+',125',
                            strokeDashoffset: '0',
                            strokeLinecap: 'round',
                            transition: 'all 0.3s'
                        }}
                    />
                </svg>
            </div>
        );
    }
}