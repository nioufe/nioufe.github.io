/**
 * Created by Adrien on 30/06/2014.
 */

var Graph = {};
(function () {
    var color = function (name) {
        var colors = {
            'SOCIAL': '#bdccd4',
            'BUSINESS': '#c72727',
            'ECOMMERCE': '#b8b3aa',
            'EMPLOI': '#fbb584',
            'MEDIA': '#cea08f',
            'SERVICE': '#5b7092'
        }
        return colors[name];
    }

    // Chrome 15 bug: <http://code.google.com/p/chromium/issues/detail?id=98951>
    var m0, svg;

    Graph.init = function () {
        var w = $('.su_center').width(),
            h = $('.su_center').height(),
            rx = w / 2,
            ry = h / 2,
            rotate = 0;
        var cluster = d3.layout.cluster()
            .size([360, ry - 120])
            .sort(function (a, b) {
                if(!a.metric || !b.metric){
                    return d3.ascending(a.name, b.name);
                }
                return d3.ascending(a.metric, b.metric);
            });

        var partition = d3.layout.partition()
            .size([2 * Math.PI, 0])
            .sort(function (a, b) {
                return d3.ascending(a.name, b.name);
            })
            .value(function () {
                return 1;
            });


        var bundle = d3.layout.bundle();

        var line = d3.svg.line.radial()
            .interpolate("bundle")
            .tension(.85)
            .radius(function (d) {
                return d.y;
            })
            .angle(function (d) {
                return d.x / 180 * Math.PI;
            });

        var arc = d3.svg.arc()
            .startAngle(function (d) {
                console.log(d);
                return (d.x + 0.0445);
            })
            .endAngle(function (d) {
                return (d.x + d.dx + 0.0445);
            })
            .innerRadius(function (d) {
                return (ry - 90);
            })
            .outerRadius(function (d) {
                return (ry - 120);
            });
        var div = d3.select(".su_center").insert("div")
            .style("width", w + "px")
            .style("height", h + "px")
            .style("position", "absolute")
            .style("-webkit-backface-visibility", "hidden");

        svg = div.append("svg:svg")
            .attr("width", w)
            .attr("height", h)
            .append("svg:g")
            .attr("transform", "translate(" + rx + "," + ry + ")");

        svg.append("svg:path")
            .attr("class", "arc")
            .attr("d", d3.svg.arc().outerRadius(ry - 120).innerRadius(0).startAngle(0).endAngle(2 * Math.PI))
            .on("mousedown", mousedown);

        d3.json("json/startup_fin.json", function (startups) {
            var partitionRoot = Startups.root(startups);
            var partitionNodes = partition.nodes(partitionRoot);

            var partitions = svg.selectAll("g.partition")
                .data(partitionNodes.filter(function (d) {
                    return d.depth === 1;
                }));
            partitions.enter()
                .append('svg:g')
                .attr('class', 'partition')
                .append("svg:path")
                .attr('d', arc)
                .attr('id', function (d, i) {
                    return ("part" + i);
                })
                .attr('class', 'partition')
                .style("fill", function (d) {
                    return color(d.name);
                })
                .style("fill-rule", "evenodd");

            partitions.append('svg:text')
                .attr("x", 6)
                .attr("dy", -10)
                .append("textPath")
                .attr("stroke", "white")
                .style("fill", "white")
                .attr("xlink:href", function (d, i) {
                    console.log(d);
                    return ("#part" + i)
                })
                .text(function (d) {
                    return d.name
                });


        });

        d3.json("json/startup_fin.json", function (startups) {
            var root = Startups.root(startups);
            var nodes = cluster.nodes(root);

            var links = Startups.keywords(nodes);
            var splines = bundle(links);

            var path = svg.selectAll("path.link")
                .data(links)
                .enter().append("svg:path")
                .attr("class", function (d) {
                    return "link source-" + d.source.Screen_name + " target-" + d.target.Screen_name;
                })
                .attr("d", function (d, i) {
                    return line(splines[i]);
                })
                .attr("stroke-width", function (d) {
                    return d.keywords.length;
                });

            svg.selectAll("g.node")
                .data(nodes.filter(function (n) {
                    if(n.metric === 0){
                        console.log(n);
                    }
                    return !n.children;
                }))
                .enter().append("svg:g")
                .attr("class", "node")
                .attr("id", function (d) {
                    return "node-" + d.Screen_name;
                })
                .attr("transform", function (d) {
                    return "rotate(" + (d.x - 90) + ")translate(" + (d.metric + d.y + 50) + ", -6)";
                })
                .append("svg:rect")
                .attr("width", function (d) {
                    return 12 + "px";
                })
                .attr("height", function (d) {
                    return (10 +d.metric) + "px";
                })
                .style("fill", function(d) {
                    return color(d.category);
                })
                .attr("transform", "rotate(90)")
                .on("mouseover", mouseover)
                .on("mouseout", mouseout);

            d3.select("input[type=range]").on("change", function () {
                line.tension(this.value / 100);
                path.attr("d", function (d, i) {
                    return line(splines[i]);
                });
            });

        });



        d3.select(window)
            .on("mousemove", mousemove)
            .on("mouseup", mouseup);
    }
    function mouse(e) {
        return [e.pageX - rx, e.pageY - ry];
    }

    function mousedown() {
        m0 = mouse(d3.event);
        d3.event.preventDefault();
    }

    function mousemove() {
        if (m0) {
            var m1 = mouse(d3.event),
                dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI;
            div.style("-webkit-transform", "translateY(" + (ry - rx) + "px)rotateZ(" + dm + "deg)translateY(" + (rx - ry) + "px)");
        }
    }

    function mouseup() {
        if (m0) {
            var m1 = mouse(d3.event),
                dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI;

            rotate += dm;
            if (rotate > 360) rotate -= 360;
            else if (rotate < 0) rotate += 360;
            m0 = null;

            div.style("-webkit-transform", null);

            svg
                .attr("transform", "translate(" + rx + "," + ry + ")rotate(" + rotate + ")")
                .selectAll("g.node text")
                .attr("dx", function (d) {
                    return (d.x + rotate) % 360 < 180 ? 8 : -8;
                })
                .attr("text-anchor", function (d) {
                    return (d.x + rotate) % 360 < 180 ? "start" : "end";
                })
                .attr("transform", function (d) {
                    return (d.x + rotate) % 360 < 180 ? null : "rotate(180)";
                });
        }
    }

    function mouseover(d) {
        UIPanels.changeStartup(d);
        svg.select('#node-' + d.Screen_name)
            .classed('current', true)
            .attr('stroke', 'white')
            .attr('stroke-width', '3');
        svg.selectAll("path.link.target-" + d.Screen_name)
            .classed("target", true)
            .style("stroke", color(d.category))
            .each(updateNodes("source", true));

        svg.selectAll("path.link.source-" + d.Screen_name)
            .classed("source", true)
            .style("stroke", color(d.category))
            .each(updateNodes("target", true));
    }

    function mouseout(d) {
        svg.select('#node-' + d.Screen_name)
            .classed('current', false)
            .attr('stroke', '');
        svg.selectAll("path.link.source-" + d.Screen_name)
            .classed("source", false)
            .style("stroke", '')
            .each(updateNodes("target", false));

        svg.selectAll("path.link.target-" + d.Screen_name)
            .classed("target", false)
            .style("stroke", '')
            .each(updateNodes("source", false));
    }

    function updateNodes(name, value) {
        return function (d) {
            if (value) this.parentNode.appendChild(this);
            svg.select("#node-" + d[name].Screen_name).classed(name, value);
        };
    }

    function cross(a, b) {
        return a[0] * b[1] - a[1] * b[0];
    }

    function dot(a, b) {
        return a[0] * b[0] + a[1] * b[1];
    }
})();