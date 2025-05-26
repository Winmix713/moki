"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Palette,
  Layers,
  Box,
  Search,
  Grid,
  List,
  Crown,
  X,
  Download,
  Undo,
  Redo,
  Settings,
  Eye,
  EyeOff,
  Heart,
  MessageCircle,
  Share2,
  Star,
  RotateCw,
  Sparkles,
  Maximize2,
  Circle,
  Square,
  Copy,
  FileText,
  ImageIcon,
  Code,
  Shuffle,
} from "lucide-react"

// ==================== TYPES ====================

interface CardData {
  id: string
  type: string
  title: string
  description: string
  bgGradientFrom: string
  bgGradientTo: string
  bgOpacityFrom: string
  bgOpacityTo: string
  iconGradientFrom: string
  iconGradientTo: string
  shadowColor: string
  shadowOpacity: string
  enableHoverEffects: boolean
  enableAnimations: boolean
  cardWidth: string
  cardHeight: string
  cardPadding: string
  cardBorderWidth: string
  cardBorderStyle: string
  cardBorderColor: string
  cardBorderOpacity: string
  cardBorderRadius: {
    topLeft: string
    topRight: string
    bottomLeft: string
    bottomRight: string
    unit: string
  }
  cardOpacity: number
  shadowSettings: {
    inset: boolean
    x: string
    y: string
    blur: string
    spread: string
  }
  shadow2Settings: {
    inset: boolean
    x: string
    y: string
    blur: string
    spread: string
    color: string
    opacity: string
  }
  titleFont?: string
  titleSize?: number
  titleWeight?: string
  titleAlign?: string
  descriptionFont?: string
  descriptionSize?: number
  descriptionWeight?: string
  descriptionAlign?: string
  rotation?: number
  scaleX?: number
  scaleY?: number
  blur?: number
  brightness?: number
  contrast?: number
  saturation?: number
}

interface Template {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  preview: string
  author: string
  downloads: number
  rating: number
  isPremium: boolean
  createdAt: string
  data: Partial<CardData>
}

interface CardStyle {
  width: number
  height: number | "auto"
  background: string
  borderRadius: number
  border: string
  boxShadow: string
  padding: number
  backdropFilter: string
  opacity: number
  color: string
  transform?: string
}

// ==================== TEMPLATES DATA ====================

const templates: Template[] = [
  {
    id: "modern-business",
    name: "Modern Business",
    category: "Business",
    description: "Clean and professional design perfect for corporate presentations",
    tags: ["professional", "clean", "corporate", "minimal"],
    preview: "/templates/modern-business.png",
    author: "Design Studio",
    downloads: 1250,
    rating: 4.8,
    isPremium: false,
    createdAt: "2024-01-15",
    data: {
      type: "business",
      title: "John Anderson",
      description: "Senior Product Manager",
      bgGradientFrom: "#667eea",
      bgGradientTo: "#764ba2",
      bgOpacityFrom: "0.9",
      bgOpacityTo: "0.7",
      cardWidth: "350",
      cardHeight: "200",
      cardBorderRadius: {
        topLeft: "12",
        topRight: "12",
        bottomLeft: "12",
        bottomRight: "12",
        unit: "px",
      },
      shadowSettings: {
        inset: false,
        x: "0",
        y: "8",
        blur: "25",
        spread: "0",
      },
      shadowColor: "#667eea",
      shadowOpacity: "0.3",
    },
  },
  {
    id: "social-gradient",
    name: "Social Gradient",
    category: "Social Media",
    description: "Eye-catching gradient design for social media posts",
    tags: ["social", "gradient", "colorful", "engaging"],
    preview: "/templates/social-gradient.png",
    author: "Creative Team",
    downloads: 2100,
    rating: 4.9,
    isPremium: false,
    createdAt: "2024-01-20",
    data: {
      type: "social",
      title: "Follow Us Today!",
      description: "Join our community for daily inspiration",
      bgGradientFrom: "#ff6b6b",
      bgGradientTo: "#feca57",
      bgOpacityFrom: "1",
      bgOpacityTo: "0.8",
      cardWidth: "400",
      cardHeight: "400",
      cardBorderRadius: {
        topLeft: "20",
        topRight: "20",
        bottomLeft: "20",
        bottomRight: "20",
        unit: "px",
      },
      shadowSettings: {
        inset: false,
        x: "0",
        y: "15",
        blur: "35",
        spread: "0",
      },
      shadowColor: "#ff6b6b",
      shadowOpacity: "0.4",
    },
  },
  {
    id: "neon-gaming",
    name: "Neon Gaming",
    category: "Gaming",
    description: "Futuristic cyberpunk design perfect for gaming content",
    tags: ["gaming", "neon", "cyberpunk", "futuristic"],
    preview: "/templates/neon-gaming.png",
    author: "Cyber Studios",
    downloads: 1750,
    rating: 4.9,
    isPremium: true,
    createdAt: "2024-02-01",
    data: {
      type: "gaming",
      title: "CYBER WARRIOR",
      description: "Enter the digital battlefield",
      bgGradientFrom: "#0f0f23",
      bgGradientTo: "#1a1a2e",
      bgOpacityFrom: "1",
      bgOpacityTo: "1",
      cardWidth: "380",
      cardHeight: "220",
      cardBorderWidth: "2",
      cardBorderColor: "#00ffff",
      cardBorderOpacity: "0.8",
      cardBorderRadius: {
        topLeft: "15",
        topRight: "15",
        bottomLeft: "15",
        bottomRight: "15",
        unit: "px",
      },
      shadowSettings: {
        inset: false,
        x: "0",
        y: "0",
        blur: "20",
        spread: "0",
      },
      shadowColor: "#00ffff",
      shadowOpacity: "0.6",
    },
  },
  {
    id: "minimal-portfolio",
    name: "Minimal Portfolio",
    category: "Portfolio",
    description: "Simple and elegant design for creative portfolios",
    tags: ["minimal", "portfolio", "clean", "elegant"],
    preview: "/templates/minimal-portfolio.png",
    author: "Minimal Studio",
    downloads: 890,
    rating: 4.7,
    isPremium: false,
    createdAt: "2024-01-25",
    data: {
      type: "portfolio",
      title: "Creative Designer",
      description: "Crafting beautiful digital experiences",
      bgGradientFrom: "#ffffff",
      bgGradientTo: "#f8f9fa",
      bgOpacityFrom: "1",
      bgOpacityTo: "1",
      cardWidth: "320",
      cardHeight: "auto",
      cardBorderWidth: "1",
      cardBorderColor: "#e9ecef",
      cardBorderOpacity: "1",
      cardBorderRadius: {
        topLeft: "8",
        topRight: "8",
        bottomLeft: "8",
        bottomRight: "8",
        unit: "px",
      },
      shadowSettings: {
        inset: false,
        x: "0",
        y: "2",
        blur: "8",
        spread: "0",
      },
      shadowColor: "#000000",
      shadowOpacity: "0.1",
    },
  },
  {
    id: "tech-startup",
    name: "Tech Startup",
    category: "Technology",
    description: "Modern tech-focused design perfect for startups",
    tags: ["tech", "startup", "modern", "innovation"],
    preview: "/templates/tech-startup.png",
    author: "Tech Innovators",
    downloads: 1420,
    rating: 4.8,
    isPremium: true,
    createdAt: "2024-02-15",
    data: {
      type: "technology",
      title: "InnovateTech",
      description: "Revolutionizing the future with technology",
      bgGradientFrom: "#8b5cf6",
      bgGradientTo: "#3b82f6",
      bgOpacityFrom: "0.9",
      bgOpacityTo: "0.7",
      cardWidth: "350",
      cardHeight: "210",
      cardBorderRadius: {
        topLeft: "16",
        topRight: "16",
        bottomLeft: "16",
        bottomRight: "16",
        unit: "px",
      },
      shadowSettings: {
        inset: false,
        x: "0",
        y: "12",
        blur: "28",
        spread: "0",
      },
      shadowColor: "#8b5cf6",
      shadowOpacity: "0.35",
    },
  },
  {
    id: "creative-agency",
    name: "Creative Agency",
    category: "Creative",
    description: "Bold and artistic design for creative agencies",
    tags: ["creative", "artistic", "vibrant", "agency"],
    preview: "/templates/creative-agency.png",
    author: "Creative Minds",
    downloads: 1100,
    rating: 4.7,
    isPremium: false,
    createdAt: "2024-02-20",
    data: {
      type: "creative",
      title: "Creative Studio",
      description: "Where imagination meets innovation",
      bgGradientFrom: "#ec4899",
      bgGradientTo: "#f97316",
      bgOpacityFrom: "0.9",
      bgOpacityTo: "0.8",
      cardWidth: "360",
      cardHeight: "220",
      cardBorderRadius: {
        topLeft: "18",
        topRight: "18",
        bottomLeft: "18",
        bottomRight: "18",
        unit: "px",
      },
      shadowSettings: {
        inset: false,
        x: "0",
        y: "14",
        blur: "32",
        spread: "0",
      },
      shadowColor: "#ec4899",
      shadowOpacity: "0.4",
    },
  },
]

const templateCategories = ["All", "Business", "Social Media", "Portfolio", "Gaming", "Technology", "Creative"]

// ==================== UTILITY FUNCTIONS ====================

const createDefaultCard = (): CardData => ({
  id: Date.now().toString(),
  type: "modern",
  title: "Modern Card",
  description: "Live preview with real-time updates",
  bgGradientFrom: "#523091",
  bgGradientTo: "#1a0b33",
  bgOpacityFrom: "0.70",
  bgOpacityTo: "0.14",
  iconGradientFrom: "#ffffff",
  iconGradientTo: "#f0f0f0",
  shadowColor: "#7c3aed",
  shadowOpacity: "0.3",
  enableHoverEffects: true,
  enableAnimations: true,
  cardWidth: "320",
  cardHeight: "200",
  cardPadding: "24",
  cardBorderWidth: "0",
  cardBorderStyle: "solid",
  cardBorderColor: "#ffffff",
  cardBorderOpacity: "0.1",
  cardBorderRadius: {
    topLeft: "16",
    topRight: "16",
    bottomLeft: "16",
    bottomRight: "16",
    unit: "px",
  },
  cardOpacity: 100,
  shadowSettings: {
    inset: false,
    x: "0",
    y: "30",
    blur: "50",
    spread: "0",
  },
  shadow2Settings: {
    inset: true,
    x: "0",
    y: "1",
    blur: "0",
    spread: "0",
    color: "#ffffff",
    opacity: "0.1",
  },
  titleFont: "Inter",
  titleSize: 18,
  titleWeight: "600",
  titleAlign: "left",
  descriptionFont: "Inter",
  descriptionSize: 14,
  descriptionWeight: "400",
  descriptionAlign: "left",
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
})

const generateCardStyle = (card: CardData): CardStyle => {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : { r: 82, g: 48, b: 145 }
  }

  const bgFromRgb = hexToRgb(card.bgGradientFrom || "#523091")
  const bgToRgb = hexToRgb(card.bgGradientTo || "#1a0b33")
  const borderRgb = hexToRgb(card.cardBorderColor || "#ffffff")
  const shadowRgb = hexToRgb(card.shadowColor || "#7c3aed")
  const shadow2Rgb = hexToRgb(card.shadow2Settings?.color || "#ffffff")

  const mainShadow = `${card.shadowSettings?.inset ? "inset " : ""}${card.shadowSettings?.x || "0"}px ${card.shadowSettings?.y || "30"}px ${card.shadowSettings?.blur || "50"}px ${card.shadowSettings?.spread || "0"}px rgba(${shadowRgb.r}, ${shadowRgb.g}, ${shadowRgb.b}, ${card.shadowOpacity || "0.3"})`

  const secondShadow = card.shadow2Settings
    ? `, ${card.shadow2Settings.inset ? "inset " : ""}${card.shadow2Settings.x}px ${card.shadow2Settings.y}px ${card.shadow2Settings.blur}px ${card.shadow2Settings.spread}px rgba(${shadow2Rgb.r}, ${shadow2Rgb.g}, ${shadow2Rgb.b}, ${card.shadow2Settings.opacity})`
    : ""

  const transform = `rotate(${card.rotation || 0}deg) scaleX(${card.scaleX || 1}) scaleY(${card.scaleY || 1})`
  const filter = `blur(${card.blur || 0}px) brightness(${card.brightness || 100}%) contrast(${card.contrast || 100}%) saturate(${card.saturation || 100}%)`

  return {
    width: Number.parseInt(card.cardWidth || "320"),
    height: card.cardHeight === "auto" ? "auto" : Number.parseInt(card.cardHeight || "200"),
    background: `radial-gradient(86.88% 75.47% at 50.00% 24.53%, rgba(${bgFromRgb.r}, ${bgFromRgb.g}, ${bgFromRgb.b}, ${card.bgOpacityFrom || "0.7"}), rgba(${bgToRgb.r}, ${bgToRgb.g}, ${bgToRgb.b}, ${card.bgOpacityTo || "0.14"}))`,
    borderRadius: Number.parseInt(card.cardBorderRadius?.topLeft || "16"),
    border:
      card.cardBorderWidth !== "0"
        ? `${card.cardBorderWidth}px ${card.cardBorderStyle} rgba(${borderRgb.r}, ${borderRgb.g}, ${borderRgb.b}, ${card.cardBorderOpacity})`
        : "none",
    boxShadow: `${mainShadow}${secondShadow}`,
    padding: Number.parseInt(card.cardPadding || "24"),
    backdropFilter: "none",
    opacity: (card.cardOpacity || 100) / 100,
    color: "white",
    transform,
  }
}

// ==================== MAIN COMPONENT ====================

export default function CardEditorPro() {
  // ==================== STATE ====================
  const [activeCard, setActiveCard] = useState<CardData>(createDefaultCard())
  const [cards, setCards] = useState<CardData[]>([createDefaultCard()])
  const [history, setHistory] = useState<CardData[]>([createDefaultCard()])
  const [historyIndex, setHistoryIndex] = useState(0)

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<"basic" | "style" | "effects" | "advanced" | "code">("basic")
  const [showTemplateGallery, setShowTemplateGallery] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [floatingPanelOpen, setFloatingPanelOpen] = useState(false)
  const [floatingPanelMode, setFloatingPanelMode] = useState<"style" | "gradient" | "shadow">("style")

  // Template Gallery State
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"popular" | "newest" | "rating">("popular")
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [showFreeOnly, setShowFreeOnly] = useState(false)

  // Control Panel State
  const [backgroundType, setBackgroundType] = useState<"solid" | "gradient">("gradient")
  const [primaryShadow, setPrimaryShadow] = useState({
    x: 0,
    y: 10,
    blur: 20,
    spread: 0,
    color: "#000000",
    opacity: 25,
    enabled: true,
  })
  const [secondaryShadow, setSecondaryShadow] = useState({
    x: 0,
    y: 4,
    blur: 6,
    spread: -1,
    color: "#000000",
    opacity: 10,
    enabled: true,
  })

  // Gradient State
  const [startColor, setStartColor] = useState("#6366f1")
  const [endColor, setEndColor] = useState("#8b5cf6")
  const [startOpacity, setStartOpacity] = useState(100)
  const [endOpacity, setEndOpacity] = useState(100)
  const [gradientAngle, setGradientAngle] = useState(135)

  // ==================== COMPUTED VALUES ====================
  const cardStyle = useMemo(() => generateCardStyle(activeCard), [activeCard])

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  const filteredTemplates = useMemo(() => {
    const filtered = templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
      const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => template.tags.includes(tag))
      const matchesPremium = !showPremiumOnly || template.isPremium
      const matchesFree = !showFreeOnly || !template.isPremium

      return matchesSearch && matchesCategory && matchesTags && matchesPremium && matchesFree
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.downloads - a.downloads
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, selectedCategory, selectedTags, sortBy, showPremiumOnly, showFreeOnly])

  // ==================== HANDLERS ====================
  const updateCard = useCallback(
    (updates: Partial<CardData>) => {
      const newCard = { ...activeCard, ...updates }
      setActiveCard(newCard)

      // Add to history
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newCard)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [activeCard, history, historyIndex],
  )

  const undo = useCallback(() => {
    if (canUndo) {
      setHistoryIndex(historyIndex - 1)
      setActiveCard(history[historyIndex - 1])
    }
  }, [canUndo, historyIndex, history])

  const redo = useCallback(() => {
    if (canRedo) {
      setHistoryIndex(historyIndex + 1)
      setActiveCard(history[historyIndex + 1])
    }
  }, [canRedo, historyIndex, history])

  const generateRandomCard = useCallback(() => {
    const titles = ["Creative Card", "Modern Design", "Elegant Style", "Dynamic Card", "Innovative UI"]
    const descriptions = [
      "Beautiful and responsive design",
      "Crafted with precision and care",
      "Designed for maximum impact",
      "Built for the future of web",
    ]

    const randomTitle = titles[Math.floor(Math.random() * titles.length)]
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)]

    updateCard({
      title: randomTitle,
      description: randomDescription,
      bgGradientFrom: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      bgGradientTo: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    })
  }, [updateCard])

  const applyTemplate = useCallback(
    (template: Template) => {
      updateCard(template.data)
      setShowTemplateGallery(false)
    },
    [updateCard],
  )

  const exportCard = useCallback(() => {
    const exportData = {
      card: activeCard,
      style: cardStyle,
      timestamp: new Date().toISOString(),
      version: "2.0.0",
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `card-editor-pro-${activeCard.type}-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [activeCard, cardStyle])

  const handleOpenFloatingPanel = useCallback((mode: "style" | "gradient" | "shadow") => {
    setFloatingPanelMode(mode)
    setFloatingPanelOpen(true)
  }, [])

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }, [])

  const clearFilters = useCallback(() => {
    setSearchTerm("")
    setSelectedCategory("All")
    setSelectedTags([])
    setShowPremiumOnly(false)
    setShowFreeOnly(false)
  }, [])

  // ==================== KEYBOARD SHORTCUTS ====================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
            break
          case "y":
            e.preventDefault()
            redo()
            break
          case "s":
            e.preventDefault()
            exportCard()
            break
          case "t":
            e.preventDefault()
            setShowTemplateGallery(true)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [undo, redo, exportCard])

  // ==================== COMPONENTS ====================

  // Animated Background Component
  const AnimatedBackground = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )

  // Header Component
  const Header = () => (
    <motion.header
      className="fixed top-0 left-0 right-0 z-30 bg-black/20 backdrop-blur-xl border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Card Editor Pro</h1>
              <p className="text-xs text-white/60">Professional Card Designer</p>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            className={`p-2 rounded-lg transition-colors ${
              canUndo ? "bg-white/10 text-white hover:bg-white/20" : "bg-white/5 text-white/30"
            }`}
            onClick={undo}
            disabled={!canUndo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </motion.button>

          <motion.button
            className={`p-2 rounded-lg transition-colors ${
              canRedo ? "bg-white/10 text-white hover:bg-white/20" : "bg-white/5 text-white/30"
            }`}
            onClick={redo}
            disabled={!canRedo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </motion.button>

          <div className="w-px h-6 bg-white/20" />

          <motion.button
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
            onClick={() => setShowTemplateGallery(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Templates (Ctrl+T)"
          >
            <Grid className="w-4 h-4" />
            <span>Templates</span>
          </motion.button>

          <motion.button
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 flex items-center space-x-2"
            onClick={generateRandomCard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shuffle className="w-4 h-4" />
            <span>Random</span>
          </motion.button>

          <motion.button
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 flex items-center space-x-2"
            onClick={() => setShowExportModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Export (Ctrl+S)"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  )

  // Sidebar Component
  const Sidebar = () => (
    <AnimatePresence>
      {sidebarOpen && (
        <motion.div
          className="fixed left-0 top-20 bottom-0 w-80 bg-black/20 backdrop-blur-xl border-r border-white/10 z-20 overflow-hidden"
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          exit={{ x: -320 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="p-6 h-full overflow-y-auto">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6 bg-white/5 rounded-lg p-1">
              {[
                { key: "basic", label: "Basic", icon: FileText },
                { key: "style", label: "Style", icon: Palette },
                { key: "effects", label: "Effects", icon: Sparkles },
                { key: "code", label: "Code", icon: Code },
              ].map((tab) => (
                <motion.button
                  key={tab.key}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.key ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setActiveTab(tab.key as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "basic" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Title</label>
                    <input
                      type="text"
                      value={activeCard.title}
                      onChange={(e) => updateCard({ title: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter card title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Description</label>
                    <textarea
                      value={activeCard.description}
                      onChange={(e) => updateCard({ description: e.target.value })}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={3}
                      placeholder="Enter card description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Width</label>
                      <input
                        type="number"
                        value={activeCard.cardWidth}
                        onChange={(e) => updateCard({ cardWidth: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="200"
                        max="800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Height</label>
                      <input
                        type="number"
                        value={activeCard.cardHeight}
                        onChange={(e) => updateCard({ cardHeight: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min="100"
                        max="600"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "style" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">Background Colors</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-white/60 mb-2">From</label>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer"
                            style={{ backgroundColor: activeCard.bgGradientFrom }}
                          >
                            <input
                              type="color"
                              value={activeCard.bgGradientFrom}
                              onChange={(e) => updateCard({ bgGradientFrom: e.target.value })}
                              className="w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                          <input
                            type="text"
                            value={activeCard.bgGradientFrom}
                            onChange={(e) => updateCard({ bgGradientFrom: e.target.value })}
                            className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 mb-2">To</label>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer"
                            style={{ backgroundColor: activeCard.bgGradientTo }}
                          >
                            <input
                              type="color"
                              value={activeCard.bgGradientTo}
                              onChange={(e) => updateCard({ bgGradientTo: e.target.value })}
                              className="w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                          <input
                            type="text"
                            value={activeCard.bgGradientTo}
                            onChange={(e) => updateCard({ bgGradientTo: e.target.value })}
                            className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">Border Radius</label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={activeCard.cardBorderRadius.topLeft}
                      onChange={(e) =>
                        updateCard({
                          cardBorderRadius: {
                            ...activeCard.cardBorderRadius,
                            topLeft: e.target.value,
                            topRight: e.target.value,
                            bottomLeft: e.target.value,
                            bottomRight: e.target.value,
                          },
                        })
                      }
                      className="w-full accent-purple-500"
                    />
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                      <span>0px</span>
                      <span>{activeCard.cardBorderRadius.topLeft}px</span>
                      <span>50px</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">Opacity</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeCard.cardOpacity}
                      onChange={(e) => updateCard({ cardOpacity: Number(e.target.value) })}
                      className="w-full accent-purple-500"
                    />
                    <div className="flex justify-between text-xs text-white/60 mt-1">
                      <span>0%</span>
                      <span>{activeCard.cardOpacity}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "effects" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-white">Hover Effects</div>
                      <div className="text-xs text-white/60">Enable interactive hover animations</div>
                    </div>
                    <motion.button
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        activeCard.enableHoverEffects ? "bg-purple-500" : "bg-white/20"
                      }`}
                      onClick={() => updateCard({ enableHoverEffects: !activeCard.enableHoverEffects })}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute w-4 h-4 bg-white rounded-full top-1"
                        animate={{ x: activeCard.enableHoverEffects ? 28 : 4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-white">Animations</div>
                      <div className="text-xs text-white/60">Enable floating animations</div>
                    </div>
                    <motion.button
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        activeCard.enableAnimations ? "bg-purple-500" : "bg-white/20"
                      }`}
                      onClick={() => updateCard({ enableAnimations: !activeCard.enableAnimations })}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute w-4 h-4 bg-white rounded-full top-1"
                        animate={{ x: activeCard.enableAnimations ? 28 : 4 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">Shadow Color</label>
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-lg border border-white/20 cursor-pointer"
                        style={{ backgroundColor: activeCard.shadowColor }}
                      >
                        <input
                          type="color"
                          value={activeCard.shadowColor}
                          onChange={(e) => updateCard({ shadowColor: e.target.value })}
                          className="w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={activeCard.shadowOpacity}
                          onChange={(e) => updateCard({ shadowOpacity: e.target.value })}
                          className="w-full accent-purple-500"
                        />
                        <div className="text-xs text-white/60 mt-1">Opacity: {activeCard.shadowOpacity}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "code" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Generated CSS</label>
                    <div className="bg-black/40 border border-white/20 rounded-lg p-4 text-xs text-white/80 font-mono max-h-60 overflow-y-auto">
                      <pre>{`/* Card Styles */
.card {
  width: ${cardStyle.width}px;
  height: ${cardStyle.height === "auto" ? "auto" : `${cardStyle.height}px`};
  background: ${cardStyle.background};
  border-radius: ${cardStyle.borderRadius}px;
  border: ${cardStyle.border};
  box-shadow: ${cardStyle.boxShadow};
  padding: ${cardStyle.padding}px;
  opacity: ${cardStyle.opacity};
  color: ${cardStyle.color};
  transform: ${cardStyle.transform || "none"};
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-8px) scale(1.02);
}`}</pre>
                    </div>
                  </div>

                  <motion.button
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                    onClick={() => {
                      navigator.clipboard.writeText(`/* Card Styles */
.card {
  width: ${cardStyle.width}px;
  height: ${cardStyle.height === "auto" ? "auto" : `${cardStyle.height}px`};
  background: ${cardStyle.background};
  border-radius: ${cardStyle.borderRadius}px;
  border: ${cardStyle.border};
  box-shadow: ${cardStyle.boxShadow};
  padding: ${cardStyle.padding}px;
  opacity: ${cardStyle.opacity};
  color: ${cardStyle.color};
  transform: ${cardStyle.transform || "none"};
  transition: all 0.3s ease;
}`)
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy CSS</span>
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Card Preview Component
  const CardPreview = () => (
    <div className="flex items-center justify-center min-h-screen p-8">
      <motion.div
        className="relative"
        style={{ perspective: "1000px" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div
          className={`transition-all duration-500 ease-out flex flex-col items-center justify-center relative ${
            activeCard.enableHoverEffects ? "hover:scale-105 hover:-translate-y-2" : ""
          }`}
          style={{
            width: `${cardStyle.width}px`,
            height: cardStyle.height === "auto" ? "auto" : `${cardStyle.height}px`,
            background: cardStyle.background,
            borderRadius: `${cardStyle.borderRadius}px`,
            border: cardStyle.border,
            boxShadow: cardStyle.boxShadow,
            padding: `${cardStyle.padding}px`,
            backdropFilter: cardStyle.backdropFilter,
            opacity: cardStyle.opacity,
            color: cardStyle.color,
            transform: cardStyle.transform,
          }}
          whileHover={
            activeCard.enableHoverEffects
              ? {
                  scale: 1.05,
                  y: -8,
                  boxShadow:
                    "0px 40px 80px 0px rgba(124, 58, 237, 0.4), inset 0px 1px 0px 0px rgba(255, 255, 255, 0.2)",
                }
              : {}
          }
        >
          <div className="text-center">
            <motion.div
              className="font-semibold text-lg mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                fontSize: `${activeCard.titleSize || 18}px`,
                fontWeight: activeCard.titleWeight || "600",
                textAlign: (activeCard.titleAlign as any) || "center",
              }}
            >
              {activeCard.title}
            </motion.div>
            <motion.div
              className="text-sm opacity-80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{
                fontSize: `${activeCard.descriptionSize || 14}px`,
                fontWeight: activeCard.descriptionWeight || "400",
                textAlign: (activeCard.descriptionAlign as any) || "center",
              }}
            >
              {activeCard.description}
            </motion.div>

            {/* Interactive Elements */}
            <motion.div
              className="flex items-center justify-center space-x-4 mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.button
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-4 h-4" />
              </motion.button>
              <motion.button
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Rating Display */}
            <motion.div
              className="flex items-center justify-center space-x-1 mt-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current text-yellow-400" />
              ))}
              <span className="text-xs ml-2 opacity-70">4.9</span>
            </motion.div>
          </div>

          {/* Floating Elements */}
          {activeCard.enableAnimations && (
            <>
              <motion.div
                className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </>
          )}
        </motion.div>

        {/* Background Glow Effect */}
        <motion.div
          className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  )

  // Floating Action Buttons Component
  const FloatingActionButtons = () => (
    <div className="fixed bottom-8 right-8 z-40">
      <div className="flex flex-col space-y-4">
        {[
          {
            icon: Palette,
            label: "Style Controls",
            mode: "style" as const,
            gradient: "from-blue-500 to-purple-600",
          },
          {
            icon: Layers,
            label: "Gradient Builder",
            mode: "gradient" as const,
            gradient: "from-pink-500 to-orange-500",
          },
          {
            icon: Box,
            label: "3D Shadow",
            mode: "shadow" as const,
            gradient: "from-green-500 to-teal-600",
          },
        ].map((button, index) => {
          const IconComponent = button.icon
          return (
            <motion.button
              key={button.mode}
              className={`p-4 rounded-2xl bg-gradient-to-r ${button.gradient} shadow-lg backdrop-blur-sm border border-white/10 group relative overflow-hidden`}
              onClick={() => handleOpenFloatingPanel(button.mode)}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconComponent className="w-6 h-6 text-white relative z-10" />

              {/* Tooltip */}
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black/80 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                {button.label}
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </motion.button>
          )
        })}
      </div>
    </div>
  )

  // Template Gallery Component
  const TemplateGallery = () => (
    <AnimatePresence>
      {showTemplateGallery && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTemplateGallery(false)}
          />

          <motion.div
            className="bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Templates Gallery</h2>
                  <p className="text-white/60">Choose from {filteredTemplates.length} professional templates</p>
                </div>
                <motion.button
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                  onClick={() => setShowTemplateGallery(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Search and Filters */}
              <div className="mt-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {templateCategories.map((category) => (
                        <option key={category} value={category} className="bg-slate-800">
                          {category}
                        </option>
                      ))}
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="popular" className="bg-slate-800">
                        Most Popular
                      </option>
                      <option value="newest" className="bg-slate-800">
                        Newest
                      </option>
                      <option value="rating" className="bg-slate-800">
                        Highest Rated
                      </option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        viewMode === "grid" ? "bg-purple-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                      onClick={() => setViewMode("grid")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Grid className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        viewMode === "list" ? "bg-purple-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
                      }`}
                      onClick={() => setViewMode("list")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <List className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="text-white/50 text-lg mb-2">No templates found</div>
                  <div className="text-white/30 text-sm mb-4">Try adjusting your search or filter criteria</div>
                  <motion.button
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    onClick={clearFilters}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear Filters
                  </motion.button>
                </div>
              ) : (
                <div
                  className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}
                >
                  <AnimatePresence>
                    {filteredTemplates.map((template, index) => (
                      <motion.div
                        key={template.id}
                        className={`bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-200 cursor-pointer group ${
                          viewMode === "list" ? "flex items-center space-x-4 p-4" : "p-4"
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => applyTemplate(template)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {viewMode === "grid" ? (
                          <>
                            <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                              <div className="text-white/60 text-sm">Preview</div>
                              {template.isPremium && (
                                <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                  <Crown className="w-3 h-3" />
                                  <span>Pro</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="text-white font-medium mb-1">{template.name}</h3>
                              <p className="text-white/60 text-sm mb-3 line-clamp-2">{template.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                          i < Math.floor(template.rating)
                                            ? "text-yellow-400 fill-current"
                                            : "text-white/20"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-white/60">{template.rating}</span>
                                </div>
                                <div className="text-xs text-white/60">{template.downloads} downloads</div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-20 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center relative">
                              <div className="text-white/60 text-xs">Preview</div>
                              {template.isPremium && (
                                <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-white font-medium">{template.name}</h3>
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                          i < Math.floor(template.rating)
                                            ? "text-yellow-400 fill-current"
                                            : "text-white/20"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-white/60">{template.rating}</span>
                                </div>
                              </div>
                              <p className="text-white/60 text-sm mb-2">{template.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-white/60">{template.category}</span>
                                <span className="text-xs text-white/60">{template.downloads} downloads</span>
                              </div>
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Floating Control Panel Component
  const FloatingControlPanel = () => {
    const getModeConfig = () => {
      switch (floatingPanelMode) {
        case "style":
          return {
            title: "Style Controls",
            subtitle: "Customize your card design",
            icon: Palette,
            gradient: "from-blue-500 to-purple-600",
          }
        case "gradient":
          return {
            title: "Gradient Builder",
            subtitle: "Create beautiful gradients",
            icon: Layers,
            gradient: "from-pink-500 to-orange-500",
          }
        case "shadow":
          return {
            title: "3D Shadow",
            subtitle: "Advanced shadow effects",
            icon: Box,
            gradient: "from-green-500 to-teal-600",
          }
        default:
          return {
            title: "Controls",
            subtitle: "Customize your design",
            icon: Palette,
            gradient: "from-blue-500 to-purple-600",
          }
      }
    }

    const config = getModeConfig()
    const IconComponent = config.icon

    return (
      <AnimatePresence>
        {floatingPanelOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFloatingPanelOpen(false)}
            />

            <motion.div
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden max-w-lg w-full max-h-[85vh] shadow-2xl"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${config.gradient} p-6 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">{config.title}</h2>
                      <p className="text-white/80 text-sm">{config.subtitle}</p>
                    </div>
                  </div>
                  <motion.button
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                    onClick={() => setFloatingPanelOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
                <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full blur-lg" />
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {floatingPanelMode === "style" && (
                    <div className="space-y-6">
                      {/* Background Type */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center space-x-2 mb-4">
                          <Palette className="w-4 h-4 text-purple-400" />
                          <h3 className="text-sm font-semibold text-white/90">Background Type</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { key: "solid", label: "Solid", icon: Circle },
                            { key: "gradient", label: "Gradient", icon: Square },
                          ].map((type) => (
                            <motion.button
                              key={type.key}
                              className={`p-4 rounded-xl border transition-all duration-200 ${
                                backgroundType === type.key
                                  ? "bg-purple-500/20 border-purple-400"
                                  : "bg-white/5 border-white/20 hover:bg-white/10"
                              }`}
                              onClick={() => setBackgroundType(type.key as any)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <type.icon className="w-5 h-5 mx-auto mb-2" />
                              <div className="text-xs font-medium">{type.label}</div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Dimensions */}
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center space-x-2 mb-4">
                          <Maximize2 className="w-4 h-4 text-purple-400" />
                          <h3 className="text-sm font-semibold text-white/90">Dimensions</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-white/70 mb-2">Width</label>
                            <input
                              type="range"
                              min="200"
                              max="500"
                              value={activeCard.cardWidth}
                              onChange={(e) => updateCard({ cardWidth: e.target.value })}
                              className="w-full accent-purple-500"
                            />
                            <div className="text-xs text-purple-400 mt-1">{activeCard.cardWidth}px</div>
                          </div>
                          <div>
                            <label className="block text-xs text-white/70 mb-2">Height</label>
                            <input
                              type="range"
                              min="100"
                              max="400"
                              value={activeCard.cardHeight}
                              onChange={(e) => updateCard({ cardHeight: e.target.value })}
                              className="w-full accent-purple-500"
                            />
                            <div className="text-xs text-purple-400 mt-1">{activeCard.cardHeight}px</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {floatingPanelMode === "gradient" && (
                    <div className="space-y-6">
                      {/* Gradient Preview */}
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-3">Gradient Preview</label>
                        <div
                          className="w-full h-20 rounded-xl border border-white/20"
                          style={{
                            background: `linear-gradient(${gradientAngle}deg, ${startColor}, ${endColor})`,
                          }}
                        />
                      </div>

                      {/* Color Controls */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">Start Color</label>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer"
                              style={{ backgroundColor: startColor }}
                            >
                              <input
                                type="color"
                                value={startColor}
                                onChange={(e) => {
                                  setStartColor(e.target.value)
                                  updateCard({ bgGradientFrom: e.target.value })
                                }}
                                className="w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                            <div className="flex-1">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={startOpacity}
                                onChange={(e) => setStartOpacity(Number(e.target.value))}
                                className="w-full accent-purple-500"
                              />
                              <div className="text-xs text-white/60">{startOpacity}%</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-2">End Color</label>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer"
                              style={{ backgroundColor: endColor }}
                            >
                              <input
                                type="color"
                                value={endColor}
                                onChange={(e) => {
                                  setEndColor(e.target.value)
                                  updateCard({ bgGradientTo: e.target.value })
                                }}
                                className="w-full h-full opacity-0 cursor-pointer"
                              />
                            </div>
                            <div className="flex-1">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={endOpacity}
                                onChange={(e) => setEndOpacity(Number(e.target.value))}
                                className="w-full accent-purple-500"
                              />
                              <div className="text-xs text-white/60">{endOpacity}%</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Gradient Direction */}
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-3">Direction</label>
                        <div className="flex items-center justify-center">
                          <div className="relative w-24 h-24">
                            <div className="absolute inset-0 rounded-full border-2 border-white/20" />
                            <motion.div
                              className="absolute w-2 h-8 bg-purple-500 rounded-full origin-bottom cursor-pointer"
                              style={{
                                left: "50%",
                                bottom: "50%",
                                marginLeft: "-4px",
                                transform: `rotate(${gradientAngle}deg)`,
                              }}
                              drag
                              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                              onDrag={(event, info) => {
                                const rect = (event.target as HTMLElement).parentElement?.getBoundingClientRect()
                                if (rect) {
                                  const centerX = rect.width / 2
                                  const centerY = rect.height / 2
                                  const x = info.point.x - rect.left - centerX
                                  const y = info.point.y - rect.top - centerY
                                  const newAngle = (Math.atan2(y, x) * 180) / Math.PI + 90
                                  setGradientAngle(Math.round(newAngle))
                                }
                              }}
                            />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <RotateCw className="w-4 h-4 text-white/40" />
                            </div>
                          </div>
                        </div>
                        <div className="text-center text-xs text-white/60 mt-2">{gradientAngle}°</div>
                      </div>
                    </div>
                  )}

                  {floatingPanelMode === "shadow" && (
                    <div className="space-y-8">
                      {/* Primary Shadow */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-white">Primary Shadow</h3>
                          <motion.button
                            className={`p-2 rounded-lg transition-colors ${
                              primaryShadow.enabled ? "bg-purple-500 text-white" : "bg-white/10 text-white/60"
                            }`}
                            onClick={() => setPrimaryShadow({ ...primaryShadow, enabled: !primaryShadow.enabled })}
                            whileTap={{ scale: 0.95 }}
                          >
                            {primaryShadow.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </motion.button>
                        </div>

                        {primaryShadow.enabled && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">Blur</label>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={primaryShadow.blur}
                                  onChange={(e) => setPrimaryShadow({ ...primaryShadow, blur: Number(e.target.value) })}
                                  className="w-full accent-purple-500"
                                />
                                <div className="text-xs text-white/60 mt-1">{primaryShadow.blur}px</div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-white/80 mb-2">Spread</label>
                                <input
                                  type="range"
                                  min="-20"
                                  max="20"
                                  value={primaryShadow.spread}
                                  onChange={(e) =>
                                    setPrimaryShadow({ ...primaryShadow, spread: Number(e.target.value) })
                                  }
                                  className="w-full accent-purple-500"
                                />
                                <div className="text-xs text-white/60 mt-1">{primaryShadow.spread}px</div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div
                                className="w-12 h-12 rounded-xl border border-white/20 cursor-pointer"
                                style={{ backgroundColor: primaryShadow.color }}
                              >
                                <input
                                  type="color"
                                  value={primaryShadow.color}
                                  onChange={(e) => {
                                    setPrimaryShadow({ ...primaryShadow, color: e.target.value })
                                    updateCard({ shadowColor: e.target.value })
                                  }}
                                  className="w-full h-full opacity-0 cursor-pointer"
                                />
                              </div>
                              <div className="flex-1">
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={primaryShadow.opacity}
                                  onChange={(e) => {
                                    const opacity = Number(e.target.value)
                                    setPrimaryShadow({ ...primaryShadow, opacity })
                                    updateCard({ shadowOpacity: (opacity / 100).toString() })
                                  }}
                                  className="w-full accent-purple-500"
                                />
                                <div className="text-xs text-white/60 mt-1">Opacity: {primaryShadow.opacity}%</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Export Modal Component
  const ExportModal = () => (
    <AnimatePresence>
      {showExportModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowExportModal(false)}
          />

          <motion.div
            className="bg-slate-900/90 backdrop-blur-xl border border-white/20 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Export Card</h2>
                <motion.button
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
                  onClick={() => setShowExportModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <motion.button
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  onClick={exportCard}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-5 h-5" />
                  <span>Export as JSON</span>
                </motion.button>

                <motion.button
                  className="w-full p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  onClick={() => {
                    navigator.clipboard.writeText(`/* Card Styles */
.card {
  width: ${cardStyle.width}px;
  height: ${cardStyle.height === "auto" ? "auto" : `${cardStyle.height}px`};
  background: ${cardStyle.background};
  border-radius: ${cardStyle.borderRadius}px;
  border: ${cardStyle.border};
  box-shadow: ${cardStyle.boxShadow};
  padding: ${cardStyle.padding}px;
  opacity: ${cardStyle.opacity};
  color: ${cardStyle.color};
  transform: ${cardStyle.transform || "none"};
  transition: all 0.3s ease;
}`)
                    setShowExportModal(false)
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Code className="w-5 h-5" />
                  <span>Copy CSS</span>
                </motion.button>

                <motion.button
                  className="w-full p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  onClick={() => {
                    // This would typically trigger a screenshot or canvas export
                    console.log("Export as PNG - Feature coming soon!")
                    setShowExportModal(false)
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>Export as PNG</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Sidebar Toggle Button
  const SidebarToggle = () => (
    <motion.button
      className="fixed top-24 left-4 z-30 p-3 bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-black/30 transition-all duration-200"
      onClick={() => setSidebarOpen(!sidebarOpen)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Settings className="w-5 h-5" />
    </motion.button>
  )

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <Header />
      <Sidebar />
      <SidebarToggle />
      <CardPreview />
      <FloatingActionButtons />
      <FloatingControlPanel />
      <TemplateGallery />
      <ExportModal />

      {/* Global Styles */}
      <style jsx global>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3);
        }
        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          cursor: pointer;
          border: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
