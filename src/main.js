


//Initialization
var main = {};


main.generatePairings = function() {
    var str = "<br>"
    for(var i = 0; i < 10; i++){
        str = str + i + " num" + "<br>"
    }
    document.getElementById('pairData').innerHTML = "Pairings: " + str

}