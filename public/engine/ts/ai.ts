namespace Lich {

    class NeuralNetwork {

        // activation = (x): number => { return x > 0 ? 1 : 0 };
        activation = (x): number => { return 1 / (1 + Math.pow(Math.E, -x)); };

        weights = new Array<number>();
        constructor(private inputsCount: number, private hiddenCount: number, private outputsCount: number) {
        }

        solutionLength() {
            return 1 + this.hiddenCount * this.inputsCount + this.hiddenCount * this.outputsCount;
        }

        configure(weights: Array<number>) {
            if (weights.length != this.solutionLength())
                throw "Wrong length of i/o weight array";
            this.weights = weights;
        }

        check(inputs: Array<number>, outputs: Array<number>): number {
            if (inputs.length != this.inputsCount || outputs.length != this.outputsCount)
                throw "Wrong length of i/o check array";

            let preOut = [];

            // hidden layer processing
            for (let h = 0; h < this.hiddenCount; h++) {
                preOut[h] = 0;
                for (let i = 0; i < inputs.length; i++) {
                    preOut[h] += this.activation(inputs[i] * this.weights[1 + h * this.hiddenCount + i] - this.weights[0]);
                }
            }

            // output layer processing
            let fitness = 0;
            for (let o = 0; o < this.outputsCount; o++) {
                let out = 0;
                for (let p = 0; p < preOut.length; p++) {
                    out += this.activation(preOut[p] * this.weights[1 + this.hiddenCount * this.inputsCount + o * this.outputsCount + p] - this.weights[0]);
                }
                // compare
                // MSB je první
                if (Math.floor(out) == outputs[o])
                    fitness++;
            }

            return fitness;
        }
    }

    class Gene {
        public value = new Array<number>();
        public fitness = 0;
    }

    export class GA {

        population: Array<Gene>;
        generation: number;
        bestFitness: number = 0;
        bestPossibleFitness: number;
        bestGene: Gene;
        nn: NeuralNetwork;

        evaluate(gene: Gene) {
            this.nn.configure(gene.value);
            let fitness = 0;
            for (let i = 0; i < this.testInput.length; i++) {
                fitness += this.nn.check(this.testInput[i], this.testOutput[i]);
            }
            if (this.bestFitness < fitness) {
                this.bestFitness = fitness;
                this.bestGene = gene;
                console.log("New best fitness %d", fitness);
            }
            gene.fitness = fitness;
        }

        constructor(
            private populationSize: number = 10,
            private maxGenerations: number = 100,
            inputsCount: number = 2,
            hiddenCount: number = 4,
            outputsCount: number = 2,
            private testInput: Array<Array<number>> = [[0, 0], [0, 1], [1, 0], [1, 1]],
            private testOutput: Array<Array<number>> = [[1, 1], [1, 0], [0, 1], [0, 0]]
        ) {
            this.nn = new NeuralNetwork(inputsCount, hiddenCount, outputsCount);
            this.bestPossibleFitness = inputsCount * testInput.length;
        }

        getRand(): number {
            return Math.random() - 0.5;
        }


        run() {

            // first generation
            // create genes
            this.population = [];
            for (let g = 0; g < this.populationSize; g++) {
                let gene = new Gene();
                // create alleles
                for (let a = 0; a < this.nn.solutionLength(); a++) {
                    gene.value.push(this.getRand());
                }
                this.population.push(gene);
            }

            for (let i = 0; i < this.maxGenerations; i++) {
                console.log("Generation %d", i);

                // evaluete fitness
                for (let g = 0; g < this.populationSize; g++) {
                    this.evaluate(this.population[g]);
                }

                // sort
                this.population.sort((a: Gene, b: Gene): number => {
                    return a.fitness > b.fitness ? -1 : 1;
                });

                // vyber prvních 5 nejlepších a 1 outsidera
                let genePool = this.population.slice(0, 4);
                genePool.push(this.population[this.population.length - 1]);

                if (i < this.maxGenerations - 1) {
                    this.population = [];
                    for (let g = 0; g < this.populationSize / 2; g++) {
                        let a: Gene = genePool[Math.floor(Math.random() * genePool.length)];
                        let b: Gene = genePool[Math.floor(Math.random() * genePool.length)];

                        // křížení
                        let pointcut = Math.floor(Math.random() * a.value.length);
                        let abGene = new Gene();
                        abGene.value = a.value.slice(0, pointcut).concat(b.value.slice(pointcut, b.value.length));
                        let baGene = new Gene();
                        baGene.value = b.value.slice(0, pointcut).concat(a.value.slice(pointcut, a.value.length));

                        // mutace
                        if (Math.random() > 0.5) {
                            let mutation = Math.floor(Math.random() * abGene.value.length);
                            abGene.value[mutation] = this.getRand();
                        }
                        if (Math.random() > 0.5) {
                            let mutation = Math.floor(Math.random() * baGene.value.length);
                            baGene.value[mutation] = this.getRand();
                        }

                        this.population.push(abGene);
                        this.population.push(baGene);
                    }
                }
            }

            console.log("Best fitness %d", this.bestFitness);
            console.log("Best possible fitness %d", this.bestPossibleFitness);
            console.log("Best gene: ", this.bestGene);
            console.log("Best gene evaluation: ");
            this.nn.configure(this.bestGene.value);
            for (let i = 0; i < this.testInput.length; i++) {
                console.log("\t [%s] %d", this.testInput[i].toString(), this.nn.check(this.testInput[i], this.testOutput[i]));
            }
            console.log("Population: ", this.population);
        }
    }


    // ---------------------------

    export abstract class GA2 {

        population: Array<Gene>;
        generation: number;
        bestFitness: number = 0;
        bestGene: Gene;

        protected abstract evaluate(gene: Gene): number;

        protected abstract getRand();

        constructor(
            private geneLength: number,
            private populationSize: number = 10,
            private maxGenerations: number = 100,
            private bestPossibleFitness?: number,
            private bestPossibleGene?: Gene,
        ) {
        }

        run() {

            // first generation
            // create genes
            this.population = [];
            for (let g = 0; g < this.populationSize; g++) {
                let gene = new Gene();
                // create alleles
                for (let a = 0; a < this.geneLength; a++) {
                    gene.value.push(this.getRand());
                }
                this.population.push(gene);
            }

            for (let i = 0; i < this.maxGenerations; i++) {
                console.log("Generation %d", i);

                // evaluete fitness
                for (let g = 0; g < this.populationSize; g++) {
                    let gene = this.population[g];
                    let fitness = this.evaluate(gene);
                    if (this.bestFitness < fitness) {
                        this.bestFitness = fitness;
                        this.bestGene = gene;
                        console.log("New best fitness %d", fitness);
                    }
                    gene.fitness = fitness;
                }

                // sort
                this.population.sort((a: Gene, b: Gene): number => {
                    return a.fitness > b.fitness ? -1 : 1;
                });

                // vyber prvních 5 nejlepších a 1 outsidera
                let genePool = this.population.slice(0, 4);
                // genePool.push(this.population[this.population.length - 1]);

                if (i < this.maxGenerations - 1) {
                    this.population = [];
                    for (let g = 0; g < this.populationSize / 2; g++) {
                        let a: Gene = genePool[Math.floor(Math.random() * genePool.length)];
                        let b: Gene = genePool[Math.floor(Math.random() * genePool.length)];

                        // křížení
                        let pointcut = Math.floor(Math.random() * a.value.length);
                        let abGene = new Gene();
                        abGene.value = a.value.slice(0, pointcut).concat(b.value.slice(pointcut, b.value.length));
                        let baGene = new Gene();
                        baGene.value = b.value.slice(0, pointcut).concat(a.value.slice(pointcut, a.value.length));

                        // mutace
                        if (Math.random() > 0.5) {
                            let mutation = Math.floor(Math.random() * abGene.value.length);
                            abGene.value[mutation] = this.getRand();
                        }
                        if (Math.random() > 0.5) {
                            let mutation = Math.floor(Math.random() * baGene.value.length);
                            baGene.value[mutation] = this.getRand();
                        }

                        this.population.push(abGene);
                        this.population.push(baGene);
                    }
                }
            }

            console.log("Best fitness %d", this.bestFitness);
            console.log("Best gene: ", this.bestGene.value.toString());
            if (this.bestPossibleFitness && this.bestPossibleGene) {
                console.log("Best possible fitness %d", this.bestPossibleFitness);
                console.log("Best possible gene: ", this.bestPossibleGene.toString());
            }
        }
    }

    export class BackpackGA extends GA2 {

        values = [15, 10, 9, 5, 12, 5];
        weights = [1, 5, 3, 4, 7, 1];
        maxWeight = 10;

        protected getRand(): number {
            return Math.floor(Math.random() * 2);
        }

        protected evaluate(gene: Gene): number {
            let fitness = 0;
            let weight = 0;
            for (let i = 0; i < gene.value.length; i++) {
                if (gene.value[i] == 1) {
                    fitness += this.values[i];
                    weight += this.weights[i];
                    if (weight > this.maxWeight) {
                        return 0;
                    }
                }
            }
            return fitness;
        }

        constructor(populationSize: number = 10, maxGenerations: number = 200) {
            super(6, populationSize, maxGenerations);
        }

    }
}