


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