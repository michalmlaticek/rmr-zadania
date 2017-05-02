import { Component, AfterViewInit, ElementRef, Inject } from '@angular/core';
import { ISensorData, IScanData, IScan, ISyncedData, IXy, IXySensorData } from '../interfaces';
import { MapDataService } from '../services';

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

@Component({
  selector: 'app-mapovanie',
  templateUrl: './mapovanie.component.html',
  styleUrls: ['./mapovanie.component.css']
})
export class MapovanieComponent implements AfterViewInit {

  htmlElem: HTMLElement;
  syncedData: Array<ISyncedData>;
  pureMapData: Array<IXy>;
  movesData: Array<IXySensorData>;
  d3Svg: any;

  margin = 10;

  constructor(
    @Inject(ElementRef) private element: ElementRef,
    @Inject(MapDataService) private mapDataService: MapDataService) {
    this.htmlElem = element.nativeElement;
    this.syncedData = mapDataService.getSyncedData();
    this.pureMapData = mapDataService.getPureMapData();
    this.movesData = mapDataService.getMovesData();
  }

  ngAfterViewInit() {
    this.d3Svg = D3Select.select(this.htmlElem).select('svg');
    this.drawMap();
  }

  drawMap() {
    let mapData = this.pureMapData;
    let movesData = this.movesData;

    let width = this.htmlElem.children[0].children[0].clientWidth;
    let height = this.htmlElem.children[0].children[0].clientHeight;
    let svgSize = D3Array.min([width, height]);
    let xDomain = D3Array.extent(mapData, d => d.x);
    let xMax = Math.abs(xDomain[0]) < Math.abs(xDomain[1]) ? Math.abs(xDomain[1]) : Math.abs(xDomain[0]);
    let yDomain = D3Array.extent(mapData, d => d.y);
    let yMax = Math.abs(yDomain[0]) < Math.abs(yDomain[1]) ? Math.abs(yDomain[1]) : Math.abs(yDomain[0]);
    let domainMax = D3Array.max([xMax, yMax]);
    console.log("domainMax: ", domainMax);
    let scale = D3Scale.scaleLinear().range([-svgSize / 2 + this.margin, svgSize / 2 - this.margin]).domain([-domainMax, domainMax]);

    this.d3Svg.selectAll('.map-group').remove();
    let d3TopG = this.d3Svg.append('g').attr('class', 'map-group').attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    d3TopG.append('g').attr('class', 'map-moves').selectAll("circle")
      .data(movesData) // always draw robot in the center
      .enter()
      .append("circle")
      .attr("cx", d => { return scale(d.x); })
      .attr("cy", d => { return scale(d.y); })
      .attr("r", 1 + "px")
      .attr("fill", "blue");

    d3TopG.append('g').attr('class', 'map-vals').selectAll("circle")
      .data(mapData)
      .enter()
      .append("circle")
      .attr("cx", d => { return scale(d.x); })
      .attr("cy", d => { return scale(d.y); })
      .attr("r", "1px")
      .attr("fill", "#000000");
  }

  drawPartOfMap(idOfSyncedData: number) {
    let mapData: Array<IXy> = new Array();
    let moves: Array<IXySensorData> = new Array();
    let syncedDataSlice = this.syncedData.slice(0, idOfSyncedData + 1);
    console.log("sliced sync data: ", syncedDataSlice);

    syncedDataSlice.forEach(element => {
      console.log("element.scanWithOffcet: ", element.scanWithOffset);
      Array.prototype.push.apply(mapData, element.scanWithOffset);
      Array.prototype.push.apply(moves, element.xyMoves);
    });

    let width = this.htmlElem.children[0].children[0].clientWidth;
    let height = this.htmlElem.children[0].children[0].clientHeight;
    let svgSize = D3Array.min([width, height]);
    let xDomain = D3Array.extent(this.pureMapData, d => d.x);
    let xMax = Math.abs(xDomain[0]) < Math.abs(xDomain[1]) ? Math.abs(xDomain[1]) : Math.abs(xDomain[0]);
    let yDomain = D3Array.extent(this.pureMapData, d => d.y);
    let yMax = Math.abs(yDomain[0]) < Math.abs(yDomain[1]) ? Math.abs(yDomain[1]) : Math.abs(yDomain[0]);
    let domainMax = D3Array.max([xMax, yMax]);
    console.log("domainMax: ", domainMax);

    let scale = D3Scale.scaleLinear().range([-svgSize / 2 + this.margin, svgSize / 2 - this.margin]).domain([-domainMax, domainMax]);

    this.d3Svg.selectAll('.map-group').remove();
    let d3TopG = this.d3Svg.append('g').attr('class', 'map-group').attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

    d3TopG.selectAll("circle")
      .data(moves) // always draw robot in the center
      .enter()
      .append("circle")
      .attr("cx", d => { return scale(d.x); })
      .attr("cy", d => { return scale(d.y); })
      .attr("r", 2 + "px")
      .attr("fill", "blue");

    d3TopG.selectAll("circle")
      .data(mapData)
      .enter()
      .append("circle")
      .attr("cx", d => { return scale(d.x); })
      .attr("cy", d => { return scale(d.y); })
      .attr("r", "1px")
      .attr("fill", "#000000");
  }

  onMove(i: number) {
    setTimeout(() => {
      this.drawPartOfMap(i);
      if (i < this.syncedData.length - 1) {
        this.onMove(i + 1);
      }
    }, 200);
  }
}
