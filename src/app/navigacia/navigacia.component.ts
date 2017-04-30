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

import { IScanData, IScan, IXyScanData, IXy } from '../interfaces';
import { ScanDataService } from '../scan-data.service';

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

  startXY: IXy;
  endXY: IXy;
  pointTypeToBeSet = 's'

  margin = {
    left: 5,
    right: 5,
    top: 5,
    bottom: 5
  }

  constructor(private element: ElementRef,
    private scanDataService: ScanDataService) {
    this.htmlElem = element.nativeElement;
    this.rawData = scanDataService.getRawData();
    this.xyScanData = scanDataService.getXYData();
  }

  ngAfterViewInit() {
    this.d3Svg = D3Select.select(this.htmlElem).select('svg');
  }

  drawStep(data: Array<IXy>) {
    // let width = this.htmlElem.children[0].children[0].clientWidth - this.margin.right - this.margin.left;
    // let height = this.htmlElem.children[0].children[0].clientHeight - this.margin.top - this.margin.bottom;
    let width = 450;
    let height = 450;
    let xScale = D3Scale.scaleLinear().range([-width / 2, width / 2]).domain([-220, 220]);
    let yScale = D3Scale.scaleLinear().range([-height / 2, height / 2]).domain([-220, 220]);
    let robotR = 15;
    let robotRScaled = xScale(robotR);

    this.d3Svg.selectAll('.top-g').remove();

    let d3TopG = this.d3Svg.append('g').attr('class', 'top-g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    // drow robot
    d3TopG.selectAll("circle")
      .data([0]) // always draw robot in the center
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
      .attr("cx", d => { return xScale(d.x); })
      .attr("cy", d => { return yScale(d.y); })
      .attr("r", "1px")
      .attr("fill", "#000000");
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
    if (this.pointTypeToBeSet === 's') {
      this.startXY = { x: event.x, y: event.y };
      this.pointTypeToBeSet = 'e';
      console.log("start point: ", this.startXY);
    } else {
      this.endXY = { x: event.x, y: event.y };
      this.pointTypeToBeSet = 's';
      console.log("end point: ", this.endXY);
    }
  }

  drawPossiblePaths() {
    let topG = this.d3Svg.select('.top-g');
  }
}
