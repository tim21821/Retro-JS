function make_comment() {
    var name = document.getElementById("name").value;
    var comment = document.getElementById("comment").value;
    console.log('Funktion "make_comment" ausgeführt');
    console.log(name);
    console.log(comment);

    output = "${name} schrieb: ${comment}.";
    console.log(output)

    document.getElementById("comment_out").innerHTML += output;
}