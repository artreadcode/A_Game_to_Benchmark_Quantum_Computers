import type { QuantumDevice } from "./quantum-device"
import { MatchingAlgorithm } from "./matching-algorithm"

export interface PuzzleResult {
  oneProb: number[]
  algorithmSolution: string[]
  matchingPairs: string[]
  pairSimilarities: Record<string, number> // NEW
}

export class QuantumSimulator {
  private device: QuantumDevice

  constructor(device: QuantumDevice) {
    this.device = device
  }

  generateNewPuzzle(): PuzzleResult {
    const matchingPairs = MatchingAlgorithm.getDisjointPairs(this.device.pairs, [], {})

    const appliedGates: Record<string, number> = {}
    for (const p of matchingPairs) {
      const frac = (0.1 + 0.9 * Math.random()) / 2
      appliedGates[p] = frac
    }

    const oneProb = this.simulateQuantumCircuit(appliedGates)

    // NEW: Calculate similarities for all pairs
    const pairSimilarities = MatchingAlgorithm.calculateAllSimilarities(this.device.pairs, oneProb)
    const algorithmSolution = MatchingAlgorithm.getDisjointPairs(this.device.pairs, oneProb, {})

    return {
      oneProb,
      algorithmSolution,
      matchingPairs,
      pairSimilarities, // NEW
    }
  }

  private simulateQuantumCircuit(appliedGates: Record<string, number>): number[] {
    const oneProb: number[] = [...this.device.exampleValues]

    for (const [pairName, frac] of Object.entries(appliedGates)) {
      const qubits = this.device.getPairQubits(pairName)
      if (!qubits) continue

      const [q1, q2] = qubits
      if (oneProb[q1] !== null && oneProb[q2] !== null) {
        const targetOneProb = Math.sin((frac * Math.PI) / 2) ** 2

        const baseNoise = 0.005
        const noise1 = (Math.random() - 0.5) * baseNoise
        const noise2 = noise1 + (Math.random() - 0.5) * baseNoise * 0.1

        oneProb[q1] = Math.max(0, Math.min(1, targetOneProb + noise1))
        oneProb[q2] = Math.max(0, Math.min(1, targetOneProb + noise2))
      }
    }

    return oneProb
  }
}
