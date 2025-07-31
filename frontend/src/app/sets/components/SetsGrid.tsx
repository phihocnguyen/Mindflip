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
  cards: Card[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SetsGridProps {
  filteredSets: Set[];
  searchTerm: string;
  onDelete: (setId: string) => void;
}

export default function SetsGrid({ filteredSets, searchTerm, onDelete }: SetsGridProps) {
  if (filteredSets.length === 0) {
    return <EmptyState searchTerm={searchTerm} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredSets.map((set) => (
        <SetCard key={set._id} set={set} onDelete={onDelete} />
      ))}
    </div>
  );
} 