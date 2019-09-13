export default class EngineComponent{
    constructor(arg){
        this.engine = arg;
        this.gameObjects = [];
    }
    
    _register(gameObject){
         this.gameObjects.push(gameObject);
    }
}