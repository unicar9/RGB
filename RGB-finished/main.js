
const radius = 100,
    blobs = [],
    colors = ['#ff0000', '#00ff00', '#0000ff'], 
    positionOffset = 30

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

                    let x = this.offset * cos(i) + this.offset
                    let y = this.offset * sin(i) + this.offset

                    let r = radius + map(noise(x, y, this.t), 0, 1, -this.scale, this.scale)
                    
                    let x1 = r * cos(i)
                    let y1 = r * sin(i)

                    vertex(x1, y1)
                }
            endShape()
            this.t += this.tSpeed
        pop()
    }
}

function generateBlobs(positionX, positionY) {
    const offset = random(.4, .8)
    new Array(3).fill(1).map((_, i) => {

        const scale = random(20, 80)

        const x = positionX + random(-positionOffset, positionOffset)
        const y = positionY + random(-positionOffset, positionOffset)

        const tSpeed = random(.02, .08)
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

function mousePressed() {
    generateBlobs(mouseX - width / 2, mouseY - height / 2)
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}