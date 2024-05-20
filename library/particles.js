const canvas = document.getElementById('canvas2');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const particlesArray = [];
let hue = 0;

const mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener('resize', function(event)
{
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});



canvas.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;

    console.log("mouse is moving " + mouse.x + " " + mouse.y);
});

canvas.addEventListener('click', function(event){
    mouse.x = event.x;
    mouse.y = event.y;

    console.log("mouse click");

    
    ctx.fillStyle = this.color; //#e42069 is nice
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
    ctx.fill();
});

function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0,0,0,0.01)';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    handleParticles();
    requestAnimationFrame(animate);
}

animate();


