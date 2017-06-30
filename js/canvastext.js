/**
 * Created by Administrator on 2017/6/29.
 */
var touchflag = 0;//作为鼠标松开后 脱离鼠标事件的标志 当然也可以移出监听实现功能
var jiaflag = 0;//作为鼠标松开时 不在画小球到拉扯框的虚线
var yuejie = 0;//作为小球出界后的标志
var fenshu=0;//记录分数
var loop;
var dot;
(function () {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    if (canvas.getContext) {
        console.log('支持canvas');
    } else {
        console.log('不支持canvas');
    }

    var WIDTH = canvas.width = 1000;
    var HEIGHT = canvas.height = 600;

    var dots=[];//存放小球的轨迹
    var initx=105;//记录小球初始位置
    var inity=500;
    var ball = {//初始化小球
        x: 105,
        y: 500,
        r:20,
        g:2,
        vx:-4,
        vy:-40
    }

    drawball(context,ball.x,ball.y);//先初始化画出一个小球

    document.getElementById('cleartrac').addEventListener('click',function(){//监听清空小球轨迹
        dots=[];//清空数组
        drawball(context,ball.x,ball.y);
    });
    canvas.onmousedown = touchStar;
    canvas.onmouseup = stopdraw;
    canvas.onmouseout = stopdraw2;
    canvas.onmousemove = touchMove;

    var Dot = function(x,y){
        this.x = x;
        this.y = y;
    }
    function touchStar(e){
        touchflag=1;

        var x,y;
        x = e.pageX - canvas.offsetLeft;
        y = e.pageY - canvas.offsetTop;

        if((x-20) < 30){
            x=50;
        }
        if((y-20) < 450){
            y=470;
        }
        if((x+20) > 180){
            x=160;
        }
        if((y+20) > 550){
            y=530;
        }
        ball.x=x;
        ball.y=y;
        drawball(context,ball.x,ball.y);
    }

    function touchMove(e){
        if(touchflag == 1){
            var x,y;
            x = e.pageX - canvas.offsetLeft;
            y = e.pageY - canvas.offsetTop;

            if((x-20) < 30){
                x=50;
            }
            if((y-20) < 450){
                y=470;
            }
            if((x+20) > 180){
                x=160;
            }
            if((y+20) > 550){
                y=530;
            }
            ball.x=x;
            ball.y=y;
            drawball(context,ball.x,ball.y);
        }
    }

    function stopdraw2(e) {
        touchflag = 0;
    }
    function stopdraw(e){
        touchflag = 0;

        var x, y,vx,vy;
        x = e.pageX - canvas.offsetLeft;
        y = e.pageY - canvas.offsetTop;

        if((x-20) < 30){
            x=50;
        }
        if((y-20) < 450){
            y=470;
        }
        if((x+20) > 180){
            x=160;
        }
        if((y+20) > 550){
            y=530;
        }

        jiaflag=1;

        ball.x=x;
        ball.y=y;
        ball.vx=105-x;
        ball.vy=-(y-500)*3;

        drawballsport();//开始画抛物线
    }

    function drawballsport(){
       loop=setInterval(function(){

           dot = new Dot(ball.x,ball.y)
           dots.push(dot);
           update();
           drawball(context,ball.x,ball.y);
           if(ball.x > (1000 + ball.r)){
               setTimeout(function(){
                   clearInterval(loop);
                   ball.x = initx;
                   ball.y = inity;
                   jiaflag = 0;
                   yuejie=0
                   drawball(context,ball.x,ball.y);
               },1000)
           }
       },50);
    }
    function drawball(cxt,x,y){//画小球
        cxt.clearRect(0,0,context.canvas.width,context.canvas.height);

        lankuang();
        canvaskuang();
        aimkuang();
        drawText();
        for(var i=0;i<dots.length;i++){
            drawrac(context,dots[i].x,dots[i].y);
        }
        var grad  = context.createRadialGradient(x,y,5,x,y,20);
        //颜色
        grad.addColorStop(0,'rgb(231, 74, 148)');
        grad.addColorStop(0.5,'rgb(99, 75, 231)');
        grad.addColorStop(1,'rgb(78, 228, 156)');

        if(jiaflag!=1){
            Curve(cxt,x,y);
        }

        cxt.beginPath();
        cxt.arc(x,y,ball.r,0,2*Math.PI);
        cxt.strokeStyle="#000000";
        cxt.fillStyle=grad;
        cxt.stroke();
        cxt.fill();
        cxt.closePath();

        if(yuejie==0){
            if((x-20)>770 && (x+20)<930 && (y+20)<160 && (y-20)>20){
                yuejie=1;
                fenshu++;
            }
        }

    }

    function drawText(){//分数文字
        var gradient=context.createLinearGradient(0,0,canvas.width,0);
        gradient.addColorStop("0","magenta");
        gradient.addColorStop("0.5","blue");
        gradient.addColorStop("1.0","red");
        context.font = 'bold 170px Sans-serif';
        context.textAlign = 'center';
        context.baseline = 'middle';
        context.fillStyle=gradient;
        context.fillText(fenshu, WIDTH / 2, HEIGHT / 2);
    }
    function drawrac(cxt,x,y){//轨迹小球的绘画
        cxt.beginPath();
        context.setLineDash([]);
        cxt.arc(x,y,3,0,2*Math.PI);
        cxt.strokeStyle="#cccccc";
        cxt.stroke();
        cxt.closePath();
    }

    function Curve(cxt,x,y){//小球在拉扯框内的抛物虚线
        //绘制二次方贝塞尔曲线
        var postion = panduandian(x,y);
        context.setLineDash([5, 15]);
        cxt.strokeStyle ="#FF5D43";
        cxt.beginPath();
        if(postion<0){
            cxt.moveTo(x-10,y+10);
            cxt.quadraticCurveTo(30,y,30,450);
        }else if(postion>0){
            cxt.moveTo(x+10,y-10);
            cxt.quadraticCurveTo(x,450,30,450);
        }else {
            cxt.moveTo(x,y);
            cxt.quadraticCurveTo(x,y,30,450);
        }

        cxt.stroke();
        cxt.beginPath();
        if(postion<0){
            cxt.moveTo(x-10,y+10);
            cxt.quadraticCurveTo(x,550,180,550);
        }else if(postion>0){
            cxt.moveTo(x+10,y-10);
            cxt.quadraticCurveTo(180,y,180,550);
        }else {
            cxt.moveTo(x,y);
            cxt.quadraticCurveTo(x,y,180,550);
        }
        cxt.stroke();
        cxt.globalCompositeOperation = 'source-over';    //目标图像上显示源图像
    }


    function canvaskuang(){//画布的框
        context.beginPath();
        context.setLineDash([]);
        context.rect(0,0,context.canvas.width,context.canvas.height);
        context.strokeStyle="#000000";
        context.stroke();
        context.closePath();
    }

    function aimkuang(){//拉扯框
        context.beginPath();
        context.setLineDash([5, 15]);
        context.rect(30,450,150,100);
        context.strokeStyle="#000000";
        context.stroke();
        context.closePath();
    }

    function panduandian(x,y){//判断点在直线位置的函数 返回值>0 在上方 返回值<0 在下方  返回值=0 在直线上

        var a = 550-450;
        var b = 30-180;
        var c = 180*450-30*550;

        return a*x+b*y+c
    }
    function update(){//通过简单的运动原理更新小球位置
        ball.x = ball.x + ball.vx;
        ball.y = ball.y + ball.vy;
        ball.vy = ball.vy + ball.g;

        if( ball.y > (600 - ball.r)){//下边框碰撞检测
            ball.y = 600 - ball.r;
            ball.vy = -ball.vy*0.5;
        }

        if( ball.x < (ball.r)){//左边框碰撞检测
            ball.vx = -ball.vx;
        }
        if( ball.y < (ball.r)){//上边框碰撞检测
            ball.y = ball.r;
            ball.vy = -ball.vy*0.5;
        }
    }

    function lankuang(){//椭圆框
        //椭圆
        context.beginPath();
        context.setLineDash([5,15]);
        context.ellipse(850, 100, 40, 80, 1.55, 0, 2*Math.PI, true);
        context.closePath();
        context.strokeStyle = "#000000";
        context.stroke();
    }
})();
