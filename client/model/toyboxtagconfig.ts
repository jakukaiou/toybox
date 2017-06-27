import ToyBoxProp from './toyboxprop';

export default class ToyBoxTagConfig extends ToyBoxProp {
    public name:string;
    public tags:Array<string>;

    constructor(){
        super();
        this.name = '新規タグ';

        this.tags = [];
        this.tags.push('テストタグ');
    }

    //タグを追加
    public addTag = (tagname:string)=>{
        this.tags.push(tagname);
    }

    //タグをひとつ削除
    public removeTag = (tagnumber:number)=>{
        this.tags.splice(tagnumber,1);
    }
}