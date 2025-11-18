# 🔷 Senior-Way (시니어웨이)
> **2025 관광데이터 활용 공모전 프로젝트** <br/>
> 개발기간: 2025.05.19 ~ 2025.09.17


시니어 친화형 맞춤 관광 코스 & 보호자 연동 기반 **부산 무장애 여행 웹앱 서비스**


초고령 사회에 대비하여,  
시니어가 더 **안전하고 편하게 여행**할 수 있도록

- 맞춤형 일정 자동 생성  
- 무장애 관광 정보 제공  
- 보호자 연동 기반 실시간 위치 확인  

을 지원하는 웹앱입니다.

---

## 👥 팀 부산스런

| 이름 | GitHub | 역할 |
|------|--------|-------|
| 이다연 | [@Leeday11](https://github.com/Leeday11) | FE |
| 박예빈 | [@yebinnnnn](https://github.com/yebinnnnn) | Infra |
| 박준영 | [@Tarae0419](https://github.com/Tarae0419) | BE |
| 윤제승 | [@yjs1228](https://github.com/yjs1228) | BE |
| 이학준 | [@dlgkrwns213](https://github.com/dlgkrwns213) | BE |

---

# 📌 1. 서비스 개요

**Senior-Way**는 시니어 세대를 위해 설계된 여행 지원 서비스입니다.  
사용자의 **디지털 활용 역량·시력·이동 환경을 고려한 UI/UX**와  
**부산 지역의 무장애 관광 데이터**를 기반으로 개인화된 여행 일정을 생성합니다.

또한 **보호자 연동 기능**을 통해  
시니어의 여행 일정과 현재 위치를 보호자가 실시간 확인할 수 있어  
보다 **안전한 여행 경험을 제공**합니다.

---

# 🌱 2. 서비스 개발 배경

통계청 **2017 여가활동조사**에 따르면,  
65세 이상 시니어의 희망 여가 활동 1위는 **관광(65.8%)**입니다.

실제 여행에서는

- 불편한 교통  
- 부족한 정보  
- 편의 시설 접근성 불안  
- 디지털 격차  

때문에 시니어가 여행을 망설이는 경우가 많습니다.

한국관광공사 데이터 분석에 따르면,

- **경상권 시니어의 부산 관광 선호도**가 매우 높고
- **부산은 무장애 환경 조성이 우수**하여 시니어 특화 지역으로 적합함을 확인했습니다.

이에 본 프로젝트는 시니어의 **물리적·심리적 장벽을 해소**하고,  
누구나 안전하고 즐거운 여행을 할 수 있도록 설계되었습니다.

---

# 🎨 3. 핵심 디자인 전략

## 🟦 Okabe-Ito 색각 배리어 프리 팔레트 적용
- 색각 이상자도 인식 가능한 색 구성  
- 명확한 대비(Contrast)로 가독성 향상  

## 🟪 시니어 친화 UI
- 큰 폰트  
- 명확한 아이콘  
- 단순한 네비게이션 구조  
- 불필요한 정보 최소화  
- 보호자 페이지는 일반 텍스트 UI로 구분  


---

# 🛠 4. 주요 기능

## ✔ 1) 사용자 유형별 회원가입 & 로그인
- 일반 사용자 / 보호자 유형 선택  
- 상단 Breadcrumb로 진행 단계 시각화  
- 카카오 OAuth2 소셜 로그인  
- 비밀번호 암호화 및 계정 관리 포함

---

## ✔ 2) 사용자 기본 홈 화면

### 부산 지역 축제 정보 제공
- 홈 화면 메인 배너에서  
  **현재 시점 기준 가장 가까운 부산 축제 5개 자동 노출**
- 최신 & 시기적절한 관광 정보 제공

### 🎙 음성 인식(STT) 내비게이션
헤더의 마이크 아이콘을 탭하면 음성으로 아래 기능 실행 가능:
- “뒤로 가기”
- “홈으로”
- “일정 생성”
시니어의 디지털 장벽을 최소화함.

<img width="700" alt="image" src="https://github.com/user-attachments/assets/181a0dab-ffc5-462f-8e2e-f686b3f37135" />


---

## ✔ 3) 개인 맞춤 선호도 조사 (Profiling)
설문 항목:
- 여행 선호 유형(힐링/문화/맛집 등)
- 이동 수단
- 휠체어 여부
- 반려동물 여부
- 여행 기간
- 디지털 활용 능력

Breadcrumb UI로 **진행 상황을 단계별 시각화**.

<img width="900" alt="image" src="https://github.com/user-attachments/assets/0baf8719-00dc-4fc8-97f9-bdc3d3639dec" />



---

## ✔ 4) 선호도 조사 기반의 맞춤 여행 일정 자동 생성
- 한국관광공사 **TourAPI** 데이터 연동  
- 선호도 기반 추천 일정 자동 생성  
- “n박 n일 추천 일정” 자동 제목 생성  
- 장소 정보 + 운영시간 + 지도 정보 포함  
- 일정 저장 / 삭제 기능 제공  

<img width="374" height="231" alt="image" src="https://github.com/user-attachments/assets/b5054f73-c70a-448a-88a7-d6ca52417005" />


---

## ✔ 5) 일정 관리 & 오프라인 활용
- 저장된 일정 전체 목록 조회  
- 일정 상세 페이지에서  
  - PDF 다운로드  
  - 이미지(PNG) 다운로드  
- **오프라인에서도 일정 확인 가능**하여 시니어 편의성 향상  

<img width="900" alt="image" src="https://github.com/user-attachments/assets/3040685a-866c-4407-8cf2-5b941bee9e7e" />


---

## ✔ 6) 무장애 관광지(Barrier-Free) 정보
- 부산 지역 **무장애 관광지 리스트 제공**
- 텍스트 검색 / 음성 검색 / 카테고리 필터 지원
- 관광지 상세 페이지에서 제공되는 정보:
  - 휠체어 접근성
  - 전용 화장실 여부
  - 주변 편의시설
  - 카카오맵 기반 위치 표시

<img width="900" alt="image" src="https://github.com/user-attachments/assets/5223fa33-5fda-4f16-b289-26eae9f2fec8" />


---

## ✔ 7) 보호자-사용자 연동 기능
연동 과정:
1. 보호자가 사용자 이메일·이름 입력  
2. 사용자가 이메일 인증으로 승인  
3. 연동 완료 → 상호 연결  

### 📍 실시간 위치 확인
- 카카오맵 API 기반  
- 연동된 사용자의 현재 위치 실시간 조회  

### 🗂 여행 일정 조회
- 사용자가 저장한 모든 일정 확인 가능  
- 여행 중 상황 대응 및 안전 관리 지원  

<img width="900" alt="image" src="https://github.com/user-attachments/assets/d9aab0dd-b347-4e88-a7f4-95d3a2896baa" />


---

## 💻 Tech Stack

### 🌐 Frontend
![Vue3](https://img.shields.io/badge/Vue.js%203-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=white)
![Vue Router](https://img.shields.io/badge/Vue%20Router-4E9CA0?style=for-the-badge&logo=vue.js&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

### 🗺 API & External Services
![TourAPI](https://img.shields.io/badge/TourAPI-1273E6?style=for-the-badge&logo=googlemaps&logoColor=white)
![KakaoMap](https://img.shields.io/badge/KakaoMap_API-FFCD00?style=for-the-badge&logo=kakaotalk&logoColor=000000)
![STT](https://img.shields.io/badge/Speech_to_Text-4285F4?style=for-the-badge&logo=google&logoColor=white)

### 🛠 Backend
![Java](https://img.shields.io/badge/Java%2017-007396?style=for-the-badge&logo=coffeescript&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![JPA](https://img.shields.io/badge/Spring_Data_JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL_8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![OAuth2](https://img.shields.io/badge/OAuth2-3A3A3A?style=for-the-badge&logo=auth0&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-333333?style=for-the-badge&logo=socketdotio&logoColor=white)

📂 **Backend Repo:**  
https://github.com/senior-way/SeniorWay-BE

### ☁️ Infra
![AWS EC2](https://img.shields.io/badge/AWS_EC2-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![AWS RDS](https://img.shields.io/badge/AWS_RDS-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![HTTPS](https://img.shields.io/badge/HTTPS-0052CC?style=for-the-badge&logo=letsencrypt&logoColor=white)

### 🧰 Tools & Collaboration
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Notion](https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=notion&logoColor=white)

