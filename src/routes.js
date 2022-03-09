const zrmref = () => import("././pages/zrm-ref.vue");
const Sunburst = () => import("./pages/Sunburst.vue");
const Icicle =()=> import("./pages/Icicle.vue")
const ChordRefType = ()=> import("./pages/ChordRefType.vue")
const ChordRefName = ()=> import("./pages/ChordRefName.vue")

const Home = ()=> import("./pages/Home.vue")

const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/sunburst", component: Sunburst, name: "Sunburst(Token)" },
  { path:"/cicle-token", component: Icicle, name:"Icicle(Token)"},
  { path: "/zrmref", component: zrmref, name: "Ref Type" },
  { path: "/chord-ref-type", component:ChordRefType, name:"Chord(ref_type)"},
  { path: "/chord-ref-name", component:ChordRefName, name:"Chord(ref_name)"},

  
  // { path: "/about", component: About },
];

export default routes;
