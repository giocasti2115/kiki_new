/* Scripts en línea de footer.php (importados por scripts/import-wp.mjs). */
document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".trusted-card");
    cards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            cards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const stacks = document.querySelectorAll(".services-stack-section");
  const animationDuration = 600;

  const setWrapperHeight = (wrapper, panel) => {
    if (!wrapper || !panel) return;
    wrapper.style.height = `${panel.offsetHeight}px`;
  };

  const isElementInViewport = (element) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  stacks.forEach(stack => {
    const tabs = Array.from(stack.querySelectorAll(".services-tab"));
    const panels = Array.from(stack.querySelectorAll(".services-panel"));
    const panelsWrapper = stack.querySelector(".services-panels");
    if (!tabs.length || !panels.length || !panelsWrapper) return;

    if (!tabs.some(tab => tab.classList.contains("active"))) {
      tabs[0].classList.add("active");
    }

    const initialPanel = stack.querySelector(".services-panel.active") || panels[0];
    if (initialPanel && !initialPanel.classList.contains("active")) {
      initialPanel.classList.add("active");
    }
    setWrapperHeight(panelsWrapper, initialPanel);

    const activatePanel = (newIndex, forcedDirection) => {
      if (newIndex < 0 || newIndex >= tabs.length) return;

      const currentIndex = tabs.findIndex(t => t.classList.contains("active"));
      if (newIndex === currentIndex) return;

      const direction = forcedDirection || (currentIndex === -1 || newIndex > currentIndex ? "down" : "up");
      const currentPanel = currentIndex >= 0 ? panels[currentIndex] : null;
      const nextPanel = panels[newIndex];
      if (!nextPanel) return;

      tabs.forEach(t => t.classList.remove("active"));
      tabs[newIndex].classList.add("active");

      panelsWrapper.classList.add("is-animating");

      if (currentPanel) {
        const leaveClass = direction === "down" ? "slide-forward-leave" : "slide-backward-leave";
        currentPanel.classList.add(leaveClass);
        setTimeout(() => {
          currentPanel.classList.remove("slide-forward-leave", "slide-backward-leave", "active");
        }, animationDuration);
      }

      const enterClass = direction === "down" ? "slide-forward-enter" : "slide-backward-enter";
      nextPanel.classList.add(enterClass, "is-entering");
      requestAnimationFrame(() => {
        nextPanel.classList.add("active");
        setWrapperHeight(panelsWrapper, nextPanel);
      });
      setTimeout(() => {
        nextPanel.classList.remove("slide-forward-enter", "slide-backward-enter", "is-entering");
        panelsWrapper.classList.remove("is-animating");
      }, animationDuration);
    };

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const activePanel = stack.querySelector(".services-panel.active");
        setWrapperHeight(panelsWrapper, activePanel);
      }, 150);
    });

    tabs.forEach((tab, newIndex) => {
      tab.addEventListener("click", () => {
        activatePanel(newIndex);
      });
    });

    if (stack.id === "servicios-stack-alt") {
      let scrollLock = false;
      let touchStartY = null;

      const triggerScrollNavigation = (direction) => {
        if (scrollLock) return false;
        const currentIndex = tabs.findIndex(t => t.classList.contains("active"));
        if (currentIndex === -1) return false;

        let targetIndex = currentIndex + direction;
        if (targetIndex < 0) {
          targetIndex = tabs.length - 1;
        } else if (targetIndex >= tabs.length) {
          targetIndex = 0;
        }
        if (targetIndex === currentIndex) return false;

        scrollLock = true;
        activatePanel(targetIndex, direction > 0 ? "down" : "up");
        setTimeout(() => {
          scrollLock = false;
        }, animationDuration + 150);
        return true;
      };

      stack.addEventListener("wheel", (event) => {
        if (!isElementInViewport(stack)) return;
        if (Math.abs(event.deltaY) < 6) return;
        const direction = event.deltaY > 0 ? 1 : -1;
        const navigated = triggerScrollNavigation(direction);
        if (navigated) {
          event.preventDefault();
        }
      }, { passive: false });

      stack.addEventListener("touchstart", (event) => {
        if (event.touches.length !== 1) return;
        touchStartY = event.touches[0].clientY;
      }, { passive: true });

      stack.addEventListener("touchmove", (event) => {
        if (touchStartY === null) return;
        const currentY = event.touches[0].clientY;
        const deltaY = touchStartY - currentY;
        if (Math.abs(deltaY) < 25) return;
        const direction = deltaY > 0 ? 1 : -1;
        const navigated = triggerScrollNavigation(direction);
        if (navigated) {
          event.preventDefault();
          touchStartY = currentY;
        }
      }, { passive: false });

      stack.addEventListener("touchend", () => {
        touchStartY = null;
      });
    }
  });
});
