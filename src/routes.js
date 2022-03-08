const ZrmRefType = () => import("./pages/zrm-ref-type.vue");
const ZrmRefToken = () => import("./pages/zrm-ref-token.vue");
const ZrmIcicle =()=> import("./pages/zrm-def-icicle.vue")

const Home = ()=> import("./pages/Home.vue")

const routes = [
  { path: "/", component: Home, name: "Home" },
  { path: "/sunburst-token", component: ZrmRefToken, name: "Sunburst(Token)" },
  { path:"/cicle-token", component: ZrmIcicle, name:"Icicle(Token)"},
  { path: "/ref-type", component: ZrmRefType, name: "Ref Type" },
  
  // { path: "/about", component: About },
];

export default routes;
