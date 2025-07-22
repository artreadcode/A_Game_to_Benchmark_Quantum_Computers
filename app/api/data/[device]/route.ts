import { type NextRequest, NextResponse } from "next/server"
import { readdir } from "fs/promises"
import { join } from "path"

export async function GET(request: NextRequest, { params }: { params: { device: string } }) {
  try {
    const device = params.device
    // Fix: Use the correct path to the public/data directory
    const dataPath = join(process.cwd(), "public", "data", device)

    console.log(`Looking for files in: ${dataPath}`)

    // Read the directory
    const files = await readdir(dataPath)

    // Filter for .txt files that start with oneProbs or sameProbs
    const relevantFiles = files.filter((file) => {
      const lowerName = file.toLowerCase()
      return file.endsWith(".txt") && (lowerName.startsWith("oneprobs") || lowerName.startsWith("sameprobs"))
    })

    console.log(`Found relevant files:`, relevantFiles)

    return NextResponse.json({ files: relevantFiles })
  } catch (error) {
    console.error(`Error reading directory for device ${params.device}:`, error)

    // Check if it's a directory not found error
    if (error.code === "ENOENT") {
      console.log(`Directory not found: public/data/${params.device}`)
      console.log(`Current working directory: ${process.cwd()}`)
      console.log(`Full path attempted: ${join(process.cwd(), "public", "data", params.device)}`)
    }

    return NextResponse.json({ files: [], error: "Directory not found" }, { status: 404 })
  }
}
