// ==UserScript==
// @name         Complete In Cube
// @namespace    bl4ckscor3
// @version      1.1
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
        addFunctionality(() => $.post(`1.0/task/${tomni.task.id}`, {action: "complete"}, "json"), 'C', 'c'); //complete the cube
        addFunctionality(() => $.post(`1.0/task/${tomni.task.id}`, {action: "uncomplete"}, "json"), 'U', 'u'); //uncomplete the cube
        addFunctionality(() => $.post(`1.0/task/${tomni.task.id}`, {action: "freeze"}, "json"), 'F', 'f'); //un-/freeze the cube
        addFunctionality(() => $("#cubeInspectorFloatingControls > div.controls > div.control.custom-highlight > button").click(), 'V', 'v'); //highlight the cube
        addFunctionality(() => $("#cubeInspectorFloatingControls > div.controls > div.control.custom-unhighlight > button").click(), 'B', 'b'); //unhighlight the cube

        function addFunctionality(action, ...keys) {
            let hasPressedKey = false;

            $(document).keydown(e => {
                if(keys.some(k => k == e.key)) {
                    //ignore if the user is currently not inspecting a cube
                    //ignore if the user is currently typing into chat
                    if(tomni.task && tomni.task.inspect && !document.getElementById("chatContainer").children[0].classList.contains("active")) {
                        if(hasPressedKey) { //second time pressing the key
                            action();
                            tomni.leave(); //return to overview
                            hasPressedKey = false;
                        }
                        else { //first time pressing the key
                            hasPressedKey = true;
                        }
                        
                        return;
                    }
                }
                
                hasPressedKey = false;
            });
        }
    }
})();