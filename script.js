function onPageLoaded() {
    // Write your javascript code here
    console.log("page loaded");
    updateBanner();
}

document.addEventListener("DOMContentLoaded", function () {
    // Listen for clicks on elements with the class 'play-button'
    document.querySelectorAll(".play-button").forEach(function (button) {
        button.addEventListener("click", function () {
            // When a play button is clicked, simulate a click on the <a> tag within the same .video-container
            this.parentNode.querySelector("a").click();
        });
    });
});

function getRallyStatus() {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();

    const rallyStart = new Date(now);
    rallyStart.setHours(13, 0, 0, 0);

    const rallyEnd = new Date(now);
    rallyEnd.setHours(15, 0, 0, 0);
   
    const daysLeft = day === 6 && now >= rallyEnd ? 7 : (6 - day + 7) % 7 || 7;

    if (day === 6) {
        if (now >= rallyStart && now < rallyEnd) {
            const timeLeftMs = rallyEnd - now;
            const hrs = Math.floor(timeLeftMs / (1000 * 60 * 60));
            const mins = Math.floor((timeLeftMs % (1000 * 60 * 60)) / (1000 * 60));
            return {
                type: "now",
                parts: [
                    `<span class="highlight-w">right now</span>`,
                    `<span class="highlight-b">for the next ${hrs} hour${hrs !== 1 ? "s" : ""} and ${mins} minute${mins !== 1 ? "s" : ""}</span>`,
                    `<span class="highlight-w">until 3pm</span>`
                    
                ]
            };
        } else if (now < rallyStart) {
            const timeUntilMs = rallyStart - now;
            const hrs = Math.floor(timeUntilMs / (1000 * 60 * 60));
            const mins = Math.floor((timeUntilMs % (1000 * 60 * 60)) / (1000 * 60));
            return {
                type: "today",
                parts: [
                    `<span class="highlight-w">today!</span>`,
                    `<span class="highlight-b">starts in ${hrs} hour${hrs !== 1 ? "s" : ""} and ${mins} minute${mins !== 1 ? "s" : ""}</span>`,
                    `<span class="highlight-w"> @ 1pm/3pm</span>`        
                ]
            };            
        }
    }

    const nextSaturday = new Date(now);
    const daysUntilSaturday = (6 - day + 7) % 7 || 7;
    nextSaturday.setDate(now.getDate() + daysUntilSaturday);
    const options = { month: "long", day: "numeric" };
    const formattedDate = nextSaturday.toLocaleDateString("en-US", options);
    return {
        type: "next",
        parts: [
            `<span class="highlight-w">next rally</span>`,
            `<span class="highlight-b">${formattedDate}</span>`,
            `<span class="highlight-w">Sat</span>`,
            `<span class="highlight-w">1pm 3pm</span>`,
            `<span class="highlight-b">in ${daysLeft} days</span>`
        ]
    };
}

function updateBanner() {
  const { type, parts } = getRallyStatus();
  const banner = document.getElementById("RallyBanner");
  const contents = banner.querySelectorAll(".banner-content");

  banner.className = `banner ${type}`;
  const messageHTML = parts.join(" ");

  contents.forEach(el => {
    el.innerHTML = messageHTML;
  });

  banner.style.display = "block";
}
