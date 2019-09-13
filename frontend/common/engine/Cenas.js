export default class Cena{
    constructor(arg){
        this.gameObjects = [];
        this.main = false;
        arg.cenas.push(this);
    }
    load(obj){
        this.gameObjects.push(obj);
    }
    destroy(obj){
        this.gameObjects = this.gameObjects.filter(function(t){
           return t !== obj;
       });
    }
}