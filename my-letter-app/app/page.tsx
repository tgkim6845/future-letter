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
    // 1. 요소를 가져올 때 "이건 인풋태그야(HTMLInputElement)"라고 확실히 알려줍니다.
    // 2. 혹시나 없을 경우를 대비해 null일 수도 있다고(Or Null) 명시합니다.
    const inputEl = document.getElementById("answerInput") as HTMLInputElement | null;

    // 3. 만약 요소가 없으면 아무것도 하지 않고 함수를 끝냅니다. (TypeScript 안심!)
    if (!inputEl) return;

    const inputVal = inputEl.value;

    if (!inputVal) return alert("내용을 입력해주세요!");

    const key = `q${step}`;
    // 기존 답변(answers)에 새로운 키와 값을 추가합니다.
    const newAnswers = { ...answers, [key]: inputVal };
    setAnswers(newAnswers);

    // 4. 입력창 비우기 (위에서 요소가 있다는 걸 확인했으므로 안전합니다)
    inputEl.value = "";

    if (step < 6) {
      setStep(step + 1);
    } else {
      // 마지막 단계라면(예: step이 6일 때) 여기서 로딩/생성 로직 등으로 넘어갈 수 있습니다.
      // (기존 코드의 흐름에 맞게 유지)
    }
  };