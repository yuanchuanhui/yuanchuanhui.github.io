window.onload = function () {
    //游戏规则提示
    alert('游戏规则：屏幕右侧每秒会出现一个字母，在键盘上找到并按下（PS：大小写敏感，下划线由空格替换），会发生一些...可能有意思的事。');

    //变量设置
    let h = document.documentElement.clientHeight;
    let w = document.documentElement.clientWidth;
    let mc = document.getElementById("mc");
    mc.setAttribute('width', w);
    mc.setAttribute('height', h);
    //用于画坐标轴
    let baseLenght = 50;
    //决定心形的大小
    let a = 17;
    //坐标轴原点
    let coorCenterPoint = new Point(w / 3, h / 2);
    //和step变量共同决定每一边照片的数量，设置为13时总的照片数为27
    let numPoint = 13;
    let step = Math.PI / numPoint;
    //输入间隔
    let timeInterval = 2000;
    //开发者模式，可以决定是否绘制坐标轴等行为
    let dev = false;
    //祝福语句
    let blessing = "Happy_Lover's_Day,_My_Girl";
    window.theta = 0;
    window.curIndex = 0;
    let new_ = document.getElementById('new');
    let old = document.getElementById('old');
    let cxt = mc.getContext("2d");

    //绘制背景和坐标轴
    drawBackground(cxt, mc, coorCenterPoint, baseLenght, dev);
    //设置文字标签位置
    init(new_, old, w, h);
    //主循环
    mainLoop(cxt, coorCenterPoint, a, coorCenterPoint, step, timeInterval, new_, blessing);

    document.documentElement.onkeydown = function (event) {
        if(event.keyCode !== 16){
            if(dev){
                console.log(event.keyCode);
                console.log(new_.innerHTML);
                console.log(test(event, new_.innerHTML));
            }
            //测试按下的键是否正确
            if(test(event, new_.innerHTML)){
                //绘制图片
                drawImage(a, theta, coorCenterPoint, cxt, old, new_);
            }
        }
    }

};

function init(new_, old, w, h) {
    old.innerHTML = '';
    new_.innerHTML = "";
    old.style.left = "" + w / 5 * 3 + "px";
    old.style.top = "" + h / 5 + "px";
    new_.style.left = "" + w / 3 * 2 + "px";
    new_.style.top = "" + h / 3 + "px";
}

/**
 * @param event 键盘事件
 * @param target 祝福字符串中的单个字符
 * Happy Lover's Day, My Girl 要检查的字符串
 * */
function test(event, target){
    //小写字母及标点
    if(event.keyCode === target.toUpperCase().charCodeAt()){
        return true;
    //大写字母
    }else if(event.keyCode === target.charCodeAt() && event.shiftKey === true){
        return true;
    }else if(event.keyCode === 222 && target === "'"){
        return true;
    }else if(event.keyCode === 188 && target === ","){
        return true
    }else if(event.keyCode === 32 && target === "_"){
        return true
    }else{
        return false;
    }
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function getRealPoint(coordCenterPoint, coordPoint){
    return new Point(coordPoint.x + coordCenterPoint.x, coordPoint.y + coordCenterPoint.y);
}

//心形线公式的实现
function nextPoint(a, theta){
    let x = 16 * Math.pow(Math.sin(theta), 3);
    let y = 13 * Math.cos(theta) - 5 * Math.cos(2 * theta) - 2 * Math.cos(3 * theta) - Math.cos(4 * theta);
    return new Point(- a * x, - a * y);
}

function drawBackground(cxt, c, coordCenterPoint, baseLenght, dev) {
    //设置绿色背景
    cxt.fillStyle = "green";
    cxt.fillRect(0, 0, coordCenterPoint.x, coordCenterPoint.y);

    if(dev){
        //画坐标轴
        cxt.moveTo(coordCenterPoint.x, coordCenterPoint.y);
        cxt.lineTo(coordCenterPoint.x, coordCenterPoint.y + 5 * baseLenght);
        cxt.moveTo(coordCenterPoint.x, coordCenterPoint.y);
        cxt.lineTo(coordCenterPoint.x, coordCenterPoint.y - 5 * baseLenght);
        cxt.moveTo(coordCenterPoint.x, coordCenterPoint.y);
        cxt.lineTo(coordCenterPoint.x + 5 * baseLenght, coordCenterPoint.y);
        cxt.moveTo(coordCenterPoint.x, coordCenterPoint.y);
        cxt.lineTo(coordCenterPoint.x - 5 * baseLenght, coordCenterPoint.y);
        cxt.strokeStyle = 'black';
        cxt.stroke();
    }
}

//按键后绘制图片
function drawImage(a, theta, coorCenterPoint, cxt, old, new_) {
    let coordPoint = nextPoint(a, theta);
    let realPoint = getRealPoint(coorCenterPoint, coordPoint);
    old.innerHTML += new_.innerHTML;
    cxt.lineTo(realPoint.x, realPoint.y);
    cxt.stroke();
    let img = new Image();
    img.src = "img/" + String(Math.round(Math.random() * 26)) + ".jpg";
    img.onload = function () {
        cxt.drawImage(img, realPoint.x, realPoint.y, 30, 40);
    };
}

//每个间隔更换一个字符，并显示已经按下的所有字符
function mainLoop(cxt, coordCenterPoint, a, coorCenterPoint, step, timeInterval, new_, blessing) {
    //从原点开始
    cxt.lineWidth = 5;
    cxt.moveTo(coordCenterPoint.x, coordCenterPoint.y);

    let i = 0;
    let timer = setInterval(function () {
        new_.innerHTML = blessing.charAt(curIndex);
        window.curIndex++;
        if (window.theta <= 2 * Math.PI) {
            window.theta += step;
            i++;
        } else {
            clearInterval(timer);
            console.log('执行了' + i + '次');
        }
    }, timeInterval);
}