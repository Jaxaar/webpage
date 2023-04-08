document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.getElementsByTagName("input");
    for(const element of checkboxes) {
        element.setAttribute('autocomplete', "off");
        element.classList.add('btn-check');
    }
    const checkboxLabels = document.getElementsByTagName("label");
    for(const element of checkboxLabels) {
        element.classList.add('btn', 'btn-outline-primary');
    }
    const pairLDemo = document.getElementById('pair-l');
    const pairRDemo = document.getElementById('pair-r');
    pairLDemo.addEventListener('mouseover', onFencerHovered);
    pairLDemo.addEventListener('mouseleave', onFencerUnhovered);
    pairRDemo.addEventListener('mouseover', onFencerHovered);
    pairRDemo.addEventListener('mouseleave', onFencerUnhovered);
});


//Initialization
var main = {};
// var o = ["a", "b", "c", "d", "e", "r"]
var people = []

main.getPeople = function() {
    return JSON.parse(JSON.stringify(people))
    // return structuredClone(array1);
}

main.togglePerson = function(str) {
    if(people.includes(str)){
        people.splice(people.indexOf(str),1)
    }
    else{
        people.push(str)
    }
    console.log(people)
}

{/* Make this structure for each pair:
<div class="pair-group">
    <div class="pair left">E</div>
    <div class="pair right">C</div>
</div> 
*/}
main.generatePairings = function() {
    options = main.getPeople()
    var str = "<br>"
    while(options.length > 3){
        x = Math.floor(Math.random() * options.length)
        str += options.splice(x,1)[0] + ", "

        y = Math.floor(Math.random() * options.length)
        str += options.splice(y,1)[0]
        str += "<br>"
    }

    while(options.length > 0){
        str += options.splice(0,1)[0]
        if(options.length > 0){
            str += ", "
        }
    }


    document.getElementById('pairData').innerHTML = "Pairings: " + str

}

function onFencerHovered(event) {
    const node = event.target;
    const opponentNode = !!node.nextElementSibling ? node.nextElementSibling : node.previousElementSibling;
    opponentNode.classList.add('hide');
}

function onFencerUnhovered(event) {
    const node = event.target;
    const opponentNode = !!node.nextElementSibling ? node.nextElementSibling : node.previousElementSibling;
    opponentNode.classList.remove('hide');
}

function makePairHTML() {
    const pairGroup = document.createElement("div");
    pairGroup.classList.add('pair-group');
    const left = document.createElement("div");
    left.classList.add('pair left');
    left.addEventListener('mouseover', onFencerHovered);
    left.addEventListener('mouseleave', onFencerUnhovered);
    const right = document.createElement("div");
    right.classList.add('pair right');
    right.addEventListener('mouseover', onFencerHovered);
    right.addEventListener('mouseleave', onFencerUnhovered);
    pairGroup.append(left, right);
    return pairGroup;
}
