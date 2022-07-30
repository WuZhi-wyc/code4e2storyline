<template>
  <div class="e2Storyline">
    <el-container>
      <el-aside width="120px">
        <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose">
          <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
          <div id="storyLine">
          </div>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>

import * as d3 from 'd3'
import axios from 'axios'

export default {
  name: "e2Storyline",
  data() {
    return {
      data: [],
      // avtivecolor: "color:#b8b8b8",
    }
  },
  mounted() {
    this.draw()
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    // mouseover() {
    //   console.log("进入悬停区域");
    //   this.avtivecolor = "color:#fede0e";
    // },
    draw() {
      //设置画布的宽高及其他属性
      let padding = {top: 10, right: 10, bottom: 10, left: 10};
      let width = 1000;
      let height = 500;

      let h = 10, w = 10, h1 = 20;
      // let entity = ["lg", "zg", "py", "omq", "mkm", "sty", "hxl", "gqh", "hb"]; // entities 4 zhuoyaoji
      // let entity = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'] //entities 4 test3
      // let entity = ['皮克', '马斯切拉诺', '桑切斯', '厄齐尔',"拉姆塞","吉鲁-维尔贝克","特尔施特根","科奎林"]
      // let entity = ['布斯克茨', '苏亚雷斯', '科奎琳弗拉米尼', '内马尔',"切赫","默特萨克","伊涅斯塔","梅西","蒙雷亚尔"] //entities 4 B2A.json
      // let entity = ["lx", "adm", "pt", "ss", "asl", "jds", "tns", "hl", "cm"];
      // let entity = ["hsd", "jc", "mb", "nx", "dn", "tn", "hq","el"];
      let entity = ["no", "mfs", "cnd", "drj", "xz", "sf", "sms"];
      let indexNum = 0;
      let entityClass = [];
      let entityClassguding = [];
      let nodelist = [];

      // format variables
      let formatNumber = d3.format(",.0f"),    // zero decimal places
          format = function (d) {
            return formatNumber(d) + " " + units;
          },

          // color = d3.scaleOrdinal(d3.schemeCategory20);
          color = d3.scaleOrdinal().domain(entity)
              // .range(["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462"]); // color 4 test2
              //color for 14 entities
              // .range(["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#f0b3bd","#cab2d6","#a4bf8d","#acd5d3","#dfe09e",
              //     "#96bdd2","#f3d4b8","#f38c6c","#f8bf64"]);
              // color for test3
              // .range(["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"]);
              //color for 9 entities
              // .range(["#f0b3bd","#cab2d6","#a4bf8d","#acd5d3","#dfe09e",
              //     "#96bdd2","#f3d4b8","#f38c6c","#f8bf64"]);
              //color for 8 entities
              // .range(["#f0b3bd","#cab2d6","#a4bf8d","#acd5d3","#dfe09e",
              //     "#96bdd2","#f3d4b8","#f38c6c"]);
              //color for 7 entities
              .range(["#cab2d6", "#f0b3bd", "#acd5d3", "#dfe09e",
                "#96bdd2", "#f3d4b8", "#f38c6c"])


      let svg = d3.select('#storyLine')
          .append("svg")
          .attr("id", "drawSVG")
          .attr("width", width)
          .attr("height", height)
          .style("background-color", "#fff")
          .append("g")
          .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

      //画图

      axios.get('./data/matrix102.json').then((res) => {
        // console.log(res.data)
        // console.log(res.data.nodes[0])

        //第一步：画节点
        let node = svg.append("g")
            .selectAll(".node")
            .data(res.data.nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
              d.x = d.tx;
              d.y = d.ty * 2;
              return "translate(" + d.tx + "," + d.ty * 2 + ")";
            })

        // .call(d3.drag()  //节点拖拽
        //     .subject(function (d) {
        //       return d;
        //     }).on("start", function () {
        //       this.parentNode.appendChild(this);
        //     }).on("drag", dragmove));

        node.each(function (d) {
          if (Object.getOwnPropertyNames(d).length > 10) {
            // console.log("json数据的长度：" + Object.getOwnPropertyNames(d).length)
            for (let j = 0; j < d.numL; j++) {
              let nodelisttemp = []
              for (let i = 0; i < d.numC; i++) {
                if (d.pixPosition[i][j] === d.namC[i]) { //有relation存在
                  // console.log(d.relation[j][i])
                  d3.select(this)
                      .append("rect")
                      .attr("class", d.namC[i])
                      .attr("id", "" + indexNum + i + j + d.relation[j][i])  //id的名称倒数第一位是判断主被动，“1”为施者；倒数第二位是动作类型
                      .attr("height", h)
                      .attr("width", w)
                      .attr("x", w * j)
                      .attr("y", h1 * i)
                      .style("fill", d.color = color(d.namC[i]))
                      // .style("fill-opacity",0)
                      .style("fill-opacity", 1)
                      .style("stroke", "gray")
                      // .style("stroke-width", 1)
                      // .style("stroke-width", 0)
                      .style("stroke-opacity", 0)
                  // .style("stroke-opacity", 1)
                  // console.log("" + indexNum +i + j)
                  nodelisttemp.push(document.getElementById("" + indexNum + i + j + d.relation[j][i]))
                } else {
                  // console.log(this)
                  d3.select(this)
                      .append("rect")
                      .attr("class", d.namC[i])
                      .attr("height", h)
                      .attr("width", w)
                      .attr("x", w * j)
                      .attr("y", h1 * i)
                      // .style("fill", "#FFF")
                      .style("fill", d.color = color(d.namC[i])) //矩形中不参与的实体填线条的颜色
                      .style("fill-opacity", 1)
                      .style("stroke", color(d.namC[i]))
                      .style("stroke", "gray")
                      // .style("stroke-width", 0)
                      // .style("stroke-width", 1)
                      .style("stroke-opacity", 0)
                  // .style("stroke-opacity", 1)
                }
              }
              // console.log(nodelisttemp)
              indexNum++
              nodelist.push(nodelisttemp)
            }
          } else {
            d3.select(this)
                .append("rect")
                .attr("class", d.name)
                .attr("height", h)
                .attr("width", function (d) {
                  return d.tw
                })
                .style("fill", function () {
                  for (let n = 0; n < entity.length; n++) {
                    if (d.name === entity[n]) {
                      return d.color = color(d.name);
                    }
                  }
                })
                .style("fill-opacity", 1)
                // .style("stroke", "gray")
                .style("stroke", function () {
                  for (let n = 0; n < entity.length; n++) {
                    if (d.name === entity[n]) {
                      return d.color = color(d.name);
                    }
                  }
                })
                // .style("stroke-width", 1)
                // .style("stroke-opacity",1)
                .style("stroke-opacity", 0)
          }
        })
        // console.log(nodelist)

        //第二步：画连线
        //获得每个calss的对象
        function getLineClassName() {
          entity.forEach(item => {
            entityClass.push(document.getElementsByClassName(item))
          })
          // console.log(entityClass)
          for (let i = 0; i < entityClass.length; i++) {
            let temp = []
            for (let j = 0; j < entityClass[i].length; j++) {
              temp[j] = entityClass[i][j]
            }
            entityClassguding.push(temp)
          }
        }

        function drawlink_() {
          entityClassguding.forEach(item => {
            let location = [];
            $.each(item, function () {
              // console.log(this.getBoundingClientRect())
              location.push([this.className.baseVal, this.getBoundingClientRect()]);
              //bottom,height,left,right,top,width
            })
            // console.log(item[0].className.animVal)
            let newLink = svg.append("g")
                .attr("id", "link-").selectAll("." + item[0].className.animVal)
                .data(location)
                .enter().append("path")
                .attr("class", "link-" + item[0].className.animVal)
                .attr("d", function (d, i) {
                  if (i < location.length - 1) {
                    // let
                    //     x0 = location[i][1].right - padding.right * 2 + 2,
                    //     y0 = location[i][1].top - padding.top + 2,
                    //     x1 = location[i + 1][1].left - padding.right * 2 + 2,
                    //     y1 = location[i + 1][1].top - padding.top + 2,
                    //     xi = d3.interpolateNumber(x0, x1),
                    //     x2 = xi(0.5), //给每个插入值设定弯曲度
                    //     x3 = xi(0.5);
                    // console.log(location[i][2])

                    let x0, y0, x1, y1, xi, x2, x3;
                    if (location[i][1].height === 20) {
                      x0 = location[i][1].right - 140 - padding.right * 2 + 1;
                      y0 = location[i][1].top - 158 - padding.top * 1 + 2;
                    } else {
                      x0 = location[i][1].right - 140 - padding.right * 2 + 1;
                      y0 = location[i][1].top - 158 - padding.top * 1.5 + 2;
                      // y0 = location[i][1].top - padding.top * 1 + 2;
                    }
                    if (location[i + 1][1].height === 20) {
                      x1 = location[i + 1][1].left - 140 - padding.right * 2 + 3;
                      y1 = location[i + 1][1].top - 158 - padding.top * 1 + 2;
                    } else {
                      x1 = location[i + 1][1].left - 140 - padding.right * 2 + 3;
                      y1 = location[i + 1][1].top - 158 - padding.top * 1.5 + 2;
                      // y1 = location[i + 1][1].top - padding.top*1 + 2;
                    }
                    xi = d3.interpolateNumber(x0, x1);
                    x2 = xi(0.5); //给每个插入值设定弯曲度
                    x3 = xi(0.5);

                    return "M" + x0 + "," + y0
                        + "C" + x2 + "," + y0
                        + " " + x3 + "," + y1
                        + " " + x1 + "," + y1;
                  }
                })
                .style("stroke-width", function (d, i) {
                  return Math.min(h, location[i][1].bottom - location[i][1].top)
                })
                .style("fill", "none")
                .style("stroke", function (d, i) {
                  for (let n = 0; n < entity.length; n++) {
                    if (location[i][0] === entity[n]) {
                      return color(location[i][0]);
                    }
                  }
                })
                .style("stroke-opacity", 1)
          })
        }

        //第三步：展示relation
        function lG() {
          let defs = svg.append("defs");
          let linearG = svg.append("g")
          for (let i = 0; i < nodelist.length; i++) {
            let linearGradient = defs.append("linearGradient")
            let linearGg = linearG.append("g")
                // 选中高亮
                .on("mouseover", function () {
                  console.log("选中了g！")
                })
            for (let j = 0; j < 2; j++) {
              let category, color1, color2, xt, yt, xj, yj, xj_1, yj_1, xj_w, yj_h, xj_1_w, yj_1_h, x1, y1,
                  x2, y2, x3, y3, x4, y4, yRS, xRS, yRE, r, xs, ys, xe, ye, hR, wR;
              color1 = "#efefef"; //定义渐变标尺一端颜色定为为白色
              xt = parseInt(document.defaultView.getComputedStyle(nodelist[i][j].parentNode).transform.substring(7).split(',')[4]);
              yt = parseInt(document.defaultView.getComputedStyle(nodelist[i][j].parentNode).transform.substring(7).split(',')[5]);
              xj_1_w = xj_w = parseInt(document.defaultView.getComputedStyle(nodelist[i][j]).width);
              yj_1_h = yj_h = parseInt(document.defaultView.getComputedStyle(nodelist[i][j]).height);
              xj = parseInt(document.defaultView.getComputedStyle(nodelist[i][j]).x);
              yj = parseInt(document.defaultView.getComputedStyle(nodelist[i][j]).y);

              // 画一个整体
              function drawRectAndTriangleT2B(i, yj_1, c, f) {
                linearGg.append("path").attr("d", "M" +  + " " + )
              }

              function drawGradientRectT2B(i, yj_1, c, f) {//获得由上至下渐变
                if (f === 0) {
                  yRS = yt + yj_1;
                  xRS = xt + xj;
                  yRE = yt + yj;
                  linearGradient.append("stop").attr("offset", "70%").style("stop-color", c).style("stop-opacity", 1); //取第一种渐变色
                  linearGradient.append("stop").attr("offset", "100%").style("stop-color", color1).style("stop-opacity", 1); //白色
                  linearGg.append("rect")
                      .attr("height", yRE - yRS)
                      .attr("width", xj_w)
                      .attr("x", xRS)
                      .attr("y", yRS)
                      .style("fill", "url(#" + i + ")")
                } else {
                  yRS = yt + yj;
                  xRS = xt + xj;
                  yRE = yt + yj_1;
                  linearGradient.append("stop").attr("offset", "70%").style("stop-color", c).style("stop-opacity", 1); //取第一种渐变色
                  linearGradient.append("stop").attr("offset", "100%").style("stop-color", color1).style("stop-opacity", 1); //白色
                  linearGg.append("rect")
                      .attr("height", yRE - yRS)
                      .attr("width", xj_w)
                      .attr("x", xRS)
                      .attr("y", yRS)
                      .style("fill", "url(#" + i + ")")
                }
              }

              // function drawGradient

              function drawGradientRectB2T(i, yj_1, c, f) {//获得由下至上渐变
                if (f === 0) {
                  yRS = yt + yj + yj_1_h;
                  xRS = xt + xj;
                  yRE = yt + yj_1 + yj_1_h;
                  linearGradient.append("stop").attr("offset", "0%").style("stop-color", color1).style("stop-opacity", 1); //白色
                  linearGradient.append("stop").attr("offset", "70%").style("stop-color", c).style("stop-opacity", 1); //取第一种渐变色
                  linearGg.append("rect")
                      .attr("height", yRE - yRS)
                      .attr("width", xj_w)
                      .attr("x", xRS)
                      .attr("y", yRS)
                      .style("fill", "url(#" + i + ")")
                } else {
                  yRS = yt + yj_1 + yj_1_h;
                  xRS = xt + xj;
                  yRE = yt + yj + yj_1_h;
                  linearGradient.append("stop").attr("offset", "0%").style("stop-color", color1).style("stop-opacity", 1); //白色
                  linearGradient.append("stop").attr("offset", "70%").style("stop-color", c).style("stop-opacity", 1); //取第一种渐变色
                  linearGg.append("rect")
                      .attr("height", yRE - yRS)
                      .attr("width", xj_w)
                      .attr("x", xRS)
                      .attr("y", yRS)
                      .style("fill", "url(#" + i + ")")
                }
              }

              function drawFullRectT2B(yj_1, c) {//获得由上至下渐变
                yRS = yt + yj;
                xRS = xt + xj;
                yRE = yt + yj_1;
                linearGg.append("rect").attr("height", yRE - yRS).attr("width", xj_w).attr("x", xRS).attr("y", yRS).style("fill", c);
                // console.log(yRE - yRS)
              }

              function drawFullRectB2T(yj_1, c) {//获得由下至上线性渐变标尺
                yRS = yt + yj_1 + yj_1_h;
                xRS = xt + xj;
                yRE = yt + yj + yj_1_h;
                linearGg.append("rect").attr("height", yRE - yRS).attr("width", xj_w).attr("x", xRS).attr("y", yRS).style("fill", c);
                // console.log(yRE - yRS)

              }

              // function rightRoundedRect(x, y, width, height, radius) {             //通过path绘制任意曲线
              //     return "M" + x + "," + y
              //         + "h" + (width - radius)
              //         + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
              //         + "v" + (height - 2 * radius)
              //         + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
              //         + "h" + (radius - width)
              //         + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + -radius
              //         + "v" + (height - 2 * radius)
              //         + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + -radius
              //         + "z";
              // }

              // function drawGradientOverallT2B(category, i, xj_1, yj_1, c) {
              //     if (category === 1) {   //如果关系类型是“1”则为三角形
              //         linearGg.append("polygon")
              //             .attr("points", xt + xj + ',' + yt + yj + ' '
              //                 + xt + xj_1 + ',' + yt + yj_1 + ' '
              //                 + xt + xj_1 + xj_1_w / 2 + ',' + yt + yj_1 + yj_1_h / 2 + ' '
              //                 + xt + xj_1 + xj_1_w + ',' + yt + yj_1 + ' '
              //                 + xt + xj + xj_w + ',' + yt + yj
              //             ).style("fill", c);
              //     } else if (category === 2) {    // 如果关系类型是“2”则为半圆形
              //         linearGg.append("path")
              //             .attr()
              //     }
              // }
              //
              // function drawGradientOverallB2T() {
              //
              // }

              function drawLowerTriangle(xj_1, yj_1, c, f) { //画下三角形
                if (f === 0) {
                  x1 = xt + xj_1;
                  y1 = yt + yj;
                  x2 = xt + xj + xj_1_w;
                  y2 = yt + yj;
                  x3 = xt + xj + xj_1_w / 2;
                  y3 = yt + yj + yj_1_h / 2;
                } else {
                  x1 = xt + xj_1;
                  y1 = yt + yj_1;
                  x2 = xt + xj_1 + xj_1_w;
                  y2 = yt + yj_1;
                  x3 = xt + xj_1 + xj_1_w / 2;
                  y3 = yt + yj_1 + yj_1_h / 2;
                }
                linearGg.append("polygon").attr("points", x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3 + ',' + y3).style("fill", c);
              }

              function drawUpperTriangle(xj_1, yj_1, c, f) { //画上三角形
                if (f === 0) {
                  x1 = xt + xj;
                  y1 = yt + yj + yj_1_h;
                  x2 = xt + xj + xj_1_w;
                  y2 = yt + yj + yj_1_h;
                  x3 = xt + xj + xj_1_w / 2;
                  y3 = yt + yj + yj_1_h / 2;
                } else {
                  x1 = xt + xj_1;
                  y1 = yt + yj_1 + yj_1_h;
                  x2 = xt + xj_1 + xj_1_w;
                  y2 = yt + yj_1 + yj_1_h;
                  x3 = xt + xj_1 + xj_1_w / 2;
                  y3 = yt + yj_1 + yj_1_h / 2;
                }
                linearGg.append("polygon").attr("points", x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3 + ',' + y3).style("fill", c);
              }

              function drawLowerRect(xj_1, yj_1, c, f) { //画下半矩形
                if (f === 0) {
                  x1 = xt + xj;
                  y1 = yt + yj;
                  x2 = xt + xj + 2;
                  y2 = yt + yj + yj_h / 2;
                  x3 = xt + xj + xj_w - 2;
                  y3 = yt + yj + yj_h / 2;
                  x4 = xt + xj + xj_w;
                  y4 = yt + yj;
                } else {
                  x1 = xt + xj_1;
                  y1 = yt + yj_1;
                  x2 = xt + xj_1 + 2;
                  y2 = yt + yj_1 + yj_h / 2;
                  x3 = xt + xj_1 + xj_w - 2;
                  y3 = yt + yj_1 + yj_h / 2;
                  x4 = xt + xj_1 + xj_w;
                  y4 = yt + yj_1;
                }
                linearGg.append("polygon").attr("points", x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3 + ',' + y3 + ' ' + x4 + ',' + y4).style("fill", c);
              }

              function drawUpperRect(xj_1, yj_1, c, f) { //画上半矩形
                if (f === 0) {
                  x1 = xt + xj;
                  y1 = yt + yj + yj_1_h;
                  x2 = xt + xj + 2;
                  y2 = yt + yj + yj_h / 2;
                  x3 = xt + xj + xj_w - 2;
                  y3 = yt + yj + yj_h / 2;
                  x4 = xt + xj + xj_w;
                  y4 = yt + yj + yj_1_h;
                } else {
                  x1 = xt + xj_1;
                  y1 = yt + yj_1 + yj_1_h;
                  x2 = xt + xj_1 + 2;
                  y2 = yt + yj_1 + yj_h / 2;
                  x3 = xt + xj_1 + xj_w - 2;
                  y3 = yt + yj_1 + yj_h / 2;
                  x4 = xt + xj_1 + xj_w;
                  y4 = yt + yj_1 + yj_1_h;
                }
                linearGg.append("polygon").attr("points", x1 + ',' + y1 + ' ' + x2 + ',' + y2 + ' ' + x3 + ',' + y3 + ' ' + x4 + ',' + y4).style("fill", c);
              }


              function drawLowerSemicircle(xj_1, yj_1, c, f) { //画下半圆形
                if (f === 0) {
                  xs = xt + xj + xj_1_w
                  ys = yt + yj
                  xe = xt + xj
                  ye = yt + yj
                  r = xj_1_w / 2 - 1
                } else {
                  xs = xt + xj_1 + xj_1_w
                  ys = yt + yj_1
                  xe = xt + xj_1
                  ye = yt + yj_1
                  r = xj_1_w / 2 - 1
                }
                linearGg.append("path").attr("d", 'M ' + xs + ',' + ys + ' ' + 'A ' + r + ' ' + r + ' ' + 180 + ' ' + 1 + ' ' + 1 + " " + xe + ' ' + ye).style("fill", c)
              }

              function drawUpperSemicircle(xj_1, yj_1, c, f) { //画上半圆形
                if (f === 0) {
                  xs = xt + xj
                  ys = yt + yj + yj_1_h
                  xe = xt + xj + xj_1_w
                  ye = yt + yj + yj_1_h
                  r = xj_1_w / 2 - 1
                } else {
                  xs = xt + xj_1
                  ys = yt + yj_1 + yj_1_h
                  xe = xt + xj_1 + xj_1_w
                  ye = yt + yj_1 + yj_1_h
                  r = xj_1_w / 2 - 1
                }
                linearGg.append("path").attr("d", 'M ' + xs + ',' + ys + ' ' + 'A ' + r + ' ' + r + ' ' + 180 + ' ' + 1 + ' ' + 1 + " " + xe + ' ' + ye).style("fill", c)
              }

              function drawGradientT2B(category, i, xj_1, yj_1, c, f) { //整体渐变，终点图形为白色
                drawGradientRectT2B(i, yj_1, c, f)
                if (category === 1) {   //如果关系类型是“1”则为三角形
                  drawLowerTriangle(xj_1, yj_1, color1, f)
                } else if (category === 2) {    // 如果关系类型是“2”则为半圆形
                  drawLowerSemicircle(xj_1, yj_1, color1, f)
                } else { // 如果关系类型是“3”则为半矩形
                  drawLowerRect(xj_1, yj_1, color1, f)
                }

              }

              function drawGradientB2T(category, i, xj_1, yj_1, c, f) { //整体颜色渐变，矩形+头部图形
                drawGradientRectB2T(i, yj_1, c, f)
                if (category === 1) {// 如果关系类型是“1”则为三角形
                  drawUpperTriangle(xj_1, yj_1, color1, f)
                } else if (category === 2) {// 如果关系类型是“2”则为半圆形
                  drawUpperSemicircle(xj_1, yj_1, color1, f)
                } else {
                  drawUpperRect(xj_1, yj_1, color1, f)
                }
              }

              function drawFullT2B(category, xj_1, yj_1, c) { //整体颜色填满，矩形+头部图形
                if (category === 1) {   //如果关系类型是“1”则为三角形
                  drawLowerTriangle(xj_1, yj_1, c)
                  drawFullRectT2B(yj_1, c)
                  // console.log("t2b")
                } else if (category === 2) {    // 如果关系类型是“2”则为半圆形
                  drawLowerSemicircle(xj_1, yj_1, c)
                  drawFullRectT2B(yj_1, c)
                  // console.log("t2b")

                }
              }

              function drawFullB2T(category, xj_1, yj_1, c) {
                if (category === 1) {// 如果关系类型是“1”则为三角形
                  drawUpperTriangle(xj_1, yj_1, c)
                  drawFullRectB2T(yj_1, c)
                  // console.log("b2t")

                } else if (category === 2) {// 如果关系类型是“2”则为半圆形
                  drawUpperSemicircle(xj_1, yj_1, c)
                  drawFullRectB2T(yj_1, c)
                  // console.log("b2t")

                }
              }

              function drawBST2B(category, xj_1, yj_1, c) {
                if (category === 1) {   //如果关系类型是“1”则为三角形
                  drawLowerTriangle(xj_1, yj_1, c)
                  // console.log("t2b")
                } else if (category === 2) {    // 如果关系类型是“2”则为半圆形
                  drawLowerSemicircle(xj_1, yj_1, c)
                  // console.log("t2b")
                }
              }

              function drawBSB2T(category, xj_1, yj_1, c) {
                if (category === 1) {// 如果关系类型是“1”则为三角形
                  drawUpperTriangle(xj_1, yj_1, c)
                  // console.log("b2t")

                } else if (category === 2) {// 如果关系类型是“2”则为半圆形
                  drawUpperSemicircle(xj_1, yj_1, c)
                  // console.log("b2t")
                }
              }

              // console.log(nodelist[i][j])
              // console.log(document.defaultView.getComputedStyle(nodelist[i][j]))
              // console.log(document.defaultView.getComputedStyle(nodelist[i][j].parentNode).transform)

              linearGradient.attr("id", i).attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
              if (j === 0) {
                xj_1 = parseInt(document.defaultView.getComputedStyle(nodelist[i][j + 1]).x);
                yj_1 = parseInt(document.defaultView.getComputedStyle(nodelist[i][j + 1]).y);
                category = parseInt(nodelist[i][j].getAttribute("id").charAt(nodelist[i][j].getAttribute("id").length - 1))   //获取类别是否为施者
                color2 = document.defaultView.getComputedStyle(nodelist[i][j]).fill;
                // console.log(category)
                // console.log(nodelist[i][j].getAttribute("id").charAt(nodelist[i][j].getAttribute("id").length - 1))

                //画小三角形+网格 三角形放在受者的区域 颜色用施者的
                if (category >= 1) { //当前为施者
                  if (yj_1 - yj > 0) { //判断实体位置关系
                    drawGradientT2B(category, i, xj_1, yj_1, color2, 1) // 由上至下画渐变
                    // drawFullT2B(category, xj_1, yj_1, color2) //由上至下画实心
                    // drawBST2B(category, xj_1, yj_1, color2) //由上至下画基础图形

                  } else {
                    drawGradientB2T(category, i, xj_1, yj_1, color2, 1) // 由下至上画渐变
                    // drawFullB2T(category, xj_1, yj_1, color2) //由下至上画实心
                    // drawBSB2T(category, xj_1, yj_1, color2) //由下至上画基础图形
                  }
                }
                // else { // 当前为受者
                //     if (yj_1 - yj > 0) { //判断实体位置关系
                //         drawGradientB2T(category, i, xj_1, yj_1, color2, 0) // 由下至上画渐变
                //         // drawFullB2T(category, xj_1, yj_1, color2) //由下至上画实心
                //         // drawBSB2T(category, xj_1, yj_1, color2) //由下至上画基础图形
                //
                //     } else {
                //         drawGradientT2B(category, i, xj_1, yj_1, color2, 0) // 由上至下画渐变
                //         // drawFullT2B(category, xj_1, yj_1, color2) //由上至下画实心
                //         // drawBST2B(category, xj_1, yj_1, color2) //由上至下画基础图形
                //     }
                // }
              } else {
                xj_1 = parseInt(document.defaultView.getComputedStyle(nodelist[i][j - 1]).x);
                yj_1 = parseInt(document.defaultView.getComputedStyle(nodelist[i][j - 1]).y);
                category = parseInt(nodelist[i][j].getAttribute("id").charAt(nodelist[i][j].getAttribute("id").length - 1))   //获取类别是否为施者
                color2 = document.defaultView.getComputedStyle(nodelist[i][j]).fill
                if (category >= 1) { //当前为施者{
                  if (yj_1 - yj > 0) { //判断实体位置关系
                    drawGradientT2B(category, i, xj_1, yj_1, color2, 1) // 由上至下画渐变
                    // drawFullT2B(category, xj_1, yj_1, color2) //由上至下画实心
                    // drawBST2B(category, xj_1, yj_1, color2) //由上至下画基础图形

                  } else {
                    drawGradientB2T(category, i, xj_1, yj_1, color2, 1) // 由下至上画渐变
                    // drawFullB2T(category, xj_1, yj_1, color2) //由下至上画实心
                    // drawBSB2T(category, xj_1, yj_1, color2) //由下至上画基础图形
                  }
                }
                // else { //当前为受者
                //     if (yj_1 - yj > 0) { //判断实体位置关系
                //         drawGradientB2T(category, i, xj_1, yj_1, color2, 0) // 由下至上画渐变
                //         // drawFullB2T(category, xj_1, yj_1, color2) //由下至上画实心
                //         // drawBSB2T(category, xj_1, yj_1, color2) //由下至上画基础图形
                //
                //     } else {
                //         drawGradientT2B(category, i, xj_1, yj_1, color2, 0) // 由上至下画渐变
                //         // drawFullT2B(category, xj_1, yj_1, color2) //由上至下画实心
                //         // drawBST2B(category, xj_1, yj_1, color2) //由上至下画基础图形
                //     }
                // }
              }
            }
          }
        }

        getLineClassName();
        drawlink_();
        lG();

        //节点的拖动功能
        // function dragmove(d) {
        //   d3.select(this)
        //       .attr("transform",
        //           "translate("
        //           + d.x + ","
        //           + (d.y = Math.max(
        //               0, Math.min(height - d.dy, d3.event.y))
        //           ) + ")");
        //   drawlink_();
        // }
      })

    }
  }
}
</script>

<style>
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: left;
  line-height: 160px;
}
</style>