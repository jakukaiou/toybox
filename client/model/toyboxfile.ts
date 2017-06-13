import ToyBoxItem from './toyboxitem';
import ToyBoxFolder from './toyboxfolder';

export default class ToyBoxFile extends ToyBoxItem {

    constructor(name:string,parent:ToyBoxFolder,ID:number){
        super(name,parent,ID);
    }
}