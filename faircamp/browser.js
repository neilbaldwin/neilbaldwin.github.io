const BROWSER_JS_T = {
    nothingFoundForXxx: query => 'Nothing found for \'{query}\''.replace('{query}',query),
    showingFeaturedItems: 'Showing featured items',
    showingXxxResultsForXxx: (count,query) => 'Showing {count} results for \'{query}\''.replace('{count}',count).replace('{query}',query),
    xxxAndOthers: (xxx,othersLink) => '{xxx} and <a href="{others_link}">others</a>'.replace('{xxx}',xxx).replace('{others_link}',othersLink)
};
const LABEL_MODE = false;
const ARTISTS = [];
const RELEASES = [{cover:'cover_160.jpg?g3qwLIeuyDU',title:'TWNTYTWNTY5',tracks:[{cover:'cover_160.jpg?zLdqPHVPUkU',number:'1.',title:'As Scared As Can Be',url:'twntytwnty5/1/'},{cover:'cover_160.jpg?lvDJ-Y7srds',number:'2.',title:'Incubator (V2000)',url:'twntytwnty5/2/'},{cover:'cover_160.jpg?ncxKVDFKayM',number:'3.',title:'Hug a Bastard.',url:'twntytwnty5/3/'},{cover:'cover_160.jpg?AfXEnCRd680',number:'4.',title:'When a Good Man Cries',url:'twntytwnty5/4/'},{cover:'cover_160.jpg?or6JQo-Jx7c',number:'5.',title:'Reframing',url:'twntytwnty5/5/'},{cover:'cover_160.jpg?KpWdm6S5jAI',number:'6.',title:'Land Of The Tyrants',url:'twntytwnty5/6/'},{cover:'cover_160.jpg?geMvLoCreZI',number:'7.',title:'Happy Birthday',url:'twntytwnty5/7/'},{cover:'cover_160.jpg?yktTWd6NEV4',number:'8.',title:'Scams',url:'twntytwnty5/8/'},{cover:'cover_160.jpg?LqT9y6hATKg',number:'9.',title:'my mind is a mountain',url:'twntytwnty5/9/'},{cover:'cover_160.jpg?Au2gTIh5EqE',number:'10.',title:'ELDERBERRY',url:'twntytwnty5/10/'},{cover:'cover_160.jpg?hnw4faqMVV4',number:'11.',title:'off to the ESSO',url:'twntytwnty5/11/'},{cover:'cover_160.jpg?HiJsepscrDQ',number:'12.',title:'Snail Zero',url:'twntytwnty5/12/'},{cover:'cover_160.jpg?kmxZP1Zfg_g',number:'13.',title:'Fuck My Computer',url:'twntytwnty5/13/'},{cover:'cover_160.jpg?vZfxbECc_VU',number:'14.',title:'Chains & Whips',url:'twntytwnty5/14/'},{cover:'cover_160.jpg?-8wEUI13JQY',number:'15.',title:'Break the Jaw',url:'twntytwnty5/15/'},{cover:'cover_160.jpg?DJurlFCyoSw',number:'16.',title:'Psychosis Is Just a Number',url:'twntytwnty5/16/'},{cover:'cover_160.jpg?wKXkRmEFxnQ',number:'17.',title:'Big Dick Energy',url:'twntytwnty5/17/'},{cover:'cover_160.jpg?Ee_5DSQ2-Hc',number:'18.',title:'CPR',url:'twntytwnty5/18/'},{cover:'cover_160.jpg?9Si97MAcv6w',number:'19.',title:'Don’t Fall Asleep',url:'twntytwnty5/19/'},{cover:'cover_160.jpg?ZfwqCQiitFY',number:'20.',title:'I Do And I Don\'t Care',url:'twntytwnty5/20/'},{cover:'cover_160.jpg?wfRAbQXcV6o',number:'21.',title:'RIDING WITH MY GIRLS',url:'twntytwnty5/21/'},{cover:'cover_160.jpg?E7Q7_l4ITwM',number:'22.',title:'Lion',url:'twntytwnty5/22/'},{cover:'cover_160.jpg?lbyIapk9NjM',number:'23.',title:'Neon Signs',url:'twntytwnty5/23/'},{cover:'cover_160.jpg?yy26f07HESE',number:'24.',title:'Doom',url:'twntytwnty5/24/'},{cover:'cover_160.jpg?6ktSNT4QeXU',number:'25.',title:'S P E Y S I D E',url:'twntytwnty5/25/'}],url:'twntytwnty5/'},{coverProcedural:'cover_120.png?KiPwQdkL7JQ',title:'Polyend Tracker Export',tracks:[{number:'1.',title:'PTP Export Test',url:'polyend-tracker-export/1/'}],url:'polyend-tracker-export/'},{cover:'cover_160.jpg?7dGimnsys7A',title:'5 Days',tracks:[{number:'1.',title:'One Nine Eight Nine',url:'5-days/1/'},{number:'2.',title:'Forever Four Errors',url:'5-days/2/'},{number:'3.',title:'Outside',url:'5-days/3/'},{number:'4.',title:'Sweaty Hot Robot',url:'5-days/4/'},{number:'5.',title:'Closing Ceremony',url:'5-days/5/'}],url:'5-days/'}];
const browser = document.querySelector('#browser');
const browseButtonFooter = document.querySelector('footer button.browse');
const browseButtonHeader = document.querySelector('header button.browse');

const browseResults = browser.querySelector('#results');
const closeButton = browser.querySelector('button');
const searchField = browser.querySelector('input');
const statusField = browser.querySelector('[role="status"]');

const indexSuffix = window.location.pathname.endsWith('index.html') ? 'index.html' : '';
const rootPrefix = browser.dataset.rootPrefix;

function truncateArtistList(artists, othersLink)  {
    const MAX_CHARS = 40;

    if (artists.length > 2) {
        const nameChars = artists.reduce((sum, artist) => sum + artist.name.length, 0);
        const separatorChars = (artists.length - 1) * 2; // All separating ", " between the artists

        if (nameChars + separatorChars > MAX_CHARS) {
            // Here we have more than two artists, we have a char limit,
            // and we cannot fit all artists within the limit, thus
            // we truncate the list.

            if (LABEL_MODE) {
                // In label mode we show at least one artist, then as many
                // additional ones as fit, e.g. "[artist],[artist] and
                // more"
                let charsUsed = 0;
                const truncatedArtists = artists
                    .filter(artist => {
                        if (charsUsed === 0) {
                            charsUsed += artist.name.length;
                            return true;
                        }

                        charsUsed += artist.name.length;
                        return charsUsed < MAX_CHARS;
                    });

                const rArtists = truncatedArtists
                    .map(artist => {
                        const url = artist.externalPage ?? `${rootPrefix}${artist.url}${indexSuffix}`;
                        return `<a href="${url}">${artist.name}</a>`;
                    })
                    .join(", ");

                return BROWSER_JS_T.xxxAndOthers(rArtists, othersLink);
            }

            // In artist mode we show only "[catalog artist] and others".
            // Our sorting ensures the catalog artist is the first one,
            // so we can just take that.
            const rArtists = `<a href="${rootPrefix}${artists[0].url}${indexSuffix}">${artists[0].name}</a>`;

            return BROWSER_JS_T.xxxAndOthers(rArtists, othersLink);
        }
    }

    return artists
        .map(artist => {
            const url = artist.externalPage ?? `${rootPrefix}${artist.url}${indexSuffix}`;
            return `<a href="${url}">${artist.name}</a>`;
        })
        .join(", ");
}

for (const release of RELEASES) {
    let imgRelease;
    if (release.cover) {
        imgRelease = document.createElement('img');
        imgRelease.src = rootPrefix + release.url + release.cover;
    } else {
        imgRelease = document.createElement('img');
        imgRelease.classList.add('procedural');
        imgRelease.src = rootPrefix + release.url + release.coverProcedural;
    }

    const aText = document.createElement('a');
    aText.href = rootPrefix + release.url + indexSuffix;

    const aImage = aText.cloneNode(true);
    aImage.tabIndex = -1;
    aImage.appendChild(imgRelease);

    aText.dataset.searchable = 'true';
    aText.textContent = release.title;

    const details = document.createElement('div');
    details.appendChild(aText);

    if (release.artists) {
        const artists = document.createElement('div');
        artists.classList.add('artists');
        artists.innerHTML = truncateArtistList(release.artists, `${rootPrefix}${release.url}`);
        details.appendChild(artists);
    }

    const row = document.createElement('div');
    row.appendChild(aImage);
    row.appendChild(details);
    browseResults.appendChild(row);

    for (const track of release.tracks) {
        let imgTrack;
        if (track.cover) {
            imgTrack = document.createElement('img');
            imgTrack.src = rootPrefix + track.url + track.cover;
        } else {
            imgTrack = imgRelease.cloneNode(true);
        }

        const number = document.createElement('span');
        number.classList.add('number');
        number.textContent = track.number;

        const aTitle = document.createElement('a');
        aTitle.href = rootPrefix + track.url + indexSuffix;

        const aImage = aTitle.cloneNode(true);
        aImage.tabIndex = -1;
        aImage.appendChild(imgTrack);

        aTitle.dataset.searchable = 'true';
        aTitle.textContent = track.title;

        const details = document.createElement('div');
        details.appendChild(number);
        details.appendChild(aTitle);

        if (track.artists) {
            const artists = document.createElement('div');
            artists.classList.add('artists');
            artists.innerHTML = truncateArtistList(track.artists, `${rootPrefix}${track.url}`);
            details.appendChild(artists);
        }

        const row = document.createElement('div');
        row.appendChild(aImage);
        row.appendChild(details);
        row.dataset.track = '';
        row.style.setProperty('display', 'none');
        browseResults.appendChild(row);
    }
}

for (const artist of ARTISTS) {
    const aText = document.createElement('a');

    const url = artist.externalPage ?? `${rootPrefix}${artist.url}${indexSuffix}`;
    aText.href = url;

    let imageArtist;
    if (artist.image) {
        imageArtist = document.createElement('img');
        imageArtist.classList.add('crop');
        imageArtist.src = rootPrefix + artist.url + artist.image;
    } else {
        imageArtist = document.createElement('span');
        imageArtist.classList.add('placeholder');
    }

    const aImage = aText.cloneNode(true);
    aImage.tabIndex = -1;
    aImage.appendChild(imageArtist);

    aText.dataset.searchable = 'true';
    aText.textContent = artist.name;

    const details = document.createElement('div');
    details.appendChild(aText);

    const row = document.createElement('div');
    row.appendChild(aImage);
    row.appendChild(details);
    browseResults.appendChild(row);
}

function hideBrowser() {
    const browseButton = browseButtonFooter.ariaExpanded === 'true'
        ? browseButtonFooter
        : browseButtonHeader;

    browser.classList.remove('active');
    browseButton.setAttribute('aria-expanded', 'false');
    searchField.value = '';
    statusField.removeAttribute('aria-label');
    statusField.textContent = '';
    for (const result of browseResults.children) {
        const display = result.dataset.track === undefined;
        result.style.setProperty('display', display ? null : 'none');
    }
    browseButton.focus();
}

function showBrowser(browseButton) {
    browser.classList.add('active');
    browseButton.setAttribute('aria-expanded', 'true');
    searchField.focus();
    statusField.setAttribute('aria-label', BROWSER_JS_T.showingFeaturedItems);
    statusField.textContent = '';
}

// When the browse/search modal is open and focus moves outside the page
// entirely (e.g. to the addressbar) but then re-enters the page, we need
// to make sure that it returns back to the browse/search modal (instead of
// to an obscured element in the main body)
document.body.addEventListener('focusin', event => {
    if (browser.classList.contains('active') && !browser.contains(event.target)) {
        searchField.focus();
    }
});

browser.addEventListener('focusout', event => {
    if (browser.classList.contains('active') && event.relatedTarget && !browser.contains(event.relatedTarget)) {
        hideBrowser();
    }
});

browser.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        event.preventDefault();
        hideBrowser();
    }
});

browseButtonFooter.addEventListener('click', () => showBrowser(browseButtonFooter));
browseButtonHeader.addEventListener('click', () => showBrowser(browseButtonHeader));

closeButton.addEventListener('click', hideBrowser);

searchField.addEventListener('input', () => {
    const query = searchField.value.trim();

    if (query.length) {
        const regexp = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        let shown = 0;

        for (const element of browseResults.children) {
            const title = element.querySelector('[data-searchable]').textContent;
            const display = regexp.test(title);
            element.style.setProperty('display', display ? null : 'none');
            if (display) { shown += 1; }
        }

        if (shown === 0) {
            statusField.removeAttribute('aria-label');
            statusField.textContent = BROWSER_JS_T.nothingFoundForXxx(query);
        } else {
            statusField.setAttribute('aria-label', BROWSER_JS_T.showingXxxResultsForXxx(shown, query));
            statusField.textContent = '';
        }
    } else {
        for (const element of browseResults.children) {
            const display = element.dataset.track === undefined;
            element.style.setProperty('display', display ? null : 'none');
        }

        statusField.setAttribute('aria-label', BROWSER_JS_T.showingFeaturedItems);
        statusField.textContent = '';
    }
});
