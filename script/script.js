"use strict";

let do_all_button = document.getElementById("do_all_check");
let input_line = document.querySelector("input.input_line");
let tasks = document.querySelector("lu.tasks");
let tasks_list = [];
let active_tasks = [];
let complited_tasks = [];
let tasks_count = 0;

let showing = false;

input_line.addEventListener("keypress", (event)=> {
    if ((event.keyCode == 13) && (document.activeElement == input_line)){
        add_task();
    }
})
input_line.onblur = add_task;

document.querySelector("html").addEventListener("click", check_touch_target);

do_all_button.addEventListener("click", ()=>{
    this.checked = !this.checked;

    if (this.checked){
        for (let task of tasks.querySelectorAll("li.task"))
            if (!task.getElementsByTagName("input")[0].checked) 
                task.getElementsByTagName("input")[0].click();
    } else {
        for (let task of tasks.querySelectorAll("li.task"))
            if (task.getElementsByTagName("input")[0].checked) 
                task.getElementsByTagName("input")[0].click();
    }
})

function add_task(){
    if (!input_line.value)
        return;
    tasks_count++;
    tasks.insertAdjacentHTML("afterbegin", generate_block(input_line.value));

    let new_task = document.querySelector("li.task");
    new_task.getElementsByClassName("delete")[0].onclick = delete_click;
    new_task.getElementsByTagName("input")[0].onclick = toggle_compliting_task;
    new_task.querySelector("label").addEventListener("dblclick", change_text);
    tasks_list.splice(0, 0, new_task);
    active_tasks.splice(0, 0, new_task);

    input_line.value="";
        
    if (!showing && tasks_list.length != 0) toggle_showed_blocks();
    do_all_button.checked = false;
    update_count();

}

function change_text(event) {
    let task = event.target.closest("div.view");
    let task_content = task.querySelectorAll('*');
    task.innerHTML = "";
    
    task.insertAdjacentHTML("afterbegin", '<input class="task_editor" type="text" focus="true">');
    let input = task.querySelector('input');
    input.value = task_content[1].textContent;
    input.focus();
    input.addEventListener("keypress", (event) => {
        if (event.keyCode == "13")
            backup(task, task_content, input.value);
    })
    input.addEventListener("blur", (event) => {
        backup(task, task_content, input.value);
    })
    console.log(input);
}

function backup(target, content, new_content){
    target.innerHTML = "";
    content[1].textContent = new_content;
    for (let e of content)
        target.appendChild(e);
}


function update_count(){
    if (active_tasks.length != 1)
        document.querySelector("span").innerHTML = "<strong>"+active_tasks.length+"</strong> items left";
    else
        document.querySelector("span").innerHTML = "<strong>1</strong> item left";

    if (active_tasks.length == 0 && tasks_list.length > 0)
        do_all_button.checked = true;
    else
        do_all_button.checked = false;
}

function toggle_compliting_task(event){
    let toggler = event.target;
    toggler.classList.toggle("active");
    toggler.nextSibling.classList.toggle("complited");

    let task = toggler.closest("li");
    /* classList.remove() не удаляет класс. Вернее сам classList не видит класс */

    if (active_tasks.indexOf(task)+1){
        active_tasks.splice(active_tasks.indexOf(task), 1)
        complited_tasks.splice(0, 0, task);
        complited_tasks = complited_tasks.sort((a, b) => b.getAttribute("data-id") - a.getAttribute("data-id"));
    } else {
        complited_tasks.splice(complited_tasks.indexOf(task), 1)
        active_tasks.splice(0, 0, task);
        active_tasks = active_tasks.sort((a, b) => b.getAttribute("data-id") - a.getAttribute("data-id"));
    }

    if (complited_tasks.length > 0) document.querySelector("span.clear").style.display = "block";
    else document.querySelector("span.clear").style.display = "none";

    update_count();
}

function toggle_showed_blocks(){
    showing = !showing;
    if (showing){
        document.querySelector("div.checkbox_container").style.display = "block";
        input_line.style.paddingLeft = "2px";
        document.querySelector("div.content_container_footer").style.display = "flex"
    } else {
        document.querySelector("div.checkbox_container").style.display = "none";
        input_line.style.paddingLeft = "52px";
        document.querySelector("div.content_container_footer").style.display = "none"
    }
}

function generate_block(value){
    let result = "";
    result+='<li class="task" data-id="'+tasks_count+'">';
    result+='<div class="view"><input type="checkbox" class="custom_task_checkbox color_touch">';
    result+='<label class="task">'+value+'</label>'
    result+='<button class="delete"></button>'
    result+='</div></li>'
    return result;
}

function check_touch_target (event){
    let target = event.target;
    if (target.classList.contains("color_touch")){
        if (document.querySelector("div.colored"))
            document.querySelector("div.colored").classList.remove("colored");
        target.closest("div").classList.add("colored");
    }else{
        if (document.querySelector("div.colored"))
            document.querySelector("div.colored").classList.remove("colored");
    } 
}

function delete_click (event){
    let task = event.target.closest("li.task");
    tasks_list.splice(tasks_list.indexOf(task), 1);

    if (active_tasks.indexOf(task)+1)
    {
        active_tasks.splice(active_tasks.indexOf(task), 1);
        update_count();
    }
    else
        complited_tasks.splice(complited_tasks.indexOf(task), 1);

    task.remove();

    if (showing && tasks_list == 0) toggle_showed_blocks();
}

function showAll(button){
    if (button.classList.contains('active'))
        return;

    tasks.innerHTML = "";
    for (let e of tasks_list)
        tasks.appendChild(e);

    let filters = button.closest("lu");
    for (let filter of filters.getElementsByTagName("li"))
        filter.firstChild.classList.remove("active");
    button.classList.add("active");
}

function showActive(button){
    if (button.classList.contains('active'))
        return;

    tasks.innerHTML = "";
    for (let e of active_tasks)
        tasks.appendChild(e);

    let filters = button.closest("lu");
    for (let filter of filters.getElementsByTagName("li"))
        filter.firstChild.classList.remove("active");
    button.classList.add("active");
}

function showComplited(button){
    if (button.classList.contains('active'))
        return;

    tasks.innerHTML = "";
    for (let e of complited_tasks)
        tasks.appendChild(e);

    let filters = button.closest("lu");
    for (let filter of filters.getElementsByTagName("li"))
        filter.firstChild.classList.remove("active");
    button.classList.add("active");
}

function clearComplited(){
    document.querySelector("span.clear").style.display = "none";

    for (let task of complited_tasks){
        tasks_list.splice(tasks_list.indexOf(task), 1);
        task.remove()
    }

    complited_tasks = [];
    
    if (tasks_list.length == 0) toggle_showed_blocks();
}

