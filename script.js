document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    });

    const bannerWrapper = document.getElementById('banner-wrapper');
    const bannerBtn = document.getElementById('hackathon-btn');
    if (bannerWrapper && bannerBtn) {
        bannerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            bannerWrapper.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!bannerWrapper.contains(e.target)) bannerWrapper.classList.remove('open');
        });
    }

    const scrollContainer = document.getElementById('gallery-scroll');
    const btnLeft = document.getElementById('scroll-left');
    const btnRight = document.getElementById('scroll-right');
    if (scrollContainer && btnLeft && btnRight) {
        btnLeft.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
        });
        btnRight.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }
});