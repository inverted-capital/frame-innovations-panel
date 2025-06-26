import React, { useEffect, useState } from 'react'
import {
  Lightbulb,
  Search,
  Filter,
  Link,
  ExternalLink,
  Plus,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import type { Innovation } from '../types/innovation'
import useInnovationsData from '../hooks/useInnovationsData'
import useInnovationsSaver from '../hooks/useInnovationsSaver'
import { defaultInnovations } from '../mockInnovations'

const InnovationsView: React.FC = () => {
  const { data, loading, error } = useInnovationsData()
  const save = useInnovationsSaver()
  const [innovations, setInnovations] = useState<Innovation[]>([])
  const [sortField] = useState('createdAt')
  const [sortDirection] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'flat' | 'tree'>('tree')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'problem' | 'solution'>(
    'all'
  )
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  useEffect(() => {
    if (data.length) {
      setInnovations(data)
      setExpandedItems(new Set(data.map((item) => item.id)))
    }
  }, [data])

  useEffect(() => {
    if (error === 'innovations.json not found') {
      save(defaultInnovations)
    }
  }, [error, save])

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'in-progress':
        return 'bg-purple-100 text-purple-800'
      case 'resolved':
      case 'implemented':
        return 'bg-green-100 text-green-800'
      case 'proposed':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityClass = (priority: string | undefined) => {
    if (!priority) return ''

    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: 'problem' | 'solution') => {
    return type === 'problem' ? (
      <span className="text-red-500">⚠️</span>
    ) : (
      <span className="text-blue-500">💡</span>
    )
  }

  const toggleExpandItem = (id: string) => {
    const newExpandedItems = new Set(expandedItems)
    if (newExpandedItems.has(id)) {
      newExpandedItems.delete(id)
    } else {
      newExpandedItems.add(id)
    }
    setExpandedItems(newExpandedItems)
  }

  const filteredInnovations = innovations.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'all' || item.type === filterType

    return matchesSearch && matchesType
  })

  const sortedInnovations = [...filteredInnovations].sort((a, b) => {
    const fieldA = a[sortField as keyof Innovation]
    const fieldB = b[sortField as keyof Innovation]

    if (!fieldA && !fieldB) return 0
    if (!fieldA) return sortDirection === 'asc' ? 1 : -1
    if (!fieldB) return sortDirection === 'asc' ? -1 : 1

    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  const getRelatedItems = (id: string): Innovation[] => {
    const item = innovations.find((i) => i.id === id)
    if (!item || !item.relatedItems || item.relatedItems.length === 0) {
      return []
    }

    return innovations.filter((i) => item.relatedItems?.includes(i.id))
  }

  const buildTree = () => {
    const referencedIds = new Set<string>()

    sortedInnovations
      .filter((item) => item.type === 'problem')
      .forEach((item) => {
        if (item.relatedItems) {
          item.relatedItems.forEach((relId) => {
            referencedIds.add(relId)
          })
        }
      })

    const rootItems = sortedInnovations.filter((item) => {
      const isRoot = !referencedIds.has(item.id)
      return isRoot
    })

    return rootItems
  }

  const renderTreeItem = (
    item: Innovation,
    level: number = 0,
    visited: Set<string> = new Set()
  ) => {
    if (visited.has(item.id)) {
      return null
    }
    const newVisited = new Set(visited)
    newVisited.add(item.id)
    const relatedItems = getRelatedItems(item.id)
    const hasChildren = relatedItems.length > 0
    const isExpanded = expandedItems.has(item.id)

    return (
      <div key={item.id} className="mb-2">
        <div
          className={`bg-white rounded-lg border ${level > 0 ? 'border-gray-200' : 'border-gray-300'} p-4 hover:shadow-sm transition-shadow`}
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-start">
              {hasChildren && (
                <button
                  className="mr-2 mt-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => toggleExpandItem(item.id)}
                >
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              )}
              <div>
                <h2 className="font-medium text-lg flex items-center">
                  {getTypeIcon(item.type)}
                  <span className="ml-2">{item.title}</span>
                </h2>

                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusClass(item.status)}`}
                  >
                    {item.status.charAt(0).toUpperCase() +
                      item.status.slice(1).replace('-', ' ')}
                  </span>

                  {item.priority && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(item.priority)}`}
                    >
                      {item.priority.charAt(0).toUpperCase() +
                        item.priority.slice(1)}
                    </span>
                  )}

                  <span className="text-xs text-gray-500">
                    {item.repository}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              {item.updatedAt
                ? `Updated: ${item.updatedAt}`
                : `Created: ${item.createdAt}`}
            </div>
          </div>

          <p className="text-gray-600 mb-3">{item.description}</p>

          {hasChildren && !isExpanded && (
            <div
              className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => toggleExpandItem(item.id)}
            >
              Show {relatedItems.length} related item
              {relatedItems.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1 ml-5 pl-3 border-l border-gray-200">
            {relatedItems.map((related) =>
              renderTreeItem(related, level + 1, newVisited)
            )}
          </div>
        )}
      </div>
    )
  }

  const renderFlatView = () => {
    return (
      <div className="grid grid-cols-1 gap-4 p-6">
        {sortedInnovations.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-medium text-lg flex items-center">
                {getTypeIcon(item.type)}
                <span className="ml-2">{item.title}</span>
              </h2>

              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusClass(item.status)}`}
                >
                  {item.status.charAt(0).toUpperCase() +
                    item.status.slice(1).replace('-', ' ')}
                </span>

                {item.priority && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(item.priority)}`}
                  >
                    {item.priority.charAt(0).toUpperCase() +
                      item.priority.slice(1)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-3">{item.description}</p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <span className="mr-3">{item.repository}</span>

                {item.relatedItems && item.relatedItems.length > 0 && (
                  <div className="flex items-center">
                    <Link size={14} className="mr-1" />
                    <span>
                      {item.relatedItems.length} related item
                      {item.relatedItems.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">
                  {item.updatedAt
                    ? `Updated: ${item.updatedAt}`
                    : `Created: ${item.createdAt}`}
                </span>
                <button className="text-blue-500 hover:text-blue-700 flex items-center">
                  <span className="mr-1">Details</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Lightbulb className="mr-2" size={24} />
          Innovations
        </h1>

        <div className="flex space-x-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search innovations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <button
              className="border border-gray-200 bg-white hover:bg-gray-50 px-3 py-2 rounded-md flex items-center transition-colors"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter size={16} className="mr-2" />
              {filterType === 'all'
                ? 'All Types'
                : filterType === 'problem'
                  ? 'Problems'
                  : 'Solutions'}
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    className={`w-full text-left px-4 py-2 ${filterType === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                      setFilterType('all')
                      setShowFilterMenu(false)
                    }}
                  >
                    All Types
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 ${filterType === 'problem' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                      setFilterType('problem')
                      setShowFilterMenu(false)
                    }}
                  >
                    Problems
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 ${filterType === 'solution' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                      setFilterType('solution')
                      setShowFilterMenu(false)
                    }}
                  >
                    Solutions
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex border border-gray-200 rounded-md ">
            <button
              className={`px-3 py-2 ${viewMode === 'flat' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setViewMode('flat')}
            >
              Flat
            </button>
            <button
              className={`px-3 py-2 ${viewMode === 'tree' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setViewMode('tree')}
            >
              Tree
            </button>
          </div>

          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors">
            <Plus size={16} className="mr-2" />
            New Innovation
          </button>
        </div>
      </div>

      {filteredInnovations.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Lightbulb size={40} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            No innovations found
          </h2>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? `No innovations match your search "${searchTerm}"`
              : 'There are no innovations yet. Create your first one!'}
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors">
            <Plus size={16} className="mr-2" />
            Create Innovation
          </button>
        </div>
      ) : viewMode === 'flat' ? (
        renderFlatView()
      ) : (
        <div className="space-y-4">
          {buildTree().map((item) => renderTreeItem(item))}
        </div>
      )}
    </div>
  )
}

export default InnovationsView
