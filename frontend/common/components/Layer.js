import React,{Component} from 'react';
import ItemGroup from './itemGroup';

import Koji from '@withkoji/vcc';

export default class Layer extends Component{
    constructor(props){
        super(props);

        this.selector = React.createRef();
        this.paint = this.paint.bind(this);
        this.left = 0;
        this.left2 = 0;
        this.state = {
            scale: 1,
            translateY : 0
        }
    }

    componentDidMount(){
        let content = this.selector.current;
        let dim = document.body.getBoundingClientRect().width/content.getBoundingClientRect().width;

        content.style.transform = content.style.transform.split(' ')[0]+' scale('+dim+')';
        this.setState({
            scale: dim
        });

        this.left2 = (content.getBoundingClientRect().width * -1) + 1 + this.left;
    }

    componentDidUpdate(){
        this.paint();
    }

    paint(){
        let i = this.props.state.direction * this.props.direction,
        left = this.left + i,
        left2 = this.left2 + i,
        bound = document.body.getBoundingClientRect().width;

        if(i > 0){
            left = (left > bound ? left - (bound * 2) : left)
            left2 = (left2 > bound ? (left2) - (bound * 2) : left2)
        }
        if(i < 0){
            left = (left < bound*-1 ? left + (bound * 2) : left)
            left2 = (left2 < bound*-1 ? (left2) + (bound * 2) : left2)
        }

        this.left = left;
        this.left2 = left2;
    }

    render(){
        const {height, distance, amount} = this.props;
        const {scale} = this.state;
        const background = (distance == 0 ? Koji.config.images.layer1 : (distance > -250 ? Koji.config.images.layer2 : Koji.config.images.layer3))
        return(
            <div style={{position:'absolute', top:'0px', left:'0px', width:'100%', zIndex:'0', height:'100%'}}>
                <li 
                    ref={this.selector} 
                    style={{
                        left: (this.left * scale)+'px',
                        height: (height + 35)+'%', 
                        width: 'calc(100% + 2px)', 
                        transform: 'translateZ('+distance+'px) scale('+scale+') ', 
                        bottom: '0px'}
                    }>
                    <ItemGroup amount = {amount} check={this.props.check}/>
                    <div className='block'><div style={{background:'url('+background+')'}}></div></div>
                </li>
                <li  
                    style={{
                        left: (this.left2 * scale)+'px', 
                        height: (height + 35)+'%', 
                        width: 'calc(100% + 2px)', 
                        transform: 'translateZ('+distance+'px) scale('+scale+') ',
                        bottom: '0px'}
                    }>
                    <ItemGroup amount = {amount} check={this.props.check}/>
                    <div className='block'><div style={{background:'url('+background+')'}}></div></div>
                </li>
            </div>
        );
    }
}

//style={{background:'url('+background+')'}}