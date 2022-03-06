<script setup>
import { ref, onMounted } from "vue";
import * as d3 from "d3";
import data from "./data";

const svgRef = ref(null);

const make_tree = (data) => {
  const nest = d3.groups(
    data,
    (d) => d.root,
    (d) => d.type,
    (d) => d.ref_name,
    (d) => d.ref_note
  );
  let tree = {};
  const workon = nest[0];
  tree.name = workon[0]; // name root
  tree.children = [];
  // console.log(workon[1])
  for (const i of workon[1]) {
    // console.log(i[0]) // name level1 type
    let temp_i = {
      name: i[0],
      children: [],
    };
    for (const j of i[1]) {
      // console.log(j[0]) // name level2 ref_name
      let temp_j = {
        name: j[0],
        children: [],
      };
      for (const k of j[1]) {
        // console.log(j[0])
        let temp_k = {
          name: k[0],
          // children:k[1]
        };
        temp_j.children.push(temp_k);
      }
      temp_i.children.push(temp_j);
    }
    tree.children.push(temp_i);
  }
  return tree;
};

const download = () => {
  var svg = document.querySelector("svg");
  var svgData = new XMLSerializer().serializeToString(svg);
  var canvas = document.createElement("canvas");
  canvas.width = svg.width.baseVal.value;
  canvas.height = svg.height.baseVal.value;

  var ctx = canvas.getContext("2d");
  var image = new Image();
  image.onload = () => {
    ctx.drawImage(image, 0, 0);
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    var a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.setAttribute("download", "image.png");
    a.dispatchEvent(new MouseEvent("click"));
  };
  image.src =
    "data:image/svg+xml;charset=utf-8;base64," +
    btoa(unescape(encodeURIComponent(svgData)));
};

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
    <button @click="download()">download</button>
  </div>
  <div ref="resizeRef">
    <svg ref="svgRef">
      <g class="x-axis" />
      <g class="y-axis" />
    </svg>
  </div>
</template>

<style>
svg {
  background-color: white;
}
</style>
