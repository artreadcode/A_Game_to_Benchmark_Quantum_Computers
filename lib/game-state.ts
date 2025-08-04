export interface GameState {
  round: number
  totalScore: number
  roundScore: number
  roundScores: number[]
  guessedPairs: string[]
  oneProb: number[]
  algorithmSolution: string[]
  pairSimilarities: Record<string, number>
  originalMatching: string[]
  isGameActive: boolean
  roundComplete: boolean
  maxRounds: number
  targetPairs: number
  wrongGuesses: string[]
  dataType?: "oneProbs" | "sameProbs" // Track data type for different logic
}

export interface RoundResult {
  round: number
  score: number
  total: number
  correctPairs: string[]
  playerGuesses: string[]
  isGameComplete: boolean
}

export class GameManager {
  private state: GameState

  constructor() {
    this.state = this.getInitialState()
  }

  private getInitialState(): GameState {
    return {
      round: 1,
      totalScore: 0,
      roundScore: 0,
      roundScores: [],
      guessedPairs: [],
      oneProb: [],
      algorithmSolution: [],
      pairSimilarities: {},
      originalMatching: [],
      isGameActive: false,
      roundComplete: false,
      maxRounds: 8,
      targetPairs: 0,
      wrongGuesses: [],
      dataType: "oneProbs",
    }
  }

  getState(): GameState {
    return { ...this.state }
  }

  startGame(puzzleResult: {
    oneProb: number[]
    algorithmSolution: string[]
    matchingPairs: string[]
    pairSimilarities: Record<string, number>
    dataType?: "oneProbs" | "sameProbs"
  }): void {
    this.state = {
      ...this.getInitialState(),
      oneProb: puzzleResult.oneProb,
      algorithmSolution: puzzleResult.algorithmSolution,
      pairSimilarities: puzzleResult.pairSimilarities,
      originalMatching: puzzleResult.matchingPairs,
      isGameActive: true,
      targetPairs: puzzleResult.algorithmSolution.length,
      dataType: puzzleResult.dataType || "oneProbs",
    }

    console.log("=== GAME STARTED ===")
    console.log("Data type:", this.state.dataType)
    console.log("Algorithm solution:", puzzleResult.algorithmSolution)
    console.log("Pair similarities:", puzzleResult.pairSimilarities)
    console.log("Target pairs:", puzzleResult.algorithmSolution.length)
  }

  makeGuess(pairName: string): { roundComplete: boolean; roundResult?: RoundResult } {
    if (!this.state.isGameActive || this.state.guessedPairs.includes(pairName) || this.state.roundComplete) {
      return { roundComplete: false }
    }

    const newGuessedPairs = [...this.state.guessedPairs, pairName]
    const similarity = this.state.pairSimilarities[pairName] || 0.5

    // Different logic for different data types
    let isCorrect = false
    if (this.state.dataType === "sameProbs") {
      // For sameProbs: check if this pair is in the algorithm solution
      isCorrect = this.state.algorithmSolution.includes(pairName)
    } else {
      // For oneProbs: use similarity threshold
      const threshold = 0.15
      isCorrect = similarity <= threshold
    }

    console.log(`=== GUESS: ${pairName} ===`)
    console.log(`Data type: ${this.state.dataType}`)
    console.log(`Similarity: ${similarity.toFixed(3)}, Correct: ${isCorrect}`)
    console.log(`Algorithm solution: [${this.state.algorithmSolution.join(", ")}]`)

    if (isCorrect) {
      this.state.guessedPairs = newGuessedPairs
      this.state.roundScore += 1
      console.log(`✅ Correct! Score: ${this.state.roundScore}/${this.state.targetPairs}`)
    } else {
      this.state.guessedPairs = newGuessedPairs
      this.state.wrongGuesses = [...this.state.wrongGuesses, pairName]
      console.log(`❌ Wrong! Score remains: ${this.state.roundScore}/${this.state.targetPairs}`)
    }

    // Check round completion
    const correctGuesses = this.state.guessedPairs.filter((pair) => {
      if (this.state.dataType === "sameProbs") {
        return this.state.algorithmSolution.includes(pair)
      } else {
        const sim = this.state.pairSimilarities[pair] || 1.0
        return sim <= 0.1
      }
    })

    console.log(
      `Correct guesses so far: [${correctGuesses.join(", ")}] (${correctGuesses.length}/${this.state.algorithmSolution.length})`,
    )

    // Round is complete when all algorithm solution pairs are found
    const allAlgorithmPairsFound = this.state.algorithmSolution.every((correctPair) => {
      return this.state.guessedPairs.includes(correctPair)
    })

    console.log(`All algorithm pairs found: ${allAlgorithmPairsFound}`)

    if (allAlgorithmPairsFound) {
      const isGameComplete = this.state.round >= this.state.maxRounds

      this.state.roundComplete = true
      this.state.totalScore += this.state.roundScore
      this.state.roundScores.push(this.state.roundScore)

      console.log(`🎉 ROUND COMPLETE! Final score: ${this.state.roundScore}/${this.state.targetPairs}`)

      const roundResult: RoundResult = {
        round: this.state.round,
        score: this.state.roundScore,
        total: this.state.targetPairs,
        correctPairs: this.state.algorithmSolution,
        playerGuesses: this.state.guessedPairs,
        isGameComplete,
      }

      return { roundComplete: true, roundResult }
    }

    return { roundComplete: false }
  }

  nextRound(puzzleResult?: {
    oneProb: number[]
    algorithmSolution: string[]
    matchingPairs: string[]
    pairSimilarities: Record<string, number>
    dataType?: "oneProbs" | "sameProbs"
  }): boolean {
    if (this.state.round >= this.state.maxRounds) {
      this.state.isGameActive = false
      this.state.guessedPairs = []
      this.state.roundComplete = false
      return false
    }

    if (puzzleResult) {
      this.state.round += 1
      this.state.roundScore = 0
      this.state.guessedPairs = []
      this.state.wrongGuesses = []
      this.state.oneProb = puzzleResult.oneProb
      this.state.algorithmSolution = puzzleResult.algorithmSolution
      this.state.pairSimilarities = puzzleResult.pairSimilarities
      this.state.originalMatching = puzzleResult.matchingPairs
      this.state.roundComplete = false
      this.state.targetPairs = puzzleResult.algorithmSolution.length
      this.state.dataType = puzzleResult.dataType || "oneProbs"

      console.log(`=== ROUND ${this.state.round} STARTED ===`)
      console.log("Data type:", this.state.dataType)
      console.log("New algorithm solution:", puzzleResult.algorithmSolution)
    }

    return true
  }

  resetGame(): void {
    this.state = this.getInitialState()
  }

  isPairGuessed(pairName: string): boolean {
    return this.state.guessedPairs.includes(pairName)
  }

  isPairCorrect(pairName: string): boolean {
    if (this.state.dataType === "oneProbs") {
      return this.state.algorithmSolution.includes(pairName)
    } else {
      const similarity = this.state.pairSimilarities[pairName] || 1.0
      return similarity <= 0.15
    }
  }

  deselectPair(pairName: string): { success: boolean } {
    if (!this.state.isGameActive || this.state.roundComplete) {
      return { success: false }
    }

    const isPairGuessed = this.state.guessedPairs.includes(pairName)
    const isPairCorrect = this.isPairCorrect(pairName)

    if (isPairGuessed) {
      this.state.guessedPairs = this.state.guessedPairs.filter((p) => p !== pairName)

      if (!isPairCorrect) {
        this.state.wrongGuesses = this.state.wrongGuesses.filter((p) => p !== pairName)
      } else {
        this.state.roundScore = Math.max(0, this.state.roundScore - 1)
      }

      console.log(`Deselected ${pairName}. New score: ${this.state.roundScore}`)
      return { success: true }
    }

    return { success: false }
  }
}
