import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9nm9kVpM0xgFlkRZ-sk--3Pk9D96Cdv8",
  authDomain: "dooruvdesign.firebaseapp.com",
  projectId: "dooruvdesign",
  storageBucket: "dooruvdesign.firebasestorage.app",
  messagingSenderId: "1072745676339",
  appId: "1:1072745676339:web:426263ff49d9cefc2a6d46",
  measurementId: "G-TGQQZRW73V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storageKey = "dooruvdesign_access_key";

const body = document.body;
const accessKeyForm = document.getElementById("accessKeyForm");
const accessKeyInput = document.getElementById("accessKeyInput");
const authMessage = document.getElementById("authMessage");
const logoutButton = document.getElementById("logoutButton");

function setMessage(message, type = "") {
  authMessage.textContent = message;
  authMessage.dataset.type = type;
}

function setAccess(isAllowed) {
  body.classList.toggle("is-authorized", isAllowed);
  body.classList.toggle("is-locked", !isAllowed);
  body.classList.remove("auth-loading");
}

function getExpiryEndTime(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate().getTime();
  }

  if (typeof value === "string") {
    const normalized = value.includes("T") ? value : `${value}T23:59:59+08:00`;
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? null : date.getTime();
  }

  return value instanceof Date ? value.getTime() : null;
}

function normalizeKey(value) {
  return value.trim().toUpperCase();
}

async function findAccessKey(inputKey) {
  const normalizedInput = normalizeKey(inputKey);
  const collectionPaths = [
    ["artifacts", "default-app-id", "public", "data", "access_keys"],
    ["accessKeys"],
    ["accesskeys"]
  ];

  for (const pathParts of collectionPaths) {
    try {
      const snapshot = await getDocs(collection(db, ...pathParts));
      const record = snapshot.docs
        .map((item) => ({
          id: item.id,
          ...item.data()
        }))
        .find((item) => normalizeKey(item.key ?? item.id) === normalizedInput);

      if (record) {
        return record;
      }
    } catch (error) {
      // Some projects only allow one of these paths in Firestore rules.
    }
  }

  return null;
}

async function verifyAccessKey(inputKey) {
  const record = await findAccessKey(inputKey);

  if (!record) {
    return {
      allowed: false,
      message: "找不到這組授權碼，請確認輸入是否正確。"
    };
  }

  if (record.active === false) {
    return {
      allowed: false,
      message: "這組授權碼目前未啟用，請聯繫我們。"
    };
  }

  const expiryTime = getExpiryEndTime(record.expiresAt);

  if (expiryTime && expiryTime < Date.now()) {
    return {
      allowed: false,
      message: "這組授權碼已到期，請聯繫我們續約。"
    };
  }

  return {
    allowed: true,
    message: record.customerName ? `${record.customerName}，歡迎使用模擬器。` : "授權確認完成，歡迎使用模擬器。",
    key: record.key ?? record.id
  };
}

async function unlockWithKey(inputKey, shouldRemember = true) {
  setMessage("正在確認授權碼...", "loading");

  try {
    const result = await verifyAccessKey(inputKey);
    setAccess(result.allowed);
    setMessage(result.message, result.allowed ? "success" : "error");

    if (result.allowed && shouldRemember) {
      window.localStorage.setItem(storageKey, result.key);
    }

    if (!result.allowed) {
      window.localStorage.removeItem(storageKey);
    }
  } catch (error) {
    setAccess(false);
    setMessage("無法讀取授權資料，請確認 Firestore 規則已發布。", "error");
  }
}

accessKeyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await unlockWithKey(accessKeyInput.value);
});

logoutButton.addEventListener("click", () => {
  window.localStorage.removeItem(storageKey);
  accessKeyInput.value = "";
  setAccess(false);
  setMessage("授權已清除，請重新輸入授權碼。");
});

const savedKey = window.localStorage.getItem(storageKey);

if (savedKey) {
  unlockWithKey(savedKey, false);
} else {
  setAccess(false);
  setMessage("請輸入授權碼。");
}
