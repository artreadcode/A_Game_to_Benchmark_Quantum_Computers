import { HardwareDataLoader } from "./data-loader"

export class DataManager {
  static async validateDataStructure(deviceName: string): Promise<{
    isValid: boolean
    errors: string[]
    info: {
      rounds: number
      shots: number
      hasRealData: boolean
      hasSimData: boolean
    }
  }> {
    const errors: string[] = []
    let isValid = true
    const info = {
      rounds: 0,
      shots: 0,
      hasRealData: false,
      hasSimData: false,
    }

    try {
      const availability = await HardwareDataLoader.checkDataAvailability(deviceName)

      info.hasRealData = availability.realData
      info.hasSimData = availability.simulatedData

      if (availability.realData) {
        const realData = await HardwareDataLoader.loadDeviceData(deviceName, 8192, false)
        if (realData) {
          info.rounds = realData.oneProbs.length
          info.shots = realData.shots

          // Validate data structure
          if (realData.oneProbs.length !== realData.sameProbs.length) {
            errors.push("Mismatch between oneProbs and sameProbs array lengths")
            isValid = false
          }

          if (realData.gates.length < realData.oneProbs.length * 2) {
            errors.push("Insufficient gate data for the number of rounds")
            isValid = false
          }
        }
      }

      if (!availability.realData && !availability.simulatedData) {
        errors.push("No data available for this device")
        isValid = false
      }
    } catch (error) {
      errors.push(`Failed to validate data: ${error}`)
      isValid = false
    }

    return { isValid, errors, info }
  }

  static async preloadDeviceData(deviceNames: string[]): Promise<void> {
    const loadPromises = deviceNames.map(async (deviceName) => {
      try {
        await HardwareDataLoader.loadDeviceData(deviceName, 8192, false)
        await HardwareDataLoader.loadDeviceData(deviceName, 8192, true)
      } catch (error) {
        console.warn(`Failed to preload data for ${deviceName}:`, error)
      }
    })

    await Promise.all(loadPromises)
  }
}
