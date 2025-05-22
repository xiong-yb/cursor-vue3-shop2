declare namespace AMap {
  class Map {
    constructor(container: HTMLElement, options: MapOptions)
    add(overlay: any): void
  }

  class Marker {
    constructor(options: MarkerOptions)
    getPosition(): LngLat
    on(event: string, callback: () => void): void
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions)
    open(map: Map, position: LngLat): void
  }

  class LngLat {
    constructor(lng: number, lat: number)
  }

  class Pixel {
    constructor(x: number, y: number)
  }

  interface MapOptions {
    zoom?: number
    center?: [number, number]
  }

  interface MarkerOptions {
    position: [number, number]
    title?: string
  }

  interface InfoWindowOptions {
    content: string
    offset?: Pixel
  }
} 