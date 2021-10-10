"use strict";

var inputHeight = document.querySelector(".height-group input");
var inputWeight = document.querySelector(".weight-group input");
var verifyHeight = document.querySelector(".height-group p"); //input verify info

var verifyWeight = document.querySelector(".weight-group p"); //input verify info

var resultBtn = document.querySelector(".see-result");
var showResult = document.querySelector("#show-result");
var resultNum = document.querySelector(".result-num");
var resultMsg = document.querySelector(".result-msg");
var resetBtn = document.querySelector(".reset-btn");
var list = document.querySelector(".list");
var clearAllBtn = document.querySelector(".clear-all-btn");
var data = JSON.parse(localStorage.getItem('BMI Record')) || [];
var level = ''; //== 畫面：產生列表 ==//

function updateData(data) {
  var str = '';

  if (data.length > 0) {
    clearAllBtn.style.display = 'flex';
    data.forEach(function (item) {
      var content = "\n        <li class=\"".concat(item.level, "\" data-id=\"").concat(item.time, "\">\n          <h3>").concat(item.msg, "</h3>\n          <div>\n            <small>BMI</small>\n            <p>").concat(item.bmi, "</p>\n          </div>\n          <div>\n            <small>weight</small>\n            <p>").concat(item.weight, "</p>\n          </div>\n          <div>\n            <small>height</small>\n            <p>").concat(item.height, "</p>\n          </div>\n          <small>").concat(item.date, "</small>\n          <a href=\"#\" class=\"delete-btn\">\n            <i class=\"material-icons-outlined\"> highlight_off </i>\n          </a>\n        </li>");
      str += content;
    });
  } else {
    clearAllBtn.style.display = 'none';
    str += "<li class=\"none\">\u9019\u88E1\u9084\u6C92\u6709\u8CC7\u6599\uFF0C\u5FEB\u4F86\u8A08\u7B97\u4F60\u7684 BMI \u5427\uFF01</li>";
  }

  list.innerHTML = str;
} //== 資料：計算BMI 資料 ==//


function BMIcalc() {
  var weight = inputWeight.value;
  var height = inputHeight.value / 100;
  var bmi = Math.round(weight / Math.pow(height, 2) * 100) / 100;
  BMIstatus(bmi);
  var bmiData = {
    bmi: bmi,
    weight: inputWeight.value,
    height: inputHeight.value,
    date: currentDate().date,
    time: currentDate().time,
    msg: resultMsg.textContent,
    level: level
  };
  inputHeight.value = "";
  inputWeight.value = "";
  data.unshift(bmiData);
  updateLocalStorage(data);
} //== 資料：抓取日期 ==//


function currentDate() {
  var now = new Date();
  var year = now.getFullYear();
  var month = (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1); //十位數＋個位數

  var date = (now.getDate() < 10 ? '0' : '') + now.getDate();
  var time = now.getTime();
  var value = "".concat(year, "-").concat(month, "-").concat(date);
  return {
    date: value,
    time: time
  };
} //== 資料＋畫面：判斷BMI 狀態 + 改按鈕狀態 ==//


function BMIstatus(data) {
  var statusGroup = {
    ideal: {
      msg: '標準',
      level: 'ideal',
      color: 'result-ideal'
    },
    thin: {
      msg: '過輕',
      level: 'thin',
      color: 'result-thin'
    },
    heavy: {
      msg: '過重',
      level: 'heavy',
      color: 'result-heavy'
    },
    slightlyObese: {
      msg: '輕度肥胖',
      level: 'slightlyObese',
      color: 'result-slightlyObese'
    },
    mediumObese: {
      msg: '中度肥胖',
      level: 'mediumObese',
      color: 'result-mediumObese'
    },
    severeObese: {
      msg: '重度肥胖',
      level: 'severeObese',
      color: 'result-severeObese'
    }
  };

  var filterStatus = function filterStatus(value) {
    var color = changeBtn(statusGroup[value]);
    resultNum.textContent = data;
    resultMsg.textContent = statusGroup[value].msg;
    level = statusGroup[value].level;
    var msg = statusGroup[value].msg;
    return {
      color: color,
      level: level,
      msg: msg
    };
  };

  if (data <= 18.5) {
    filterStatus("thin");
  } else if (data <= 25) {
    filterStatus("ideal");
  } else if (data <= 30) {
    filterStatus("heavy");
  } else if (data <= 35) {
    filterStatus("slightlyObese");
  } else if (data <= 40) {
    filterStatus("mediumObese");
  } else {
    filterStatus("severeObese");
  }
} //== 畫面：按鈕轉換顏色 ==//


function changeBtn(input) {
  var color = input.color;
  resultBtn.style.display = 'none';
  showResult.style.display = 'block';
  showResult.classList.add(color);
  return color;
} //== 互動＋畫面：點擊按鈕新增狀態＋產生畫面 ==//


function newStatus() {
  if (inputVerify() === "true") {
    return;
  }

  ;
  BMIcalc();
  updateData(data);
} //== 互動＋畫面：表單驗證 ==//


function inputVerify() {
  if (inputHeight.value.trim() == "" || inputWeight.value.trim() == "") {
    var alertMsg;

    if (inputHeight.value.trim() == "") {
      verifyHeight.textContent = "*請記得輸入身高 XXX cm 呦～";
      verifyHeight.classList.add("visible");
      inputHeight.classList.add("warning");
      alertMsg = "true";
    }

    ;

    if (inputWeight.value.trim() == "") {
      verifyWeight.textContent = "*請在此處輸入體重 XX kg 呦～";
      verifyWeight.classList.add("visible");
      inputWeight.classList.add("warning");
      alertMsg = "true";
    }

    ;
    return alertMsg; //無法中斷函式QQ 還是會輸入 空值到data 中
  }

  ;
  verifyHeight.classList.remove("visible");
  verifyWeight.classList.remove("visible");
  inputHeight.classList.remove("warning");
  inputWeight.classList.remove("warning");
} //== 互動＋畫面：清空表單、按鈕 or 繼續計算 ==//


function resetAll() {
  if (inputVerify() === "true") {
    resultBtn.style.display = 'block';
    showResult.style.display = 'none';
    showResult.setAttribute("class", "");
  } else {
    newStatus();
  }

  ;
} //== 資料：更新localStorage ==//


function updateLocalStorage(data) {
  localStorage.setItem('BMI Record', JSON.stringify(data));
} //== ALL：單一刪除按紐 ==//


function deleteBtn(e) {
  if (!e.target.classList.contains("material-icons-outlined")) {
    return;
  }

  ;
  e.preventDefault();
  var id = parseInt(e.target.closest("LI").dataset.id);
  var deleteData = data.findIndex(function (item) {
    return item.time === id;
  });
  data.splice(deleteData, 1);
  updateLocalStorage(data);
  updateData(data);
} //== ALL：全部刪除按鈕 ==//


function deleteAllData(e) {
  e.preventDefault();

  if (e.target.closest(".clear-all-btn").nodeName !== "BUTTON") {
    return;
  }

  var total = data.length;
  data.splice(0, total);
  updateLocalStorage(data);
  updateData(data);
  resetAll();
} // keyup 監聽//


function inputByKey(e) {
  if (e.key === "Enter") {
    if (resultBtn.style.display === "block") {
      newStatus();
    } else {
      resetAll();
    }

    ;
  } else {
    return;
  }

  ;
} //預設階段//


function init() {
  updateData(data);
  inputHeight.addEventListener('keyup', inputByKey, false);
  inputWeight.addEventListener('keyup', inputByKey, false);
  resultBtn.addEventListener('click', newStatus, false);
  resetBtn.addEventListener('click', resetAll, false);
  list.addEventListener('click', deleteBtn, false);
  clearAllBtn.addEventListener('click', deleteAllData, false);
}

init();
//# sourceMappingURL=all.js.map
