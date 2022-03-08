<script setup>
import { ref, onMounted } from "vue";
import * as d3 from "d3";
import data from "../data";
import { download, make_tree} from '../utils'

const svgRef = ref(null);


onMounted(() => {
  const width = 2600;
  const radius = width / 2;
  const nested_data = make_tree(data);
  const tree = d3.cluster().size([2 * Math.PI, radius - 100]);
  const root = tree(
    d3
      .hierarchy(nested_data)
      .sort((a, b) => d3.ascending(a.data.name, b.data.name))
  );
  console.log(root);
  const svg = d3.select(svgRef.value);
  svg.attr("width", width).attr("height", width);
  svg.attr("viewBox", `-${radius} -${radius} ${width} ${width}`);

  svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
    .attr(
      "d",
      d3
        .linkRadial()
        .angle((d) => d.x)
        .radius((d) => d.y)
    );

  svg
    .append("g")
    .selectAll("circle")
    .data(root.descendants())
    .join("circle")
    .attr(
      "transform",
      (d) => `
        rotate(${(d.x * 180) / Math.PI - 90})
        translate(${d.y},0)
      `
    )
    .attr("fill", (d) => (d.children ? "#555" : "#999"))
    .attr("r", 2.5);

  svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 3)
    .selectAll("text")
    .data(root.descendants())
    .join("text")
    .attr(
      "transform",
      (d) => `
        rotate(${(d.x * 180) / Math.PI - 90}) 
        translate(${d.y},0) 
        rotate(${d.x >= Math.PI ? 180 : 0})
      `
    )
    .attr("dy", "0.31em")
    .attr("x", (d) => (d.x < Math.PI === !d.children ? 6 : -6))
    .attr("text-anchor", (d) =>
      d.x < Math.PI === !d.children ? "start" : "end"
    )
    .text((d) => d.data.name)
    .clone(true)
    .lower()
    .attr("stroke", "white");

  const svg_data = svg.node();
  console.log(svg_data);
});
</script>

<template>
  <div>
    <button @click="download()">Download</button>
  </div>
  <div ref="resizeRef">
    <svg ref="svgRef">
    </svg>
  </div>
</template>

<style>
svg {
  background-color: white;
}
</style>
