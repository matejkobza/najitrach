$(document).ready(function() {

    checksNotShowed = true;

    $(function() {
        $("#comment_from").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 2,
            onClose: function(selectedDate) {
                $("#comment_to").datepicker("option", "minDate", selectedDate);
            }
        });
        $("#comment_to").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 2,
            onClose: function(selectedDate) {
                $("#comment_from").datepicker("option", "maxDate", selectedDate);
            }
        });
    });

    $("#comment_text, #comment_name, #comment_email").bind("blur", function() {
        showChecks();
    });


    $("#comment_text").bind("focus", function() {
        if ($(this).val() == "Vzkaz") {
            $(this).val("");
        }
    });

    $("#comment_text").bind("blur", function() {
        if ($(this).val() == "") {
            $(this).val("Vzkaz");
        }
    });

    $("#comment_phone").bind("focus", function() {
        if ($(this).val() == "Telefon") {
            $(this).val("");
        }
    });

    $("#comment_phone").bind("blur", function() {
        if ($(this).val() == "") {
            $(this).val("Telefon");
        }
    });

    $("#comment_name").bind("focus", function() {
        if ($(this).val() == "Jméno a příjmení") {
            $(this).val("");
        }
    });

    $("#comment_name").bind("blur", function() {
        if ($(this).val() == "") {
            $(this).val("Jméno a příjmení");
        }
    });

    $("#comment_email").bind("focus", function() {
        if ($(this).val() == "E-mail") {
            $(this).val("");
        }
    });

    $("#comment_email").bind("blur", function() {
        if ($(this).val() == "") {
            $(this).val("E-mail");
        }
    });

    $("#comment_name").keyup(function() {
        var id = $(this).attr("id");
        var formName = id.split("_", 1);
        if (checkLength($(this), 2)) {
            $("#" + id + "_v").addClass("topLeft");
            nameOk = true;
            showEnterButton(formName);
        }
        else {
            $("#" + id + "_v").removeClass("topLeft");
            nameOk = false;
            hideEnterButton(formName);
        }
    });

    $("#comment_email").keyup(function() {
        var id = $(this).attr("id");
        var formName = id.split("_", 1);
        if (checkRegexp($(this), /^[^.-]+(\.[^.]+)*@([^.]+[.])+[a-z]{2,3}$/)) {
            $("#" + id + "_v").addClass("topLeft");
            emailOk = true;
            showEnterButton(formName);
        }
        else {
            $("#" + id + "_v").removeClass("topLeft");
            emailOk = false;
            hideEnterButton(formName);
        }
    });

    $("#comment_form").bind("submit", function() {
        var str = $(this).serialize();
        $.ajax({
            type: "POST",
            url: "http://www.najitrach.cz/assets/php/sendComment.php",
            data: str,
            success: function(msg) {
                if (msg == "SENT") {
                    clearCommentForm();
                }
                else {
                    alert("Uhh. Něco se pokazilo. Obětuj kozu a zkus to znova za chvíli.");
                }
                $("#msgBox").html("<a href='javascript:void(0);' title='zavřít' id='cancel'><img src='http://www.najitrach.cz/assets/img/close_form.png' alt='zavřít'/></a><h1 style='margin-top:100px;border-bottom:none;'>Děkujeme, Váš vzkaz jsme úspěšně odeslali, budeme Vás brzy kontaktovat.</h1>");
                $("#msgBox").fadeOut("fast", function() {
                    $("#overlay").fadeOut("fast");
                });

            }
        });
        return false;
    });


    $(document).on("click", "#cancel", function() {
        hideOverlay();
    });
    
    $(document).on("click", "#msg, #reservation", function() {
alert("test");
        $("#overlay").fadeIn("medium", function() {
            $("#msgBox").fadeIn("medium");
        });
    });


    $(document).keyup(function(e) {
        if (e.keyCode == 27) {
            hideOverlay();
        }
    });

});


function checkLength(o, min) {
    if (o.val().length < min) {
        return false;
    } else {
        return true;
    }
}

function showEnterButton() {
    var show = false;
    show = (nameOk && emailOk);
    if (show)
        $("#comment_submit").fadeIn("slow");
}

function hideEnterButton() {
    $("#comment_submit").fadeOut("fast");
}

function checkRegexp(o, regexp) {
    return regexp.test(o.val());
}

function clearCommentForm() {
    $("#comment_form *").fadeOut("fast", function() {
        $("#comment_form").html("<p class='dark'>Děkujeme, obdrželi jsme Vaši zprávu<p>")
    });
}

function showChecks() {
    if (checksNotShowed) {
        $("#comment_name_v, #comment_email_v").css("display", "inline-block");
    }
    checksNotShowed = false;
}

function hideOverlay() {
    $("#msgBox").fadeOut("fast", function() {
        $("#overlay").fadeOut("fast");
    });
}
