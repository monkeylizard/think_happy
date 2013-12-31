window.onload = function() {

var w = window.innerWidth;
var h = window.innerHeight;
var buf = 50;

svg = d3.select("body")
    .append("svg")
    .attr("height", h)
    .attr("width", w)
    .attr("id", "svgMain");

// generates a random number in an inclusive range

var rand_int = function(low, high) {
    base = Math.random()
    return Math.floor( base * (high + 1 - low) ) + low;
}

// CRUD functions for letters

var create_let = function(letter, coord, name, color) {
    label = ".C" + rand_int(0, 8000);
    
    lett = svg.selectAll(label)
	.data([letter])
	.enter()
	.append("text")
	.attr("id", name)
	.attr("x", coord[0])
	.attr("y", coord[1])
	.text(letter)
	.attr("font-family", "sans-serif")
	.attr("fill", color)
	.attr("opacity", 0);

    lett.transition().duration(1000).delay(900).attr("opacity", 1);
    return lett;
}

var get_let = function(name) {

    lett = svg.selectAll("#" + name);
    return lett;
}

var move_let = function(lett, new_name, new_x, new_y) {

    lett.transition()
	.duration(1000)
	.attr("id", new_name)
	.attr("x", new_x)
	.attr("y", new_y);
    return lett;
}

var kill_let = function(lett) {
    lett.transition()
	.attr("opacity", 0)
	.duration(300).remove()
}


// Placing sentences

var coord_maker = function(sentence) {

    var endl = w - buf;

    if ( sentence.length * 25 + buf < endl ) {
	return function(index) {
	    var x = buf + index * 25;
	    var y = h / 4;
	    return [x, y];
	}
    } else {
	var cutoff = Math.floor((endl - buf) / 25);
	var line_break = cutoff;
	for ( i = cutoff; i >= 0; i-- ) {
	    if ( sentence[i] == " " ) {
		cutoff = i;
		break;
	    }
	}
	return function(index) {
	    var base_x = buf + index * 25;
	    if ( index <= cutoff ) {
		var x = base_x;
		var y = h / 4;
	    } else {
		var x = ( base_x - cutoff * 25 ) + 2 * buf;
		var y = ( h / 4 ) + 25;
	    }
	    return [x, y];
	}
    }
}

var is_in = function (thing, list) {
    for ( k = 0; k < list.length; k++ ) {
	if ( list[k] == thing ) { return true; }
    }
    return false;
}


var draw_sentence = function(sentence, indices, color) {
    var coords = coord_maker(sentence);
    var counter_index = []
    for ( i = 0; i < indices.length; i++ ) {
	if ( indices[i] != -1 ) {
	    counter_index.push(indices[i]);
	}
    }
    
    for ( i = 0; i < sentence.length; i++ ) {
	if ( !is_in(i, counter_index ) ) {
	    name = "A" + i;
	    create_let(sentence[i], coords(i), name, color);
	}
    }
}


// Find overlap


var get_shared = function(sen1, sen2) {

    var indices = [];

    for ( i = 0; i < sen1.length; i++ ) {
	check = false;
	for ( j = 0; j < sen2.length; j++ ) {
	    if (sen1[i] === sen2[j] && !is_in(j, indices)) {
		indices.push(j);
		check = true;
		break;
	    }
	}
	if ( !check ) {
	    indices.push(-1);
	}
    }
    
    return indices;
}


// Remove non-shared letters

var kill_old = function(indices) {

    for ( i = 0; i < indices.length; i++ ) {
	if ( indices[i] === -1 ) {
	    lett = get_let("A" + i);
	    kill_let(lett);
	}
    }
}

// Move shared letters

var move_old = function(new_sentence, indices) {

    coords = coord_maker(new_sentence);

    for ( i = 0; i < indices.length; i++ ) {
	if ( indices[i] !== -1 ) {
	    lett = get_let("A" + i);
	    new_name = "A" + indices[i];
	    new_coords = coords(indices[i]);
	    move_let(lett, new_name, new_coords[0], new_coords[1]);
	}
    }
}

// Combine all these to replace one sentence with another

var replace = function(sen1, sen2, color, reset) {
    indices = get_shared(sen1, sen2);
    kill_old(indices);
    move_old(sen2, indices);
    draw_sentence(sen2, indices, color);
}

// Timekeeping

    var mark_time = function() {
	var last_time = new Date();
	var time_div = document.getElementById("click_time");
	time_div.innerHTML = last_time.getTime();
	return time_div.innerHTML;
    }

    var get_time = function() {
	var time_div = document.getElementById("click_time");
	return time_div.innerHTML
    }

    var what_time = function() {
	var this_time = new Date();
	return this_time.getTime();
    }

//

sentences = [];
colors = ["green", "blue", "red"];
sen = 0;
col = 0;

    lsst = document.getElementsByClassName("thinks");
    console.log(lsst);
    for (i = 0; i < lsst.length; i++) {
	sentences.push(lsst[i].innerHTML.toUpperCase());
    }

initial_indices = []
draw_sentence(sentences[0], initial_indices, colors[colors.length-1]);
mark_time();

	
last_time = svg.on("click", function(last_time) {
    var last_time = get_time();
    var this_time = mark_time();
    if ( this_time - last_time > 1000) {
	old_sen = sentences[sen % sentences.length];
	new_sen = sentences[(sen + 1) % sentences.length];
	new_col = colors[col % colors.length];
	replace(old_sen, new_sen, new_col);
	sen++;
	col++;
	letts = svg.selectAll("text");
	//console.log(letts);
    }
    return this_time;
});


}