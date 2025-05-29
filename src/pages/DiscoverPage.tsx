import React, { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Container } from '../components/ui/Container';
import { ClassCard } from '../components/features/ClassCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Filter, Search, X } from 'lucide-react';
import { useClassStore, useRegionStore } from '../lib/store';
import { Class } from '../lib/types';

export const DiscoverPage: React.FC = () => {
  const { classes, fetchClasses, isLoading } = useClassStore();
  const { currentRegion } = useRegionStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: [] as string[],
    level: [] as string[],
    price: {
      min: 0,
      max: 100,
    },
  });
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses, currentRegion.id]);
  
  useEffect(() => {
    if (classes.length > 0) {
      let result = [...classes];
      
      // Apply search term filter
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        result = result.filter(
          (classItem) =>
            classItem.title.toLowerCase().includes(lowerSearchTerm) ||
            classItem.description.toLowerCase().includes(lowerSearchTerm) ||
            classItem.instructor.name.toLowerCase().includes(lowerSearchTerm) ||
            classItem.location.name.toLowerCase().includes(lowerSearchTerm) ||
            classItem.tags.some((tag) => tag.toLowerCase().includes(lowerSearchTerm))
        );
      }
      
      // Apply type filter
      if (filters.type.length > 0) {
        result = result.filter((classItem) => filters.type.includes(classItem.type));
      }
      
      // Apply level filter
      if (filters.level.length > 0) {
        result = result.filter((classItem) => filters.level.includes(classItem.level));
      }
      
      // Apply price filter
      result = result.filter(
        (classItem) =>
          classItem.price >= filters.price.min && classItem.price <= filters.price.max
      );
      
      setFilteredClasses(result);
    }
  }, [classes, searchTerm, filters]);
  
  const toggleFilter = (filterType: 'type' | 'level', value: string) => {
    setFilters((prev) => {
      const currentFilters = [...prev[filterType]];
      const index = currentFilters.indexOf(value);
      
      if (index === -1) {
        currentFilters.push(value);
      } else {
        currentFilters.splice(index, 1);
      }
      
      return {
        ...prev,
        [filterType]: currentFilters,
      };
    });
  };
  
  const handlePriceChange = (min: number, max: number) => {
    setFilters((prev) => ({
      ...prev,
      price: { min, max },
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      type: [],
      level: [],
      price: {
        min: 0,
        max: 100,
      },
    });
    setSearchTerm('');
  };
  
  const hasActiveFilters = () => {
    return (
      filters.type.length > 0 ||
      filters.level.length > 0 ||
      filters.price.min > 0 ||
      filters.price.max < 100 ||
      searchTerm !== ''
    );
  };
  
  return (
    <Layout>
      <div className="bg-muted py-12">
        <Container>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Discover Fitness Classes in {currentRegion.name}
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Find the perfect workout session that matches your preferences and schedule
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search classes, instructors, or locations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search size={18} />}
                rightIcon={
                  searchTerm ? (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-neutral-500 hover:text-neutral-700"
                    >
                      <X size={16} />
                    </button>
                  ) : undefined
                }
              />
            </div>
            <Button
              variant="outline"
              leftIcon={<Filter size={18} />}
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto"
            >
              Filters
              {hasActiveFilters() && (
                <span className="ml-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {filters.type.length + filters.level.length + (filters.price.min > 0 || filters.price.max < 100 ? 1 : 0)}
                </span>
              )}
            </Button>
          </div>
          
          {showFilters && (
            <div className="mt-4 p-4 bg-white rounded-lg shadow-soft">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                {hasActiveFilters() && (
                  <Button size="sm" variant="ghost" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Class Type</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="type-group"
                        checked={filters.type.includes('group')}
                        onChange={() => toggleFilter('type', 'group')}
                        className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <label htmlFor="type-group" className="ml-2 text-sm text-neutral-700">
                        Group Classes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="type-personal"
                        checked={filters.type.includes('personal')}
                        onChange={() => toggleFilter('type', 'personal')}
                        className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <label htmlFor="type-personal" className="ml-2 text-sm text-neutral-700">
                        Personal Training
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Skill Level</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="level-beginner"
                        checked={filters.level.includes('beginner')}
                        onChange={() => toggleFilter('level', 'beginner')}
                        className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <label htmlFor="level-beginner" className="ml-2 text-sm text-neutral-700">
                        Beginner
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="level-intermediate"
                        checked={filters.level.includes('intermediate')}
                        onChange={() => toggleFilter('level', 'intermediate')}
                        className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <label htmlFor="level-intermediate" className="ml-2 text-sm text-neutral-700">
                        Intermediate
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="level-advanced"
                        checked={filters.level.includes('advanced')}
                        onChange={() => toggleFilter('level', 'advanced')}
                        className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <label htmlFor="level-advanced" className="ml-2 text-sm text-neutral-700">
                        Advanced
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="level-all"
                        checked={filters.level.includes('all')}
                        onChange={() => toggleFilter('level', 'all')}
                        className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <label htmlFor="level-all" className="ml-2 text-sm text-neutral-700">
                        All Levels
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Price Range ({currentRegion.currency})</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-700">{filters.price.min}</span>
                      <span className="text-sm text-neutral-700">{filters.price.max}</span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.price.min}
                        onChange={(e) =>
                          handlePriceChange(Number(e.target.value), filters.price.max)
                        }
                        className="w-full appearance-none h-2 bg-neutral-200 rounded-full outline-none"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.price.max}
                        onChange={(e) =>
                          handlePriceChange(filters.price.min, Number(e.target.value))
                        }
                        className="w-full appearance-none h-2 bg-neutral-200 rounded-full outline-none mt-2"
                      />
                    </div>
                    <div className="flex justify-between">
                      <input
                        type="number"
                        min="0"
                        max={filters.price.max}
                        value={filters.price.min}
                        onChange={(e) =>
                          handlePriceChange(Number(e.target.value), filters.price.max)
                        }
                        className="w-20 p-1 text-sm border border-neutral-300 rounded-md"
                      />
                      <span className="text-neutral-500">to</span>
                      <input
                        type="number"
                        min={filters.price.min}
                        max="100"
                        value={filters.price.max}
                        onChange={(e) =>
                          handlePriceChange(filters.price.min, Number(e.target.value))
                        }
                        className="w-20 p-1 text-sm border border-neutral-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {hasActiveFilters() && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="primary\" size="md\" className="flex items-center gap-1">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 rounded-full hover:bg-primary-200 p-0.5"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              )}
              
              {filters.type.map((type) => (
                <Badge key={type} variant="primary" size="md" className="flex items-center gap-1">
                  Type: {type === 'group' ? 'Group Class' : 'Personal Training'}
                  <button
                    onClick={() => toggleFilter('type', type)}
                    className="ml-1 rounded-full hover:bg-primary-200 p-0.5"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
              
              {filters.level.map((level) => (
                <Badge key={level} variant="primary" size="md" className="flex items-center gap-1">
                  Level: {level.charAt(0).toUpperCase() + level.slice(1)}
                  <button
                    onClick={() => toggleFilter('level', level)}
                    className="ml-1 rounded-full hover:bg-primary-200 p-0.5"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
              
              {(filters.price.min > 0 || filters.price.max < 100) && (
                <Badge variant="primary" size="md" className="flex items-center gap-1">
                  Price: {currentRegion.currency} {filters.price.min} - {filters.price.max}
                  <button
                    onClick={() => handlePriceChange(0, 100)}
                    className="ml-1 rounded-full hover:bg-primary-200 p-0.5"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </Container>
      </div>
      
      <Container className="py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-neutral-100 h-[400px] animate-pulse-subtle"
                ></div>
              ))}
          </div>
        ) : filteredClasses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <ClassCard key={classItem.id} classItem={classItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-neutral-700">No classes found</h3>
            <p className="mt-2 text-neutral-500">
              Try adjusting your filters or search term to find classes
            </p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </Container>
    </Layout>
  );
};