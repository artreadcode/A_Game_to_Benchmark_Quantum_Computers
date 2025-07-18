import { QuantumCalculator } from "./quantum-calculator"

export class MatchingAlgorithm {
  static getDisjointPairs(
    pairs: Record<string, [number, number]>,
    oneProb: number[],
    weight: Record<string, number> = {},
  ): string[] {
    // Calculate weights exactly like Python version
    if (Object.keys(weight).length === 0) {
      for (const p in pairs) {
        if (oneProb.length > 0) {
          const [q1, q2] = pairs[p]
          if (oneProb[q1] !== null && oneProb[q2] !== null) {
            const frac1 = QuantumCalculator.calculateFrac(oneProb[q1])
            const frac2 = QuantumCalculator.calculateFrac(oneProb[q2])
            weight[p] = this.calculateFracDifference(frac1, frac2)
          } else {
            weight[p] = 1.0
          }
        } else {
          weight[p] = Math.floor(Math.random() * 100)
        }
      }
    }

    // Convert to maximum weight matching problem (exactly like Python)
    const maxWeight = Math.max(...Object.values(weight))
    const edges: Array<[number, number, number]> = []

    for (const [pairName, [q1, q2]] of Object.entries(pairs)) {
      const edgeWeight = maxWeight + 1 - weight[pairName]
      edges.push([q1, q2, edgeWeight])
    }

    // Build graph and find maximum weight matching
    const graph = this.buildGraph(edges)
    const matching = this.maxWeightMatching(graph)

    // Convert back to pair names (exactly like Python)
    const coords2pair: Record<string, string> = {}
    for (const [pairName, [q1, q2]] of Object.entries(pairs)) {
      coords2pair[`${q1},${q2}`] = pairName
      coords2pair[`${q2},${q1}`] = pairName
    }

    const matchingPairs: string[] = []
    for (const [q1, q2] of matching) {
      const pairKey = `${q1},${q2}`
      const pairName = coords2pair[pairKey]
      if (pairName && !pairName.startsWith("fake")) {
        matchingPairs.push(pairName)
      }
    }

    return matchingPairs
  }

  static calculateAllSimilarities(pairs: Record<string, [number, number]>, oneProb: number[]): Record<string, number> {
    const similarities: Record<string, number> = {}

    for (const [pairName, [q1, q2]] of Object.entries(pairs)) {
      if (oneProb[q1] !== null && oneProb[q2] !== null) {
        const frac1 = QuantumCalculator.calculateFrac(oneProb[q1])
        const frac2 = QuantumCalculator.calculateFrac(oneProb[q2])
        similarities[pairName] = this.calculateFracDifference(frac1, frac2)
      } else {
        similarities[pairName] = 1.0
      }
    }

    return similarities
  }

  // Implement calculateFracDifference exactly like Python
  static calculateFracDifference(frac1: number, frac2: number): number {
    const delta = Math.abs(frac1 - frac2)
    return Math.min(delta, 1 - delta)
  }

  // Simple graph representation
  private static buildGraph(edges: Array<[number, number, number]>): Record<number, Record<number, number>> {
    const graph: Record<number, Record<number, number>> = {}

    for (const [q1, q2, weight] of edges) {
      if (!graph[q1]) graph[q1] = {}
      if (!graph[q2]) graph[q2] = {}
      graph[q1][q2] = weight
      graph[q2][q1] = weight
    }

    return graph
  }

  // Implement maximum weight matching (simplified version that mimics NetworkX behavior)
  private static maxWeightMatching(graph: Record<number, Record<number, number>>): Array<[number, number]> {
    const vertices = Object.keys(graph).map(Number)
    const edges: Array<[number, number, number]> = []

    // Get all edges
    for (const v1 of vertices) {
      for (const v2 of vertices) {
        if (v1 < v2 && graph[v1][v2] !== undefined) {
          edges.push([v1, v2, graph[v1][v2]])
        }
      }
    }

    // Sort by weight (descending) with deterministic tie-breaking
    edges.sort((a, b) => {
      if (Math.abs(a[2] - b[2]) < 1e-10) {
        // Deterministic tie-breaking: use vertex IDs
        if (a[0] !== b[0]) return a[0] - b[0]
        return a[1] - b[1]
      }
      return b[2] - a[2]
    })

    // Greedy matching
    const used = new Set<number>()
    const matching: Array<[number, number]> = []

    for (const [v1, v2, weight] of edges) {
      if (!used.has(v1) && !used.has(v2)) {
        matching.push([v1, v2])
        used.add(v1)
        used.add(v2)
      }
    }

    return matching
  }
}
