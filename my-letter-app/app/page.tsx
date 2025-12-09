"use client";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function Home() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState("");

  // 질문 목록
  const questions = [
    "1. 미래의 내가 현재의 나를 부르는 첫 문장은? (예: 안녕, 사랑하는 지민아)",
    "2. 지금의 나에게 고마움을 표현한다면?",
    "3. 내가 지나온 고생과 노력을 인정해준다면?",
    "4. 미래에서 보니 별거 아니었던, 오늘 너무 걱정하지 말아야 할 것은?",
    "5. 미래를 위해 지금부터 딱 하나만 실천한다면?",
    "6. 마지막으로 해주고 싶은 따뜻한 말은?",
  ];

  const handleNext = async () => {
    // 1. 요소를 가져올 때 "이건 인풋태그야"라고 알려줌
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
      // 마지막 단계: 편지 생성 시작
      setLoading(true);
      try {
        // ★ .env 파일에서 키를 가져올 때는 NEXT_PUBLIC_ 접두사가 필요할 수 있습니다.
        // 혹시 에러나면 .env 변수명을 NEXT_PUBLIC_GOOGLE_API_KEY로 바꾸세요.
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY || process.env.GOOGLE_API_KEY;
        
        if (!apiKey) {
            throw new Error("API Key가 설정되지 않았습니다.");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // 모델 이름은 가장 안정적인 것으로 설정
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
          미래의 내가 현재의 나를 부르는 첫 문장: ${newAnswers['q1']}
          지금의 나에게 고마움을 표현한다면: ${newAnswers['q2']}
          내가 지나온 고생과 노력을 인정해준다면: ${newAnswers['q3']}
          미래에서 보니 별거 아니었던, 오늘 너무 걱정하지 말아야 할 것은: ${newAnswers['q4']}
          미래를 위해 지금부터 딱 하나만 실천한다면: ${newAnswers['q5']}
          마지막으로 해주고 싶은 따뜻한 말은: ${newAnswers['q6']}
          
          위 정보를 바탕으로 미래의 내가 현재의 나에게 보내는 따뜻하고 희망찬 편지를 써줘.
          말투는 위 정보에 사용된 어투를 참고해서 써주고, 너무 길지 않게(500자 이내) 부탁해.
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

  // ▼▼▼ 여기가 사라져서 백지였던 겁니다! 복구했습니다. ▼▼▼
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ marginBottom: "2rem" }}>💌 미래에서 온 편지</h1>

      {loading ? (
        <div>
          <h2>편지를 작성 중입니다... ⏳</h2>
          <p>잠시만 기다려주세요.</p>
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
          <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
            Q{step}. {questions[step - 1]}
          </p>
          
          <input
            type="text"
            id="answerInput"
            placeholder="답변을 입력하세요"
            style={{ padding: "10px", width: "80%", marginBottom: "1rem", fontSize: "1rem" }}
            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          />
          <br />
          
          <button 
            onClick={handleNext}
            style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "5px", fontSize: "1rem" }}
          >
            {step < 6 ? "다음 질문" : "편지 받기"}
          </button>
        </div>
      )}
    </div>
  );
}