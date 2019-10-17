import React,{Component} from 'react';
import Item from './item';

export default class ItemGroup extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const amount = this.props.amount;
        const items = [];
        
        let width = (document.body.getBoundingClientRect().width * .8) / amount;
        let height = (document.body.getBoundingClientRect().height * .27);
        let space = (document.body.getBoundingClientRect().width * .2) / amount;
        let left = 0;

        for (let i = 0; i < amount; i++) {
            items.push(<Item 
                key={i} 
                check={this.props.check}
                style={{
                    width: width+'px',
                    position: 'absolute',
                    left:left+'px',
                    height: height+'px',
                    top: height*-1+'px'
                }}/>
            )
            left += width + space;
        }

        return(
            <div>
                {items}
            </div>
        );
    }
}