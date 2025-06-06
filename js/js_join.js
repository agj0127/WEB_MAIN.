import { session_set2 } from './js_session.js';

function join() { // 회원가입 기능
    let form = document.querySelector("#join_form"); // 회원가입 폼 식별자
    let name = document.querySelector("#form3Example1c");
    let email = document.querySelector("#form3Example3c");
    let password = document.querySelector("#form3Example4c");
    let re_password = document.querySelector("#form3Example4cd");
    let agree = document.querySelector("#form2Example3c");

    form.action = "../index.html"; // 회원가입 성공 시 이동
    form.method = "get"; // 전송 방식

    // 1) 빈 값 검사
    if (
        name.value.trim().length === 0 ||
        email.value.trim().length === 0 ||
        password.value.trim().length === 0 ||
        re_password.value.trim().length === 0
    ) {
        alert("회원가입 폼에 모든 정보를 입력해주세요.");
        return;
    }

    // 2) 이름 정규식 검사 (한글만 허용)
    const nameValue = name.value.trim();
    const nameRegex = /^[가-힣]+$/;
    if (!nameRegex.test(nameValue)) {
        alert("이름은 한글만 입력 가능합니다.");
        name.focus();
        return;
    }

    // 3) 이메일 형식 검사
    const emailValue = email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
        alert("이메일 형식이 올바르지 않습니다.");
        email.focus();
        return;
    }

    // 4) 비밀번호 길이 및 복잡도 검사
    const passwordValue = password.value.trim();
    if (passwordValue.length < 8 || passwordValue.length > 20) {
        alert("비밀번호는 8자 이상, 20자 이하로 입력해야 합니다.");
        password.focus();
        return;
    }
    const pwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!pwRegex.test(passwordValue)) {
        alert("비밀번호는 8자 이상이며, 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다.");
        password.focus();
        return;
    }

    // 5) 비밀번호 재확인 일치 여부 검사
    const rePasswordValue = re_password.value.trim();
    if (passwordValue !== rePasswordValue) {
        alert("비밀번호가 일치하지 않습니다.");
        re_password.focus();
        return;
    }

    // 6) XSS 검사 (DOMPurify 사용)
    function check_xss(input) {
        const DOMPurify = window.DOMPurify;
        const sanitized = DOMPurify.sanitize(input);
        if (sanitized !== input) {
            alert("XSS 공격 가능성이 있는 입력값을 발견했습니다.");
            return false;
        }
        return sanitized;
    }
    const safeName = check_xss(nameValue);
    if (!safeName) return;
    const safeEmail = check_xss(emailValue);
    if (!safeEmail) return;
    const safePassword = check_xss(passwordValue);
    if (!safePassword) return;

    // 7) 약관 동의 확인
    if (!agree.checked) {
        alert("약관에 동의하셔야 가입이 가능합니다.");
        return;
    }


    const newSignUp = new SignUp(
        safeName,
        safeEmail,
        safePassword,
        rePasswordValue
    ); // 회원가입 정보 객체 생성


    const signUpData = newSignUp.getUserInfo();
    session_set2(signUpData);


    form.submit(); // 폼 실행
}

class SignUp {
    constructor(name, email, password, re_password) {
        // 생성자 함수: 객체 생성 시 회원 정보 초기화
        this._name = name;
        this._email = email;
        this._password = password;
        this._re_password = re_password;
    }

    // 전체 회원 정보를 한 번에 설정하는 함수
    setUserInfo(name, email, password, re_password) {
        this._name = name;
        this._email = email;
        this._password = password;
        this._re_password = re_password;
    }
    // 전체 회원 정보를 한 번에 가져오는 함수
    getUserInfo() {
        return {
            name: this._name,
            email: this._email,
            password: this._password,
            re_password: this._re_password
        };
    }
}

document.getElementById("join_btn").addEventListener('click', join); // 이벤트 리스너