var url = "http://tsemice.malse.eu";
var debug = true;
var activeMenuItem = null;
var reservationsVisible = false;
var menuVisible = false;
var contentVisible = true;
var footerVisible = false;

/* Czech initialisation for the jQuery UI date picker plugin. */
/* Written by Tomas Muller (tomas@tomas-muller.net). */
jQuery(function($) {
  $("#menuRoller").css("display", "block");
  $.datepicker.regional['cs'] = {
    closeText: Language.close,
    prevText: Language.prev,
    nextText: Language.next,
    monthNames: [Language.january, Language.february, Language.march, Language.april, Language.may, Language.june,
      Language.july, Language.august, Language.september, Language.october, Language.november, Language.december],
    monthNamesShort: [Language.calendar.jan, Language.calendar.feb, Language.calendar.mar, Language.calendar.apr, Language.calendar.may, Language.calendar.jun,
      Language.calendar.jul, Language.calendar.aug, Language.calendar.sep, Language.calendar.oct, Language.calendar.nov, Language.calendar.dec],
    dayNames: [Language.calendar.sunday, Language.calendar.monday, Language.calendar.tuesday, Language.calendar.wednesday, Language.calendar.thursday, Language.calendar.friday, Language.calendar.saturday],
    dayNamesShort: [Language.calendar.short.sunday, Language.calendar.short.monday, Language.calendar.short.tuesday, Language.calendar.short.wednesday, Language.calendar.short.thursday, Language.calendar.short.friday, Language.calendar.short.saturday],
    dayNamesMin: [Language.calendar.short.sunday, Language.calendar.short.monday, Language.calendar.short.tuesday, Language.calendar.short.wednesday, Language.calendar.short.thursday, Language.calendar.short.friday, Language.calendar.short.saturday],
    weekHeader: Language.calendar.week,
    dateFormat: 'dd.mm.yy',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: '',
    timeOnlyTitle: Language.calendar.timeOnlyTitle,
    timeText: Language.calendar.time,
    hourText: Language.calendar.short.hours,
    minuteText: Language.calendar.short.minutes,
    secondText: Language.calendar.short.seconds,
    millisecText: Language.calendar.short.miliseconds,
    timezoneText: Language.calendar.timezone,
    currentText: Language.calendar.now,
    timeFormat: 'hh:mm tt',
    amNames: ['AM', 'A'],
    pmNames: ['PM', 'P'],
    ampm: false
  };
  $.datepicker.setDefaults($.datepicker.regional['cs']);
  $.timepicker.setDefaults($.datepicker.regional['cs']);
});


jQuery(window).load(function() {

  if (window.location.hash == "#menu") {
    showMenu();
  } else if (window.location.hash == "#rezervace") {
    showReservations();
  } else {
    showFooter();
  }

});

jQuery(function($) {
  activeMenuItem = jQuery('#navigation a.active');

  jQuery('#showReservations').live('click', function() {
    var vThis = jQuery(this);
    if (reservationsVisible) {
      hideReservations();
      activeMenuItem = jQuery('#navigation a:first');
      resetActiveMenuItem();
    } else {
      showReservations();
      activeMenuItem = vThis;
      resetActiveMenuItem();
    }
  });

  jQuery('#reservation_link_restaurant').live('click', function() {
    showRestaurant();
  });

  var currentDate = null;
  var currentEndTime = null;
  //console.debug(jQuery('#reservationsForm input[name=startdate]'));
  jQuery('.reservationsForm input[name=startdate]').datetimepicker({
    hourMin: 7,
    hourMax: 20,
    hourGrid: 2,
    minuteGrid: 30,
    stepHour: 1,
    stepMinute: 30,
    dateFormat: 'dd/mm/yy',
    onClose: function(dateText, inst) {
      currentDate = dateText.substr(0, 10);
    },
    onSelect: function(dateText, inst) {
      var endDate = jQuery('.reservationsForm input[name=enddate]');
      currentDate = dateText.substr(0, 10);
      if (currentEndTime != null) {
        endDate.val(currentDate + " " + currentEndTime);
      } else {
        endDate.val(currentDate);
      }
      endDate.timepicker('option', 'hourMin', dateText.substr(11, 2));
    }
  });

  jQuery('.reservationsForm input[name=enddate]').timepicker({
    hourMin: 7,
    hourMax: 21,
    hourGrid: 2,
    minuteGrid: 30,
    stepHour: 1,
    stepMinute: 30,
    //timeFormat : currentDate + " hh:mm"
    onClose: function(dateText, inst) {
      var vThis = jQuery(this);
      if (currentDate == null || dateText.length > 5) {
        vThis.val(dateText);
      } else {
        vThis.val(currentDate + " " + dateText);
      }
    },
    onSelect: function(dateText, inst) {
      var vThis = jQuery(this);
      if (dateText.length > 5) {
        vThis.val(dateText);
      } else {
        currentEndTime = dateText;
        if (currentDate == null) {
          vThis.val(dateText);
        } else {
          vThis.val(currentDate + " " + dateText);
        }
      }
    }
  });

  var roid = null;
  jQuery('.reservation_court, .reservation_fishing, .reservation_table').live('click', function() {
    var vThis = jQuery(this);
    roid = vThis.attr('oid');

    jQuery('.reservation_court, .reservation_fishing, .reservation_table').each(function() {
      jQuery(this).removeClass('active');
    });

    vThis.addClass('active');

    vThis.parent().animate({
      right: '0px'
    }, 800);
  });

  jQuery('.reservationsForm form').submit(function() {
    var vThis = jQuery(this);
    var name = vThis.find('input[name=name]');
    var email = vThis.find('input[name=email]');
    var phone = vThis.find('input[name=phone]');
    var startDate = vThis.find('input[name=startdate]');
    var endDate = vThis.find('input[name=enddate]');
    var seats = vThis.find('input[name=seats]');
    var failure = false;

    var fields = vThis.find('input');
    fields.each(function() {
      jQuery(this).removeClass('error');
    })

    if (roid == null) {
      apprise(Language.validate.no_suitable_object_selected);
      failure = true;
    } else if (name.val() == '') {
      apprise(Language.name + ' ' + Language.validate.is_required);
      failure = true;
      name.addClass('error');
      name.focus();
    } else if (email.val() == '') {
      apprise(Language.email + ' ' + Language.validate.is_required);
      failure = true;
      email.addClass('error');
      email.focus();
    } else if (phone.val() == '') {
      apprise(Language.phone + ' ' + Language.validate.is_required);
      failure = true;
      phone.addClass('error');
      phone.focus();
    } else if (startDate.val() == '') {
      apprise(Language.validate.select_time_of_reservation_begining);
      failure = true;
      startDate.addClass('error');
      startDate.focus();
    } else if (endDate.val() == '') {
      apprise(Language.validate.select_time_of_reservation_ending);
      failure = true;
      endDate.addClass('error');
      endDate.focus();
    }

    var params = {
      oid: roid,
      name: name.val(),
      email: email.val(),
      phone: phone.val(),
      startDate: startDate.val(),
      endDate: endDate.val(),
      action: "createReservation",
      seats: seats.val()
    }
    if (console) {
      console.debug(params);
    }
    if (!failure) {
      ajaxCall(params, function(data, textStatus, jqXHR) {
        if (data.failure) {
          apprise(data.error);
        } else {
          apprise(Language.successfully_saved_reservation);
          hideReservations();
          hideRestaurant();
          resetReservationsForm();
          showContent();
          activeMenuItem = jQuery('#navigation a:first');
          resetActiveMenuItem();
        }
        if (console) {
          console.debug(data, textStatus, jqXHR);
        }
      });
    }
    return false;
  });

  $.supersized({
    // Functionality
    slideshow: 1, // Slideshow on/off
    autoplay: 1, // Slideshow starts playing automatically
    start_slide: 1, // Start slide (0 is random)
    stop_loop: 0, // Pauses slideshow on last slide
    random: 1, // Randomize slide order (Ignores start slide)
    slide_interval: 10000, // Length between transitions
    transition: 6, // 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
    transition_speed: 1000, // Speed of transition
    new_window: 1, // Image links open in new window/tab
    pause_hover: 0, // Pause slideshow on hover
    keyboard_nav: 0, // Keyboard navigation on/off
    performance: 1, // 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)
    image_protect: 1, // Disables image dragging and right click with Javascript

    // Size, Position						   
    min_width: 0, // Min width allowed (in pixels)
    min_height: 0, // Min height allowed (in pixels)
    vertical_center: 0, // Vertically center background
    horizontal_center: 1, // Horizontally center background
    fit_always: 0, // Image will never exceed browser width or height (Ignores min. dimensions)
    fit_portrait: 1, // Portrait images will not exceed browser height
    fit_landscape: 0, // Landscape images will not exceed browser width

    // Components							
    slide_links: 'blank', // Individual links for each slide (Options: false, 'num', 'name', 'blank')
    thumb_links: 1, // Individual thumb links for each slide
    thumbnail_navigation: 0, // Thumbnail navigation
    slides: [// Slideshow Images
      {
        image: 'assets/img/slide1.jpg',
        title: Language.restaurant_na_jitrach
      },
      {
        image: 'assets/img/slide2.jpg',
        title: Language.restaurant_na_jitrach
      },
      {
        image: 'assets/img/slide3.jpg',
        title: Language.restaurant_na_jitrach
      },
      {
        image: 'assets/img/slide4.jpg',
        title: Language.restaurant_na_jitrach
      },
      {
        image: 'assets/img/slide5.jpg',
        title: Language.restaurant_na_jitrach
      },
      {
        image: 'assets/img/slide6.jpg',
        title: Language.restaurant_na_jitrach
      },
      {
        image: 'assets/img/slide7.jpg',
        title: Language.restaurant_na_jitrach
      },
      {
        image: 'assets/img/slide8.jpg',
        title: Language.restaurant_na_jitrach
      },
      {
        image: 'assets/img/slide9.jpg',
        title: Language.restaurant_na_jitrach
      },
      {
        image: 'assets/img/slide10.jpg',
        title: Language.restaurant_na_jitrach
      },
      {
        image: 'assets/img/slide11.jpg',
        title: Language.restaurant_na_jitrach
      },
      {
        image: 'assets/img/slide12.jpg',
        title: Language.restaurant_na_jitrach
      }
    ],
    // Theme Options			   
    progress_bar: 1, // Timer for each slide							
    mouse_scrub: 0

  });

  $(document).ready(onResize());

  $(window).resize(function() {
    onResize();
  });

  currentId = 1;
  $(".nextParagraph").bind("click", function() {
    showNext($(this).parent().attr("id"));
  });

  $("#menuRoller, #showMenu").bind("click", function() {
    if (menuVisible) {
      hideMenu();
    }
    else {
      showMenu();
    }
  });

  $("#footerRoller").bind("click", function() {
    if (footerVisible) {
      hideFooter();
    } else {
      showFooter();
    }
  });

  $("#facebook").bind("click", function() {
    $("#newsletter-box").fadeOut("400");
    $("#newsletter-menu-box").fadeOut("400");
    $("#fb-box").fadeToggle("400");
  });

  $("#newsletter").bind("click", function() {
    $("#fb-box").fadeOut("400");
    $("#newsletter-menu-box").fadeOut("400");
    $("#newsletter-box").fadeToggle("400");
  });

  $("#newsletter_menu").bind("click", function() {
    $("#fb-box").fadeOut("400");
    $("#newsletter-box").fadeOut("400");
    $("#newsletter-menu-box").fadeToggle("400");
  });

});

function showNext(boxId) {
  var nextId;
  ($("#" + boxId + (currentId + 1)).html()) ? nextId = currentId + 1 : nextId = 1;
  $("#" + boxId + currentId).fadeOut("fast", function() {
    $("#" + boxId + "Counter").find("span").text(nextId);
    $("#" + boxId + nextId).fadeIn("medium")
    currentId = nextId;
  });
}

function showMenu() {
  menuVisible = true;
  if (reservationsVisible) {
    hideReservations();
  }
  if (footerVisible) {
    hideFooter();
  }
  hideRestaurant();

  $("#menuRoller").animate({
    right: '501px'
  }, 800);
  $("#menu").animate({
    right: '0px'
  }, 800);
  $("#menuRoller").css("background-position", "0px 0px");
  removeActiveMenuItem();
  $("#showMenu").addClass('active');
}

function hideMenu() {
  menuVisible = false;
  $("#menuRoller").animate({
    right: '1px'
  }, 400);
  $("#menu").animate({
    right: '-500px'
  }, 400);
  $("#menuRoller").css("background-position", "-40px 0px");
  activeMenuItem = jQuery('#navigation a:first');
  resetActiveMenuItem();
  //showFooter();
}

function showFooter() {

  footerVisible = true;
  $("#actionIcons").animate({
    bottom: '162px'
  }, 800);
  $("#fb-box, #newsletter-box, #newsletter-menu-box").animate({
    bottom: '201px'
  }, 800);
  $("#footer").animate({
    height: 'toggle'
  }, 800);
  $("#footerRoller").css("background-position", "0px 0px");

}

function hideFooter() {

  footerVisible = false;
  $("#actionIcons").animate({
    bottom: '10px'
  }, 400);
  $("#fb-box, #newsletter-box, #newsletter-menu-box").animate({
    bottom: '51px'
  }, 400);
  $("#footer").animate({
    height: 'toggle'
  }, 400);
  $("#footerRoller").css("background-position", "0px -40px");

}

function onResize() {
  $("#menu").css("height", $(document).height() - 90);
}

function showReservations() {
  reservationsVisible = true;
  if (menuVisible) {
    hideMenu();
  }
  if (footerVisible) {
    hideFooter();
  }
  if (contentVisible) {
    hideContent();
  }
  jQuery('#reservation_plan_global').animate({
    right: '-300px'
  }, 800);
  removeActiveMenuItem();
  jQuery('#showReservations').addClass('active');
}

function hideReservations() {
  reservationsVisible = false;
  if(!footerVisible) {
    //showFooter();
  }
  if(!contentVisible) {
    showContent();
  }
  jQuery('#reservation_plan_global').animate({
    right: '-900px'
  }, 400);
  jQuery('.reservationsForm .seats').each(function() {
    jQuery(this).addClass('display-none');
    jQuery(this).val('0');
  });
}

function showRestaurant() {
  hideReservations();
  jQuery('.reservationsForm .seats').each(function() {
    jQuery(this).removeClass('display-none');
    jQuery(this).find('input').val('');
  });
  reservationsVisible = true;
  jQuery('#reservation_plan_indoors').animate({
    right: '-300px'
  }, 800);
}

function hideRestaurant() {
  jQuery('#reservation_plan_indoors').animate({
    right: '-1060px'
  }, 400);
}

function removeActiveMenuItem() {
  jQuery('#navigation a').each(function() {
    jQuery(this).removeClass('active');
  });
}

function resetActiveMenuItem() {
  removeActiveMenuItem();
  activeMenuItem.addClass('active');
}

function hideContent() {
  contentVisible = false;
  jQuery('#news').animate({
    left: '-600px'
  }, 400);
}

function showContent() {
  contentVisible = true;
  jQuery('#news').animate({
    left: '0px'
  }, 800);
}

function resetReservationsForm() {
  jQuery('.reservationsForm').each(function() {
    jQuery(this).find('input[type=text]').val('');
  });

  jQuery('.reservation_court, .reservation_fishing, .reservation_table').each(function() {
    jQuery(this).removeClass('active');
  })
}

function ajaxCall(params, callback) {
  jQuery.ajax({
    url: url,
    data: params,
    crossDomain: true,
    dataType: "jsonp",
    success: callback
  });
}

/*
 jQuery(document).ready(function() {
 // redirect to mobile version if less than 800x500
 if ((screen.width < 800) && (screen.height < 500)) {
 window.location.href = 'http://najitrach.cz/m/';
 }
 });
 */