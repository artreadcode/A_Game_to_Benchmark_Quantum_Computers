export interface DataFileInfo {
  displayName: string
  fileName: string
  fileType: "oneProbs" | "sameProbs"
  metadata: {
    move?: string
    shots?: number
    simulated?: boolean
  }
  sampleData?: {
    oneProbs?: number[]
    sameProbs?: Record<string, number>
  }
}

export interface HardwareDataSet {
  oneProbs?: number[][]
  sameProbs?: Record<string, number>[]
  device: string
  shots: number
  isSimulated: boolean
  move: string
  displayName: string
  fileType: "oneProbs" | "sameProbs"
  sampleData?: {
    oneProbs?: number[]
    sameProbs?: Record<string, number>
  }
}

export class HardwareDataLoader {
  private static dataCache = new Map<string, HardwareDataSet>()
  private static availableFiles = new Map<string, DataFileInfo[]>()

  static async loadDeviceData(deviceName: string, selectedFile: DataFileInfo): Promise<HardwareDataSet | null> {
    const cacheKey = `${deviceName}_${selectedFile.fileName}`

    if (this.dataCache.has(cacheKey)) {
      return this.dataCache.get(cacheKey)!
    }

    try {
      const baseUrl = `/data/${deviceName}`
      const fileUrl = `${baseUrl}/${selectedFile.fileName}`

      const data = await this.loadDataFile(fileUrl)
      if (!data) {
        return null
      }

      const dataSet: HardwareDataSet = {
        device: deviceName,
        shots: selectedFile.metadata.shots || 8192,
        isSimulated: selectedFile.metadata.simulated || false,
        move: selectedFile.metadata.move || "Unknown",
        displayName: selectedFile.displayName,
        fileType: selectedFile.fileType,
        sampleData: selectedFile.sampleData,
      }

      // Handle different file types
      if (selectedFile.fileType === "oneProbs") {
        dataSet.oneProbs = data
      } else if (selectedFile.fileType === "sameProbs") {
        dataSet.sameProbs = data
      }

      this.dataCache.set(cacheKey, dataSet)
      return dataSet
    } catch (error) {
      console.error(`Error loading data for ${deviceName}:`, error)
      return null
    }
  }

  static async discoverAvailableFiles(deviceName: string): Promise<DataFileInfo[]> {
    const cacheKey = `files_${deviceName}`
    if (this.availableFiles.has(cacheKey)) {
      return this.availableFiles.get(cacheKey)!
    }

    const files: DataFileInfo[] = []

    console.log(`=== DISCOVERING FILES FOR ${deviceName} ===`)

    try {
      // Use API route to get file list
      const apiUrl = `/api/data/${deviceName}`
      console.log(`Fetching file list from: ${apiUrl}`)

      const response = await fetch(apiUrl)
      console.log(`API response status: ${response.status}`)

      if (response.ok) {
        const data = await response.json()
        console.log(`API response data:`, data)

        const txtFiles = data.files || []
        console.log(`Found files:`, txtFiles)

        // Create file info for each file
        for (const fileName of txtFiles) {
          console.log(`Processing file: ${fileName}`)
          const fileInfo = await this.createFileInfo(`/data/${deviceName}`, fileName)
          if (fileInfo) {
            files.push(fileInfo)
            console.log(`Added file: ${fileName}`)
          }
        }
      } else {
        console.log(`API request failed with status: ${response.status}`)
      }
    } catch (error) {
      console.error(`Error during file discovery:`, error)
    }

    console.log(`Final discovered files: ${files.length}`)
    console.log(`=== END FILE DISCOVERY ===`)

    this.availableFiles.set(cacheKey, files)
    return files
  }

  private static async createFileInfo(baseUrl: string, fileName: string): Promise<DataFileInfo | null> {
    try {
      const fileType = this.determineFileType(fileName)
      const metadata = this.parseFileMetadata(fileName)

      const fileInfo: DataFileInfo = {
        displayName: fileName,
        fileName: fileName,
        fileType: fileType,
        metadata: metadata,
      }

      // Load sample data for better display name
      try {
        const sampleData = await this.loadSampleDataForFile(baseUrl, fileName, fileType)
        if (sampleData) {
          fileInfo.sampleData = sampleData
          fileInfo.displayName = this.generateDisplayNameWithSample(fileName, sampleData, fileType)
        }
      } catch (error) {
        fileInfo.displayName = this.generateBasicDisplayName(fileName, fileType)
      }

      return fileInfo
    } catch (error) {
      console.warn(`Failed to create file info for ${fileName}:`, error)
      return null
    }
  }

  private static determineFileType(fileName: string): "oneProbs" | "sameProbs" {
    const lowerName = fileName.toLowerCase()
    if (lowerName.startsWith("oneprobs")) {
      return "oneProbs"
    } else if (lowerName.startsWith("sameprobs")) {
      return "sameProbs"
    }
    throw new Error(`Unknown file type for ${fileName}`)
  }

  private static async loadSampleDataForFile(
    baseUrl: string,
    fileName: string,
    fileType: "oneProbs" | "sameProbs",
  ): Promise<{ oneProbs?: number[]; sameProbs?: Record<string, number> } | null> {
    try {
      const response = await fetch(`${baseUrl}/${fileName}`)
      if (!response.ok) return null

      const text = await response.text()
      const firstLine = text.split("\n")[0]

      const data = JSON.parse(
        firstLine.replace(/'/g, '"').replace(/True/g, "true").replace(/False/g, "false").replace(/None/g, "null"),
      )

      if (fileType === "oneProbs") {
        const firstExperiment = Array.isArray(data) && Array.isArray(data[0]) ? data[0] : data
        return { oneProbs: firstExperiment }
      } else if (fileType === "sameProbs") {
        const firstExperiment = Array.isArray(data) && data[0] ? data[0] : data
        return { sameProbs: firstExperiment }
      }

      return null
    } catch (error) {
      return null
    }
  }

  private static generateDisplayNameWithSample(
    fileName: string,
    sampleData: { oneProbs?: number[]; sameProbs?: Record<string, number> },
    fileType: "oneProbs" | "sameProbs",
  ): string {
    const metadata = this.parseFileMetadata(fileName)
    const parts: string[] = []

    parts.push(fileType === "oneProbs" ? "OneProbs" : "SameProbs")

    if (metadata.move) parts.push(`Move: ${metadata.move}`)
    if (metadata.shots) parts.push(`Shots: ${metadata.shots.toLocaleString()}`)
    if (metadata.simulated !== undefined) {
      parts.push(metadata.simulated ? "Simulated" : "Real Hardware")
    }

    if (fileType === "oneProbs" && sampleData.oneProbs) {
      const preview = sampleData.oneProbs
        .slice(0, 3)
        .map((x) => (x * 100).toFixed(0) + "%")
        .join(", ")
      parts.push(`[${preview}...]`)
    } else if (fileType === "sameProbs" && sampleData.sameProbs) {
      const keys = Object.keys(sampleData.sameProbs).slice(0, 3).join(", ")
      parts.push(`Pairs: ${keys}...`)
    }

    return parts.join(" | ")
  }

  private static generateBasicDisplayName(fileName: string, fileType: "oneProbs" | "sameProbs"): string {
    const metadata = this.parseFileMetadata(fileName)
    const parts: string[] = []

    parts.push(fileType === "oneProbs" ? "OneProbs" : "SameProbs")

    if (metadata.move) parts.push(`Move: ${metadata.move}`)
    if (metadata.shots) parts.push(`Shots: ${metadata.shots.toLocaleString()}`)
    if (metadata.simulated !== undefined) {
      parts.push(metadata.simulated ? "Simulated" : "Real Hardware")
    }

    return parts.length > 1 ? parts.join(" | ") : fileName
  }

  private static parseFileMetadata(fileName: string): { move?: string; shots?: number; simulated?: boolean } {
    const metadata: { move?: string; shots?: number; simulated?: boolean } = {}

    const moveMatch = fileName.match(/move[=_]([A-Z])/i)
    if (moveMatch) metadata.move = moveMatch[1]

    const shotsMatch = fileName.match(/shots[=_](\d+)/i)
    if (shotsMatch) metadata.shots = Number.parseInt(shotsMatch[1])

    const simMatch = fileName.match(/sim[=_](true|false)/i)
    if (simMatch) metadata.simulated = simMatch[1].toLowerCase() === "true"

    return metadata
  }

  private static async loadDataFile(url: string): Promise<any[] | null> {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        return null
      }

      const text = await response.text()
      const lines = text
        .trim()
        .split("\n")
        .filter((line) => line.trim())

      const data = lines
        .map((line) => {
          try {
            const jsData = line
              .replace(/'/g, '"')
              .replace(/True/g, "true")
              .replace(/False/g, "false")
              .replace(/None/g, "null")

            return JSON.parse(jsData)
          } catch (parseError) {
            return null
          }
        })
        .filter((item) => item !== null)

      return data.length > 0 ? data : null
    } catch (error) {
      return null
    }
  }

  static async checkDataAvailability(deviceName: string): Promise<{
    realData: boolean
    simulatedData: boolean
    availableFiles: DataFileInfo[]
  }> {
    const availableFiles = await this.discoverAvailableFiles(deviceName)

    const result = {
      realData: false,
      simulatedData: false,
      availableFiles,
    }

    for (const file of availableFiles) {
      if (file.metadata.simulated === false) {
        result.realData = true
      } else if (file.metadata.simulated === true) {
        result.simulatedData = true
      } else {
        result.realData = true
      }
    }

    return result
  }
}
