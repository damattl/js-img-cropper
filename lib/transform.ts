export type Coordinates = [x: number, y: number];
export type Dimensions = [w: number, h: number];

export function clientToElement(element: HTMLElement, [x, y]: Coordinates): Coordinates {
    const rect = element.getBoundingClientRect();

    x = x - rect.left;
    y = y - rect.top;

    return [x, y]
}

export function elementToClient(element: HTMLElement, [x, y]: Coordinates): Coordinates {
    const rect = element.getBoundingClientRect();

    x = x + rect.left;
    y = y + rect.top;

    return [x, y]
}

export function centerToLT(dimSource: Dimensions, [x, y]: Coordinates): Coordinates;
export function centerToLT(dimSource: HTMLElement, [x, y]: Coordinates): Coordinates;
export function centerToLT(dimSource: HTMLElement | Dimensions, [x, y]: Coordinates): Coordinates {
    let width: number;
    let height: number;

    if (Array.isArray(dimSource)) {
        [width, height] = dimSource;
    } else {
        width = dimSource.clientWidth;
        height = dimSource.clientHeight;
    }

    const newX = x + width * 0.5;
    const newY = y + height * 0.5;

    return [newX, newY];
}

export function ltToCenter(dimSource: Dimensions, [x, y]: Coordinates): Coordinates;
export function ltToCenter(dimSource: HTMLElement, [x, y]: Coordinates): Coordinates;
export function ltToCenter(dimSource: HTMLElement | Dimensions, [x, y]: Coordinates): Coordinates {
    let width: number;
    let height: number;

    if (Array.isArray(dimSource)) {
        [width, height] = dimSource;
    } else {
        width = dimSource.clientWidth;
        height = dimSource.clientHeight;
    }

    x = x - width * 0.5;
    y = y - height * 0.5;

    return [x, y]
}

export function scaleImageToFit(width: number, height: number, container: HTMLElement): Coordinates {
    if (height < width) {
        const h = container.clientHeight;
        const w = width * (container.clientHeight / height)

        return [w, h]
    } else {
        const w = container.clientWidth;
        const h = height * (container.clientWidth / width)

        return [w, h]
    }
}

export function scaleDimToFit(image: HTMLImageElement, container: HTMLElement): Coordinates {
    return scaleImageToFit(image.naturalWidth, image.naturalHeight, container)
}


export function getDimensionOffsetLT(width: number, height: number, element: HTMLElement): Coordinates {
    return [(element.clientWidth - width) * 0.5, (element.clientHeight - height) * 0.5];
}


export function relativeMouseLT(element: HTMLElement, event: MouseEvent): [number, number] {
    const rect = element.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return [x, y]
}

export function relativeMouseCenter(element: HTMLElement, event: MouseEvent): [number, number] {
    return ltToCenter(element, clientToElement(element, [event.clientX, event.clientY]))
}
