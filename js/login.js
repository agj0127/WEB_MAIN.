// import { session_set, session_get, session_check } from './js_session.js';
// import { encrypt_text, decrypt_text } from './js_crypto.js';
// import { generateJWT, checkAuth } from './js_jwt_token.js';

// function init() {
//     // 로그인 폼에 쿠키에서 가져온 아이디 입력
//     const emailInput = document.getElementById('typeEmailX');
//     const idsave_check = document.getElementById('idSaveCheck');
//     let get_id = getCookie("id");
//     if (get_id) {
//         emailInput.value = get_id;
//         idsave_check.checked = true;
//     }
//     session_check(); // 세션 유무 검사
// }

// document.addEventListener('DOMContentLoaded', () => {
//     init();
//     checkAuth();
//     init_logined();
// });

// function init_logined() {
//     if (sessionStorage) {
//         decrypt_text(); // 복호화 함수
//     } else {
//         alert("세션 스토리지 지원 x");
//     }
// }

// const check_xss = (input) => {
//     // DOMPurify 라이브러리 로드 (CDN 사용)
//     const DOMPurify = window.DOMPurify;
//     // 입력 값을 DOMPurify로 sanitize
//     const sanitizedInput = DOMPurify.sanitize(input);
//     // Sanitized된 값과 원본 입력 값 비교
//     if (sanitizedInput !== input) {
//         // XSS 공격 가능성 발견 시 에러 처리
//         alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
//         return false;
//     }
//     // Sanitized된 값 반환
//     return sanitizedInput;
// };

// function setCookie(name, value, expiredays) {
//     var date = new Date();
//     date.setDate(date.getDate() + expiredays);
//     document.cookie = escape(name) + "=" + escape(value) + "; expires=" + date.toUTCString() + "; path=/";
// }

// function getCookie(name) {
//     var cookie = document.cookie;
//     console.log("쿠키를 요청합니다.");
//     if (cookie != "") {
//         var cookie_array = cookie.split("; ");
//         for (var index in cookie_array) {
//             var cookie_name = cookie_array[index].split("=");
//             if (cookie_name[0] == "id") {
//                 return cookie_name[1];
//             }
//         }
//     }
//     return;
// }

// function logout() {
//     session_del(); // 세션 삭제
//     location.href = '../index.html';
// }

// const check_input = () => {
//     const loginForm = document.getElementById('login_form');
//     const loginBtn = document.getElementById('login_btn');
//     const emailInput = document.getElementById('typeEmailX');
//     const passwordInput = document.getElementById('typePasswordX');
//     const c = '아이디, 패스워드를 체크합니다';
//     alert(c);
//     const emailValue = emailInput.value.trim();
//     const passwordValue = passwordInput.value.trim();
//     const sanitizedPassword = check_xss(passwordValue);
//     // check_xss 함수로 비밀번호 Sanitize
//     const sanitizedEmail = check_xss(emailValue);
//     // check_xss 함수로 이메일 Sanitize
//     const idsave_check = document.getElementById('idSaveCheck');
//     const payload = {
//         id: emailValue,
//         exp: Math.floor(Date.now() / 1000) + 3600 // 1시간 (3600초)
//     };
//     const jwtToken = generateJWT(payload);

//     if (emailValue === '') {
//         alert('이메일을 입력하세요.');
//         return false;
//     }
//     if (passwordValue === '') {
//         alert('비밀번호를 입력하세요.');
//         return false;
//     }

//     if (emailValue.length < 5) {
//         alert('아이디는 최소 5글자 이상 입력해야 합니다.');
//         return false;
//     }

//     if (passwordValue.length < 12) {
//         alert('비밀번호는 반드시 12글자 이상 입력해야 합니다.');
//         return false;
//     }

//     const hasSpecialChar = passwordValue.match(/[!,@#$%^&*()_+\- =\[\]{};':"\\|,.<>\/?]+/) !== null;
//     if (!hasSpecialChar) {
//         alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
//         return false;
//     }
//     const hasUpperCase = passwordValue.match(/[A-Z]+/) !== null;
//     const hasLowerCase = passwordValue.match(/[a-z]+/) !== null;
//     if (!hasUpperCase || !hasLowerCase) {
//         alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
//         return false;
//     }

//     if (!sanitizedEmail) {
//         // Sanitize된 이메일 사용
//         return false;
//     }
//     if (!sanitizedPassword) {
//         // Sanitize된 비밀번호 사용
//         return false;
//     }

//     // 검사 마무리 단계 쿠키 저장, 최하단 submit 이전
//     if (idsave_check.checked == true) { // 아이디 체크 o
//         alert("쿠키를 저장합니다.", emailValue);
//         setCookie("id", emailValue, 1); // 1일 저장
//         alert("쿠키 값 :" + emailValue);
//     } else { // 아이디 체크 x
//         setCookie("id", emailValue.value, 0); // 날짜를 0 - 쿠키 삭제
//     }

//     console.log('이메일:', emailValue);
//     console.log('비밀번호:', passwordValue);

//     session_set(); // 세션 생성
//     localStorage.setItem('jwt_token', jwtToken);
//     loginForm.submit();
// };
// document.getElementById("login_btn").addEventListener('click', check_input);



// js/login.js

import { session_set, session_get, session_check, session_del } from './js_session.js';
import { generateJWT, checkAuth } from './js_jwt_token.js';

document.addEventListener('DOMContentLoaded', () => {
  init();
  checkAuth();
  init_logined();

  // 버튼 클릭 이벤트 바인딩 (DOM 준비 후에만 실행)
  document.getElementById('login_btn').addEventListener('click', check_input);
});

function init() {
  // 로그인 폼에 쿠키에서 가져온 아이디(이메일) 넣기
  const emailInput = document.getElementById('typeEmailX');
  const idsave_check = document.getElementById('idSaveCheck');
  const savedId = getCookie('id');
  if (savedId) {
    emailInput.value = savedId;
    idsave_check.checked = true;
  }
  session_check(); // 이미 로그인된 상태라면 리다이렉트
}

function init_logined() {
  // 세션이 남아 있으면 복호화된 사용자 정보 확인 (콘솔 로그)
  const userInfo = session_get();
  if (userInfo) {
    console.log('로그인된 정보:', userInfo);
  }
}

/**
 * XSS 검증 함수
 * - DOMPurify를 사용해 입력값을 sanitize
 * - 만약 원본과 sanitize 결과가 다르면 XSS 공격 가능성으로 판단
 */
const check_xss = (input) => {
  const DOMPurify = window.DOMPurify;
  const sanitizedInput = DOMPurify.sanitize(input);
  if (sanitizedInput !== input) {
    alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
    return false;
  }
  return sanitizedInput;
};

function setCookie(name, value, expiredays) {
  const date = new Date();
  date.setDate(date.getDate() + expiredays);
  document.cookie =
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let pair of cookies) {
    const [key, val] = pair.split('=');
    if (decodeURIComponent(key) === name) {
      return decodeURIComponent(val);
    }
  }
  return null;
}

function logout() {
  // ───【변경】로그아웃 횟수 쿠키 증가 함수 호출 ─────────────────────────────────────────
  logout_count();

  session_del(); // 세션 삭제
  location.href = '../index.html';
}


 
const check_input = () => {
  const loginForm = document.getElementById('login_form');
  const emailInput = document.getElementById('typeEmailX');
  const passwordInput = document.getElementById('typePasswordX');
  const idsave_check = document.getElementById('idSaveCheck');

  alert('아이디, 패스워드를 체크합니다');

  const emailValue = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  // 1) 빈 값 체크
  if (emailValue === '') {
    alert('이메일을 입력하세요.');
    return false;
  }
  if (passwordValue === '') {
    alert('비밀번호를 입력하세요.');
    return false;
  }

  // 2) 이메일(아이디) 길이 검사 (최대 10자)
  if (emailValue.length > 10) {
    alert('아이디는 최대 10글자 이하로 입력해야 합니다.');
    return false;
  }

  // 3) 비밀번호 길이 검사 (최대 15자)
  if (passwordValue.length > 15) {
    alert('비밀번호는 최대 15글자 이하로 입력해야 합니다.');
    return false;
  }

  // 4) 3글자 이상 반복 입력 금지 (예: 123123, 아이디는아이디)
  const repeatPattern = /(.{3,})\1/;
  if (repeatPattern.test(emailValue)) {
    alert('아이디에 3글자 이상 반복된 문자열이 포함되어 있습니다.');
    return false;
  }
  if (repeatPattern.test(passwordValue)) {
    alert('비밀번호에 3글자 이상 반복된 문자열이 포함되어 있습니다.');
    return false;
  }

  // 5) 연속되는 숫자 2개 이상 반복 입력 금지 (예: 12아이디12)
  const findAllPairs = (str) => {
    const matches = str.match(/\d{2}/g) || [];
    return matches;
  };
  const checkNumericRepeat = (str) => {
    const pairs = findAllPairs(str);
    const counts = {};
    for (let p of pairs) {
      counts[p] = (counts[p] || 0) + 1;
      if (counts[p] > 1) return true;
    }
    return false;
  };
  if (checkNumericRepeat(emailValue)) {
    alert('아이디에 연속된 숫자 2개 이상이 반복되어 사용되었습니다.');
    return false;
  }
  if (checkNumericRepeat(passwordValue)) {
    alert('비밀번호에 연속된 숫자 2개 이상이 반복되어 사용되었습니다.');
    return false;
  }

  // 6) 비밀번호에 특수문자 검사
  const hasSpecialChar = passwordValue.match(/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) !== null;
  if (!hasSpecialChar) {
    alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
    return false;
  }

  // 7) 비밀번호에 대문자/소문자 포함 검사
  const hasUpperCase = passwordValue.match(/[A-Z]+/) !== null;
  const hasLowerCase = passwordValue.match(/[a-z]+/) !== null;
  if (!hasUpperCase || !hasLowerCase) {
    alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
    return false;
  }

  // 8) XSS 검사
  const sanitizedEmail = check_xss(emailValue);
  if (!sanitizedEmail) return false;
  const sanitizedPassword = check_xss(passwordValue);
  if (!sanitizedPassword) return false;

  // 9) 아이디 기억 체크박스가 선택되었으면 쿠키 저장
  if (idsave_check.checked) {
    alert("쿠키를 저장합니다.", sanitizedEmail);
    setCookie("id", sanitizedEmail, 1);
    alert("쿠키 값 : " + sanitizedEmail);
  } else {
    setCookie("id", sanitizedEmail, 0);
  }

  console.log('이메일:', sanitizedEmail);
  console.log('비밀번호:', sanitizedPassword);

  // 10) 세션 생성 (암호화된 JSON을 sessionStorage에 저장)
  session_set();

  // 11) JWT 생성 후 localStorage에 저장
  const payload = {
    id: sanitizedEmail,
    exp: Math.floor(Date.now() / 1000) + 3600 // 1시간 뒤 만료
  };
  const jwtToken = generateJWT(payload);
  localStorage.setItem('jwt_token', jwtToken);
  localStorage.removeItem('jwt_token');
  // ───【추가】로그인 횟수 쿠키를 증가시키는 함수 호출 ─────────────────────────────────────────
  login_count();

  // 12) 최종 폼 제출
  loginForm.submit();
};


/**
 * login_count()
 * - 쿠키 이름: "login_cnt"
 * - 기존 쿠키값(숫자)을 가져와서 +1 한 뒤 업데이트
 * - 쿠키가 없으면 1로 설정
 */
function login_count() {
  const cookieName = 'login_cnt';
  let cnt = parseInt(getCookie(cookieName), 10);
  if (isNaN(cnt)) {
    cnt = 0;
  }
  cnt += 1;
  // 1일 동안 유지
  setCookie(cookieName, cnt, 1);
  console.log(`로그인 횟수(login_cnt): ${cnt}`);
}

/**
 * logout_count()
 * - 쿠키 이름: "logout_cnt"
 * - 기존 쿠키값(숫자)을 가져와서 +1 한 뒤 업데이트
 * - 쿠키가 없으면 1로 설정
 */
function logout_count() {
  const cookieName = 'logout_cnt';
  let cnt = parseInt(getCookie(cookieName), 10);
  if (isNaN(cnt)) {
    cnt = 0;
  }
  cnt += 1;
  // 1일 동안 유지
  setCookie(cookieName, cnt, 1);
  console.log(`로그아웃 횟수(logout_cnt): ${cnt}`);
}

// 로그인된 상태에서 로그아웃 버튼 클릭 시 실행되도록
const logoutBtn = document.getElementById('logout_btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      session_del();
      location.href = '../index.html';
  });
}
// ─────────────────────────────────────────────────────────────────────────────
// function login_failed() {
//   const cookieName = 'login_failed';

//   // 기존 쿠키값을 읽어서 정수로 변환
//   let cnt = parseInt(getCookie(cookieName), 10);
//   if (isNaN(cnt)) {
//     cnt = 0;
//   }

//   // 실패 횟수 +1
//   cnt += 1;
//   // 쿠키에 1일 동안 유지되도록 저장(쿠키 만료: 1일)
//   setCookie(cookieName, cnt, 1);

//   if (cnt >= 3) {
//     // 1) 경고창 보여주기
//     alert(`로그인 실패 횟수 ${cnt}회. 로그인이 제한됩니다.`);


//     const loginBtn = document.getElementById('login_btn');
//     const emailInput = document.getElementById('typeEmailX');
//     const passwordInput = document.getElementById('typePasswordX');
//     if (loginBtn) loginBtn.disabled = true;
//     if (emailInput) emailInput.disabled = true;
//     if (passwordInput) passwordInput.disabled = true;

//     const existingMsg = document.getElementById('login-block-msg');
//     if (existingMsg) {
//       existingMsg.remove();
//     }
//     const msgDiv = document.createElement('div');
//     msgDiv.id = 'login-block-msg';
//     msgDiv.style.color = 'red';
//     msgDiv.style.fontWeight = 'bold';
//     msgDiv.style.marginBottom = '10px';
//     msgDiv.textContent = '로그인 실패 횟수를 초과했습니다. 잠시 후에 다시 시도해주세요.';
//     const formElement = document.getElementById('login_form');
//     if (formElement && formElement.parentNode) {
//       formElement.parentNode.insertBefore(msgDiv, formElement);
//     }
//   } else {
//     console.log(`로그인 실패 횟수(login_failed): ${cnt}회`);
//   }
// }


