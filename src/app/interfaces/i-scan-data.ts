export interface IScan {
    distance: number;
    angle: number;
}

export interface IScanData {
    TimeStamp: number;
    Scans: Array<IScan>;
}


