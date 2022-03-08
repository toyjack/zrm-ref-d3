import * as d3 from "d3";

export const download = () => {
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

export const make_tree = (data) => {
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
          size: k[1].length
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