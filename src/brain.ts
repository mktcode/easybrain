import * as tf from '@tensorflow/tfjs';

export class Brain {
  public model: tf.Sequential;
  public inputSize: number;
  public outputSize: number;
  public neurons: number[];
  
  constructor(inputSize: number = 1, outputSize: number = 1, neurons: number[] = [2]) {
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    this.neurons = neurons;
    this.model = tf.sequential();

    for (let i = 0; i < this.neurons.length; i++) {
      if (i === 0) {
        this.model.add(tf.layers.dense({ units: this.neurons[i], inputShape: [this.inputSize] }));
      } else {
        this.model.add(tf.layers.dense({ units: this.neurons[i] }));
      }
    }

    this.model.add(tf.layers.dense({ units: outputSize, activation: 'sigmoid' }));

    this.model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
  }
  
  public decide(input: number[]) {
    const inputTensor = tf.tensor1d(input).reshape([1, this.inputSize]);
    const output = this.model.predict(inputTensor) as tf.Tensor;
    const outputValue = output.dataSync();
    
    return outputValue;
  }
  
  public rewire(diviation = 0.1, probability = 0.1) {
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
