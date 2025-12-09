import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    // 1. 프론트엔드 데이터 받기
    const data = await req.json();

    // 2. [중요] 키를 직접 입력하세요 (따옴표 필수!)
    const apiKey = "AIzaSyCXZWvMuBz3O3T9d0ASGmYEnOu4dQIMyio"; 

    // 3. AI 설정
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // 모델: gemini-pro 사용
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // 4. 프롬프트 구성
    const prompt = `
      현재의 나에게 보내는 편지.
      내용: ${data.q1}, ${data.q2}, ${data.q3}, ${data.q4}, ${data.q5}, ${data.q6}
      조건: 따뜻한 말투, 500자 내외.
    `;

    // 5. 생성 요청
    console.log("AI에게 요청 보냄..."); // 터미널 확인용 로그
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("AI 응답 성공!"); // 터미널 확인용 로그

    return Response.json({ letter: text });

  } catch (error) {
    // 에러가 나면 터미널에 자세히 출력합니다.
    console.error("============== 에러 발생 ==============");
    console.error(error); 
    console.error("======================================");
    
    // 에러 내용을 프론트엔드로 보냄
    return Response.json({ error: error.message }, { status: 500 });
  }
}