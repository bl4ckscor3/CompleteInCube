// ==UserScript==
// @name         Complete In Cube
// @namespace    bl4ckscor3
// @version      1.0
// @description  Eyewire script to make the standard "c+c" shortcut for completing a cube available while inspecting a cube
// @author       bl4ckscor3
// @match        https://eyewire.org/
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/bl4ckscor3/CompleteInCube/master/completeincube.user.js
// @updateURL    https://raw.githubusercontent.com/bl4ckscor3/CompleteInCube/master/completeincube.user.js
// @homepageURL  https://github.com/bl4ckscor3/CompleteInCube
// ==/UserScript==

/* globals $ account tomni */

(function() {
    'use strict';

    const checkAccount = setInterval(function() {
        if(typeof account === "undefined" || !account.account.uid) {
            return;
        }

        clearInterval(checkAccount);

        if(account.can("scythe", "mystic", "admin")) {
            main();
        }
    }, 100);

    function main() {
        let pressedC = false;

        $(document).keydown(e => {
            if(e.key == 'C' || e.key == 'c') {
                //ignore if the user is currently not inspecting a cube
                //ignore if the user is currently typing into chat
                if(tomni.task && !tomni.task.inspect && !document.getElementById("chatContainer").children[0].classList.contains("active")) {
                    if(pressedC) { //second time pressing c
                        $.post(`1.0/task/${tomni.task.id}`, {action: "complete"}, "json"); //complete the cube
                        tomni.leave(); //return to overview
                        pressedC = false;
                    }
                    else { //first time pressing c
                        pressedC = true;
                    }
                    
                    return;
                }
            }
            
            pressedC = false;
        });
    }
})();