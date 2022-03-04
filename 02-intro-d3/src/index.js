import * as d3 from 'd3';

// C'est ici que vous allez écrire les premières lignes en d3!


//création cercle

let c1 =50
let c2 = 150
var svg = d3.select("body")
            .append("svg")
            .attr('width', 1000)
            .attr('height', 1000)

       
            var groupe1 = svg.append("svg:g")

                var circleA= groupe1.append("svg:circle")
                .attr("cx", c1)
                .attr("cy", c1)
                .attr("r", 40);

                var text1 = groupe1.append("svg:text")
                .text("Groupe 1")
                .attr("x", 75)
                .attr("y", 110)

                var groupe2 = svg.append("svg:g")

                var circleB = groupe2.append("svg:circle")
                .attr("cx", c2)
                .attr("cy", c2)
                .attr("r", 40);
            
                var text2 = groupe2.append("svg:text")
                .text("Groupe 1")
                .attr("x", 175)
                .attr("y", 210)

                var groupe3 = svg.append("svg:g")
                var circleC = groupe3.append("circle")
                .attr("cx", 250)
                .attr("cy", 250)
                .attr("r", 40);

                var text3 = groupe3.append("svg:text")
                .text("Groupe 1")
                .attr("x", 220)
                .attr("y", 320)

// attribut couleur changé
circleA.attr('fill', 'red')
circleB.attr('fill', 'blue')
circleC.attr('fill', 'green')

//bouger cerlce A et B
circleA.attr('cx', c1+50)
circleB.attr('cx', c2+50)

circleC.on("click", () => {
    circleA.attr('cx',c2)
    circleB.attr('cx',c2)
    circleC.attr('cx',c2)
    } )

    //Données

    const tableau = [20, 5, 25, 8, 15];

    svg.selectAll('rect')
    .data(tableau)
    .enter()
    .append('rect')
    .attr('height', d => d)
    .attr('width', 20)
    .attr('x',(d, i) =>  ((i*23)+50))
    .attr('y', d => 500-d);