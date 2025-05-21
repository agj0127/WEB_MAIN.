import { encrypt_text, decrypt_text } from './js_crypto.js';

// 세션 저장 - 폼에서 직접 읽어서 객체 생성 후 암호화 저장
export function session_set() {
    let id = document.querySelector("#typeEmailX").value;
    let password = document.querySelector("#typePasswordX").value;
    let random = new Date().toISOString(); // ISO 형식의 타임스탬프

    const obj = {
        id: id,
        password: password,
        time: random
    };

    if (sessionStorage) {
        const objString = JSON.stringify(obj);
        const en_text = encrypt_text(objString); // 암호화된 문자열
        sessionStorage.setItem("Session_Storage_join", en_text);
    } else {
        alert("세션 스토리지 지원 x");
    }
}

// 세션 저장 - 외부에서 객체를 받아 암호화하여 저장
export function session_set2(obj) {
    if (sessionStorage) {
        const objString = JSON.stringify(obj);
        const en_text = encrypt_text(objString);
        sessionStorage.setItem("Session_Storage_join", en_text);
    } else {
        alert("세션 스토리지 지원 x");
    }
}

// 세션 읽기 - 복호화 포함
export function session_get() {
    if (sessionStorage) {
        const en_text = sessionStorage.getItem("Session_Storage_join");
        if (en_text) {
            const de_text = decrypt_text(en_text);
            return JSON.parse(de_text); // 문자열 → 객체로 변환
        }
        return null;
    } else {
        alert("세션 스토리지 지원 x");
        return null;
    }
}

// 세션 검사 - 로그인 여부 체크
export function session_check() {
    if (sessionStorage.getItem("Session_Storage_join")) {
        alert("이미 로그인 되었습니다.");
        location.href = '../login/index_login.html'; // 로그인된 페이지로 이동
    }
}

// 세션 삭제
export function session_del() {
    if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_join");
        alert('로그아웃: 세션이 삭제되었습니다.');
    } else {
        alert("세션 스토리지 지원 x");
    }
}