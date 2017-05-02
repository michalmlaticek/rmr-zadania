import { Injectable, Inject } from '@angular/core';
import { ScanDataService } from './scan-data.service';
import { MoveDataService } from './move-data.service';
import { IXyScanData, IXySensorData, IXy, ISyncedData, IXyAngleData } from '../interfaces';

@Injectable()
export class MapDataService {
  private syncedData: Array<ISyncedData> = new Array();
  private pureMapData: Array<IXy> = new Array();
  private movesData: Array<IXySensorData> = new Array();

  constructor(
    @Inject(ScanDataService) private scanData: ScanDataService,
    @Inject(MoveDataService) private sensorData: MoveDataService
  ) {
    console.log("scan data: ", this.scanData);
    console.log("sensor data: ", this.sensorData);
    this.syncData();
    this.setMapData();
    this.setMovesData();
  }

  private getXYoffsetAndAngle(xySensorData: Array<IXySensorData>): IXyAngleData {
    let xyOffset: IXyAngleData = { x: 0, y: 0, angle: 0, angleInDegrees: 0 };

    xySensorData.forEach(element => {
      xyOffset.x = element.x;
      xyOffset.y = element.y;
      xyOffset.angle = element.fi;
      xyOffset.angleInDegrees = (element.fi * 180 / Math.PI)
    });

    return xyOffset;
  }

  private getScanDataWithOffset(xyScans: Array<IXy>, xyOffset: IXyAngleData): Array<IXy> {
    let mapDataWithOffset: Array<IXy> = new Array();
    console.log("applying angle: ", xyOffset.angle);
    xyScans.forEach(element => {
      // rotated
      mapDataWithOffset.push({
        x: (element.x * Math.cos(xyOffset.angle) + element.y * (-Math.sin(xyOffset.angle))) + (xyOffset.x),
        y: (element.x * (Math.sin(xyOffset.angle)) + element.y * Math.cos(xyOffset.angle)) + (xyOffset.y)
      });
    });

    return mapDataWithOffset;
  }

  private syncData() {
    let xyScanData = this.scanData.getXYData();
    // console.log("xyScanData: ", xyScanData);

    xyScanData.forEach((element, i) => {
      let xyMoves = this.sensorData.getXYData().filter(item => {
        if (i == 0) {
          return (item.timestamp <= element.timestamp);
        } else {
          return (item.timestamp <= element.timestamp) && (item.timestamp > xyScanData[i - 1].timestamp);
        }
      });
      if (xyMoves.length > 0) {
        let xyOffset: IXyAngleData = this.getXYoffsetAndAngle(xyMoves);
        // console.log("xyOffset: ", xyOffset);
        let scansWithOffset = this.getScanDataWithOffset(element.scans, xyOffset);

        this.syncedData.push({
          xyMoves: xyMoves,
          scan: element,
          xyOffset: xyOffset,
          scanWithOffset: scansWithOffset
        });
      }
    });
  }

  private setMapData() {
    this.syncedData.forEach(element => {
      Array.prototype.push.apply(this.pureMapData, element.scanWithOffset);
    });
  }

  private setMovesData() {
    this.syncedData.forEach(element => {
      Array.prototype.push.apply(this.movesData, element.xyMoves);
    });
  }

  getSyncedData() {
    return this.syncedData;
  }

  getPureMapData() {
    return this.pureMapData;
  }

  getMovesData() {
    return this.movesData;
  }
}
