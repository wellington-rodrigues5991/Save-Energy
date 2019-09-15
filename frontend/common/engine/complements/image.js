export default class ImageManager{
    constructor(arg){
        this.indice = [];
        this.files = [];
        this.createCollisions = true;
    }
    add(file, name){
        let obj = {file: null, state: false};
        
        this.indice.push(name);
        this.files[this.indice.indexOf(name)] = obj;
        
        obj.file = new Image();
        obj.file.crossOrigin = 'anonymous';
        obj.file.src = file;
        //obj.file.setAttribute('crossOrigin', '');
        obj.file.onload  = function(){
            this[1].files[this[0]].state = true;
        }.bind([this.indice.indexOf(name), this, obj])
    }
    
    load(name, width, height, make){
        let target = this.files[this.indice.indexOf(name)],
            temp,
            file;
        
        if(make == undefined){
            this.mapPixels(width, height, 5, target);
            for(let i = 0; i < target.pixelMap.length; i++){
                if(target.pixelMap[i].size === width+'x'+height){
                    temp = target.pixelMap[i].data;
                    break;
                }
            }
        }
        
        file = target.file;
        file.width = width;
        file.height = height;
        
        return {file: file, collider: temp};
    }
    
    mapPixels(width, height, resolution, target){
        let feito = false;
        if(!target.state){
            setTimeout(function(){
                this[0].mapPixels(this[1], this[2], this[3], this[4])
            }.bind([this, width, height, resolution, target]), 100)
        }
        if(target.pixelMap === undefined) target.pixelMap = [];
        else{
            let exist = false;
            let e = 0;
            let indice = 0;
            
            for(let i = 0; i < target.pixelMap.length; i++){
                if(target.pixelMap[i].size === width+'x'+height){
                    feito = true;
                    e = i
                    if(target.pixelMap[i].data.length > 0){
                        exist = true;
                        indice = i;
                        break;
                    }
                }
            }
            
            if(exist) return;
        }
        
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        let ctx = canvas.getContext("2d");
        ctx.drawImage(target.file, 0, 0, width, height);
        
        if(!feito){
            target.pixelMap.push({data: [], size:width+'x'+height});
            target = target.pixelMap[target.pixelMap.length-1].data;
        }
        else{
            let t;
            
            for(let i = 0; i < target.pixelMap.length; i++){
                if(target.pixelMap[i].size === width+'x'+height){t = target.pixelMap[i]}
            }
            target = t.data;
        }
        
        for(let y = 0; y < height; y=y+resolution){
            for(let x = 0; x < width; x=x+resolution){
                let pixel = ctx.getImageData(x, y, resolution, resolution);
                
                if(pixel.data[3] !== 0){
                    target.push({x: x, y: y})
                }
            }
        }
    }
}