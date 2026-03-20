import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export interface SEOAnalysisResult {
  productName: string;
  description: string;
  keywords: string[];
  competitorAnalysis: string;
  seoTips: string[];
  suggestedContent: string;
}

export async function analyzeLensProduct(
  description: string,
  imageData?: string,
  mimeType?: string
): Promise<SEOAnalysisResult | null> {
  try {
    const parts: any[] = [{ text: `Bạn là một chuyên gia Content Marketing và SEO hàng đầu, chuyên biệt trong lĩnh vực kính áp tròng (lens mắt). 
    Nhiệm vụ của bạn là phân tích sản phẩm và tạo ra bộ nội dung chuẩn SEO tối ưu nhất để lên Top Google.
    
    Thông tin sản phẩm người dùng cung cấp: ${description}
    
    Yêu cầu chi tiết:
    1. **Phân tích sản phẩm**: Xác định tên chính xác, phân khúc (lens màu, lens trong suốt, lens 1 ngày, v.v.) và các USP (Unique Selling Points).
    2. **Bộ từ khóa SEO**: Liệt kê 10-15 từ khóa bao gồm: Từ khóa chính (Seed keywords), Từ khóa dài (Long-tail keywords) và Từ khóa ngữ nghĩa (LSI keywords).
    3. **Phân tích nguồn tin cậy**: Sử dụng công cụ tìm kiếm để tham chiếu thông tin từ các trang uy tín như các hiệp hội nhãn khoa, các hãng lens lớn (Seed, Acuvue, v.v.) để đảm bảo tính chuyên môn.
    4. **Chiến lược SEO**: Đưa ra 5 mẹo cụ thể để tối ưu bài viết này (ví dụ: cách đặt thẻ Alt cho ảnh lens, cách chèn link nội bộ).
    5. **Nội dung mẫu chuẩn SEO**: Viết một bài viết mẫu bao gồm:
       - Tiêu đề (H1) hấp dẫn, chứa từ khóa.
       - Đoạn Sapo (Meta Description) thu hút.
       - Các đề mục H2, H3 phân bổ từ khóa tự nhiên.
       - Nội dung chi tiết, chuyên nghiệp, tư vấn cho người dùng về cách chọn và sử dụng lens an toàn.
    
    Hãy trả về kết quả dưới dạng JSON với cấu trúc:
    {
      "productName": "Tên sản phẩm tối ưu",
      "description": "Mô tả ngắn gọn đặc điểm nổi bật",
      "keywords": ["từ khóa 1", "từ khóa 2", ...],
      "competitorAnalysis": "Phân tích chuyên sâu từ các nguồn tin cậy và thị trường",
      "seoTips": ["mẹo 1", "mẹo 2", ...],
      "suggestedContent": "Toàn bộ bài viết mẫu chuẩn SEO (định dạng Markdown)"
    }` }];

    if (imageData && mimeType) {
      parts.push({
        inlineData: {
          data: imageData.split(',')[1], // Remove data:image/png;base64,
          mimeType: mimeType,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            description: { type: Type.STRING },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            competitorAnalysis: { type: Type.STRING },
            seoTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedContent: { type: Type.STRING },
          },
          required: ["productName", "description", "keywords", "competitorAnalysis", "seoTips", "suggestedContent"],
        },
        tools: [{ googleSearch: {} }],
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
}
