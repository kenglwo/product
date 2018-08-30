// two wordcloud for recipe data
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

const H = 600;
const W = 600;
const random = d3.random.irwinHall(2);
const colorScale = d3.scale.category20();
// let colorScale_dark = d3.scale.category20b();
// let colorScale_light = d3.scale.category20c();

class Wordcloud {
    constructor(texture, svg_place, max_range) {
        this.max_range = max_range;
        let draw_place = svg_place
        const countMax = d3.max(d3.values(texture));
        const sizeScale = d3.scale.sqrt().domain([0, countMax.count]).range([10, this.max_range]);
        const words = texture.map(function(d) {
            return {
                text: d.word,
                count: d.count,
                size: sizeScale(d.count) 
            };
        });
    

     function draw_wordcloud(words) {
        d3.select(draw_place)
        .attr({
            "width": W,
            "height": H
        })
        .append("g")
        .attr("transform", "translate(300,300)")
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
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
        .duration(4000)
        .ease("elastic")
        .delay(function(d, i) {return i * 500;})
        .style({
            "fill": "gray",
            "font-size": "10px"
        })
        .text(function(d) { return d.text; })
        .style({
            "font-family": "Impact",
            "font-size": function(d) { return d.size + "px"; },
            "font-weight": "bold",
            "fill": function(d, i) { 

            //     if(i<8) console.log(d.text); 
                return colorScale(i);
            }
        });
    } 

    d3.layout.cloud().size([W, H])
        .words(words)
        .rotate(function() { return Math.round(1-random()) *1; })
        // .rotate(function() { return Math.round(1-random()) *45; })
        // .rotate(function() { return Math.round(1-random()) *90; })
        .font("Impact")
        .fontSize(function(d) { return (d.size); })
        .padding(10)
        .on("end", draw_wordcloud)
        .start();
    
    }    
}


// d3.csv("rsc\\recipe1_review.csv", function(review_data){
//     d3.csv("rsc\\recipe1_texture.csv", function(texture_data){
        // const review_wordcloud = new Wordcloud(review_data, "svg#recipe1", 10);
        // $("svg#recipe1 text").css("opacity", "0.4");
        // const texture_wordcloud = new Wordcloud(texture_data, "svg#recipe1", 110);
//     });
// });


// d3.csv("rsc\\recipe2_review.csv", function(review_data){
//     d3.csv("rsc\\recipe2_texture.csv", function(texture_data){
//
//         // find the same texture in top-8
//         texture_data.map(function(d, index) {
//             if (index < 8) {
//                 console.log(d);
//             }
//
//         });
//
//         // const review_wordcloud = new Wordcloud(review_data, "svg#recipe2", 10);
//         // $("svg#recipe2 text").css("opacity", "0.4");
//         const texture_wordcloud = new Wordcloud(texture_data, "svg#recipe2", 110);
//     });
// });
 

d3.queue()
.defer(d3.csv, "rsc\\recipe1_texture.csv")
.defer(d3.csv, "rsc\\recipe1_review.csv")
.defer(d3.csv, "rsc\\recipe2_texture.csv")
.defer(d3.csv, "rsc\\recipe2_review.csv")
.await(function(error, recipe1_texture, recipe1_review, recipe2_texture, recipe2_review) {
    if (error) {
        console.error('Oh dear, something went wrong: ' + error);
    }
    else {

        let top8_recipe1_textures = recipe1_texture.slice(0,8).map(function(d,i){return d.word;});
        let top8_recipe2_textures = recipe2_texture.slice(0,8).map(function(d,i){return d.word;});

        let array = top8_recipe1_textures.concat(top8_recipe2_textures);
        let same_array = array.filter(function (x, i, self) {
                    return self.indexOf(x) !== i;
                });
        console.log(same_array);

        const recipe1_texture_wordcloud = new Wordcloud(recipe1_texture, "svg#recipe1", 110);
        const recipe2_texture_wordcloud = new Wordcloud(recipe2_texture, "svg#recipe2", 110);

    }
});
