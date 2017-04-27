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

import { IScanData, IScan } from '../i-scan-data';
import { ScanDataService } from '../scan-data.service';

@Component({
  selector: 'app-navigacia',
  templateUrl: './navigacia.component.html',
  styleUrls: ['./navigacia.component.css']
})
export class NavigaciaComponent implements AfterViewInit {
  htmlElem: HTMLElement;
  data: Array<IScanData>;
  // xyData: Array<IXyData> = new Array<IXyData>();
  d3Svg: any;

  margin = {
    left: 5,
    right: 5,
    top: 5,
    bottom: 5
  }

  constructor(private element: ElementRef,
    private scanDataService: ScanDataService) {
    this.htmlElem = element.nativeElement;
    this.data = scanDataService.getData();
  }

  ngAfterViewInit() {
    this.d3Svg = D3Select.select(this.htmlElem).select('svg');
    // this.drawStep(this.data[5].Scans);
  }

  drawStep(data: Array<IScan>) {

    // let width = this.htmlElem.children[0].children[0].clientWidth - this.margin.right - this.margin.left;
    // let height = this.htmlElem.children[0].children[0].clientHeight - this.margin.top - this.margin.bottom;
    let width = 450;
    let height = 450;
    let xScale = D3Scale.scaleLinear().range([0, width / 2]).domain([0, 220]);
    let yScale = D3Scale.scaleLinear().range([0, height / 2]).domain([0, 220]);
    let robotR = 15;
    let robotRScaled = xScale(robotR);

    this.d3Svg.selectAll('.top-g').remove();

    let d3TopG = this.d3Svg.append('g').attr('class', 'top-g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    // drow robot
    d3TopG.selectAll("circle")
      .data([0])
      .enter()
      .append("circle")
      .attr("cx", d => { return d })
      .attr("cy", d => { return d })
      .attr("r", robotR + "px")
      .attr("fill", "blue");

    d3TopG.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => { return xScale(d.distance * Math.cos(d.angle / 180 * Math.PI)) })
      .attr("cy", d => { return yScale(d.distance * Math.sin(d.angle / 180 * Math.PI)) })
      .attr("r", "1px")
      .attr("fill", "#000000");
  }

  onScanSelect(i: number) {
    this.drawStep(this.data[i].Scans);
  }

}
