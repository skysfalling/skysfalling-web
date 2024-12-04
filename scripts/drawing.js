//https://www.youtube.com/watch?v=aO1VcJ5WpKI

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

//ctx.shadowOffsetX = 10;
//ctx.shadowOffsetY = 10;
//ctx.shadowBlur = 10;
//ctx.shadowColor = 'black';
var hue = -1;
var drawing = false;
//ctx.globalCompositeOperation = 'difference'; //'difference' is trippy, 'destination-over' draws backwards
var rotation_angle = 0;


window.addEventListener('mousemove', function(e){

    if (drawing)
    {
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.rotate(rotation_angle);

        rotation_angle += 0.05;
        //hue ++;
        drawStar(30, 30, 20, 0.7, 4, 'red', 0.01);

        ctx.restore();

        drawStar(e.x, e.y, 50, 1, 10, 'white', 0.01);
    }

});

window.addEventListener('mousedown', function(event){
    drawing = true;
});
window.addEventListener('mouseup', function(event){
    drawing = false;
});



//drawPolygon(5, 100);

//=========================================
function drawPolygon(numSides, radius){
    ctx.beginPath();
    ctx.save(); //save ctx 


    ctx.translate(canvas.width/2, canvas.height/2);//moves 0,0 to middle of canvas
    ctx.moveTo(0, 0 - radius);

    for (var i = 0; i < numSides; i++)
    {
        ctx.lineTo(0, 0 - radius);
        ctx.rotate(Math.PI / (numSides/2)); //rotate CANVAS by specific angle based on numSides
    }

    ctx.restore(); //restore ctx to previous save
    ctx.closePath();
    ctx.stroke();
}

function drawStar(x, y, radius, inset, numSides, color = 'black', lineWidth = 1, strokeStyle = 'black'){

    if (hue != -1)
    {
        ctx.fillStyle = 'hsl(' + hue + ',100%, 50%)';
    }
    else
    {
        ctx.fillStyle = color;
    }
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = strokeStyle;

    ctx.beginPath();
    ctx.save(); //save ctx 

    ctx.translate(x, y);//moves 0,0 to set point
    ctx.moveTo(0, 0 - radius);

    for (let i = 0; i < numSides; i++)
    {
        ctx.rotate(Math.PI / numSides); 
        ctx.lineTo(0, 0 - radius * inset); //inner radius of star

        ctx.rotate(Math.PI / numSides); 
        ctx.lineTo(0, 0 - radius); //outer radius of star
    }

    ctx.restore(); //restore ctx to previous save
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
}

function rainbowFillStyle(hue)
{
    return 
}