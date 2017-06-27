//定数の定義スペース

//EDITMODEの種別
export namespace EDITMODE {
    export const NONE = 1;
    export const FILECONFIGEDIT = 2;
    export const FOLDERCONFIGEDIT = 3;
    export const FILEEDIT = 4;
    export const CONFIGSET = 5;
}

//CONFIGのプロパティの種類
export namespace CONFIG {
    export const TAG = 1;
    export const LINK = 2;
    export const FORM = 3;
}

//CONFIGTYPEの種別
export namespace CONFIGTYPE {
    export const FILE = 1;
    export const FOLDER = 2;
}

//LINKプロパティのリンク種別
export namespace LINK {
    export const NONE = 1;
    export const FILE = 2;
    export const FOLDER = 3;
    export const BOTH = 4;
}