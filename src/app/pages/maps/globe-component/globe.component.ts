import {AfterViewInit, Component, ElementRef, Input, NgZone, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {generateMap, Globe} from './d3-map';
// @ts-ignore
import * as d3 from 'd3';
// @ts-ignore
import * as topojson from 'topojson-client';

@Component({
  selector: 'app-globe',
  templateUrl: './globe.component.html',
  styleUrls: ['./globe.component.scss']
})
export class GlobeComponent implements AfterViewInit, OnChanges {

  @ViewChild('canvas')
  private readonly canvas!: ElementRef;
  private globe!: Globe;

  @Input() longitude = 20;
  @Input() latitude = 20;
  @Input() users: any = { features: []};

  constructor(private readonly zone: NgZone) {

  }


  ngAfterViewInit(): void {
    const ctx = (this.canvas.nativeElement as HTMLCanvasElement).getContext('2d');

    if (ctx) {
      const world = d3.json('https://unpkg.com/world-atlas@1/world/110m.json').then((w: any) => {
        const land = topojson.feature(w, w.objects.countries);
        console.log(world, land);
        this.zone.runOutsideAngular(() => {
          this.globe = generateMap(ctx, land, this.users);
        });
      });
    } else {
      console.warn('Unable to render globe as no canvas context, you might in a headless env');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.users) {
      if (changes.users.firstChange) {
        // discard as globe is not ready
      } else {
        if (this.globe) {
          this.globe.updateUsers(changes.users.currentValue);
        }
      }
    }
    if (changes.longitude) {
      if (!changes.longitude.firstChange) {
        if (this.globe) {
          this.globe.updateProjection(this.longitude, this.latitude);
        }
      }
    }
  }
}
