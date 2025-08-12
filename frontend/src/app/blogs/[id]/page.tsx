import { redirect } from 'next/navigation';
import SidebarWrapper from '../../dashboard/SidebarWrapper';
import axiosInstance from '../../../libs/axios';
import Link from 'next/link';
import BlogVocabularyManager from '../components/BlogVocabularyManager';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  createdAt: string;
  readTime: number;
  category: string;
  tags: string[];
}

interface Set {
  _id: string;
  title: string;
  description: string;
  cards: any[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: '10 Essential Vocabulary Words for Travelers',
    excerpt: 'Learn the most important English words you need when traveling abroad...',
    content: `Traveling to an English-speaking country can be intimidating if you don't know the essential vocabulary. Here are 10 must-know words that will make your journey smoother and more enjoyable.

1. **Accommodation** - A place where you stay during your trip (hotel, hostel, Airbnb, etc.)
2. **Itinerary** - A planned route or journey including details of where you're going and when
3. **Reservation** - An arrangement to keep something for a specific time (like a hotel room or restaurant table)
4. **Currency** - The money used in a particular country (dollars, pounds, euros, etc.)
5. **Emergency** - A serious, unexpected situation that requires immediate action
6. **Directions** - Instructions that show you how to get from one place to another
7. **Luggage** - Bags and suitcases you take with you when traveling
8. **Passport** - An official document that proves your identity and citizenship when traveling internationally
9. **Visa** - An official document that allows you to enter and stay in a foreign country for a specific period
10. **Souvenir** - An object you buy or collect to remember a place or experience

Knowing these words will help you navigate airports, hotels, and local transportation with confidence. Practice using them in sentences before your trip so they become second nature. Remember, making mistakes is part of learning, so don't be afraid to speak up when you need help!

Happy travels!`,
    author: {
      name: 'Nguyen Thuy Linh',
      bio: 'English teacher with 10 years of experience helping students master travel vocabulary.'
    },
    createdAt: '2023-06-15',
    readTime: 5,
    category: 'Travel',
    tags: ['vocabulary', 'travel', 'beginner']
  },
  {
    id: '2',
    title: 'Mastering Business English: Key Phrases for Meetings',
    excerpt: 'Essential expressions to confidently participate in business meetings...',
    content: `Business meetings in English can be challenging, especially if it's not your first language. Mastering key phrases will boost your confidence and help you contribute effectively.

**Opening the Meeting**
- "Let's get started" - To begin the meeting
- "Thank you all for coming" - Showing appreciation
- "The purpose of today's meeting is..." - Explaining the agenda

**During Discussions**
- "I'd like to add something here" - Introducing a new point
- "That's a good point, and I'd also like to mention..." - Agreeing and adding information
- "Could you clarify that?" - Asking for more explanation
- "From my perspective..." - Sharing your viewpoint

**Expressing Agreement/Disagreement**
- "I completely agree" - Strong agreement
- "I see your point, but..." - Partial agreement with reservation
- "I'm afraid I have to disagree" - Polite disagreement
- "That's not how I see it" - Alternative viewpoint

**Handling Difficult Situations**
- "I'm sorry, I didn't catch that" - Asking for repetition
- "Could we come back to this point?" - Moving on temporarily
- "Let's park this discussion for now" - Table a topic

**Closing the Meeting**
- "To summarize..." - Recap key points
- "What are the next steps?" - Define actions
- "Thank you for your time" - Polite ending

Practice these phrases in mock meetings to build fluency and confidence.`,
    author: {
      name: 'Tran Minh Duc',
      bio: 'Business English specialist with experience in multinational corporations.'
    },
    createdAt: '2023-06-10',
    readTime: 8,
    category: 'Business',
    tags: ['business', 'meetings', 'professional']
  },
  {
    id: '3',
    title: 'Idioms and Expressions: Colloquial English',
    excerpt: 'Understanding common English idioms will greatly improve your fluency...',
    content: `Idioms are expressions that have a meaning different from the literal definition of the words. Mastering common idioms will make your English sound more natural and fluent.

**Common Idioms Explained**

1. **Break the ice** - To initiate conversation in a social setting
   *Example: "He told a joke to break the ice at the meeting."*

2. **Bite the bullet** - To endure a painful or difficult situation
   *Example: "I had to bite the bullet and tell my boss about the mistake."*

3. **Spill the beans** - To reveal a secret
   *Example: "She spilled the beans about the surprise party."*

4. **Hit the nail on the head** - To be exactly right
   *Example: "You hit the nail on the head with that analysis."*

5. **Under the weather** - Feeling sick
   *Example: "I'm feeling under the weather today."*

6. **Piece of cake** - Something very easy
   *Example: "The test was a piece of cake."*

7. **Let the cat out of the bag** - To accidentally reveal a secret
   *Example: "He let the cat out of the bag about their engagement."*

8. **Burn the midnight oil** - To work late into the night
   *Example: "I had to burn the midnight oil to finish the project."*

**Tips for Learning Idioms**
- Keep a journal of new idioms you encounter
- Practice using them in sentences
- Watch English movies and TV shows to hear idioms in context
- Don't translate idioms word-for-word

Understanding idioms takes time, but they're essential for sounding like a native speaker.`,
    author: {
      name: 'Pham Quoc Khanh',
      bio: 'Linguistics expert focusing on colloquial expressions and cultural language nuances.'
    },
    createdAt: '2023-06-05',
    readTime: 10,
    category: 'Expressions',
    tags: ['idioms', 'expressions', 'fluency']
  },
  {
    id: '4',
    title: 'Academic Writing: Formal Vocabulary and Structure',
    excerpt: 'Learn how to write formal academic papers in English with proper vocabulary...',
    content: `Academic writing requires a formal tone, precise vocabulary, and structured organization. Here's how to master the essentials.

**Formal Vocabulary**
Avoid contractions (don't, can't) and use full forms (do not, cannot)
Replace common words with more formal equivalents:
- "Get" → "Obtain" or "Acquire"
- "Use" → "Utilize" or "Employ"
- "Show" → "Demonstrate" or "Illustrate"
- "Big" → "Significant" or "Considerable"

**Academic Phrases**
- "It has been suggested that..." - Introducing theories
- "The evidence indicates..." - Presenting findings
- "This supports the hypothesis that..." - Connecting evidence to theory
- "However, this view has been challenged by..." - Introducing counterarguments
- "In conclusion, it can be argued that..." - Summarizing findings

**Structural Elements**
1. **Introduction** - Present the topic and thesis statement
2. **Literature Review** - Summarize existing research
3. **Methodology** - Explain your research approach
4. **Results** - Present your findings
5. **Discussion** - Interpret results and their implications
6. **Conclusion** - Summarize key points and suggest future research

**Citation and References**
Always cite sources properly using APA, MLA, or Chicago style depending on your field.

Practice writing paragraphs using these structures to develop your academic writing skills.`,
    author: {
      name: 'Le Thi Hoa',
      bio: 'Academic writing coach with experience helping students at universities worldwide.'
    },
    createdAt: '2023-05-28',
    readTime: 12,
    category: 'Academic',
    tags: ['academic', 'writing', 'formal']
  }
];

async function fetchSidebarData(): Promise<Set[]> {
  try {
    const response = await axiosInstance.get('/api/sets');
    return response.data.data || [];
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log('Unauthorized access - token may be invalid');
      return [];
    }
    console.error('Error fetching sidebar data:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const sets = await fetchSidebarData();
  const post = mockBlogPosts.find(p => p.id === params.id);
  if (!post) redirect('/blogs');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64 z-40">
        <SidebarWrapper initialSets={sets} />
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <Link
              href="/blogs"
              className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate max-w-xs">
              {post.title}
            </h1>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Main Content Container - Widened */}
        <main className="w-full px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Desktop Back Button */}
          <div className="hidden lg:block mb-8">
            <Link
              href="/blogs"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Blog
            </Link>
          </div>

          {/* Content Grid - Adjusted for wider content */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Main Article - Takes more space */}
            <div className="xl:col-span-3">
              <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Article Header */}
                <div className="px-6 lg:px-8 pt-6 lg:pt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-800 dark:text-blue-200 border border-blue-200/50 dark:border-blue-700/50">
                      {post.category}
                    </span>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                  
                  <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
                    {post.title}
                  </h1>
                  
                  {/* Author Info */}
                  <div className="flex items-center mb-6 lg:mb-8">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full border-2 border-white dark:border-gray-800 shadow-sm" />
                    </div>
                    <div className="ml-4">
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {post.author.name}
                      </p>
                      {post.author.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-relaxed">
                          {post.author.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700"></div>

                {/* Article Content */}
                <div className="px-6 lg:px-8 py-8 lg:py-12">
                  <div className="text-gray-800 dark:text-gray-200 leading-relaxed space-y-4">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
                            {children}
                          </p>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 mt-8">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 mt-6">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 mt-4">
                            {children}
                          </h3>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-gray-900 dark:text-gray-100">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-gray-700 dark:text-gray-300">
                            {children}
                          </em>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-6 space-y-2 mb-4">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-6 space-y-2 mb-4">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-gray-800 dark:text-gray-200 leading-relaxed">
                            {children}
                          </li>
                        ),
                        a: ({ href, children }) => (
                          <a 
                            href={href} 
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        ),
                        code: ({ children, className }) => {
                          const isInline = !className;
                          if (isInline) {
                            return (
                              <code className="bg-gray-100 dark:bg-gray-800 text-purple-600 dark:text-purple-400 px-2 py-1 rounded text-sm font-mono">
                                {children}
                              </code>
                            );
                          }
                          return (
                            <code className={className}>
                              {children}
                            </code>
                          );
                        },
                        pre: ({ children }) => (
                          <pre className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded-lg overflow-x-auto mb-4">
                            {children}
                          </pre>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 pl-4 py-2 my-4 text-gray-700 dark:text-gray-300 italic">
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {post.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Tags */}
                <div className="px-6 lg:px-8 py-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar - Vocabulary Manager */}
            <aside className="xl:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-1">
                  <BlogVocabularyManager />
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}