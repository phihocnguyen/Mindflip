import WritingGameClient from './components/WritingGameClient';

// --- MAIN SERVER COMPONENT ---
export default async function WritingGame() {
  // No initial data fetching; handled client-side in WritingGameClient
  return <WritingGameClient />;
}