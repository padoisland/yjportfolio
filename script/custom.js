// 풀페이지
var introVideo = document.getElementById("introVideo");

if (introVideo) {
	introVideo.load();
}

var skillTimers = [];
var responsiveSkillObserver = null;
var responsiveSkillEntered = false;

function clearSkillTimers() {
	skillTimers.forEach(function (timer) {
		clearTimeout(timer);
	});
	skillTimers = [];
}

function getSkillBars() {
	return document.querySelectorAll('.skill_bar_fill');
}

function resetSkillBars(forceReflow) {
	clearSkillTimers();

	getSkillBars().forEach(function (bar) {
		bar.style.transition = 'none';
		bar.style.width = '0';

		if (forceReflow) {
			bar.offsetWidth;
		}

		bar.style.transition = 'width 1.2s ease';
	});
}

function playSkillBars() {
	clearSkillTimers();

	getSkillBars().forEach(function (bar, index) {
		var target = parseInt(bar.getAttribute('data-width'), 10) || 0;

		var timer = setTimeout(function () {
			bar.style.width = target + '%';
		}, index * 120);

		skillTimers.push(timer);
	});
}

function restartSkillBars() {
	resetSkillBars(true);

	var starter = setTimeout(function () {
		playSkillBars();
	}, 80);

	skillTimers.push(starter);
}

function setupResponsiveSkillAnimation() {
	if (responsiveSkillObserver) {
		responsiveSkillObserver.disconnect();
		responsiveSkillObserver = null;
	}

	responsiveSkillEntered = false;

	if (window.innerWidth > 999) {
		return;
	}

	var section5 = document.getElementById('section5');

	if (!section5 || !('IntersectionObserver' in window)) {
		return;
	}

	responsiveSkillObserver = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
				if (!responsiveSkillEntered) {
					responsiveSkillEntered = true;
					restartSkillBars();
				}
			} else if (entry.intersectionRatio <= 0.12) {
				responsiveSkillEntered = false;
			}
		});
	}, {
		threshold: [0, 0.12, 0.55, 0.8]
	});

	responsiveSkillObserver.observe(section5);
}

var myFullpage = new fullpage('#fullpage', {
	verticalCentered: true,
	anchors: ['anchor1', 'anchor2', 'anchor3', 'anchor4', 'anchor5', 'anchor6'],
	menu: '#menu',
	scrollOverflow: false,
	scrollingSpeed: 700,
	navigation: true,
	navigationPosition: 'right',
	navigationTooltips: ['1', '2', '3', '4', '5', '6'],
	responsiveWidth: 999,

	afterRender: function () {
		if (introVideo) {
			introVideo.play().catch(function () { });
		}

		resetSkillBars(false);
		setupResponsiveSkillAnimation();
	},

	onLeave: function (origin, destination, direction) {
		if (!introVideo) return;

		if (destination.anchor === 'anchor1' && origin.anchor !== 'anchor1') {
			introVideo.currentTime = 0;
			introVideo.play().catch(function () { });
		}
	},

	afterLoad: function (origin, destination, direction) {
		if (introVideo && destination.anchor === 'anchor1') {
			introVideo.play().catch(function () { });
		}

		if (destination.anchor === 'anchor5' && window.innerWidth > 999) {
			restartSkillBars();
		}
	},

	afterResponsive: function (isResponsive) {
		setupResponsiveSkillAnimation();
	}
});

document.addEventListener("visibilitychange", function () {
	if (!document.hidden && introVideo && typeof fullpage_api !== 'undefined' && fullpage_api.getActiveSection() && fullpage_api.getActiveSection().anchor === 'anchor1') {
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

window.addEventListener('load', function () {
	setupResponsiveSkillAnimation();
});

window.addEventListener('resize', function () {
	setupResponsiveSkillAnimation();
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
