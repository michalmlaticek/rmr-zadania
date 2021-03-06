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

import { ISensorData, IXySensorData } from '../interfaces';
import { MoveDataService } from '../services';


@Component({
  selector: 'app-odometria',
  templateUrl: './odometria.component.html',
  styleUrls: ['./odometria.component.css']
})
export class OdometriaComponent implements AfterViewInit {
  data: Array<ISensorData>;
  xyData: Array<IXySensorData> = new Array<IXySensorData>();

  margin = 10;

  htmlElem: HTMLElement;
  d3Svg: any;

  constructor(private element: ElementRef,
    private moveDataService: MoveDataService) {
    this.htmlElem = element.nativeElement;
    this.data = moveDataService.getRawData();
    console.log("data: ", this.data);
  }

  ngAfterViewInit() {
    this.d3Svg = D3Select.select(this.htmlElem).select('svg');
    this.computeToXY();
    this.draw();
  }

  computeToXY() {
    this.xyData = this.moveDataService.getXYData();
    console.log("xyData: ", this.xyData);
  }


  draw() {
    let width = this.htmlElem.children[0].children[0].clientWidth;
    let height = this.htmlElem.children[0].children[0].clientHeight;
    let svgSize = D3Array.min([width, height]);
    // let width = 450;
    // let height = 450;
    let xDomain = D3Array.extent(this.xyData, d => d.x);
    let xMax = Math.abs(xDomain[0]) < Math.abs(xDomain[1]) ? Math.abs(xDomain[1]) : Math.abs(xDomain[0]);
    let yDomain = D3Array.extent(this.xyData, d => d.y);
    let yMax = Math.abs(yDomain[0]) < Math.abs(yDomain[1]) ? Math.abs(yDomain[1]) : Math.abs(yDomain[0]);
    let domainMax = D3Array.max([xMax, yMax]);
    console.log("domainMax: ", domainMax);
    let scale = D3Scale.scaleLinear().range([(-svgSize / 2) + this.margin, (svgSize / 2) - this.margin]).domain([-domainMax, domainMax]);
    let yScale = D3Scale.scaleLinear().range([(-svgSize / 2) + this.margin, (svgSize / 2) - this.margin]).domain([-domainMax, domainMax]);
    let line = D3Shape.line();

    line = line.x(d => {
      let scaledX = scale(d["x"]);
      console.log("scaledX: ", scaledX);
      return scaledX;
    });
    line = line.y(d => {
      let scaledY = yScale(d["y"]);
      console.log("scaledY: ", scaledY);
      return scaledY;
    });

    let d3TopG = this.d3Svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    d3TopG.append("path")
      .datum(this.xyData)
      .attr("class", "line")
      .attr("stroke", "#000000")
      .attr("d", line);
  }
}
