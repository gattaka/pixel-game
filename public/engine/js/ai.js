var Lich;
(function (Lich) {
    var NeuralNetwork = (function () {
        function NeuralNetwork(inputsCount, hiddenCount, outputsCount) {
            this.inputsCount = inputsCount;
            this.hiddenCount = hiddenCount;
            this.outputsCount = outputsCount;
            this.activation = function (x) { return x > 0 ? 1 : 0; };
            this.weights = new Array();
        }
        NeuralNetwork.prototype.solutionLength = function () {
            return 1 + this.hiddenCount * this.inputsCount + this.hiddenCount * this.outputsCount;
        };
        NeuralNetwork.prototype.configure = function (weights) {
            if (weights.length != this.solutionLength())
                throw "Wrong length of i/o weight array";
            this.weights = weights;
        };
        NeuralNetwork.prototype.check = function (inputs, outputs) {
            if (inputs.length != this.inputsCount || outputs.length != this.outputsCount)
                throw "Wrong length of i/o check array";
            var preOut = [];
            // hidden layer processing
            for (var h = 0; h < this.hiddenCount; h++) {
                preOut[h] = 0;
                for (var i = 0; i < inputs.length; i++) {
                    preOut[h] += this.activation(inputs[i] * this.weights[1 + h * this.hiddenCount + i] - this.weights[0]);
                }
            }
            // output layer processing
            var fitness = 0;
            for (var o = 0; o < this.outputsCount; o++) {
                var out = 0;
                for (var p = 0; p < preOut.length; p++) {
                    out += this.activation(preOut[p] * this.weights[1 + this.hiddenCount * this.inputsCount + o * this.outputsCount + p] - this.weights[0]);
                }
                // compare
                // MSB je první
                if (out == outputs[o])
                    fitness++;
            }
            return fitness;
        };
        return NeuralNetwork;
    }());
    var Gene = (function () {
        function Gene() {
            this.value = new Array();
            this.fitness = 0;
        }
        return Gene;
    }());
    var GA = (function () {
        function GA(populationSize, maxGenerations, inputsCount, hiddenCount, outputsCount, testInput, testOutput) {
            if (populationSize === void 0) { populationSize = 10; }
            if (maxGenerations === void 0) { maxGenerations = 100; }
            if (inputsCount === void 0) { inputsCount = 2; }
            if (hiddenCount === void 0) { hiddenCount = 4; }
            if (outputsCount === void 0) { outputsCount = 2; }
            if (testInput === void 0) { testInput = [[0, 0], [0, 1], [1, 0], [1, 1]]; }
            if (testOutput === void 0) { testOutput = [[1, 1], [1, 0], [0, 1], [0, 0]]; }
            this.populationSize = populationSize;
            this.maxGenerations = maxGenerations;
            this.testInput = testInput;
            this.testOutput = testOutput;
            this.bestFitness = 0;
            this.nn = new NeuralNetwork(inputsCount, hiddenCount, outputsCount);
            this.bestPossibleFitness = inputsCount * testInput.length;
        }
        GA.prototype.evaluate = function (gene) {
            this.nn.configure(gene.value);
            var fitness = 0;
            for (var i = 0; i < this.testInput.length; i++) {
                fitness += this.nn.check(this.testInput[i], this.testOutput[i]);
            }
            if (this.bestFitness < fitness) {
                this.bestFitness = fitness;
                this.bestGene = gene;
                console.log("New best fitness %d", fitness);
            }
            gene.fitness = fitness;
        };
        GA.prototype.run = function () {
            // first generation
            // create genes
            this.population = [];
            for (var g = 0; g < this.populationSize; g++) {
                var gene = new Gene();
                // create alleles
                for (var a = 0; a < this.nn.solutionLength(); a++) {
                    gene.value.push(Math.random() - 0.5);
                }
                this.population.push(gene);
            }
            for (var i = 0; i < this.maxGenerations; i++) {
                console.log("Generation %d", i);
                // evaluete fitness
                for (var g = 0; g < this.populationSize; g++) {
                    this.evaluate(this.population[g]);
                }
                // sort
                this.population.sort(function (a, b) {
                    return a.fitness > b.fitness ? 1 : 0;
                });
                // vyber prvních 5 nejlepších a 1 outsidera
                var genePool = this.population.slice(0, 4);
                genePool.push(this.population[this.population.length - 1]);
                this.population = [];
                for (var g = 0; g < this.populationSize / 2; g++) {
                    var a = genePool[Math.floor(Math.random() * genePool.length)];
                    var b = genePool[Math.floor(Math.random() * genePool.length)];
                    // křížení
                    var pointcut = Math.floor(Math.random() * a.value.length);
                    var abGene = new Gene();
                    abGene.value = a.value.slice(0, pointcut).concat(b.value.slice(pointcut, b.value.length));
                    var baGene = new Gene();
                    baGene.value = b.value.slice(0, pointcut).concat(a.value.slice(pointcut, a.value.length));
                    // mutace
                    if (Math.random() > 0.5) {
                        var mutation = Math.floor(Math.random() * abGene.value.length);
                        abGene.value[mutation] = Math.random() - 0.5;
                    }
                    if (Math.random() > 0.5) {
                        var mutation = Math.floor(Math.random() * baGene.value.length);
                        baGene.value[mutation] = Math.random() - 0.5;
                    }
                    this.population.push(abGene);
                    this.population.push(baGene);
                }
            }
            console.log("Best fitness %d", this.bestFitness);
            console.log("Best gene: ", this.bestGene);
            console.log("Best gene evaluation: ");
            this.nn.configure(this.bestGene.value);
            for (var i = 0; i < this.testInput.length; i++) {
                console.log("\t [%s] %d", this.testInput[i].toString(), this.nn.check(this.testInput[i], this.testOutput[i]));
            }
            console.log("Best possible fitness %d", this.bestPossibleFitness);
        };
        return GA;
    }());
    Lich.GA = GA;
})(Lich || (Lich = {}));
