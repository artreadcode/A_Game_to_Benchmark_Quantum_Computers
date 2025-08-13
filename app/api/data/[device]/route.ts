import { type NextRequest, NextResponse } from "next/server"
import { readdir } from "fs/promises"
import { join } from "path"

export async function GET(request: NextRequest, { params }: { params: { device: string } }) {
  try {
    const device = params.device
    // Fix: Use the correct path to the public/data directory
    const dataPath = join(process.cwd(), "public", "data", device)

    // console.log(`Looking for files in: ${dataPath}`)

    // Read the directory
    const files = await readdir(dataPath)

    // Filter for .txt files that start with oneProbs or sameProbs
    const relevantFiles = files.filter((file) => {
      const lowerName = file.toLowerCase()
      return file.endsWith(".txt") && (lowerName.startsWith("oneprobs") || lowerName.startsWith("sameprobs"))
    })

    // console.log(`Found relevant files:`, relevantFiles)

    return NextResponse.json({ files: relevantFiles })
  } catch (error) {
    console.error(`Error reading directory for device ${params.device}:`, error)
  }

  return NextResponse.json({ files: [], error: "Directory not found" }, { status: 404 })
}
