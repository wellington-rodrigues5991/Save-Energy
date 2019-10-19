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
        let style = {textAlign:'center', position: 'absolute', width:'100%', height: '0px', height: '72px'};

        if(this.count == 0) style.bottom = '30px';
        else style.top = '0px';
        
        return <div style={{width:'100%', height:'100%', display: 'flex', justifyContent: 'center', flexDirection: 'column', textAlign: 'center'}}>
            <img className='logo' src={Koji.config.images.logo} />
            <div style={style}>
                <span onClick={this.go} className='btn'>{Koji.config.settings.play}</span>
            </div>
        </div>;
    }
}
