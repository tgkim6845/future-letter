"use client";
import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(0); 
  const [answers, setAnswers] = useState({ q1:"", q2:"", q3:"", q4:"", q5:"", q6:"" });
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const questions = [
    "1. 미래의 내가 현재의 나를 부르는 첫 문장은? (예: 안녕, 사랑하는 지민아)",
    "2. 지금의 나에게 고마움을 표현한다면?",
    "3. 내가 지나온 고생과 노력을 인정해준다면?",
    "4. 미래에서 보니 별거 아니었던, 오늘 너무 걱정하지 말아야 할 것은?",
    "5. 미래를 위해 지금부터 딱 하나만 실천한다면?",
    "6. 마지막으로 해주고 싶은 따뜻한 말은?"
  ];

  const handleNext = async () => {
    const inputVal = document.getElementById("answerInput").value;
    if(!inputVal) return alert("내용을 입력해주세요!");

    const key = `q${step}`;
    const newAnswers = { ...answers, [key]: inputVal };
    setAnswers(newAnswers);
    document.getElementById("answerInput").value = "";

    if (step < 6) {
      setStep(step + 1);
    } else {
      setStep(7); // 로딩 화면으로
      setLoading(true);
      
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...newAnswers, [key]: inputVal }),
        });
        const data = await res.json();
        setLetter(data.letter);
        setStep(8); // 결과 화면으로
      } catch (e) {
        alert("오류가 났어요. 다시 시도해주세요.");
        setStep(1);
      } finally {
        setLoading(false);
      }
    }
  };

  // 스타일 (CSS)
  const containerStyle = { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", background: "#f8f9fa", fontFamily: "sans-serif", color:"#333" };
  const cardStyle = { background: "white", padding: "30px", borderRadius: "15px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", maxWidth: "400px", width: "100%", textAlign: "center" };
  const btnStyle = { marginTop: "20px", background: "#3b82f6", color: "#fff", padding: "12px 25px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: "bold", width: "100%" };
  const inputStyle = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "1rem", marginTop: "15px", resize: "none" };

  return (
    <div style={containerStyle}>
      {/* 0. 시작 화면 */}
      {step === 0 && (
        <div style={cardStyle}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>📬 타임캡슐 편지</h1>
          <p style={{ color: "#666", marginBottom: "30px" }}>10년 후의 나에게서 편지가 도착했습니다.<br/>확인하시겠습니까?</p>
          <button onClick={() => setStep(1)} style={btnStyle}>편지 열어보기</button>
        </div>
      )}

      {/* 1~6. 질문 화면 */}
      {step >= 1 && step <= 6 && (
        <div style={cardStyle}>
          <div style={{fontSize:"0.9rem", color:"#3b82f6", fontWeight:"bold", marginBottom:"10px"}}>Question {step} / 6</div>
          <h2 style={{ fontSize: "1.2rem", marginBottom: "20px", lineHeight: "1.5" }}>{questions[step-1]}</h2>
          <textarea id="answerInput" rows="4" style={inputStyle} placeholder="여기에 적어주세요..." />
          <button onClick={handleNext} style={btnStyle}>다음으로</button>
        </div>
      )}

      {/* 7. 로딩 화면 */}
      {step === 7 && (
        <div style={cardStyle}>
          <div style={{ fontSize: "3rem", marginBottom: "20px" }}>⏳</div>
          <h2>편지를 전송받고 있습니다...</h2>
          <p style={{ color: "#888", marginTop: "10px" }}>잠시만 기다려주세요.</p>
        </div>
      )}

      {/* 8. 결과 화면 (편지) */}
      {step === 8 && (
        <div style={{ ...cardStyle, maxWidth:"500px", textAlign: "left", background: "#fffdf5", border: "1px solid #eee" }}>
          <h3 style={{ borderBottom: "2px solid #eee", paddingBottom: "15px", marginBottom: "20px", color: "#444" }}>To. 현재의 나에게</h3>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.8", fontSize: "1.05rem", color: "#222" }}>
            {letter}
          </div>
          <div style={{ marginTop: "40px", textAlign: "right", color: "#888", fontStyle: "italic" }}>
            From. 10년 후의 내가
          </div>
          <button onClick={() => window.location.reload()} style={{...btnStyle, background: "#444", marginTop: "30px"}}>처음으로 돌아가기</button>
        </div>
      )}
    </div>
  );
}