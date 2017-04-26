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

import { ISensorData } from '../i-sensor-data';
import { IXyData } from '../i-xy-data';
import { SensorDataService } from '../sensor-data.service';


@Component({
  selector: 'app-odometria',
  templateUrl: './odometria.component.html',
  styleUrls: ['./odometria.component.css']
})
export class OdometriaComponent implements AfterViewInit {
  data: Array<ISensorData>;
  xyData: Array<IXyData> = new Array<IXyData>();

  margin = {
    left: 5,
    right: 5,
    top: 5,
    bottom: 5
  }

  htmlElem: HTMLElement;
  d3Svg: any;

  constructor(private element: ElementRef,
    private sensorDataService: SensorDataService) {
    this.htmlElem = element.nativeElement;
    this.data = sensorDataService.getData();
    console.log("data: ", this.data);
  }

  ngAfterViewInit() {
    this.d3Svg = D3Select.select(this.htmlElem).select('svg');
    this.computeToXY();
    this.draw();
  }

  computeToXY() {
    this.data.forEach((item, i) => {
      if (item.Timestamp != 0) {
        if (i === 0) {
          this.xyData.push({
            timestamp: new Date(item.Timestamp),
            fi: item.Angle,
            x: item.Distance * Math.cos(item.Angle),
            y: item.Distance * Math.sin(item.Angle)
          })
        } else {
          this.xyData.push({
            timestamp: new Date(item.Timestamp),
            fi: this.xyData[i - 1].fi + item.Angle,
            x: this.xyData[i - 1].x + item.Distance * Math.cos(this.xyData[i - 1].fi + item.Angle),
            y: this.xyData[i - 1].y + item.Distance * Math.sin(this.xyData[i - 1].fi + item.Angle)
          })
        }
      }
    });
    console.log("xyData: ", this.xyData);
  }


  draw() {
    // let width = this.htmlElem.children[0].children[0].clientWidth - this.margin.right - this.margin.left;
    // let height = this.htmlElem.children[0].children[0].clientHeight - this.margin.top - this.margin.bottom;
    // let xScale = D3Scale.scaleLinear().range([0, width]).domain(D3Array.extent(this.xyData, d => d.x));
    // let yScale = D3Scale.scaleLinear().range([0, height]).domain(D3Array.extent(this.xyData, d => d.y));
    let width = 450;
    let height = 450;
    let xScale = D3Scale.scaleLinear().range([0, width - this.margin.left - this.margin.right]).domain(D3Array.extent(this.xyData, d => d.x));
    let yScale = D3Scale.scaleLinear().range([0, height - this.margin.top - this.margin.bottom]).domain(D3Array.extent(this.xyData, d => d.y));
    let line = D3Shape.line();

    line = line.x(d => {
      let scaledX = xScale(d["x"]);
      console.log("scaledX: ", scaledX);
      return scaledX;
    });
    line = line.y(d => {
      let scaledY = yScale(d["y"]);
      console.log("scaledY: ", scaledY);
      return scaledY;
    });

    let d3TopG = this.d3Svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    d3TopG.append("path")
      .datum(this.xyData)
      .attr("class", "line")
      .attr("stroke", "#000000")
      .attr("d", line);
  }
}
