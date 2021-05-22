// @ts-ignore
import * as d3 from 'd3';
// @ts-ignore
import geoZoom from 'd3-geo-zoom';
import {UserViewModel} from '../../../shared/state/users/users.store';

export type Globe = { node: any; updateProjection:
    (lng: number, lat: number) => void; updateUsers: (topojsonUsers: any) => void };

export const generateMap: (context: CanvasRenderingContext2D, land: any, users: any) => Globe =
  (context: CanvasRenderingContext2D, land, tusers) => {

    const getQuadtree = () => {
      return d3.quadtree().extent([[0, 0], [width, width]]);
    };

    const width = 300;
    const longitude = 50;
    const latitude = 50;

    const graticule = d3.geoGraticule10();
    const projection = d3.geoOrthographic()
      .rotate([longitude, -20])
      .translate([width / 2, width / 2])
      .fitExtent([[5, 5], [width - 5, width - 5]], {type: 'Sphere'})
      .precision(0.1);

    const users = tusers ? tusers : {features: []};

    // just pass the canvas
    const container: any = d3.select(context.canvas.parentNode as HTMLElement);
    const tooltip = container.append('div').attr('id', 'tooltip');
    const height = context.canvas.height;
    const originalScale = height / 2.1;
    const sphere = {type: 'Sphere'};
    const path = d3.geoPath(projection, context);
    let tooltipQuadtree = getQuadtree();
    let tooltipPositions: any[] = [];
    let tooltipPositionsIndex: { [coordinate: string]: number } = {};
    let userFeatures: any = users.features;

    /**
     * After each zoom/pan projection recalculation, force the svg(really canvas) paths to update
     */
    function drawWorld(): void {
      context.clearRect(0, 0, 500, 500);
      context.beginPath();
      path(graticule);
      context.lineWidth = .4;
      context.strokeStyle = '#ccc';
      context.stroke();
      context.beginPath();
      path(land);
      context.fillStyle = '#888';
      context.fill();
      context.strokeStyle = '#fff';
      context.lineWidth = .3;
      context.stroke();
      context.beginPath(), path(sphere), context.strokeStyle = '#333';
      context.stroke();

      // set up the points
      path.pointRadius(3.5);
      userFeatures.forEach((d: any) => {
        context.beginPath();
        context.fillStyle = 'blue';
        path(d);
        context.fill();
      });

      // reset the tooltip caches
      tooltipPositions = [];
      tooltipPositionsIndex = {};
      tooltipQuadtree = getQuadtree();

      // update tooltip caches
      for (let i = 0, len = userFeatures.length; i < len; i++) {
        const pixelCoords = projection(userFeatures[i].geometry.coordinates);
        tooltipPositions.push(pixelCoords);
        tooltipPositionsIndex[pixelCoords.join(',')] = userFeatures[i].properties.screenName;
      }

      // update the quadtree
      tooltipQuadtree.addAll(tooltipPositions);

      // hide the tooltip if the map is being zoomed/panned
      d3.select('#tooltip').style('opacity', 0);
    }

    /**
     * Every time the globe is zoomed or panned, recalculate the correct projection parameters
     * and then request that the map data be redrawn/updated
     */
    geoZoom()
      .projection(projection)
      .northUp(true)
      .onMove(drawWorld)
      (d3.select(context.canvas).node());

// initiate the first globe draw
    drawWorld();

// bind the tooltips (use d3.event) instead
    d3.select(context.canvas).on('mousemove click', function(): void {
      // @ts-ignore
      const mouse = d3.pointer(this);
      // console.log(mouse);
      /*
      const closest = tooltipQuadtree.find(mouse[0], mouse[1], 10);

      if (closest) {
        d3.select('#tooltip')
          .style('opacity', 0.8)
          .style('top', mouse[1] + 5 + 'px')
          .style('left', mouse[0] + 5 + 'px')
          .html('@' + tooltipPositionsIndex[closest.join(',')]);
      } else {
        d3.select('#tooltip')
          .style('opacity', 0);
      }*/
    });

    const updateProjection = (lng: number, lat: number) => {
      console.log(lng, lat);
      // math explanation on why we need to negate numbers ?
      projection.rotate([-lng, -lat]);
      drawWorld();
    };
    const updateUsers = (topoJsonUsers: any) => {
      userFeatures = topoJsonUsers.features;
      drawWorld();
    };

    return {
      node: container.node(),
      updateProjection,
      updateUsers
    };
  };



