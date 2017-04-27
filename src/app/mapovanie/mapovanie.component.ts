import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { ISensorData } from '../i-sensor-data';
import { SensorDataService } from '../sensor-data.service';
import { IScanData, IScan } from '../i-scan-data';
import { ScanDataService } from '../scan-data.service';

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
  scanData: Array<IScanData>;
  sensorData: Array<ISensorData>;
  sincedData: Array<any>;
  d3Svg: any;

  margin = {
    left: 5,
    right: 5,
    top: 5,
    bottom: 5
  }

  constructor(private element: ElementRef,
    private scanDataService: ScanDataService,
    private sensorDataService: SensorDataService) {
    this.htmlElem = element.nativeElement;
    this.scanData = scanDataService.getData();
    this.sensorData = sensorDataService.getData();
    this.sincDataSets();
  }

  ngAfterViewInit() {
    this.d3Svg = D3Select.select(this.htmlElem).select('svg');
    this.draw();
  }

  draw() {

  }

  sincDataSets() {
    console.log("scan data length: ", this.scanData.length);
    console.log("sensor data length: ", this.sensorData.length);
  }

}
