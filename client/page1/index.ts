import '../common/common';

//利用するリソースを全てインポート
import './index.scss';
import './index.html';

console.log("client/page1/index.js");

window.onload = ()=>{
    var drawEl = document.getElementById("draw");
    drawEl.innerHTML = "peko";
}

// Uncomment these to enable hot module reload for this entry.
// if (module.hot) {
//   module.hot.accept();
// }
