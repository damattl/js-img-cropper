interface SaveImageOptions {
    image: {
        format?: string;
        quality?: number;
    };
}
export declare class ImageCropper {
    private canvas;
    private controller;
    private context;
    constructor(canvas: HTMLCanvasElement);
    save({ image }?: SaveImageOptions): Promise<Blob>;
    load(file: File): Promise<boolean>;
}
export {};
//# sourceMappingURL=crop.d.ts.map