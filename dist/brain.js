"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Brain = void 0;
const tf = __importStar(require("@tensorflow/tfjs"));
class Brain {
    constructor(inputSize = 1, outputSize = 1, neurons = [2]) {
        this.inputSize = inputSize;
        this.outputSize = outputSize;
        this.neurons = neurons;
        this.model = tf.sequential();
        for (let i = 0; i < this.neurons.length; i++) {
            if (i === 0) {
                this.model.add(tf.layers.dense({ units: this.neurons[i], inputShape: [this.inputSize] }));
            }
            else {
                this.model.add(tf.layers.dense({ units: this.neurons[i] }));
            }
        }
        this.model.add(tf.layers.dense({ units: outputSize, activation: 'sigmoid' }));
        this.model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });
    }
    decide(input) {
        const inputTensor = tf.tensor1d(input).reshape([1, this.inputSize]);
        const output = this.model.predict(inputTensor);
        const outputValue = output.dataSync();
        return outputValue;
    }
    rewire(diviation = 0.1, probability = 0.1) {
        const weights = this.model.getWeights();
        const mutatedWeights = [];
        for (let i = 0; i < weights.length; i++) {
            const tensor = weights[i];
            const shape = tensor.shape;
            const values = tensor.dataSync();
            for (let j = 0; j < values.length; j++) {
                if (Math.random() > 1 - probability) {
                    values[j] += (Math.random() - 0.5) * diviation;
                }
            }
            const newTensor = tf.tensor(values, shape);
            mutatedWeights[i] = newTensor;
        }
        this.model.setWeights(mutatedWeights);
    }
}
exports.Brain = Brain;
