var counter = document.querySelectorAll(".counter");

window.addEventListener("load", function() {
  counter.forEach(function(k) {
    // Convert attributes to integers
    var start = parseInt(k.getAttribute('data-count-start'));
    var end = parseInt(k.getAttribute('data-count-end'));
    var speed = parseInt(k.getAttribute('data-speed'));

    // Create a function to increment the counter
    var interval = setInterval(function() {
      start++;
      if (start > end) {
        clearInterval(interval); // Stop interval when count is reached
        return;
      }
      k.innerText = start; // Update the counter value
    }, speed);
  });
}, false);

$('.menu').on('click', function() {
  $('.overlay').show();
  $('nav').toggleClass("open");
});

$('.overlay').on('click', function() {
  if ($('nav').hasClass('open')) {
    $('nav').removeClass('open');
  }
  $(this).hide();
});

document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector("header");
  if (!header) {
    return;
  }

  const toggleHeaderState = function () {
    if (window.scrollY > 8) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  };

  toggleHeaderState();
  window.addEventListener("scroll", toggleHeaderState);
});

document.addEventListener("DOMContentLoaded", function () {
  const mapping = [
    { triggerId: "nav-soluciones", menuId: "mega-soluciones" },
    { triggerId: "nav-servicios", menuId: "mega-servicios" },
    { triggerId: "nav-casos", menuId: "mega-casos" },
    { triggerId: "nav-para-quien", menuId: "mega-para-quien" },
    { triggerId: "nav-cobertura", menuId: "mega-cobertura" },
    { triggerId: "nav-recursos", menuId: "mega-recursos" }
  ];

  const desktopQuery = window.matchMedia("(min-width: 992px)");
  let openMenu = null;
  let openItem = null;
  let closeTimer = null;

  function closeMegaMenu() {
    if (openMenu) {
      openMenu.style.display = "none";
    }
    if (openItem) {
      openItem.classList.remove("active");
      const link = openItem.querySelector(".nav-link");
      if (link) {
        link.setAttribute("aria-expanded", "false");
      }
    }
    openMenu = null;
    openItem = null;
  }

  function showMegaMenu(item, menu) {
    if (openMenu === menu) {
      return;
    }
    closeMegaMenu();
    menu.style.display = "block";
    item.classList.add("active");
    const link = item.querySelector(".nav-link");
    if (link) {
      link.setAttribute("aria-expanded", "true");
    }
    openMenu = menu;
    openItem = item;
  }

  function scheduleClose() {
    if (closeTimer) {
      clearTimeout(closeTimer);
    }
    closeTimer = setTimeout(function () {
      closeMegaMenu();
      closeTimer = null;
    }, 120);
  }

  function cancelClose() {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  mapping.forEach(function ({ triggerId, menuId }) {
    const item = document.getElementById(triggerId);
    const menu = document.getElementById(menuId);
    if (!item || !menu) {
      return;
    }
    const link = item.querySelector(".nav-link");
    if (!link) {
      return;
    }

    item.addEventListener("mouseenter", function () {
      if (!desktopQuery.matches) {
        return;
      }
      cancelClose();
      showMegaMenu(item, menu);
    });

    item.addEventListener("mouseleave", function () {
      if (!desktopQuery.matches) {
        return;
      }
      scheduleClose();
    });

    menu.addEventListener("mouseenter", cancelClose);
    menu.addEventListener("mouseleave", function () {
      if (desktopQuery.matches) {
        scheduleClose();
      }
    });

    link.addEventListener("click", function (e) {
      e.preventDefault();
      if (desktopQuery.matches) {
        cancelClose();
        showMegaMenu(item, menu);
        return;
      }

      if (openMenu === menu) {
        closeMegaMenu();
      } else {
        showMegaMenu(item, menu);
      }
    });
  });

  document.querySelectorAll(".mega-menu a").forEach(function (anchor) {
    anchor.addEventListener("click", function () {
      closeMegaMenu();
    });
  });

  document.addEventListener("click", function (event) {
    if (!openMenu) {
      return;
    }
    const clickedInside = openMenu.contains(event.target) || (openItem && openItem.contains(event.target));
    if (!clickedInside) {
      closeMegaMenu();
    }
  });

  window.addEventListener("scroll", closeMegaMenu);

  var handleQueryChange = function () {
    closeMegaMenu();
  };

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", handleQueryChange);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(handleQueryChange);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const integrationCards = document.querySelectorAll(".integration-card");
  if (!integrationCards.length) {
    return;
  }

  let currentIndex = 0;
  let intervalId = null;

  function setActiveCard(index) {
    integrationCards.forEach(function (card) {
      card.classList.remove("active");
    });
    integrationCards[index].classList.add("active");
  }

  function startCycle() {
    if (intervalId) {
      return;
    }
    intervalId = setInterval(function () {
      currentIndex = (currentIndex + 1) % integrationCards.length;
      setActiveCard(currentIndex);
    }, 2800);
  }

  function stopCycle() {
    if (!intervalId) {
      return;
    }
    clearInterval(intervalId);
    intervalId = null;
  }

  integrationCards.forEach(function (card, index) {
    card.addEventListener("mouseenter", function () {
      stopCycle();
      currentIndex = index;
      setActiveCard(index);
    });

    card.addEventListener("mouseleave", function () {
      startCycle();
    });

    card.addEventListener("focusin", function () {
      stopCycle();
      currentIndex = index;
      setActiveCard(index);
    });

    card.addEventListener("focusout", function () {
      startCycle();
    });
  });

  setActiveCard(0);
  startCycle();

  window.addEventListener("blur", stopCycle);
  window.addEventListener("focus", function () {
    startCycle();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const scrollButton = document.querySelector(".scroll-top-btn");
  const heroSection = document.getElementById("hero");
  if (!scrollButton || !heroSection) {
    return;
  }

  const toggleScrollButton = function () {
    if (window.scrollY > heroSection.offsetHeight * 0.6) {
      scrollButton.classList.add("is-visible");
    } else {
      scrollButton.classList.remove("is-visible");
    }
  };

  toggleScrollButton();
  window.addEventListener("scroll", toggleScrollButton);

  scrollButton.addEventListener("click", function (event) {
    event.preventDefault();
    heroSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
