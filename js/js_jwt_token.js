
const JWT_SECRET = "your_secret_key_here";

export function generateJWT(payload) {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));

  const signature = CryptoJS.HmacSHA256(
    `${encodedHeader}.${encodedPayload}`,
    JWT_SECRET
  );
  const encodedSignature = CryptoJS.enc.Base64.stringify(signature);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

function verifyJWT(token) {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    const signature = CryptoJS.HmacSHA256(
      `${encodedHeader}.${encodedPayload}`,
      JWT_SECRET
    );
    const calculated = CryptoJS.enc.Base64.stringify(signature);
    if (calculated !== encodedSignature) return null;

    const payload = JSON.parse(atob(encodedPayload));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      console.log('토큰 만료됨');
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function isAuthenticated() {
  const token = localStorage.getItem('jwt_token');
  if (!token) return false;
  const payload = verifyJWT(token);
  console.log(payload);
  return !!payload;
}

export function checkAuth() {
  if (isAuthenticated()) {
    alert('토큰 검증 완료');
  } else {
    alert('토큰 검증 실패: 로그인 화면으로 이동');
    // location.href = '../login/login.html';
  }
}