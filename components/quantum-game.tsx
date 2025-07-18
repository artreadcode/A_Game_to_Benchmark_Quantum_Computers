"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, Target, Trophy } from "lucide-react"

interface QuantumGameProps {
  device: any
  gameState: any
  onStartGame: () => void
  onMakeGuess: (pairName: string) => void
  onResetGame: () => void
  onGameComplete?: (finalState: any) => void
}

export function QuantumGame({
  device,
  gameState,
  onStartGame,
  onMakeGuess,
  onResetGame,
  onGameComplete,
}: QuantumGameProps) {
  const calculateEntanglement = (oneProb: number) => {
    if (oneProb === null || oneProb === undefined) return 0
    return Math.min((2 * Math.asin(Math.sqrt(Math.max(0, Math.min(1, oneProb)))) * 2) / Math.PI, 1)
  }

  const getQubitValue = (qubitId: number) => {
    if (!gameState.gameData || gameState.gameData[qubitId] === null || gameState.gameData[qubitId] === undefined) {
      return device.example[qubitId] || 0.25
    }
    return gameState.gameData[qubitId]
  }

  const isPairGuessed = (pairName: string) => gameState.guessedPairs.includes(pairName)
  const isPairCorrect = (pairName: string) => gameState.correctPairs.includes(pairName)

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Quantum Pairing Game
            </span>
            {gameState.isGameActive && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Round {gameState.round}
                </Badge>
                <Badge className="flex items-center gap-1 text-xs">
                  <Trophy className="h-3 w-3" />
                  {gameState.score}/{gameState.correctPairs.length}
                </Badge>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {!gameState.isGameActive ? (
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Find the entangled qubit pairs! Click on the connection lines (edges) to make your guesses.
              </p>
              <p className="text-sm text-gray-500">
                Qubits with similar values are likely to be paired. You can deselect wrong guesses and keep trying!
              </p>
              <Button onClick={onStartGame} className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Game
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Instructions:</strong> Click on the connection lines (edges) in the visualization to make your
                  guesses.
                </p>
                <p>Paired qubits should have similar values. Click wrong guesses again to deselect them!</p>
                <p className="text-xs text-blue-600 mt-2">
                  Round completes when you find all {gameState.algorithmSolution.length} correct pairs.
                </p>
              </div>

              <div className="flex justify-center gap-2">
                <Button onClick={onResetGame} variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset Game
                </Button>
              </div>

              {gameState.guessedPairs.length === gameState.correctPairs.length && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-bold text-lg">Round Complete!</h3>
                  <p>
                    Score: {gameState.score}/{gameState.correctPairs.length}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Accuracy: {((gameState.score / gameState.correctPairs.length) * 100).toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
