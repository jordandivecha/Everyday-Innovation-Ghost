//****************************************
// Website scripts
//****************************************
'use strict';

/** 
* Handle Ghost Search
*/ 
const handleSearch = () => {
<<<<<<< HEAD
  let searchKeys = ['title', 'tags.0.name', 'tags.1.name', 'tags.2.name',];
  let searchFields = ['title', 'slug', 'published_at', 'feature_image'];
  let searchFormat = '';

  if (CONFIG.GHOST_SEARCH_IN_CONTENT) {
    searchKeys.push('plaintext');
    searchFields.push('plaintext');
    searchFormat = 'plaintext';
  }

  // init
  let ghostSearch = new GhostSearch({
    key: CONFIG.GHOST_KEY,
    url: CONFIG.GHOST_URL,
    version: CONFIG.GHOST_VERSION,
    // button: '#search-button',
    template: function(result) {
      let postImage = '';
      
      const date = new Date(result.published_at);

      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

      const modifiedDate = `${da} ${mo} ${ye}`;

      return  `<a href='/${result.slug}' class='search-result__post border'>
                <div class='search-result__content'>
                  <h5 class='search-result__title'>${result.title}</h5>
                  <p class='search-result__date'>${modifiedDate}</p>
                </div>
              </a>`;
    },
    trigger: 'focus',
    options: {
      keys: searchKeys,
      limit: CONFIG.GHOST_SEARCH_LIMIT,
    },
    api: {
      resource: 'posts',
      parameters: {
          limit: 'all',
          fields: searchFields,
          filter: '',
          include: 'tags',
          order: '',
          formats: searchFormat,
      },
    }
  });

  const searchField = document.querySelector('.js-search-input');
  const searchForm = document.querySelector('.js-search-form');
  if (searchField && searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
=======
  const headerSearch = document.querySelector('.js-header-search-inner');
  const searchToggle = document.querySelector('.js-search-toggle');
  if (headerSearch && searchToggle && (!CONFIG.GHOST_URL || !CONFIG.GHOST_KEY)) {
    headerSearch.classList.add('is-hidden');
    searchToggle.classList.add('is-hidden');
    return;
  }

  const searchField = document.querySelector('.js-search-input');
  const searchForm = document.querySelector('.js-search-form');
  if (searchField && searchForm) {
    searchField.addEventListener('focus', (e) => {
      prepareSearch();
    });

    searchField.onkeyup = (e) => {
      e.preventDefault();
      if (e.target.value.length > 2) {
        performSearch(e.target.value);
      } else {
        document.querySelector('.js-search-results').innerHTML = '';
      }
    };

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log(e.target.value);
      performSearch(e.target.value);
>>>>>>> upstream/main
    }, false);
  
    const searchTriggerBtn = document.querySelector('.js-search-btn');
    if (searchTriggerBtn) {
      searchTriggerBtn.onclick = () => {
        searchField.focus();
      }
    }
  
    const searchCancelBtn = document.querySelector('.js-search-cancel');
    if (searchCancelBtn) {
      searchCancelBtn.onclick = () => {
        searchField.value = '';
        searchField.dispatchEvent(new Event('keyup'));
      }
    }
  }
}
<<<<<<< HEAD
=======
/** 
* Prepare Search
*/ 
const prepareSearch = () => {
  if (GLOBAL.FUSE) return;

  const getPosts = async function(filter, callback) {
    const api = new GhostContentAPI({
      url: CONFIG.GHOST_URL,
      key: CONFIG.GHOST_KEY,
      version: CONFIG.GHOST_VERSION
    });

    const fields = CONFIG.GHOST_SEARCH_IN_CONTENT ? `url,slug,title,published_at,custom_excerpt,visibility,plaintext`
                                                  : `url,slug,title,published_at,custom_excerpt,visibility`

    const formats = CONFIG.GHOST_SEARCH_IN_CONTENT ? ['html,plaintext'] : ''
  
    // fetch posts, including related tags and authors
    try {
      const res = await api.posts
      .browse({
        limit: 'all',
        include: 'tags',
        fields: fields,
        filter: filter,
        formats: formats
      });
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  getPosts()
  .then(function(posts){
    const keys = CONFIG.GHOST_SEARCH_IN_CONTENT ? [{name: 'title'}, {name: 'tags.name'}, {name: 'custom_excerpt'}, {name: 'plaintext'}]
                                                : [{name: 'title'}, {name: 'tags.name'}, {name: 'custom_excerpt'}];

    /* Custom settings for search function */
    const options = {
      // includeMatches: true,
      shouldSort: true,
      tokenize: true,
      matchAllTokens: true,
      threshold: 0,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 3,
      ignoreLocation: true,
      keys: keys
    }

    GLOBAL.FUSE = new Fuse(posts, options);   
  });
}

/** 
* Perform Search
*/ 
const performSearch = (query) => {
  const results = GLOBAL.FUSE.search(query, {limit: CONFIG.GHOST_SEARCH_LIMIT});
  const resultEl = document.querySelector('.js-search-results');

  if (results.length === 0) {
    resultEl.innerHTML = '';
    return;
  }

  const posts = results.map(function(post) { 
    const indexTitle = post.item.title.search(new RegExp(query,'i'));

    // Highlight search in title
    const title = indexTitle > -1 ? `${post.item.title.substring(0, indexTitle)}<span class="highlight">${post.item.title.substring(indexTitle, indexTitle + query.length)}</span>${post.item.title.substring(indexTitle + query.length, post.item.title.length)}`
                                  : post.item.title

    let start = 0, end = 100;
    let excerpt;

    // Highlight search in content
    if (CONFIG.GHOST_SEARCH_IN_CONTENT) {
      const indexContent = post.item.plaintext.search(new RegExp(query,'i'));

      if ( indexContent > 50 ) {
        start = indexContent - 50;
        end = indexContent + 50;
      }

      excerpt = post.item.plaintext.substring(start, end);

      excerpt = indexContent > -1 ? `...${post.item.plaintext.substring(start, indexContent)}<span class="highlight">${post.item.plaintext.substring(indexContent, indexContent + query.length)}</span>${post.item.plaintext.substring(indexContent + query.length, end)}...`
                                        : excerpt;
    } else {
      if (post.item.custom_excerpt) {
        const indexContent = post.item.custom_excerpt.search(new RegExp(query,'i'));

        if ( indexContent > 50 ) {
          start = indexContent - 50;
          end = indexContent + 50;
        }

        excerpt = post.item.custom_excerpt ? post.item.custom_excerpt.substring(start, end) : ''

        excerpt = indexContent > -1 ? `...${post.item.custom_excerpt.substring(start, indexContent)}<span class="highlight">${post.item.custom_excerpt.substring(indexContent, indexContent + query.length)}</span>${post.item.custom_excerpt.substring(indexContent + query.length, end)}...`
                                    : excerpt;
      } else {
        excerpt = '';
      }
    }

    return  `<a href='${post.item.url}' class='search-result__post border'>
              <div class='search-result__content'>
                <h5 class='search-result__title'>${title}</h5>
                <p class='search-result__excerpt'>${excerpt}</p>
              </div>
            </a>`;
  }).join(' ');

  resultEl.innerHTML = posts;
}
>>>>>>> upstream/main

/** 
* Handle Load More
*/
const handleLoadMore = () => {
  // init
  const loadMoreBtn = document.querySelector('.js-load-more');

  if (loadMoreBtn && GLOBAL.LAST_PAGE) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.classList.add('btn--disabled');
  }

  // event
  if (loadMoreBtn) {
    loadMoreBtn.onclick = (event) => {
      loadMorePosts(event.srcElement);
    }
  }
}

/** 
* Handle Image Gallery
*/
const handleImageGallery = () => {
  const images = document.querySelectorAll('.kg-image-card img, .kg-gallery-card img');
  const galleryImages = document.querySelectorAll('.kg-gallery-image img');

  // Gallery style
  galleryImages.forEach(image => {
    image.setAttribute('alt', 'Gallery Image');
    var container = image.closest('.kg-gallery-image');
    var width = image.attributes.width.value;
    var height = image.attributes.height.value;
    var ratio = width / height;
    container.style.flex = `${ratio} 1 0%`;
  })

  // Lighbox function
<<<<<<< HEAD
  images.forEach(image => {
    if (CONFIG.ENABLE_IMAGE_LIGHTBOX) {
      var wrapper = document.createElement('a');
      wrapper.setAttribute('data-no-swup', '');
      wrapper.setAttribute('data-fslightbox', '');
      wrapper.setAttribute('href', image.src);
      wrapper.setAttribute('aria-label', 'Click for Lightbox');
      image.parentNode.insertBefore(wrapper, image.parentNode.firstChild);
      wrapper.appendChild(image);
    }
    image.setAttribute('class', 'lazyload');
  });
=======
  if (CONFIG.ENABLE_IMAGE_LIGHTBOX) {
    images.forEach(image => {
      const link = image.parentNode.nodeName === 'A' ? image.parentNode.getAttribute('href') : '';
      var lightboxWrapper = link ? image.parentNode : document.createElement('a');

      lightboxWrapper.setAttribute('data-no-swup', '');
      lightboxWrapper.setAttribute('data-fslightbox', '');
      lightboxWrapper.setAttribute('href', image.src);
      lightboxWrapper.setAttribute('aria-label', 'Click for Lightbox');

      if (link) {
        var linkButton = document.createElement('a');
        linkButton.innerHTML = `<i class="icon icon-link icon--xs"><svg class="icon__svg"><use xlink:href="/assets/icons/feather-sprite.svg#link"></use></svg></i>`
        linkButton.setAttribute('class', 'image-link');
        linkButton.setAttribute('href', link);
        if (CONFIG.OPEN_LINKS_IN_NEW_TAB) {
          linkButton.setAttribute('target', '_blank');
          linkButton.setAttribute('rel', 'noreferrer noopener');
        }
        lightboxWrapper.parentNode.insertBefore(linkButton, lightboxWrapper.parentNode.firstChild);
      } else {
        image.parentNode.insertBefore(lightboxWrapper, image.parentNode.firstChild);
        lightboxWrapper.appendChild(image);
      }
    });

    refreshFsLightbox();
  };
>>>>>>> upstream/main

  CONFIG.ENABLE_IMAGE_LIGHTBOX ? refreshFsLightbox() : '';
}

/** 
* Handle Menu
*/
const handleMenu = () => {

  // theme
  const themeToggleBtn = document.querySelector('.js-theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.onclick = (event) => {
      event.currentTarget.classList.toggle('is-active');
    }
  }

  // view
  const gridBtn = document.querySelector('.js-grid-btn');
  if (gridBtn) {
    gridBtn.onclick = () => {
      setView('grid');
    }
  }

  const listBtn = document.querySelector('.js-list-btn');
  if (listBtn) {
    listBtn.onclick = () => {
      setView('list');
    }
  }

  const viewToggleBtn = document.querySelector('.js-view-toggle');
  if (viewToggleBtn) {
    viewToggleBtn.onclick = () => {
      toggleView();
    }
  }
  
  //scroll menu offset
  if (CONFIG.ENABLE_STICKY_HEADER == false) {
    window.addEventListener('scroll', (event) => {
      const scrollPos = window.scrollY || window.scrollTop || document.getElementsByTagName('html')[0].scrollTop;
      scrollPos <= 60 ? document.querySelector('.menu').style.top = `${60-scrollPos}px` 
                      : document.querySelector('.menu').style.top = '0px'; 
    }, false);
  }
}

/** 
* Handle User Menu
*/
const handleUserMenu = () => {
  const memberBtn = document.querySelector('.js-member-btn');
  let isMemberFocus = false;
  if (memberBtn) {
    memberBtn.onfocus = (event) => {
      isMemberFocus=true;
      event.currentTarget.nextElementSibling.classList.add('is-active');
    }

    memberBtn.onblur = (event) => {
      event.currentTarget.nextElementSibling.classList.remove('is-active');
    }

    memberBtn.onclick = (event) => {
      !isMemberFocus ? event.currentTarget.nextElementSibling.classList.toggle('is-active')
                     : isMemberFocus = false;
    }
  }
}

/** 
* Handle Announcement
*/
const handleAnnouncement = () => {
  const announcementBtn = document.querySelector('.js-announce-btn');
  let isAnnounceFocus = false;
  if (announcementBtn) {
    announcementBtn.onfocus = (event) => {
      isAnnounceFocus=true;
      event.currentTarget.nextElementSibling.classList.add('is-active');
    }

    announcementBtn.onblur = (event) => {
      event.currentTarget.nextElementSibling.classList.remove('is-active');
    }

    announcementBtn.onclick = (event) => {
      !isAnnounceFocus ? event.currentTarget.nextElementSibling.classList.toggle('is-active')
                     : isAnnounceFocus = false;
    }
  }
}

/** 
* Handle Filter
*/
const handleFilter = () => {
  const filterBtn = document.querySelector('.js-filter-btn');
  if (filterBtn) {
    filterBtn.onchange = (event) => {
      event.target.value ? window.location.href = event.target.value : ''
    }
  }
}

/** 
* Handle Scroll Top
*/
const handleScrollTop = () => {
  const scrollTopBtn = document.querySelector('.js-scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.onclick = () => {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }
}

/** 
* Handle Notifications
*/
const handleNotifications = () => {
  const notifyBtns = document.querySelectorAll('.js-notify-close');
  notifyBtns.forEach(notifyBtn => {
    notifyBtn.onclick = (event) => {
      const toRemove = event.currentTarget.getAttribute('data-class');
      if (toRemove) {
        document.body.classList.remove(toRemove);
        clearURI();
      } else {
        event.currentTarget.parentNode.classList.remove('success', 'error');
      }
    }
  });
}

/** 
* Handle Slider
*/
const handleSlider = () => {
  const sliderContainer = document.querySelector('.js-featured-feed');

  if (sliderContainer) {
    const slider = tns({
      container: sliderContainer,
      items: 3,
      slideBy: 1,
      loop: true,
      autoplay: false,
      gutter: 32,
      nav: false,
      controls: true,
      prevButton: document.querySelector('.js-featured-prev'),
      nextButton: document.querySelector('.js-featured-next'),
      responsive: {
        0: {
          items: 1,
        },
        768: {
          items: 2,
        },
        992: {
          items: 3,
        }
      }
    });
  }
}

/** 
* Handle Click
*/
const handleClick = () => {
  // menu
  const menuToggleBtn = document.querySelector('.js-menu-toggle');
  const menu = document.querySelector('.js-menu');

  // search
  const searchToggleBtn = document.querySelector('.js-search-toggle');
  const headerSearchSection = document.querySelector('.js-header-search');
  
  window.addEventListener('click', (event) => {
    if (menuToggleBtn && menu && event.target.closest('.js-menu-toggle')) {
      menuToggleBtn.classList.toggle('is-active');
      menu.toggleAttribute('data-menu-active');
      document.body.classList.toggle('menu-open');
      // return;
    }

    if (searchToggleBtn && event.target.closest('.js-search-toggle')) {
      headerSearchSection ? headerSearchSection.classList.toggle('is-active') : '';
      // return;
    }

<<<<<<< HEAD
    if (!event.target.closest('.js-menu') && !event.target.closest('.js-menu-toggle')) {
=======
    if ( CONFIG.ENABLE_MENU_AUTO_CLOSE && (!event.target.closest('.js-menu') && !event.target.closest('.js-menu-toggle'))) {
>>>>>>> upstream/main
      document.body.classList.remove('menu-open');
      menu.removeAttribute('data-menu-active');
      menuToggleBtn.classList.remove('is-active');
    }

    if (!event.target.closest('.js-header-search') && !event.target.closest('.js-search-toggle')) {
      headerSearchSection ? headerSearchSection.classList.remove('is-active') : '';
    }
  });
}

/** 
* Handle External links
*/
const handleExternalLinks = () => {
<<<<<<< HEAD
  const domain = location.host.replace('www.', '');
  const postLinks = document.querySelectorAll('.content a');

  postLinks.forEach((link) => {
    if(!link.href.includes(domain)) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noreferrer noopener');
    }
  })
=======
  if (CONFIG.OPEN_LINKS_IN_NEW_TAB) {
    const domain = location.host.replace('www.', '');
    const postLinks = document.querySelectorAll('.content a');
  
    postLinks.forEach((link) => {
      const linkURL = link.href.includes('?ref=') ? link.href.split('?ref=')[0] : link.href
      if(!linkURL.includes(domain)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noreferrer noopener');
      }
    })
  }
>>>>>>> upstream/main
}

/** 
* Set Color Scheme
* @param: sTheme
*/ 
const setColorScheme = (theme) => {
  document.documentElement.setAttribute('data-color-scheme', theme);
  localStorage.setItem('USER_COLOR_SCHEME', theme);
}

/** 
* Toggle View
*/ 
const toggleView = () => {
  const currentView =  document.documentElement.getAttribute('data-view-type');
  currentView === 'grid' ? setView('list') : setView('grid');
}

/** 
* Set View
* @param: sView
*/ 
const setView = (sView) => {
  document.documentElement.setAttribute('data-view-type', sView);
  localStorage.setItem('USER_VIEW_TYPE', sView);
}

/** 
* Toggle Class
* @param: el
* @param: class
*/ 
const toggleClass = (el, cls) => {
  el ? document.querySelector(el).classList.toggle(cls) : '';
}

/** 
* Add Class
* @param: el
* @param: class
*/ 
const addClass = (el, cls) => {
  el ? document.querySelector(el).classList.add(cls) : '';
}

/** 
* Remove Class
* @param: el
* @param: class
*/ 
const removeClass = (el, cls) => {
  el ? document.querySelector(el).classList.remove(cls) : '';
}

/** 
* Check if element in Viewport
* @param: el
*/ 
const isInViewport = (el) => {
  let top = el.offsetTop;
  let left = el.offsetLeft;
  let width = el.offsetWidth;
  let height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return(
    top < (window.pageYOffset + window.innerHeight) &&
    left < (window.pageXOffset + window.innerWidth) &&
    (top + height) > window.pageYOffset &&
    (left + width) > window.pageXOffset
  );
}

/** 
* Load more posts
* @param: button
*/ 
const loadMorePosts = (button) => {
  // next link
  const nextPage = document.querySelector('link[rel=next]');
  GLOBAL.NEXT_PAGE_LINK = nextPage && !GLOBAL.NEXT_PAGE_LINK ? nextPage.getAttribute('href') : GLOBAL.NEXT_PAGE_LINK;

  // Update current page value
  if (GLOBAL.NEXT_PAGE_LINK && !GLOBAL.LAST_PAGE) {
    button ? button.classList.add('is-loading') : '';

    // Fetch next page content
    fetch(GLOBAL.NEXT_PAGE_LINK).then(res => res.text())
    .then(text => new DOMParser().parseFromString(text, 'text/html'))
    .then(doc => {
      // Get posts
      const posts = doc.querySelectorAll('.js-post-card');
      const postContainer = document.querySelector('.js-post-feed');
      const nextPage = doc.querySelector('link[rel=next]');

      // Add each post to the page
      posts.forEach(post => {
        postContainer.appendChild(post);
      });

      // Update GLOBALS
      GLOBAL.CURRENT_PAGE = GLOBAL.CURRENT_PAGE + 1;
      GLOBAL.NEXT_PAGE_LINK =  nextPage ? nextPage.getAttribute('href') : '';
      GLOBAL.NEXT_PAGE = GLOBAL.NEXT_PAGE_LINK ? GLOBAL.NEXT_PAGE + 1 : NaN;
      GLOBAL.LAST_PAGE = GLOBAL.CURRENT_PAGE === GLOBAL.MAX_PAGES ? true : false;

      // Disable button on last page
      if (button && GLOBAL.LAST_PAGE) {
        button.disabled = true;
        button.classList.add('btn--disabled');
      }

      button ? button.classList.remove('is-loading') : '';
    }).catch(function (err) {
      // There was an error
      console.warn('Something went wrong.', err);
    });
  }
}

/** 
* Get Posts
* @param: filter
* @param: callback
*/ 
const getPosts = (filter, callback) => {
  const api = getApi();

  // fetch posts, including related tags and authors
  api.posts
    .browse({
      limit: 'all', 
      include: 'tags,authors',
      filter: filter
    })
    .then((posts) => {
      callback(posts)
    })
    .catch((err) => {
        console.error(err);
    });
}

/** 
* get API
*/ 
const getApi = () => {
  if (!GLOBAL.API) {
    const ghostAPI = new GhostContentAPI({
      url: CONFIG.GHOST_URL,
      key: CONFIG.GHOST_KEY,
      version: CONFIG.GHOST_VERSION
    });

    GLOBAL.API = ghostAPI;
  } 

  return GLOBAL.API
}

/** 
* DOM Loaded event
*/ 
const callback = () => {
  fitvids();
<<<<<<< HEAD
  handleSearch();
=======
  //handleSearch();
>>>>>>> upstream/main
  handleLoadMore();
  handleImageGallery();
  handleMenu();
  handleUserMenu();
  handleAnnouncement();
  handleFilter();
  handleScrollTop();
  handleNotifications();
  handleSlider();
  handleClick();
  handleExternalLinks();
};

if (
    document.readyState === 'complete' ||
    (document.readyState !== 'loading' && !document.documentElement.doScroll)
) {
  callback();
} else {
  document.addEventListener('DOMContentLoaded', callback);
}