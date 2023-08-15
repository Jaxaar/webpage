<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>


<template>
    <div>
		<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
		
        <div class="container mx-auto">

            <div>"Helpful Things"</div>
            <div class="btn-group" role="group" v-for="item of ['A', 'B', 'C', 'D', 'E', 'R']">
                <input type="checkbox" :id="item + 'box'" @click="togglePerson(item)">
                <label :for="item + 'box'">{{ item }}</label>
            </div>

            <div>
                <button type="button" class="btn btn-primary" @click="generatePairings()">
                    GeneratePairs
                </button>
            </div>
            <div class="pair-section">
                <div class="pair-header">
                    Pairings:
                </div>
                <div class="pairs" id="pairs">
					<div v-for="item of pairs" class = "pair-group">
						<div @click="onFencerClicked"> {{ item[0] }}</div>
						<div @click="onFencerClicked"> {{ item[1] }} </div>
					</div>
				</div>
                <div class="crowd" id="crowd">
					<div class = "spectator"
						v-for="item of crowd"
						> {{ item }}
					</div>
				</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'FencingMain',
	components: {
		
	},
    data () {
      	return {
			people: [],
			pairs: [],
			crowd: [],
	  	}
    },
	methods: {
		togglePerson(str){
			if (this.people.includes(str)) {
				this.people.splice(this.people.indexOf(str), 1)
			}
			else {
				this.people.push(str)
			}
			console.log(this.people)
		},
		getPeople(){
			return JSON.parse(JSON.stringify(this.people))
		},
		generatePairings(){
			let options = this.getPeople();
			options = this.shuffleArray(options);

			const groupSize = 2
			this.pairs = this.groupFencers(options, groupSize);
			this.crowd = options
		},
		// from user ashleedawg at https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
		shuffleArray(array){
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			return array
		},
		groupFencers(options, chunkSize) {
			const groups = [];
			while (options.length >= chunkSize) {
				const chunk = options.splice(0, chunkSize);
				groups.push(chunk);
			}
			return groups;
		},
		toggleClass(node, cl) {
			const oppCl = cl === 'full' ? 'hide' : 'full';
			if (node.classList.contains(cl)) {
				node.classList.remove(cl);
			} else {
				node.classList.add(cl);
			};
			if (node.classList.contains(oppCl)) {
				node.classList.remove(oppCl);
			}
		},
		onFencerClicked(event) {
			const node = event.target;
			const opponentNode = !!node.nextElementSibling ? node.nextElementSibling : node.previousElementSibling;
			this.toggleClass(node, 'full');
			this.toggleClass(opponentNode, 'hide');
		}
	},
}

</script>

<style scoped>
.pair-group {
  min-height: 75px;
  max-height: 150px;
  width: 100%;
  display: flex;
  overflow: hidden;
}

.pair {
  text-align: center;
  line-height: 5rem;
  font-size: large;
  width: 50%;
  transition: width 0.40s 0s ease-in-out;
}

.pair.full {
  width: 100%;
}

.pair:hover {
  cursor: pointer;
}

.pair.hide {
  width: 0%;
  transition: width 0.5s 0 ease-in-out;
}

.pair.left {
  background-color:red;
}

.pair.right {
  background-color:rgb(37, 214, 37);
}

</style>
