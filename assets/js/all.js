"use strict";

var inputHeight = document.querySelector("#height-input");
var inputWeight = document.querySelector("#weight-input");
var verifyInfo = document.querySelector(".verify");
var resultBtn = document.querySelector(".see-result button");
var circle = document.querySelector("#circle");
var content = document.querySelector(".header-content");
var list = document.querySelector(".list");
var resetBtn = document.querySelector(".reset-btn");
var clearAllBtn = document.querySelector(".clear-all-btn");
var data = JSON.parse(localStorage.getItem('BMI calculate')) || [];
var result = {};
resultBtn.addEventListener('click', BMIcalc, false);

function inputVerify(e) {
  if (inputHeight.value.trim() == "" || inputWeight.value.trim() == "") {
    inputHeight.classList.add("warning");
    heightVeri.textContent = '*此欄位不得為空白';
    heightVeri.classList.add("visible");
  }

  ;
} // 計算BMI 資料 //


function BMIcalc(e) {
  e.preventDefault();
  inputVerify(e);
  var weightNum = parseInt(inputWeight.value);
  var heightNum = parseInt(inputHeight.value);
  var bmi = weightNum / (heightNum / 100 * heightNum / 100);
  var bmiNum = bmi.toFixed(2);
  var dateItem = {
    month: new Date().getMonth(),
    day: new Date().getDate(),
    year: new Date().getFullYear()
  };
  var date = "".concat(dateItem.month + 1, "-").concat(dateItem.day, "-").concat(dateItem.year);
  result.weight = weightNum;
  result.height = heightNum;
  result.bmi = bmiNum;
  result.date = date;
  data.unshift(result);

  if (bmiNum <= 16 && bmiNum > 0) {
    result.name = "過輕";
    result.className = "underWeighted";
  } else if (bmiNum < 25 && bmiNum > 16) {
    result.name = "理想";
    result.className = "ideal";
  } else if (bmiNum < 30 && bmiNum >= 25) {
    result.name = "過重";
    result.className = "overWeighted";
  } else if (bmiNum < 35 && bmiNum >= 30) {
    result.name = "輕度肥胖";
    result.className = "slightlyObese";
  } else if (bmiNum < 40 && bmiNum >= 35) {
    result.name = "中度肥胖";
    result.className = "mediumObese";
  } else if (bmiNum >= 40) {
    result.name = "重度肥胖";
    result.className = "severeObese";
  }

  ;
  showResult();
  addToLocalStorage(data);
  renderData(data); //清空input，還原按鈕設定

  var resetBtn = document.querySelector(".clear-btn");
  resetBtn.addEventListener('click', clearAll, false);
} //圓形按鈕變換樣式


function showResult() {
  var createH3 = document.createElement("h3");
  createH3.textContent = result.name;
  createH3.classList.add('color');
  circle.classList.remove("see-result");
  circle.classList.add("run-result");

  if (result.name === "過輕") {
    circle.classList.add("result-underWeighted");
    createH3.classList.add('color-underWeighted');
  } else if (result.name === "理想") {
    circle.classList.add("result-ideal");
    createH3.classList.add('color-ideal');
  } else if (result.name === "過重") {
    circle.classList.add("result-overWeighted");
    createH3.classList.add('color-overWeighted');
  } else if (result.name === "輕度肥胖") {
    circle.classList.add("result-slightlyObese");
    createH3.classList.add('color-slightlyObese');
  } else if (result.name === "中度肥胖") {
    circle.classList.add("result-mediumObese");
    createH3.classList.add('color-mediumObese');
  } else if (result.name === "重度肥胖") {
    circle.classList.add("result-severeObese");
    createH3.classList.add('color-severeObese');
  }

  ;
  circle.innerHTML = "\n        <p>".concat(result.bmi, "</p>\n        <small>BMI</small>\n        <a href=\"#\" class=\"clear-btn\">\n          <i class=\"fas fa-sync-alt\"></i>  \n        </a>");
  content.appendChild(createH3);
} //data 渲染到畫面上


function renderData(data) {
  var str = '';

  if (data.length == 0) {
    var _content = "<li class=\"none\">\u9019\u88E1\u9084\u6C92\u6709\u8CC7\u6599\uFF0C\u5FEB\u4F86\u8A08\u7B97\u4F60\u7684 BMI \u5427\uFF01\n</li>";
    str += _content;
    list.innerHTML = str;
  }

  ;
  data.forEach(function (item) {
    var content = "<li class=\"".concat(item.className, "\">\n        <h3>").concat(item.name, "</h3>\n         <div><small>BMI</small><p data-type=\"bmiNum\">").concat(item.bmi, "</p></div>\n          <div><small>weight</small><p data-type=\"weightNum\">").concat(item.weight, "kg</p></div>\n          <div><small>height</small><p data-type=\"heightNum\">").concat(item.height, "cm</p></div>\n        <small>").concat(item.date, "</small>\n        \n      </li>");
    str += content;
  });
  console.log(str);
  list.innerHTML = str;
} //localStorage


function addToLocalStorage(data) {
  localStorage.setItem('BMI calculate', JSON.stringify(data));
} //預設渲染畫面


renderData(data); //清除時會同時經監聽移除，改變記憶體位置，導致無法點擊的情況發生，需要重新綁定～

function clearAll(e) {
  e.preventDefault(); //清空input

  if (inputHeight.value.trim() !== "" || inputWeight.value.trim() !== "") {
    inputHeight.value = "";
    inputWeight.value = "";
  }

  ; //還原看結果按鈕

  circle.setAttribute("class", "see-result"); //直接清空全部-> 會監聽不到按鈕

  circle.innerHTML = "<button>\u770B\u7D50\u679C</button>";
  var resultBtnTest = document.querySelector(".see-result button");
  resultBtnTest.addEventListener('click', BMIcalc, false);
  var colorH3 = document.querySelector(".color");
  colorH3.parentNode.removeChild(colorH3);
}
//# sourceMappingURL=all.js.map
