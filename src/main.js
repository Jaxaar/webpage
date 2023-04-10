document.addEventListener("DOMContentLoaded", () => {
	const checkboxes = document.getElementsByTagName("input");
	for (const element of checkboxes) {
		element.setAttribute('autocomplete', "off");
		element.classList.add('btn-check');
	}
	const checkboxLabels = document.getElementsByTagName("label");
	for (const element of checkboxLabels) {
		element.classList.add('btn', 'btn-outline-primary');
	}
});


//Initialization
var main = {};
// var o = ["a", "b", "c", "d", "e", "r"]
var people = []

main.getPeople = function () {
	return JSON.parse(JSON.stringify(people))
	// return structuredClone(array1);
}

main.togglePerson = function (str) {
	if (people.includes(str)) {
		people.splice(people.indexOf(str), 1)
	}
	else {
		people.push(str)
	}
	console.log(people)
}

{/* Make this structure for each pair:
<div class="pair-group">
    <div class="pair left">Fencer 1</div>
    <div class="pair right">Fencer 2</div>
</div>
*/}
main.generatePairings = function () {
	options = main.getPeople();
	shuffleArray(options);
	const pairsDiv = document.getElementById('pairs');
	const crowdDiv = document.getElementById('crowd');

	const groupedFencers = groupFencers(options, 2);
	const fencersHTML = [];
	var crowd = [];

	for (const fencers of groupedFencers) {
		if (fencers.length == 2) {
			fencersHTML.push(makePairHTML(fencers[0], fencers[1]));
		} else {
			crowd = remainderHTML(fencers);
		}
	}
	pairsDiv.replaceChildren(...fencersHTML);
	crowdDiv.replaceChildren(...crowd);
}

// from user ashleedawg at https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

function groupFencers(options, chunkSize) {
	const groups = [];
	for (let i = 0; i < options.length; i += chunkSize) {
		const chunk = options.slice(i, i + chunkSize);
		groups.push(chunk);
	}
	return groups;
}

function toggleClass(node, cl) {
	const oppCl = cl === 'full' ? 'hide' : 'full';
	if (node.classList.contains(cl)) {
		node.classList.remove(cl);
	} else {
		node.classList.add(cl);
	};
	if (node.classList.contains(oppCl)) {
		node.classList.remove(oppCl);
	}
}

function onFencerClicked(event) {
	const node = event.target;
	const opponentNode = !!node.nextElementSibling ? node.nextElementSibling : node.previousElementSibling;
	toggleClass(node, 'full');
	toggleClass(opponentNode, 'hide');
}

function makePairHTML(leftFencer, rightFencer) {
	const pairGroup = document.createElement("div");
	pairGroup.classList.add('pair-group');
	const left = document.createElement("div");
	left.classList.add('pair', 'left');
	left.addEventListener('click', onFencerClicked);
	left.innerText = leftFencer;
	const right = document.createElement("div");
	right.classList.add('pair', 'right');
	right.addEventListener('click', onFencerClicked);
	right.innerText = rightFencer;
	pairGroup.append(left, right);
	return pairGroup;
}

function remainderHTML(remainder) {
	const crowdElems = [];
	for (const fencer of remainder) {
		const spectator = document.createElement("div");
		spectator.classList.add('spectator');
		spectator.innerText = remainder;
		crowdElems.push(spectator);
	}
	return crowdElems;
}
