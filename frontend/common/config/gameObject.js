
export default class GameObject{
    constructor(props){
        const keys = Object.keys(props);
        
        for(let i = 0; i < keys.length; i++){
            this[keys[i]] = props[keys[i]];
        }
    }
}