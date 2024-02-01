
/* GSAP */
import './gsap-minified/gsap.min';
import "./gsap-minified/ScrollTrigger.min";
import "./gsap-minified/ScrollSmoother.min";

/* components */



// gsap.registerPlugin(ScrollTrigger, ScrollSmoother);


// For more information, see greensock.com/docs/v3/Plugins/ScrollTrigger
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);



/* Your JS Code goes here */


const cookieBtn = document.querySelector('.cookie-conset');
if(cookieBtn){
    cookieBtn.addEventListener('click', () => {
        window.fdConsentManager.showBanner()
    })
}
