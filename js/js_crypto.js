// import { session_set, session_get, session_check } from './js_session.js';

// function encodeByAES256(key, data) {
//     const cipher = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
//         iv: CryptoJS.enc.Utf8.parse(""), // IV 초기화 벡터
//         padding: CryptoJS.pad.Pkcs7,     // 패딩
//         mode: CryptoJS.mode.CBC          // 운영 모드
//     });
//     return cipher.toString();
// }

// export function decodeByAES256(key, data) {
//     const cipher = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
//         iv: CryptoJS.enc.Utf8.parse(""),
//         padding: CryptoJS.pad.Pkcs7,
//         mode: CryptoJS.mode.CBC
//     });
//     return cipher.toString(CryptoJS.enc.Utf8);
// }

// export function encrypt_text(password) {
//     const k = "key"; // 클라이언트 키
//     const rk = k.padEnd(32, " "); // AES256은 key 길이가 32
//     const b = password;
//     const eb = encodeByAES256(rk, b); // 실제 암호화
//     return eb;
//     console.log(eb);
// }

// export function decrypt_text() {
//     const k = "key"; // 서버의 키
//     const rk = k.padEnd(32, " "); // AES256은 key 길이가 32
//     const eb = session_get();
//     const b = decodeByAES256(rk, eb); // 실제 복호화
//     console.log(b);
// }

// js/js_crypto.js

/**
 * AES256 암호화 내부 함수 (키 32바이트, 데이터 문자열)
 */
function encodeByAES256(key32, data) {
  return CryptoJS.AES.encrypt(
    data,
    CryptoJS.enc.Utf8.parse(key32),
    {
      iv: CryptoJS.enc.Utf8.parse(""),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    }
  ).toString();
}

/**
 * AES256 복호화 함수
 * @param {string} key - 복호화 키 (padEnd(32) 내부 처리)
 * @param {string} encryptedText - 암호화된 문자열(Base64)
 * @returns {string} - 복호화된 평문
 */
export function decrypt_text_data(key, encryptedText) {
  const key32 = key.padEnd(32, " ");
  const bytes = CryptoJS.AES.decrypt(
    encryptedText,
    CryptoJS.enc.Utf8.parse(key32),
    {
      iv: CryptoJS.enc.Utf8.parse(""),
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    }
  );
  return bytes.toString(CryptoJS.enc.Utf8);
}

/**
 * AES256 암호화 함수
 * @param {string} plainText - 평문 문자열
 * @returns {string} - 암호화된 문자열(Base64)
 */
export function encrypt_text(plainText) {
  const key = "key";               // 실제 운영환경에서는 복잡한 키 사용
  const key32 = key.padEnd(32, " ");
  return encodeByAES256(key32, plainText);
}

