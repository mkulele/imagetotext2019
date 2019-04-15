function runOCR_kr(url) {
    Tesseract.recognize(url,{
        lang: 'kor'
    })
        .then(function(result) {
            document.getElementById("tesseract_result")
                .value = result.text;
        }).progress(function(result) {
        document.getElementById("tesseract_progress")
            .value = result["status"] + " (" +
            (result["progress"] * 100) + "%)";
    });
}

function runOCR_en(url) {
    Tesseract.recognize(url)
        .then(function(result) {
            document.getElementById("tesseract_result")
                .value = result.text;
        }).progress(function(result) {
        document.getElementById("tesseract_progress")
            .value = result["status"] + " (" +
            (result["progress"] * 100) + "%)";
    });
}

function runOCR_fr(url) {
    Tesseract.recognize(url,{
        lang: 'fra'
    })
        .then(function(result) {
            document.getElementById("tesseract_result")
                .value = result.text;
        }).progress(function(result) {
        document.getElementById("tesseract_progress")
            .value = result["status"] + " (" +
            (result["progress"] * 100) + "%)";
    });
}

document.getElementById("tesseract_button")
    .addEventListener("click", function(e) {
        var url = document.getElementById("tesseract_url").value;
        document.getElementById("tesseract_img")
            .src = url;
        var select = document.getElementById("tesseract_select").value;
        if(select==="kor")  runOCR_kr(url);
        else if(select==="eng")  runOCR_en(url);
        else if(select==="fra") runOCR_fr(url);
    });

