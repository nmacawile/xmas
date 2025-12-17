import "./style.css";
import firestoreDb from "./firestoreDb";
import { doc, getDoc } from "firebase/firestore/lite";

const targetDate = new Date("2025-12-25T00:00:00+08:00");

async function getGift(id) {
  const giftRef = doc(firestoreDb, "gifts", id);
  const giftSnapshot = await getDoc(giftRef);
  if (giftSnapshot.exists()) {
    return giftSnapshot.data();
  } else {
    throw new Error("Gift is not found.");
  }
}

function formatNumber(n) {
  const truncated = Math.trunc(n) + "";
  return truncated.padStart(2, "0");
}

function splitDifference(difference) {
  const days = formatNumber(difference / 86400000) + "d";
  const daysRemainder = difference % 86400000;
  const hours = formatNumber(daysRemainder / 3600000) + "h";
  const hoursRemainder = daysRemainder % 3600000;
  const minutes = formatNumber(hoursRemainder / 60000) + "m";
  const minutesRemainder = hoursRemainder % 60000;
  const seconds = formatNumber(minutesRemainder / 1000) + "s";
  return { days, hours, minutes, seconds };
}

function getCurrentDifference() {
  const now = new Date();
  return targetDate - now;
}

async function identifyRecipient(id) {
  let recipient;
  try {
    const gift = await getGift(id);
    recipient = gift.recipient;
  } catch (error) {
    console.error(error);
  }
  return recipient;
}

function printRecipient(recipient) {
  if (recipient) {
    document.querySelector("#timer").innerHTML =
      `<h2>This gift is for:</h2><h1>${recipient}</h1><h2>Merry Christmas!</h2>`;
  } else {
    document.querySelector("#timer").innerHTML =
      `<h2>Oops! Something went wrong.</h2>`;
  }
}

function addSeparator(stringArr) {
  return stringArr.reduce(
    (res, s) => res + `<span class="colon-separator">${s}</span>`,
    "",
  );
}

async function revealRecipient() {
  const urlParams = new URLSearchParams(window.location.search);
  const giftId = urlParams.get("id");
  if (giftId) {
    const recipient = await identifyRecipient(giftId);
    printRecipient(recipient);
  } else
    document.querySelector("#timer").innerHTML = `<h1>Merry Christmas!</h1>`;
}

function timerIntervalFn(ref) {
  const difference = getCurrentDifference();
  const { days, hours, minutes, seconds } = splitDifference(difference);

  if (difference <= 0) {
    clearInterval(ref);
    revealRecipient();
  } else {
    document.querySelector("#timer").innerHTML =
      `<h1>${addSeparator([days, hours, minutes, seconds])}</h1><h2>until Christmas.</h2>`;
  }
}

function startTimerLoop() {
  let intervalRef = setInterval(() => {
    timerIntervalFn(intervalRef);
  }, 1000);
}

(async function () {
  // timer elapsed
  if (getCurrentDifference() <= 0) {
    revealRecipient();
  }
  // run timer until elapsed
  else {
    startTimerLoop();
  }
})();
