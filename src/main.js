


//Initialization
var main = {};
var options = ["a", "b", "c", "d", "e", "r", "d2?"]


main.generatePairings = function() {
    options = ["a", "b", "c", "d", "e", "r", "d2"]
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