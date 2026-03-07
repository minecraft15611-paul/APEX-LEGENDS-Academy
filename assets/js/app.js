
const base = "";

// Global instances for animation control
let myRadarChart = null;      // WEAPONS PAGE LOGIC
let typewriterTimeout = null; // Typewriter Effect
let pulseAnimationId = null;  // To handle the infinite loop

const routes = {
    '/': 'pages/home.html',
    '/hero': 'pages/hero.html',
    '/maps': 'pages/maps.html',
    '/weapons': 'pages/weapons.html',
    '/play': 'pages/play.html',
    '/beginner': 'pages/beginner.html',
    '/faq': 'pages/faq.html'
};

/**
 * MAIN ROUTER
 */
async function router() {
    let path = window.location.pathname;
    let routeKey = path.replace(base, '') || '/';

    if (routeKey !== '/' && routeKey.endsWith('/')) {
        routeKey = routeKey.slice(0, -1);
    }

    const snippetPath = routes[routeKey] || routes['/'];
    const fetchUrl = `${base}/${snippetPath}`;

    const root = document.getElementById('app-root');
    try {
        const response = await fetch(fetchUrl);
        if (!response.ok) throw new Error("File not found");

        const html = await response.text();
        root.innerHTML = html;

        if (routeKey === '/' || routeKey === '/index.html') {
            initHomePage();
        } else if (routeKey === '/play') {
            initPlayPage();
        } else if (routeKey === '/weapons') {
            initWeaponsPage();
        } else if (routeKey === '/maps') {
            initMapsPage();
        } else if (routeKey === '/hero') {
            initHeroPage();
        }

        window.scrollTo(0, 0);
    } catch (err) {
        console.error("SPA Error:", err);
        root.innerHTML = `<div class="container mt-5 text-white"><h2>404 - 找不到頁面</h2></div>`;
    }
}

/**
 * Typewriter Effect
 */
function typeWriter(element, text, speed = 30) {
    clearTimeout(typewriterTimeout);
    element.innerHTML = "";
    element.style.borderRight = "2px solid #FFD700";

    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            typewriterTimeout = setTimeout(type, speed);
        } else {
            setTimeout(() => {
                element.style.borderRight = "none";
            }, 1500);
        }
    }
    type();
}

/**
 * SPA SYSTEM LOGIC
 */
window.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        window.history.pushState({}, "", link.getAttribute("href"));
        router();

        const navbarCollapse = document.getElementById('navbarNav');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    }
});

/**
 * FOOTER MODAL LOGIC
 */
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.footer-modal-trigger');
    if (trigger) {
        e.preventDefault();

        // 1. Prepare Content
        const title = trigger.getAttribute('data-title');
        const content = trigger.getAttribute('data-content');
        const qrSrc = trigger.getAttribute('data-qr');

        document.getElementById('footerModalLabel').innerText = title;
        document.getElementById('footerModalBody').innerHTML = content;

        const qrImg = document.getElementById('qrCodeImg');
        if (qrSrc) {
            qrImg.src = qrSrc;
            qrImg.style.display = 'block';
        } else {
            qrImg.style.display = 'none';
        }

        // 2. Initialize and Show with Backdrop
        const modalElement = document.getElementById('footerModal');
        const footerModal = new bootstrap.Modal(modalElement, {
            backdrop: 'static', // Prevents closing when clicking the background
            keyboard: false      // Prevents closing with Esc key
        });

        // 3. Show the modal (this triggers the background darkness)
        footerModal.show();
    }
});

/**
 * GLOBAL UI COMPONENTS - BACK TO TOP
 */
document.addEventListener('DOMContentLoaded', () => {
    syncVisitorCount();

    const backToTopBtn = document.getElementById('backToTop');
    const footerModal = document.getElementById('footerModal');

    const musicBtn = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    const bgMusic = document.getElementById('bgMusic');

    if (musicBtn && bgMusic) {
        musicBtn.addEventListener('click', () => {
            if (bgMusic.paused) {
                bgMusic.play();
                // Update icon to "Playing" state
                musicIcon.classList.remove('fa-volume-xmark');
                musicIcon.classList.add('fa-volume-high');
                musicBtn.classList.add('text-danger'); // Optional: change color when active
            } else {
                bgMusic.pause();
                // Update icon to "Muted" state
                musicIcon.classList.remove('fa-volume-high');
                musicIcon.classList.add('fa-volume-xmark');
                musicBtn.classList.remove('text-danger');
            }
        });
    }

    // Only proceed if both elements exist in the DOM
    if (footerModal && backToTopBtn) {
        const musicBtn = document.getElementById('musicToggle');

        footerModal.addEventListener('show.bs.modal', () => {
            backToTopBtn.classList.add('modal-hide');
            if (musicBtn) musicBtn.classList.add('modal-hide'); // Add this line
        });

        footerModal.addEventListener('hidden.bs.modal', () => {
            backToTopBtn.classList.remove('modal-hide');
            if (musicBtn) musicBtn.classList.remove('modal-hide'); // Add this line
        });
    }

    // --- Your existing Scroll Logic (Keep this) ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // --- Your existing Back to Top Click Logic (Keep this) ---
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

/**
 * HOME PAGE LOGIC
 */
function initHomePage() {
    const carouselEl = document.querySelector('#mainCarousel');
    if (!carouselEl) return;
    new bootstrap.Carousel(carouselEl, { interval: 3000, ride: 'carousel' });
    const indicators = document.querySelectorAll('.carousel-indicators-outside button');
    carouselEl.addEventListener('slide.bs.carousel', (event) => {
        indicators.forEach(btn => btn.classList.remove('active'));
        if (indicators[event.to]) indicators[event.to].classList.add('active');
    });
}

function initPlayPage() {
    // 1. Use an array of objects to include titles
    const videoData = [
        { id: "uMV97qcJCDM", title: "My Best Apex Game Of Season 26..." },
        { id: "6fQHDAr1jlA", title: "*NEW* Bloodhound BUFF has BROKEN Scan Abilities in Apex Legends" },
        { id: "eo_lquBk9q8", title: "BEST OF 2025 - APEX LEGENDS" },
        { id: "9Tg0GMFSnMI", title: "The Best Legend Of All Time" },
        { id: "QByHI6eDVFU", title: "キーマウプレデターのキル集 [Apex Legends]" },
        { id: "dh4H-yQrLg0", title: "The Top 100 PREDATOR RANK Meta.. (Apex Legends)" },
        { id: "aA6MmyGO_1k", title: "Apex Legends Season 27 RANKED 🔴 Live Apex Predator GRIND" },
        { id: "-BJhQ12S1GM", title: "I'm The Reason Gibby Won't Get Buffed..." },
        { id: "O_GKTlJrOQU", title: "I RAN DOUBLE SHOTGUN FOR 100 HOURS... HERE'S WHAT HAPPENED..." },
        { id: "_SFUg6hqD2E", title: "久しぶりのキル集 [Apex Legends]" },
        { id: "A8avTr-7qyA", title: "キーマウプレデターのR99最強キル集【APEX LEGENDS】" },
        { id: "iiEUQT6l4zc", title: "ジブラルタルの『無限ドーム』がただのチートだった件【APEX LEGENDS】" }
    ];

    let index = 0;
    const container = document.getElementById("videoRow");
    const loader = document.getElementById("loader");

    function loadVideos() {
        if (!container || index >= videoData.length) return;
        const batchSize = 6;
        for (let i = 0; i < batchSize && index < videoData.length; i++, index++) {
            const video = videoData[index];
            const col = document.createElement("div");
            // Maintain consistent grid layout [cite: 25]
            col.className = "col-12 col-md-6 col-lg-4 mb-4";

            // 2. Add the title div below the video box
            col.innerHTML = `
                <div class="video-box video-ratio" data-id="${video.id}">
                    <div class="video-thumb" style="background-image: url(https://img.youtube.com/vi/${video.id}/hqdefault.jpg)"></div>
                    <div class="play-btn"></div>
                </div>
                <div class="video-caption">${video.title}</div>`;

            col.querySelector('.video-box').addEventListener("click", function() {
                this.innerHTML = `<iframe src="https://www.youtube.com/embed/${this.dataset.id}?autoplay=1&rel=0" allow="autoplay" allowfullscreen></iframe>`;
            });
            container.appendChild(col);
        }
        if (index >= videoData.length && loader) loader.innerText = "- 載入結束 -";
    }

    const scrollObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) loadVideos();
    });
    if (loader) scrollObserver.observe(loader);
    loadVideos();
}

window.addEventListener('popstate', router);
window.addEventListener('load', () => {
    router();
});

/**
 * HERO PAGE LOGIC
 */
function initHeroPage() {
    const legendsData = {
        'assault': [
            {
                name: "邦加羅爾 Bangalore",
                title: "突擊",
                positioning: "1號位 2號位",
                advantage_weapons: "衝鋒槍 霰彈槍",
                role_positioning: "拉打生存能力強，煙霧彈可破門，善用被動近戰優勢大",
                img: `${base}/assets/images/hero/Apex_Commander_Bangalore_Tier_3.webp`,
                video: "https://www.youtube.com/embed/JyJhFYNob30?rel=0"
            },
            {
                name: "轟哥 Fuse",
                title: "突擊",
                positioning: "2號位 3號位",
                advantage_weapons: "射手武器",
                role_positioning: "適合保持中距離用技能給敵方壓力，逼出破綻再擴大優勢",
                img: `${base}/assets/images/hero/Real_Steel_Fuse.webp`,
                video: "https://www.youtube.com/embed/OAWsJ-m1dV0?rel=0"
            },
            {
                name: "瘋狂瑪吉 Mad Maggie",
                title: "突擊",
                positioning: "1號位 2號位",
                advantage_weapons: "衝鋒槍 霰彈槍",
                role_positioning: "擅長打出敵隊破口，鑽頭慎用效果不輸絕招",
                img: `${base}/assets/images/hero/Heat_Death_Maggie.webp`,
                video: "https://www.youtube.com/embed/dIIbltnAcHs?rel=0"
            },
            {
                name: "亡靈 Revenant",
                title: "突擊",
                positioning: "1號位 2號位",
                advantage_weapons: "衝鋒槍",
                role_positioning: "配合絕招護盾可以強行衝亂敵對陣型，戰術狗跳是關鍵",
                img: `${base}/assets/images/hero/Apex_Nightmare_Revenant_Tier_3.webp`,
                video: "https://www.youtube.com/embed/ZPY6tencgL8?rel=0"
            },
            {
                name: "彈道 Ballistic",
                title: "突擊",
                positioning: "1號位 2號位",
                advantage_weapons: "Havoc",
                role_positioning: "利用槍枝過熱效果可取得近戰優勢，被動搭配特定槍枝效果卓越",
                img: `${base}/assets/images/hero/Wistful_Wiseguy_Ballistic.webp`,
                video: "https://www.youtube.com/embed/piOCG6ETQzI?rel=0"
            }
        ],
        'skirmisher': [
            {
                name: "惡靈 Wraith",
                title: "散兵",
                positioning: "1號位 2號位",
                advantage_weapons: "霰彈槍",
                role_positioning: "容錯率高可以大膽往前線給壓力，傳送門提前拉好做撤退路線",
                img: `${base}/assets/images/hero/Apex_Voidshifter_Wraith_Tier_3.webp`,
                video: "https://www.youtube.com/embed/yU_eip8IvQU?rel=0"
            },
            {
                name: "探路者 Pathfinder",
                title: "散兵",
                positioning: "1號位 2號位",
                advantage_weapons: "步槍",
                role_positioning: "利用鉤繩製造大範圍槍線，製造壓力打出破口",
                img: `${base}/assets/images/hero/War_Machine_Pathfinder.webp`,
                video: "https://www.youtube.com/embed/kBpc2EaKBcA?rel=0"
            },
            {
                name: "天際線 Horizon",
                title: "散兵",
                positioning: "1號位 2號位",
                advantage_weapons: "步槍",
                role_positioning: "引力貨梯可以封門.擋雷.阻擋視野...，絕招黑洞配合雷鏢控場",
                img: `${base}/assets/images/hero/Cosmic_Hitchhiker_Horizon.webp`,
                video: "https://www.youtube.com/embed/PfLXL0jtMUQ?rel=0"
            },
            {
                name: "辛烷 Octane",
                title: "散兵",
                positioning: "1號位 2號位",
                advantage_weapons: "步槍",
                role_positioning: "透過靈活跑位給予敵方壓力，壓縮敵方的有效輸出空間，絕招可破卡門",
                img: `${base}/assets/images/hero/El_Diablo_Octane.webp`,
                video: "https://www.youtube.com/embed/aOdTqvcEaZ8?rel=0"
            },
            {
                name: "變幻 Alter",
                title: "散兵",
                positioning: "1號位 2號位 3號位",
                advantage_weapons: "霰彈槍",
                role_positioning: "利用穿牆打破固態思維進攻，活用絕招虛空樞紐大膽推進",
                img: `${base}/assets/images/hero/Apex_Voidsnake_Alter_Tier_1.webp`,
                video: "https://www.youtube.com/embed/JK2p-vZNfPA?rel=0"
            },
            {
                name: "艾許 Ash",
                title: "散兵",
                positioning: "1號位 2號位",
                advantage_weapons: "步槍",
                role_positioning: "電索可以偵查.封路，絕招裂縫尋找制高點火力壓制",
                img: `${base}/assets/images/hero/Project_19_Ash.webp`,
                video: "https://www.youtube.com/embed/1R559DWBYbU?rel=0"
            }
        ],
        'recon': [
            {
                name: "尋血犬 Bloodhound",
                title: "偵查",
                positioning: "2號位",
                advantage_weapons: "步槍",
                role_positioning: "戰術技能留在突破觀察用，被動腳印多注意",
                img: `${base}/assets/images/hero/The_Intimidator_Bloodhound.webp`,
                video: "https://www.youtube.com/embed/euWTbVdRGv0?rel=0"
            },
            {
                name: "暗碼士 Crypto\t",
                title: "偵查",
                positioning: "3號位",
                advantage_weapons: "射手武器",
                role_positioning: "提前部屬飛機到偵查台，抓跟隊友距離不會太遠",
                img: `${base}/assets/images/hero/The_Masked_Dancer_Crypto.webp`,
                video: "https://www.youtube.com/embed/5_8WHxyW86o?rel=0"
            },
            {
                name: "席爾 Seer",
                title: "偵查",
                positioning: "2號位 3號位",
                advantage_weapons: "衝鋒槍",
                role_positioning: "戰鬥中被動抓走位，戰術技能預判走位施放",
                img: `${base}/assets/images/hero/Creeping_Void_Seer.webp`,
                video: "https://www.youtube.com/embed/FsidQPVzFDU?rel=0"
            },
            {
                name: "瓦爾基里 Valkyrie",
                title: "偵查",
                positioning: "1號位 2號位",
                advantage_weapons: "步槍 衝鋒槍",
                role_positioning: "多利用被動佔據高點上下拉扯，推進前飛彈緩速",
                img: `${base}/assets/images/hero/Apex_Interceptor_Valkyrie_Tier_3.webp`,
                video: "https://www.youtube.com/embed/PJYy-e3kXnU?rel=0"
            },
            {
                name: "萬塔捷 Vantage",
                title: "偵查",
                positioning: "3號位",
                advantage_weapons: "狙擊槍",
                role_positioning: "優先絕招狙擊白給位",
                img: `${base}/assets/images/hero/Red_Shot_Raider_Vantage.webp`,
                video: "https://www.youtube.com/embed/DsmEczpCnZE?rel=0"
            },
            {
                name: "雀影 Sparrow",
                title: "偵查",
                positioning: "1號位 2號位",
                advantage_weapons: "霰彈槍",
                role_positioning: "開戰前用戰術技能逼位置",
                img: `${base}/assets/images/hero/Malocchio_Sparrow.webp`,
                video: "https://www.youtube.com/embed/hg0_PBw1OMI?rel=0"
            }
        ],
        'controller': [
            {
                name: "催化姬 Catalyst",
                title: "控制",
                positioning: "2號位 3號位",
                advantage_weapons: "步槍 射手武器",
                role_positioning: "封住重要的門留下好防守的門，絕招分割敵人陣型",
                img: `${base}/assets/images/hero/Blood_Moon_Catalyst.webp`,
                video: "https://www.youtube.com/embed/spInke3sN6o?rel=0"
            },
            {
                name: "腐蝕 Caustic",
                title: "控制",
                positioning: "2號位 3號位",
                advantage_weapons: "步槍 射手武器",
                role_positioning: "毒罐擋視野.子彈，平時在退路多下毒罐",
                img: `${base}/assets/images/hero/Apex_Contagion_Caustic_Tier_3(2).webp`,
                video: "https://www.youtube.com/embed/dSz8Dnj1pdI?rel=0"
            },
            {
                name: "華森 Wattson",
                title: "控制",
                positioning: "3號位",
                advantage_weapons: "射手武器",
                role_positioning: "書必備，戰鬥中可以放電網在敵人必經路段限制走位",
                img: `${base}/assets/images/hero/Apex_Icon_Wattson_Tier_3.webp`,
                video: "https://www.youtube.com/embed/BuqnLGbjhkY?rel=0"
            },
            {
                name: "蕾帕特 Rampart",
                title: "控制",
                positioning: "2號位 3號位",
                advantage_weapons: "衝鋒槍 射手武器",
                role_positioning: "戰術牆體堆疊放避免被提前損壞，打架隨時放牆體",
                img: `${base}/assets/images/hero/Hellforger_Rampart.webp`,
                video: "https://www.youtube.com/embed/ANdAEztmFiA?rel=0"
            }
        ],
        'support': [
            {
                name: "直布羅陀 Gibraltar",
                title: "支援",
                positioning: "2號位 3號位",
                advantage_weapons: "霰彈槍",
                role_positioning: "戰術技能泡泡提前預下比受傷了再使用更好，霰彈槍勝率高",
                img: `${base}/assets/images/hero/Brudda_Bear_Gibraltar.webp`,
                video: "https://www.youtube.com/embed/ccDyztf9FjU?rel=0"
            },
            {
                name: "生命線 Lifeline\t",
                title: "支援",
                positioning: "2號位 3號位",
                advantage_weapons: "射手武器",
                role_positioning: "利用鉤繩製造大範圍槍線，製造壓力打出破口",
                img: `${base}/assets/images/hero/Apex_Corruptor_Lifeline_Tier_3.webp`,
                video: "https://www.youtube.com/embed/PxOCScALl1M?rel=0"
            },
            {
                name: "導管 Conduit",
                title: "支援",
                positioning: "2號位 3號位",
                advantage_weapons: "步槍 射手武器",
                role_positioning: "絕招能量封鎖路線，強迫敵人變換位置",
                img: `${base}/assets/images/hero/Undying_Optimism_Conduit.webp`,
                video: "https://www.youtube.com/embed/rf8QuG1kbAI?rel=0"
            },
            {
                name: "幻象 Mirage",
                title: "支援",
                positioning: "1號位 2號位 3號位",
                advantage_weapons: "衝鋒槍",
                role_positioning: "戰術技能幻象留在轉角使用效果好，絕招救隊友前使用擾亂敵人",
                img: `${base}/assets/images/hero/Marked_Man_Mirage.webp`,
                video: "https://www.youtube.com/embed/gPHlrmyM8v4?rel=0"
            },
            {
                name: "羅芭 Loba",
                title: "支援",
                positioning: "2號位 3號位",
                advantage_weapons: "步槍 射手武器",
                role_positioning: "尾圈多利用絕招黑市偷取手雷增加勝率",
                img: `${base}/assets/images/hero/Apex_Lycanthrope_Loba_Tier_1.webp`,
                video: "https://www.youtube.com/embed/iRzZGQEPwY4?rel=0"
            },
            {
                name: "紐卡索 Newcastle",
                title: "支援",
                positioning: "2號位 3號位",
                advantage_weapons: "霰彈槍",
                role_positioning: "白給位戰術技能護盾提前預下，絕招可拿來跳制高點",
                img: `${base}/assets/images/hero/Weekend_Killer_Newcastle.webp`,
                video: "https://www.youtube.com/embed/rVVvu-SsV3I?rel=0"
            }
        ]
    };

    const roleBtns = document.querySelectorAll('.role-item');
    const listContainer = document.getElementById('dossierListContainer');

    roleBtns.forEach(btn => {
        btn.onclick = () => {
            roleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const role = btn.getAttribute('data-role');
            const heroes = legendsData[role] || [];

            renderHeroSquares(heroes);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    });

    function renderHeroSquares(heroes) {
        listContainer.innerHTML = ''; // Clear current squares

        heroes.forEach(hero => {
            const square = document.createElement('div');
            square.className = 'hero-display-square';
            square.innerHTML = `
                <div class="quadrant lt-image">
                    <img src="${hero.img}" alt="${hero.name}">
                </div>
                <div class="quadrant rt-video">
                    <iframe src="${hero.video}" allowfullscreen></iframe>
                </div>
                <div class="quadrant lb-name">
                    <h2>${hero.name}</h2>
                    <p style="font-weight: bold;">${hero.title}</p>
                </div>
                <div class="quadrant rb-details">
                    <div class="ability-item">
                        <span class="ability-label" style="color: #aaa">角色定位</span>
                        <p class="ability-name" style="color: #ff4444; font-weight: bold;">${hero.role_positioning}</p>
                    </div>                
                    <div class="ability-item">
                        <span class="ability-label" style="color: #aaa">優勢武器</span>
                        <p class="ability-name">${hero.advantage_weapons}</p>
                    </div>                    
                    <div class="ability-item">
                        <span class="ability-label" style="color: #aaa">適合站位</span>
                        <p class="ability-name">${hero.positioning}</p>
                    </div>
                </div>
            `;
            listContainer.appendChild(square);
        });
    }

    // Initial load
    if (roleBtns[0]) roleBtns[0].click();
}

/**
 * MAPS PAGE LOGIC - Orbital Tactical HUD (Enhanced Radar)
 */
function initMapsPage() {
    let isAborted = false;
    const terminateBtn = document.getElementById('terminate-slideshow');

    if (terminateBtn) {
        terminateBtn.onclick = () => {
            isAborted = true; // Signal the loop to stop
            resetHUD();      // Immediately clean up the UI
        };
    }

    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const frame = document.getElementById('planetFrame');
    const buttonLayer = document.getElementById('button-layer');
    const dataFeed = document.getElementById('data-feed');
    const viewAbc = document.getElementById('view-abc');
    const captionBox = document.getElementById('caption-container');
    const captionText = document.getElementById('caption-text');
    const typeSound = document.getElementById('typeSound');
    const districtList = document.getElementById('district-list');

    // --- State & Constants ---
    const size = 600;
    canvas.width = canvas.height = size;
    let scrollX = 0, scanAngle = 0, isAutoZooming = false;

    // Use 'base' variable for SPA pathing
    const targets = [
        { id: 1, tx: 150, ty: 200, name: "Broken Moon", slides: [
                { img: 'assets/images/maps/Broken_Moon/Broken_Moon_Eternal_Gardens_Concept_Art.webp', text: "> Broken Moon Eternal Gardens Concept Art" },
                { img: 'assets/images/maps/Broken_Moon/Transition_Broken_Moon.webp', text: "> Transition Broken Moon" },
                { img: 'assets/images/maps/Broken_Moon/Transition_Broken_Moon_MU1.webp', text: "> Transition Broken Moon MU1" }
            ]},
        { id: 2, tx: 450, ty: 400, name: "E-District", slides: [
                { img: 'assets/images/maps/E-District/E-District.webp', text: "> E-District" },
                { img: 'assets/images/maps/E-District/E-District2.webp', text: "> E-District MU2" },
                { img: 'assets/images/maps/E-District/E-District3.webp', text: "> E-District MU3" },
                { img: 'assets/images/maps/E-District/E-District4.webp', text: "> E-District MU4" }
            ]},
        { id: 3, tx: 750, ty: 250, name: "King's Canyon", slides: [
                { img: 'assets/images/maps/Kings_Canyon/ConceptArt_Cliff_Childs_Kings_Canyon_Market_01.webp', text: "> ConceptArt Cliff Child's King's Canyon Market" },
                { img: 'assets/images/maps/Kings_Canyon/Transition_Kings_Canyon.webp', text: "> Transition King's Canyon" },
                { img: 'assets/images/maps/Kings_Canyon/Transition_Kings_Canyon_MU1.webp', text: "> Transition King's Canyon MU1" },
                { img: 'assets/images/maps/Kings_Canyon/Transition_Kings_Canyon_MU2.webp', text: "> Transition King's Canyon MU2" },
                { img: 'assets/images/maps/Kings_Canyon/Transition_Kings_Canyon_MU3.webp', text: "> Transition King's Canyon MU3" },
                { img: 'assets/images/maps/Kings_Canyon/Transition_Kings_Canyon_MU4.webp', text: "> Transition King's Canyon MU4" }
            ]},
        { id: 4, tx: 1050, ty: 300, name: "Olympus", slides: [
                { img: 'assets/images/maps/Olympus/ConceptArt_Liam_MacDonald_Olympus_2 (1).webp', text: "> ConceptArt Liam MacDonald Olympus" },
                { img: 'assets/images/maps/Olympus/Transition_Olympus.webp', text: "> Transition Olympus" },
                { img: 'assets/images/maps/Olympus/Transition_Olympus_MU1.webp', text: "> Transition Olympus MU1" },
                { img: 'assets/images/maps/Olympus/Transition_Olympus_MU1_2.webp', text: "> Transition Olympus MU1_2" },
                { img: 'assets/images/maps/Olympus/Transition_Olympus_MU2.webp', text: "> Transition Olympus MU2" }
            ]},
        { id: 5, tx: 1350, ty: 380, name: "Storm Point", slides: [
                { img: 'assets/images/maps/Storm_Point/Transition_Storm_Point.webp', text: "> Transition Storm Point" },
                { img: 'assets/images/maps/Storm_Point/Transition_Storm_Point_MU1.webp', text: "> Transition Storm Point MU1" },
                { img: 'assets/images/maps/Storm_Point/Transition_Storm_Point_MU2.webp', text: "> Transition Storm Point MU2" }
            ]},
        { id: 6, tx: 1650, ty: 450, name: "World's Edge", slides: [
                { img: 'assets/images/maps/World_Edge/Transition_World_Edge.webp', text: "> Transition World's Edge" },
                { img: 'assets/images/maps/World_Edge/Transition_World_Edge_After_Dark.webp', text: "> Transition World's Edge After Dark" },
                { img: 'assets/images/maps/World_Edge/Transition_World_Edge_MU1.webp', text: "> Transition World's Edge MU1" },
                { img: 'assets/images/maps/World_Edge/Transition_World_Edge_MU2.webp', text: "> Transition World's Edge MU2" },
                { img: 'assets/images/maps/World_Edge/Transition_World_Edge_MU3.webp', text: "> Transition World's Edge MU3" },
                { img: 'assets/images/maps/World_Edge/Transition_World_Edge_MU4.webp', text: "> Transition World's Edge MU4" }

            ]}
    ];

    // --- Background Buffer (Texture Canvas) ---
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 1800; texCanvas.height = 600;
    const tCtx = texCanvas.getContext('2d');
    tCtx.fillStyle = '#001a0d';
    tCtx.fillRect(0, 0, 1800, 600);

    targets.forEach(t => {
        let grad = tCtx.createRadialGradient(t.tx, t.ty, 0, t.tx, t.ty, 150);
        grad.addColorStop(0, "rgba(255, 50, 50, 0.08)");
        grad.addColorStop(1, "transparent");
        tCtx.fillStyle = grad;
        tCtx.beginPath(); tCtx.arc(t.tx, t.ty, 150, 0, Math.PI * 2); tCtx.fill();
    });

    // --- Helpers ---
    const wait = (ms) => new Promise(res => setTimeout(res, ms));

    async function typeText(text) {
        // 1. Ensure the container preserves spaces and wraps correctly
        captionText.style.whiteSpace = "pre-wrap";
        captionText.innerText = "";

        for (let i = 0; i < text.length; i++) {
            if (isAborted) return;

            // Use textContent or append to ensure spaces are treated as characters
            captionText.textContent += text[i];

            // Only play sound if the character is NOT a space (sounds more natural)
            if (text[i] !== " " && i < text.length - 1) {
                typeSound.currentTime = 0;
                typeSound.play().catch(() => {});
            }

            // Slight pause for every character
            await wait(50);
        }
    }

    // --- Setup Buttons ---
    buttonLayer.innerHTML = ''; // Clear for SPA re-entry
    targets.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'target-btn';
        btn.id = `btn-${t.id}`;
        btn.onclick = () => initiateLanding(t);
        buttonLayer.appendChild(btn);
    });

// --- Setup Buttons ---
    buttonLayer.innerHTML = '';
    targets.forEach(t => {
        const btn = document.createElement('button');
        btn.className = 'target-btn';
        // Ensure the ID matches what we will look for (btn-1, btn-2, etc.)
        btn.id = `btn-${t.id}`;
        btn.setAttribute('data-id', `sector_0${t.id}`); // Add this to match your HTML data-id
        btn.onclick = () => initiateLanding(t);
        buttonLayer.appendChild(btn);
    });

    // ==========================================
    // NEW: DISTRICT LIST LISTENER
    // ==========================================
    if (districtList) {
        districtList.addEventListener('click', (e) => {
            const item = e.target.closest('.district-item');
            if (!item) return;

            const sectorId = item.getAttribute('data-id');
            console.log("Looking for button with data-id:", sectorId); // Debugging line

            const matchingBtn = buttonLayer.querySelector(`[data-id="${sectorId}"]`);
            if (matchingBtn) {
                matchingBtn.click();
            } else {
                console.error("No matching radar button found for:", sectorId);
            }
        });
    }
    // ==========================================

    async function initiateLanding(target) {
        if (isAutoZooming) return;
        isAutoZooming = true;
        isAborted = false; // Reset the flag whenever a new map is clicked
        buttonLayer.style.display = 'none';

        let sX = (target.tx - (scrollX % 1800));
        while (sX < 0) sX += 1800; sX = sX % 1800;

        dataFeed.innerText = `LINKING TO ${target.name.toUpperCase()}...`;
        frame.style.transformOrigin = `${sX}px ${target.ty}px`;
        frame.classList.add('auto-zooming');

        await wait(2400);

        if (isAborted) return; // Stop if user clicked terminate during zoom

        document.getElementById('flash').style.opacity = "1";
        await wait(600);
        document.getElementById('flash').style.opacity = "0";

        for (let slide of target.slides) {
            if (isAborted) break; // Exit the loop immediately

            viewAbc.style.backgroundImage = `url('${slide.img}')`;
            await wait(300);
            viewAbc.classList.add('active-view');
            captionBox.classList.add('caption-active');
            await typeText(slide.text);
            //await wait(3000);

            let waitTime = 3000;
            while(waitTime > 0 && !isAborted) {
                await wait(100);
                waitTime -= 100;
            }

         /*   viewAbc.classList.remove('active-view');
              captionBox.classList.remove('caption-active');  */   
            await wait(1500);
        }

        if (!isAborted) resetHUD(); // Only call here if it finished naturally

        // Reset
        frame.classList.remove('auto-zooming');
        buttonLayer.style.display = 'block';
        dataFeed.innerText = "ORBITAL LINK RESTORED";
        isAutoZooming = false;
        animate();
    }

    function resetHUD() {
        frame.classList.remove('auto-zooming');
        viewAbc.classList.remove('active-view');
        captionBox.classList.remove('caption-active');
        buttonLayer.style.display = 'block';

        // Feedback in the data feed
        dataFeed.innerText = isAborted ? "LINK TERMINATED" : "ORBITAL LINK RESTORED";

        isAutoZooming = false;
        animate(); // Restart the radar canvas loop
    }

    function animate() {
        // Stop animation loop if user leaves the page or is zooming
        if (isAutoZooming || !document.getElementById('starCanvas')) return;

        ctx.clearRect(0, 0, size, size);
        const r = size / 2;

        ctx.save();
        // Circular Clipping
        ctx.beginPath(); ctx.arc(r, r, r - 5, 0, Math.PI * 2); ctx.clip();

        // Draw the Scrolling Texture
        ctx.drawImage(texCanvas, -(scrollX % 1800), 0);
        ctx.drawImage(texCanvas, 1800 - (scrollX % 1800), 0);

        // --- GREEN TACTICAL GRID (Concentric Circles) ---
        ctx.strokeStyle = "rgba(0, 255, 102, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(0, 255, 102, 0.8)";
        for (let i = 1; i < 4; i++) {
            ctx.beginPath(); ctx.arc(r, r, (r / 4) * i, 0, Math.PI * 2); ctx.stroke();
        }

        // --- CROSSHAIRS ---
        ctx.beginPath();
        ctx.moveTo(r, 0); ctx.lineTo(r, size);
        ctx.moveTo(0, r); ctx.lineTo(size, r);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // --- GREEN SPIN LIGHT (Radar Sweep) ---
        scanAngle += 0.03;
        let scanGrad = ctx.createConicGradient(scanAngle, r, r);
        scanGrad.addColorStop(0, "rgba(0, 255, 102, 0.3)");
        scanGrad.addColorStop(0.1, "rgba(0, 255, 102, 0)");
        ctx.fillStyle = scanGrad;
        ctx.beginPath(); ctx.arc(r, r, r, 0, Math.PI * 2); ctx.fill();

        // --- TARGETS ---
        const rect = canvas.getBoundingClientRect();
        const displayScale = rect.width / size;
        const pulseFactor = (Math.sin(Date.now() / 400) + 1) / 2;

        targets.forEach(t => {
            let sX = (t.tx - (scrollX % 1800));
            while (sX < 0) sX += 1800; sX = sX % 1800;

            if (sX < size) {
                const btn = document.getElementById(`btn-${t.id}`);
                if (btn) {
                    btn.style.left = `${sX * displayScale}px`;
                    btn.style.top = `${t.ty * displayScale}px`;
                }

                ctx.save();
                // Red Target Circle
                ctx.beginPath(); ctx.arc(sX, t.ty, 6 + (pulseFactor * 3), 0, Math.PI * 2);
                ctx.strokeStyle = "#FF3333";
                ctx.lineWidth = 2.5;
                ctx.shadowBlur = 10;
                ctx.shadowColor = "red";
                ctx.stroke();

                // Target Label
                ctx.fillStyle = "#00FF66";
                ctx.font = "22px 'Courier New'";
                ctx.shadowBlur = 1;
                ctx.shadowColor = "rgba(0, 255, 102, 0.5)";
                ctx.fillText(t.name, sX + 20, t.ty + 7);
                ctx.restore();
            }
        });

        scrollX += 0.8;
        ctx.restore();
        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * WEAPONS PAGE LOGIC
 */
function initWeaponsPage() {
    const weaponData = {
        'marksman': {
            title: "射手武器",
            desc: "中遠程武器 - 節省彈藥.點射.中距離輸出穩定",
            guns: [
                { name: "30-30 Repeater", info: "第一發蓄力高傷害", img: `${base}/assets/images/weapons/marksman/30-30_Repeater.webp`, stats: [3, 4, 3, 3, 2] },
                { name: "Bocek Compound Bow", info: "無須彈藥儲備.不用裝填", img: `${base}/assets/images/weapons/marksman/Bocek_Compound_Bow.webp`, stats: [4, 4, 5, 3, 5] },
                { name: "G7 Scout", info: "高射速.中傷害", img: `${base}/assets/images/weapons/marksman/G7_Scout.webp`, stats: [4, 3, 5, 4, 3] },
                { name: "Triple Take", info: "稍微蓄力.各項水平平均", img: `${base}/assets/images/weapons/marksman/Triple_Take.webp`, stats: [3, 4, 4, 3, 1] }
            ]
        },
        'sniper': {
            title: "狙擊武器",
            desc: "遠程武器 - 射速慢.彈藥需求低.高傷害.可穿透",
            guns: [
                { name: "Charge Rifle", info: "距離越遠傷害越高.可破門", img: "/assets/images/weapons/sniper/Charge_Rifle.webp", stats: [3, 4, 3, 5, 3] },
                { name: "Longbow DMR", info: "中傷害.高彈夾容量", img: "/assets/images/weapons/sniper/Longbow_DMR.webp", stats: [3, 3, 5, 4, 3] },
                { name: "Sentinel", info: "充能加傷害射速", img: "/assets/images/weapons/sniper/Sentinel.webp", stats: [4, 3, 2, 3, 4] }
            ]
        },
        'rifle': {
            title: "步槍",
            desc: "中遠程武器 - 中距離輸出高.彈藥消耗多.爆發傷害偏高",
            guns: [
                { name: "HAVOC Rifle", info: "渦輪高傷害高射速", img: `${base}/assets/images/weapons/rifle/HAVOC_Rifle.webp`, stats: [5, 1, 5, 2, 5] },
                { name: "Hemlok Burst AR", info: "三連發遠程穩", img: `${base}/assets/images/weapons/rifle/Hemlok_Burst_AR.webp`, stats: [4, 3, 4, 4, 3] },
                { name: "Nemesis Burst AR", info: "四連發遠程穩.充能射速快", img: `${base}/assets/images/weapons/rifle/Nemesis_Burst_AR.webp`, stats: [4, 4, 3, 4, 2] },
                { name: "R-301 Carbine", info: "平均水平", img: `${base}/assets/images/weapons/rifle/R-301_Carbine.webp`, stats: [3, 5, 3, 3, 1] },
                { name: "VK-47 Flatline", info: "射色稍慢.傷害中高", img: `${base}/assets/images/weapons/rifle/VK-47_Flatline.webp`, stats: [4, 2, 3, 2, 3] }
            ]
        },
        'pistol': {
            title: "手槍",
            desc: "中近距離武器 - 持槍移速高.單發傷害高",
            guns: [
                { name: "P2020", info: "高彈夾量容錯率高.雙持腰射準", img: `${base}/assets/images/weapons/pistol/P2020.webp`, stats: [3, 4, 4, 3, 2] },
                { name: "RE-45 Auto", info: "4連發.充能射速快", img: `${base}/assets/images/weapons/pistol/RE-45_Auto.webp`, stats: [5, 1, 3, 2, 5] },
                { name: "Wingman", info: "單發高傷害.暴頭傷害高.中射速.可開門", img: `${base}/assets/images/weapons/pistol/Wingman.webp`, stats: [4, 2, 3, 3, 5] }
            ]
        },
        'smg': {
            title: "衝鋒槍",
            desc: "中近距離武器 - 彈藥消耗高.瞬間爆發傷害高",
            guns: [
                { name: "Alternator SMG", info: "射速慢.中傷害", img: `${base}/assets/images/weapons/smg/Alternator_SMG.webp`, stats: [2, 5, 4, 3, 1] },
                { name: "C.A.R. SMG", info: "高射速.中傷害", img: `${base}/assets/images/weapons/smg/C.A.R._SMG.webp`, stats: [4, 3, 3, 2, 3] },
                { name: "Prowler Burst PDW", info: "五連發可中距離.中傷害", img: `${base}/assets/images/weapons/smg/Prowler_Burst_PDW.webp`, stats: [4, 2, 4, 3, 4] },
                { name: "R-99 SMG", info: "最高射速.中傷害", img: `${base}/assets/images/weapons/smg/R-99_SMG.webp`, stats: [5, 1, 3, 1, 5] },
                { name: "Volt SMG", info: "中射速可中距離. 高傷害", img: `${base}/assets/images/weapons/smg/Volt_SMG.webp`, stats: [3, 4, 4, 3, 2] }
            ]
        },
        'shotgun': {
            title: "霰彈槍",
            desc: "近距離武器 - 彈藥需求低.瞬間爆發傷害",
            guns: [
                { name: "EVA-8 Auto", info: "中傷害.連發高射速", img: `${base}/assets/images/weapons/shotgun/EVA-8_Auto.webp`, stats: [3, 4, 5, 1, 3] },
                { name: "Mastiff Shotgun", info: "單發高傷害.可單發填裝彈藥", img: `${base}/assets/images/weapons/shotgun/Mastiff_Shotgun.webp`, stats: [4, 3, 3, 2, 4] },
                { name: "Mozambique Shotgun", info: "雙持連發高射速.高彈夾容量", img: `${base}/assets/images/weapons/shotgun/Mozambique_Shotgun.webp`, stats: [3, 3, 4, 3, 3] },
                { name: "Peacekeeper", info: "單發高傷害.可束能遠射", img: `${base}/assets/images/weapons/shotgun/Peacekeeper.webp`, stats: [5, 2, 3, 3, 5] }
            ]
        },
        'lmg': {
            title: "輕機槍",
            desc: "中距離武器 - 彈夾容量大.輸出穩定",
            guns: [
                { name: "Devotion LMG", info: "啟動時間慢.啟動後瞬傷高", img: `${base}/assets/images/weapons/lmg/Devotion_LMG.webp`, stats: [5, 3, 5, 1, 4] },
                { name: "L-STAR EMG", info: "無須裝填彈藥", img: `${base}/assets/images/weapons/lmg/L-STAR_EMG.webp`, stats: [3, 2, 4, 3, 3] },
                { name: "M600 Spitfire", info: "平均水平", img: `${base}/assets/images/weapons/lmg/M600_Spitfire.webp`, stats: [3, 3, 4, 3, 2] },
                { name: "Rampage LMG", info: "充能高傷害高射速.可破門", img: `${base}/assets/images/weapons/lmg/Rampage_LMG.webp`, stats: [4, 4, 3, 3, 4] }
            ]
        }
    };

    const categoryItems = document.querySelectorAll('.weapon-item');
    const subListContainer = document.getElementById('weaponSubList');
    const displayArea = document.getElementById('weaponDetail');
    const titleEl = document.getElementById('detailTitle');
    const descEl = document.getElementById('detailDesc');
    const gunNameEl = document.getElementById('gunName');
    const gunInfoEl = document.getElementById('gunInfo');
    const imgEl = document.getElementById('detailImg');
    const canvas = document.getElementById('radarChart');

    const updateChart = (stats, label) => {
        // Stop any previous animation loops
        if (pulseAnimationId) cancelAnimationFrame(pulseAnimationId);
        if (myRadarChart) myRadarChart.destroy();

        const ctx2d = canvas.getContext('2d');

        myRadarChart = new Chart(ctx2d, {
            type: 'radar',
            data: {
                labels: ['DPS', '穩定度', '彈夾容量', '射程', '上手難度'],
                datasets: [{
                    label: label,
                    data: stats,
                    backgroundColor: 'rgba(255, 0, 0, 0.4)',
                    borderColor: 'rgba(255, 50, 50, 1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: 'rgb(255, 0, 0)',
                    pointRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1500, easing: 'easeOutElastic' },
                scales: {
                    r: {
                        min: 0,
                        max: 5,
                        ticks: { display: false, stepSize: 1 },
                        grid: {
                            // 1. Increase Opacity (from 0.15 to 0.4 or 0.5)
                            color: 'rgba(255, 255, 255, 0.4)',
                            // 2. Increase Thickness (default is 1)
                            lineWidth: 2,
                            circular: true
                        },
                        angleLines: {
                            // You can also brighten the diagonal lines to match
                            color: 'rgba(255, 255, 255, 0.3)',
                            lineWidth: 1.5
                        },
                        pointLabels: {
                            color: '#FFD700',
                            font: { size: 13, weight: 'bold' }
                        }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });

        // INFINITE PULSE LOOP
        let start = Date.now();
        function animatePulse() {
            const time = (Date.now() - start) / 1000;
            // Pulse opacity between 0.3 and 0.7
            const alpha = 0.5 + 0.2 * Math.sin(time * 2.5);

            if (myRadarChart && myRadarChart.data.datasets[0]) {
                myRadarChart.data.datasets[0].backgroundColor = `rgba(255, 0, 0, ${alpha * 0.8})`;
                myRadarChart.data.datasets[0].borderColor = `rgba(255, 50, 50, ${alpha})`;
                myRadarChart.update('none'); // Update without re-triggering entrance animation
            }
            pulseAnimationId = requestAnimationFrame(animatePulse);
        }
        animatePulse();
    };

    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            categoryItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const type = item.getAttribute('data-type');
            const data = weaponData[type];

            if (data) {
                titleEl.innerText = data.title;
                descEl.innerText = data.desc;
                subListContainer.innerHTML = '';
                displayArea.style.display = 'none';
                displayArea.style.opacity = '0';
                displayArea.style.transform = 'translateY(20px)';

                data.guns.forEach(gun => {
                    const btn = document.createElement('button');
                    btn.className = 'btn btn-outline-warning btn-sm px-3 py-2';
                    btn.innerText = gun.name;
                    btn.onclick = () => {
                        subListContainer.querySelectorAll('button').forEach(b => b.classList.replace('btn-warning', 'btn-outline-warning'));
                        btn.classList.replace('btn-outline-warning', 'btn-warning');

                        displayArea.style.display = 'block';
                        setTimeout(() => {
                            displayArea.style.opacity = '1';
                            displayArea.style.transform = 'translateY(0)';
                            gunNameEl.innerText = gun.name;
                            typeWriter(gunInfoEl, gun.info, 50);
                            imgEl.src = gun.img;
                            updateChart(gun.stats, gun.name);
                        }, 50);
                    };
                    subListContainer.appendChild(btn);
                });
            }
        });
    });

    if (categoryItems[0]) categoryItems[0].click();
}

/**
 * REMOTE VISIT COUNTER LOGIC
 */
async function syncVisitorCount() {
    const countElement = document.getElementById('count-number');
    const apiEndpoint = './visit_count/apex.php';

    try {
        // We use fetch to notify the PHP script
        const response = await fetch(apiEndpoint, {
            method: 'POST', // Usually POST for updating data
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        console.log("API Data Received:", data); // Check if data actually arrives

        // Update the UI with the number from MySQL
        if (countElement && data.count) {
            countElement.innerText = Number(data.count).toLocaleString();
        }
    } catch (error) {
        console.error('Visitor record update failed:', error);
        if (countElement) countElement.innerText = "Unavailable";
    }
}

