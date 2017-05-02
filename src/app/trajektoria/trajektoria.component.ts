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

interface IXYValue {
  x?: number;
  y?: number;
  value: number;
  color: string;
}

@Component({
  selector: 'app-trajektoria',
  templateUrl: './trajektoria.component.html',
  styleUrls: ['./trajektoria.component.css']
})
export class TrajektoriaComponent implements AfterViewInit {
  htmlElem: HTMLElement;
  sampleCount: number = 50;
  trajectoryData: Array<Array<IXYValue>> = new Array();
  pureMapData: Array<IXy>;

  domain: number;
  scaleToSampleCount: any;

  tableSize: number;
  cellSize: number;
  fontSize: number;

  startCell: IXYValue;
  endCell: IXYValue;
  cellToBeSet = 's'; // 'e'

  // flood fill specific
  startValueIndicator: number = -2;
  wallIndicator: number = -1;

  path: Array<IXYValue> = new Array();

  constructor(private element: ElementRef,
    @Inject(MapDataService) private mapDataService: MapDataService) {
    this.htmlElem = element.nativeElement;
    this.pureMapData = mapDataService.getPureMapData();
  }

  ngAfterViewInit() {
    this.tableSize = D3Array.min([this.htmlElem.children[0].clientWidth, this.htmlElem.children[0].clientHeight]);
    this.cellSize = this.tableSize / this.sampleCount;
    this.fontSize = this.cellSize * 2 / 3;
    this.initDomain();
    this.scaleToSampleCount = D3Scale.scaleLinear().range([0, this.sampleCount - (this.sampleCount / 6)]).domain([-this.domain, this.domain]);

    this.initTrajectoryData();
  }

  initDomain() {
    let xDomain = D3Array.extent(this.pureMapData, d => d.x);
    let xMax = Math.abs(xDomain[0]) < Math.abs(xDomain[1]) ? Math.abs(xDomain[1]) : Math.abs(xDomain[0]);
    let yDomain = D3Array.extent(this.pureMapData, d => d.y);
    let yMax = Math.abs(yDomain[0]) < Math.abs(yDomain[1]) ? Math.abs(yDomain[1]) : Math.abs(yDomain[0]);
    this.domain = D3Array.max([xMax, yMax]);
  }

  initTrajectoryData() {
    this.trajectoryData = new Array();
    for (let y = 0; y < this.sampleCount; y++) {
      let row: Array<IXYValue> = new Array();
      for (let x = 0; x < this.sampleCount; x++) {
        if (x === 0 || x === (this.sampleCount - 1) || y === 0 || y === (this.sampleCount - 1)) {
          row.push({
            x: x,
            y: y,
            value: this.wallIndicator,
            color: '#121f1f'
          })
        } else {
          row.push({
            x: x,
            y: y,
            value: 0,
            color: '#fff'
          })
        }
      }
      this.trajectoryData.push(row);
    }
    console.log("trajectoryData: ", this.trajectoryData);

    this.pureMapData.forEach(element => {
      let xPosition = Math.round(this.scaleToSampleCount(element.x));
      let yPosition = Math.round(this.scaleToSampleCount(element.y));
      // console.log("x/y: ", xPosition, yPosition);
      this.trajectoryData[yPosition][xPosition] = {
        value: this.wallIndicator,
        color: '#000'
      }
    });

    console.log(this.trajectoryData);
  }

  toD3TrajectoryData(trajectoryArray: Array<Array<number>>): Array<IXYValue> {
    let flatArray: Array<IXYValue> = new Array();

    trajectoryArray.forEach((element, i) => {
      element.forEach((item, j) => {
        flatArray.push({
          x: i,
          y: j,
          value: -1,
          color: '#000'
        });
      });
    });

    return flatArray;
  }

  onCellSelect(cell: IXYValue) {
    if (cell.value !== -1) {
      if (this.cellToBeSet === 's') {
        this.startCell = cell;
        this.cellToBeSet = 'e';
        this.trajectoryData[cell.y][cell.x].color = 'green';
        this.trajectoryData[cell.y][cell.x].value = -2;
      } else {
        this.endCell = cell;
        this.cellToBeSet = 's';
        this.trajectoryData[cell.y][cell.x].color = 'red';
        this.trajectoryData[cell.y][cell.x].value = 1;
      }
    }
  }

  wasEndReached = false;
  recursionCounter = 0;

  onRunFloodFill() {
    console.log("Starting flood fill algorithm");
    // this.floodFill(this.trajectoryData[this.endCell.y][this.endCell.x], 1);
    this.floodFill();
    this.populatePath();
  }

  floodFill() {
    let Q: Array<IXYValue> = new Array();
    Q.push(this.trajectoryData[this.endCell.y][this.endCell.x]);

    while (Q.length > 0) {
      let activeCell = Q[0];
      Q.splice(0, 1);

      // check north
      if (this.trajectoryData[activeCell.y - 1][activeCell.x].value == this.startValueIndicator) { // we found start, so end.
        return;
      } else if (this.trajectoryData[activeCell.y - 1][activeCell.x].value == 0) {
        this.trajectoryData[activeCell.y - 1][activeCell.x].value = activeCell.value + 1;
        this.trajectoryData[activeCell.y - 1][activeCell.x].color = "blue";
        Q.push(this.trajectoryData[activeCell.y - 1][activeCell.x]);
      }

      // check west
      if (this.trajectoryData[activeCell.y][activeCell.x - 1].value == this.startValueIndicator) { // we found start, so end.
        return;
      } else if (this.trajectoryData[activeCell.y][activeCell.x - 1].value == 0) {
        this.trajectoryData[activeCell.y][activeCell.x - 1].value = activeCell.value + 1;
        this.trajectoryData[activeCell.y][activeCell.x - 1].color = "blue";
        Q.push(this.trajectoryData[activeCell.y][activeCell.x - 1]);
      }

      // check south
      if (this.trajectoryData[activeCell.y + 1][activeCell.x].value == this.startValueIndicator) { // we found start, so end.
        return;
      } else if (this.trajectoryData[activeCell.y + 1][activeCell.x].value == 0) {
        this.trajectoryData[activeCell.y + 1][activeCell.x].value = activeCell.value + 1;
        this.trajectoryData[activeCell.y + 1][activeCell.x].color = "blue";
        Q.push(this.trajectoryData[activeCell.y + 1][activeCell.x]);
      }

      // check east
      if (this.trajectoryData[activeCell.y][activeCell.x + 1].value == this.startValueIndicator) { // we found start, so end.
        return;
      } else if (this.trajectoryData[activeCell.y][activeCell.x + 1].value == 0) {
        this.trajectoryData[activeCell.y][activeCell.x + 1].value = activeCell.value + 1;
        this.trajectoryData[activeCell.y][activeCell.x + 1].color = "blue";
        Q.push(this.trajectoryData[activeCell.y][activeCell.x + 1]);
      }
    }
  }

  private populatePath() {
    // find path
    let activePathCell = this.startCell;
    do {
      activePathCell = this.getFirstMinNeighbour(activePathCell);
      this.path.push(activePathCell);
      this.trajectoryData[activePathCell.y][activePathCell.x].color = "yellow";
    } while (activePathCell.value > 1 + 1) // stop one cycle before the end point
    console.log("path: ", this.path);
  }

  private getFirstMinNeighbour(cell: IXYValue): IXYValue {
    let neighbour: IXYValue;
    if (this.trajectoryData[cell.y - 1][cell.x].value > 0) {
      neighbour = this.trajectoryData[cell.y - 1][cell.x];
    }
    if (this.trajectoryData[cell.y][cell.x - 1].value > 0) {
      if (!neighbour || neighbour.value > this.trajectoryData[cell.y][cell.x - 1].value) {
        neighbour = this.trajectoryData[cell.y][cell.x - 1];
      }
    }
    if (this.trajectoryData[cell.y + 1][cell.x].value > 0) {
      if (!neighbour || neighbour.value > this.trajectoryData[cell.y + 1][cell.x].value) {
        neighbour = this.trajectoryData[cell.y + 1][cell.x];
      }
    }
    if (this.trajectoryData[cell.y][cell.x + 1].value > 0) {
      if (!neighbour || neighbour.value > this.trajectoryData[cell.y][cell.x + 1].value) {
        neighbour = this.trajectoryData[cell.y][cell.x + 1];
      }
    }

    return neighbour;
  }
}
