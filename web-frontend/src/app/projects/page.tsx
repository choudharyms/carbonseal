"use client"

import { useState } from "react"
import { 
  MapPin, 
  Leaf, 
  Wind, 
  Droplets, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  AlertTriangle,
  Search,
  ArrowUpRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/layout/Header"

// Mock Data for Projects
const projects = [
  {
    id: "P-101",
    name: "Sundarbans Mangrove Restoration A",
    location: "West Bengal, India",
    type: "Mangrove",
    status: "Verified",
    area: "1,240 Ha",
    carbon: "15,420 BCC",
    developer: "Green Coast NGO",
    image: "from-emerald-400 to-teal-500",
    lastAudit: "2 days ago"
  },
  {
    id: "P-102",
    name: "Kochi Backwaters Blue Carbon",
    location: "Kerala, India",
    type: "Wetland",
    status: "Pending",
    area: "850 Ha",
    carbon: "Est. 9,000 BCC",
    developer: "Kerala Coastal Dept",
    image: "from-cyan-400 to-blue-500",
    lastAudit: "Pending Review"
  },
  {
    id: "P-103",
    name: "Gulf of Mannar Seagrass Bed",
    location: "Tamil Nadu, India",
    type: "Seagrass",
    status: "Verified",
    area: "3,100 Ha",
    carbon: "42,000 BCC",
    developer: "Ocean Watch",
    image: "from-indigo-400 to-purple-500",
    lastAudit: "1 week ago"
  },
  {
    id: "P-104",
    name: "Chilika Lake Conservation",
    location: "Odisha, India",
    type: "Wetland",
    status: "Verified",
    area: "1,800 Ha",
    carbon: "21,500 BCC",
    developer: "EcoOdisha",
    image: "from-blue-400 to-cyan-400",
    lastAudit: "3 days ago"
  },
  {
    id: "P-105",
    name: "Andaman Coral Reef Protection",
    location: "Andaman Islands",
    type: "Coral Reef",
    status: "Review",
    area: "500 Ha",
    carbon: "Est. 6,200 BCC",
    developer: "Island Trust",
    image: "from-rose-400 to-orange-500",
    lastAudit: "Under Audit"
  }
]

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Verified": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Review": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "Mangrove": return <Leaf className="h-4 w-4" />;
      case "Seagrass": return <Wind className="h-4 w-4" />;
      case "Wetland": return <Droplets className="h-4 w-4" />;
      default: return <Leaf className="h-4 w-4" />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-white/40 backdrop-blur-xl border-b border-white/20 py-16 px-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" /> Official Registry
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Active Restoration Projects
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl font-medium">
            Explore verified Blue Carbon projects monitored by real-time satellite imagery and audited on-chain.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 mt-12 space-y-8">
        
        {/* Search Bar */}
        <div className="flex items-center gap-4 bg-white/60 p-2 rounded-2xl border border-white/40 shadow-sm backdrop-blur-md max-w-lg">
          <Search className="ml-3 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Search by name or location..." 
            className="border-0 bg-transparent focus-visible:ring-0 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="group relative overflow-hidden border-white/60 bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="flex flex-col md:flex-row">
                
                {/* Image Section */}
                <div className={`md:w-64 h-48 md:h-auto bg-gradient-to-br ${project.image} relative overflow-hidden flex-shrink-0`}>
                  <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
                  <div className="absolute top-4 left-4">
                     <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase border ${getStatusColor(project.status)}`}>
                       {project.status}
                     </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <span className="flex items-center gap-1 text-blue-600">
                            {getTypeIcon(project.type)} {project.type}
                          </span>
                          <span>•</span>
                          <span>{project.id}</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800">{project.name}</h3>
                      </div>
                      <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                        View Audit <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 text-slate-600 font-medium mb-6">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {project.location}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-bold uppercase">Total Area</div>
                        <div className="text-lg font-black text-slate-700">{project.area}</div>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="text-xs text-emerald-600 font-bold uppercase">Carbon Credit</div>
                        <div className="text-lg font-black text-emerald-700">{project.carbon}</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-bold uppercase">Developer</div>
                        <div className="text-sm font-bold text-slate-700 truncate">{project.developer}</div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-xs text-slate-400 font-bold uppercase">Last Update</div>
                        <div className="text-sm font-bold text-slate-700 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {project.lastAudit}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 md:hidden">
                    <Button className="w-full">View Details</Button>
                  </div>
                </div>

                {/* Action Arrow (Desktop) */}
                <div className="hidden md:flex w-24 border-l border-slate-100 flex-col items-center justify-center bg-slate-50/50 group-hover:bg-blue-50/50 transition-colors cursor-pointer">
                  <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600" />
                  </div>
                </div>

              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}