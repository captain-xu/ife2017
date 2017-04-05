var myPlayer = document.getElementById('myPlayer'),
    data = {
        musicPath: [
            'music/西山居游戏音乐 - 瞿塘峡地图音乐(水域BGM).mp3',
            'music/万岁爺 - 卷睫盼.mp3',
            'music/骆集益 - 1945.mp3',
            'music/Cara Dillon - Craigie Hill.mp3',
            'music/张本煜 - 一方天地.mp3',
            'music/陈鸿宇,苏紫旭,刘昊霖 - 别送我.mp3',
            'music/王筝 - 对你说.mp3',
            'music/米依,江河老师,江河 - 借我.mp3',
            'music/音频怪物 - 归.mp3',
            'music/孟大宝 - 历历万乡（Cover 陈粒）.mp3',
            'music/燕池 - 人海 - 2015版.mp3',
            'music/藤田恵美 - Down By the Salley Gardens.mp3'
        ],
        flag: false,
        listIndex: -1,
        re: {
            singer: /\/([a-z0-9A-Z\u4e00-\u9fa5,\s]+)\s[\-]/,
            musicName: /\s[\-]\s(.+)\.mp3/,
            img: /music\/(.+).mp3/
        }
    };


control();
function control() {
    var btnBox = document.getElementById('btnBox');
    btnBox.onclick = function (e) {
        var event = e || event ;
        if(event.target.id === "playStop"){
            data.flag = !data.flag;
            playStop();
        }else if(event.target.id === "next"){
            next();
            myPlayer.oncanplay = function () {
                playStop();
            }
        }
    };
}


myPlayer.addEventListener("canplay", function(){
    remainTime();       //剩余时间和进度条的初始化
});
//剩余时间&进度条
function remainTime() {
    var lastTime = document.getElementById('lastTime'),
        progressBar = document.getElementById('progressBar'),
        lastTimeNum = parseInt(myPlayer.duration - myPlayer.currentTime),   //剩余时间
        minute = Math.floor(lastTimeNum/60),            //分钟转换
        second =  Math.round(lastTimeNum%60),           //秒数转换
        l = myPlayer.currentTime/myPlayer.duration;     //进度条长度比例

    if(minute<10){
        minute = '0' + minute;
    }
    if(second<10){
        second = '0' + second;
    }
    lastTime.innerHTML = '-' + minute + ':' + second;   //输出剩余时间

    progressBar.style.width = (l)*430 + 'px';           //输出进度条长度

    if(myPlayer.readyState != 4){
        lastTime.innerHTML = '加载中';     //加载不够时
    }

    return lastTimeNum;     //返回剩余时间
}

//播放时的监听函数
function progressGo() {
    function timeGo() {
        var lastTimeNum = remainTime();
        if(lastTimeNum >= 0){
            setTimeout(timeGo,100)
        }
        if(myPlayer.ended){
            next();
            playStop();
        }
    };
    setTimeout(timeGo,50)
}


//播放&暂停函数
function playStop() {
    var btnPlay = document.getElementById('playStop');
    if(data.flag){
        btnPlay.style.backgroundPosition = '52px 0';    //图标转换
        myPlayer.play();
        progressGo();       //开启监听
    }else {
        btnPlay.style.backgroundPosition = '104px 0';
        myPlayer.pause();
    }
}

//下一首
next(); //初始化
function next() {
    var singer = document.getElementById('singer'),
        cover = document.getElementById('cover'),
        musicName = document.getElementById('musicName'),
        progressBar = document.getElementById('progressBar');

    progressBar.style.width = '0';      //进度条归零

    data.listIndex++;            //列表序号
    var num = data.listIndex%12;
    myPlayer.src = data.musicPath[num];
    data.musicPath[num].replace(data.re.musicName,function ($0,$1) {
        musicName.innerHTML = $1;
    });
    data.musicPath[num].replace(data.re.singer,function ($0,$1) {
        singer.innerHTML = $1;
    });
    data.musicPath[num].replace(data.re.img,function ($0,$1) {
        cover.style.backgroundImage = 'url("image/' + $1 + '.jpg")';
    });
}

volumeControl();
//音量控制
function volumeControl() {
    var volumeBox = document.getElementById('volumeBox');
    var volumeBar = document.getElementById('volumeBar');
    var volumeColor = document.getElementById('volumeColor');

    volumeBox.onmouseover = function () {   //鼠标悬浮,音量条出现
        volumeBar.style.width = '50px';
        volumeColor.style.width = (myPlayer.volume)*50 + 'px';
    };

    volumeBox.onclick = function (e) {
        var wid = e.clientX - distance(volumeBar);      //音量条长度
        if(wid >= 0){
            volumeColor.style.width = wid + 'px';

            var ratio = wid/50;
            myPlayer.volume = ratio;        //音量比例(0-1)

            if(ratio >= 0.8){               //音量改变,响应图标的变化
                volumeBox.style.backgroundPosition = "0px 0px";
            }else if(ratio >= 0.4 && ratio < 0.8){
                volumeBox.style.backgroundPosition = "0px -12px";
            }else if(ratio < 0.4){
                volumeBox.style.backgroundPosition = "0px -24px";
            }
        }
    };

    volumeBox.onmouseleave = function () {      //鼠标离开,音量条收缩
        volumeBar.style.width = '0';
    }
}

//跳转进度
progressControl();
function progressControl() {
    var progressBox = document.getElementById('progressBox');
    var progressBar = document.getElementById('progressBar');
    myPlayer.oncanplay = function () {
        progressBox.onclick = function (e) {
            var wid = e.clientX - distance(progressBar);
            progressBar.style.width = wid + 'px';       //进度条长短

            var long = parseInt(myPlayer.duration);     //歌曲时长
            myPlayer.currentTime = Math.round((wid/430)*long);             //设置跳转时间,fastSeek()方法无效
            data.flag = true;        //跳转之后直接播放
            playStop();
        }
    }
}


//    获取边距
function distance(obj) {
    var disX = 0;
    while(obj != document){
        disX += obj.offsetLeft;
        obj = obj.parentNode;
    }
    return disX;
}