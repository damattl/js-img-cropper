import { centerToLT, getDimensionOffsetLT, ltToCenter, scaleImageToFit } from "./transform";

function loadImage(src: string): Promise<HTMLImageElement> {
    const image = new Image();

    return new Promise((resolve) => {
        image.onload = () => {
            resolve(image)
        };
        image.src = src;
    });
}

function applyZoom(event: WheelEvent, value: number): number {
    event.preventDefault();

    value += event.deltaY * 0.01;
    value = Math.min(Math.max(1.0, value), 5);

    return value;
}


class TopBoundary {
    y: number;

    constructor(y: number) {
        this.y = y
    }

    toBottomBoundary(): BottomBoundary {
        return new BottomBoundary(-this.y);
    }

    remaining(y: number) {
        return this.y - y
    }

    hasRemaining(y: number): boolean {
        return this.remaining(y) >= 0
    }
}

class BottomBoundary {
    y: number;

    constructor(y: number) {
        this.y = y
    }

    toTopBoundary(): TopBoundary {
        return new TopBoundary(-this.y);
    }

    remaining(y: number, h: number): number {
        return (y + h) - this.y
    }

    hasRemaining(y: number, h: number): boolean {
        return this.remaining(y, h) >= 0
    }
}

class LeftBoundary {
    x: number;

    constructor(x: number) {
        this.x = x
    }

    toRightBoundary(): RightBoundary {
        return new RightBoundary(-this.x);
    }

    remaining(x: number) {
        return this.x - x;
    }

    hasRemaining(x: number): boolean {
        return this.remaining(x) >= 0;
    }
}

class RightBoundary {
    x: number;

    constructor(x: number) {
        this.x = x
    }

    toLeftBoundary(): LeftBoundary {
        return new LeftBoundary(-this.x);
    }

    remaining(x: number, w: number) {
        return (x + w) - this.x
    }

    hasRemaining(x: number, w: number): boolean {
        return this.remaining(x, w) >= 0
    }
}


class ImageContext {
    private _scale: number = 1.0
    private _w: number;
    private _h: number;
    private _x: number;
    private _y: number;


    private ctx: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private image: HTMLImageElement;

    constructor(image: HTMLImageElement, canvas: HTMLCanvasElement) {
        let [w, h] = scaleImageToFit(image.naturalWidth, image.naturalHeight, canvas)
        console.log(getDimensionOffsetLT(w, h, canvas))
        let [x, y] = ltToCenter(canvas, getDimensionOffsetLT(w, h, canvas))

        this._w = w;
        this._h = h;
        this._x = x;
        this._y = y;

        this.image = image;

        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d")
    }

    public get scale() {
        return this._scale;
    }

    public set scale(scale: number) {
        this._scale = scale;
    }

    public get w() {
        return this._w * this._scale;
    }

    public get h() {
        return this._h * this._scale;
    }

    public get x() {
        return this._x * this._scale;
    }

    public get y() {
        return this._y * this._scale;
    }

    public set x(x: number) {
        this._x = x / this._scale;
    }

    public set y(y: number) {
        this._y = y / this._scale;
    }

    public destroy(): void {
        console.log("Destroy called")
        console.debug("Destroy called")
        this.ctx.reset();
        this.image.src = null;
    }

    public redraw() {
        const [tx, ty] = centerToLT(this.canvas, [this.x, this.y])
        console.log("[tx, ty]", [tx, ty])

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, tx, ty, this.w, this.h);
    }

/*    public redraw(dx: number, dy: number, w: number, h: number, image: CanvasImageSource) {
        console.log("[dx, dy]", [dx, dy])
        console.log("Scale", this._scale)
        const [tx, ty] = centerToLT(canvas, [dx, dy])
        console.log("[tx, ty]", [tx, ty])

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, tx, ty, w, h);
    }*/
}



function initDrag(canvas: HTMLCanvasElement, image: HTMLImageElement): [context: ImageContext, controller: AbortController] {
    let isDown = false;

    const controller = new AbortController()
    const signal = controller.signal

    let img = new ImageContext(image, canvas)

    console.log("[img.x, img.y]", img.x, img.y)

    const rb = new RightBoundary(canvas.width * 0.5);
    const lb = rb.toLeftBoundary();

    const bb = new BottomBoundary(canvas.height * 0.5);
    const tb = bb.toTopBoundary();

    console.log(lb.x, rb.x, tb.y, bb.y)
    console.log("W, H", img.w, img.h)

    const onMouseDown = (event: MouseEvent) => {
        console.log("DOWN")
        isDown = true;

        console.log(canvas.getBoundingClientRect())

        const X = event.pageX - event.offsetX;
        const Y = event.pageY - event.offsetY;

        console.log(event.pageX, event.pageY);
        console.log(event.offsetX, event.offsetY)
        console.log(X, Y);
    }

    const onMouseMove = (event: MouseEvent) => {
        // console.log(ltToCenter(canvas, clientToElement(canvas, [event.clientX, event.clientY])))
        if (!isDown) {
            return;
        }

        const [mouseX, mouseY] = [event.movementX, event.movementY]
        console.log(mouseX, mouseY)

        console.log("PrevX, PrevY", img.x, img.y)
        console.log("Width, Height", img.w, img.h)

        const nextX = img.x + mouseX;

        if (lb.hasRemaining(nextX) && rb.hasRemaining(nextX, img.w)) {
            img.x = nextX
        }

        const nextY = img.y + mouseY;
        if (tb.hasRemaining(nextY) && bb.hasRemaining(nextY, img.h)) {
            img.y = nextY
        }


        console.log("NextX, NextY", nextX, nextY)

        img.redraw();
    }

    const onRescale = (event: WheelEvent) => {
        if ((event.target as HTMLElement).tagName.toUpperCase() == "CANVAS") {
            console.log(event.deltaY, event.deltaZ)

            img.scale = applyZoom(event, img.scale)

            if (!tb.hasRemaining(img.y)) {
                img.y = tb.y
            }

            if (!bb.hasRemaining(img.y, img.h)) {
                img.y = bb.y
            }

            if (!lb.hasRemaining(img.x)) {
                img.x = lb.x
            }

            if (!rb.hasRemaining(img.x, img.w)) {
                img.x = rb.x
            }

            img.redraw()
        }
    }


    canvas.onmousedown = onMouseDown
    window.addEventListener("mousemove", onMouseMove, { signal })

    window.addEventListener("mouseup", () => {
        isDown = false;
    }, { signal })

    img.redraw()

    window.addEventListener('wheel', (event) => {
      if (event.ctrlKey) {
          event.preventDefault(); // Prevents browser zoom
          onRescale(event)
      }
    }, { passive: false, signal });

    window.addEventListener('touchmove', (event) => {
      if (event.touches.length > 1) {
          event.preventDefault();
          // TODO: Handle Touch
      }
    }, { passive: false, signal });

    return [img, controller]
}


interface CroppingToolOptions {
    canvasId?: string
    saveButtonId?: string
    uploadInputId?: string
    image: {
        format?: string
        quality?: number
    }
}

const CroppingToolOptionDefaults: CroppingToolOptions = {
    image: {
        format: "jpeg",
        quality: 0.95,
    },
    canvasId: "crop-canvas",
    saveButtonId: "save",
    uploadInputId: "upload"
}

export function initCroppingTool(
    onSave: (blob: Blob, clear: () => void) => void,
    onLoading?: (start: boolean, done: boolean) => void,
    options: CroppingToolOptions = CroppingToolOptionDefaults
) {
    // TODO: Ensure valid defaults
    let canvas = document.getElementById(options.canvasId) as HTMLCanvasElement;

    let controller: AbortController | undefined | null = null;
    let context: ImageContext | undefined | null = null;

    const saveButton = document.getElementById(options.saveButtonId) as HTMLButtonElement
    saveButton.addEventListener("click", () => {
        canvas.toBlob((blob) => {
            onSave(blob, () => {
                controller?.abort();
                context?.destroy();
                controller = null;
                context = null;
            })
        }, `image/${options.image.format}`, options.image.quality)
    })

    const uploadForm = document.querySelector(`input#${options.uploadInputId}`) as HTMLInputElement
    uploadForm.addEventListener("change", async () => {
        if (uploadForm.files.length === 1) {
            console.log("File selected: ", uploadForm.files[0]);
            const file = uploadForm.files[0]

            const promise = loadImage(URL.createObjectURL(file));
            onLoading(true, false)
            const img = await promise;
            onLoading(false, true) // TODO: Use promise

            if (controller) {
                console.log("Clearing existing controller")
                controller?.abort("New image selected")
                controller = null;
                context?.destroy();
                context = null;
            }

            const res = initDrag(canvas, img)
            context = res[0]
            controller = res[1]

            console.log("Init done!")

        }
    })

}
