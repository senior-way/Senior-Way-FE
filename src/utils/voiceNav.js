// src/utils/voiceNav.js
import { ref } from 'vue'

export function defaultVoiceRules(router) {
  return [
    // 1) 추천 일정 생성 / 설문
    {
      tests: [
        /(추천|맞춤|알아서).*(일정|코스|여행)/,
        /(일정|여행).*(추천|생성|만들|짜)/,
        /(코스|동선|루트).*(추천|만들)/,
        /(설문|선호도|취향).*(시작|조사|하기)/,
        /여행.*(추천|계획|코스)/,
        /추천일정/,
        /일정추천/,
        /맞춤일정/,
        /설문시작/,
        /여행스타일/,
      ],
      run: () => router.push({ name: 'SurveyV2' }),
    },

    // 2) 저장된 일정 확인 / 목록
    {
      tests: [
        /(저장|내|이전|과거).*(일정|스케줄).*(확인|보기|목록|열기)?/,
        /(일정|스케줄).*(보여|확인|목록)/,
        /(저장된일정|일정함|저장목록|내일정)/,
      ],
      run: () => router.push({ name: 'SavedScheduleListV2' }),
    },

    // 3) 무장애 관광지(Barrier Free)
    {
      tests: [
        /무\s*장애/,
        /배(?:리|려)?어?\s*프리/,
        /베리어?\s*프리/,
        /barrier\s*free/i,
        // 단어 하나만 말해도 매칭되도록 뒤쪽을 전부 옵션으로 변경
        /(휠체어|유모차|장애인|보행보조|보조기구)(?:\s*(가능|이용|편한|편의|정보|장소|관광지))?/,
        // 접근성 키워드도 단독 허용
        /(접근성|편의시설|장애물\s*없는|경사로|엘리베이터)(?:.*(관광지|장소|정보))?/,
      ],
      run: () => router.push({ name: 'BarrierFreePlacesV2' }),
    },

    // 4) 정보 관리 / 마이페이지
    {
      tests: [
        /(정보|개인정보|프로필|계정|설정|마이\s*페이지).*(관리|보기|열기)?/,
        /^마이\s*페이지?$/,
        /내\s*정보/,
        /계정관리/,
        /설정페이지/,
      ],
      run: () => router.push({ name: 'MyPageV2' }),
    },

    // 5) 이용 안내 / 도움말
    {
      tests: [
        /이용\s*안내/,
        /도움말/,
        /가이드/,
        /사용법/,
        /설명/,
        /어떻게\s*쓰/,
      ],
      run: () => alert('준비중입니다.'),
    },

    // 6) 뒤로 가기
    {
      tests: [
        /뒤로(\s*가|가기)?/,
        /이전/,
        /한\s*단계\s*뒤/,
        /백/,
      ],
      run: () => router.back(),
    },

    // 7) 홈으로
    {
      tests: [
        /^홈$/,
        /^메인$/,
        /홈으로/,
        /메인으로/,
        /처음\s*(화면|으로)?/,
        /첫\s*화면/,
        /대문/,
      ],
      run: () => router.push({ name: 'HomeV2' }),
    },

    // 8) 로그인
    {
      tests: [
        /로그\s*인/,
        /로그인/,
        /log\s*in/i,
        /로그온/,
      ],
      run: () => router.push({ name: 'LoginV2' }),
    },
  ]
}

export function createVoiceNavigator(
  router,
  {
    lang = 'ko-KR',
    timeout = 8000,
    cooldown = 800,
    rules = defaultVoiceRules(router),
    onNotMatched = (q) => alert(`'${q}' 메뉴를 찾지 못했어요.`),
  } = {}
) {
  const listening = ref(false)
  let rec = null
  let timer = null
  let lastStart = 0

  function build() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return null
    const r = new SR()
    r.lang = lang
    r.interimResults = false
    r.maxAlternatives = 1

    r.onstart = () => {
      listening.value = true
      clearTimeout(timer)
      timer = setTimeout(() => { try { r.stop() } catch {} }, timeout)
    }
    r.onend = () => {
      listening.value = false
      clearTimeout(timer)
    }
    r.onerror = () => {
      listening.value = false
      clearTimeout(timer)
    }
    r.onresult = (e) => {
      const raw = e?.results?.[0]?.[0]?.transcript ?? ''
      const q = raw.trim().toLowerCase().normalize('NFC')
      const qNoSpace = q.replace(/\s+/g, '')
      if (!q) return

      const matched = rules.find(rule =>
        rule.tests?.some(re => re.test(q) || re.test(qNoSpace))
      )

      if (matched) matched.run?.()
      else onNotMatched(raw)
    }
    return r
  }

  function safeStart(r) {
    const now = Date.now()
    if (now - lastStart < cooldown) return
    lastStart = now
    try { r.abort?.() } catch {}
    try { r.start() } catch {}
  }

  function start() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert('이 브라우저는 음성 인식을 지원하지 않아요.'); return }
    if (!rec) rec = build()
    if (rec) safeStart(rec)
  }

  return { listening, start }
}
