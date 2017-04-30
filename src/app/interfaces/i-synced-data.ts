import { IXy } from './i-xy';
import { IXySensorData } from './i-xy-sensor-data';
import { IXyScanData } from './i-xy-scan-data';
import { IXyAngleData } from './i-xy-angle-data';

export interface ISyncedData {
    xyMoves: Array<IXySensorData>;
    scan: IXyScanData;
    xyOffset: IXyAngleData;
    scanWithOffset: Array<IXy>;
}