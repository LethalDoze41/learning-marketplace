function CourseFilters({ filters, setFilters }) {
    const categories = [
      { value: 'all', label: 'All Categories' },
      { value: 'programming', label: 'Programming' },
      { value: 'design', label: 'Design' },
      { value: 'business', label: 'Business' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'photography', label: 'Photography' },
      { value: 'music', label: 'Music' },
      { value: 'health', label: 'Health & Fitness' },
      { value: 'language', label: 'Language' }
    ];
  
    const levels = [
      { value: 'all', label: 'All Levels' },
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' }
    ];
  
    const priceRanges = [
      { value: 'all', label: 'All Prices' },
      { value: '0-0', label: 'Free' },
      { value: '0-50', label: 'Under $50' },
      { value: '50-100', label: '$50 - $100' },
      { value: '100-200', label: '$100 - $200' },
      { value: '200-', label: '$200+' }
    ];
  
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        
        {/* Category Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
  
        {/* Level Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Level
          </label>
          <div className="space-y-2">
            {levels.map(level => (
              <label key={level.value} className="flex items-center">
                <input
                  type="radio"
                  name="level"
                  value={level.value}
                  checked={filters.level === level.value}
                  onChange={(e) => setFilters({ ...filters, level: e.target.value })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{level.label}</span>
              </label>
            ))}
          </div>
        </div>
  
        {/* Price Range Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="space-y-2">
            {priceRanges.map(range => (
              <label key={range.value} className="flex items-center">
                <input
                  type="radio"
                  name="priceRange"
                  value={range.value}
                  checked={filters.priceRange === range.value}
                  onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-700">{range.label}</span>
              </label>
            ))}
          </div>
        </div>
  
        {/* Reset Filters */}
        <button
          onClick={() => setFilters({
            category: 'all',
            level: 'all',
            priceRange: 'all',
            sortBy: 'popular'
          })}
          className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Reset Filters
        </button>
      </div>
    );
  }
  
  export default CourseFilters;