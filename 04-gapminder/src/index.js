import * as d3 from 'd3'
import dataIncome from '../data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv'
import dataLifeExpectancy from '../data/life_expectancy_years.csv'
import dataPopulation from '../data/population_total.csv'


for (var i = 0; i < dataPopulation.length; i++) {
    console.log(cleanData(dataPopulation[i]["2021"]));
}


const maxGDP = d3.max(dataIncome, function(d) { return cleanData(d[2021]); });
const minGDP = d3.min(dataIncome, function(d) { return cleanData(d[2021]); });
const maxExpectancy = d3.max(dataLifeExpectancy, function(d) { return cleanData(d[2021]); })
const minExpectancy = d3.min(dataLifeExpectancy, function(d){return cleanData(d[2021]); })
const maxPop = d3.max(dataPopulation, function(d) { return cleanData(d[2021]); })
const minPop = d3.min(dataPopulation, function(d){return cleanData(d[2021]); })

console.log(maxExpectancy)

const margin = {
        top: 50,
        right: 10,
        bottom: 0,
        left: 100
    },
    width = window.innerWidth * 0.7 - margin.left - margin.right,
    height = window.innerHeight * 0.9 - margin.top - margin.bottom;

const svgGraph = d3.select('body').append('svg').attr('class', 'graph');

svgGraph.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const x = d3.scaleLinear()
    .domain([minGDP, maxGDP])
    .range([10, width]);

svgGraph.append('g')
    .attr("transform", "translate(5," + height + ")")
    .call(d3.axisTop(x).ticks(35).tickSize(10)).selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-0.6em")
    .attr("dy", "2.4em")
    .attr("transform", "rotate(-65)");

//Pow pour avoir une échelle exponentielle qui se concentre vers 0
const y = d3.scalePow()
    .domain([0, maxExpectancy])
    .range([height, 0])
    .exponent(7);

svgGraph.append('g')
    .call(d3.axisRight(y).ticks(10)); 
    
//Sqrt pour équilibrer les tailles des cercles 
const r = d3.scaleSqrt()
    .domain([minPop, maxPop])
    .range([0, 30]);

//Circles
for (var i = 0; i < dataPopulation.length; i++) {
    if (dataIncome[i]['2021'] && dataLifeExpectancy[i]['2021'] && dataPopulation[i]['2021'] && dataLifeExpectancy[i]['2021']>0) {
        svgGraph.append("circle")
        .attr("cx", x(cleanData(dataIncome[i]["2021"]))).attr("cy", y(dataLifeExpectancy[i]["2021"])).attr("r", r(cleanData(dataPopulation[i]["2021"]))).attr('data-life', dataLifeExpectancy[i]['2021']).attr('data-country', dataLifeExpectancy[i]['country']).style("fill", "blue");   
    }
}

//Clean Data
function cleanData(data) {
    if (isNaN(data)) {
        if (data.includes("k")) {
            const n = data.split("k")[0];
            return Number.parseFloat(n) * 1000;
        } else if (data.includes("M")) {
            const n = data.split("M")[0];
            return Number.parseFloat(n) * 1000000;

        } else if (data.includes("B")) {
            const n = data.split("B")[0];
            return Number.parseFloat(n) * 1000000000;
        }
    }
    return data;
}



// exercice b

const life2021 = dataLifeExpectancy.map((year) => {
	return { country: year["country"], dataLifeExpectancy: year["2021"] };
});
const pop2021 = dataPopulation.map((year) => {
	return { country: year["country"], dataPopulation: year["2021"] };
});
const income2021 = dataIncome.map((year) => {
	return { country: year["country"], dataIncome: year["2021"] };
});

let data = [];
for (let i = 0; i < income2021.length; i++) {
	data.push({
		country: income2021[i].country,
		dataPopulation: cleanData(pop2021[i].dataPopulation),
		dataLifeExpectancy: cleanData(life2021[i].dataLifeExpectancy),
		dataIncome: cleanData(income2021[i].dataIncome),
	});
}

function cleanData(data) {
	if (isNaN(data)) {
		if (data.includes("k")) {
			const n = data.split("k")[0];
			data = Number.parseFloat(n) * 1000;
		} else if (data.includes("M")) {
			const n = data.split("M")[0];
			data = Number.parseFloat(n) * 1000000;
		} else if (data.includes("B")) {
			const n = data.split("B")[0];
			data = Number.parseFloat(n) * 1000000000;
		}
	}
	if (data == "") {
		data = 0;
	}
	return data;
}

const yMax = data.reduce((previous, current) => {
	return current.dataLifeExpectancy > previous.dataLifeExpectancy ? current : previous;
}).dataLifeExpectancy;

const legendWrapper = d3
	.select("body")
	.append("div")
	.style("display", "flex")
	.style("flex-direction", "column")
	.style("align-items", "center")
	.attr("class", "map");
const legend = legendWrapper
	.append("div")
	.attr("class", "legend")
	.style("display", "flex")
	.style("flex-direction", "row");
// set data
const countries = new Map();
data.forEach((d) => {
	countries.set(d.country, d);
});
// create svg
const width2 = 800;
const height2 = 600;
const svgMap = legendWrapper
	.append("svg")
	.attr("width", width2)
	.attr("height", height2);
// Map and projection
const projection = d3
	.geoNaturalEarth1()
	.scale(width2 / 1.3 / Math.PI - 50)
	.translate([width2 / 2, height2 / 2]);
// color interval
const intervalsCount = 9; // max value is 9
const domainInterval = yMax / intervalsCount;
const intervals = [];
for (let i = 0; i <= intervalsCount; i++) {
	if (i != 0) {
		intervals.push(i * domainInterval);
	}
}
// color scale
const colorScale = d3
	.scaleThreshold()
	.domain([...intervals])
	.range(d3.schemeBlues[intervalsCount]);
// Load external data and boot
d3.json(
	"https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
).then(function (topo) {
	// Dessine la map
	svgMap
		.append("g")
		.selectAll("path")
		.data(topo.features)
		.join("path")
		.attr("fill", function (d) {
			return colorScale(countries.get(d.properties.name)?.dataLifeExpectancy);
		})
		.attr("d", d3.geoPath().projection(projection))
		.style("stroke", "#fff");
});

let i = 0;
intervals.forEach((d) => {
	legend
		.append("div")
		.style("background-color", colorScale(d))
		.style("width", "50px")
		.style("height", "30px")
		.style("display", "flex")
		.style("justify-content", "center")
		.style("align-items", "center")
		.append("text")
		.text(intervals[i].toFixed(1))
		.style("color", "white");
	i++;
});
legend
	.append("div")
	.style("width", "50px")
	.style("background-color", "black")
	.style("height", "30px")
	.style("display", "flex")
	.style("justify-content", "center")
	.style("align-items", "center")
	.append("text")
	.text("no data")
	.style("color", "white");


	//exercice c

	const popTotale = [];
const espDeVie = [];
const pib = [];

for (let index = 1800; index <= 2100; index++) {
  
    population_totale.forEach(element => {
    let tabPays = []
    tabPays.push(element['country']);
    tabPays.push(element[index]); //taille du cercle proportionnelle à ça //chiffre nbr population 
    
    popTotale.push(tabPays);
    });
  
    population_totale.forEach(element => {
    let tabPays = []
    tabPays.push(element['country']);
    tabPays.push(element[index]);
    
    espDeVie.push(tabPays);
    });

    
    population_totale.forEach(element => {
    let tabPays = []
    tabPays.push(element['country']);
    tabPays.push(element[index]);
    
    pib.push(tabPays);
    });


}

//Créer les axes X et Y
const div3 = d3.select("#partie3");


const svg3 = div3.append('svg')
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


svg3.append('g')
   .attr("transform", "translate(20," + height + ")")
   .call(axeX);

svg3.append('g')
   .attr("transform", "translate(20, 0)")   
   .call(axeY);

popTotale.forEach(annee => {
  selection.data(popTotale)
  .join(enter => enter              
    .append('circle')              
    .attr('cx', d => d.valeur) 
    .attr('cy', d => d.valeur)
    .attr('r', d => d.valeur),    
        update => update            
        .append('circle')              
        .attr('cx', d => d.valeur) 
        .attr('cy', d => d.valeur)
        .attr('r', d => d.valeur),      
        exit => exit              
    .remove()              
    )
    .append('circle');
})