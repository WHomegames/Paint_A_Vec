let lines = [];
let linesUndone = [];

const lineData = {
  x1: 0,
  x2: 0,
  y1: 0,
  y2: 0,
 
  weight: 0,
  myColor: 'rgb(255,255,255)',
 
  drawLine()
  {
    //stroke(0,255,0);
    strokeWeight(this.weight);
    stroke(this.myColor);
    line(this.x1,this.y1,this.x2,this.y2);
  },
 
  toString()
  {
    return '<line x1="' +this.x1+'" y1="'+this.y1+'" x2="'+this.x2+'" y2="'+this.y2+'" stroke="'+this.myColor+'" stroke-width="'+this.weight+'" stroke-linecap="round"/>';
  }
};

let b_thickness;
let b_mag;
let brushType = 1;
//☐ or ☑

function setup() {
 
  createCanvas(400, 500);
  frameRate(120);
  colorMode(HSB);

  strokeWeight(6);
  stroke(0,255,0);
  background(200);
 
  myPicker = createColorPicker(color(random(0,360),100,100));
  myPicker.position(10, 405,'fixed');
 
  let button0 = createButton('Dynamic Brush');
  button0.position(70, 405,'fixed');
  button0.mousePressed(() => {
    brushType = 1;
  });
 
  let button1 = createButton('Static Brush');
  button1.position(70, 430,'fixed');
  button1.mousePressed(() => {
    brushType = 0;
  });
 
  let button2 = createButton('Line Tool');
  button2.position(70, 455,'fixed');
  button2.mousePressed(() => {
    brushType = 3;
  });
 
  let button3 = createButton('Clear');
  button3.position(345, 405,'fixed');
  button3.mousePressed(() => {
    lines = [];
  });
 
  let button4 = createButton('Export SVG');
  button4.position(313, 430,'fixed');
  button4.mousePressed(() => {
    saveSVG();
  });
 
  let button5 = createButton('Export PNG');
  button5.position(313, 455,'fixed');
  button5.mousePressed(() => {
    savePNG();
  });
 
  b_mag = createSlider(1, 25,15);
  b_mag.position(190, 405,'fixed');
  b_mag.size(50);
 
  b_thickness = createSlider(1, 100,10);
  b_thickness.position(190, 430,'fixed');
  b_thickness.size(50);
}

let delPrev = false;
let lineStartPos = [-1,-1];
let lastWeight = 0;

function draw() {
  background(220);
  //translate(mouseX,mouseY);
  for(let i = 0; i < lines.length; i++)
    {
      lines[i].drawLine();
    }
 
  if(mouseY <= 400 && mouseY >= 0 && mouseX <= 400 && mouseX >= 0)
  {
   
    if(!mouseIsPressed && brushType == 3)
          {
            if(!(lineStartPos[0] == -1 && lineStartPos[1] == -1))
            {
              let drawnLine = {...lineData};
              drawnLine.x1 = lineStartPos[0];
              drawnLine.y1 = lineStartPos[1];
              drawnLine.x2 = mouseX;
              drawnLine.y2 = mouseY;
              drawnLine.weight = b_thickness.value();
              drawnLine.myColor = myPicker.color();

              lines.push(drawnLine);
            }
            lineStartPos = [-1,-1];
          }

    if(mouseIsPressed && mouseButton == LEFT)
    {
      if(brushType == 3) //line tool
        {
          if(lineStartPos[0] == -1 && lineStartPos[1] == -1)
            {
              lineStartPos = [mouseX,mouseY];
            }
          else
            {
              stroke(myPicker.color());
              strokeWeight(b_thickness.value());
              line(lineStartPos[0],lineStartPos[1],mouseX,mouseY);
            }
        }
        else //regular draw
        {
          lineStartPos = [-1,-1];

          let weightt = -dist(pmouseX,pmouseY,mouseX,mouseY) * brushType * (0.5/deltaTime);
          let drawnLine = {...lineData};
          drawnLine.x1 = pmouseX;
          drawnLine.y1 = pmouseY;
          drawnLine.x2 = mouseX;
          drawnLine.y2 = mouseY;
          drawnLine.weight = Math.max(weightt*b_mag.value() + b_thickness.value(),1);
          //drawnLine.weight = Math.log(drawnLine.weight*2.7)/Math.log(2.7);
          let lerpWeight = lerp(drawnLine.weight,lastWeight, 0.75*deltaTime/15 * brushType);
          lastWeight = drawnLine.weight;
         
          drawnLine.weight = lerpWeight;
          drawnLine.myColor = myPicker.color();

          if(drawnLine.weight)
          lines.push(drawnLine);
         
          lastWeight = drawnLine.weight;
        }
      }
   
    if(!mouseIsPressed)
    {
       lastWeight = b_thickness.value()/2;
    }
  }
 
  //console.log(deltaTime);
 
  if(keyIsPressed && key == 'z' && lines.length > 0)
    {
      linesUndone.push(lines.pop());
    }
  if(keyIsPressed && key == 'y' && linesUndone.length > 0)
    {
      lines.push(linesUndone.pop());
    }
 
  fill(0,0,90);
  stroke(0,50,100);
  strokeWeight(1);
  rect(0,401,400,99);
 
  //textSize(3);
  //fill('yellow');
  //text(lines, 75,410,320,80);

  //strokeWeight(4);
 
}

function saveSVG()
{
  let stringData = '<?xml version="1.0" encoding="UTF-8" standalone="no"?> \n';
  stringData += '<!DOCTYPE svg PUBLIC " " " " >';
  stringData += '<svg width="400" height="400" viewBox="0 0 400 400"> \n';
  stringData += '<rect fill="#fff" stroke="#000" x="0" y="00" width="400" height="400"/> \n';
  stringData += '<g opacity="1"> \n';
 
  for(let i = 0; i < lines.length; i++)
  {
      stringData += lines[i].toString() + "\n";
  }
 
  stringData += '</g> \n';
  stringData += '</svg> \n';
 
  //console.log(stringData);
 
  let list = split(stringData, '\n');
  //saveStrings(list, "drawing")
 
  saveStrings(list,"drawing","svg");
}

function savePNG()
{
  resizeCanvas(400, 400);
  saveCanvas("drawing.png");
  resizeCanvas(400, 500);
}
