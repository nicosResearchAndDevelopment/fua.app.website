(() => {
    const style = document.body.style;

    function setSize() {
        style.setProperty('--vw', window.innerWidth);
        style.setProperty('--vh', window.innerHeight);
        style.setProperty('--pw', document.body.offsetWidth);
        style.setProperty('--ph', document.body.offsetHeight);
    }

    function setPosition() {
        style.setProperty('--px', window.pageXOffset);
        style.setProperty('--py', window.pageYOffset);
    }

    function setSizeAndPosition() {
        setSize();
        setPosition();
    }

    window.addEventListener('scroll', setPosition);
    window.addEventListener('resize', setSize);
    window.addEventListener('load', setSizeAndPosition);
    setSizeAndPosition();
})();
