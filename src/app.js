

//observer

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: unobserve if you only want to animate once
            // observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1 // Trigger when 10% of the element is visible
});

document.querySelectorAll('.explanation-ani').forEach(el=>{
    observer.observe(el)
})
document.querySelectorAll('.main-exam-cont p').forEach(el=>{
    observer.observe(el)
})
document.querySelectorAll('.main-exam-cont h1').forEach(el=>{
    observer.observe(el)
})