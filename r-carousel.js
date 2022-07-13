const isDraggable = true;
        const CLASS_NAME = {
            CONTAINER: ".r-carousel",
            WRAPPER: ".wrapper",
            SLIDE: ".slide",
            BTN_NEXT: ".btn-next",
            BTN_PREV: ".btn-prev",
            DOTS: ".dots",
            ACTIVE: "active",
            ANIMATION: "animation"
        }
        // Declare variables for DOM elements
        var CAROUSEL, WRAPPER, SLIDES, BTN_NEXT, BTN_PREV, DOTS;
        // Init wrapper's x coord, width of a single Carousel's item width
        var initX, curX, slideWidth, totalWidth, offsetIndex;
        // Declare Index of Carousel Items, and max count
        var curIndex, maxIndex;

        // Custom Variables
        var slideMargin, rollSpeed;


        function initial(){
            // Sign DOM to variables
            CAROUSEL = document.querySelector(CLASS_NAME.CONTAINER);
            WRAPPER = document.querySelector(`${CLASS_NAME.CONTAINER} ${CLASS_NAME.WRAPPER}`);
            SLIDES = document.querySelectorAll(`${CLASS_NAME.CONTAINER} ${CLASS_NAME.WRAPPER} ${CLASS_NAME.SLIDE}`);
            BTN_NEXT = document.querySelector(`${CLASS_NAME.CONTAINER} ${CLASS_NAME.BTN_NEXT}`);
            BTN_PREV = document.querySelector(`${CLASS_NAME.CONTAINER} ${CLASS_NAME.BTN_PREV}`);
            // Add btn click events
            BTN_NEXT.addEventListener("click", () => { rolling(1, false) });
            BTN_PREV.addEventListener("click", () => { rolling(-1, false) });

            // Add animation classname to doing transition
            WRAPPER.classList.add(CLASS_NAME.ANIMATION);

            curIndex = 0;
            maxIndex = SLIDES.length - 1;
            offsetIndex = 0;
            slideMargin = 0;
            // setting single item width (need plus margin width)
            slideWidth = document.querySelector(`${CLASS_NAME.CONTAINER} ${CLASS_NAME.WRAPPER} ${CLASS_NAME.SLIDE}`).clientWidth + (slideMargin * 2);
            totalWidth = slideWidth * maxIndex;
            SLIDES.forEach((el) => {
                el.style.margin = `auto ${slideMargin}px`;
            });

            // Init default coord of wrapper
            resizeCarousel();
            // Add mouse events
            //addTouchEvents();
            addMouseEvents();
            // Show Dots
            generateDots();
        }

        
        function addTouchEvents(){
            if(isDraggable){
                CAROUSEL.addEventListener("dragstart", (event) => {
                    return false;
                });

                CAROUSEL.addEventListener("touchstart", (event) => {

                    let clickX = event.targetTouches[0].clientX - CAROUSEL.clientLeft;
                    function onMouseMove(event) {
                        WRAPPER.classList.remove(CLASS_NAME.ANIMATION);
                        setWrapperX(event.targetTouches[0].pageX - clickX + curX - ((curIndex) * slideWidth));
                        offsetIndex = Math.round(getOffsetIndex(clickX, event.targetTouches[0].clientX));
                    }

                    CAROUSEL.addEventListener('touchmove', onMouseMove);

                    CAROUSEL.addEventListener("touchend", (event) => {
                        CAROUSEL.removeEventListener('touchmove', onMouseMove);
                    });

                });

                
                CAROUSEL.addEventListener("touchend", (event) => {

                    rolling(-offsetIndex, false);
                    offsetIndex = 0;
                    WRAPPER.classList.add(CLASS_NAME.ANIMATION);
                });
            }
        }


        function addMouseEvents(){
            if(isDraggable){
                CAROUSEL.querySelectorAll("*").forEach(
                    (el) => {
                        el.draggable = false;
                    }
                );
                //console.log();

                CAROUSEL.addEventListener("mousedown", (event) => {
                    let clickX = event.clientX - CAROUSEL.clientLeft;
                    function onMouseMove(event) {
                        WRAPPER.classList.remove(CLASS_NAME.ANIMATION);
                        setWrapperX(event.pageX - clickX + curX - ((curIndex) * slideWidth));
                        offsetIndex = Math.round(getOffsetIndex(clickX, event.clientX));
                    }

                    CAROUSEL.addEventListener('mousemove', onMouseMove);

                    CAROUSEL.addEventListener("mouseup", (event) => {
                        CAROUSEL.removeEventListener('mousemove', onMouseMove);
                    });

                });

                
                CAROUSEL.addEventListener("mouseup", (event) => {
                    rolling(-offsetIndex, false);
                    offsetIndex = 0;
                    WRAPPER.classList.add(CLASS_NAME.ANIMATION);
                });
            }

            window.addEventListener('resize', (event) => {
                resizeCarousel();
            });
        }

        function setWrapperX(posX){
            WRAPPER.style.transform = `translateX(${posX}px)`;
        }

        function getInitX(){
            return (CAROUSEL.clientWidth / 2) - (slideWidth / 2);
        }

        function getOffsetIndex(clickX, releaseX){
            let offsetX = releaseX - clickX;
            return offsetX / slideWidth;
        }

        function resizeCarousel(){
            initX = getInitX();
            curX = initX;
            setWrapperX(initX - (slideWidth * curIndex));
        }

        function rolling(pos, action){
            /* when action = true => absolute
               when action = false => relative
            */
            if(action) curIndex = pos;
            else if(!action) curIndex += pos;

            if (curIndex > maxIndex) {
                curIndex = 0;
            } else if (curIndex < 0) {
                curIndex = maxIndex;
            }

            // do moving wrapper
            setWrapperX(initX - (slideWidth * curIndex));
            // enable li's
            switchDots();
        }

        function generateDots(){
            DOTS = document.querySelector(`ul${CLASS_NAME.DOTS}`);
            for(let indx = 0; indx <= maxIndex; indx++){
                let li = document.createElement("li");
                li.addEventListener("click", () => {
                    rolling(indx, true);
                });
                DOTS.append(li);
            }
            document.querySelector(`ul${CLASS_NAME.DOTS} li`).classList.add("active");
        }

        function switchDots(){
            let dots = document.querySelectorAll(`ul${CLASS_NAME.DOTS} li`);
            for(let dot of dots){
                dot.classList.remove(CLASS_NAME.ACTIVE);
            }
            dots[curIndex].classList.add(CLASS_NAME.ACTIVE);
        }

        // literally initial.
        
        window.onload = function() {
            initial();
        };