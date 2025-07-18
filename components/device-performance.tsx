"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Zap, Activity, Cpu, Info } from "lucide-react"

interface DevicePerformanceProps {
  device: any
  selectedDevice: string
}

export function DevicePerformance({ device, selectedDevice }: DevicePerformanceProps) {
  // Calculate performance metrics based on device characteristics
  const calculatePerformanceMetrics = () => {
    const connectivity = Object.keys(device.pairs).length / device.num
    const avgEntanglement =
      device.example && device.example.length > 0
        ? device.example
            .filter((val: any) => val !== null && val !== undefined)
            .reduce((sum: number, val: number) => sum + val, 0) /
          device.example.filter((val: any) => val !== null && val !== undefined).length
        : 0.25 // Default value if no example data

    // Simulate some performance metrics based on device characteristics
    const fidelity = Math.max(0.7, 1 - avgEntanglement * 0.5) * 100
    const coherenceTime = device.num < 10 ? 100 + Math.random() * 50 : 50 + Math.random() * 30
    const gateError = avgEntanglement * 0.01 + Math.random() * 0.005

    return {
      connectivity: connectivity * 100,
      fidelity,
      coherenceTime,
      gateError: gateError * 100,
      avgEntanglement: avgEntanglement * 100,
    }
  }

  const metrics = calculatePerformanceMetrics()

  const getPerformanceColor = (value: number, isError = false) => {
    if (isError) {
      return value < 1 ? "text-green-600" : value < 3 ? "text-yellow-600" : "text-red-600"
    }
    return value > 80 ? "text-green-600" : value > 60 ? "text-yellow-600" : "text-red-600"
  }

  const getProgressColor = (value: number, isError = false) => {
    if (isError) {
      return value < 1 ? "bg-green-500" : value < 3 ? "bg-yellow-500" : "bg-red-500"
    }
    return value > 80 ? "bg-green-500" : value > 60 ? "bg-yellow-500" : "bg-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Device Performance Analysis
          <div className="ml-auto">
            <Badge variant="outline" className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              Educational
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Purpose:</strong> This panel shows simulated performance metrics to help you understand different
            quantum device characteristics. These metrics are educational estimates based on device topology and are not
            real performance data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <Activity className="h-4 w-4" />
                Connectivity
              </span>
              <span className={`text-sm font-bold ${getPerformanceColor(metrics.connectivity)}`}>
                {metrics.connectivity.toFixed(1)}%
              </span>
            </div>
            <Progress value={metrics.connectivity} className="h-2" />
            <p className="text-xs text-gray-500">How well-connected the qubits are</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <Zap className="h-4 w-4" />
                Fidelity
              </span>
              <span className={`text-sm font-bold ${getPerformanceColor(metrics.fidelity)}`}>
                {metrics.fidelity.toFixed(1)}%
              </span>
            </div>
            <Progress value={metrics.fidelity} className="h-2" />
            <p className="text-xs text-gray-500">Accuracy of quantum operations</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <Cpu className="h-4 w-4" />
                Coherence Time
              </span>
              <span className={`text-sm font-bold ${getPerformanceColor(metrics.coherenceTime)}`}>
                {metrics.coherenceTime.toFixed(0)}μs
              </span>
            </div>
            <Progress value={Math.min(100, metrics.coherenceTime)} className="h-2" />
            <p className="text-xs text-gray-500">How long qubits maintain quantum state</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Gate Error Rate</span>
              <span className={`text-sm font-bold ${getPerformanceColor(metrics.gateError, true)}`}>
                {metrics.gateError.toFixed(2)}%
              </span>
            </div>
            <Progress value={Math.min(100, metrics.gateError * 20)} className="h-2" />
            <p className="text-xs text-gray-500">Error rate in quantum gate operations</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Device Characteristics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{device.num}</div>
              <div className="text-xs text-gray-600">Qubits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Object.keys(device.pairs).length}</div>
              <div className="text-xs text-gray-600">Connections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{device.entangleType}</div>
              <div className="text-xs text-gray-600">Gate Type</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metrics.avgEntanglement.toFixed(0)}%</div>
              <div className="text-xs text-gray-600">Avg Entanglement</div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Quality Assessment</h4>
          <div className="flex flex-wrap gap-2">
            {metrics.fidelity > 90 && <Badge className="bg-green-100 text-green-800">High Fidelity</Badge>}
            {metrics.connectivity > 50 && <Badge className="bg-blue-100 text-blue-800">Well Connected</Badge>}
            {metrics.gateError < 1 && <Badge className="bg-purple-100 text-purple-800">Low Error Rate</Badge>}
            {metrics.coherenceTime > 80 && <Badge className="bg-yellow-100 text-yellow-800">Long Coherence</Badge>}
            {device.num > 50 && <Badge className="bg-red-100 text-red-800">Large Scale</Badge>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
