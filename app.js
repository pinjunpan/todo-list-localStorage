/*1.把每次動作addItem checkItem deleteItem存入localStorage*/
/*2.頁面開啟時，從localStorage讀取資料，寫入DOM，呈現畫面*/

/*persistence保存*/
let listState = []; /*保存整個list*/

const STATE_KEY = "todo-list";

/*讀取localStorage的資料*/
function loadState() {
  const listState = localStorage.getItem(STATE_KEY); /*字串*/

  /*把字串轉成物件*/
  if (listState !== null) {
    return JSON.parse(listState);
  }
  return [];
}

/*儲存list：把Array轉字串，並存到localStorage*/
function saveState(list) {
  localStorage.setItem(STATE_KEY, JSON.stringify(list));
}

/*顯示list到畫面*/
function initList() {
  /*load list*/
  listState = loadState(); /*把存在localStorage的狀態讀出來*/

  /*render list*/
  const ul = document.getElementById("list");

  for (const item of listState) {
    /*把items寫入html*/
    const li = document.createElement("li");
    li.innerText = item.text;

    const deleteButton = document.createElement("span");
    deleteButton.classList.add("delete");
    deleteButton.onclick = deleteItem;
    li.appendChild(deleteButton);

    li.classList.add("item"); /*才會有CSS效果*/
    if (item.checked) {
      li.classList.add("checked");
    }
    li.onclick = checkItem;

    ul.appendChild(li);
  }
}

/*取得外層的<ul>，插入建立的<li>*/
function addItem() {
  const ul = document.getElementById("list");
  const input = document.getElementById("input");
  const text = input.value; /*輸入的值*/

  if (text === "") {
    alert("請輸入內容");
    return; /*否則function會繼續往下跑*/
  }

  /*設置點擊Add事件*/
  const newItem = document.createElement("li");
  newItem.classList.add("item");
  newItem.innerText = text; /*newItem的值=輸入的值*/

  newItem.onclick = checkItem; /*點擊後打勾*/

  const deleteButton = document.createElement("span");
  deleteButton.classList.add("delete");
  deleteButton.onclick = deleteItem;

  newItem.appendChild(deleteButton);

  listState.push({
    text,
    checked: false
  });
  saveState(listState); /*listState跟localStorage的值同步*/

  input.value = ""; /*輸入的值清空*/
  ul.appendChild(newItem);
}

function checkItem() {
  /*上文設置newItem.onclick = checkItem，this指點擊後的<li>元素*/
  const item = this;
  const parent = item.parentNode;
  /*知道index才能打勾*/
  const idx = Array.from(parent.querySelectorAll(".item")).indexOf(item);
  /*教材使用Array.from(parent.childNodes)：使用Array.from把childNodes(iterable：可以迭代的東西)轉成Array -> 有bug*/
  /*使用indexof找出item的index(索引值)*/

  listState[idx].checked = !listState[idx].checked; /*更新該index的打勾狀態*/

  item.classList.toggle("checked"); /*開關*/
  saveState(listState);
}

function deleteItem(e) {
  const item = this.parentNode; /*this代表X按鈕，parentNode代表li那層*/
  const parent = item.parentNode; /*代表ul那層*/
  const idx = Array.from(parent.querySelectorAll(".item")).indexOf(item);

  listState = listState.filter((_, i) => i !== idx); /*把index以外的留著，過濾掉等於index的*/
  parent.removeChild(item);
  saveState(listState);
  e.stopPropagation(); /*避免上層的onclick也被觸發*/
}

function deleteAllItem(){
  if (confirm("Delete all items?")) {
    listState = []
    saveState(listState)
    document.getElementById("list").innerHTML = ""
  }
}

initList(); /*要在網頁讀取完呼叫initList，才會執行*/

const addButton = document.getElementById("add-button");
addButton.addEventListener("click", addItem); /*點擊觸發function*/

const deleteAllButton = document.getElementById("delete-all")
deleteAllButton.addEventListener("click", deleteAllItem)

/*form預設行為：繳交之後會刷新頁面*/
const form = document.getElementById("input-wrapper");
form.addEventListener("submit", (e) => {
  e.preventDefault(); /*防止刷新*/
});
