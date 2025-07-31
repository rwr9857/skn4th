// 전역 변수
let conversations = {
  1: {
    title: "대화 1",
    messages: [
      {
        role: "system",
        content: "세탁기/건조기 매뉴얼 Q&A 챗봇이 시작되었습니다.",
      },
    ],
    image: null,
  },
};
let currentConversationId = "1";
let isTyping = false;

// DOM 요소
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const chatForm = document.getElementById("chatForm");
const imageInput = document.getElementById("imageInput");
const imageUploadArea = document.getElementById("imageUploadArea");
const imageDisplayArea = document.getElementById("imageDisplayArea");
const conversationList = document.getElementById("conversationList");
const newChatBtn = document.getElementById("newChatBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const downloadBtn = document.getElementById("downloadBtn");
const totalMessages = document.getElementById("totalMessages");
const totalConversations = document.getElementById("totalConversations");

// 초기화
document.addEventListener("DOMContentLoaded", function () {
  updateChatDisplay();
  updateStats();
  setupEventListeners();
});

// 이벤트 리스너 설정
function setupEventListeners() {
  // 채팅 폼 제출
  chatForm.addEventListener("submit", handleChatSubmit);

  // 이미지 업로드
  imageUploadArea.addEventListener("click", () => imageInput.click());
  imageInput.addEventListener("change", handleImageUpload);

  // 드래그 앤 드롭
  imageUploadArea.addEventListener("dragover", handleDragOver);
  imageUploadArea.addEventListener("drop", handleDrop);
  imageUploadArea.addEventListener("dragleave", handleDragLeave);

  // 버튼 이벤트
  newChatBtn.addEventListener("click", createNewConversation);
  clearAllBtn.addEventListener("click", clearAllConversations);
  downloadBtn.addEventListener("click", downloadChatHistory);
}

// 채팅 제출 처리
function handleChatSubmit(e) {
  e.preventDefault();
  const message = messageInput.value.trim();
  if (!message && !conversations[currentConversationId].image) return;

  if (message) {
    addMessage("user", message);
    messageInput.value = "";
  }

  // 봇 응답 시뮬레이션
  simulateBotResponse(message);
}

// 메시지 추가
function addMessage(role, content) {
  conversations[currentConversationId].messages.push({
    role: role,
    content: content,
    timestamp: new Date(),
  });
  updateChatDisplay();
  updateStats();
}

// 봇 응답 시뮬레이션
function simulateBotResponse(userMessage) {
  isTyping = true;
  showTypingIndicator();

  setTimeout(() => {
    isTyping = false;
    hideTypingIndicator();

    // 간단한 응답 시뮬레이션
    let response = generateBotResponse(userMessage);
    addMessage("assistant", response);
  }, 2000);
}

// 봇 응답 생성 (실제로는 서버 API 호출)
function generateBotResponse(userMessage) {
  const responses = [
    "세탁기 관련 문의를 확인했습니다. 매뉴얼을 검색 중입니다...",
    "건조기 사용법에 대한 정보를 찾았습니다. 자세한 내용을 안내드리겠습니다.",
    "업로드하신 이미지를 분석했습니다. 해당 모델의 사용법을 설명드리겠습니다.",
    "에러 코드 해결 방법을 매뉴얼에서 찾았습니다. 단계별로 안내드리겠습니다.",
    "필터 청소 방법에 대한 상세한 가이드를 제공드리겠습니다.",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}
// 타이핑 인디케이터
function showTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "message bot typing-message";
  typingDiv.innerHTML = `
                <div class="avatar bot">🤖</div>
                <div class="message-content">
                    <div class="typing-indicator">
                        답변을 작성 중입니다<span class="typing-dots"></span>
                    </div>
                </div>
            `;
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
  const typingMessage = chatMessages.querySelector(".typing-message");
  if (typingMessage) {
    typingMessage.remove();
  }
}

// 채팅 화면 업데이트
function updateChatDisplay() {
  const messages = conversations[currentConversationId].messages;
  chatMessages.innerHTML = "";

  messages.forEach((message) => {
    const messageDiv = document.createElement("div");

    if (message.role === "system") {
      messageDiv.className = "system-message";
      messageDiv.innerHTML = `<i class="fas fa-info-circle"></i> ${message.content}`;
    } else {
      messageDiv.className = `message ${message.role}`;
      const avatar = message.role === "user" ? "👤" : "🤖";
      const avatarClass = message.role === "user" ? "user" : "bot";

      messageDiv.innerHTML = `
                        ${
                          message.role === "user"
                            ? ""
                            : `<div class="avatar ${avatarClass}">${avatar}</div>`
                        }
                        <div class="message-content">${message.content}</div>
                        ${
                          message.role === "user"
                            ? `<div class="avatar ${avatarClass}">${avatar}</div>`
                            : ""
                        }
                    `;
    }

    chatMessages.appendChild(messageDiv);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
  updateImageDisplay();
}

// 이미지 업로드 처리
function handleImageUpload(e) {
  const file = e.target.files[0];
  if (file) {
    processImage(file);
  }
}

// 이미지 처리
function processImage(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    conversations[currentConversationId].image = {
      src: e.target.result,
      name: file.name,
    };
    updateImageDisplay();
    addMessage("user", "이미지를 업로드했습니다.");
  };
  reader.readAsDataURL(file);
}

// 이미지 표시 업데이트
function updateImageDisplay() {
  const currentImage = conversations[currentConversationId].image;

  if (currentImage) {
    imageDisplayArea.innerHTML = `
                    <img src="${currentImage.src}" alt="업로드된 이미지" class="uploaded-image">
                    <div class="product-info">
                        <h6><i class="fas fa-tools"></i> 제품명: 분석 중...</h6>
                        <h6><i class="fas fa-cog"></i> 모델명: 확인 중...</h6>
                    </div>
                `;
  } else {
    imageDisplayArea.innerHTML = `
                    <div class="text-center text-muted">
                        <i class="fas fa-image fa-3x mb-3"></i>
                        <p>현재 대화에 업로드된 이미지가 없습니다.</p>
                    </div>
                `;
  }
}

// 드래그 앤 드롭 처리
function handleDragOver(e) {
  e.preventDefault();
  imageUploadArea.classList.add("dragover");
}

function handleDrop(e) {
  e.preventDefault();
  imageUploadArea.classList.remove("dragover");
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    processImage(files[0]);
  }
}

function handleDragLeave(e) {
  imageUploadArea.classList.remove("dragover");
}

// 새 대화 생성
function createNewConversation() {
  const newId = String(
    Math.max(...Object.keys(conversations).map((k) => parseInt(k))) + 1
  );
  conversations[newId] = {
    title: `대화 ${newId}`,
    messages: [
      {
        role: "system",
        content: "새 대화가 시작되었습니다.",
      },
    ],
    image: null,
  };
  currentConversationId = newId;
  updateConversationList();
  updateChatDisplay();
  updateStats();
}

// 대화 목록 업데이트
function updateConversationList() {
  conversationList.innerHTML = "";
  Object.keys(conversations).forEach((id) => {
    const button = document.createElement("button");
    button.className = `btn conversation-item w-100 ${
      id === currentConversationId ? "active" : ""
    }`;
    button.setAttribute("data-id", id);
    button.innerHTML = `<i class="fas fa-comment"></i> ${conversations[id].title}`;
    button.addEventListener("click", () => switchConversation(id));
    conversationList.appendChild(button);
  });
}

// 대화 전환
function switchConversation(id) {
  currentConversationId = id;
  updateConversationList();
  updateChatDisplay();
}

// 모든 대화 삭제
function clearAllConversations() {
  if (confirm("정말로 모든 대화 기록을 삭제하시겠습니까?")) {
    conversations = {
      1: {
        title: "대화 1",
        messages: [
          {
            role: "system",
            content: "세탁기/건조기 매뉴얼 Q&A 챗봇이 시작되었습니다.",
          },
        ],
        image: null,
      },
    };
    currentConversationId = "1";
    updateConversationList();
    updateChatDisplay();
    updateStats();
  }
}

// 채팅 기록 다운로드
function downloadChatHistory() {
  const data = {
    conversations: conversations,
    downloadDate: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `chat_history_${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/:/g, "-")}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// 통계 업데이트
function updateStats() {
  const totalMsg = Object.values(conversations).reduce(
    (total, conv) =>
      total + conv.messages.filter((m) => m.role !== "system").length,
    0
  );
  totalMessages.textContent = totalMsg;
  totalConversations.textContent = Object.keys(conversations).length;
}
