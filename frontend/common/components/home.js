import React,{Component} from 'react';

import Koji from '@withkoji/vcc';

export default class Home extends Component{
    constructor(props){
        super(props);

        this.go = this.go.bind(this)
        this.count = 0;
    }

    go(){
        this.props.start()
        this.count++;
        document.getElementById('audioambient').play()
    }

    render(){
        let style = {textAlign:'center', position: 'absolute', width:'100%', height: '0px', background:'blue'};

        if(this.count == 0) style.bottom = '110px';
        else style.top = '0px';
        
        return <div style={style}>
            <span onClick={this.go} className='btn'>{Koji.config.settings.play}</span>
        </div>;
    }
}
