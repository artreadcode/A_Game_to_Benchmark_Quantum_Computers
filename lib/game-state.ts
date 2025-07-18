export interface GameState {
  round: number
  totalScore: number
  roundScore: number
  roundScores: number[]
  guessedPairs: string[]
  oneProb: number[]
  algorithmSolution: string[]
  pairSimilarities: Record<string, number> // NEW: Store similarity scores
  originalMatching: string[]
  isGameActive: boolean
  roundComplete: boolean
  maxRounds: number
  targetPairs: number
  wrongGuesses: string[]
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
      pairSimilarities: {}, // NEW
      originalMatching: [],
      isGameActive: false,
      roundComplete: false,
      maxRounds: 5,
      targetPairs: 0,
      wrongGuesses: [],
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
  }): void {
    this.state = {
      ...this.getInitialState(),
      oneProb: puzzleResult.oneProb,
      algorithmSolution: puzzleResult.algorithmSolution,
      pairSimilarities: puzzleResult.pairSimilarities, // NEW
      originalMatching: puzzleResult.matchingPairs,
      isGameActive: true,
      targetPairs: puzzleResult.algorithmSolution.length,
    }
  }

  makeGuess(pairName: string): { roundComplete: boolean; roundResult?: RoundResult } {
    if (!this.state.isGameActive || this.state.guessedPairs.includes(pairName) || this.state.roundComplete) {
      return { roundComplete: false }
    }

    const newGuessedPairs = [...this.state.guessedPairs, pairName]

    // Check if this pair is correct using similarity threshold
    const similarity = this.state.pairSimilarities[pairName] || 1.0
    const threshold = 0.15
    const isCorrect = similarity <= threshold

    if (isCorrect) {
      // Correct guess - add to score and guessed pairs
      this.state.guessedPairs = newGuessedPairs
      this.state.roundScore += 1
    } else {
      // Wrong guess - add to guessed pairs but don't increase score
      this.state.guessedPairs = newGuessedPairs
      this.state.wrongGuesses = [...this.state.wrongGuesses, pairName]
    }

    // Check if all correct pairs have been found
    const correctGuesses = this.state.guessedPairs.filter((pair) => {
      const sim = this.state.pairSimilarities[pair] || 1.0
      return sim <= threshold
    })

    // Round is complete when all algorithm solution pairs are correctly guessed
    if (correctGuesses.length >= this.state.algorithmSolution.length) {
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

    return { roundComplete: false }
  }

  nextRound(puzzleResult?: {
    oneProb: number[]
    algorithmSolution: string[]
    matchingPairs: string[]
    pairSimilarities: Record<string, number>
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
    const similarity = this.state.pairSimilarities[pairName] || 1.0
    const threshold = 0.15
    return similarity <= threshold
  }

  deselectPair(pairName: string): { success: boolean } {
    if (!this.state.isGameActive || this.state.roundComplete) {
      return { success: false }
    }

    const isPairGuessed = this.state.guessedPairs.includes(pairName)
    const isPairCorrect = this.isPairCorrect(pairName)

    if (isPairGuessed) {
      // Remove from guessed pairs
      this.state.guessedPairs = this.state.guessedPairs.filter((p) => p !== pairName)

      // Remove from wrong guesses if it was wrong
      if (!isPairCorrect) {
        this.state.wrongGuesses = this.state.wrongGuesses.filter((p) => p !== pairName)
      } else {
        // If it was correct, decrease the score
        this.state.roundScore = Math.max(0, this.state.roundScore - 1)
      }

      return { success: true }
    }

    return { success: false }
  }
}
