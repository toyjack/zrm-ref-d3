<script setup>
import { ref, onMounted } from "vue";
import * as d3 from "d3";
import data from "../data";
import { download, make_tree} from '../utils'

const svgRef = ref(null);

onMounted(() => {
  const width = 1200;
  const radius = width / 2;
  const nested_data = make_tree(data);

  const root = d3.hierarchy(nested_data)
  const value = d=>d.size
  const label = d=> d.name
  const padding = 1

  const fill = "#ccc"
  const fillOpacity = 0.6
  // coloring
  const  color = d3.scaleSequential([0, root.children.length - 1], d3.interpolateRainbow).unknown(fill);
  root.children.forEach((child, i) => child.index = i);
  console.log(root);

  // gen arc
  const arc = d3.arc()
      .startAngle(d => d.x0)
      .endAngle(d => d.x1)
      .padAngle(d => Math.min((d.x1 - d.x0) / 2, 2 * padding / radius))
      .padRadius(radius / 2)
      .innerRadius(d => d.y0)
      .outerRadius(d => d.y1 - padding);



  const svg = d3.select(svgRef.value);
  // svg size and font style
  svg.attr("width", width).attr("height", width);
  svg.attr("viewBox", `-${radius} -${radius} ${width} ${width}`)
  svg.attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle");
  root.sum(d => Math.max(0, value(d)));
  const sort = (a, b) => d3.descending(a.value, b.value)
  root.sort(sort)
  d3.partition().size([2 * Math.PI, radius])(root);
  // gen cell
  const cell = svg
    .selectAll("a")
    .data(root.descendants())
    .join("a")
      .attr("xlink:href", null)
      .attr("target",null);

    cell.append("path")
      .attr("d", arc)
      .attr("fill", d => color(d.ancestors().reverse()[1]?.index))
      .attr("fill-opacity", fillOpacity);

    cell
    .filter(d => (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10)
    .append("text")
      .attr("transform", d => {
        if (!d.depth) return;
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      })
      .attr("dy", "0.32em")
      .text(d => label(d.data, d))
      // .attr("font-size", "20px")
    const title= (d, n) => `${n.ancestors().reverse().map(d => d.data.name).join(".")}\n${n.value.toLocaleString("en")}`
    cell.append("title")
      .text(d => title(d.data, d))
      // .attr("font-size", "50px")

});
</script>

<template>
<div class="q-ma-xl ">
    <div class="row justify-center q-col-gutter-md">
      <div class="col-12 col-md-auto">
        <q-btn color="primary" label="Download" @click.prevent="download()" />
      </div>
    </div>
  </div>
  <div class="row justify-center">
    <div class="col-md-auto">
      <svg ref="svgRef" ></svg>
    </div>
  </div>
</template>

<style>
svg {
  background-color: white;
}
</style>
