const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const particlesArray = [];

window.addEventListener('resize', function(event)
{
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});


const mouse = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('click', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

canvas.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});


class Particle {
    constructor() {
        //this.x = mouse.x;
        //this.y = mouse.y;

        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.size = Math.random() * 5 + 1; //between 1 and 6
        this.speedX = Math.random() * 3 - 1.5; //between -1.5 and 1.5
        this.speedY = Math.random() * 3 - 1.5; //between -1.5 and 1.5
    }
    update(){
        this.x += this.speedX;
        this.y += this.speedY;
    }
    draw(){
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, 50, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init(){
    for (let i = 0; i < 100; i++)
    {
        particlesArray.push(new Particle());
    }
}
init();
//console.log(particlesArray);\

function handleParticles(){
    particlesArray.forEach((particle, index)=>{
        particle.draw();
        particle.update();
    })
}


function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}

animate();