/**
 * ORBIT 2K26 - MOODLAKATTE INSTITUTE OF TECHNOLOGY KUNDAPURA (MITK)
 * Interactive Application Logic & Dimensional Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Modules
  initSoundSystem();
  initParticleCanvas();
  initCountdownTimer();
  initEventsCatalog();
  initScheduleTabs();
  initNavbarScroll();
  initSlideObserver();
  initModals();
  initRegistrationForm();
});

/* ===================================================================
   1. SOUND FX ENGINE (Synthesized via Web Audio API - Zero External Files)
   =================================================================== */

let audioCtx = null;
let soundEnabled = true;

function initSoundSystem() {
  const soundBtn = document.getElementById('soundToggleBtn');
  if (!soundBtn) return;

  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      soundBtn.classList.remove('muted');
      soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      playSound('blip');
      showToast('Sound Effects Enabled 🔊');
    } else {
      soundBtn.classList.add('muted');
      soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      showToast('Sound Effects Muted 🔇');
    }
  });

  // Attach subtle sounds to interactive buttons
  document.querySelectorAll('.btn, .filter-pill, .day-tab-btn, .nav-link, .dot-item').forEach(el => {
    el.addEventListener('mouseenter', () => playSound('hover'));
    el.addEventListener('click', () => playSound('click'));
  });
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.05);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'success') {
      // Arpeggiated dimensional chord
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(freq, now + i * 0.07);
        subGain.gain.setValueAtTime(0.07, now + i * 0.07);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.35);
        subOsc.start(now + i * 0.07);
        subOsc.stop(now + i * 0.07 + 0.35);
      });
    } else if (type === 'open') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (err) {
    // Audio context may require user interaction first
  }
}

/* ===================================================================
   2. INTERACTIVE COSMIC STARFIELD PARTICLE CANVAS
   =================================================================== */

function initParticleCanvas() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(width > 768 ? 65 : 30, 80);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      color: Math.random() > 0.6 ? '#00f0ff' : Math.random() > 0.3 ? '#a855f7' : '#ffffff',
      alpha: Math.random() * 0.7 + 0.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting constellation lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw individual particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ===================================================================
   3. LIVE COUNTDOWN TIMER TO OCTOBER 9, 2026
   =================================================================== */

function initCountdownTimer() {
  const cdDays = document.getElementById('cdDays');
  const cdHours = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  if (!cdDays) return;

  // Event Date: October 9, 2026, 09:00:00 IST
  const eventDate = new Date('2026-10-09T09:00:00+05:30').getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance <= 0) {
      cdDays.textContent = '00';
      cdHours.textContent = '00';
      cdMinutes.textContent = '00';
      cdSeconds.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    cdDays.textContent = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMinutes.textContent = String(minutes).padStart(2, '0');
    cdSeconds.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ===================================================================
   4. EVENTS DATASET & CATALOG SYSTEM
   =================================================================== */

const EVENTS_DATABASE = [
  // --- TECHNICAL EVENTS ---
  {
    id: 'hackorbit',
    title: 'HackOrbit: 42-Hour National Hackathon',
    tagline: '42 Continuous Hours of Code, Architecture & Innovation',
    category: 'technical',
    subCategory: 'hackathon',
    featured: true,
    isFlagship: true,
    prizePool: '₹75,000 + Incubation',
    teamSize: '2 - 4 Members',
    venue: 'Central Computing Center (Lab 1 & 2)',
    timing: 'Oct 9, 11:00 AM - Oct 11, 05:00 AM (42 Hours Continuous)',
    brief: 'The flagship 42-hour continuous hackathon at MIT Kundapura. Tackle high-impact real-world challenge statements across AI/ML, Web3, Smart Cities, HealthTech, and Agritech with non-stop mentorship and food.',
    description: `HackOrbit is a national-tier 42-hour hackathon designed to test endurance, creativity, and technical execution. Hackers from colleges across India will converge at MIT Kundapura to build full-stack web, mobile, AI, and IoT solutions from scratch. 
    
    Participants get 24/7 dedicated high-speed Wi-Fi, lab workspaces, power docks, resting lounges, continuous midnight meals and caffeine fuel, plus 1-on-1 mentorship checkpoints with seasoned architects and engineering leaders from top MNCs and startups.`,
    rules: [
      'Team size: 2 to 4 members. Cross-college teams are permitted.',
      'Duration: Strictly 42 hours continuous coding on MIT Kundapura campus.',
      'All code, design assets, and commits must be created entirely during the 42-hour hackathon window on a new GitHub repository.',
      'Open-source libraries and APIs are permitted; pre-built full templates will lead to disqualification.',
      'Three progressive mentor review checkpoints with Git commit logs evaluation.',
      'Top 10 finalists will deliver a 5-minute live demo and 3-minute Q&A on the main auditorium stage before the jury.'
    ],
    perks: ['₹75,000 Total Cash Prizes', '24x7 Meals & Refreshments', 'Incubation & Internship Offers', 'Certificates of Excellence', 'Hacker Swag Kits'],
    coordinators: 'Prof. Rajesh K. (Faculty) • Sandesh Shetty (Student: 94812 34567)'
  },
  {
    id: 'devorbit-web',
    title: 'DevOrbit: Web-a-thon Sprint',
    tagline: 'Rapid Full-Stack Dynamic Web Application Sprint',
    category: 'technical',
    subCategory: 'webathon',
    featured: true,
    isFlagship: false,
    prizePool: '₹25,000',
    teamSize: '1 - 3 Members',
    venue: 'Software Innovation Hub',
    timing: 'Oct 9, 02:00 PM - 07:00 PM (5 Hours Sprint)',
    brief: 'A fast-paced web engineering showdown. Given a surprise real-time theme at kickoff, teams must design and deploy a responsive, secure, and visually stunning web application.',
    description: `DevOrbit pushes your modern web stack capabilities to the limit. Whether you build with React, Vue, Next.js, or pure HTML5/CSS/Node, you will be evaluated on UI/UX aesthetics, responsiveness, API integration, and algorithmic correctness.`,
    rules: [
      'Team size: 1 to 3 members.',
      'Theme will be announced 15 minutes before the timer starts.',
      'Must deploy a functional live URL (Vercel, Netlify, Render, or GitHub Pages) and provide source code.',
      'Evaluation criteria: Responsive Design (25%), Code Quality & Architecture (25%), Feature Completeness (30%), Innovation (20%).'
    ],
    perks: ['Cash Prizes for Top 3 Teams', 'Merit Certificates', 'Web Developer Goodies'],
    coordinators: 'Prof. Anitha Rao • Pradeep Kumar (Student: 98450 11223)'
  },
  {
    id: 'apporbit-mobile',
    title: 'AppOrbit: Mobile-a-thon Challenge',
    tagline: 'Cross-Platform & Native Mobile App Development',
    category: 'technical',
    subCategory: 'mobileathon',
    featured: true,
    isFlagship: false,
    prizePool: '₹25,000',
    teamSize: '1 - 3 Members',
    venue: 'Mobile App Development Studio',
    timing: 'Oct 10, 09:30 AM - 02:30 PM (5 Hours)',
    brief: 'Craft interactive, offline-first, or cloud-backed mobile apps using Flutter, React Native, Kotlin, or Swift solving everyday campus and local community problems.',
    description: `AppOrbit challenges developers to prototype and demo a native or cross-platform mobile application within 5 intense hours. Focus areas include seamless user experience, gesture navigation, device sensors (GPS, Camera, Accelerometer), and cloud database synchronization.`,
    rules: [
      'Team size: 1 to 3 members.',
      'App can be built in Flutter, React Native, Kotlin/Android, or Swift/iOS.',
      'Must provide an APK / test build runnable on an Android device or emulator for jury evaluation.',
      'Live mirroring of device on projector during final 3-minute pitch.'
    ],
    perks: ['Cash Awards for Winners', 'App Store / Play Store Hosting Support', 'Participation Certificates'],
    coordinators: 'Prof. Vinay Kumar • Rakshith Poojary (Student: 99011 22334)'
  },
  {
    id: 'vtu-paper',
    title: 'VTU Capstone Project Expo & Publication',
    tagline: 'Exclusive for 4th Year BE/B.Tech Students from VTU Affiliated Colleges',
    category: 'vtu',
    subCategory: 'vtu-special',
    featured: true,
    isFlagship: true,
    prizePool: '₹35,000 + ISBN Publication',
    teamSize: '1 - 4 Members',
    venue: 'MITK Seminar Halls 1 & 2, Exhibition Pavilion',
    timing: 'Oct 9 & 10 (Two Batches: Track A & Track B)',
    brief: 'A prestigious platform dedicated to final year engineering students of VTU-affiliated colleges to present capstone projects, gain peer review, and receive official publication in ORBIT 2K26 Conference Proceedings (ISBN registered).',
    description: `Under the vision of Moodlakatte Institute of Technology Kundapura, this premier conclave is specially designed for 4th Year (Final Year) BE / B.Tech students studying across all VTU-affiliated engineering colleges in Karnataka.
    
    Students can present their final year capstone engineering projects before an esteemed panel composed of VTU professors, doctoral researchers, and industry tech leaders. 
    
    Every accepted and presented paper will be formally published in the ORBIT 2K26 National Conference Proceedings with an official ISBN number and Digital Certificate of Publication—a tremendous credential for job placements, campus recruitment, and higher studies admissions (MS/M.Tech).`,
    rules: [
      'Eligibility: Open exclusively to 4th Year BE/B.Tech students from VTU-affiliated colleges across Karnataka.',
      'Team size: 1 to 4 members (final year project batch members).',
      'Format: Paper manuscript must adhere to the standard IEEE two-column conference format (4 to 6 pages).',
      'Tracks: Computer Science & Engg, Information Science, Electronics & Communication, Artificial Intelligence & Data Science, Mechanical, and Civil Engineering.',
      'Working hardware or software prototype demo is strongly encouraged for extra scoring in the Exhibition Pavilion.',
      'Every registered member attending the presentation will receive a physical Certificate of Project Presentation & Publication.'
    ],
    perks: [
      'Official Certificate of Project Publication in ISBN Registered Proceedings',
      'Best Project Award per Engineering Branch (Cash + Trophy)',
      'Direct Mentorship & Networking with Industry Hiring Scouts',
      'Exhibition Booth provided for working hardware/software demos'
    ],
    coordinators: 'Dr. Nagaraj Bhat (Dean R&D) • Prof. Sushmitha M. • Karthik Hegde (Student: 97412 88990)'
  },
  {
    id: 'techscribe',
    title: 'TechScribe: National Paper Presentation',
    tagline: 'Technical Research Paper Presentation for 1st - 3rd Year Students',
    category: 'technical',
    subCategory: 'paper',
    featured: false,
    isFlagship: false,
    prizePool: '₹20,000',
    teamSize: '1 - 3 Members',
    venue: 'Conference Hall A',
    timing: 'Oct 9, 01:30 PM - 05:00 PM',
    brief: 'Present innovative research papers, survey studies, and emerging technology concepts in IEEE format to academic peers and faculty judges.',
    description: `TechScribe provides a scholarly forum for emerging engineering scholars to articulate original research, novel algorithmic approaches, and state-of-the-art technological surveys. Presentations will be evaluated on technical depth, methodology, and defense during the Q&A session.`,
    rules: [
      'Team size: 1 to 3 members.',
      'Presentation duration: 8 minutes presentation + 2 minutes Q&A.',
      'Slides should be in PPT/PDF format.',
      'Plagiarism index must be below 20%.'
    ],
    perks: ['Cash Prizes for 1st & 2nd', 'Certificate of Merit', 'Expert Faculty Feedback'],
    coordinators: 'Prof. Deepa Nayak • Harshitha Rao (Student: 94480 33445)'
  },
  {
    id: 'bytebattle',
    title: 'ByteBattle: Speed Coding & Bug Bounty',
    tagline: 'Algorithmic Problem Solving & Competitive Debugging Quest',
    category: 'technical',
    subCategory: 'coding',
    featured: false,
    isFlagship: false,
    prizePool: '₹15,000',
    teamSize: '1 - 2 Members',
    venue: 'Computer Center Lab 3',
    timing: 'Oct 10, 11:00 AM - 01:30 PM',
    brief: 'A high-speed clash of algorithmic mastery. Solve dynamic programming puzzles, optimize time complexity, and hunt down elusive bugs in intentionally broken codebases.',
    description: `Two gripping rounds: Round 1 consists of rapid bug detection and syntax repair across C++, Java, and Python. Round 2 tests algorithmic supremacy with competitive programming problems on an automated contest platform.`,
    rules: [
      'Individual or team of 2.',
      'Permitted languages: C, C++, Java, Python 3.',
      'Leaderboard ranked on test cases passed and time penalty.',
      'Internet access restricted during the contest window.'
    ],
    perks: ['Cash Awards for Top Coders', 'Badges of Algorithmic Mastery'],
    coordinators: 'Prof. Chethan Kumar • Abhishek Nayak (Student: 98860 44556)'
  },
  {
    id: 'roboclash',
    title: 'RoboClash & Drone Blitz',
    tagline: 'Line Following Speed Bots, Obstacle Navigation & Drone Sprint',
    category: 'technical',
    subCategory: 'robotics',
    featured: false,
    isFlagship: false,
    prizePool: '₹20,000',
    teamSize: '2 - 4 Members',
    venue: 'MITK Indoor Sports Complex Arena',
    timing: 'Oct 10, 02:00 PM - 05:00 PM',
    brief: 'Unleash autonomous line followers, manual obstacle bots, and micro-drones across a custom cyber course with ramps, bridges, and hairpin turns.',
    description: `Experience the thunder of metal, servos, and microcontrollers. Bots go head-to-head on precision tracks, testing PID algorithms, sensor accuracy, and piloting agility.`,
    rules: [
      'Bot dimensions: Max 30cm x 30cm x 30cm; weight under 5 kg.',
      'Power supply on-board: Max 24V DC.',
      'Timed runs with penalties for lane departures and manual touches.'
    ],
    perks: ['Cash Prizes for Fastest Time', 'Engineering Trophies', 'Hardware Certificates'],
    coordinators: 'Prof. Ramesh Pai • Varun Kamath (Student: 96112 55667)'
  },

  // --- NON-TECHNICAL & CULTURAL EVENTS ---
  {
    id: 'cosmoquest',
    title: 'CosmoQuest: Mega Campus Treasure Hunt',
    tagline: 'Decipher Geo-Ciphers Across the 20-Acre Green MITK Campus',
    category: 'non-technical',
    subCategory: 'adventure',
    featured: true,
    isFlagship: false,
    prizePool: '₹15,000',
    teamSize: '2 - 4 Members',
    venue: 'Entire MIT Kundapura Campus Grounds',
    timing: 'Oct 9, 05:00 PM - 07:00 PM',
    brief: 'A cinematic campus-wide mystery hunt. Solve encrypted QR riddles, physical clues, and mathematical cyphers hidden throughout the gardens, academic blocks, and library.',
    description: `CosmoQuest transforms the entire 20-acre lush green Moodlakatte campus into an open-world adventure map. Teams must crack intricate multi-stage clues that test deductive reasoning, lateral thinking, and campus exploration speed. First team to unlock the final Dimensional Vault wins the grand bounty!`,
    rules: [
      'Team size: 2 to 4 members.',
      'Teams must not damage campus property or enter restricted staff zones.',
      'Smartphone required for scanning encrypted clues and portal coordinates.',
      'Decisions of the Game Masters are final and binding.'
    ],
    perks: ['Grand Cash Bounty for Winning Crew', 'Exclusive CosmoQuest Badges'],
    coordinators: 'Prof. Roopa Shetty • Prajwal Kumar (Student: 94823 66778)'
  },
  {
    id: 'esports-arena',
    title: 'CyberArena: BGMI & Valorant Championship',
    tagline: 'High-Stakes LAN Tournament with Live Shoutcasting',
    category: 'non-technical',
    subCategory: 'gaming',
    featured: true,
    isFlagship: false,
    prizePool: '₹25,000',
    teamSize: '4 Members (BGMI) / 5 Members (Valorant)',
    venue: 'MITK Main Auditorium Stage LAN Arena',
    timing: 'Oct 9 (Prelims) & Oct 10, 01:00 PM (Grand Finals)',
    brief: 'Battle it out on low-ping gigabit LAN! Custom rooms for BGMI Battle Royale and 5v5 tactical shooter brackets for Valorant on the big auditorium screen with live shoutcasters.',
    description: `The premier collegiate esports showdown of coastal Karnataka. Battle squads from all over the region will clash in Valorant and BGMI. Finals will be projected live on the grand auditorium screen with enthusiastic commentators and gaming crowd cheers!`,
    rules: [
      'BGMI: Squads of 4. Mobile phones only (no iPads or emulators).',
      'Valorant: 5v5 standard competitive rules, single elimination brackets, finals Best of 3.',
      'Any third-party hack, script, or cheating software will result in immediate disqualification and campus ban.'
    ],
    perks: ['₹25,000 Total Prize Pool', 'Championship Gaming Trophies', 'E-Sports MVP Badges'],
    coordinators: 'Prof. Gururaj Shenoy • Shreyas M. (Student: 97314 77889)'
  },
  {
    id: 'pixelcraft',
    title: 'PixelCraft: Short Film & Campus Photography',
    tagline: 'Theme: "Light, Perspectives & Dimensions"',
    category: 'non-technical',
    subCategory: 'arts',
    featured: false,
    isFlagship: false,
    prizePool: '₹12,000',
    teamSize: '1 - 3 Members',
    venue: 'Seminar Hall 3 & Media Room',
    timing: 'Oct 10, 03:00 PM (Screening & Evaluation)',
    brief: 'Showcase your cinematic storytelling and photography flair. Capture the essence of collegiate life, nature, or science fiction through lenses.',
    description: `PixelCraft has two creative tracks: Track A is Short Film Making (up to 7 minutes runtime) exploring human connection or future dimensions. Track B is Live Campus Mobile & DSLR Photography capturing the mood of ORBIT 2K26 in real-time.`,
    rules: [
      'Short films must be original content (max 7 minutes including credits).',
      'Live photography entries must be shot on MITK campus during Day 1 & Day 2.',
      'No heavy AI image generation permitted; standard color grading is allowed.'
    ],
    perks: ['Cash Prizes for Best Film & Best Photo', 'Screening on Auditorium Big Screen'],
    coordinators: 'Prof. Shilpa M. • Suhas Poojary (Student: 94498 88990)'
  },
  {
    id: 'rhythmorbit',
    title: 'RhythmOrbit: Battle of the Bands & Acoustic',
    tagline: 'Electrifying Collegiate Musical Showdown under the Stars',
    category: 'non-technical',
    subCategory: 'cultural',
    featured: true,
    isFlagship: false,
    prizePool: '₹25,000',
    teamSize: '3 - 8 Members (Band) / 1 - 2 (Acoustic)',
    venue: 'MITK Open Air Amphitheatre',
    timing: 'Oct 9, 07:30 PM - 10:30 PM',
    brief: 'Rock bands, Indian fusion, and unplugged acoustic sets battle for rhythmic glory on the grand amphitheatre stage with professional audio and concert lighting.',
    description: `As the sun sets over Kundapura on Day 1, the campus erupts in sound and rhythm. RhythmOrbit welcomes college bands to take the stage and perform their best original compositions and covers before hundreds of roaring students.`,
    rules: [
      'Band setup time: 5 minutes. Performance time: 15 minutes max.',
      'Drum kit and PA system provided; bands must bring own guitars, processors, and special instruments.',
      'Judged on tight rhythm, vocal dynamics, original arrangement, and stage presence.'
    ],
    perks: ['₹25,000 Cash Pool', 'Stage Trophies', 'Campus Celebrity Spotlight'],
    coordinators: 'Prof. Divya Rani • Nikhil Bhat (Student: 98801 99001)'
  },
  {
    id: 'brainorbit',
    title: 'BrainOrbit: The Mega Quiz',
    tagline: 'General Knowledge, Tech Giants, Anime & Pop Culture Trivia',
    category: 'non-technical',
    subCategory: 'quiz',
    featured: false,
    isFlagship: false,
    prizePool: '₹10,000',
    teamSize: '2 Members',
    venue: 'Lecture Hall Complex Room 101',
    timing: 'Oct 9, 03:30 PM - 06:00 PM',
    brief: 'A fast and witty battle of wits. Written prelims followed by a thrilling 6-team stage buzzer final with visual, audio, and connect rounds.',
    description: `From Turing and von Neumann to Marvel, anime, global diplomacy, sports legends, and Silicon Valley lore, BrainOrbit is curated by seasoned quizmasters to challenge your broad spectrum intellect.`,
    rules: [
      'Teams of 2 members.',
      'Round 1: 30 written questions (Prelims).',
      'Top 6 teams qualify for the Grand Stage Buzzer Finals.',
      'Negative marking on bounce and buzzer rounds.'
    ],
    perks: ['Cash Awards for Top 3 Teams', 'Quiz Wizard Trophies'],
    coordinators: 'Prof. Prashanth Shenoy • Adithya Rao (Student: 96321 00112)'
  },
  {
    id: 'admad',
    title: 'Pitch Perfect & Ad-Mad',
    tagline: 'Quirky Product Marketing, Humor & Shark Pitching',
    category: 'non-technical',
    subCategory: 'management',
    featured: false,
    isFlagship: false,
    prizePool: '₹10,000',
    teamSize: '2 - 3 Members',
    venue: 'MBA Seminar Hall',
    timing: 'Oct 10, 10:00 AM - 12:30 PM',
    brief: 'Pick a bizarre product or absurd concept and convince the judges why it is the next billion-dollar unicorn using witty acting, slogans, and jingles.',
    description: `Blend theatrical performance, comic timing, and sharp marketing psychology. Teams get 15 minutes of prep time to formulate an advertisement campaign for quirky imaginary products, followed by an impromptu pitch to the investor panel.`,
    rules: [
      'Team of 2 to 3 members.',
      'Time limit: 3 minutes presentation + 2 minutes Q&A.',
      'Props allowed; obscenity or offensive language is strictly forbidden.'
    ],
    perks: ['Cash Prizes', 'Creative Star Certificates'],
    coordinators: 'Prof. Manjula S. • Kavya Shetty (Student: 97405 11223)'
  },
  {
    id: 'stepup',
    title: 'Step Up: Street Dance Battle',
    tagline: 'Solo & Crew Freestyle, Hip-Hop & Contemporary Dance',
    category: 'non-technical',
    subCategory: 'cultural',
    featured: false,
    isFlagship: false,
    prizePool: '₹15,000',
    teamSize: '1 (Solo) / 2 - 6 (Crew)',
    venue: 'Campus Amphitheatre Stage',
    timing: 'Oct 10, 03:00 PM - 05:00 PM',
    brief: 'Drop the beat and light up the floor! High-energy freestyle street dance battle with cyphers, popping, locking, breaking, and lyrical fusion.',
    description: `A battle format dance tournament where dancers face off in 1v1 cyphers and team choreographies to surprise tracks mixed live by the conclave DJ.`,
    rules: [
      'Solo: 1 minute per round in 1v1 face-off format.',
      'Crew: 4 to 6 minutes choreographed routine.',
      'Judged on musicality, technique, energy, and choreographic originality.'
    ],
    perks: ['Cash Prizes for Solo & Crew', 'Dance Trophies'],
    coordinators: 'Prof. Archana K. • Deepthi Poojary (Student: 94833 22334)'
  },
  {
    id: 'animerealm',
    title: 'Dimension Cosplay & Comic Con',
    tagline: 'Character Walk, Anime, Gaming & Sci-Fi Personas',
    category: 'non-technical',
    subCategory: 'cultural',
    featured: false,
    isFlagship: false,
    prizePool: '₹10,000',
    teamSize: '1 Member (Solo)',
    venue: 'Main Auditorium Stage',
    timing: 'Oct 10, 04:30 PM',
    brief: 'Step through the dimensional portal as your favorite anime, comic, movie, or video game character with authentic costumes, props, and stage monologue.',
    description: `Celebrate the theme of Emerging into a New Dimension! Transform into iconic characters from Cyberpunk, Marvel, Dragon Ball, Genshin Impact, or classic Indian mythological legends.`,
    rules: [
      'Costumes must be safe (no real metal blades, live fire, or hazardous materials).',
      'Stage walk: 90 seconds runway walk + 30 seconds dialogue/pose.',
      'Evaluation: Craftsmanship (40%), Character Accuracy (30%), Stage Performance (30%).'
    ],
    perks: ['Best Cosplay Cash Awards', 'Collector Figurines & Merch'],
    coordinators: 'Prof. Kiran Kumar • Rohit Sharma (Student: 98444 55667)'
  }
];

let currentFilter = 'all';
let searchQuery = '';

function initEventsCatalog() {
  const eventsGrid = document.getElementById('eventsGrid');
  const categoryFilters = document.getElementById('categoryFilters');
  const searchInput = document.getElementById('eventSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  if (!eventsGrid) return;

  // Filter Buttons Click
  if (categoryFilters) {
    categoryFilters.querySelectorAll('.filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        categoryFilters.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.category;
        renderEvents();
      });
    });
  }

  // Search Input Handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('visible', searchQuery.length > 0);
      }
      renderEvents();
    });
  }

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearchBtn.classList.remove('visible');
      renderEvents();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      currentFilter = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.classList.remove('visible');
      if (categoryFilters) {
        categoryFilters.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
        const first = categoryFilters.querySelector('[data-category="all"]');
        if (first) first.classList.add('active');
      }
      renderEvents();
    });
  }

  renderEvents();
}

function renderEvents() {
  const grid = document.getElementById('eventsGrid');
  const noResults = document.getElementById('noResultsState');
  if (!grid) return;

  const filtered = EVENTS_DATABASE.filter(ev => {
    // Category match
    let matchCat = false;
    if (currentFilter === 'all') matchCat = true;
    else if (currentFilter === 'technical') matchCat = ev.category === 'technical';
    else if (currentFilter === 'non-technical') matchCat = ev.category === 'non-technical';
    else if (currentFilter === 'hackathon') matchCat = ev.id === 'hackorbit' || ev.subCategory === 'hackathon';
    else if (currentFilter === 'vtu') matchCat = ev.category === 'vtu' || ev.id === 'vtu-paper';
    else if (currentFilter === 'gaming') matchCat = ev.subCategory === 'gaming';

    // Search query match
    let matchSearch = true;
    if (searchQuery) {
      const corpus = `${ev.title} ${ev.tagline} ${ev.brief} ${ev.prizePool} ${ev.venue}`.toLowerCase();
      matchSearch = corpus.includes(searchQuery);
    }

    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (noResults) noResults.classList.remove('hidden');
    return;
  }

  if (noResults) noResults.classList.add('hidden');

  grid.innerHTML = filtered.map(ev => {
    const isVtu = ev.category === 'vtu' || ev.id === 'vtu-paper';
    const isHack = ev.id === 'hackorbit';
    const cardClass = `event-card ${ev.featured ? 'featured-card' : ''} ${isVtu ? 'vtu-special-card' : ''}`;
    const catClass = isVtu ? 'vtu' : ev.category;
    const catLabel = isVtu ? 'VTU 4th-Year Special' : ev.category === 'technical' ? 'Technical' : 'Non-Technical';

    return `
      <div class="${cardClass}" id="card-${ev.id}">
        <div>
          <div class="card-top-row">
            <span class="category-tag ${catClass}">
              <i class="${isVtu ? 'fa-solid fa-graduation-cap' : ev.category === 'technical' ? 'fa-solid fa-code' : 'fa-solid fa-masks-theater'}"></i>
              ${catLabel}
            </span>
            ${isHack ? '<span class="badge-flagship"><i class="fa-solid fa-bolt"></i> 42 HOURS</span>' : ''}
            ${isVtu ? '<span class="badge-flagship" style="background:#f59e0b;color:#05070e"><i class="fa-solid fa-award"></i> VTU EXPO</span>' : ''}
          </div>

          <div class="event-main-content">
            <h3 class="event-title-h3">${ev.title}</h3>
            <p class="event-tagline-text">${ev.tagline}</p>
            <p class="event-brief-desc">${ev.brief}</p>
          </div>
        </div>

        <div>
          <div class="event-meta-chips">
            <span class="meta-chip prize-chip">
              <i class="fa-solid fa-trophy"></i> ${ev.prizePool}
            </span>
            <span class="meta-chip">
              <i class="fa-solid fa-users"></i> ${ev.teamSize}
            </span>
            <span class="meta-chip">
              <i class="fa-solid fa-location-dot"></i> ${ev.venue.split('(')[0]}
            </span>
          </div>

          <div class="event-actions-row">
            <button class="btn btn-sm btn-outline" onclick="openEventDetails('${ev.id}')">
              <i class="fa-solid fa-circle-info"></i> Details
            </button>
            <button class="btn btn-sm btn-primary" onclick="openRegistrationModal('${ev.id}')">
              <i class="fa-solid fa-ticket"></i> Register
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Re-attach audio hover hooks
  grid.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => playSound('hover'));
    btn.addEventListener('click', () => playSound('click'));
  });
}

// Global filter trigger from links
window.filterEventsByCategory = function(category) {
  const categoryFilters = document.getElementById('categoryFilters');
  if (categoryFilters) {
    categoryFilters.querySelectorAll('.filter-pill').forEach(b => {
      if (b.dataset.category === category) {
        b.click();
      }
    });
  }
};

/* ===================================================================
   5. 2-DAY SCHEDULE TIMELINE CONTROLLER
   =================================================================== */

function initScheduleTabs() {
  const tabDay1 = document.getElementById('tabDay1');
  const tabDay2 = document.getElementById('tabDay2');
  const day1Sched = document.getElementById('day1Schedule');
  const day2Sched = document.getElementById('day2Schedule');

  if (!tabDay1 || !tabDay2) return;

  tabDay1.addEventListener('click', () => {
    tabDay1.classList.add('active');
    tabDay2.classList.remove('active');
    if (day1Sched) day1Sched.classList.add('active');
    if (day2Sched) day2Sched.classList.remove('active');
    playSound('click');
  });

  tabDay2.addEventListener('click', () => {
    tabDay2.classList.add('active');
    tabDay1.classList.remove('active');
    if (day2Sched) day2Sched.classList.add('active');
    if (day1Sched) day1Sched.classList.remove('active');
    playSound('click');
  });
}

/* ===================================================================
   6. NAVBAR & SLIDE OBSERVER (PROGRESSION DOTS)
   =================================================================== */

function initNavbarScroll() {
  const navbar = document.getElementById('mainNavbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
  });

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      const isOpen = navLinks.classList.contains('mobile-open');
      mobileMenuBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }
}

function initSlideObserver() {
  const sections = document.querySelectorAll('.slide-section, .events-section, .vtu-spotlight-section, .schedule-section');
  const dots = document.querySelectorAll('.slide-dots-nav .dot-item');
  const navLinks = document.querySelectorAll('.navbar .nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;

        // Update nav links
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('data-nav') === id);
        });

        // Update slide dots
        dots.forEach(dot => {
          const href = dot.getAttribute('href');
          dot.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => observer.observe(sec));
}

/* ===================================================================
   7. MODAL SYSTEM (EVENT DETAILS, REGISTRATION, DIGITAL PASS)
   =================================================================== */

function initModals() {
  const eventModal = document.getElementById('eventModalOverlay');
  const regModal = document.getElementById('regModalOverlay');
  const ticketModal = document.getElementById('ticketModalOverlay');

  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCloseActionBtn = document.getElementById('modalCloseActionBtn');
  const regModalCloseBtn = document.getElementById('regModalCloseBtn');
  const regCancelBtn = document.getElementById('regCancelBtn');
  const ticketCloseBtn = document.getElementById('ticketCloseBtn');
  const ticketDoneBtn = document.getElementById('ticketDoneBtn');

  function closeAllModals() {
    [eventModal, regModal, ticketModal].forEach(m => {
      if (m) m.classList.remove('open');
    });
  }

  // Close handlers
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeAllModals);
  if (modalCloseActionBtn) modalCloseActionBtn.addEventListener('click', closeAllModals);
  if (regModalCloseBtn) regModalCloseBtn.addEventListener('click', closeAllModals);
  if (regCancelBtn) regCancelBtn.addEventListener('click', closeAllModals);
  if (ticketCloseBtn) ticketCloseBtn.addEventListener('click', closeAllModals);
  if (ticketDoneBtn) ticketDoneBtn.addEventListener('click', closeAllModals);

  // Click outside to close
  [eventModal, regModal, ticketModal].forEach(overlay => {
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeAllModals();
      });
    }
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
}

// Global modal triggers
window.openEventDetails = function(eventId) {
  const ev = EVENTS_DATABASE.find(item => item.id === eventId);
  if (!ev) return;

  const modalOverlay = document.getElementById('eventModalOverlay');
  const catBadge = document.getElementById('modalCategoryBadge');
  const title = document.getElementById('modalTitle');
  const tagline = document.getElementById('modalTagline');
  const body = document.getElementById('modalBody');
  const regBtn = document.getElementById('modalRegisterActionBtn');

  if (catBadge) {
    catBadge.textContent = ev.category === 'vtu' ? 'VTU 4th-Year Capstone Conclave' : `${ev.category.toUpperCase()} ARENA`;
  }
  if (title) title.textContent = ev.title;
  if (tagline) tagline.textContent = ev.tagline;

  if (body) {
    body.innerHTML = `
      <div class="modal-meta-grid">
        <div class="meta-box-item">
          <span class="meta-box-label"><i class="fa-solid fa-trophy"></i> Prize Pool</span>
          <span class="meta-box-val" style="color:var(--gold-accent)">${ev.prizePool}</span>
        </div>
        <div class="meta-box-item">
          <span class="meta-box-label"><i class="fa-solid fa-users"></i> Team Structure</span>
          <span class="meta-box-val">${ev.teamSize}</span>
        </div>
        <div class="meta-box-item">
          <span class="meta-box-label"><i class="fa-solid fa-calendar-day"></i> Schedule & Timing</span>
          <span class="meta-box-val">${ev.timing}</span>
        </div>
        <div class="meta-box-item">
          <span class="meta-box-label"><i class="fa-solid fa-location-dot"></i> Venue on Campus</span>
          <span class="meta-box-val">${ev.venue}</span>
        </div>
      </div>

      <div class="modal-detail-block">
        <h4><i class="fa-solid fa-align-left"></i> Conclave Overview</h4>
        <p>${ev.description.replace(/\n\n/g, '<br><br>')}</p>
      </div>

      <div class="modal-detail-block">
        <h4><i class="fa-solid fa-gavel"></i> Official Rules & Regulations</h4>
        <ul class="modal-rules-list">
          ${ev.rules.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-detail-block">
        <h4><i class="fa-solid fa-gift"></i> Rewards & Entitlements</h4>
        <ul class="modal-rules-list">
          ${ev.perks.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-detail-block">
        <h4><i class="fa-solid fa-headset"></i> Faculty & Student Coordinators</h4>
        <p><i class="fa-solid fa-phone"></i> ${ev.coordinators}</p>
      </div>
    `;
  }

  if (regBtn) {
    regBtn.onclick = () => {
      modalOverlay.classList.remove('open');
      openRegistrationModal(ev.id);
    };
  }

  playSound('open');
  modalOverlay.classList.add('open');
};

window.openRegistrationModal = function(eventId = 'hackorbit') {
  const regOverlay = document.getElementById('regModalOverlay');
  const regEventBadge = document.getElementById('regEventBadge');
  const regEventTitle = document.getElementById('regEventTitle');
  const eventIdInput = document.getElementById('selectedEventId');
  const vtuExtraFields = document.getElementById('vtuExtraFields');

  const ev = EVENTS_DATABASE.find(item => item.id === eventId) || EVENTS_DATABASE[0];

  if (eventIdInput) eventIdInput.value = ev.id;
  if (regEventBadge) regEventBadge.textContent = `Registering for: ${ev.category.toUpperCase()}`;
  if (regEventTitle) regEventTitle.textContent = ev.title;

  // Show VTU extra fields if it's the VTU paper or technical paper
  if (vtuExtraFields) {
    const isVtuOrPaper = ev.id === 'vtu-paper' || ev.id === 'techscribe' || ev.category === 'vtu';
    vtuExtraFields.style.display = isVtuOrPaper ? 'flex' : 'none';
  }

  playSound('open');
  if (regOverlay) regOverlay.classList.add('open');
};

/* ===================================================================
   8. INTERACTIVE REGISTRATION FORM SUBMISSION & DIGITAL PASS GENERATION
   =================================================================== */

function initRegistrationForm() {
  const form = document.getElementById('registrationForm');
  const teamSizeSelect = document.getElementById('teamSize');
  const teamMembersField = document.getElementById('teamMembersField');

  if (teamSizeSelect && teamMembersField) {
    teamSizeSelect.addEventListener('change', () => {
      const val = parseInt(teamSizeSelect.value, 10);
      teamMembersField.style.display = val > 1 ? 'flex' : 'none';
    });
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate Required Inputs
    const teamLead = document.getElementById('teamLeadName').value.trim();
    const email = document.getElementById('participantEmail').value.trim();
    const phone = document.getElementById('participantPhone').value.trim();
    const usn = document.getElementById('studentUsn').value.trim();
    const college = document.getElementById('collegeName').value.trim();
    const year = document.getElementById('academicYear').value;
    const rulesAgreed = document.getElementById('rulesAgreed').checked;
    const eventId = document.getElementById('selectedEventId').value || 'hackorbit';

    if (!teamLead || !email || !phone || !usn || !college || !year) {
      showToast('⚠️ Please fill in all required fields marked with *');
      return;
    }

    if (!rulesAgreed) {
      showToast('⚠️ Please check the agreement box to accept event rules.');
      return;
    }

    // Generate Unique Registration ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const regId = `ORBIT-26-${randomSuffix}`;

    const eventObj = EVENTS_DATABASE.find(item => item.id === eventId) || { title: 'ORBIT 2K26 Event' };

    // Save registration to localStorage
    const registrationRecord = {
      regId,
      teamLead,
      email,
      phone,
      usn,
      college,
      year,
      eventName: eventObj.title,
      eventId,
      timestamp: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('orbit2k26_registrations') || '[]');
      existing.push(registrationRecord);
      localStorage.setItem('orbit2k26_registrations', JSON.stringify(existing));
    } catch (err) {
      console.warn('Storage unavailable:', err);
    }

    // Close registration modal
    const regOverlay = document.getElementById('regModalOverlay');
    if (regOverlay) regOverlay.classList.remove('open');

    // Populate and open Digital Pass modal
    displayDigitalTicket(registrationRecord);
    playSound('success');
    showToast(`🎉 Registration Confirmed! Pass ID: ${regId}`);
  });
}

function displayDigitalTicket(record) {
  const ticketModal = document.getElementById('ticketModalOverlay');
  const tEvent = document.getElementById('ticketEventName');
  const tRegId = document.getElementById('ticketRegId');
  const tName = document.getElementById('ticketDelegateName');
  const tCollege = document.getElementById('ticketCollegeName');
  const tUsn = document.getElementById('ticketUsn');

  if (tEvent) tEvent.textContent = record.eventName;
  if (tRegId) tRegId.textContent = record.regId;
  if (tName) tName.textContent = record.teamLead;
  if (tCollege) tCollege.textContent = record.college;
  if (tUsn) tUsn.textContent = `${record.year} • USN: ${record.usn}`;

  if (ticketModal) ticketModal.classList.add('open');
}

/* ===================================================================
   9. TOAST NOTIFICATION UTILITY
   =================================================================== */

function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fa-solid fa-satellite-dish" style="color:var(--cyan-primary)"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
