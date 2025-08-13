import OpenAI from 'openai';

// --- ĐỊNH NGHĨA TYPES (Giữ nguyên) ---
export interface VocabularyTerm {
  term: string;
  definition: string;
  lang: string;
}

export interface PassageResult {
  passage: string;
  missingWords: { index: number; term: string }[];
}

export interface TranslationResult {
  word: string;
  translation: string;
  exampleSentence: string;
}

// --- THAY ĐỔI QUAN TRỌNG: KHỞI TẠO CLIENT CHO OPENROUTER ---
// Client này sử dụng thư viện của OpenAI nhưng trỏ đến máy chủ của OpenRouter.
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
  // Không cần thêm 'dangerouslyAllowBrowser: true' nếu bạn đang chạy code này ở phía server (API routes).
  // Nếu chạy ở phía client, hãy thêm dòng này.
  dangerouslyAllowBrowser: true, 
});

// Chọn một mô hình miễn phí từ OpenRouter.
// Bạn có thể xem danh sách các mô hình miễn phí trên trang web của OpenRouter.
const FREE_MODEL = "mistralai/mistral-7b-instruct:free";


/**
 * Tạo một đoạn văn chứa các từ vựng cho trước, sau đó ẩn các từ đó đi.
 * @param vocabulary - Mảng các từ vựng cần đưa vào đoạn văn.
 * @returns Một đối tượng chứa đoạn văn với các chỗ trống và danh sách các từ bị thiếu.
 */
export async function generatePassage(vocabulary: VocabularyTerm[]): Promise<PassageResult> {
  if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is missing. Please set NEXT_PUBLIC_OPENROUTER_API_KEY in .env.local.');
  }
  if (!vocabulary || vocabulary.length === 0) {
    throw new Error('Vocabulary list cannot be empty.');
  }

  try {
    const terms = vocabulary.map(v => v.term);
    const lang = vocabulary[0]?.lang || 'en-US';

    const prompt = `
      Task: Write a short, single paragraph (around 50-70 words) in ${lang} that naturally includes all of the following words.
      Do not add any titles, explanations, or extra formatting. Just the paragraph.
      Words: ${terms.join(', ')}
    `;

    // --- THAY ĐỔI: SỬ DỤNG API CHAT COMPLETION CỦA OPENROUTER ---
    const response = await openrouter.chat.completions.create({
      model: FREE_MODEL,
      messages: [
        { role: "system", content: "You are a helpful assistant that writes clear and concise paragraphs." },
        { role: "user", content: prompt },
      ],
      max_tokens: 250,
      temperature: 0.8,
      n: 1,
    });

    const generatedParagraph = response.choices[0]?.message?.content?.trim();
    if (!generatedParagraph) {
        throw new Error("AI model did not return a valid paragraph.");
    }

    // Logic xử lý đoạn văn và tạo chỗ trống giữ nguyên vì nó hiệu quả
    const missingWords: { index: number; term: string }[] = [];
    let passageWithBlanks = ` ${generatedParagraph} `;
    let blankIndex = 0;

    const sortedTerms = [...terms].sort((a, b) => b.length - a.length);

    sortedTerms.forEach(term => {
      const termRegex = new RegExp(`\\b${term}\\b`, 'gi');
      if (termRegex.test(passageWithBlanks)) {
        passageWithBlanks = passageWithBlanks.replace(termRegex, `[BLANK]`);
        missingWords.push({ index: 0, term: term });
      }
    });

    const finalMissingWords: { index: number; term: string }[] = [];
    let match;
    const blankRegex = /\[BLANK\]/g;
    while ((match = blankRegex.exec(passageWithBlanks)) !== null) {
        const originalWord = missingWords.find(mw => generatedParagraph.toLowerCase().includes(mw.term.toLowerCase()));
        if (originalWord) {
            finalMissingWords.push({ index: blankIndex, term: originalWord.term });
            missingWords.splice(missingWords.indexOf(originalWord), 1);
            blankIndex++;
        }
    }

    return {
      passage: passageWithBlanks.trim(),
      missingWords: finalMissingWords,
    };

  } catch (error: any) {
    console.error('Failed to generate passage with OpenRouter:', error);
    throw new Error(error.message || 'Không thể tạo đoạn văn.');
  }
}


/**
 * Dịch một từ sang tiếng Việt và tạo một câu ví dụ bằng tiếng Anh.
 * @param word - Từ tiếng Anh cần xử lý.
 * @returns Một đối tượng chứa từ gốc, bản dịch và câu ví dụ.
 */
export async function translateWordWithExample(word: string): Promise<TranslationResult> {
  if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is missing.');
  }

  try {
    // --- THAY ĐỔI: YÊU CẦU MÔ HÌNH LÀM 2 VIỆC CÙNG LÚC VÀ TRẢ VỀ JSON ---
    // Cách này hiệu quả hơn là gọi API 2 lần.
    const prompt = `
      For the English word "${word}", please provide the following in a valid JSON format:
      1. The Vietnamese translation for the word.
      2. A simple and natural example sentence in English using the word.
      
      JSON format should be: {"translation": "...", "exampleSentence": "..."}
    `;

    const response = await openrouter.chat.completions.create({
      model: FREE_MODEL,
      messages: [
        { role: "system", content: "You are an API that provides translations and example sentences in a strict JSON format." },
        { role: "user", content: prompt },
      ],
      // Yêu cầu mô hình trả về JSON
      response_format: { type: "json_object" },
      max_tokens: 150,
      temperature: 0.5,
    });

    const jsonResponse = response.choices[0]?.message?.content;
    if (!jsonResponse) {
        throw new Error("AI model did not return a valid response.");
    }

    // Parse kết quả JSON
    const parsedResult = JSON.parse(jsonResponse);

    return {
      word: word,
      translation: parsedResult.translation || "",
      exampleSentence: parsedResult.exampleSentence || "",
    };

  } catch (error: any) {
    console.error(`Lỗi khi xử lý từ "${word}" với OpenRouter:`, error);
    throw new Error(error.message || 'Không thể xử lý yêu cầu. Vui lòng thử lại.');
  }
}