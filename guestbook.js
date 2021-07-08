function make_comment() {
    var name = document.getElementById("name").value;
    var comment = document.getElementById("comment").value;
    if (name == "") {
        alert("Kein Name angegeben!");
    }
    else if (comment == "") {
        alert("Kein Kommentar angegeben!");
    }
    else {
        output = construct_output(comment, name);
        document.getElementById("comment_block").innerHTML += output;
    }
}

function construct_output(comment, name) {
    const DATE = new Date();
    const ANSWER_FIELD = '<div class="answer_field" id="answer_field' + DATE.getTime() + '">' + '<label for "name' + DATE.getTime() + '">Dein Name: </label><input type="text" id="name' + DATE.getTime() + '" class="answer_name"><br><label for "answer' + DATE.getTime() + '">Deine Antwort:</label><br><textarea name="answer' + DATE.getTime() + '" id="answer' + DATE.getTime() + '" class="answer_text" cols="70" rows="5" placeholder = "Hier kommt die Antwort hin ..." required></textarea><br><button onclick = "make_answer(this)" class="send_answer_button" id="answer' + DATE.getTime() + '"><span>Absenden</span></button></div>';
    var comment_output = name + " schrieb am " + DATE.getDate() + "." + DATE.getMonth() + "." + DATE.getFullYear() + " (" + DATE.getHours() + ":" + DATE.getMinutes() + " Uhr): " + comment;
    var output = '<div class="comment" id="' + name + DATE.getTime() + '">' + comment_output + "<br>" + '<button class="answer_button" onclick="display_answer_block(this)"><span>Antworten</span></button>' + ANSWER_FIELD + '</div>';
    return output;
}

function make_answer(element) {
    const DATE = new Date();
    var name = element.parentNode.getElementsByClassName("answer_name")[0].value;
    var comment = element.parentNode.getElementsByClassName("answer_text")[0].value;
    if (name == "") {
        alert("Kein Name angegeben!");
    } else if (comment == "") {
        alert("Keine Antwort angegeben!")
    } else {
        var answer_output = '<div class="answer_block">' + name + " schrieb am " + DATE.getDate() + "." + DATE.getMonth() + "." + DATE.getFullYear() + " (" + DATE.getHours() + ":" + DATE.getMinutes() + " Uhr): " + comment + '</div>';
        element.parentNode.parentNode.innerHTML += answer_output;
    }
}

function display_answer_block(element) {
    if (element.parentNode.getElementsByClassName("answer_field")[0].style.display == "none") {
        element.parentNode.getElementsByClassName("answer_field")[0].style.display = "block";
    } else {
        element.parentNode.getElementsByClassName("answer_field")[0].style.display = "none";
    }
}