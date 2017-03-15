var canvas = document.getElementById("rating"),
    ctx = canvas.getContext("2d"),
    percent = 85.0, // 最终百分比
    circleX = canvas.width / 2, // 中心x坐标
    circleY = canvas.height / 2, // 中心y坐标
    radius = 120, // 圆环半径
    lineWidth = 10, // 圆形线条的宽度
    fontSize = 50; // 字体大小

// 画弧圆
function circle(cx, cy, r) {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#0C786C';
    ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
    ctx.stroke();
}
// 画里面的弧线
function circleLine(cx, cy) {
	var R = 105;
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#C2F4F4';
    ctx.arc(cx, cy, R, Math.PI * 0.75, Math.PI * 2.25);
    ctx.stroke();
}

// 画弧线
function sector(cx, cy, r, startAngle, endAngle, anti) {
    ctx.beginPath();
    ctx.lineWidth = lineWidth;

    // 渐变色 - 可自定义
    var linGrad = ctx.createLinearGradient(
        circleX, circleY - radius - lineWidth, circleX, circleY + radius + lineWidth
    );
    linGrad.addColorStop(0.00, '#1FD8B9');     // 绿色
    linGrad.addColorStop(0.30, '#FAED30');     // 黄色
    linGrad.addColorStop(0.40, '#F8C828');     // 橙色
    linGrad.addColorStop(0.50, '#FAED30');     // 黄色
    linGrad.addColorStop(0.80, '#FA4C20');     // 橙色
    linGrad.addColorStop(1.00, '#15A49B');     // 红色
    ctx.strokeStyle = linGrad;

    // 圆弧两端的样式
    ctx.lineCap = 'round';

    // 圆弧
    ctx.arc(cx,cy,r,startAngle,endAngle * (Math.PI / 180.0) + Math.PI * 0.75)
    ctx.stroke();
}

// 刷新
function loading() {
    if (process >= percent) {
        clearInterval(circleLoading);
    }

    // 清除canvas内容
    ctx.clearRect(0, 0, circleX * 2, circleY * 2);

    // 弧圆
    circle(circleX, circleY, radius);
    // 里面的弧线
    circleLine(circleX, circleY, radius);

    // 圆弧
    sector(circleX, circleY, radius, Math.PI * 0.75, process / 100 * 270);

    // 控制结束时动画的速度
    if (process / percent > 0.90) {
        process += 0.30;
    } else if (process / percent > 0.80) {
        process += 0.55;
    } else if (process / percent > 0.70) {
        process += 0.75;
    } else {
        process += 1.0;
    }
}

var process = 0.0; // 进度
var circleLoading = window.setInterval(function () {
    loading();
}, 20);