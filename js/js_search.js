document.getElementById("search_button_msg").addEventListener('click', search_message);

function search_message() {
    alert("검색을 수행합니다!");
}

function search_message() {
    let msg2 = "검색을 수행합니다.";
    alert(msg2);
}

function googleSearch() {
    const searchTerm = document.getElementById("search_input").value;

    if (!searchTerm || searchTerm.trim().length === 0) {
        alert("검색어를 입력해주세요.");
        return false;
    }

    const badWords = [
        "바보",
        "멍청이",
        "나쁜놈",
        "죽어",
        "죽어라"
    ];

    for (let i = 0; i < badWords.length; i++) {
        const bad = badWords[i];
        if (searchTerm.toLowerCase().includes(bad.toLowerCase())) {
            alert("부적절한 단어가 포함되어 있어 검색을 중단합니다.");
            return false;
        }
    }

    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
    window.open(googleSearchUrl, "_blank");
    return false;
}

