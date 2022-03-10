<script setup>
import { onMounted, ref } from 'vue'
import * as d3 from 'd3'
import _ from 'lodash'
import data2 from '../data2'
import { download } from '../utils'


const data = data2

const svgRef = ref(null);

const width = 1000
const height = width
const innerRadius = Math.min(width, height) * 0.5 - 100
const outerRadius = innerRadius + 30
const arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(outerRadius)
const ribbon = d3.ribbon()
  .radius(innerRadius - 1)
  .padAngle(1 / innerRadius)
const chord = d3.chord()
  .padAngle(1 / innerRadius)
  .sortSubgroups(d3.descending)
  .sortChords(d3.descending)


const names = _.uniq(data.map(v => v.ref_name))
const color = d3.scaleOrdinal(names, d3.quantize(d3.interpolateRainbow, names.length))
const index = new Map(names.map((name, i) => [name, i]));
const matrix = Array.from(index, () => new Array(names.length).fill(0));
for (const record of data) {
  let source = record.ref_name
  let targets = data.filter(v => record.zr2id == v.zr2id).map(v => {
    let target = v.ref_name
    if(target!=source){
      matrix[index.get(source)][index.get(target)] += 1
    }
  })
}

onMounted(() => {

  const chords = chord(matrix);
  // console.log(chords)

  const svg = d3.select(svgRef.value)
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);
  const group = svg.append("g")
    .attr("font-size", 10)
    .attr("font-family", "sans-serif")
    .selectAll("g")
    .data(chords.groups)
    .join("g");
  group.append("path")  // 画外圈
    .attr("fill", d => color(names[d.index]))
    .attr("d", arc);

  group.append("text") //外圈文字
    .each(d => (d.angle = (d.startAngle + d.endAngle) / 2))
    .attr("dy", "0.35em")
    .attr("transform", d => `
          rotate(${(d.angle * 180 / Math.PI - 90)})
          translate(${outerRadius + 5})
          ${d.angle > Math.PI ? "rotate(180)" : ""}
        `)
    .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
    .text(d => names[d.index]);

  group.append("title")
    .text(d => `${names[d.index]}共起可能合計
  ${d3.sum(chords, c => (c.source.index === d.index) * c.source.value)} `);

  svg.append("g")
    .attr("fill-opacity", 0.75)
    .selectAll("path")
    .data(chords)
    .join("path")
    .style("mix-blend-mode", "multiply")
    .attr("fill", d => color(names[d.target.index]))
    .attr("d", ribbon)
    .append("title")
    .text(d => `${names[d.source.index]} と ${names[d.target.index]} ${d.source.value}`);
})

</script>

<template>
    <div class="q-ma-xl">
    <div class="row justify-center q-col-gutter-md">
      <div class="col-12 col-md-auto">
        <q-btn color="primary" label="Download" @click.prevent="download()" />
      </div>
    </div>
  </div>

  <div id="mysvg" ref="svgRef"></div>
</template>