import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { PanZoom } from 'react-easy-panzoom'

function Graph(props) {

  const graph = useRef(null);

  useEffect(() => {
    initGraph();
  });

  function zoom(event, svg) {
    svg.attr("transform", "translate(" 
        + event.translate 
        + ")scale(" + event.scale + ")");
}

  function initGraph() {
    const ticks = [];
    for (let i = -24; i <= 32; i++) {
      ticks.push( { value: i, isVisible: i % 8 === 0 });
    }
    const tickValuesX = ticks.map( function(t) { return t.value; });
    const tickValuesY = ticks.map( function(t) { if(t.value >= -16 && t.value <= 16) return t.value; });
    const isMajorTick = function (index) {
      return ticks[index].isVisible;
    }
    const margin = {top: 10, right: 20, bottom: 30, left: 30};
    const {width: totalWidth} = graph.current.getBoundingClientRect();
    const totalHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    const width = totalWidth - margin.right - 30;
    const height = totalHeight - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const sVg = d3.select("#graph")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .call(d3.zoom().scaleExtent([1, 10])  
        .on("zoom", e => zoom(e, sVg)) )
      // translate this svg element to leave some margin.
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // X scale and Axis
    const x = d3.scaleLinear()
        .domain([-24, 32])         // This is the min and the max of the data: 0 to 100 if percentages
        .range([0, width]);       // This is the corresponding value I want in Pixel
    
    // sVg
    //   .append('rect')
    //   .attr('width', width + 50)
    //   .attr('height', 25)
    //   .attr('fill', '#6a7177')
    //   .attr("transform", "translate(-25," + -10 + ")")
    const xAxis = sVg
      .append('g')
      .attr("transform", "translate(0," + 15 + ")")
      .call(d3.axisTop(x)
        .tickSize(10)
        .tickPadding(5)
        .tickValues(tickValuesX)
        .tickFormat(function (d, i) {
          return isMajorTick(i) ? d : "";
        })
      );
    
    xAxis.selectAll('g')
      .filter(function (d, i) {
        return !isMajorTick(i);
      })
      .attr('stroke', '#777')
      .attr('stroke-width', '1px')
      .attr('stroke-dasharray', '6,4');
    // X scale and Axis
    const y = d3.scaleLinear()
        .domain([16, -16])         // This is the min and the max of the data: 0 to 100 if percentages
        .range([height, 0]);       // This is the corresponding value I want in Pixel
    // sVg
    //   .append('rect')
    //   .attr('width', 25)
    //   .attr('height', height + 10)
    //   .attr('fill', '#6a7177')
    //   .attr("transform", "translate(-25, 0)")
    const yAxis = sVg
      .append('g')
      .attr("transform", "translate(0,15)")
      .call(d3.axisLeft(y)
        .tickSize(8)
        .tickPadding(5)
        .tickValues(tickValuesY)
        .tickFormat(function (d, i) {
          return isMajorTick(i) ? d : "";
        })
      );
    yAxis.selectAll('g')
      .filter(function (d, i) {
        return !isMajorTick(i);
      })
      .attr('stroke', '#777')
      .attr('stroke-width', '1px')
      .attr('stroke-dasharray', '6,4');
  }

  return (
    <div id="graph" ref={graph}></div>
  )
}

export default Graph;