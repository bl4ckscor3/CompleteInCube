// ==UserScript==
// @name         Complete In Cube
// @namespace    bl4ckscor3
// @version      1.2
// @description  Eyewire script to make cube information as well as some shortcuts from the inspect panel available while inspecting a cube
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
        const returnContainerObserver = new MutationObserver(modifyInCubeInformation);
        let showInfo = getLocalSetting("infoVisible", true);

        addFunctionality(() => $.post(`1.0/task/${tomni.task.id}`, {action: "complete"}, "json"), 'C', 'c'); //complete the cube
        addFunctionality(() => $.post(`1.0/task/${tomni.task.id}`, {action: "uncomplete"}, "json"), 'U', 'u'); //uncomplete the cube
        addFunctionality(() => $.post(`1.0/task/${tomni.task.id}`, {action: "freeze"}, "json"), 'F', 'f'); //un-/freeze the cube
        addFunctionality(() => $("#cubeInspectorFloatingControls > div.controls > div.control.custom-highlight > button").click(), 'V', 'v'); //highlight the cube
        addFunctionality(() => $("#cubeInspectorFloatingControls > div.controls > div.control.custom-unhighlight > button").click(), 'B', 'b'); //unhighlight the cube
        $("head").append(`<style id="completeInCubeStyle">
            #inCubeInfoButton[data-active=true] {background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAN8SURBVEhL7ZRZSJRRFMe/mXHG0XGdSeulTOklKCpILCEIhDAIddJxGJ0SyWBayLAsilCi9KGioKIINCx3LEfFIrQefGih0laoB0FMKAKXzGVcxpl+9/PTMDN76iHmD4d7v3uW/znnnvtJPvjw30GlrH+NyspKk8FgiFGpVEaNRiNNTEy43G53T39/f7fD4fAoZotiUeLq6mpdYGDgdoiSkQRkhaIS8CJyDK/XO4g8RZonJyfvpKWlfRXnC2FB4traWlNAQEAuRA4+jQT8plarTR6P58XU1NSZkZGRtvHxcVdoaOgarVbroPq92ExiO4qPATsndufMZnO7HPAXzCOuqKjQBwcHH4HkGJ+jBLhCO5v1ev0j9q1DQ0O77Xa7u7y83MCZ3mKx9Am/xsZGC+Q1tH0PxC4klxib8KmnA/mpqaldwm4GamWV4XQ646ngNQ75ZH+2t7c3Ojk5uVin02WgHqXCHNrubWpquhoWFjbA+bZpT0nCrg6S65AXDAwM1EEWjySSwCp/f//3JJZHUbN88oZAKhQnaFkbhB/GxsZWJyUlnc/Ozh6TjdRqM0Fvpaenj7I/jBwgoHp4eNgp9DU1NevECtE1zqODgoLWU6FEm1sYuo10oZCEikJCQh5whUuE7UwGl1AU45jX2dlppn1flHMxxcImhoTeim/sdohVbAl0m6T3MOV3QURfX99Hcc90IkqxkbKystwpKSkXuK7NJLWGjj2DPFwmxvg+Mujn52eLioqKlj0UZGZmiifiQh8kvlnlOxUgkIXqS9guJ7AYqgD2GrojhmwWVVVVOhK2o1+GrgEZlIm5nxaqjWVLsro3DQ0NhzD2EzoF7TgmiA2TepFlTmCSuWyz2UYiIyO3ElxiFjoUlUSseFr/Ev8cWm6D6yi2njlTXVJSoo2IiDhOFSf57IKkkAFzmkwmK/dfRnJx3NsrhjCWQAchCcbmHnKTKrQM0RP8PjMfSbRePLMCYqWhu0dH9vO2e2Qi8Nt3XF9fv5K2n8Ypg2q6cSzjeBdEBkh2Qv582nIa2IeLxNgmUlURSW3BNwHfDuxPcccPpi1/YsEfiAABY0hgH4SCdKlyPCUqYG3jTLzztZBY2ZuEErJxpJnzG1T5kJcg/m7z8EfiGZSWlmqMRmOccs8bIIlhNbJKELjYf0LeUd1jyFqtVut3vn3wwYd/AUn6AQPguY4y1NYLAAAAAElFTkSuQmCC')}
            #inCubeInfoButton[data-active=false] {background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAaCAYAAACgoey0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAARNSURBVEhL7ZRtaJtVFMefvLbpy0rTtQxhJhtOmGygMgt2DIRSmVKSpk1bYztiwEl0nZs6cC/q0FKRKbhFFJx1WGwb+pq069yYfqmgqN0GTooDi9u6oR/WFtvSpmmaxN958qyzdnUMDH7xDzf3Pvece/7nf+65Uf4rGLQ57ejq6npAr9ffGB4eVr916m8aEQgEjDabLWAwGJ6PRqPFVVVVQ7KvV61pQkdHxyq73T4AqX9hYaGR+ZxmSp/i7u5um9lsPkl575+fn99ZWVn5uWZSkRbi3t7eYpPJ1MfSFIvF4Kz8OmW5hbsmbmtrK8jOzl6v0+mslE5BTYQyXpuYmLjq9/sToVDIDWlLIpG4Dmk5d/qLdnQJ7kgcDAbNWVlZT0DkZJQy7tVMgiRDjZFMJicZFyntVki/j0Qi5bW1tRNiux1WJKYxCiwWyx6I/HxaCfoHQQsIOhSPxxtnZmYG6dJIXl7eJhTuRr1PzuEX4YwRvxB+R1wu13nZ/zuWdXVra2tmX1/fIVT+SoCdBDg6Nzf3MOskgYJTU1MlBDsJQXwVoMxXtCqIevHZxdjBei0JDfX393f39PSsk9h/xRLF3E+J0Wg8wXINgZvGx8c/8Pl8cyTyDmo9lG8j9ijjGGTPQfoW6zr87ayfQfU29p/k3H25ubkJzjyO/Qh7G0jm9enp6aP19fUJ4VIVk5WO4AfIcBDCn1G40eFwvCukqpNe70J5S01NzSzrvYxdBDMQdA9mK/4vUYUOmukj9tfl5OQ8SFMp7J2l6baQ1GGSaqJAZ7jC1WpM+QHvY3ibgy+PjIy4qqurf9f2pYvFZz0JXZRv/MplBnpI8lHySWZm5j7KWYjSS/jFeL82zUfxer0LFRUV79H9j+K/iSv8DvJ8lRjnLxiTKPDw97bkPurq6qQ0Eew5ZWVlOmZTyqJCVB9iXkvgWQJbZI/qxFSrhvb2djMJ12Nfgy3MmFSJnU7nWdQ+wpJkzT+Gw+EXcTaKTcN5yru9oaGhhXkr3+o93QTJBDwez0xRUdFjBFfo9guaSSFWCaU/B/GzlNwD1z58E0uaq7m52VRYWPgqwQ/yeZkyHh4bGwtZrVYvCX3KXoLD+yEaJJDccy4+pxgnUGHKyMj4Fp/f6A8HpZdn9gax3NhOUZEX3G73NeER3PYd85dnp4RvcuhpSK6yBYdO7vkGxOU0zQ8pzxTwz4fkM5bbsTeR1DbOluJ/gaRe447PpDxvYcU/EAEBfSiV57X4DwXiooB5kGRmWW+GpJZ1gRghizIG2P8YlV/xEuTsMqxIzJv2ouI4AS7xfp0kcA9KSjE9JOqZrcwK9gjrUcZPqPsGsi/5q5zi+x+xjJhW13FXjdKtBD3No3+Kzr5joLvFzXesorOz08KbDAop2X84OjrqSAepYFExpEWQhrmvYp7WKzTQMc2UFiwqprzHubPNkFakm1SwSMwzOADpFkgHtK3/8S9CUf4EeVch4gcFmeQAAAAASUVORK5CYII=')}
            #inCubeInfoPlayer {
                list-style-type: none;
                margin-top: 5px;
            }
            #inCubeInfoPlayer > .scout {color: #ff660c}
            #inCubeInfoPlayer > .scythe {color: #427ffe}
            #inCubeInfoPlayer > .scythe_frozen {color: #fff}
            #inCubeInfoPlayer > .complete {color: #cc4dde}
            #inCubeInfoPlayer > .admin {color: #eada5b}
        </style>`)
        returnContainerObserver.observe(document.querySelector("#specialBar > span.returnContainer > span"), {
            childList: true,
            attributes: false,
            characterData: false,
            subtree: false
        });
        addToggleButton();

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

        function addToggleButton() {
            $("#specialBar").after(`<div id="inCubeInfoButton" data-active="${showInfo}" style="cursor: pointer; width: 30px; height: 26px; margin-top: 8px; margin-left: 33px;"></div>`);
            $("#inCubeInfoButton").click(() => {
                let button = $("#inCubeInfoButton");
                
                showInfo = button.attr("data-active") !== "true"; //if it's true, showInfo will be false and vice versa

                button.attr("data-active", showInfo);
                setLocalSetting("infoVisible", showInfo);

                if(showInfo) {
                    $("#inCubeInfoCube").show();
                    $("#inCubeInfoPlayer").show();
                }
                else {
                    $("#inCubeInfoCube").hide();
                    $("#inCubeInfoPlayer").hide();
                }
            }).hide();
        }

        function modifyInCubeInformation(mutations) {
            if(mutations.length !== 0) {
                let mutation = mutations[0];
                
                if(mutation) {
                    if(mutation.addedNodes.length !== 0 && mutation.addedNodes[0]) {
                        if(mutation.addedNodes[0].textContent.includes("←")) { //the arrow shows up when inspecting a cube
                            let cubeInfo = document.querySelector("#cubeInspectorFloatingControls > .info > .panel.cube").cloneNode(true);
                            let playerInfo = document.querySelector("#cubeInspectorFloatingControls > .info > .panel.player").cloneNode(true);

                            cubeInfo.id = "inCubeInfoCube";
                            playerInfo.id = "inCubeInfoPlayer";
                            setInfoStyle(cubeInfo);
                            setInfoStyle(playerInfo);
                            fixTextSelection(0, playerInfo);
                            $("#inCubeInfoButton").after(playerInfo).after(cubeInfo);
                            $("#inCubeInfoCube").children().each(fixTextSelection); //fix text not being selectable
                            $("#inCubeInfoCube > .cubeid").remove(); //the cube id is already shown in the text above this info
                            $("#inCubeInfoButton").show();

                            if(!showInfo) {
                                $("#inCubeInfoCube").hide();
                                $("#inCubeInfoPlayer").hide();
                            }
                        }
                    }
                    else if(mutation.removedNodes.length !== 0 && mutation.removedNodes[0]) {
                        if(mutation.removedNodes[0].textContent.includes("←")) { //the arrow shows up when inspecting a cube
                            $("#inCubeInfoCube").remove();
                            $("#inCubeInfoPlayer").remove();
                            $("#inCubeInfoButton").hide();
                        }
                    }
                }
            }
        }

        function setInfoStyle(node) {
            node.style["letter-spacing"] = ".5px";
            node.style.color = "#bbb";
            node.style["font-weight"] = "400";
            node.style["font-size"] = "10px";
            node.style["margin-left"] = "33px";
            node.style["width"] = "150px";
            node.style["display"] = "";
        }

        function fixTextSelection(index, node) {
            node.style["-moz-user-select"] = "text";
            node.style["-khtml-user-select"] = "text";
            node.style["-webkit-user-select"] = "text";
            node.style["-ms-user-select"] = "text";
            node.style["user-select"] = "text";
        }

        function setLocalSetting(setting, value) {
            localStorage.setItem(account.account.uid + "-cib-" + setting, value);
        }
    
        function getLocalSetting(setting, defaultValue) {
            let storedValue = localStorage.getItem(account.account.uid + "-cib-" + setting);
    
            if(storedValue === null) {
                setLocalSetting(setting, defaultValue);
                return defaultValue;
            }
            else {
                return typeof defaultValue === "boolean" ? storedValue === "true" : storedValue;
            }
        }
    }
})();