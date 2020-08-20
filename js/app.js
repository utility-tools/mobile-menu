$(function() {

    // menu variables
    const $menuContainer = $('#app-menu');
    const $hamburger = $('#icon-hamburger');
    const $browseMode = $('#icon-browse-mode');
    const $closeIcon = $('#app-menu__close');
    const $menu = $("#app-nav");
    const $resetButton = $('#app-menu__reset');
    const $specialMenu = $('#app-menu__curated-options');
    const $breadcrumb = $('#app-menu__breadcrumb');
    const $landingPage = $('#app-menu__landing-page');
    const mainMenuActiveClass = 'app-menu--on';
    const hiddenClass = 'd-none';
    const activeClass = 'app-nav__node--active';
    const breadcrumbItemClass = 'app-menu__breadcrumb-item';
    const breadcrumHomeText = 'My App Home';

    /**
     * @function
     * @desc handles click event 
     */
    function onHamburgerClick() {

        // close if opened
        if($menuContainer.hasClass(mainMenuActiveClass) && $hamburger.hasClass('active')) {
            onClose();
            return;
        }

        // open menu
        onReset();
        $hamburger.addClass('active').removeClass('deactive');
        $browseMode.removeClass('active');
        $menuContainer.addClass(mainMenuActiveClass);
    }

    /**
     * @function
     * @desc handles click event on browse-mode
     */
    function onBrowseModeClick() {

        // close if opened
        if($menuContainer.hasClass(mainMenuActiveClass) && $browseMode.hasClass('active')) {
            onClose();
            return;
        }

        // open menu
        $hamburger.removeClass('active').addClass('deactive');
        $browseMode.addClass('active');
        $menuContainer.addClass(mainMenuActiveClass);

        // set to current status
        const targetID = $menu.data('current');
        const $currentMenu = $menu.find('#' + targetID);
        const $targetAnchor = $menu.find('.app-nav__node-child[data-target=' + targetID + ']');

        // do nothing, if no target menu is found
        if(!$currentMenu.length) {
            return;
        }

        // open base if home
        if($currentMenu.is(':first-child')) {
            $hamburger.trigger('click');
            $hamburger.removeClass('active').addClass('deactive');
            $browseMode.addClass('active');
            return;
        }

        // activate current menu list
        $currentMenu.addClass(activeClass).siblings().removeClass(activeClass);

        // show reset button
        $resetButton.removeClass(hiddenClass);

        // update landing page
        updateLandingPage($targetAnchor);

        // update breadcrum
        buildBreadcrumbForBrowseMode(targetID);

    }

    /**
     * @function
     * @desc handles event for close button
     */
    function onClose() {
        $hamburger.removeClass('active deactive');
        $browseMode.removeClass('active');
        $menuContainer.removeClass(mainMenuActiveClass);
    }

    /**
     * @function
     * @desc handles click event for submenu items and opens related menu to next (deep) level
     * @param {Event} evt event object
     */
    function onMenuItemClick(evt) {

        // local variables
        const $elm = $(this);
        const targetID = $elm.data("target");
        const $targetMenu = $menu.find("#" + targetID);

        // if no target submenu found, open the linked page
        if(!$targetMenu.length) {
            return;
        }

        // stop going to any target link in anchor href
        evt.preventDefault();

        // close current menu
        $elm.parent().removeClass(activeClass);

        // open target menu
        $targetMenu.addClass(activeClass);

        // show reset button
        $resetButton.removeClass(hiddenClass);

        // update breadcrumb
        updateBreadcrumb($elm.text(), targetID);

        // update landing page
        updateLandingPage($elm);

        // update hamburger and browse-mode
        $hamburger.removeClass('active').addClass('deactive');
        $browseMode.addClass('active');

        // update viewport to top
        scrollTop();
    }

    /**
     * @function
     * @desc handles click event for reset button
     * @param {Event} evt event object
     */
    function onReset(evt) {
        if(evt) {
            evt.preventDefault();
        }

        // reset menu
        $menu
            .find('.app-nav__node').removeClass(activeClass)
            .end().find(':first-child').addClass(activeClass);

        // show reset button
        $resetButton.addClass(hiddenClass);

        // reset breadcrumb
        $breadcrumb.empty();

        // reset landing page link
        $landingPage.empty();

        // reset hamburge & browse-mode
        $hamburger.addClass('active').removeClass('deactive');
        $browseMode.removeClass('active');

        // update viewport to top
        scrollTop();
    }

    /**
     * @function
     * @desc handles click event for breadcrumb items within menu and opens related state of the menu
     * @param {Event} evt event object
     */
    function onBreadcrumbClick() {
        const $elm = $(this);
        const targetID = $elm.data('target');

        // check if first item
        if($elm.is(':first-child')) {
            onReset();
            return;
        }

        // remove next items in breadcrumb
        $elm.nextAll().remove();

        // navigate to target
        $menu
            .find('.app-nav__node').removeClass(activeClass)
            .end()
            .find('#' + targetID).addClass(activeClass);

        // update viewport to top
        scrollTop();
    }

    /**
     * @function
     * @desc handles click event to close menu from outside 
     * @param {Event} evt event object
     */
    function onCloseFromOutside(evt) {
        const eventElm = evt.target;
        const menuElm = $menuContainer.get(0);
        const isClickedOutside = !menuElm.contains(eventElm);

        if (
            isClickedOutside 
            && !$(eventElm).is($hamburger) 
            && !$(eventElm).is($browseMode)
            && !$(eventElm).is('#breadcrum-home')
        ) {
            onClose();
        }
    }

     /**
      * @function
      * @desc utility method to update breadcrum
      * @param {String} text Text content for breadcrumb item to be created
      * @param {String} targetID targetID for for breadcrumb item to be referred
      */
    function updateBreadcrumb(text, targetID) {
        let $item = $('<span role="button"></span>');

        // update text and targetID
        $item.text(text).attr('data-target', targetID).addClass(breadcrumbItemClass);

        // add default/home item for first time
        if($breadcrumb.is(':empty')) {
            $breadcrumb.append('<span class="' + breadcrumbItemClass + '" id="breadcrum-home" role="button">' + breadcrumHomeText + '</span>');
        }

        // add breadcrumb item
        $breadcrumb.append($item);
    }

    /**
     * @function
     * @desc utility method to update landing page block within menu
     * @param {jQuery_DOM} $elm DOM reference for the item which is clicked
     */
    function updateLandingPage($elm) {
        const $link = $('<a href="' + $elm.attr('href') + '">' + $elm.text() + '</a>');

        $link
            .attr({
                'href': $elm.attr('href'),
                'class': 'app-menu__landing-page-link'
            })
            .text($elm.text() + ' - All');

        $landingPage.html($link);
    }

    /**
     * @function
     * @desc utility method to push the menu scroll position to top
     */
    function scrollTop() {
        const options = {
            top: 0,
            left: 0
        };

        $menuContainer.get(0).scrollTo(options);
    }

    /**
     * @function
     * @desc builds breadcrumb in reverse order - from last to first (as last ID is known)
     * @param {String} lastLevelTargetID last level target ID
     */
    function buildBreadcrumbForBrowseMode(lastLevelTargetID) {

        // empty breadcrumb to reset it
        $breadcrumb.empty();
        
        // init adding breadcrum from last to first
        addBreadcrumbNodes(lastLevelTargetID);

        // add first default node after recursion
        $breadcrumb.prepend('<span class="' + breadcrumbItemClass + '" id="breadcrum-home" role="button">' + breadcrumHomeText + '</span>');
    }

    /**
     * @function
     * @desc a utility function to be used recursively for adding breadcrumb nodes from last to first
     * @param {String} lastLevelTargetID 
     */
    function addBreadcrumbNodes(lastLevelTargetID) {
        const $target = $menu.find('.app-nav__node-child[data-target=' + lastLevelTargetID + ']');

        // if no target found, do nothing
        if(!$target.length) {
            return;
        }

        // build and add a node
        const $item = $('<span role="button"></span>');
        const text = $target.text();

        $item
            .text(text)
            .attr('data-target', lastLevelTargetID)
            .addClass(breadcrumbItemClass);

        $breadcrumb.prepend($item);

        // repeat it for previous node if has a parent
        if($target.parent().is('.app-nav__node')) {
            addBreadcrumbNodes($target.parent().attr('id'));
        }
    }

    /**
     * @function
     * @desc initialized the menu, sets up basic stuff
     */
    function init() {
        $menu.find('.app-nav__node:first-child').prepend($specialMenu);
    }

    // initalize menu
    init();

    // event binding
    $hamburger.on('click', onHamburgerClick);
    $browseMode.on('click', onBrowseModeClick);
    $closeIcon.on('click', onClose);
    $menu.find('.app-nav__node-child[data-target]').click(onMenuItemClick);
    $resetButton.click(onReset);
    $breadcrumb.on('click', '.' + breadcrumbItemClass, onBreadcrumbClick);
    $(window).on('click.closemenu', onCloseFromOutside);
});