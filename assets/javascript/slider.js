var gameSlider = $(".game-slider");
var iframes = gameSlider.find(".embed-player");

var appSlider = $(".app-slider");
var images = appSlider.find(".slide-image");
var imageCounter = 0;

// When the slide is changing
function playPauseVideo(slick, control) {
  var currentSlide = slick.find(".slick-current");
  var player = currentSlide.find("iframe").get(0);

  switch (control) {
    case "play":
      player.contentWindow.postMessage(JSON.stringify({
        "event": "command",
        "func": "mute"
      }), "*");
      player.contentWindow.postMessage(JSON.stringify({
        "event": "command",
        "func": "playVideo"
      }), "*");
      break;
    case "pause":
      player.contentWindow.postMessage(JSON.stringify({
        "event": "command",
        "func": "pauseVideo"
      }), "*");
      break;
  }
}

// Resize player
function resizePlayer(slides) {
  if (!slides[0]) return;
  var win = $(".game-slider"),
    width = win.width(),
    height = win.height(),
    ratio = 16 / 9;

  slides.each(function() {
    var current = $(this);
    if (width / height < ratio) {
      var playerHeight = Math.ceil(width / ratio);
      current.width(width).height(playerHeight).css({
        left: 0,
        top: (height - playerHeight) / 2
      });
      win.width(width).height(playerHeight);
    } else {
      var playerWidth = Math.ceil(height * ratio);
      current.width(playerWidth).height(height).css({
        left: (width - playerWidth) / 2,
        top: 0
      });
      win.width(playerWidth).height(height);
    }
  });
}

// DOM Ready
$(function() {
  // Initialize
  resizePlayer(iframes);
  resizePlayer(images);

  gameSlider.on("init", function(slick) {
    slick = $(slick.currentTarget);
    setTimeout(function() {
      playPauseVideo(slick, "play");
    }, 1000);
  });
  gameSlider.on("beforeChange", function(event, slick) {
    slick = $(slick.$slider);
    playPauseVideo(slick, "pause");
  });
  gameSlider.on("afterChange", function(event, slick) {
    slick = $(slick.$slider);
    playPauseVideo(slick, "play");
  });

  //start the slider
  gameSlider.slick({
    // fade:true,
    autoplaySpeed: 4000,
    lazyLoad: "progressive",
    speed: 600,
    arrows: true,
    dots: true,
    cssEase: "cubic-bezier(0.87, 0.03, 0.41, 0.9)"
  });

  appSlider.on("lazyLoaded", function(event, slick, image, imageSource) {
    imageCounter++;
    if (imageCounter === images.length) {
      images.addClass('show');
    }
  });
  appSlider.slick({
    autoplaySpeed: 4000,
    lazyLoad: "progressive",
    speed: 600,
    arrows: true,
    dots: true,
    cssEase: "cubic-bezier(0.87, 0.03, 0.41, 0.9)"
  });
});

$(window).on("load resize", function() {
  resizePlayer(iframes);
  resizePlayer(images);
});
