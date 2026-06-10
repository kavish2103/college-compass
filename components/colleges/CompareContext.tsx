'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CollegeCompareItem {
  id: string;
  name: string;
  logoUrl: string;
  location: string;
  city: string;
  state: string;
  type: string;
  establishedYear: number;
  overallRating: number;
}

interface CompareContextType {
  selectedColleges: CollegeCompareItem[];
  addToCompare: (college: CollegeCompareItem) => void;
  removeFromCompare: (collegeId: string) => void;
  clearCompare: () => void;
  isCompared: (collegeId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedColleges, setSelectedColleges] = useState<CollegeCompareItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('compare_colleges');
      if (stored) {
        setSelectedColleges(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load compare list from localStorage:', err);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage when list changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem('compare_colleges', JSON.stringify(selectedColleges));
    } catch (err) {
      console.error('Failed to save compare list to localStorage:', err);
    }
  }, [selectedColleges, isInitialized]);

  const addToCompare = (college: CollegeCompareItem) => {
    setSelectedColleges((prev) => {
      // Check if already in comparison list
      if (prev.some((c) => c.id === college.id)) {
        return prev;
      }
      // Max limit check
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 colleges at once.');
        return prev;
      }
      return [...prev, college];
    });
  };

  const removeFromCompare = (collegeId: string) => {
    setSelectedColleges((prev) => prev.filter((c) => c.id !== collegeId));
  };

  const clearCompare = () => {
    setSelectedColleges([]);
  };

  const isCompared = (collegeId: string) => {
    return selectedColleges.some((c) => c.id === collegeId);
  };

  return (
    <CompareContext.Provider
      value={{
        selectedColleges,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompared,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
