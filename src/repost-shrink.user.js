// ==UserScript==
// @name           Repost Shrink
// @namespace      http://tampermonkey.net/
// @version        1.0.0
// @description    Shrink the X repost to make the timeline easier to view
// @description:ja Xのリポストを縮めてタイムラインを見やすくします
// @author         fitudao3788
// @match          https://x.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant          none
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutationList) => {
        if (location.pathname.includes('/status/')) return;

        for (let mutation of mutationList) {
            if (mutation.type === 'childList') {
                for (let node of mutation.addedNodes) {
                    if (node.attributes && node.attributes['data-testid']?.value === 'cellInnerDiv') {
                        const postIconElem = node.querySelector('article[data-testid="tweet"]>div>div>div:nth-child(1)>div>div>div>div>div>svg');
                        if (postIconElem && postIconElem.querySelector('g>path').attributes.d.value.startsWith('M4.75')) {
                            const postElem = node.querySelector('article[data-testid="tweet"]');
                            const postHeaderElem = postElem.querySelector('article[data-testid="tweet"]>div>div>div:nth-child(1)');
                            const postBodyElem = postElem.querySelector('article[data-testid="tweet"]>div>div>div:nth-child(2)');

                            const postToggleBtn = document.createElement('div');

                            postToggleBtn.innerHTML = '▼';
                            postToggleBtn.style.position = 'absolute';
                            postToggleBtn.style.right = '0';
                            postToggleBtn.style.top = '0';
                            postToggleBtn.style.padding = '6px 12px';
                            postToggleBtn.style.cursor = 'pointer';

                            let postToggled = false;
                            postToggleBtn.addEventListener('click', () => {
                                if (postToggled) {
                                    postToggleBtn.innerHTML = '▼';

                                    postElem.style.height = '35px';
                                } else {
                                    postToggleBtn.innerHTML = '▲';

                                    postElem.style.height = '';
                                }

                                postToggled = !postToggled;
                            });

                            node.append(postToggleBtn);

                            postElem.style.height = '35px';
                            postHeaderElem.style.marginTop = '1px'
                            postHeaderElem.style.marginBottom = '2px';
                            postBodyElem.style.marginTop = '4px';
                        }
                    }
                }
            }
        }
    });

    observer.observe(document, { subtree: true, childList: true });
})();
