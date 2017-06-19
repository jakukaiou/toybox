export default class TagConfig {
    private tags:Array<string>;

    constructor(){
        this.tags = [];
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