import { useState, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Sample data - replace with actual API call
const popularSearches = [
  "dog food", "cat toys", "fish tank", "bird cage", "puppy treats"
];

const recentSearches = [
  "pet grooming", "premium cat food", "aquarium accessories", "hamster wheel"
];

// Sample categories - replace with your actual categories
const categories = [
  "All Categories", "Dogs", "Cats", "Fish", "Birds", "Small Pets", "Reptiles", "Pet Care"
];

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Handle submission of search
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Save to recent searches (in a real app, store in localStorage or user profile)
    console.log(`Searching for: ${searchQuery} in ${selectedCategory}`);
    
    // Here you would navigate to search results page
    // navigate(`/search?q=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`);
    
    setIsOpen(false);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
    setIsOpen(false);
  };

  // Select a suggestion
  const selectSuggestion = (suggestion: string) => {
    setSearchQuery(suggestion);
    // Option 1: Auto-search when selecting a suggestion
    setTimeout(() => handleSearch(), 0);
    
    // Option 2: Just fill the input and let user submit
    // setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) {
        setTimeout(() => {
          if (!isFocused) setIsOpen(false);
        }, 200);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, isFocused]);

  return (
    <div className="w-full max-w-3xl">
      <form onSubmit={handleSearch} className="relative">
        <div className="flex rounded-md overflow-hidden border border-input shadow-sm focus-within:ring-1 focus-within:ring-primary">
          {/* Category selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                className="hidden md:flex items-center gap-1 h-10 px-3 rounded-none border-r"
              >
                {selectedCategory}
                <span className="text-xs ml-1">▼</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0" align="start">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category}
                        onSelect={() => setSelectedCategory(category)}
                        className={`${selectedCategory === category ? 'bg-muted' : ''}`}
                      >
                        {category}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* Search input */}
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search for pet products, brands, or categories..."
              className="border-0 h-10 focus-visible:ring-0 rounded-none pl-4 pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setIsOpen(true);
                setIsFocused(true);
              }}
              onBlur={() => setIsFocused(false)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Search button */}
          <Button 
            type="submit" 
            className="h-10 rounded-none px-4 sm:px-6"
          >
            <Search className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>

        {/* Search suggestions dropdown */}
        {isOpen && (
          <div className="absolute z-50 top-[calc(100%+2px)] left-0 right-0 bg-background border rounded-md shadow-md max-h-[400px] overflow-y-auto">
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="p-2">
                <div className="flex items-center justify-between px-2 py-1 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                    <span>Recent Searches</span>
                  </div>
                  <button className="text-xs text-primary hover:underline">
                    Clear All
                  </button>
                </div>
                <ul>
                  {recentSearches.map((search) => (
                    <li key={search}>
                      <button
                        type="button"
                        className="w-full text-left px-3 py-1.5 text-sm rounded-sm hover:bg-muted flex items-center"
                        onClick={() => selectSuggestion(search)}
                      >
                        <Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        {search}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Popular searches */}
            <div className="p-2">
              <div className="flex items-center px-2 py-1 text-sm text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                <span>Popular Searches</span>
              </div>
              <ul className="flex flex-wrap gap-2 p-2">
                {popularSearches.map((search) => (
                  <li key={search}>
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs bg-muted hover:bg-muted/80 rounded-full"
                      onClick={() => selectSuggestion(search)}
                    >
                      {search}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Live search results would go here */}
            {searchQuery && (
              <div className="p-2 border-t">
                <div className="px-2 py-1 text-sm text-muted-foreground">
                  Suggested Products
                </div>
                <div className="px-3 py-1.5 text-sm hover:bg-muted">
                  <strong>{searchQuery}</strong> in all categories
                </div>
                {/* Here you would fetch & display live search suggestions */}
                <div className="text-xs text-muted-foreground px-3 py-4 text-center">
                  Type more to see product suggestions
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}