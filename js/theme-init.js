/* runs in <head> to avoid a flash of the wrong theme */
(function(){try{var t=localStorage.getItem('farsiplay_theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();
