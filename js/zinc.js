(function($) {

    "use strict";

    var $log = console.log.bind(console);

    // Modernizr's Code

    function detectTransitionPrefix() {
        var t;
        var el = document.createElement('dummyfakeelementtofindprefix');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd'
        }

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }

    function detectAnimationPrefix() {
        var t,
            el = document.createElement("dummyfakeelementtofindprefix");

        var animations = {
            "animation": "animationend",
            "OAnimation": "oAnimationEnd",
            "MozAnimation": "animationend",
            "WebkitAnimation": "webkitAnimationEnd"
        }

        for (t in animations) {
            if (el.style[t] !== undefined) {
                return animations[t];
            }
        }
    }


    // Zinc Utility

    function isUndefined(a) {
        return a === void 0;
    }

    function rid() {
        var string = "",
            charSet = "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 15; i++) {
            var random = Math.floor(Math.random() * charSet.length);
            string += charSet.substring(random, random + 1);
        }

        return "_" + string;
    }


    // Main logic

    var cloak = $("<div class='zn-cloak'></div>");

    cloak.prependTo("body");

    /*var primaryBase = parseFloat( window.getComputedStyle(document.body).getPropertyValue('--zn-primary-base') ),
        accentBase = parseFloat( window.getComputedStyle(document.body).getPropertyValue('--zn-accent-base') );

    if (primaryBase === 1) {

        var style = $("<style></style>");

        var css = ".zn-button.zn-raised.zn-primary,.zn-button.zn-fab.zn-primary,.zn-button.zn-colored.zn-primary{color: var(--zn-text-dark-sec)}";

        style.text(css);

        style.appendTo(document.head);

    }

    if (accentBase === 1) {

        var style = $("<style></style>");

        var css = ".zn-button.zn-raised.zn-accent,.zn-button.zn-fab.zn-accent,.zn-button.zn-colored.zn-accent{color: var(--zn-text-dark-sec)}";

        style.text(css);

        style.appendTo(document.head);

    }*/


    $(function() {

        var transPrefix = detectTransitionPrefix(),
            animPrefix = detectAnimationPrefix();

        var easeInOut = "cubic-bezier(0.4, 0.0, 0.2, 1)",
            easeIn = "cubic-bezier(0.4, 0.0, 1, 1)",
            easeOut = "cubic-bezier(0.0, 0.0, 0.2, 1)";

        //JQUERY UTILITY

        $.fn.disabled = function(state) {

            return $(this).each(function() {

                var input = $(this);

                if (input.is("input") || input.is("textarea") || input.is("button") || input.is("checkbox") || input.is("radio")) {

                    input.prop('disabled', state);

                }

            });

        };

        $.fn.checked = function(state) {

            return $(this).each(function() {

                var input = $(this);

                if (input.is("input") || input.is("textarea") || input.is("button") || input.is("checkbox") || input.is("radio")) {

                    input.prop('checked', state);

                }

            });

        };

        $.fn.hasScrollbar = function() {

            return $(this).prop('scrollHeight') > $(this).innerHeight();

        };


        // ZINC GLOBAL OBJECT

        window.Zinc = {};

        Zinc.swipeToSideNav = true;


        //RIPPLE

        Zinc.rippleElements = ".zn-button, .zn-list-item, [zn-ripple], .zn-tab, .zn-menu-item, .zn-bottom-navbar-item";

        $(document).on("mousedown", Zinc.rippleElements, function(e) {

            var el = $(this);

            if ( !el.hasClass("zn-tab") && el.parents(".zn-list-item").length !== 0 ) e.stopPropagation();

            var rippleData = el.attr("zn-ripple"),
                rippleFill = el.attr("zn-ripple-fill"),
                rippleTo = el.attr("zn-ripple-to");

            if ((isUndefined(rippleData) || rippleData !== "false") && !el.prop("disabled")) {

                if ( !isUndefined(rippleTo) && $(rippleTo).length > 0 ) el = $(rippleTo).first();

                var ripple = $("<div class='zn-ripple-container'></div>");

                if (!isUndefined(rippleFill)) ripple.css("opacity", 1);

                var otherRipple = el.children(".zn-ripple-container");

                ( otherRipple.length > 0 ) ? ripple.insertAfter(otherRipple.last()) : ripple.prependTo(el); /* Fix this line of code */

                var offset = el.offset(),
                    left = offset.left,
                    top = offset.top,
                    posX = e.pageX - left,
                    posY = e.pageY - top;


                //Ripple size

                var width = el.outerWidth(),
                    height = el.outerHeight(),
                    diameter = Math.max(width, height);

                ripple.css({
                    width: diameter,
                    height: diameter,
                    backgroundColor: rippleData
                });


                //Duration

                var oTime = 480, //320
                    time = diameter + oTime;

                (time < 380) ? time = 380: (time > 1200) ? time = 1200 : time;


                //Positioning ripple

                var x = posX - (diameter / 2),
                    y = posY - (diameter / 2);

                if (el.hasClass("zn-button zn-icon-btn") === true && !el.is(".zn-fab, .zn-raised")) {
                    x = (width / 2) - (diameter / 2);
                    y = (height / 2) - (diameter / 2);

                    (time < 480) ? time = 480: time;
                }

                var fromCenterX = (diameter / 2) + Math.abs(x),
                    fromCenterY = (diameter / 2) + Math.abs(y),

                    scale = Math.sqrt(Math.pow(fromCenterX, 2) + Math.pow(fromCenterY, 2)) / (diameter / 2); //Pythagorean theorem


                //Start ripple

                ripple.css({
                    left: x,
                    top: y,
                    transitionProperty: "transform",
                    transitionDuration: time + "ms",
                    transitionTimingFunction: easeOut
                });

                function expandRipple() {
                    ripple.css({
                        transform: "scale(" + scale + ")"
                    });
                }

                if (!isUndefined(rippleFill)) {

                    el.one("click zn-bottom-navbar:ripple", function () {

                        expandRipple();

                    });

                } else {

                    expandRipple();

                }

                ripple.one(transPrefix, function() {

                    if (!isUndefined(rippleFill)) {

                        var index = ripple.index(),
                            prevRipple = el.children(".zn-ripple-container").not(ripple).filter(":lt(" + index + ")");

                        prevRipple.remove();

                        el.css({
                            backgroundColor: rippleData
                        });

                    }

                });

                el.one("mouseup mouseleave", function() {

                    el.off("mouseleave");

                    if (isUndefined(rippleFill)) {

                        ripple.animate({
                            opacity: 0
                        }, time, function() {
                            ripple.remove();
                        });

                        /* ripple
                        .animate({

                            opacity: 0

                        }, time)
                        .queue(function(next) {

                            $(this).remove();
                            next();

                        });*/

                    }

                });

            }

            //$log("ripple");

        });


        //SIDENAV

        $.fn.sideNav = function(method, a) {

            var sideNav = this;

            if (typeof method !== "string") return this;

            method = method.trim();

            switch (method) {
                case "open":
                    open();
                    break;

                case "close":
                    close();
                    break;
            }

            function open() {

                if (!sideNav.hasClass("zn-static")) {

                    sideNav.addClass("zn-active");

                    sideNav.removeClass("zn-clear-transition");

                    sideNav.trigger("sidenav:open");

                    var otherNav = $(".zn-sidenav.zn-active").not(sideNav);

                    otherNav.removeClass("zn-active");

                    if ($(".zn-scrim.zn-sidenav-scrim[zn-created-by-zn]").length === 0 && sideNav.length !== 0) {

                        var scrim = $("<div class='zn-scrim zn-sidenav-scrim' zn-created-by-zn></div>");

                        scrim.css("zIndex", sideNav.css("zIndex") - 1);

                        scrim.prependTo("body");

                        scrim.css("zIndex");

                        scrim.addClass("zn-active");

                    }

                }

            }

            function close() {

                closeScrimAndSideNav();

            }

        };

        /*$("#side-nav").on("sidenav:open", function () {
            $log("open");
        });

        $("#side-nav").on("sidenav:close", function () {
            $log("close");
        });*/

        $(document).on("click", ".zn-scrim.zn-sidenav-scrim[zn-created-by-zn]", function() {
            closeScrimAndSideNav();
        });

        function closeScrimAndSideNav() {

            var sideNav = $(".zn-sidenav.zn-active");

            sideNav.removeClass("zn-active");

            sideNav.trigger("sidenav:close");

            $(".zn-scrim.zn-sidenav-scrim[zn-created-by-zn]")
                .removeClass("zn-active")
                .one(transPrefix, function() {
                    this.remove();
                });

        }

        $(document).on("click", "[zn-sidenav]", function() {

            var trigger = $(this),
                arr = JSON.parse(trigger.attr("zn-sidenav"));

            var method = arr[0].trim(),
                el = arr[1].trim();

            $(el).sideNav(method);

        });

        function sideNavPermanentCheck() {

            $(".zn-sidenav[zn-permanent]").each(function() {
                var sideNav = $(this),
                    breakpoint = parseFloat(sideNav.attr("zn-permanent"));

                if (!isNaN(breakpoint)) {

                    if ($(window).width() >= breakpoint) {

                        sideNav.addClass("zn-static zn-clear-transition");

                        closeScrimAndSideNav();

                    } else {

                        sideNav.removeClass("zn-static");

                    }

                }

            });

        }

        $(document).on("mousedown touchstart", function(e) {

            var width = $(window).width(),
                startDistance = e.pageX;

            if (isUndefined(e.originalEvent.touches) === false) {
                startDistance = e.originalEvent.touches[0].pageX;
            }

            var sideNav = $(".zn-sidenav:not(.zn-active, .zn-static)");

            if (startDistance < 8 && sideNav.length > 0 && (!$("body").hasClass("zn-cant-sidenav-swipe") || Zinc.swipeToSideNav === true) ) bind();

            function bind() {

                var prePos = 0,
                    pos = 0;

                var scrim = $("<div class='zn-scrim zn-sidenav-scrim zn-clear-transition zn-active' zn-created-by-zn></div>").hide();

                scrim.css("zIndex", sideNav.css("zIndex") - 1);

                scrim.prependTo("body");

                var scrimOpacity = scrim.css("opacity");

                $(document).on("mousemove touchmove", function (e) {

                    prePos = pos;

                    pos = e.pageX;

                    if (isUndefined(e.originalEvent.touches) === false) {
                        pos = e.originalEvent.touches[0].pageX;
                    }

                    var toMove = pos / sideNav.width() * 100;

                    if (toMove > 100) toMove = 100;

                    toMove = 100 - toMove;

                    sideNav.addClass("zn-clear-transition");

                    scrim.css("opacity", 0).show();

                    var opacity = (1 - toMove/100) * scrimOpacity;

                    if (opacity > scrimOpacity) opacity = scrimOpacity;

                    scrim.css("opacity", opacity);

                    sideNav.css({
                        transform: "translate3d(-" + toMove + "%, 0, 0)",
                        boxShadow: "var(--z-16dp)"
                    });

                });

                $(document).one("mouseup touchend", function() {

                    sideNav.css({
                        transform: "",
                        boxShadow: ""
                    }).removeClass("zn-clear-transition");

                    scrim.removeClass("zn-clear-transition");

                    scrim.css("opacity", "");

                    if (pos >= prePos) {
                        sideNav.sideNav("open");
                    } else {
                        sideNav.sideNav("close");
                    }

                    $(document).off("mousemove touchmove");
                });

            }

        });

        //MENU

        var popupManager = {};

        popupManager.offscreen = function(cord, el) {

            cord = cord.trim();

            var winX = $(window).width(),
                winY = $(window).height(),
                top = el.offset().top,
                left = el.offset().left,
                width = el.outerWidth(),
                height = el.outerHeight();

            switch (cord) {
                case "top":
                    return top + height > winY;
                    break;

                case "left":
                    return left < 0;
                    break;

                case "right":
                    return left + width > winX;
                    break;

                case "bottom":
                    return top + height > winY;
                    break;
            }

        };

        $.fn.menu = function(target) {

            var menu = $(this),
                menuItems = menu.find(".zn-menu-item"),
                tar = target;

            var overlay = $(".zn-menu-overlay"); //Overlay

            if (overlay.length === 0) {
                overlay = $("<div class='zn-menu-overlay'></div>");
            }

            menu.css({
                visibility: "visible", //Make menu hidden but takes up space to get width and height
                transition: "0s" //Clear transition for correct width and height
            });

            menu.removeClass("zn-show"); //Remove class from previously opened

            menu.attr('tabindex', '-1'); //Make unfocusable

            //Focus logic

            var prevFocus = $("*:focus"),
                focusTrapTop = $("<div class='zn-menu-focus-trap-top' tabindex='0'></div>"),
                focusTrapBottom = $("<div class='zn-menu-focus-trap-bottom' tabindex='0'></div>");

            prevFocus.blur();

            if ( menu.find(".zn-menu-focus-trap-top").length === 0 ) {
                focusTrapTop.prependTo(menu);
            }

            if ( menu.find(".zn-menu-focus-trap-bottom").length === 0 ) {
                focusTrapBottom.appendTo(menu);
            }

            focusTrapTop.add(focusTrapBottom).focus(function() {
                menu.focus();
                menuItems.first().focus();
            });

            overlay.css({
                zIndex: menu.css("zIndex") - 1 //Make overlay 1 z-index smaller than menu
            })

            menu.prependTo("body"); //Move to body

            overlay.insertAfter(menu); //Insert overlay after menu for greater ordering

            menu.focus(); //Focus on menu

            menu.addClass("zn-show"); //Add class to get width and height

            var width = menu.outerWidth(),
                height = menu.outerHeight();

            menu.removeClass("zn-show"); //Remove class when done get width and height

            var transOrigin = "left top"; //Transform origin

            function positioning() { //Positioning logic

                var top = tar.offset().top,
                    left = tar.offset().left,
                    tarWidth = tar.outerWidth(),
                    tarHeight = tar.outerHeight(),
                    winX = $(window).width(),
                    winY = $(window).height();

                var tweak = 48; //Tweak for list item

                menu.css({ //Set position
                    top: top,
                    left: left
                });

                if (tarHeight === tweak) menu.css("top", y); //Minus the padding of the menu if target height is 48px

                if ( top <= 0 ) menu.css("top", 8); //Shift the menu to 8px down from the top
                if ( left <= 0 ) menu.css("left", 16); //Shift the menu to 16px to the left from the left

                if ( popupManager.offscreen("right", menu) ) {

                    var x = left - width + tarWidth;

                    menu.css({
                        left: x
                    });

                    transOrigin = transOrigin.replace("left", "right");

                }

                if ( popupManager.offscreen("bottom", menu) ) {

                    var y = top - height + tarHeight;

                    menu.css({
                        top: y
                    });

                    transOrigin = transOrigin.replace("top", "bottom");

                }

                menu.css({
                    transformOrigin: transOrigin
                });

            }

            positioning();

            $(window).resize(function () { //Recheck positioning on window size change

                width = menu.outerWidth();
                height = menu.outerHeight();

                menu.css({
                    transition: "0s" //Enable transition
                });

                positioning();

                menu.css("zIndex"); //Force repaint

                menu.css({
                    transition: "" //Enable transition
                });

            });

            //Showing

            menu.css("zIndex"); //Force repaint

            menu.css({
                transition: "" //Enable transition
            });

            menu.addClass("zn-show");

            overlay.add(menuItems.not("[zn-menu-hover]")).click(function () { //Listen for click to close

                menu.trigger("zn-menu:close", [target]); //Trigger custom event listener

                menu.css({ //Fade out
                    opacity: 0
                });

                menu.one(transPrefix, function() { //After finished transitioning

                    menu.css({
                        opacity: "", //Clear opacity
                        visibility: "hidden" //Hide menu but takes up space
                    });

                    menu.removeClass("zn-show"); //Remove class

                    overlay.remove(); //Remove overlay

                });

                prevFocus.focus(); //Focus on previously focused element

            });

        };

        $(document).on("click", "[zn-menu]", function() {

            var trigger = $(this),
                el = trigger.attr("zn-menu");

            $(el).menu(trigger);

        });


        //TOOLBAR




        //TAB

        function changeTab(tab) {

            var tab,
                tabs = tab.closest(".zn-tabs"),
                otherTab = tabs.find(".zn-tab").not(tab),
                tabIndicator = tabs.find(".zn-tab-indicator");

            tab.addClass("zn-active");
            otherTab.removeClass("zn-active");

            updateIndicator(tabIndicator, tab, tabs);

            var content = $(tab.attr("zn-tab")).first();

            if (content.length > 0) updateContent(content);

        }

        function updateIndicator(indicator, tab, tabs) {

            var indicator, tab, tabs;

            if (!indicator) {
                indicator = $(".zn-tabs .zn-tab-indicator");
            }

            if (!tab) {
                tab = tabs.find(".zn-tab.zn-active").first();
                tabs = indicator.closest(".zn-tabs");
            }

            if (!tab) {
                tabs = indicator.closest(".zn-tabs");
            }

            var width = tab.outerWidth(),
                pos = tab.position().left,
                offset = tabs.scrollLeft();

            indicator.css({
                width: width + 'px',
                left: offset + pos + 'px'
            });

            if (!indicator.hasClass("zn-init")) {

                indicator.css("zIndex");

                indicator.addClass("zn-init");

            }

        }

        function updateContent(content) {

            var content,
                wrap = content.closest(".zn-tab-contents");

            var index = Math.abs(content.index());

            var transform = "translate3d(" + index * -100 + "%, 0, 0)";

            wrap.css({
                transform: transform
            });

            if (!wrap.hasClass("zn-init")) {

                wrap.css("zIndex");

                wrap.addClass("zn-init");

            }

        }


        function resizeIndicators() {

            var tabs = $(".zn-tabs");

            tabs.each(function() {

                var cur = $(this),
                    tab = cur.find(".zn-tab.zn-active"),
                    indicator = cur.find(".zn-tab-indicator");

                updateIndicator(indicator, tab, cur);

            });

        }

        $(document).on("click", ".zn-tabs .zn-tab", function() {

            var tab = $(this);

            changeTab(tab);

        });

        $(document).on("mousedown touchstart", ".zn-tabs-wrapper", function(a) {

            var wrap = $(this),
                tabs = wrap.find(".zn-tabs"),
                startPos = a.pageX;

            if (isUndefined(a.originalEvent.touches) === false) {
                startPos = a.originalEvent.touches[0].pageX;
            }

            /*var width = wrap.width(),
                scrollWidth = tabs.prop('scrollWidth'),
                maxScroll =  width - scrollWidth;*/

            var currentScroll = tabs.scrollLeft();

            function moveScrollBar(b) {

                var movePos = b.pageX;

                if (isUndefined(b.originalEvent.touches) === false) {
                    movePos = b.originalEvent.touches[0].pageX;
                }

                wrap.children().css("pointer-events", "none");

                var distance = startPos - movePos,
                    amountToMove = currentScroll + distance;

                tabs.scrollLeft(amountToMove);

                /*if (scrollWidth > width && amountToMove < 0 && amountToMove >= maxScroll) {

                    tabs.css({
                        left: currentScroll + amountToMove
                    });

                }*/

            }

            $(document).on("mousemove.znTabsScroll touchmove.znTabsScroll", ".zn-tabs-wrapper", function(b) {

                moveScrollBar(b);

            });

            $(document).on("mousemove.znTabsScrollMain", function(b) {

                moveScrollBar(b);

            });


            function clearEvents() {

                wrap.children().css("pointer-events", "");

                $(document).off("mousemove.znTabsScroll mousemove.znTabsScrollMain");

            }

            $(document).one("mouseup touchend touchcancel", ".zn-tabs-wrapper", function() {

                clearEvents();

            });

            $(document).one("mouseup", function() {

                clearEvents();

            });

        });

        $.fn.tabs = function() {

            var arg = Array.prototype.slice.call(arguments);

            return this.each(function() {

                var tabs = $(this);

                var def = tabs.find(".zn-tab[zn-default]"),
                    firstTab = tabs.find(".zn-tab").first();

                if (arg.length > 1) {

                    var method = arg[0].trim(),
                        el = tabs.find(arg[1]).first();

                    switch (method) {
                        case "activate":
                            activateTab(el);
                            break;
                    }

                } else if (def.length > 0) {

                    activateTab(def);

                } else {

                    activateTab(firstTab);

                }

                function activateTab(a) {
                    changeTab(a);
                }

            });

        };


        //BOTTOM NAVBAR

        $(document).on("click", ".zn-bottom-navbar .zn-bottom-navbar-item", function() {

            var item = $(this),
                nav = item.closest(".zn-bottom-navbar"),
                otherItem = nav.find(".zn-bottom-navbar-item").not(item);

            item.addClass("zn-active");

            otherItem.removeClass("zn-active");

            item.trigger("bottom-navbar:active");

        });

        $.fn.bottomNavbar = function() {

            return this.each(function() {

                var nav = $(this);

                var def = nav.find(".zn-bottom-navbar-item[zn-default]"),
                    firstTab = nav.find(".zn-bottom-navbar-item").first();

                if (def.length > 0) {

                    def.click();

                    fillColor(def);

                } else {

                    firstTab.click();

                    fillColor(firstTab);

                }

                function fillColor(a) {

                    if ( nav.hasClass("zn-shift") === true ) {

                        nav.css({
                            backgroundColor: a.attr("zn-ripple")
                        });

                    }

                }

            });

        };


        //LIST

        function setCollapsibleHeight() {

            $(".zn-collapsible.zn-active .zn-collapsible-content-wrapper").each(function(e) {

                var wrap = $(this),
                    height = wrap.find(".zn-collapsible-content").height();

                wrap.css("height", height);

            });

        }

        $(document).on("click", ".zn-collapsible .zn-collapsible-trigger", function () {

            var btn = $(this),
                col = btn.closest(".zn-collapsible"),
                wrap = col.find(".zn-collapsible-content-wrapper"),
                content = wrap.find(".zn-collapsible-content");

            var height = content.height();

            if (!col.hasClass("zn-active")) {

                wrap.css("height", height);

            } else {

                wrap.css("height", 0);

            }

            col.toggleClass("zn-active");

        });


        //TEXT FIELD

        $.fn.inputCounter = function() {

            return this.each(function() {

                var field = $(this),
                    input = field.find(".zn-input"),
                    inputMaxLength = input.attr("maxLength"),
                    intputValChars = input.val().length,
                    counter = field.find(".zn-input-helper.zn-counter"),
                    counterHTML = $("<div class='zn-input-helper zn-counter'>0/0</div>");

                if (counter.length === 0) {
                    counterHTML.appendTo(field);
                    counter = field.find(".zn-input-helper.zn-counter");
                }

                counter.html(intputValChars + '/' + inputMaxLength);

            });

        };

        $(".zn-text-field[zn-counter]").inputCounter();

        $(document).on("change input paste", ".zn-text-field .zn-input", function() {

            var input = $(this),
                container = input.closest(".zn-text-field"),
                noFloatLabel = container.filter("[zn-no-float]").find(".zn-label");

            if (container.is("[zn-multi-line]")) {
                growInput(input);
            }

            if (container.is("[zn-counter]")) {
                container.inputCounter();
            }

            if (input.val() !== "") {
                container.addClass("zn-has-value");
                noFloatLabel.hide();
            } else {
                container.removeClass("zn-has-value");
                noFloatLabel.show();
            }

        });

        $(document).on("focus", ".zn-text-field .zn-input", function() {
                var input = $(this),
                    container = input.closest(".zn-text-field");

                container.addClass("zn-focused");
            })
            .on("blur", ".zn-text-field .zn-input", function() {
                var input = $(this),
                    container = input.closest(".zn-text-field");

                container.removeClass("zn-focused");
            });

        function growInput(el) {

            var el;

            el.css({
                height: 'auto'
            });

            el.css({
                height: el.prop("scrollHeight") + 'px'
            });

        }


        //DIALOG

        function dialogRestyleCheck(dialog) {

            if (!dialog) {

                dialog = $(".zn-dialog");

            }

            dialog.each(function() {

                var cur = $(this),
                    width = cur.width(),
                    actions = cur.find(".zn-dialog-actions"),
                    btn = actions.find(".zn-button");

                var content = cur.find(".zn-dialog-content");


                //Stacked Actions Check

                cur.removeClass("zn-stacked");

                var maxWidth = (width - 24) / 2; //Material Design Dialog Specs

                var widthArray = btn.map(function() { //Map the widths of the buttons to a new array

                    return $(this).outerWidth(); //

                }).get(); //.get() return the normal array

                var biggestWidth = Math.floor(Math.max.apply(null, widthArray)); //Get the biggest width + Rounding

                if (biggestWidth > maxWidth) {

                    actions.addClass("zn-stacked");

                } else {

                    actions.removeClass("zn-stacked");

                }


                //Scrollable Content Check

                if (content.hasScrollbar()) {

                    cur.addClass("zn-scrollable");

                } else {

                    cur.removeClass("zn-scrollable");

                }

            });

        }

        /*$.extend({

            dialog: function(options) {

                var defaults = {
                    type: "alert",
                    title: "",
                    content: "",
                    contentInsertAfter: false,
                    cancelButton: true,
                    cancelText: "Cancel",
                    confirmText: "Ok",
                    actionClass: "zn-primary",
                    label: "Label",
                    promptClass: "",
                    selectArray: [],
                    preSelect: [],
                    selectClass: "",
                    //selectToClose: false,
                    dialogClass: "",
                    closeWithScrim: true,
                    onClose: function(action, dialog) {}
                };

                var settings = $.extend({}, defaults, options);

                return $(this).each(function() {

                    var performedAction;


                    //Init

                    var type = settings.type.trim(),

                        title = settings.title.trim(),
                        content = settings.content.trim(),
                        contentInsertAfter = settings.contentInsertAfter,

                        cancelButton = settings.cancelButton,
                        cancelText = settings.cancelText.trim(),
                        okText = settings.confirmText.trim(),
                        actionClass = settings.actionClass.trim(),

                        label = settings.label.trim(),
                        promptClass = settings.promptClass.trim(),

                        selectArray = settings.selectArray,
                        preSelect = settings.preSelect,
                        selectClass = settings.selectClass.trim(),

                        dialogClass = settings.dialogClass.trim(),

                        closeWithScrim = settings.closeWithScrim;

                    var dialogHTML =
                        '<div class="zn-dialog-wrapper">' +

                        '<div class="zn-dialog" zn-created-by-zn tabindex="-1">' +

                        '<div class="zn-dialog-header">' +
                        '<div class="zn-dialog-title">' + title + '</div>' +
                        '</div>' +

                        '<div class="zn-dialog-content">' +
                        '<div class="zn-dialog-user-content">' + content + '</div>' +
                        '</div>' +

                        '<div class="zn-dialog-actions">' +

                        '<button class="zn-button zn-dialog-cancel ' + actionClass + '">' +
                        '<span>' + cancelText + '</span>' +
                        '</button>' +

                        '<button class="zn-button zn-dialog-ok ' + actionClass + '">' +
                        '<span>' + okText + '</span>' +
                        '</button>' +

                        '</div>' +

                        '</div>' +

                        '</div>',
                        dialogWrap = $(dialogHTML);

                    var dialog = dialogWrap.find(".zn-dialog"),
                        dialogHeader = dialog.find('.zn-dialog-header'),
                        dialogContent = dialog.find('.zn-dialog-content'),
                        dialogText = dialog.find('.zn-dialog-user-content'),
                        dialogActions = dialog.find('.zn-dialog-actions'),
                        okBtn = dialogActions.find(".zn-dialog-ok"),
                        cancelBtn = dialogActions.find(".zn-dialog-cancel");

                    var focusTrapTop = $("<div class='zn-dialog-focus-trap' tabindex='0'></div>"),
                        focusTrapBottom = focusTrapTop.clone();

                    focusTrapTop.prependTo(dialogWrap);
                    focusTrapBottom.appendTo(dialogWrap);

                    var prevFocus = $("*:focus").first();


                    $(".zn-dialog[zn-created-by-zn]").trigger("zn-dialog:replace");


                    //Prompt

                    var fieldHTML =
                        '<div class="zn-text-field ' + promptClass + '" zn-no-float zn-full-width>' +

                        '<input class="zn-input">' +

                        '<label class="zn-label">' + label + '</label>' +

                        '<div class="zn-input-border"></div> ' +

                        '</div>',
                        field = $(fieldHTML);

                    var input = field.find("input");


                    //Use for later logic check

                    var prompted = false,
                        choiced = false;


                    //Random id

                    var id = rid();


                    //Check which type

                    switch (type) {

                        default: doAlert();
                        break;

                        case "alert":
                                doAlert();
                            break;

                        case "confirm":
                                doConfirm();
                            break;

                        case "prompt":
                                doPrompt();
                            break;

                        case "single":
                                doSelect(type);
                            break;

                        case "multi":
                                doSelect(type);
                            break;

                    }

                    if (!title) dialogHeader.remove(); //Remove header if title is empty

                    //if ( !content && $.inArray(type, ["prompt", "single", "multi"]) < 0 ) dialogText.remove();

                    var inArray = ["prompt", "single", "multi"].indexOf(type);

                    if (!content && inArray < 0) { //Remove content if content var is empty

                        dialogContent.remove();

                    } else if (!content && inArray > -1) {

                        dialogText.remove();

                    }

                    if (cancelButton === false) cancelBtn.remove(); //Remove cancel button if setting is false

                    function doAlert() {

                        dialogActions.remove();

                        showDialog();

                    }

                    function doConfirm() {

                        showDialog();

                    }

                    function doPrompt() {

                        prompted = true;

                        field.appendTo(dialogContent);

                        showDialog();

                        input.focus();


                        //Listen for ENTER

                        input.keydown(function(e) {

                            if (e.which === 13) {

                                var inputVal = input.val();

                                closeDialog(inputVal);

                                e.preventDefault();

                            }

                        });


                    }

                    function doSelect(type) {

                        choiced = true;


                        //Disable Ok button

                        okBtn.disabled(true);

                        var deWrap = $("<div class='zn-dialog-list-padding-clear'></div>");

                        var list = $('<div class="zn-list"></div>');

                        list.appendTo(deWrap);


                        //To position: 0 = prepend, 1 = append

                        var to = 0, //Prepend
                            pos = "primary",
                            inputType = "radio";

                        var itemHTML =
                            '<label class="zn-list-item">' +
                            '<div class="zn-list-item-text"></div>' +
                            '</label>';

                        if (type === "multi") { // Different logic for multi selection

                            to = 1; //Append

                            pos = "secondary";

                            inputType = "checkbox";

                        }

                        var formHTML =
                            '<div class="zn-list-item-' + pos + ' ' + 'zn-dialog-select">' +

                            '<div class="zn-' + inputType + ' ' + selectClass + '">' +

                            '<input type="' + inputType + '" name="' + id + '" tabindex="-1">' +

                            '<div class="zn-' + inputType + '-content"></div>' +

                            '</div>' +

                            '</div>';

                        var items = $([]); //Empty JQuery Object

                        selectArray.forEach(function(current, i) { //Loop throught array to create desired list items

                            var item = $(itemHTML), //Init
                                select = $(formHTML),
                                input = select.find("input");

                            var itemText = item.find(".zn-list-item-text");

                            var text = current;

                            if (preSelect.indexOf(i) > -1) { //Check if current item is pre-selected

                                input.checked(true);

                                okBtn.disabled(false);

                            }

                            input.val(i); //Set the val

                            input.attr("zn-name", text); //Set the name

                            itemText.html(text); //Print the array's text to the current item

                            if (to === 0) { //Check for prepend or append

                                select.prependTo(item);

                            } else {

                                select.removeClass("zn-dialog-select");

                                select.appendTo(item);

                            }

                            items = items.add(item); //Push current item to the empty object

                        });

                        items.appendTo(list); //Append the items to the list

                        deWrap.appendTo(dialogContent); //Append the outer wrap to dialog's content

                        showDialog();

                        var selects = $("input[name='" + id + "']"); //Select all previously generated selections(<input>)

                        selects.change(function() { //Check for change

                            if (selects.is(":checked")) { //Enable the Ok button if there is 1 and above selected selections

                                okBtn.disabled(false);

                            } else {

                                okBtn.disabled(true);

                            }

                        });

                    }


                    focusTrapTop.add(focusTrapBottom).focus(function() {

                        dialog.focus();

                    });


                    okBtn.click(function() {

                        var a = 1; //Callback variable

                        if (prompted === true) { //Check for prompt

                            var inputVal = input.val(); //Get input's value

                            a = inputVal; //Set Callback variable to input's value

                        }

                        if (choiced === true) { //Check for select

                            var elAr = $("input[name='" + id + "']:checked"); //Select all previously generated selections(<input>) that is checked

                            var ar = elAr.map(function(i) { //Map the selected elements to a new array

                                var cur = $(this); //Get current item

                                var val = parseInt(cur.val()), //Get value of the current item
                                    name = cur.attr("zn-name"); //Get array's original name of the current item

                                return {
                                    value: val,
                                    name: name
                                }; //Get an object

                            }).get(); //Convert Jquery Array to normal array

                            a = ar; //Set Callback variable to the normalized array

                        }

                        closeDialog(a); //Close Dialog that has corresponding callback variable based on type

                    });

                    cancelBtn.click(function() {
                        closeDialog(0);
                    });

                    var scrim = $(".zn-scrim.zn-dialog-scrim.zn-active"); //Select active dialog scrim

                    if (scrim.length == 0) { //Check if there is no dialog scrim

                        scrim = $("<div class='zn-scrim zn-dialog-scrim'></div>");

                        scrim.prependTo("body");

                        var zSpace = dialogWrap.css("zIndex"); //Force repaint

                        scrim.css({
                            zIndex: zSpace - 1
                        });

                        scrim.addClass("zn-active");

                    }

                    scrim.click(function() { //Listen for click

                        if (closeWithScrim === true && cancelButton !== false) { //Check settings
                            closeDialog(0);
                        }

                    });

                    function showDialog() {

                        dialog.on("zn-dialog:replace", function() {
                            closeDialog(0, false);
                        });

                        if (contentInsertAfter === true) {

                            dialogText.appendTo(dialogContent);

                        }

                        dialogWrap.prependTo("body");

                        dialogWrap.css("zIndex"); //Force repaint

                        dialogWrap.addClass("zn-show");

                        dialogRestyleCheck(); //Check for restyle

                        dialog.focus();

                    }

                    function closeDialog(val, opt) {

                        var val;

                        dialogWrap.removeClass("zn-show");

                        dialog.one(transPrefix, function() { //Wait until dialog has finished transitioning
                            dialogWrap.remove();
                        });

                        if (opt !== false) {

                            scrim.removeClass("zn-active");

                            scrim.one(transPrefix, function() { //Wait until scrim has finished transitioning
                                scrim.remove();
                            });

                        }

                        settings.onClose(val, dialog); //Call the onClose with Callback variable of "val"

                        prevFocus.focus();

                    }

                });

            }

        });*/

        Zinc.dialog = function(options) {

            var defaults = {
                type: "alert",
                title: "",
                content: "",
                contentInsertAfter: false,
                cancelButton: true,
                cancelText: "Cancel",
                confirmText: "Ok",
                actionClass: "zn-primary",
                label: "Label",
                promptClass: "",
                selectArray: [],
                preSelect: [],
                selectClass: "",
                //selectToClose: false,
                dialogClass: "",
                closeWithScrim: true,
                onClose: function(action, dialog) {}
            };

            var settings = $.extend({}, defaults, options);

            return $(this).each(function() {

                var performedAction;


                //Init

                var type = settings.type.trim(),

                    title = settings.title.trim(),
                    content = settings.content.trim(),
                    contentInsertAfter = settings.contentInsertAfter,

                    cancelButton = settings.cancelButton,
                    cancelText = settings.cancelText.trim(),
                    okText = settings.confirmText.trim(),
                    actionClass = settings.actionClass.trim(),

                    label = settings.label.trim(),
                    promptClass = settings.promptClass.trim(),

                    selectArray = settings.selectArray,
                    preSelect = settings.preSelect,
                    selectClass = settings.selectClass.trim(),

                    dialogClass = settings.dialogClass.trim(),

                    closeWithScrim = settings.closeWithScrim;

                var dialogHTML =
                    '<div class="zn-dialog-wrapper">' +

                    '<div class="zn-dialog" zn-created-by-zn tabindex="-1">' +

                    '<div class="zn-dialog-header">' +
                    '<div class="zn-dialog-title">' + title + '</div>' +
                    '</div>' +

                    '<div class="zn-dialog-content">' +
                    '<div class="zn-dialog-user-content">' + content + '</div>' +
                    '</div>' +

                    '<div class="zn-dialog-actions">' +

                    '<button class="zn-button zn-dialog-cancel ' + actionClass + '">' +
                    '<span>' + cancelText + '</span>' +
                    '</button>' +

                    '<button class="zn-button zn-dialog-ok ' + actionClass + '">' +
                    '<span>' + okText + '</span>' +
                    '</button>' +

                    '</div>' +

                    '</div>' +

                    '</div>',
                    dialogWrap = $(dialogHTML);

                var dialog = dialogWrap.find(".zn-dialog"),
                    dialogHeader = dialog.find('.zn-dialog-header'),
                    dialogContent = dialog.find('.zn-dialog-content'),
                    dialogText = dialog.find('.zn-dialog-user-content'),
                    dialogActions = dialog.find('.zn-dialog-actions'),
                    okBtn = dialogActions.find(".zn-dialog-ok"),
                    cancelBtn = dialogActions.find(".zn-dialog-cancel");

                var focusTrapTop = $("<div class='zn-dialog-focus-trap' tabindex='0'></div>"),
                    focusTrapBottom = focusTrapTop.clone();

                focusTrapTop.prependTo(dialogWrap);
                focusTrapBottom.appendTo(dialogWrap);

                var prevFocus = $("*:focus").first();


                $(".zn-dialog[zn-created-by-zn]").trigger("zn-dialog:replace");


                //Prompt

                var fieldHTML =
                    '<div class="zn-text-field ' + promptClass + '" zn-no-float zn-full-width>' +

                    '<input class="zn-input">' +

                    '<label class="zn-label">' + label + '</label>' +

                    '<div class="zn-input-border"></div> ' +

                    '</div>',
                    field = $(fieldHTML);

                var input = field.find("input");


                //Use for later logic check

                var prompted = false,
                    choiced = false;


                //Random id

                var id = rid();


                //Check which type

                switch (type) {

                    default: doAlert();
                    break;

                    case "alert":
                            doAlert();
                        break;

                    case "confirm":
                            doConfirm();
                        break;

                    case "prompt":
                            doPrompt();
                        break;

                    case "single":
                            doSelect(type);
                        break;

                    case "multi":
                            doSelect(type);
                        break;

                }

                if (!title) dialogHeader.remove(); //Remove header if title is empty

                //if ( !content && $.inArray(type, ["prompt", "single", "multi"]) < 0 ) dialogText.remove();

                var inArray = ["prompt", "single", "multi"].indexOf(type);

                if (!content && inArray < 0) { //Remove content if content var is empty

                    dialogContent.remove();

                } else if (!content && inArray > -1) {

                    dialogText.remove();

                }

                if (cancelButton === false) cancelBtn.remove(); //Remove cancel button if setting is false

                function doAlert() {

                    dialogActions.remove();

                    showDialog();

                }

                function doConfirm() {

                    showDialog();

                }

                function doPrompt() {

                    prompted = true;

                    field.appendTo(dialogContent);

                    showDialog();

                    input.focus();


                    //Listen for ENTER

                    input.keydown(function(e) {

                        if (e.which === 13) {

                            var inputVal = input.val();

                            closeDialog(inputVal);

                            e.preventDefault();

                        }

                    });


                }

                function doSelect(type) {

                    choiced = true;


                    //Disable Ok button

                    okBtn.disabled(true);

                    var deWrap = $("<div class='zn-dialog-list-padding-clear'></div>");

                    var list = $('<div class="zn-list"></div>');

                    list.appendTo(deWrap);


                    //To position: 0 = prepend, 1 = append

                    var to = 0, //Prepend
                        pos = "primary",
                        inputType = "radio";

                    var itemHTML =
                        '<label class="zn-list-item">' +
                        '<div class="zn-list-item-text"></div>' +
                        '</label>';

                    if (type === "multi") { // Different logic for multi selection

                        to = 1; //Append

                        pos = "secondary";

                        inputType = "checkbox";

                    }

                    var formHTML =
                        '<div class="zn-list-item-' + pos + ' ' + 'zn-dialog-select">' +

                        '<div class="zn-' + inputType + ' ' + selectClass + '">' +

                        '<input type="' + inputType + '" name="' + id + '" tabindex="-1">' +

                        '<div class="zn-' + inputType + '-content"></div>' +

                        '</div>' +

                        '</div>';

                    var items = $([]); //Empty JQuery Object

                    selectArray.forEach(function(current, i) { //Loop throught array to create desired list items

                        var item = $(itemHTML), //Init
                            select = $(formHTML),
                            input = select.find("input");

                        var itemText = item.find(".zn-list-item-text");

                        var text = current;

                        if (preSelect.indexOf(i) > -1) { //Check if current item is pre-selected

                            input.checked(true);

                            okBtn.disabled(false);

                        }

                        input.val(i); //Set the val

                        input.attr("zn-name", text); //Set the name

                        itemText.html(text); //Print the array's text to the current item

                        if (to === 0) { //Check for prepend or append

                            select.prependTo(item);

                        } else {

                            select.removeClass("zn-dialog-select");

                            select.appendTo(item);

                        }

                        items = items.add(item); //Push current item to the empty object

                    });

                    items.appendTo(list); //Append the items to the list

                    deWrap.appendTo(dialogContent); //Append the outer wrap to dialog's content

                    showDialog();

                    var selects = $("input[name='" + id + "']"); //Select all previously generated selections(<input>)

                    selects.change(function() { //Check for change

                        if (selects.is(":checked")) { //Enable the Ok button if there is 1 and above selected selections

                            okBtn.disabled(false);

                        } else {

                            okBtn.disabled(true);

                        }

                    });

                }


                focusTrapTop.add(focusTrapBottom).focus(function() {

                    dialog.focus();

                });


                okBtn.click(function() {

                    var a = 1; //Callback variable

                    if (prompted === true) { //Check for prompt

                        var inputVal = input.val(); //Get input's value

                        a = inputVal; //Set Callback variable to input's value

                    }

                    if (choiced === true) { //Check for select

                        var elAr = $("input[name='" + id + "']:checked"); //Select all previously generated selections(<input>) that is checked

                        var ar = elAr.map(function(i) { //Map the selected elements to a new array

                            var cur = $(this); //Get current item

                            var val = parseInt(cur.val()), //Get value of the current item
                                name = cur.attr("zn-name"); //Get array's original name of the current item

                            return {
                                value: val,
                                name: name
                            }; //Get an object

                        }).get(); //Convert Jquery Array to normal array

                        a = ar; //Set Callback variable to the normalized array

                    }

                    closeDialog(a); //Close Dialog that has corresponding callback variable based on type

                });

                cancelBtn.click(function() {
                    closeDialog(0);
                });

                var scrim = $(".zn-scrim.zn-dialog-scrim.zn-active"); //Select active dialog scrim

                if (scrim.length == 0) { //Check if there is no dialog scrim

                    scrim = $("<div class='zn-scrim zn-dialog-scrim'></div>");

                    scrim.prependTo("body");

                    var zSpace = dialogWrap.css("zIndex"); //Force repaint

                    scrim.css({
                        zIndex: zSpace - 1
                    });

                    scrim.addClass("zn-active");

                }

                scrim.click(function() { //Listen for click

                    if (closeWithScrim === true && cancelButton !== false) { //Check settings
                        closeDialog(0);
                    }

                });

                function showDialog() {

                    dialog.on("zn-dialog:replace", function() {
                        closeDialog(0, false);
                    });

                    if (contentInsertAfter === true) {

                        dialogText.appendTo(dialogContent);

                    }

                    dialogWrap.prependTo("body");

                    dialogWrap.css("zIndex"); //Force repaint

                    dialogWrap.addClass("zn-show");

                    dialogRestyleCheck(); //Check for restyle

                    dialog.focus();

                }

                function closeDialog(val, opt) {

                    var val;

                    dialogWrap.removeClass("zn-show");

                    dialog.one(transPrefix, function() { //Wait until dialog has finished transitioning
                        dialogWrap.remove();
                    });

                    if (opt !== false) {

                        scrim.removeClass("zn-active");

                        scrim.one(transPrefix, function() { //Wait until scrim has finished transitioning
                            scrim.remove();
                        });

                    }

                    settings.onClose(val, dialog); //Call the onClose with Callback variable of "val"

                    prevFocus.focus();

                }

            });

        };


        //BOTTOM SHEET

        function bottomSheetHeightCheck(sheet) {

            if (!sheet) {
                sheet = $(".zn-bottom-sheet");
            }

            sheet.each(function() {

                var sheetWidth = sheet.width(),
                    sheetHeight = sheet.height(),
                    winHeight = $(window).height();

                var vHeight = winHeight - sheetHeight,
                    recHeight = sheetWidth / (16/9);

                if (vHeight < recHeight) {

                    var toTransform = vHeight - recHeight;

                    sheet.css("bottom", toTransform);

                } else {

                    sheet.css("bottom", 0);

                }

            });

        }

        $.fn.bottomSheet = function(method) {

            (method instanceof String) ? method = method.trim() : method;

            return this.each(function() {

                var sheet = $(this),
                    prevId = "#" + sheet.attr("zn-id");

                function close(overlay) {

                    sheet.removeClass("zn-active");

                    sheet.css("zIndex");

                    sheet.one(transPrefix, function () {
                        sheet.css("box-shadow", "none")
                        sheet.hide();
                    });

                    sheet.trigger("bottom-sheet:close");

                    overlay.removeClass("zn-active");

                    overlay.one(transPrefix, function() {
                        overlay.remove();
                    });

                }

                function open() {

                    if (!sheet.hasClass("zn-active")) {

                        var id = rid();

                        var overlay = $("<div class='zn-bottom-sheet-overlay' id='" + id + "'></div>"),
                            z = sheet.css("zIndex");

                        sheet.css("box-shadow", "");

                        sheet.show();

                        bottomSheetHeightCheck(sheet);

                        sheet.css("zIndex");

                        sheet.addClass("zn-active");

                        sheet.trigger("bottom-sheet:open");

                        sheet.attr("zn-id", id);

                        overlay.css("zIndex", z);

                        overlay.prependTo("body");

                        overlay.css("zIndex");

                        overlay.addClass("zn-active");

                        overlay.click(function () {
                            close(overlay);
                        });

                    }

                }

                switch (method) {

                    default:
                        open();
                        break;

                    case "open":
                        open();
                        break;

                    case "close":
                        close($(prevId));
                        break;

                }

            });

        };

        $(document).on("mousedown touchstart", ".zn-bottom-sheet:not(.zn-full-height)", function(a) {

            var sheet = $(this),
                startPos = a.pageY,
                oPos = parseFloat(sheet.css("bottom")),
                toMove;

            if (isUndefined(a.originalEvent.touches) === false) {
                startPos = a.originalEvent.touches[0].pageY;
            }

            $(document).on("mousemove.znBottomSheetsMove touchmove.znBottomSheetsMove", function(b) {

                var movePos = b.pageY;

                if (isUndefined(b.originalEvent.touches) === false) {
                    movePos = b.originalEvent.touches[0].pageY;
                }

                sheet.children().css("pointer-events", "none");

                var distance = movePos - startPos; //Calculate distance between mousedown and mousemove

                toMove = oPos - distance; //Calculate the new position

                if ((distance <= 0 && toMove <= 0 && oPos !== 0) || distance >= 0) sheet.css("bottom", toMove); //If swipe and the sheet is not full shown
                    //Swipe up = distance negative as long as position is not larger than 0 and bottom is not equal 0
                    //Swipe down if distance positive

            });

            function move() {

                if (toMove > oPos) { //If new position > original position
                    sheet.animate({ //Move sheet up to fully show it
                        bottom: 0
                    }, Math.abs(oPos) / 2);
                } else if (toMove < oPos) {
                    sheet.bottomSheet("close"); //Close the sheet
                }

                sheet.children().css("pointer-events", "");

                $(document).off("mousemove.znBottomSheetsMove touchmove.znBottomSheetsMove mouseup touchend");

            }

            $(document).on("mouseup touchend", function() {

                move();

            })

        });

        $(document).on("click", "[zn-bottom-sheet]", function() {

            var trigger = $(this),
                arr = JSON.parse(trigger.attr("zn-bottom-sheet"));

            var method = arr[0].trim(),
                el = arr[1].trim();

            $(el).bottomSheet(method);

        });


        //SNACKBAR

        /*$.extend({

            snackbar: function(options) {

                var defaults = {
                    content: "",
                    duration: 2400,
                    position: "left",
                    offset: 0,
                    action: false,
                    actionText: "",
                    actionClass: "zn-accent",
                    onCanceled: function() {},
                    onAction: function() {},
                };

                var settings = $.extend({}, defaults, options);

                return $(this).each(function() {

                    var content = settings.content.trim(), //Get settings
                        duration = settings.duration,
                        position = settings.position.trim(),
                        offset = settings.offset,
                        action = settings.action,
                        actionText = settings.actionText.trim(),
                        actionClass = settings.actionClass.trim();

                    var html = //Snackbar's HTML
                        '<div class="zn-snackbar-wrapper">' +

                        '<div class="zn-snackbar">' +

                        '<div class="zn-snackbar-text">' +
                        '<p>' + content + '</p>' +
                        '</div>' +

                        '<button class="zn-snackbar-action zn-button ' + actionClass + '" tabindex="-1" zn-ripple="false">' +
                        '<span>' + actionText + '</span>' +
                        '</button>' +

                        '</div>' +

                        '</div>';

                    var snackbarWrap = $(html),
                        snackbar = snackbarWrap.find(".zn-snackbar"),
                        actionBtn = snackbar.find(".zn-snackbar-action"),
                        text = snackbar.find(".zn-snackbar-text");

                    if (action === false) actionBtn.remove(); //Check if snackbar has action

                    if (position === "center") snackbarWrap.addClass("zn-snackbar-center"); //Check direction


                    snackbarWrap.prependTo("body");

                    snackbarWrap.css({
                        bottom: offset
                    });

                    snackbarWrap.css("zIndex"); //Force redraw

                    var height = snackbar.height(); //Get height of snackbar

                    function animate() {

                        var textHeight = text.height(), //Get text height
                            textLineHeight = parseInt(text.css("line-height")), //Get line height
                            lines = textHeight / textLineHeight; //Get line count

                        (lines >= 2) ? snackbarWrap.addClass("zn-snackbar-two-line"): snackbarWrap.removeClass("zn-snackbar-two-line"); //Check if it has more than 1 line

                        height = snackbar.height(); //Get height of snackbar

                    }

                    animate();

                    function snackbarShow() { //Show snackbar

                        snackbarWrap.addClass("zn-show");

                        $(".zn-snackbar-animator").css({
                            transform: "translateY(-" + (height + offset) + "px)" //Transform target by -1 * height by Y axis
                        }).addClass("zn-animated");

                    }

                    var curSnackbar = $(".zn-snackbar-wrapper.zn-show").not(snackbarWrap); //Get current active snackbar on the screen

                    if (curSnackbar.length > 0) { //If is there any current snackbars on the screen

                        curSnackbar.trigger("zn-snackbar:replace"); //Trigger's current snackbar canceled event

                        curSnackbar.one(transPrefix, function() {
                            snackbarShow();
                        });


                    } else {
                        snackbarShow();
                    }

                    var timeOut = setTimeout(function() { //Set delayed remove

                        snackbarCancel();

                    }, duration);

                    snackbarWrap.on("zn-snackbar:replace", function() { //Bind canceled event to snackbar

                        clearTimeout(timeOut);

                        snackbarCancel();

                    });

                    actionBtn.one("click", function() { //On action click

                        snackbarCancel(settings.onAction);

                        clearTimeout(timeOut);

                    });

                    function snackbarCancel(type, callback) { //Cancel logic

                        snackbarWrap.removeClass("zn-show");

                        if (!type) type = settings.onCanceled; //Init type

                        if (!callback) callback = function() {}; //Init callback

                        type.call(this);

                        $(".zn-snackbar-animator").css({ //Reset transform
                            transform: ""
                        }).removeClass("zn-animated");

                        snackbarWrap.one(transPrefix, function() {
                            snackbarWrap.remove();
                            callback.call(this);
                        });

                    }

                    if (snackbarWrap.hasClass("zn-active")) timeOut; //Call delay if it is shown

                    $(window).resize(function() {
                        animate();
                        snackbarShow();
                    });

                });

            }

        });*/

        Zinc.snackbar = function(options) {

            var defaults = {
                content: "",
                duration: 2400,
                position: "left",
                //offset: 0,
                action: false,
                actionText: "",
                actionClass: "zn-accent",
                onCanceled: function() {},
                onAction: function() {},
            };

            var settings = $.extend({}, defaults, options);

            return $(this).each(function() {

                var content = settings.content.trim(), //Get settings
                    duration = settings.duration,
                    position = settings.position.trim(),
                    //offset = settings.offset,
                    action = settings.action,
                    actionText = settings.actionText.trim(),
                    actionClass = settings.actionClass.trim();

                var html = //Snackbar's HTML
                    '<div class="zn-snackbar-wrapper">' +

                    '<div class="zn-snackbar">' +

                    '<div class="zn-snackbar-text">' +
                    '<p>' + content + '</p>' +
                    '</div>' +

                    '<button class="zn-snackbar-action zn-button ' + actionClass + '" tabindex="-1" zn-ripple="false">' +
                    '<span>' + actionText + '</span>' +
                    '</button>' +

                    '</div>' +

                    '</div>';

                var snackbarWrap = $(html),
                    snackbar = snackbarWrap.find(".zn-snackbar"),
                    actionBtn = snackbar.find(".zn-snackbar-action"),
                    text = snackbar.find(".zn-snackbar-text");

                if (action === false) actionBtn.remove(); //Check if snackbar has action

                if (position === "center") snackbarWrap.addClass("zn-snackbar-center"); //Check direction


                snackbarWrap.prependTo("body");

                /*snackbarWrap.css({
                    bottom: offset
                });*/

                snackbarWrap.css("zIndex"); //Force redraw

                var height = snackbar.height(); //Get height of snackbar

                function animate() {

                    var textHeight = text.height(), //Get text height
                        textLineHeight = parseInt(text.css("line-height")), //Get line height
                        lines = textHeight / textLineHeight; //Get line count

                    (lines >= 2) ? snackbarWrap.addClass("zn-snackbar-two-line"): snackbarWrap.removeClass("zn-snackbar-two-line"); //Check if it has more than 1 line

                    height = snackbar.height(); //Get height of snackbar

                }

                animate();

                function snackbarShow() { //Show snackbar

                    snackbarWrap.addClass("zn-show");

                    $(".zn-snackbar-animator").css({
                        transform: "translateY(-" + (height + offset) + "px)" //Transform target by -1 * height by Y axis
                    }).addClass("zn-animated");

                }

                var curSnackbar = $(".zn-snackbar-wrapper.zn-show").not(snackbarWrap); //Get current active snackbar on the screen

                if (curSnackbar.length > 0) { //If is there any current snackbars on the screen

                    curSnackbar.trigger("zn-snackbar:replace"); //Trigger's current snackbar canceled event

                    curSnackbar.one(transPrefix, function() {
                        snackbarShow();
                    });

                } else {
                    snackbarShow();
                }

                var timeOut = setTimeout(function() { //Set delayed remove

                    snackbarCancel();

                }, duration);

                snackbarWrap.on("zn-snackbar:replace", function() { //Bind canceled event to snackbar

                    clearTimeout(timeOut);

                    snackbarCancel();

                });

                actionBtn.one("click", function() { //On action click

                    snackbarCancel(settings.onAction);

                    clearTimeout(timeOut);

                });

                function snackbarCancel(type, callback) { //Cancel logic

                    snackbarWrap.removeClass("zn-show");

                    if (!type) type = settings.onCanceled; //Init type

                    if (!callback) callback = function() {}; //Init callback

                    type.call(this);

                    $(".zn-snackbar-animator").css({ //Reset transform
                        transform: ""
                    }).removeClass("zn-animated");

                    snackbarWrap.one(transPrefix, function() {
                        snackbarWrap.remove();
                        callback.call(this);
                    });

                }

                if (snackbarWrap.hasClass("zn-active")) timeOut; //Call delay if it is shown

                $(window).resize(function() {
                    animate();
                    snackbarShow();
                });

            });

        };


        //SPINNER

        Zinc.spinner = function(options) {

            var defaults = {
                class: "zn-primary",
                size: "normal"
            };

            var settings = $.extend({}, defaults, options);

            return $(this).each(function() {



            });

        }


        //TOOLTIP

        $(document).on("mouseenter", "[zn-tooltip]", function () {

            var target = $(this);

            var text = target.attr("zn-tooltip").trim(),
                pos = target.attr("zn-tooltip-position").trim();

            var id = rid();

            target.attr("zn-tooltip-by", id);

            var posX = target.offset().left,
                posY = target.offset().top,
                targetWidth = target.outerWidth(),
                targetHeight = target.outerHeight();

            var tooltip = $("<div class='zn-tooltip' zn-id='" + id + "'><p>" + text + "</p></div>");

            tooltip.prependTo("body");

            var width = tooltip.outerWidth(),
                height = tooltip.outerHeight();

            var margin = 14;

            var winX = $(window).width(),
                winY = $(window).height();

            if ( winX <= 720 ) margin = 24;

            var x = posX + targetWidth / 2 - width / 2,
                y = posY - height - margin;

            switch (pos) {

                default:
                    tooltip.addClass("zn-top");
                    break;

                case "left":
                    tooltip.addClass("zn-left");
                    x = posX - width - margin
                    y = posY + targetHeight / 2 - height / 2;
                    break;

                case "right":
                    tooltip.addClass("zn-right");
                    x = posX + targetWidth + margin;
                    y = posY + targetHeight / 2 - height / 2;
                    break;

                case "bottom":
                    tooltip.addClass("zn-bottom");
                    y = posY + targetHeight + margin;
                    break;

            }

            tooltip.css({
                transition: "0s"
            });

            tooltip.css({
                top: y,
                left: x
            });

            if ( popupManager.offscreen("left", tooltip) && ["top, bottom"].indexOf(pos) > -1 ) {

                tooltip.css({
                    left: 8
                });

            }

            if ( popupManager.offscreen("right", tooltip) && ["top, bottom"].indexOf(pos) > -1 ) {

                tooltip.css({
                    left: winX - width - 8
                });

            }

            tooltip.css({
                transition: ""
            });

            tooltip.css("zIndex");

            tooltip.addClass("zn-show");

            //END TOOLTIP
            target.one("mouseleave click", function (e) {

                tooltip.removeClass("zn-show");

                tooltip.one(transPrefix, function() {
                    tooltip.remove();
                });

            });

        })


        //SERVICE

        $(window).resize(function() {

            sideNavPermanentCheck();

            dialogRestyleCheck();

            bottomSheetHeightCheck();

            resizeIndicators();

            setCollapsibleHeight();

        });

        (function zincAutoInit() {

            sideNavPermanentCheck();

            dialogRestyleCheck();

            bottomSheetHeightCheck();

            setCollapsibleHeight();


            $(".zn-tabs").tabs();
            $(".zn-bottom-navbar").bottomNavbar();

            cloak.remove();

        })();

    });

}(jQuery));
