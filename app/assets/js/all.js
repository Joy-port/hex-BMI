const inputHeight = document.querySelector(".height-group input");
const inputWeight = document.querySelector(".weight-group input");
const verifyHeight = document.querySelector(".height-group p"); //input verify info
const verifyWeight = document.querySelector(".weight-group p"); //input verify info

const resultBtn = document.querySelector(".see-result");
const showResult = document.querySelector("#show-result");
const resultNum = document.querySelector(".result-num");
const resultMsg = document.querySelector(".result-msg");
const resetBtn = document.querySelector(".reset-btn");
const list = document.querySelector(".list");
const clearAllBtn = document.querySelector(".clear-all-btn");

let data = JSON.parse(localStorage.getItem('BMI Record')) || [] ;
let level ='';

//== 畫面：產生列表 ==//
function updateData(data){
  let str ='';

  if(data.length > 0){
    clearAllBtn.style.display = 'flex';
    data.forEach(item => {
      const content = `
        <li class="${item.level}" data-id="${item.time}">
          <h3>${item.msg}</h3>
          <div>
            <small>BMI</small>
            <p>${item.bmi}</p>
          </div>
          <div>
            <small>weight</small>
            <p>${item.weight}</p>
          </div>
          <div>
            <small>height</small>
            <p>${item.height}</p>
          </div>
          <small>${item.date}</small>
          <a href="#" class="delete-btn">
            <i class="material-icons-outlined"> highlight_off </i>
          </a>
        </li>`;
  
        str += content ;
    });  

  }else{
    clearAllBtn.style.display = 'none';
    str += `<li class="none">這裡還沒有資料，快來計算你的 BMI 吧！</li>`;
  }

  list.innerHTML = str ;

}

//== 資料：計算BMI 資料 ==//
function BMIcalc(){
  const weight = inputWeight.value ; 
  const height = inputHeight.value / 100;

  const bmi = Math.round((weight / Math.pow(height, 2)) * 100) / 100 ;

  BMIstatus(bmi);

  let bmiData = {
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

}

//== 資料：抓取日期 ==//
function currentDate(){
  const now = new Date() ;
  const year = now.getFullYear() ;
  const month = (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1) ;  //十位數＋個位數
  const date = (now.getDate() < 10 ? '0' : '') + now.getDate() ;
  const time = now.getTime();
  let value = `${year}-${month}-${date}`;
  return {
    date: value,
    time: time
  }

}

//== 資料＋畫面：判斷BMI 狀態 + 改按鈕狀態 ==//
function BMIstatus(data){
  const statusGroup = {
    ideal: {
      msg:'標準',
      level:'ideal',
      color: 'result-ideal',
    },
    thin: {
      msg:'過輕',
      level:'thin',
      color: 'result-thin',
    },
    heavy: {
      msg:'過重',
      level:'heavy',
      color: 'result-heavy',
    },
    slightlyObese: {
      msg:'輕度肥胖',
      level:'slightlyObese',
      color: 'result-slightlyObese',
    },
    mediumObese: {
      msg:'中度肥胖',
      level:'mediumObese',
      color: 'result-mediumObese',
    },
    severeObese: {
      msg:'重度肥胖',
      level:'severeObese',
      color: 'result-severeObese'
    }
  };

  const filterStatus = function (value){
    let color = changeBtn(statusGroup[value]);
    resultNum.textContent = data; 
    resultMsg.textContent = statusGroup[value].msg;
    level = statusGroup[value].level;
    let msg = statusGroup[value].msg;
    return {
      color,
      level,
      msg
    }
  };
 
  if (data <= 18.5) {
    filterStatus("thin");
  } else if (data <= 25) {
    filterStatus("ideal")
  } else if (data <= 30) {
    filterStatus("heavy");
  } else if (data <= 35) {
    filterStatus("slightlyObese");
  } else if (data <= 40) {
    filterStatus("mediumObese");
  } else {
    filterStatus("severeObese");
  }

}
//== 畫面：按鈕轉換顏色 ==//
function changeBtn(input){

  let color = input.color ;
  resultBtn.style.display = 'none';
  showResult.style.display = 'block';
  showResult.classList.add(color);
  
  return color;
}

//== 互動＋畫面：點擊按鈕新增狀態＋產生畫面 ==//
function newStatus(){
  
  if(inputVerify()=== "true"){
    return ;
  };

  BMIcalc();
  updateData(data);

}

//== 互動＋畫面：表單驗證 ==//
function inputVerify(){
if(inputHeight.value.trim() == "" || inputWeight.value.trim() == ""){  
  let alertMsg ;

  if(inputHeight.value.trim() == ""){
    verifyHeight.textContent = "*請在此輸入身高 XXX cm";
    verifyHeight.classList.add("visible");
    inputHeight.classList.add("warning");
    alertMsg ="true";
    };
  if(inputWeight.value.trim() == "" ){
    verifyWeight.textContent = "*請在此處輸入體重 XX kg";
    verifyWeight.classList.add("visible");
    inputWeight.classList.add("warning");
    alertMsg ="true";
  } ;

  return alertMsg ; //無法中斷函式QQ 還是會輸入 空值到data 中
  };

  verifyHeight.classList.remove("visible");
  verifyWeight.classList.remove("visible");
  inputHeight.classList.remove("warning");
  inputWeight.classList.remove("warning");
}

//== 互動＋畫面：清空表單、按鈕 or 繼續計算 ==//
function resetAll(){
  if(inputVerify()=== "true"){
    resultBtn.style.display = 'block';
    showResult.style.display = 'none';
    showResult.setAttribute("class","");
  }else{
    newStatus();
  };
}

//== 資料：更新localStorage ==//
function updateLocalStorage(data){
  localStorage.setItem('BMI Record', JSON.stringify(data));
}


//== ALL：單一刪除按紐 ==//
function deleteBtn(e){
  if(!e.target.classList.contains("material-icons-outlined")){
    return ;
  };
  e.preventDefault();
  const id = parseInt(e.target.closest("LI").dataset.id);
  
  let deleteData = data.findIndex(item => item.time === id);

  data.splice(deleteData,1);

  updateLocalStorage(data);
  updateData(data);

}

//== ALL：全部刪除按鈕 ==//
function deleteAllData(e){
  e.preventDefault();  
  if(e.target.closest(".clear-all-btn").nodeName !== "BUTTON"){
    return ;
  }
  const total = data.length;
  data.splice(0, total);

  updateLocalStorage(data);
  updateData(data);
  resetAll();

}

// keyup 監聽//
function inputByKey (e){
  if(e.key === "Enter"){
    if(resultBtn.style.display === "block"){
      newStatus();
    }else{
      resetAll();
    };
    
  }else{
    return ;
  };
}

//預設階段//
function init(){
  updateData(data);

  inputHeight.addEventListener('keyup', inputByKey, false);
  inputWeight.addEventListener('keyup', inputByKey, false);

  resultBtn.addEventListener('click', newStatus, false);
  resetBtn.addEventListener('click', resetAll, false);
  list.addEventListener('click', deleteBtn, false);
  clearAllBtn.addEventListener('click', deleteAllData, false);
}

init();