const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const particlesArray = [];
let hue = 0;

window.addEventListener('resize', function (event) {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
});


const mouse = {
    x: undefined,
    y: undefined
}

canvas.addEventListener('click', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;

    createParticles(20);
});

canvas.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    createParticles(2);
});


class Particle {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 15 + 1; //between 1 and 6
        this.speedX = Math.random() * 3 - 1.5; //between -1.5 and 1.5
        this.speedY = Math.random() * 3 - 1.5; //between -1.5 and 1.5
        this.color = 'hsl(' + hue + ', 100%, 50%)';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) { this.size -= 0.1; }
    }
    draw() {
        ctx.fillStyle = this.color; //#e42069 is nice
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles(num = 1) {
    for (let i = 0; i < num; i++) {
        particlesArray.push(new Particle());
    }

}

function handleParticles() {

    for (let i = 0; i < particlesArray.length; i++) {
        let particle_i = particlesArray[i];
        particle_i.draw();
        particle_i.update();

        for (let j = i; j < particlesArray.length; j++) {
            let particle_j = particlesArray[j];

            const dx = particle_i.x - particle_j.x;
            const dy = particle_i.y - particle_j.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = particle_i.color;
                ctx.lineWidth = 0.2;
                ctx.moveTo(particle_i.x, particle_i.y);
                ctx.lineTo(particle_j.x, particle_j.y);
                ctx.stroke();

            }

        }

        if (particle_i.size <= 0.3) {
            particlesArray.splice(i, 1);
            i--;
        }

    }


    particlesArray.forEach((particle, index) => {

    })
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0,0,0,0.01)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    hue += 5;

    handleParticles();
    requestAnimationFrame(animate);
}

animate();