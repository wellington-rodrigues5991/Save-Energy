import React,{Component} from 'react';

import Koji from '@withkoji/vcc';

export default class Tutorial extends Component{
    constructor(props){
        super(props);
        this.selector = React.createRef();

        this.state = {opacity: 0};
        this.start = this.start.bind(this);
    }

    start(){
      this.selector.current.style.opacity = '0'
      this.selector.current.style.transform = 'scale(1.2)';
      setTimeout(() => this.selector.current.style.display = 'none', 500)
    }
    
    render(){
        return(
            <div ref={this.selector} style={{ transition: 'all 0.5s', width:'100%', height:'100%', position:'absolute', top: '0px', left:'0px', background:'rgba(0,0,0,0.7)'}}>
                <div style={{padding:'40px', paddingBottom: '0px'}}>{Koji.config.settings.tutorial}</div>
                <div style={{marginTop:'20px', marginLeft:'40px', background:'var(--main-primary)', padding: '10px 20px', float: 'left', borderRadius: '12px'}} onClick={this.start}>OK, start playing</div>
                <div style={{transform: 'scale(1)', zIndex: '100000000000000000000', position:'absolute', bottom:'20px', left:'20px', background: 'rgba(255,255,255,0.7)', borderRadius:'16px', height:'calc(35% - 40px)', width:'calc(100% - 40px)'}}>
                    <div style={{width: 'calc(100% - 40px)', position:'absolute', left:'20px', top: '35px', height: '10px', background:'white', borderRadius:'5px'}}>
                        <div className='seta'/>
                        <div className='seta seta-right'/>
                    </div>
                    <div style={{height: 'calc(100% - 55px)', position:'absolute', left:'calc(50% - 5px)', top: '35px', width: '10px', background:'white', borderRadius:'5px'}}>
                        <div className='seta seta-bottom'/>
                    </div>
                </div>
            </div>
        );
    }
}