"use client"

import { useState, useEffect, useCallback } from "react"
import { io, Socket } from "socket.io-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Play,
  Square,
  Info,
  Circle,
  Wifi,
  WifiOff,
  TrendingUp,
  Activity,
} from "lucide-react"

type ProbabilityData = Record<number, string>

interface Match {
  digit: number
  frequency: number
  lastOccurrence: string
}

function ProbabilityGrid({ probability }: { probability: ProbabilityData }) {
  const digits = Array.from({ length: 10 }, (_, i) => i)

  const getColorClass = (value: string) => {
    const num = parseFloat(value)
    if (num >= 12) return "bg-chart-1/20 border-chart-1 text-chart-1"
    if (num >= 9) return "bg-chart-4/20 border-chart-4 text-chart-4"
    return "bg-muted border-muted-foreground/30 text-muted-foreground"
  }

  return (
    <div className="grid grid-cols-5 gap-3">
      {digits.map((digit) => {
        const value = probability[digit] || "0.0"
        return (
          <div
            key={digit}
            className={cn(
              "flex flex-col items-center justify-center rounded-lg border-2 p-3 transition-all duration-300",
              getColorClass(value)
            )}
          >
            <span className="text-2xl font-bold font-mono">{digit}</span>
            <span className="text-sm font-medium">{value}%</span>
          </div>
        )
      })}
    </div>
  )
}

export default function MatchesAnalyzerDashboard() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [probability, setProbability] = useState<ProbabilityData>({})
  const [price, setPrice] = useState("$0.00000")
  const [strategy, setStrategy] = useState("Even/Odd")
  const [volume, setVolume] = useState("Vol 10 (1s)")
  const [matches, setMatches] = useState<Match[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Initialize socket connection
  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
    const newSocket = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    newSocket.on("connect", () => {
      console.log("[v0] Connected to server")
      setIsConnected(true)
    })

    newSocket.on("disconnect", () => {
      console.log("[v0] Disconnected from server")
      setIsConnected(false)
    })

    newSocket.on("live_update", (data) => {
      setProbability(data.probability)
      setPrice(`$${data.price}`)
      setLastUpdate(new Date(data.timestamp))
    })

    newSocket.on("analysis_started", () => {
      setIsAnalyzing(true)
    })

    newSocket.on("analysis_stopped", () => {
      setIsAnalyzing(false)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  // Generate simulated data when not connected to server
  useEffect(() => {
    if (isConnected) return

    // Simulate live data when no server connection
    const interval = setInterval(() => {
      const newProbability: ProbabilityData = {}
      for (let i = 0; i < 10; i++) {
        newProbability[i] = (Math.random() * 10 + 4.1).toFixed(1)
      }
      setProbability(newProbability)
      setPrice(`$${(Math.random() * 100 + 10).toFixed(5)}`)
      setLastUpdate(new Date())
    }, 2000)

    return () => clearInterval(interval)
  }, [isConnected])

  const handleStart = useCallback(() => {
    if (socket) {
      socket.emit("start_analysis", { strategy })
    }
    setIsAnalyzing(true)
  }, [socket, strategy])

  const handleStop = useCallback(() => {
    if (socket) {
      socket.emit("stop_analysis", {})
    }
    setIsAnalyzing(false)
  }, [socket])

  const handleAnalyzeStrategy = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${apiUrl}/api/strategy/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strategy }),
      })
      const data = await response.json()
      if (data.success) {
        alert(
          `Strategy Analysis: ${data.data.prediction}\nConfidence: ${data.data.confidence}%`
        )
      }
    } catch (error) {
      console.error("[v0] Error analyzing strategy:", error)
      // Simulate response when server unavailable
      const prediction = Math.random() > 0.5 ? "Even" : "Odd"
      const confidence = (Math.random() * 100).toFixed(2)
      alert(`Strategy Analysis: ${prediction}\nConfidence: ${confidence}%`)
    }
  }, [strategy])

  const handleViewMatches = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
      const response = await fetch(`${apiUrl}/api/matches`)
      const data = await response.json()
      if (data.success) {
        setMatches(data.data)
      }
    } catch (error) {
      console.error("[v0] Error fetching matches:", error)
      // Simulate matches when server unavailable
      setMatches([
        { digit: 3, frequency: 45, lastOccurrence: "2 seconds ago" },
        { digit: 7, frequency: 38, lastOccurrence: "5 seconds ago" },
        { digit: 1, frequency: 32, lastOccurrence: "8 seconds ago" },
        { digit: 9, frequency: 28, lastOccurrence: "12 seconds ago" },
      ])
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Matches Analyzer
              </h1>
              <p className="text-sm text-muted-foreground">
                Live Trading Dashboard
              </p>
            </div>
          </div>
          <Badge
            variant={isConnected ? "default" : "secondary"}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5",
              isConnected ? "bg-primary/20 text-primary border-primary/30" : ""
            )}
          >
            {isConnected ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            {isConnected ? "Live" : "Simulated"}
          </Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Volume Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Volume
                  </label>
                  <Select value={volume} onValueChange={setVolume}>
                    <SelectTrigger className="w-full bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vol 10 (1s)">Vol 10 (1s)</SelectItem>
                      <SelectItem value="Vol 20 (2s)">Vol 20 (2s)</SelectItem>
                      <SelectItem value="Vol 50 (5s)">Vol 50 (5s)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Strategy Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Strategy
                  </label>
                  <Select value={strategy} onValueChange={setStrategy}>
                    <SelectTrigger className="w-full bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Even/Odd">Even/Odd</SelectItem>
                      <SelectItem value="Matches">Matches</SelectItem>
                      <SelectItem value="Unmatches">Unmatches</SelectItem>
                      <SelectItem value="Over">Over</SelectItem>
                      <SelectItem value="Under">Under</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Connection Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Connection Status
                  </label>
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary">
                    <span
                      className={cn(
                        "h-3 w-3 rounded-full animate-pulse",
                        isConnected ? "bg-primary" : "bg-chart-4"
                      )}
                    />
                    <span className="text-sm font-medium">
                      {isConnected ? "Live" : "Simulated Data"}
                    </span>
                  </div>
                </div>

                {/* Start/Stop Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleStart}
                    disabled={isAnalyzing}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                  <Button
                    onClick={handleStop}
                    disabled={!isAnalyzing}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </div>

                {/* Action Buttons */}
                <Button
                  onClick={handleAnalyzeStrategy}
                  variant="outline"
                  className="w-full border-border hover:bg-accent"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Analyze Strategy
                </Button>
                <Button
                  onClick={handleViewMatches}
                  variant="outline"
                  className="w-full border-border hover:bg-accent"
                >
                  <Circle className="h-4 w-4 mr-2" />
                  View Matches
                </Button>
              </CardContent>
            </Card>

            {/* Matches Display */}
            {matches.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Recent Matches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {matches.map((match, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold font-mono text-primary">
                            {match.digit}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {match.lastOccurrence}
                          </span>
                        </div>
                        <Badge variant="secondary" className="font-mono">
                          {match.frequency}x
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Probability Grid */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Live Digit Probability Distribution
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Dynamic percentages • Range: 4.1% - 15.0% • Updates every 2
                      seconds
                    </p>
                  </div>
                  {isAnalyzing && (
                    <Badge className="bg-primary/20 text-primary border-primary/30 animate-pulse">
                      Analyzing...
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ProbabilityGrid probability={probability} />
                {lastUpdate && (
                  <p className="text-xs text-muted-foreground mt-4 text-right">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Live Price Display */}
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-primary/10 via-card to-chart-2/10 p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Live Price
                      </p>
                      <p className="text-4xl font-bold font-mono text-foreground">
                        {price}
                      </p>
                    </div>
                    <div className="p-4 rounded-full bg-primary/10">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold font-mono text-primary">
                    {strategy}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Strategy</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold font-mono text-chart-2">
                    {volume.split(" ")[1]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Volume</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold font-mono text-chart-4">
                    {matches.length || 4}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Matches</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="p-4 text-center">
                  <p
                    className={cn(
                      "text-2xl font-bold font-mono",
                      isAnalyzing ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {isAnalyzing ? "Active" : "Idle"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Status</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
