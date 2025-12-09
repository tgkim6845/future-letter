// check_models.js
const https = require('https');

// ★★★ 여기에 새 프로젝트에서 받은 키를 넣어주세요 ★★★
const API_KEY = "AIzaSyCXZWvMuBz3O3T9d0ASGmYEnOu4dQIMyio"; 

// 라이브러리 없이 구글 서버에 직접 물어보는 주소
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log(`📡 연결 시도 중...`);

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const response = JSON.parse(data);

    if (res.statusCode === 200) {
        console.log("\n✅ API 키가 정상입니다! (새 프로젝트 키 인증 성공)");
        console.log("------------------------------------------------");
        console.log("사용 가능한 모델 목록:");
        
        let canUseFlash = false;
        if (response.models) {
            response.models.forEach(model => {
                // 모델 이름만 깔끔하게 출력
                const name = model.name.replace('models/', '');
                console.log(` - ${name}`);
                if (name === 'gemini-1.5-flash') canUseFlash = true;
            });
        }
        
        console.log("------------------------------------------------");
        if (canUseFlash) {
            console.log("💡 [해결책] 코드에서 모델 이름을 'gemini-1.5-flash'로 바꾸세요.");
            console.log("   (현재 오류 로그를 보면 'gemini-pro'를 요청하고 있어 404가 뜨는 것입니다.)");
        }
    } else {
        console.log(`\n❌ 오류 발생 (Status: ${res.statusCode})`);
        console.log(`이유: ${response.error?.message || '알 수 없음'}`);
        if (res.statusCode === 400) console.log("👉 힌트: API 키를 복사할 때 공백이 들어갔는지 확인하세요.");
    }
  });

}).on("error", (err) => {
  console.log("인터넷 연결 오류:", err.message);
});