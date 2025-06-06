// import { encrypt_text, decrypt_text } from './js_crypto.js';

// // 세션 저장 - 폼에서 직접 읽어서 객체 생성 후 암호화 저장
// export function session_set() {
//     let id = document.querySelector("#typeEmailX").value;
//     let password = document.querySelector("#typePasswordX").value;
//     let random = new Date().toISOString(); // ISO 형식의 타임스탬프

//     const obj = {
//         id: id,
//         password: password,
//         time: random
//     };

//     if (sessionStorage) {
//         const objString = JSON.stringify(obj);
//         const en_text = encrypt_text(objString); // 암호화된 문자열
//         sessionStorage.setItem("Session_Storage_join", en_text);
//     } else {
//         alert("세션 스토리지 지원 x");
//     }
// }

// // 세션 저장 - 외부에서 객체를 받아 암호화하여 저장
// export function session_set2(obj) {
//     if (sessionStorage) {
//         const objString = JSON.stringify(obj);
//         const en_text = encrypt_text(objString);
//         sessionStorage.setItem("Session_Storage_join", en_text);
//     } else {
//         alert("세션 스토리지 지원 x");
//     }
// }

// // 세션 읽기 - 복호화 포함
// export function session_get() {
//     if (sessionStorage) {
//         const en_text = sessionStorage.getItem("Session_Storage_join");
//         if (en_text) {
//             const de_text = decrypt_text(en_text);
//             return JSON.parse(de_text); // 문자열 → 객체로 변환
//         }
//         return null;
//     } else {
//         alert("세션 스토리지 지원 x");
//         return null;
//     }
// }

// // 세션 검사 - 로그인 여부 체크
// export function session_check() {
//     if (sessionStorage.getItem("Session_Storage_join")) {
//         alert("이미 로그인 되었습니다.");
//         location.href = '../login/index_login.html'; // 로그인된 페이지로 이동
//     }
// }

// // 세션 삭제
// export function session_del() {
//     if (sessionStorage) {
//         sessionStorage.removeItem("Session_Storage_join");
//         alert('로그아웃: 세션이 삭제되었습니다.');
//     } else {
//         alert("세션 스토리지 지원 x");
//     }
// }import { encrypt_text, decrypt_text } from './js_crypto.js';

// // 세션 저장 - 폼에서 직접 읽어서 객체 생성 후 암호화 저장
// export function session_set() {
//     let id = document.querySelector("#typeEmailX").value;
//     let password = document.querySelector("#typePasswordX").value;
//     let random = new Date().toISOString(); // ISO 형식의 타임스탬프

//     const obj = {
//         id: id,
//         password: password,
//         time: random
//     };

//     if (sessionStorage) {
//         const objString = JSON.stringify(obj);
//         const en_text = encrypt_text(objString); // 암호화된 문자열
//         sessionStorage.setItem("Session_Storage_join", en_text);
//     } else {
//         alert("세션 스토리지 지원 x");
//     }
// }

// // 세션 저장 - 외부에서 객체를 받아 암호화하여 저장
// export function session_set2(obj) {
//     if (sessionStorage) {
//         const objString = JSON.stringify(obj);
//         const en_text = encrypt_text(objString);
//         sessionStorage.setItem("Session_Storage_join", en_text);
//     } else {
//         alert("세션 스토리지 지원 x");
//     }
// }

// // 세션 읽기 - 복호화 포함
// export function session_get() {
//     if (sessionStorage) {
//         const en_text = sessionStorage.getItem("Session_Storage_join");
//         if (en_text) {
//             const de_text = decrypt_text(en_text);
//             return JSON.parse(de_text); // 문자열 → 객체로 변환
//         }
//         return null;
//     } else {
//         alert("세션 스토리지 지원 x");
//         return null;
//     }
// }

// // 세션 검사 - 로그인 여부 체크
// export function session_check() {
//     if (sessionStorage.getItem("Session_Storage_join")) {
//         alert("이미 로그인 되었습니다.");
//         location.href = '../login/index_login.html'; // 로그인된 페이지로 이동
//     }
// }

// // 세션 삭제
// export function session_del() {
//     if (sessionStorage) {
//         sessionStorage.removeItem("Session_Storage_join");
//         alert('로그아웃: 세션이 삭제되었습니다.');
//     } else {
//         alert("세션 스토리지 지원 x");
//     }
// }

// js/js_session.js
import { encrypt_text, decrypt_text_data } from './js_crypto.js';

/**
 * 세션에 암호화된 JSON 객체 저장 (id/password/timestamp)
 */
export function session_set() {
  const id = document.getElementById('typeEmailX').value;
  const password = document.getElementById('typePasswordX').value;
  const timestamp = new Date().toISOString();

  const obj = { id, password, time: timestamp };

  if (sessionStorage) {
    const plainString = JSON.stringify(obj);
    const encrypted = encrypt_text(plainString);
    sessionStorage.setItem('Session_Storage_join', encrypted);
  } else {
    alert('세션 스토리지 지원 x');
  }
}

/**
 * 세션에서 암호문을 꺼내 복호화 후 객체 반환
 * @returns {Object|null} 로그인 정보 객체 또는 null
 */
export function session_get() {
  if (!sessionStorage) {
    alert('세션 스토리지 지원 x');
    return null;
  }

  const encrypted = sessionStorage.getItem('Session_Storage_join');
  if (!encrypted) return null;

  const key = 'key'; // js_crypto.js 내부에서 padEnd(32) 처리됨
  const decrypted = decrypt_text_data(key, encrypted);
  return JSON.parse(decrypted);
}

/**
 * 세션 유무 확인 (이미 로그인된 상태라면 경고 후 리다이렉트)
 */
export function session_check() {
  if (sessionStorage.getItem('Session_Storage_join')) {
    alert('이미 로그인되었습니다.');
    location.href = '../login/index_login.html';
  }
}


export function session_del() {//세션 삭제
  if (sessionStorage) {
  sessionStorage.removeItem("Session_Storage_join");
  alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
  } else {
  alert("세션 스토리지 지원 x");
  }
}
///////////////////////////////////////////////////////////////////
 export function session_set2(signUpObject) {
   if (!sessionStorage) {
     alert('세션 스토리지 지원 x');
     return;
   }
   const jsonString = JSON.stringify(signUpObject);
   const encrypted = encrypt_text(jsonString);
   sessionStorage.setItem('Session_Storage_signup', encrypted);
 }


 export function session_get2() {
   if (!sessionStorage) {
     alert('세션 스토리지 지원 x');
     return null;
   }

   const encrypted = sessionStorage.getItem('Session_Storage_signup');
   if (!encrypted) return null;

   try {
     const key = 'key'; // js_crypto.js에서 padEnd(32) 처리된 key와 동일
     const decryptedJson = decrypt_text_data(key, encrypted);
     return JSON.parse(decryptedJson);
   } catch (e) {
     console.error('session_get2() 복호화 또는 파싱 오류:', e);
     return null;
   }
 }

 /**
  * 로그아웃 시 호출:
  *  - 회원가입 세션도 함께 삭제하려면 이 함수 호출
  */
 export function session_del2() {
   if (!sessionStorage) {
     alert('세션 스토리지 지원 x');
     return;
   }
   sessionStorage.removeItem('Session_Storage_signup');
 }