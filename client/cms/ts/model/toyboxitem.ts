import ToyBoxFolder from './toyboxfolder';

export default class ToyBoxItem {
    public name:string;

    public parent:ToyBoxFolder;

    constructor(name:string,parent:ToyBoxFolder){
        this.name = name;
        this.parent = parent;
    }
}