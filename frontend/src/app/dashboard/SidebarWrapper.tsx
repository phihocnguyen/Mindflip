'use client';

import Sidebar from '../../components/Sidebar';
import { useState } from 'react';

interface SidebarWrapperProps {
  initialSets: any[];
}

export default function SidebarWrapper({ initialSets }: SidebarWrapperProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sets] = useState(initialSets);

  return (
    <Sidebar
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      sets={sets}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    />
  );
}