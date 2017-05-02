import { IXyAngleData } from './i-xy-angle-data';

export interface IXyScanData {
    timestamp: number;
    scans: Array<IXyAngleData>;
}
