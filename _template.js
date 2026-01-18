var nslides = {nslides}
var cSlide = 0

var nload = nslides;
var loading = false;

function load_slide() {
    if (nload < nslides && !document.readyState == "complete") {
        return;
    }
    if (nload < nslides) {
        document.getElementById("slide" + nload).style.display = "none";
    }
    nload--;
    document.getElementById("slide" + nload).style.display = "block";
    if (nload == 0) {
        clearInterval(loading);
        document.getElementById("interact").style.display = "block";
        return;
    }
}

loading = setInterval(load_slide);

document.addEventListener('keydown', function(event){
    const currentCode = event.which || event.code;
    var currentKey = event.key;
    if (!currentKey) {
        currentKey = String.fromCharCode(currentCode);
    }
    const keyName = "" + currentKey
    process_key(keyName)
});

function process_key(keyName){
    if((keyName == "ArrowRight" || keyName == "PageDown") && cSlide + 1 < nslides){
        if(exit_fs[cSlide] !== false){
            exit_fs[cSlide]()
        }
        if (transitions[cSlide] == "scarlet") {
            start_scarlet_transition();
            return;
        }
        document.getElementById("slide"+cSlide).style.display = "none"
        cSlide++
        document.getElementById("slide"+cSlide).style.display = "block"
        if(enter_fs[cSlide] !== false){
            enter_fs[cSlide]()
        }
    }
    if((keyName == "ArrowLeft" || keyName == "PageUp") && cSlide > 0){
        if(exit_fs[cSlide] !== false){
            exit_fs[cSlide]()
        }
        document.getElementById("slide"+cSlide).style.display = "none"
        cSlide--
        document.getElementById("slide"+cSlide).style.display = "block"
        if(enter_fs[cSlide] !== false){
            enter_fs[cSlide]()
        }
    }
}

var scarlet = false;

function scarlet_transition() {
    var times = [0.27, 0.68, 1.08, 1.30, 1.52, 1.75]
    if (scarlet[0].currentTime >= times[scarlet[1]] - 0.03) {
        document.getElementById("slide"+cSlide).style.display = "none";
        if (scarlet[1] % 2 == 0) {
            cSlide--;
        } else {
            cSlide++;
        }
        document.getElementById("slide"+cSlide).style.display = "block";
        scarlet[1]++;
    }
    if (scarlet[0].currentTime >= 1.8) {
        if(enter_fs[cSlide] !== false){
            enter_fs[cSlide]()
        }
        clearInterval(scarlet[2])
        scarlet = false
    }
}

function start_scarlet_transition() {
    if (scarlet !== false) {
        scarlet[2].clearInterval();
    }
    // Play sound
    scarlet = [new Audio('_static/transition.mp3'), 0, setInterval(scarlet_transition)];
    scarlet[0].play();
    document.getElementById("slide"+cSlide).style.display = "none";
    cSlide++;
    document.getElementById("slide"+cSlide).style.display = "block";
}
