import { Component, ElementRef, AfterViewInit } from '@angular/core';

import * as D3Scale from 'd3-scale';
import * as D3Path from 'd3-path';
import * as D3Select from 'd3-selection';
import * as D3Shape from 'd3-shape';
import * as D3Array from 'd3-array';
import * as D3Collection from 'd3-collection';
import * as D3Axis from 'd3-axis';
import * as D3Transition from 'd3-transition';
import * as D3Time from 'd3-time';
import * as D3TimeFormat from 'd3-time-format';

import { IScanData, IScan, IXyScanData, IXy, IRectangle, IXyAngleData, IDoor, IBestDoor } from '../interfaces';
import { ScanDataService, DoorService } from '../services';
import { Rectangle } from '../helpers'

@Component({
  selector: 'app-navigacia',
  templateUrl: './navigacia.component.html',
  styleUrls: ['./navigacia.component.css']
})
export class NavigaciaComponent implements AfterViewInit {
  htmlElem: HTMLElement;
  rawData: Array<IScanData>;
  xyScanData: Array<IXyScanData>;
  d3Svg: any;
  svgWidth: number;
  svgHeight: number;
  svgSize: number;
  margin = 10;
  scale: any;
  reverseScale;
  robotR = 15;

  startXY: IXy;
  startXYReverseScale: IXy;
  endXY: IXy;
  endXYReverseScale: IXy;
  pointTypeToBeSet = 's';
  rectangle: Rectangle;

  line: any;

  constructor(private element: ElementRef,
    private scanDataService: ScanDataService,
    private doorService: DoorService) {
    this.htmlElem = element.nativeElement;
    this.rawData = scanDataService.getRawData();
    this.xyScanData = scanDataService.getXYData();
  }

  ngAfterViewInit() {
    this.svgWidth = this.htmlElem.children[0].clientWidth;
    this.svgHeight = this.htmlElem.children[0].clientHeight;
    this.svgSize = D3Array.min([this.svgWidth, this.svgHeight]);

    this.d3Svg = D3Select.select(this.htmlElem).select('svg').style("width", this.svgSize).style("height", this.svgSize);

    this.scale = D3Scale.scaleLinear().range([-this.svgSize / 2, this.svgSize / 2]).domain([-225, 225]);
    this.reverseScale = D3Scale.scaleLinear().range([-225, 225]).domain([-this.svgSize / 2, this.svgSize / 2]);
    this.line = D3Shape.line();

    this.line = this.line.x(d => {
      let scaledX = this.scale(d["x"]);
      return scaledX;
    });
    this.line = this.line.y(d => {
      let scaledY = this.scale(d["y"]);
      return scaledY;
    });
  }

  drawStep(data: Array<IXyAngleData>) {
    let robotRScaled = this.scale(this.robotR);
    this.d3Svg.selectAll('.top-g').remove();
    let d3TopG = this.d3Svg.append('g').attr('class', 'top-g').attr('transform', 'translate(' + this.svgSize / 2 + ',' + this.svgSize / 2 + ')');

    // // drow robot
    // d3TopG.selectAll("circle")
    //   .data([0]) // always draw robot in the center
    //   .enter()
    //   .append("circle")
    //   .attr("cx", d => { return d })
    //   .attr("cy", d => { return d })
    //   .attr("r", robotRScaled + "px")
    //   .attr("fill", "blue");

    // draw wals
    d3TopG.selectAll(".wall")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "wall")
      .attr("cx", d => { return this.scale(d.x); })
      .attr("cy", d => { return this.scale(d.y); })
      .attr("r", "1px")
      .attr("fill", d => {
        if (this.rectangle && this.rectangle.contains(d)) {
          console.log("purple");
          return "purple"; // 
        } else {
          return "#000000"; // black
        }
      });

    let doors: Array<IDoor> = this.doorService.getDoors(data, this.robotR * 2);
    console.log("doors:", doors);
    // draw left doors
    d3TopG.selectAll(".l-door")
      .data(doors)
      .enter()
      .append("circle")
      .attr("class", "l-door")
      .attr("cx", d => { return this.scale(d.l.x); })
      .attr("cy", d => { return this.scale(d.l.y); })
      .attr("r", "3px")
      .attr("fill", "yellow")

    d3TopG.selectAll(".r-door")
      .data(doors)
      .enter()
      .append("circle")
      .attr("class", "r-door")
      .attr("cx", d => { return this.scale(d.r.x); })
      .attr("cy", d => { return this.scale(d.r.y); })
      .attr("r", "3px")
      .attr("fill", "lime");

    if (this.startXY && this.endXY) {
      let bestDoor: IBestDoor = this.doorService.getBestDoor(this.startXYReverseScale, this.endXYReverseScale, doors);
      let bestDoorSide: IXy = bestDoor.pathLenL < bestDoor.pathLenR ? bestDoor.door.l : bestDoor.door.r;
      let bestLineData: Array<IXy> = [this.startXYReverseScale, bestDoorSide, this.endXYReverseScale];

      d3TopG.append("path")
        .datum(bestLineData)
        .attr("class", "line")
        .attr("d", this.line)
        .style("opacity", 0.5)
        .style("stroke-width", this.scale(2));
    }
  }

  onScanSelect(i: number) {
    this.drawStep(this.xyScanData[i].scans);
  }

  onMove(i: number) {
    let scans = this.xyScanData[i].scans;
    console.log("onMove -> scans", scans);
    setTimeout(() => {
      this.drawStep(scans);
      if (i < this.xyScanData.length - 1) {
        this.onMove(i + 1);
      }
    }, 200);
  }

  setStartEnd(event: MouseEvent) {
    console.log("event: ", event);
    let scale = D3Scale.scaleLinear().range([-this.svgSize / 2, this.svgSize / 2]).domain([0, this.svgSize]);

    if (this.pointTypeToBeSet === 's') {
      this.startXY = { x: event.offsetX, y: event.offsetY };
      console.log("start point: ", this.startXY);
      this.startXY = {
        x: scale(this.startXY.x),
        y: scale(this.startXY.y)
      }
      this.startXYReverseScale = {
        x: this.reverseScale(this.startXY.x),
        y: this.reverseScale(this.startXY.y)
      }
      console.log("scaled start point: ", this.startXY);
      this.pointTypeToBeSet = 'e';
    } else {
      this.endXY = { x: event.offsetX, y: event.offsetY };
      console.log("end point: ", this.endXY);
      this.endXY = {
        x: scale(this.endXY.x),
        y: scale(this.endXY.y)
      }
      this.endXYReverseScale = {
        x: this.reverseScale(this.endXY.x),
        y: this.reverseScale(this.endXY.y)
      }
      console.log("scaled end point: ", this.endXY);
      this.pointTypeToBeSet = 's';
      this.rectangle = new Rectangle(this.startXYReverseScale, this.endXYReverseScale, 2 * this.robotR);
      this.drawPossiblePaths();
    }
  }

  drawPossiblePaths() {
    this.d3Svg.selectAll(".path-g").remove();
    let pathG = this.d3Svg.append('g').attr('class', 'path-g').attr('transform', 'translate(' + this.svgSize / 2 + ',' + this.svgSize / 2 + ')');

    // draw start point
    pathG.selectAll(".start-xy")
      .data([this.startXY]) // always draw robot in the center
      .enter()
      .append("circle")
      .attr("class", "start-xy")
      .attr("cx", d => { return d.x })
      .attr("cy", d => { return d.y })
      .attr("r", this.scale(this.robotR) + "px")
      .attr("fill", "green");

    // draw end point
    pathG.selectAll(".end-xy")
      .data([this.endXY])
      .enter()
      .append("circle")
      .attr("class", "end-xy")
      .attr("cx", d => { return d.x })
      .attr("cy", d => { return d.y })
      .attr("r", this.scale(this.robotR) + "px")
      .attr("fill", "red");

    pathG.append("path")
      .datum([this.startXYReverseScale, this.endXYReverseScale])
      .attr("class", "line")
      .attr("d", this.line)
      .style("opacity", 0.5)
      .style("stroke-width", this.scale(2 * this.robotR));
  }
}
