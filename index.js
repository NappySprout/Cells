let cellSize = 5
let width = 100
let height = 100

const screenElement = document.getElementById("screen")
const setup = ()=>{
    screenElement.style.cssText = `border:1px solid white;height:${cellSize*height}px;width:${cellSize*width}px` 
    screenElement.width =  cellSize*width
    screenElement.height = cellSize*height 
}
setup()
const screen = screenElement.getContext("2d")

const getCheckedNameValue = inputname => document.querySelector(`input[name=${inputname}]:checked`).value

const draw = (x,y,color)=>{screen.fillStyle = color;screen.fillRect(x*cellSize+1,y*cellSize+1,cellSize-1,cellSize-1);}// non functional

const genCells = (x,y)=>{// non functional
    val = []
    for(let i=0;i<y;i++){val.push([]);for(let _=0;_<y;_++)val[i].push(Math.round(Math.random()))}
    return val
}

const drawCells = (cells)=>{// non functional
    cells.forEach((layer,y)=>{
        layer.forEach((cell,x)=>{
            if(cell==1)draw(x,y,"white") ; else draw(x,y,"black")
        })
    })
}

const getNeighbours = (x,y)=>
       [[x-1,y-1],[x,y-1],[x+1,y-1],
        [x-1,y  ]        ,[x+1,y  ],
        [x-1,y+1],[x,y+1],[x+1,y+1],]

const filterNeighbours = (neighbours,maxX,maxY) => neighbours.filter(   ([x,y])=> (x>-1 && x<maxX) && (y>-1 && y<maxY)   ) 
const warpNeighbours = (neighbours,maxX,maxY) => neighbours.map( ([x,y]) => [(x+maxX)%maxX,(y+maxY)%maxY] ) 

const testAlive = (x,y,cells,func)=>{ // switch warpNeighbours and filterBeighbours for different mode 
    const neighbourCoord = radioFunctions[func](getNeighbours(x,y),width,height)
    const neighbourStatus = neighbourCoord.map(([cx,cy])=> cells[cy][cx] )
    const neighbourCount = neighbourStatus.reduce((acc,cur)=>acc+cur,0)
    return cells[y][x]?
    neighbourCount == 2 || neighbourCount == 3?
        1:0:
    neighbourCount == 3?
        1:0
}

const testCluster = (x,y,cells,func)=>{ // switch warpNeighbours and filterBeighbours for different mode 
    const neighbourCoord = radioFunctions[func](getNeighbours(x,y),width,height)
    const neighbourStatus = neighbourCoord.map(([cx,cy])=> cells[cy][cx] )
    const neighbourCount = neighbourStatus.reduce((acc,cur)=>acc+cur,0)
    return neighbourCount==4 ? getCheckedNameValue("tie")? cells[y][x] :Math.round(Math.random()) : 0+(neighbourCount>4)
}

const radioFunctions = {
    "filter":filterNeighbours,
    "warp":warpNeighbours,
    "life":testAlive,
    "cell":testCluster,
}

const nextCells = (cells)=>
    cells.map((layer,y)=>
        layer.map((cell,x)=>
            radioFunctions[getCheckedNameValue("mode")](x,y,cells,getCheckedNameValue("neighbour"))
        )
    )

let origin = genCells(width,height)
drawCells(origin)
const next = ()=>{
    origin = nextCells(origin)
    drawCells(origin)
}
document.addEventListener("keydown",(e)=>{
    if (e.code=="KeyW") next()
    if (e.code=="KeyA"){
        origin=genCells(width,height)
        drawCells(origin)
    }
})

document.getElementById("heightEl").addEventListener("change",e=>{
    height = parseInt(e.target.value)
    setup()
    drawCells(origin)
})
document.getElementById("widthEl").addEventListener("change",e=>{
    width = parseInt(e.target.value)
    setup()
    drawCells(origin)
})
document.getElementById("pixelEl").addEventListener("change",e=>{
    cellSize = parseInt(e.target.value)
    setup()
    drawCells(origin)
})