const screenWidth = window.innerWidth;

if (screenWidth < 508) {
    document.querySelector('.navbar').style.width = '508px';
}

window.addEventListener("resize", () => {
    if (screenWidth < 508) {
        document.querySelector('.navbar').style.width = '508px';
    }
    else {
        document.querySelector('.navbar').style.width = '100%';
    }
})