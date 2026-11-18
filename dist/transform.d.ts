export type Coordinates = [x: number, y: number];
export type Dimensions = [w: number, h: number];
export declare function clientToElement(element: HTMLElement, [x, y]: Coordinates): Coordinates;
export declare function elementToClient(element: HTMLElement, [x, y]: Coordinates): Coordinates;
export declare function centerToLT(dimSource: Dimensions, [x, y]: Coordinates): Coordinates;
export declare function centerToLT(dimSource: HTMLElement, [x, y]: Coordinates): Coordinates;
export declare function ltToCenter(dimSource: Dimensions, [x, y]: Coordinates): Coordinates;
export declare function ltToCenter(dimSource: HTMLElement, [x, y]: Coordinates): Coordinates;
export declare function scaleImageToFit(width: number, height: number, container: HTMLElement): Coordinates;
export declare function scaleDimToFit(image: HTMLImageElement, container: HTMLElement): Coordinates;
export declare function getDimensionOffsetLT(width: number, height: number, element: HTMLElement): Coordinates;
export declare function relativeMouseLT(element: HTMLElement, event: MouseEvent): [number, number];
export declare function relativeMouseCenter(element: HTMLElement, event: MouseEvent): [number, number];
//# sourceMappingURL=transform.d.ts.map