// 풀페이지
var introVideo = document.getElementById("introVideo");

if (introVideo) {
	introVideo.load();
}

var myFullpage = new fullpage('#fullpage', {
	verticalCentered: true,
	anchors: ['anchor1', 'anchor2', 'anchor3', 'anchor4', 'anchor5'],
	menu: '#menu',
	scrollOverflow: false,
	scrollingSpeed: 700,
	navigation: true,
	navigationPosition: 'right',
	navigationTooltips: ['1', '2', '3', '4', '5'],
	responsiveWidth: 999,

	afterRender: function () {
		if (introVideo) {
			introVideo.play().catch(function () { });
		}
	},

	onLeave: function (origin, destination, direction) {
		if (!introVideo) return;

		/* 다른 섹션에서 section1로 다시 올라올 때만 */
		if (destination.anchor === 'anchor1' && origin.anchor !== 'anchor1') {
			introVideo.currentTime = 0;
			introVideo.play().catch(function () { });
		}
	},

	afterLoad: function (origin, destination, direction) {
		if (!introVideo) return;

		if (destination.anchor === 'anchor1') {
			introVideo.play().catch(function () { });
		}
	},

	afterResponsive: function (isResponsive) {

	}
});

document.addEventListener("visibilitychange", function () {
	if (!document.hidden && introVideo && fullpage_api.getActiveSection().anchor === 'anchor1') {
		introVideo.currentTime = 0;
		introVideo.play().catch(function () { });
	}
});


// 팝업
$(function () {
	$('.art1').click(function () {
		$('.pop1').fadeIn();
	});
	$('.art2').click(function () {
		$('.pop2').fadeIn();
	});
	$('.art3').click(function () {
		$('.pop3').fadeIn();
	});

	$('.popup p').click(function () {
		$('.popup').fadeOut();
	});
});

// 팝업 슬라이드
$(function () {
	var swiper = new Swiper('.popup_slide', {
		speed: 1000,
		navigation: {
			nextEl: '.popup .swiper-button-next',
			prevEl: '.popup .swiper-button-prev',
		},
		pagination: {
			el: '.popup .swiper-pagination',
			clickable: true,
		},
	});
});

// 스킬 차트
window.addEventListener('load', function () {
	const charts = document.querySelectorAll('.chart');

	charts.forEach(function (chart, index) {
		const circle = chart.querySelector('.chart_circle');
		const title = chart.querySelector('.title b');
		const target = parseInt(chart.getAttribute('data-percent'), 10) || 0;

		let current = 0;

		setTimeout(function () {
			const timer = setInterval(function () {
				current++;

				const deg = (current / 100) * 360;
				circle.style.background = 'conic-gradient(#14804e 0deg ' + deg + 'deg, #fdfdfd ' + deg + 'deg 360deg)';
				title.textContent = current + '%';

				if (current >= target) {
					clearInterval(timer);
				}
			}, 18);
		}, index * 120);
	});
});

$(function () {
  var popupSwipers = {};

  function disableFullpageScroll() {
    if (typeof fullpage_api !== 'undefined') {
      fullpage_api.setAllowScrolling(false);
      fullpage_api.setKeyboardScrolling(false);
    }
  }

  function enableFullpageScroll() {
    if (typeof fullpage_api !== 'undefined') {
      fullpage_api.setAllowScrolling(true);
      fullpage_api.setKeyboardScrolling(true);
    }
  }

  function openPopup(targetClass) {
    var $popup = $('.' + targetClass);

    $popup.stop(true, true).fadeIn(200);
    disableFullpageScroll();

    if (!popupSwipers[targetClass]) {
      popupSwipers[targetClass] = new Swiper('.' + targetClass + ' .popup_swiper', {
        loop: true,
        speed: 600,
        slidesPerView: 1,
        spaceBetween: 0,
        pagination: {
          el: '.' + targetClass + ' .swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.' + targetClass + ' .swiper-button-next',
          prevEl: '.' + targetClass + ' .swiper-button-prev'
        }
      });
    } else {
      popupSwipers[targetClass].update();
    }
  }

  function closePopup($popup) {
    $popup.stop(true, true).fadeOut(200);
    enableFullpageScroll();
  }

  $('.open-popup').on('click', function (e) {
    e.preventDefault();
    var targetPopup = $(this).data('popup');
    openPopup(targetPopup);
  });

  $('.popup_close').on('click', function () {
    closePopup($(this).closest('.popup'));
  });

  $('.popup').on('click', function (e) {
    if ($(e.target).hasClass('popup')) {
      closePopup($(this));
    }
  });

  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      closePopup($('.popup:visible'));
    }
  });
});