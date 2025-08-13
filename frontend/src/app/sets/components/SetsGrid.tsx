import SetCard from "./SetCard";
import EmptyState from "./EmptyState";

interface Card {
  term: string;
  definition: string;
}

interface Set {
  _id: string;
  title: string;
  description: string;
  terms: Card[];
  isPublic: boolean;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SetsGridProps {
  filteredSets: Set[];
  searchTerm: string;
  onDelete: (setId: string) => void;
}

export default function SetsGrid({ filteredSets, searchTerm, onDelete }: SetsGridProps) {
  // Ensure filteredSets is always an array
  const sets = Array.isArray(filteredSets) ? filteredSets : [];
  
  if (sets.length === 0) {
    return <EmptyState searchTerm={searchTerm} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sets.map((set) => (
        <SetCard key={set._id} set={set} onDelete={onDelete} />
      ))}
    </div>
  );
} 