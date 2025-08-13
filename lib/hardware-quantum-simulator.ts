import type { QuantumDevice } from "./quantum-device"
import { MatchingAlgorithm } from "./matching-algorithm"
import { HardwareDataLoader, type HardwareDataSet, type DataFileInfo } from "./data-loader"

export interface HardwarePuzzleResult {
  oneProb: number[]
  algorithmSolution: string[]
  matchingPairs: string[]
  pairSimilarities: Record<string, number>
  isRealHardware: boolean
  roundNumber: number
  totalRounds: number
  dataType: "oneProbs" | "sameProbs"
  benchmarkInfo?: {
    hardwareScore: number
    optimalPairCount: number
  }
}

export class HardwareQuantumSimulator {
  private device: QuantumDevice
  private hardwareData: HardwareDataSet | null = null
  private currentRound = 0
  private useRealHardware = false

  constructor(device: QuantumDevice) {
    this.device = device
  }

  async initialize(useRealHardware = false, selectedFile?: DataFileInfo): Promise<boolean> {
    this.useRealHardware = useRealHardware
    this.currentRound = 0;

    if (useRealHardware && selectedFile) {
      const deviceKey = this.getDeviceKey()
      const data = await HardwareDataLoader.loadDeviceData(deviceKey, selectedFile)

      if (!data) {
        // console.warn(`Failed to load selected data file for ${deviceKey}`)
        this.useRealHardware = false
        return false
      }

      this.hardwareData = data;

      // console.log(`Loaded hardware data: ${this.hardwareData.displayName} (${this.hardwareData.fileType})`)

      if (this.hardwareData.fileType == "sameProbs") {
        const oneProbsFileName = selectedFile.fileName.replace("sameProbs", "oneProbs");
        const oneProbsFile = await HardwareDataLoader.discoverAvailableFiles(deviceKey).then((files) =>
          files.find((f) => f.fileName == oneProbsFileName),
        )
        if (oneProbsFile) {
          const oneProbsData = await HardwareDataLoader.loadDeviceData(deviceKey, oneProbsFile);
          if (oneProbsData) {
            this.hardwareData.oneProbs = oneProbsData.oneProbs;
          }
        }
      }
      return true
    }

    this.hardwareData = null
    return true
  }

  private getDeviceKey(): string {
    const deviceMap: Record<string, string> = {
      "IBM Torino": "ibm_torino",
      "IBM Kyiv": "ibm_kyiv",
      "IBM Fez": "ibm_fez",
      "IBM QX4": "ibmqx4",
      "IBM QX5": "ibmqx5",
      "IBM QX2": "ibmqx2",
      "Rigetti 19Q-Acorn": "19Q-Acorn",
      "Rigetti 8Q-Agave": "8Q-Agave",
    }

    return deviceMap[this.device.name] || this.device.name.toLowerCase().replace(/\s+/g, "_")
  }

  generateNewPuzzle(): HardwarePuzzleResult {
    if (this.useRealHardware && this.hardwareData) {
      return this.generateHardwarePuzzle()
    } else {
      return this.generateSimulatedPuzzle()
    }
  }

  private generateHardwarePuzzle(): HardwarePuzzleResult {
    if (!this.hardwareData) {
      throw new Error("No hardware data available");
    }

    // Always process oneProbs for node colors.
    const processedOneProb = this.processOneProbsData();
    let pairSimilarities: Record<string, number> = {};
    let algorithmSolution: string[] = [];
    let benchmarkInfo: any = undefined;

    // If the primary data source is sameProbs, use it for edges and the algorithm.
    // Otherwise, calculate similarities from the oneProbs data.
    if (this.hardwareData.fileType === "sameProbs" && this.hardwareData.sameProbs) {
      const sameProbsResult = this.processSameProbsSimple();
      pairSimilarities = sameProbsResult.pairSimilarities;
      algorithmSolution = sameProbsResult.algorithmSolution;
      benchmarkInfo = sameProbsResult.benchmarkInfo;
    } else {
      pairSimilarities = MatchingAlgorithm.calculateAllSimilarities(this.device.pairs, processedOneProb);
      algorithmSolution = MatchingAlgorithm.getDisjointPairs(this.device.pairs, processedOneProb, {});
    }

    const matchingPairs = Object.keys(pairSimilarities);

    return {
      oneProb: processedOneProb, // Always uses the correct oneProb data.
      algorithmSolution,
      matchingPairs,
      pairSimilarities, // Based on sameProbs if available, otherwise calculated.
      isRealHardware: true,
      roundNumber: this.currentRound++,
      totalRounds: 8,
      dataType: this.hardwareData.fileType,
      benchmarkInfo,
    };
  }

  private processSameProbsSimple(): {
    oneProb: number[]
    pairSimilarities: Record<string, number>
    algorithmSolution: string[]
    benchmarkInfo: {
      simulatedScore: number
      hardwareScore: number
      optimalPairCount: number
    }
  } {
    if (!this.hardwareData?.sameProbs) {
      throw new Error("No sameProbs data available")
    }

    const totalDataSets = this.hardwareData.sameProbs.length
    const maxHardwareRounds = Math.min(8, totalDataSets)
    const dataSetIndex = this.currentRound % maxHardwareRounds
    const sameProbData = this.hardwareData.sameProbs[dataSetIndex]

    console.log(`=== SAMEPROBS SIMPLE PROCESSING ROUND ${this.currentRound} ===`)
    console.log(`Processing data set ${dataSetIndex}:`, sameProbData)

    const expectedPairCount = Math.floor(this.device.qubitCount / 2);
    // const expectedPairCount = MatchingAlgorithm.getDisjointPairs(this.device.pairs, [], {}).length
    console.log(`Expected pair count based on device topology: ${expectedPairCount}`)
    // --- END: THE FIX ---

    const pairSimilarities: Record<string, number> = {}
    const correlationScores: Array<{ pairName: string; score: number; sameProb: number }> = []

    if (Array.isArray(sameProbData) && sameProbData.length > 0) {
      const dataObject = sameProbData[0]
      console.log(`Using first data object:`, dataObject)

      if (typeof dataObject === "object" && dataObject !== null) {
        for (const [pairName, sameProbValue] of Object.entries(dataObject)) {
          if (typeof sameProbValue === "number") {
            const correlationScore = sameProbValue
            pairSimilarities[pairName] = sameProbValue
            correlationScores.push({
              pairName,
              score: correlationScore,
              sameProb: sameProbValue,
            })
          }
        }
      }
    }

    correlationScores.sort((a, b) => b.score - a.score)
    /*
    console.log("=== CORRELATION RANKING ===")
    correlationScores.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.pairName}: sameProb=${entry.sameProb.toFixed(3)}, correlation=${entry.score.toFixed(3)}`)
    })
    */
    
    const targetPairCount = Math.max(2, Math.min(expectedPairCount, correlationScores.length))
    console.log(`Target pair count: ${targetPairCount}`)

    const algorithmSolution = this.selectTopDisjointPairs(correlationScores, targetPairCount)
    console.log(`Selected algorithm solution: [${algorithmSolution.join(", ")}]`)

    const hardwareScore = this.calculateHardwareScore(algorithmSolution, correlationScores)
    // We can use a simplified simulated score now
    // const simulatedScore = 1.0 

    console.log(`Hardware score: ${hardwareScore.toFixed(3)}`)
    // console.log(`Simulated score: ${simulatedScore.toFixed(3)}`)

    const sameProbValues: Record<string, number> = {}
    for (const entry of correlationScores) {
      sameProbValues[entry.pairName] = entry.sameProb
    }
    
    return {
      // oneProb,
      pairSimilarities,
      algorithmSolution,
      benchmarkInfo: {
        hardwareScore,
        optimalPairCount: targetPairCount,
      },
    }
  }

  private generateSimulatedBaseline(): {
    algorithmSolution: string[]
    pairSimilarities: Record<string, number>
  } {
    const matchingPairs = MatchingAlgorithm.getDisjointPairs(this.device.pairs, [], {})
    const appliedGates: Record<string, number> = {}
    for (const p of matchingPairs) {
      const frac = (0.1 + 0.9 * Math.random()) / 2
      appliedGates[p] = frac
    }
    const simulatedOneProb = this.simulateQuantumCircuit(appliedGates)
    const pairSimilarities = MatchingAlgorithm.calculateAllSimilarities(this.device.pairs, simulatedOneProb)
    const algorithmSolution = MatchingAlgorithm.getDisjointPairs(this.device.pairs, simulatedOneProb, {})
    return { algorithmSolution, pairSimilarities }
  }

  private selectTopDisjointPairs(
    correlationScores: Array<{ pairName: string; score: number; sameProb: number }>,
    targetCount: number,
  ): string[] {
    const usedQubits = new Set<number>()
    const selectedPairs: string[] = []

    for (const entry of correlationScores) {
      if (selectedPairs.length >= targetCount) break
      const qubits = this.device.getPairQubits(entry.pairName)
      if (!qubits) continue
      const [q1, q2] = qubits
      if (!usedQubits.has(q1) && !usedQubits.has(q2)) {
        selectedPairs.push(entry.pairName)
        usedQubits.add(q1)
        usedQubits.add(q2)
        console.log(`Selected pair ${entry.pairName} (score: ${entry.score.toFixed(3)})`)
      }
    }
    return selectedPairs
  }

  private calculateHardwareScore(
    algorithmSolution: string[],
    correlationScores: Array<{ pairName: string; score: number; sameProb: number }>,
  ): number {
    let totalScore = 0
    for (const pairName of algorithmSolution) {
      const entry = correlationScores.find((e) => e.pairName === pairName)
      if (entry) {
        totalScore += entry.score
      }
    }
    return algorithmSolution.length > 0 ? totalScore / algorithmSolution.length : 0
  }
  
  private processOneProbsData(): number[] {
    if (!this.hardwareData?.oneProbs) {
      throw new Error("No oneProbs data available")
    }

    const totalDataSets = this.hardwareData.oneProbs.length
    const experimentsPerDataSet = Array.isArray(this.hardwareData.oneProbs[0])
      ? this.hardwareData.oneProbs[0].length
      : 1
    const totalExperiments = totalDataSets * experimentsPerDataSet
    const maxHardwareRounds = Math.min(8, totalExperiments)
    const globalRoundIndex = this.currentRound % maxHardwareRounds
    const dataSetIndex = Math.floor(globalRoundIndex / experimentsPerDataSet)
    const experimentIndex = globalRoundIndex % experimentsPerDataSet
    const oneProbDataSet = this.hardwareData.oneProbs[dataSetIndex]
    const oneProb = Array.isArray(oneProbDataSet) ? oneProbDataSet[experimentIndex] : oneProbDataSet

    if (Array.isArray(oneProb) && typeof oneProb[0] === "number") {
      return oneProb
    } else {
      console.warn("Unexpected oneProb format, using device defaults")
      return [...this.device.exampleValues]
    }
  }

  private generateSimulatedPuzzle(): HardwarePuzzleResult {
    const matchingPairs = MatchingAlgorithm.getDisjointPairs(this.device.pairs, [], {})
    const appliedGates: Record<string, number> = {}
    for (const p of matchingPairs) {
      const frac = (0.1 + 0.9 * Math.random()) / 2
      appliedGates[p] = frac
    }
    const oneProb = this.simulateQuantumCircuit(appliedGates)
    const pairSimilarities = MatchingAlgorithm.calculateAllSimilarities(this.device.pairs, oneProb)
    const algorithmSolution = MatchingAlgorithm.getDisjointPairs(this.device.pairs, oneProb, {})

    return {
      oneProb,
      algorithmSolution,
      matchingPairs,
      pairSimilarities,
      isRealHardware: false,
      roundNumber: this.currentRound++,
      totalRounds: Number.POSITIVE_INFINITY,
      dataType: "oneProbs",
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

  resetRound(): void {
    this.currentRound = 0
  }

  getRoundInfo(): { current: number; total: number; isRealHardware: boolean } {
    return {
      current: this.currentRound,
      total: this.useRealHardware ? 8 : Number.POSITIVE_INFINITY,
      isRealHardware: this.useRealHardware,
    }
  }

  static async getDeviceDataInfo(deviceName: string) {
    const deviceMap: Record<string, string> = {
      "IBM Torino": "ibm_torino", "IBM Kyiv": "ibm_kyiv", "IBM Fez": "ibm_fez",
      "IBM QX4": "ibmqx4", "IBM QX5": "ibmqx5", "IBM QX2": "ibmqx2",
      "Rigetti 19Q-Acorn": "19Q-Acorn", "Rigetti 8Q-Agave": "8Q-Agave",
    }
    const deviceKey = deviceMap[deviceName] || deviceName.toLowerCase().replace(/\s+/g, "_")
    return await HardwareDataLoader.checkDataAvailability(deviceKey)
  }
}