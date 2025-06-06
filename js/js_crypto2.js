
function encodeByAES256(key, data) {
  // 슬라이드 10의 코드 그대로
  // key: 문자열, data: 문자열(평문)
  const cipher = CryptoJS.AES.encrypt(
    data,
    CryptoJS.enc.Utf8.parse(key),       // UTF-8 파싱된 키
    {
      iv: CryptoJS.enc.Utf8.parse(""),   // IV 초기화 벡터: 빈 문자열을 UTF-8로 파싱
      padding: CryptoJS.pad.Pkcs7,       // PKCS7 패딩
      mode: CryptoJS.mode.CBC            // CBC 모드
    }
  );
  return cipher.toString();  // Base64 형식의 암호문 반환
}

function decodeByAES256(key, data) {
  // key: 문자열, data: Base64 형식(암호문)
  const cipher = CryptoJS.AES.decrypt(
    data,
    CryptoJS.enc.Utf8.parse(key),       // UTF-8 파싱된 키
    {
      iv: CryptoJS.enc.Utf8.parse(""),   // IV 초기화 벡터
      padding: CryptoJS.pad.Pkcs7,       // PKCS7 패딩
      mode: CryptoJS.mode.CBC            // CBC 모드
    }
  );

  return cipher.toString(CryptoJS.enc.Utf8);
}



export function encrypt_text(password) {
  // 1) 슬라이드 11 참고: 키를 Pad(32)처리
  const k = "key";                // 강의 슬라이드에서 사용한 임시 키(예시)
  const rk = k.padEnd(32, " ");   // AES-256은 키 길이가 32바이트여야 하므로, padEnd

  // 2) 평문(여기서는 password)을 encodeByAES256으로 암호화
  const eb = encodeByAES256(rk, password);

  // 3) 암호문(베이스64 문자열)을 반환
  return eb;
}

export function decrypt_text() {
  // 1) 슬라이드 11: 동일한 key 사용
  const k = "key";
  const rk = k.padEnd(32, " ");

  const eb = session_get();  // eb: Base64 형식의 암호문

  // 3) decodeByAES256()으로 복호화 수행
  const b = decodeByAES256(rk, eb);

  // 4) 콘솔에 복호화된 평문(원래 비밀번호)을 출력
  console.log(b);

  // 5) 필요하다면 복호문을 반환하거나, 호출부에서 이 값을 그대로 활용할 수 있게끔 수정 가능
  return b;
}

