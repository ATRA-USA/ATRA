let scrollStarted = false;

function onPageLoaded() {
  console.log("page loaded");
  renderBannerStructure();
 /* updateClock();*/
  updateBannerContent();
  setInterval(updateBannerContent, 1000);
}

function calculateRallyTiming() {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday

    const rallyStart = new Date(now);
    rallyStart.setHours(13, 0, 0, 0); // 1pm

    const rallyEnd = new Date(now);
    rallyEnd.setHours(15, 0, 0, 0); // 3pm

    // m1 t2 w3 th4 f5 s6 sn7
    const daysUntilSaturday = (6 - day + 7) % 7 || 7; 
    const nextSaturday = new Date(now);
    nextSaturday.setDate(now.getDate() + daysUntilSaturday);

    const shortMonth = nextSaturday.toLocaleString("en-US", { month: "short" });
    const dayNum = nextSaturday.getDate();
    const formattedRight = `${shortMonth}. ${dayNum}`;

    const timeUntilStartMs = rallyStart - now;
    const timeUntilEndMs = rallyEnd - now;

    return {
        now,
        day,
        rallyStart,
        rallyEnd,
        daysUntilSaturday,
        nextSaturday,
        formattedRight,
        timeUntilStartMs,
        timeUntilEndMs
    };
}
function getRallyStatusStrings(timing) {
    const { day, timeUntilStartMs, timeUntilEndMs, formattedRight, daysUntilSaturday } = timing;

    if (day === 6) {
        if (timeUntilEndMs > 0 && timeUntilStartMs <= 0) {
            const hrs = Math.floor(timeUntilEndMs / (1000 * 60 * 60));
            const mins = Math.floor((timeUntilEndMs % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((timeUntilEndMs % (1000 * 60)) / 1000);
            return {
                type: "now",
                track: `Rally Ongoing<span class="banner-track-space"></span>updated live`,
                left: `right now<br>${hrs}h:${mins}m:${secs}s`,
                right: "Until 3pm"
            };
        } else if (timeUntilStartMs > 0) {
            const hrs = Math.floor(timeUntilStartMs / (1000 * 60 * 60));
            const mins = Math.floor((timeUntilStartMs % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((timeUntilStartMs % (1000 * 60)) / 1000);
            return {
                type: "today",
                track: `later today<span class="banner-track-space"></span>updated live`,
                left: "Saturday,<br>1pm to 3pm",
                right: `${hrs}h:${mins}m:${secs}s`
            };
        }
    }
 return {
        type: "next",
        track: `next rally<span class="banner-track-space"></span><span class="highlight-b">in ${daysUntilSaturday} days</span><span class="banner-track-space"></span>updated live`,
        left: "Saturday,<br>1pm to 3pm",
        right: formattedRight
    };
}

function updateBanner() {
    const timing = calculateRallyTiming();
    const { type, left, right, track } = getRallyStatusStrings(timing);

    const banner = document.getElementById("RallyBanner");
    banner.className = `banner ${type}`;
    banner.style.display = "block";

    const sections = [
        { selector: ".banner-date-left", content: `<div>${left}</div>` },
        { selector: ".banner-date-right", content: right }
    ];

    sections.forEach(({ selector, content }) => {
        const container = banner.querySelector(selector);
        let contentDiv = container.querySelector(".banner-content");

        if (!contentDiv) {
            contentDiv = document.createElement("div");
            contentDiv.className = "banner-content";
            container.innerHTML = "";
            container.appendChild(contentDiv);
        }

        contentDiv.innerHTML = content;
    });

    updateBannerTrack(track);
}
function renderBannerStructure() {
  const banner = document.getElementById("RallyBanner");
  banner.className = "banner";
  banner.style.display = "block";

  const leftContainer = document.querySelector(".banner-date-left");
  const rightContainer = document.querySelector(".banner-date-right");
  const trackContainer = document.querySelector(".banner-track");

  // Create content divs if missing
  [leftContainer, rightContainer, trackContainer].forEach(container => {
    if (!container.querySelector(".banner-content")) {
      const contentDiv = document.createElement("div");
      contentDiv.className = "banner-content";
      container.innerHTML = "";
      container.appendChild(contentDiv);
    }
  });

  // Add multiple track spans once
  trackContainer.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    const contentDiv = document.createElement("div");
    contentDiv.className = "banner-content";
    trackContainer.appendChild(contentDiv);
  }
}
function updateBannerContent() {
  const timing = calculateRallyTiming();
  const { type, left, right, track } = getRallyStatusStrings(timing);

  const banner = document.getElementById("RallyBanner");
  banner.className = `banner ${type}`;

  const leftContent = document.querySelector(".banner-date-left .banner-content");
  const rightContent = document.querySelector(".banner-date-right .banner-content");
  const trackContents = document.querySelectorAll(".banner-track .banner-content");

  if (leftContent) leftContent.innerHTML = `<div>${left}</div>`;
  if (rightContent) rightContent.innerHTML = right;
  trackContents.forEach(el => el.innerHTML = track);
}

function updateBannerTrack(trackText) {
    const track = document.querySelector(".banner-track");
    if (!track) return;

    track.innerHTML = ""; // clear existing content

    for (let i = 0; i < 4; i++) {
        const contentDiv = document.createElement("div");
        contentDiv.className = "banner-content";
        contentDiv.innerHTML = trackText;
        track.appendChild(contentDiv);
    }
}
/*
function updateClock() {
    const now = new Date(); // Create a new Date object for the current time
    let hours = now.getHours(); // Get the current hour (0-23)
    let minutes = now.getMinutes(); // Get the current minute (0-59)
    let seconds = now.getSeconds(); // Get the current second (0-59)

    // Optional: Add leading zeros for single-digit minutes and seconds
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // Display the time in the HTML element
    document.getElementById("currentTime").textContent = `${hours}:${minutes}:${seconds}`;
    setInterval(updateClock, 1000); // 1000 milliseconds = 1 second
}
/**/
