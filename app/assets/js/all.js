const inputHeight = document.querySelector("#height-input");
const inputWeight = document.querySelector("#weight-input");
const verifyInfo = document.querySelector(".verify");

const resultBtn = document.querySelector(".see-result button");
const circle = document.querySelector("#circle");
const content = document.querySelector(".header-content");

const list = document.querySelector(".list");
const resetBtn = document.querySelector(".reset-btn");
const clearAllBtn = document.querySelector(".clear-all-btn");


let data = JSON.parse(localStorage.getItem('BMI calculate')) || [] ;
let result = {};

resultBtn.addEventListener('click', BMIcalc, false);


function inputVerify(e){
  if(inputHeight.value.trim() == "" || inputWeight.value.trim() == ""){
    inputHeight.classList.add("warning");
    heightVeri.textContent = '*此欄位不得為空白';
    heightVeri.classList.add("visible");
  };

}



// 計算BMI 資料 //





function BMIcalc (e){
  e.preventDefault();
  inputVerify(e);
  
  const weightNum = parseInt(inputWeight.value);
  const heightNum = parseInt(inputHeight.value);
  const bmi = weightNum /(heightNum/100*heightNum/100);
  let bmiNum = bmi.toFixed(2);
  let dateItem = {
    month: new Date().getMonth(),
    day: new Date().getDate(),
    year: new Date().getFullYear()
  };
  
  let date = `${dateItem.month + 1}-${dateItem.day
}-${dateItem.year}`;
 
  result.weight = weightNum;
  result.height = heightNum;
  result.bmi = bmiNum;
  result.date = date;
  data.unshift(result);
  
  
  if(bmiNum <= 16 && bmiNum > 0 ){ 
    result.name ="過輕";
    result.className = "underWeighted";
  }else if(bmiNum < 25 && bmiNum > 16 ){
    result.name ="理想";
    result.className ="ideal";
  }else if(bmiNum < 30 && bmiNum >= 25 ){
    result.name ="過重";
    result.className = "overWeighted";
  }else if(bmiNum < 35 && bmiNum >= 30 ){ 
    result.name ="輕度肥胖";
    result.className = "slightlyObese";
  }else if(bmiNum < 40 && bmiNum >= 35 ){
    result.name ="中度肥胖";
   result.className ="mediumObese";
  }else if(bmiNum >= 40 ){
    result.name ="重度肥胖";
    result.className = "severeObese";
    };
  
  showResult();
  
  addToLocalStorage(data);
  renderData(data);
  
  //清空input，還原按鈕設定
  const resetBtn = document.querySelector(".clear-btn");
  resetBtn.addEventListener('click', clearAll, false);
  
 
}

//圓形按鈕變換樣式
function showResult(){
   
  let createH3 = document.createElement("h3");
  createH3.textContent = result.name;
  createH3.classList.add('color');
 
  circle.classList.remove("see-result");
  circle.classList.add("run-result");

  if(result.name ==="過輕"){
    circle.classList.add("result-underWeighted");
    createH3.classList.add('color-underWeighted');
  }else if(result.name ==="理想"){
    circle.classList.add("result-ideal");
    createH3.classList.add('color-ideal');
  }else if(result.name ==="過重"){
    circle.classList.add("result-overWeighted");
    createH3.classList.add('color-overWeighted');
  }else if(result.name ==="輕度肥胖"){
    circle.classList.add("result-slightlyObese");
    createH3.classList.add('color-slightlyObese');
    
  }else if(result.name ==="中度肥胖"){
    circle.classList.add("result-mediumObese");
    createH3.classList.add('color-mediumObese');
  }else if(result.name ==="重度肥胖"){
    circle.classList.add("result-severeObese");
    createH3.classList.add('color-severeObese');
  };
 
 circle.innerHTML = `
        <p>${result.bmi}</p>
        <small>BMI</small>
        <a href="#" class="clear-btn">
          <i class="fas fa-sync-alt"></i>  
        </a>`;
  content.appendChild(createH3);

}

//data 渲染到畫面上

function renderData(data){
  let str = '';
  if (data.length == 0){
    let content = `<li class="none">這裡還沒有資料，快來計算你的 BMI 吧！
</li>`;
    str += content;
    list.innerHTML =str;
  };
  data.forEach(function(item){
    let content = `<li class="${item.className}">
        <h3>${item.name}</h3>
         <div><small>BMI</small><p data-type="bmiNum">${item.bmi}</p></div>
          <div><small>weight</small><p data-type="weightNum">${item.weight}kg</p></div>
          <div><small>height</small><p data-type="heightNum">${item.height}cm</p></div>
        <small>${item.date}</small>
        
      </li>`;
    str += content;
  });
  
  console.log(str);
  list.innerHTML = str;
  
  
}

//localStorage
function addToLocalStorage(data){
  localStorage.setItem('BMI calculate', JSON.stringify(data));
}


//預設渲染畫面
renderData(data);

//清除時會同時經監聽移除，改變記憶體位置，導致無法點擊的情況發生，需要重新綁定～
function clearAll(e){
  e.preventDefault();
  //清空input
  if(inputHeight.value.trim() !== "" || inputWeight.value.trim() !== ""){
    inputHeight.value ="";
    inputWeight.value ="";
  };
  

  //還原看結果按鈕
  circle.setAttribute("class", "see-result"); //直接清空全部-> 會監聽不到按鈕
  circle.innerHTML = `<button>看結果</button>`;
  
  const resultBtnTest = document.querySelector(".see-result button");
  resultBtnTest.addEventListener('click', BMIcalc, false);
  
  const colorH3 = document.querySelector(".color");
  colorH3.parentNode.removeChild(colorH3);
  
}

