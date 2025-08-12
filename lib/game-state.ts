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
  dataType?: "oneProbs" | "sameProbs"
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

  startGame(
    puzzleResult: {
      oneProb: number[]
      algorithmSolution: string[]
      matchingPairs: string[]
      pairSimilarities: Record<string, number>
      dataType?: "oneProbs" | "sameProbs"
    },
    fileType?: "oneProbs" | "sameProbs",
  ): void {
    this.state = {
      ...this.getInitialState(),
      oneProb: puzzleResult.oneProb,
      algorithmSolution: puzzleResult.algorithmSolution,
      pairSimilarities: puzzleResult.pairSimilarities,
      originalMatching: puzzleResult.matchingPairs,
      isGameActive: true,
      targetPairs: puzzleResult.algorithmSolution.length,
      dataType: fileType || puzzleResult.dataType || "oneProbs",
    }
  }

  makeGuess(pairName: string): { roundComplete: boolean; roundResult?: RoundResult } {
    if (!this.state.isGameActive || this.state.guessedPairs.includes(pairName) || this.state.roundComplete) {
      return { roundComplete: false }
    }
    
    const isCorrect = this.state.algorithmSolution.includes(pairName)
    const newGuessedPairs = [...this.state.guessedPairs, pairName]
    
    if (isCorrect) {
      this.state.guessedPairs = newGuessedPairs
      this.state.roundScore += 1
    } else {
      this.state.guessedPairs = newGuessedPairs
      this.state.wrongGuesses = [...this.state.wrongGuesses, pairName]
    }
    
    const allAlgorithmPairsFound = this.state.algorithmSolution.every((correctPair) =>
      this.state.guessedPairs.includes(correctPair),
    )

    if (allAlgorithmPairsFound) {
      return this.completeRound()
    }

    return { roundComplete: false }
  }

  // --- NEW: Function to automatically solve the round ---
  revealSolution(): { roundComplete: boolean; roundResult?: RoundResult } {
    if (!this.state.isGameActive || this.state.roundComplete) {
      return { roundComplete: false }
    }
    
    // Select all correct pairs and award max score for the round
    this.state.guessedPairs = [...this.state.algorithmSolution]
    this.state.wrongGuesses = []
    this.state.roundScore = this.state.algorithmSolution.length
    
    return this.completeRound()
  }

  private completeRound(): { roundComplete: boolean; roundResult: RoundResult } {
    const isGameComplete = this.state.round >= this.state.maxRounds
    this.state.roundComplete = true
    this.state.totalScore += this.state.roundScore
    this.state.roundScores.push(this.state.roundScore)
    
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
  
  nextRound(puzzleResult?: {
    oneProb: number[]
    algorithmSolution: string[]
    matchingPairs: string[]
    pairSimilarities: Record<string, number>
    dataType?: "oneProbs" | "sameProbs"
  }): boolean {
    if (this.state.round >= this.state.maxRounds) {
      this.state.isGameActive = false
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
    return this.state.algorithmSolution.includes(pairName)
  }

  deselectPair(pairName: string): { success: boolean } {
    if (!this.state.isGameActive || this.state.roundComplete) {
      return { success: false }
    }

    const isPairGuessed = this.state.guessedPairs.includes(pairName)
    const isPairCorrect = this.isPairCorrect(pairName)

    if (isPairGuessed) {
      this.state.guessedPairs = this.state.guessedPairs.filter((p) => p !== pairName)

      if (isPairCorrect) {
        this.state.roundScore = Math.max(0, this.state.roundScore - 1)
      } else {
        this.state.wrongGuesses = this.state.wrongGuesses.filter((p) => p !== pairName)
      }
      return { success: true }
    }

    return { success: false }
  }
}