$(function() {
    var codeLines = null;
    try { codeLines = JSON.parse(localStorage["code"]); } catch(e) { }
    if (!$.isArray(codeLines)) codeLines = [];

    var isCalculated = false;

    var ul = $("ol");
    var input = $("<input type='text'>");
    var saveAsLink = $("#save-as-link");
    var newLineHTML = "<li><kbd /><code /></li>";
    var activeLine = codeLines.length;

    var sandbox = document.getElementById("sandbox").contentWindow;

    saveAsLink.update = function(codeLines) {
        this.attr("href", "data:," + encodeURIComponent(codeLines.join("\n")));
        this.attr(
                "download",
                (codeLines.length ? codeLines[0].replace(/\//g, ' ') : "code") + ".jscalc"
        );
    };

    var codeIsUpdated = function() {
        sandbox.postMessage(codeLines, "*");
        saveAsLink.update(codeLines);
        localStorage["code"] = JSON.stringify(codeLines);
        isCalculated = true;
    };

    window.addEventListener("message", function(e) {
        if (e.data === "READY") {
            codeIsUpdated();

        } else if ($.isArray(e.data)) {
            var resultLines = e.data;
            ul.empty();
            for (var codeLine = 0; codeLine < codeLines.length; codeLine++) {
                var cl = codeLines[codeLine], rl = resultLines[codeLine];

                var line = $(newLineHTML).appendTo(ul)
                    .find("kbd").text((cl == "") ? "\u00a0" : cl).end()
                    .find("code").text(rl.txt).end()
                    .toggleClass("error", rl.err).toggleClass("system", rl.sys);
                if (cl.substr(0, 2) == "//") line.find("code").hide();
                if (activeLine == codeLine) {
                    line.prepend(input.val(codeLines[codeLine])).addClass("active");
                }
                Prism.highlightElement(line.find("kbd")[0]);
            }
            if (activeLine == codeLines.length) {
                $(newLineHTML).appendTo(ul).prepend(input.val("")).addClass("active");
            }
            input.focus();
            isCalculated = false;
        }
    });

    var setActiveLine = function(n) {
        var value = $.trim(input.val());
        if (n == activeLine
            //false
            || n < 0
            || (activeLine == codeLines.length && value == "" && n > activeLine)
            ) return;
        if (activeLine != codeLines.length || value != "") {
            codeLines[activeLine] = value;
        }
        if (value == "") {
            // удаляем линию кода
            codeLines.splice(activeLine, 1);
            if (n > activeLine) n--;
        }
        activeLine = n;
        codeIsUpdated();
    };

    ul
        // .on("blur", "input", function() { setTimeout(function() { input.focus();}, 0); })
        .on("click", "kbd", function() {
            var n = $(this).parent().prevAll().length;
            setActiveLine(n);
        })
        .on("keydown", "input", function(e) {
            if (isCalculated) return false;
            if (e.keyCode == 13 || e.keyCode == 40) { // enter or ↓
                if (e.shiftKey && activeLine < codeLines.length - 1) {
                    codeLines.splice(activeLine + 1, 0, "");
                }
                setActiveLine(activeLine + 1);
            } else if (e.keyCode == 38) { // ↑
                if (e.shiftKey && activeLine < codeLines.length) {
                    // вставляем пустую строку перед текущей
                    codeLines.splice(activeLine, 0, "");
                    activeLine++;
                }
                setActiveLine(activeLine - 1);
            } else if (e.keyCode == 8) { // Backspace
                if (e.shiftKey) this.value = "";
                if (this.value == "") {
                    setActiveLine(activeLine - 1);
                } else {
                    return true;
                }
            } else if (e.keyCode == 36 && e.ctrlKey) { // Home
                setActiveLine(0);
            } else if (e.keyCode == 35 && e.ctrlKey) { // End
                setActiveLine(codeLines.length);
            } else {
                return true;
            }
            return false;
        });

    $(document).on("keydown", function(e) {
        if (!e.ctrlKey && !e.altKey) input.focus();
    }).on("focus", function() {
        input.focus();
    });


    $("#open-link").click(function() {
        $("#open-input").click();
        return false;
    });

    $(document.body).keydown(function(e) {
        if (e.ctrlKey) {
            if (e.keyCode == 83 /* S */) {
                $("#save-as-link")[0].click();
                return false;
            } else if (e.keyCode == 79 /* O */) {
                $("#open-input").click();
                return false;
            }
        }
    });

    $("#open-input").change(function() {
        if (this.files.length == 0) return;
        var reader = new FileReader();
        reader.onload = function() {
            codeLines = $.trim(this.result).split(/[\r\n]+/);
            activeLine = codeLines.length;
            codeIsUpdated();
        };
        reader.readAsText(this.files[0], "utf-8");
    });

    $("#clear-link").click(function() {
        codeLines = [];
        activeLine = 0;
        codeIsUpdated();
        return false;
    });

    $("#example-link").click(function() {
        codeLines = [
            "// Hello, this is JSCalc — simple javascript calculator",
            "2 + 2 // you can do simple calculations with it…",
            "1 + tan(45 * PI/180) // or not so simple.",
            "// You can find full list of math functions and constatns on this page:",
            "// https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math",
            "// If you know JavaScript, you can use almost any JS expressions:",
            "a = [10, 20] // yes, you can define variables",
            "a[0] + a[1] // and use those in following lines of code",
            "// As you can see, any calculated result may be used in following code lines.",
            "_ + 1 // There is special variable — “_”, which is stores the result of last calculation (30 in this case)",
            "_ + 1 // …and now it holds value “31” from prevous calculation",
            "// Use arrows (↑, ↓ or Enter) to code navigation.",
            "// Shift+↑ adds new line before current line and Shift+↓ (or Shift+Enter) adds new line after current.",
            "a b c // And last thing: you can make errors:)",
            "// ↑ This is invalid expression and JSCalc tell you about it.",
            "// As the following lines depend on the previous, you must fix the error before moving on.",
            "// Good luck!"
        ];
        activeLine = codeLines.length;
        codeIsUpdated();
        return false;
    });
});