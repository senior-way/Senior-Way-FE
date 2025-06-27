<template>
  <div class="wrap">
    <!-- 헤더 -->
    <header>
      <img src="@/assets/img/seniorway_logo.png" alt="SENIORWAY Logo" class="header_logo" />
    </header>

    <!-- 본문 -->
    <div class="container">
      <div class="content">
        <!-- 검색창 -->
        <div class="search-bar">
            <img src="@/assets/img/search-icon.png" alt="검색 아이콘" class="search-icon" />
            <input type="text" placeholder="검색어를 입력하세요" class="search-input" ref="searchInput"/>
            <!-- 검색창 마이크 버튼 -->
            <button class="mic-btn" @click="startSTT">
            <img src="@/assets/img/mic-icon.png" alt="마이크 아이콘" />
            </button>
        </div>

        <!-- 음성 안내 -->
        <div class="voice-guide">
            <!-- 큰 마이크 버튼 -->
            <button class="big-mic-btn" @click="startSTT">
            <img src="@/assets/img/mic-icon.png" alt="음성 마이크" class="big-mic" />
            </button>
          <p class="guide-text">
            음성 인식으로 검색이 가능합니다.<br />
            마이크 버튼을 누르고 검색하고 싶은<br />
            단어를 얘기해보세요.
          </p>
        </div>

        <!-- 검색 예시 -->
        <div class="gray-box">검색 예시</div>

        <!-- 추천 관광지/배너 -->
        <div class="gray-box">추천 관광지/배너</div>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { ref } from 'vue';

    const searchInput = ref(null);

    const startSTT = () => {
    const input = document.querySelector('.search-input');
    if (!input) return;

    // 1. 검색창에 커서 깜빡이게 (focus)
    input.focus();

    // 2. 브라우저가 Web Speech API를 지원하는지 확인
    if (!('webkitSpeechRecognition' in window)) {
        alert('음성 인식을 지원하지 않는 브라우저입니다.');
        return;
    }

    const recognition = new webkitSpeechRecognition(); // Chrome 전용
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    // 3. 음성 인식 성공 시
    recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log('인식된 텍스트:', transcript);

    if (searchInput.value) {
        searchInput.value.value = transcript;
    } else {
        console.warn('searchInput DOM이 존재하지 않음');
    }
    };


    // 4. 오류 처리
    recognition.onerror = (event) => {
        console.error('STT 오류:', event.error);
    };

    // 5. 5초 뒤 자동 종료
    setTimeout(() => {
        recognition.stop();
        console.log('음성 인식 자동 종료됨 (5초 타이머)');
    }, 5000);
    };

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  line-height: 1;
  letter-spacing: -0.03rem;
}

.wrap {
  width: 100%;
  max-width: 360px;
  height: 100dvh;
  max-height: 740px;
  margin: 0 auto;
  background-color: #f6f6f6;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* header */
.header_logo {
  padding-top: 2rem;
  padding-bottom: 2rem;
  width: 15rem;
  display: block;
  margin: 0 auto;
}

/* 컨테이너 영역 */
.container {
  flex-grow: 1;
  width: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
}

/* 검색 바 */
.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 0.5rem 0.8rem;
  width: 90%;
  max-width: 320px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  margin: 0 0.5rem;
  outline: none;
}

.search-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.5rem;
}

.search-bar img {
  width: 24px;
  height: 24px;
}

.mic-btn {
  background: none;      
  border: none;         
  padding: 0;          
  outline: none;       
  cursor: pointer;     
  display: flex;       
  align-items: center;
  justify-content: center;
}

/* 음성 안내 */
.voice-guide {
  background-color: #ffffff;
  width: 90%;
  max-width: 330px;
  padding: 1rem;
  border-radius: 12px;
  text-align: center;
}

.big-mic-btn {
  background: none;
  border: none;
  padding: 0;
  margin-bottom: 1rem;
  cursor: pointer;
}

.big-mic {
  width: 5rem;
  height: 5rem;
  display: block;
}

.guide-text {
  font-size: 1rem;
  color: #7d828d;
  line-height: 1.3rem;
  font-family: 'Font-Medium';
  text-decoration: underline;
  text-decoration-color: #7d828d;
  text-underline-offset: 3px;
}

/* 회색 박스 */
.gray-box {
  width: 90%;
  max-width: 330px;
  height: 100px;
  background-color: #e0e0e0;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Font-Bold';
  font-size: 1.1rem;
}
</style>
