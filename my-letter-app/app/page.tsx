"use client";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Home() {
  const [step, setStep] = useState(1);
  
  // 타입 에러 방지: 문자열 키와 값을 가진 객체라고 명시
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState("");

  // ★★★ [수정됨] 요청하신 새로운 질문 리스트 ★★★
  const questions = [
    "미래의 내가 현재의 나를 부르는 첫 문장은? (예: 안녕, 사랑하는 지민아)",
    "지금의 나에게 고마움을 표현한다면?",
    "내가 지나온 고생과 노력을 인정해준다면?",
    "미래에서 보니 별거 아니었던, 오늘 너무 걱정하지 말아야 할 것은?",
    "미래를 위해 지금부터 딱 하나만 실천한다면?",
    "마지막으로 해주고 싶은 따뜻한 말은?",
  ];

  const handleNext = async () => {
    const inputEl = document.getElementById("answerInput") as HTMLInputElement | null;

    if (!inputEl) return;

    const inputVal = inputEl.value;
    if (!inputVal) return alert("내용을 입력해주세요!");

    const key = `q${step}`;
    const newAnswers = { ...answers, [key]: inputVal };
    setAnswers(newAnswers);

    inputEl.value = ""; // 입력창 비우기

    if (step < 6) {
      setStep(step + 1);
    } else {
      // 마지막 단계: 편지 생성 요청
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;
        
        if (!apiKey) {
            throw new Error("API Key가 설정되지 않았습니다.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // ★★★ [수정됨] 질문이 바뀌었으니 AI에게 보내는 요청(프롬프트)도 그에 맞게 수정 ★★★
        const prompt = `
          사용자가 입력한 내용을 바탕으로 미래의 내가 현재의 나에게 보내는 감동적인 편지를 작성해줘.
          
          [입력 정보]
          1. 첫 문장/호칭: ${newAnswers['q1']}
          2. 고마움 표현: ${newAnswers['q2']}
          3. 인정해줄 고생과 노력: ${newAnswers['q3']}
          4. 걱정하지 말아야 할 것: ${newAnswers['q4']}
          5. 실천할 한 가지: ${newAnswers['q5']}
          6. 마지막 따뜻한 말: ${newAnswers['q6']}
          
          [요청 사항]
          - 전체적으로 따뜻하고 다정한 말투로 써줘.
          - 위 내용들을 자연스럽게 문장으로 연결해서 하나의 완성된 편지로 만들어줘.
          - 길이는 500자 내외로 적당하게 작성해줘.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        setLetter(response.text());
      } catch (error) {
        console.error(error);
        alert("편지 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "2rem" }}>💌 미래에서 온 편지</h1>

      {loading ? (
        <div>
          <h2>편지를 작성 중입니다... ⏳</h2>
          <p>미래의 내가 펜을 들었습니다.</p>
        </div>
      ) : letter ? (
        <div style={{ whiteSpace: "pre-wrap", textAlign: "left", lineHeight: "1.6", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "10px" }}>
          <h3>도착한 편지:</h3>
          <p>{letter}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "5px" }}
          >
            다시 하기
          </button>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: "1.1rem", marginBottom: "1rem", lineHeight: "1.5", wordBreak: "keep-all" }}>
            Q{step}. {questions[step - 1]}
          </p>
          
          <input
            type="text"
            id="answerInput"
            placeholder="답변을 입력하세요"
            style={{ padding: "12px", width: "90%", marginBottom: "1rem", fontSize: "1rem", borderRadius: "5px", border: "1px solid #ccc" }}
            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          />
          <br />
          
          <button 
            onClick={handleNext}
            style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "5px", fontSize: "1rem" }}
          >
            {step < 6 ? "다음" : "편지 받기"}
          </button>
        </div>
      )}
    </div>
  );
}