
const blobs = [], colors = ['#ff0000', '#00ff00', '#0000ff']


class BlobCtrl {
    constructor() {
        this.offsetMax = 0.8;
        this.offsetMin = 0.4;
        this.positionOffset = 30;
        this.scaleMax = 100;
        this.scaleMin = 20;
        this.speedMax = 0.08;
        this.speedMin = 0.02;
        this.radius = 100;
    }
}

const blobCtrl = new BlobCtrl()
const gui = new dat.GUI()
gui.add(blobCtrl, 'offsetMax', .6, 1)
gui.add(blobCtrl, 'offsetMin', .1, .4)
gui.add(blobCtrl, 'positionOffset', 10, 100)
gui.add(blobCtrl, 'scaleMax', 80, 150)
gui.add(blobCtrl, 'scaleMin', 10, 50)
gui.add(blobCtrl, 'speedMax', 0.06, 1)
gui.add(blobCtrl, 'speedMin', 0.01, 0.04)
gui.add(blobCtrl, 'radius', 100, 200)

class Blob {
    constructor(offset, scale, x, y, tSpeed, color) {
        this.offset = offset
        this.scale = scale
        this.x = x
        this.y = y
        this.tSpeed = tSpeed
        this.c = color
        this.t = 0
        this.s = 0
    }

    display() {
        push()
            fill(this.c)
            translate(this.x, this.y)

            this.s = lerp(this.s, 1, 0.07)
            scale(this.s)

            noiseDetail(1, .8)
            beginShape()
                for (let i = 0; i < TWO_PI; i += radians(1)) {

                    let xOff = this.offset * cos(i) + this.offset
                    let yOff = this.offset * sin(i) + this.offset // add any random number to avoid symmetry, doesn't have to be this.offset, it's just for convenience

                    let r = blobCtrl.radius + map(noise(xOff, yOff, this.t), 0, 1, -this.scale, this.scale)
                    
                    let x = r * cos(i)
                    let y = r * sin(i)

                    vertex(x, y)
                }
            endShape()
            this.t += this.tSpeed
        pop()
    }
}

function generateBlobs(positionX, positionY) {
    const offset = random(blobCtrl.offsetMax, blobCtrl.offsetMin)
    
    new Array(3).fill(1).map((_, i) => {

        const scale = random(blobCtrl.scaleMin, blobCtrl.scaleMax)

        const x = positionX + random(-blobCtrl.positionOffset, blobCtrl.positionOffset)
        const y = positionY + random(-blobCtrl.positionOffset, blobCtrl.positionOffset)

        const tSpeed = random(blobCtrl.speedMin, blobCtrl.speedMax)
        const color = colors[i % 3]

        let blob = new Blob(offset, scale, x, y, tSpeed, color)
        blobs.push(blob)
    })
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight)

    generateBlobs(100, 100) 
}

function draw() {
    clear()
    noStroke()
    blendMode(SCREEN)

    translate( width / 2, height / 2 )

    blobs.forEach(blob => {
        blob.display()      
    })

}

function doubleClicked() {
    generateBlobs(mouseX - width / 2, mouseY - height / 2)
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}