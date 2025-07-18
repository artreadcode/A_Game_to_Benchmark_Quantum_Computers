export interface QubitPosition {
  x: number
  y: number
}

export interface DeviceConfig {
  num: number
  area: [number, number]
  entangleType: string
  pairs: Record<string, [number, number]>
  pos: Record<number, [number, number]>
  sdk: string
  description: string
  example: (number | null)[]
}

export class QuantumDevice {
  private config: DeviceConfig

  constructor(config: DeviceConfig) {
    this.config = config
  }

  get name(): string {
    return this.config.description
  }

  get qubitCount(): number {
    return this.config.num
  }

  get pairs(): Record<string, [number, number]> {
    return this.config.pairs
  }

  get positions(): Record<number, [number, number]> {
    return this.config.pos
  }

  get area(): [number, number] {
    return this.config.area
  }

  get entangleType(): string {
    return this.config.entangleType
  }

  get sdk(): string {
    return this.config.sdk
  }

  get exampleValues(): (number | null)[] {
    return this.config.example
  }

  getQubitValue(qubitId: number): number | null {
    return this.config.example[qubitId] ?? null
  }

  getConnectedQubits(qubitId: number): Set<number> {
    const connected = new Set<number>()
    Object.values(this.config.pairs).forEach(([q1, q2]) => {
      if (q1 === qubitId) connected.add(q2)
      if (q2 === qubitId) connected.add(q1)
    })
    return connected
  }

  hasPosition(qubitId: number): boolean {
    return qubitId in this.config.pos
  }

  getPosition(qubitId: number): [number, number] | null {
    return this.config.pos[qubitId] ?? null
  }

  getPairQubits(pairName: string): [number, number] | null {
    return this.config.pairs[pairName] ?? null
  }

  getAllPairNames(): string[] {
    return Object.keys(this.config.pairs)
  }

  canRenderPair(pairName: string): boolean {
    const qubits = this.getPairQubits(pairName)
    if (!qubits) return false
    return this.hasPosition(qubits[0]) && this.hasPosition(qubits[1])
  }
}
