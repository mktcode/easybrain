# Pinky

Pinky is a handy little helper for creating simple neural networks for evolutionary learning.

```shell
npm i pinky
```

```javascript
import Brain from 'pinky'

const brain = new Brain();

brain.decide([0.1]); // 0.5074881911277771
brain.rewire();
brain.decide([0.1]); // 0.557956874370575
```

By default there's just 1 input, 1 output, and 2 neurons in between. Not very much.

```javascript
const biggerBrain = new Brain(4, 2, [32, 32])
```

This brain has now 4 inputs, 2 outputs and 2 layers of 32 neurons in between. Enough to learn a simple game.

```javascript
function playTurn(p1, p2) {
  const oldDistance = getDistance(p1, p2)

  const [x, y] = brain.decide([
    p1.x,
    p1.y,
    p2.x,
    p2.y,
  ])

  moveTo(x, y)

  const newDistance = getDistance(p1, p2)
  if (newDistance > oldDistance) {
    const diviation = newDistance / MAX_DISTANCE; 
    brain.rewire(diviation)
  }
}
```

or

```javascript
const generation = []
for (let i = 0; i < 100; i++) {
  const brain = new Brain(4, 1, [16, 16, 16])
  brain.rewire(Math.random(), 1)
  generation.push(brain)
}

const results = []
generation.forEach(agent => {
  const result = playGame(agent)
  results.push({ agent, result })
})

results.sort((a, b) => b.result - a.result)

const betterHalf = results.slice(0, results.length / 2).map(r => r.agent)
const newChallengers = [...betterHalf]
newChallengers.forEach(agent => agent.rewire(0.01))

const newGeneration = [...betterHalf, ...newChallengers]
```