import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { GEMINI_MODEL } from "@/lib/constants";
import { TALIMAT } from "@/lib/talimat";
import { LessonPlan } from "@/types/plan";

// Fallback model if primary model experiences 503 high demand or quota exhaustion
const FALLBACK_MODEL = "gemini-3.1-flash-lite";

function createAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY ortam değişkeni tanımlanmamış.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    lessonName: { type: Type.STRING },
    gradeLevel: { type: Type.STRING },
    subjectTopic: { type: Type.STRING },
    totalDurationMinutes: { type: Type.INTEGER },
    learningOutcomes: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    pedagogicalGoal: { type: Type.STRING },
    keyConcepts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    misconceptions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    materialsNeeded: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    stages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          key: { type: Type.STRING },
          name: { type: Type.STRING },
          durationMinutes: { type: Type.INTEGER },
          objective: { type: Type.STRING },
          teacherAction: { type: Type.STRING },
          studentAction: { type: Type.STRING },
          hookQuestion: { type: Type.STRING },
          activityDetails: { type: Type.STRING },
          scientificExplanations: { type: Type.STRING },
          transferChallenge: { type: Type.STRING },
          exitTicketQuestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          materials: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          "key",
          "name",
          "durationMinutes",
          "objective",
          "teacherAction",
          "studentAction",
        ],
      },
    },
    table5Ideas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tableNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          targetStyle: { type: Type.STRING },
        },
        required: ["tableNumber", "title", "description", "targetStyle"],
      },
    },
    differentiation: {
      type: Type.OBJECT,
      properties: {
        support: { type: Type.STRING },
        enrichment: { type: Type.STRING },
      },
      required: ["support", "enrichment"],
    },
    assessmentRubric: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          criterion: { type: Type.STRING },
          proficient: { type: Type.STRING },
          developing: { type: Type.STRING },
        },
        required: ["criterion", "proficient", "developing"],
      },
    },
    teacherNotes: { type: Type.STRING },
  },
  required: [
    "lessonName",
    "gradeLevel",
    "subjectTopic",
    "totalDurationMinutes",
    "learningOutcomes",
    "pedagogicalGoal",
    "keyConcepts",
    "stages",
    "table5Ideas",
    "differentiation",
    "assessmentRubric",
  ],
};

async function generatePlanWithResilience(ai: GoogleGenAI, prompt: string) {
  const modelChain = [GEMINI_MODEL, FALLBACK_MODEL];
  let lastError: unknown = null;

  for (let i = 0; i < modelChain.length; i++) {
    const currentModel = modelChain[i];

    // Try up to 2 times for transient errors (e.g. 503 high demand spike)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: currentModel,
          contents: prompt,
          config: {
            systemInstruction: TALIMAT,
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
          },
        });
        return { response, modelUsed: currentModel };
      } catch (err: unknown) {
        lastError = err;
        const errStr = String(err);
        const isTemporary =
          errStr.includes("503") ||
          errStr.includes("UNAVAILABLE") ||
          errStr.includes("high demand") ||
          errStr.includes("temporarily") ||
          errStr.includes("429") ||
          errStr.includes("RESOURCE_EXHAUSTED");

        console.warn(
          `[Masa 5 Fikir] Model ${currentModel} (deneme ${attempt}) hata:`,
          errStr.substring(0, 150)
        );

        if (attempt === 1 && isTemporary) {
          // Brief pause before retry attempt
          await new Promise((resolve) => setTimeout(resolve, 800));
          continue;
        }

        // On attempt 2 or non-retryable error, proceed to fallback model
        break;
      }
    }
  }

  throw lastError;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { outcomesText, lessonName, gradeLevel, subjectTopic, additionalNotes } = body;

    if (!outcomesText || typeof outcomesText !== "string" || !outcomesText.trim()) {
      return NextResponse.json(
        { error: "Lütfen en az bir öğrenme çıktısı giriniz." },
        { status: 400 }
      );
    }

    const ai = createAiClient();

    const userPrompt = `
Lütfen aşağıdaki öğrenme çıktılarını ve ders bilgilerini incele. Yalnızca verilen metinle yetinme; konuyu pedagojik ve bilimsel olarak araştırarak derinleştir. 5E modeline uygun, tam 40 dakikalık özgün bir günlük ders planı ve "Masa 5 Fikir" istasyonlarını içeren plan hazırla.

ÖĞRETMEN TARAFINDAN GİRİLEN BİLGİLER:
- Öğrenme Çıktıları:
${outcomesText}
${lessonName ? `- Ders Adı: ${lessonName}` : ""}
${gradeLevel ? `- Kademe / Sınıf: ${gradeLevel}` : ""}
${subjectTopic ? `- Konu / Tema: ${subjectTopic}` : ""}
${additionalNotes ? `- Öğretmen Ek Notu / Sınıf Dinamikleri: ${additionalNotes}` : ""}

LÜTFEN DİKKAT:
- 5 aşamanın (Giriş, Keşfetme, Açıklama, Derinleştirme, Değerlendirme) süreleri toplamı kesinlikle 40 dakika olsun.
- 5 adet yaratıcı masa/istasyon fikri (Masa 1, Masa 2, Masa 3, Masa 4, Masa 5) sun.
- Çıktıyı eksiksiz JSON formatında üret. Asla öğrenci adı veya okul numarası gibi kişisel veriler içermesin.
`;

    const { response, modelUsed } = await generatePlanWithResilience(ai, userPrompt);

    const rawText = response?.text || "{}";
    const planData: LessonPlan = JSON.parse(rawText);

    planData.generatedAt = new Date().toISOString();

    return NextResponse.json({
      ...planData,
      _modelUsed: modelUsed,
    });
  } catch (error: unknown) {
    console.error("Plan generation final error:", error);
    let errMessage = "Ders planı oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.";
    const errStr = error instanceof Error ? error.message : String(error);

    if (
      errStr.includes("503") ||
      errStr.includes("UNAVAILABLE") ||
      errStr.includes("high demand")
    ) {
      errMessage =
        "Yapay zekâ model sunucularında anlık yoğunluk yaşanıyor (503). Lütfen 2-3 saniye sonra tekrar deneyiniz.";
    } else if (
      errStr.includes("429") ||
      errStr.includes("RESOURCE_EXHAUSTED") ||
      errStr.includes("Quota")
    ) {
      errMessage =
        "API kullanım kotası anlık olarak doldu. Lütfen kısa bir süre sonra tekrar deneyiniz.";
    } else if (error instanceof Error && !error.message.startsWith("{")) {
      errMessage = error.message;
    }

    return NextResponse.json({ error: errMessage }, { status: 200 });
  }
}
