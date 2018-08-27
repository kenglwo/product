d3.csv("rsc\\hambarg1_review.csv", function(data){
d3.csv("rsc\\hambarg1_texture.csv", function(data2){
d3.csv("rsc\\hambarg2_review.csv", function(recipe2_review){
d3.csv("rsc\\hambarg2_texture.csv", function(recipe2_texture){

var h = 600;
var w = 600;
var random = d3.random.irwinHall(2);

var colorScale = d3.scale.category20();
var colorScale_dark = d3.scale.category20b();
var colorScale_light = d3.scale.category20c();

//recipe1
var countMax1 = d3.max(d3.values(data));
var sizeScale1 = d3.scale.linear().domain([0, countMax1.count]).range([10, 30]);
var countMax2 = d3.max(d3.values(data2));

var sizeScale2 = d3.scale.sqrt().domain([0, countMax2.count]).range([10, 110]);

//recipe2
var countMax3 = d3.max(d3.values(recipe2_review));
var sizeScale3 = d3.scale.linear().domain([0, countMax3.count]).range([10, 30])
var countMax4 = d3.max(d3.values(recipe2_texture));
var sizeScale4 = d3.scale.sqrt().domain([0, countMax4.count]).range([10, 110])


//recipe1
var words1 = data.map(function(d) {
    return {
    text: d.word,
    size: sizeScale1(d.count) //頻出カウントを文字サイズに反映
    };
});

var words2 = data2.map(function(d) {
    console.log(d.word + " : " + d.count);
    return {
    text: d.word,
    count: d.count,
    size: sizeScale2(d.count) //頻出カウントを文字サイズに反映
    };
});

//recipe2
var words3 = recipe2_review.map(function(d) {
    return {
    text: d.word,
    size: sizeScale3(d.count) 
    };
});
var words4 = recipe2_texture.map(function(d) {
    console.log(d.word + " : " + sizeScale4(d.count));
    return {
    text: d.word,
    count: d.count,
    size: sizeScale4(d.count) 
    };
});


//wordcloud 描画---------------------------------------------------

//recipe1 review----------------------------------
d3.layout.cloud().size([w, h])
    .words(words1)
    .rotate(function() { return Math.round(1-random()) *1; })
    // .rotate(function() { return Math.round(1-random()) *45; })
    // .rotate(function() { return Math.round(1-random()) *90; })
    .font("Impact")
    .fontSize(function(d) { return (d.size); })
    .padding(5)
    .on("end", draw_recipe1_review)
    .start();


function draw_recipe1_review(words) {
    d3.select("svg#recipe1")
    .attr({
        "width": w,
        "height": h
    })
    .append("g")
        .attr("transform", "translate(300,300)")
    .selectAll("text")
    .data(words)
    .enter()
    .append("text")
    .style({
        "font-family": "Impact",
        "font-size":function(d) { return d.size + "px"; },
        "font-weight": "bold",
        "fill": function(d, i) { return colorScale_light(i); }
        ,"opacity" : 0.4,
    })
    .attr( "text-anchor","middle")
    .attr( "transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .transition()
    .delay(function(d, i) {
                return i * 80;
            })
    .text(function(d) { return d.text; });
}

// recipe1 texture----------------------------------------------------

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

d3.layout.cloud().size([w, h])
    .words(words2)
    .rotate(function() { return Math.round(1-random()) *1; }) //ランダムに文字を90度回転
    // .rotate(function() { return Math.round(1-random()) *45; }) //ランダムに文字を90度回転
    // .rotate(function() { return Math.round(1-random()) *90; }) //ランダムに文字を90度回転
    .font("Impact")
    .fontSize(function(d) { return (d.size); })
    .padding(10)
    .on("end", draw_recipe1_texture) //描画関数の読み込み
    .start();

function draw_recipe1_texture(words) {
    d3.select("svg#recipe1")
    .attr({
        "width": w,
        "height": h
    })
    .append("g")
    .attr("transform", "translate(300,300)")
    .selectAll("text")
    .data(words)
    .enter()
    .append("text")
    .style({
        "font-family": "Impact",
        "font-size": function(d) { return d.size + "px"; },
        "font-weight": "bold",
        "fill": function(d, i) { 
            return colorScale(i);
        }
    })
    .attr( "text-anchor","middle")
    .attr( "transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .on("mouseover", function(d){tooltip.style("visibility", "visible");})
    .on("mousemove", function(d){
        tooltip.style("top", (d3.event.pageY-30)+"px")
               .style("left", (d3.event.pageX+20)+"px")
               .style("font-size", "50px")
               .html("count: " + d.count);})
    .on("mouseout", function(d){tooltip.style("visibility", "hidden");})
    .transition()
    .delay(function(d, i) {
			return i * 500;
		})
    .text(function(d) { return d.text; });
}


//recipe2 review----------------------------------
d3.layout.cloud().size([w, h])
    .words(words3)
    .rotate(function() { return Math.round(1-random()) * 1;})
    // .rotate(function() { return Math.round(1-random()) * 45;})
    // .rotate(function() { return Math.round(1-random()) * 90;})
    .font("Impact")
    .fontSize(function(d) { return (d.size); })
    .padding(5)
    .on("end", draw_recipe2_review)
    .start();


function draw_recipe2_review(words) {
    d3.select("svg#recipe2")
    .attr({
        "width": w,
        "height": h
    })
    .append("g")
        .attr("transform", "translate(300,300)")
    .selectAll("text")
    .data(words)
    .enter()
    .append("text")
    .style({
        "font-family": "Impact",
        "font-size":function(d) { return d.size + "px"; },
        "font-weight": "bold",
        "fill": function(d, i) { return colorScale_light(i); }
        ,"opacity" : 0.4,
    })
    .attr( "text-anchor","middle")
    .attr( "transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .transition()
    .delay(function(d, i) {
                return i * 80;
            })
    .text(function(d) { return d.text; });
}

// recipe2 texture----------------------------------------------------

d3.layout.cloud().size([w, h])
    .words(words4)
    .rotate(function() { return Math.round(1-random()) *1; }) //ランダムに文字を90度回転
    // .rotate(function() { return Math.round(1-random()) *45; }) //ランダムに文字を90度回転
    // .rotate(function() { return Math.round(1-random()) *90; }) //ランダムに文字を90度回転
    .font("Impact")
    .fontSize(function(d) { return (d.size); })
    .padding(10)
    .on("end", draw_recipe2_texture) //描画関数の読み込み
    .start();


function draw_recipe2_texture(words) {
    d3.select("svg#recipe2")
    .attr({
        "width": w,
        "height": h
    })
    .append("g")
    .attr("transform", "translate(300,300)")
    .selectAll("text")
    .data(words)
    .enter()
    .append("text")
    .style({
        "font-family": "Impact",
        "font-size":function(d) { return d.size + "px"; },
        "font-weight": "bold",
        "fill": function(d, i) { return colorScale(i); },
    })
    .attr( "text-anchor","middle")
    .attr( "transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
    })
    .on("mouseover", function(d){tooltip.style("visibility", "visible");})
    .on("mousemove", function(d){
        tooltip.style("top", (d3.event.pageY-30)+"px")
               .style("left", (d3.event.pageX+20)+"px")
               .html("count: " + d.count);})
    .on("mouseout", function(d){tooltip.style("visibility", "hidden");})
    .transition()
    .delay(function(d, i) {
			return i * 500;
		})
    .text(function(d) { return d.text; });
}

});
});
});
});
