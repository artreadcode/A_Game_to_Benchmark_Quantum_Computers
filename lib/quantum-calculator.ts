export class QuantumCalculator {
  static calculateFrac(oneProb: number): number {
    const clampedProb = Math.max(0, Math.min(1, oneProb))
    return (Math.asin(Math.sqrt(clampedProb)) * 2) / Math.PI
  }

  static calculateFracDifference(frac1: number, frac2: number): number {
    const delta = Math.abs(frac1 - frac2)
    return Math.min(delta, 1 - delta)
  }

  static calculatePairSimilarity(val1: number | null, val2: number | null): number {
    if (val1 === null || val2 === null) return 0

    const frac1 = this.calculateFrac(val1)
    const frac2 = this.calculateFrac(val2)
    const difference = this.calculateFracDifference(frac1, frac2)

    return (1 - difference) * 100
  }

  static calculateEntanglement(oneProb: number): number {
    if (oneProb === null || oneProb === undefined) return 0
    return Math.min((2 * Math.asin(Math.sqrt(Math.max(0, Math.min(1, oneProb)))) * 2) / Math.PI, 1)
  }
}
