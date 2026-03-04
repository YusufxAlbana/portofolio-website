let portfolioData = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

async function fetchData() {
    try {
        const [profileRes, postsRes, projectsRes, skillsRes, eduRes, trendingRes, expRes, certRes] = await Promise.all([
            fetch('./data/profile.json'),
            fetch('./data/posts.json'),
            fetch('./data/projects.json'),
            fetch('./data/skills.json'),
            fetch('./data/education.json'),
            fetch('./data/trending.json'),
            fetch('./data/experience.json'),
            fetch('./data/certificate.json')
        ]);

        if (!profileRes.ok) throw new Error('Failed to load data files');

        const profileData = await profileRes.json();
        const postsData = await postsRes.json();
        const projectsData = await projectsRes.json();
        const skillsData = await skillsRes.json();
        const eduData = await eduRes.json();
        const trendingData = await trendingRes.json();
        const expData = await expRes.json();
        const certData = await certRes.json();

        portfolioData = {
            profile: profileData.profile,
            tweets: postsData.posts,
            projects: projectsData.projects,
            skills: skillsData.skills,
            education: eduData.education,
            trending: trendingData.trending,
            experience: expData.experience,
            certificate: certData.certificate
        };
        
        renderProfile(portfolioData.profile);
        renderPosts(portfolioData.tweets);
        renderSidebarSkills(portfolioData.skills);


        setupNavigation();

        // Hide loading and show content
        document.getElementById('loading').classList.add('hidden');
        document.querySelectorAll('.cloak').forEach(el => el.classList.remove('cloak'));
        
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('loading').innerHTML = `<p class="text-red-500">Failed to load portfolio data. Please try again later.</p>`;
    }
}

function renderProfile(profile) {
    // Cover & Avatar
    document.getElementById('profile-cover').src = profile.cover;
    document.getElementById('profile-avatar').src = profile.avatar;

    // Profile Details
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-handle').textContent = profile.handle;
    
    // Bio (parsing hashtags and links could go here, for now it's plain text)
    document.getElementById('profile-bio').textContent = profile.bio;

    // Meta Data
    document.getElementById('profile-location').textContent = profile.location;
    document.getElementById('profile-link').textContent = profile.link.replace(/^https?:\/\//, ''); // Remove http(s):// for display
    document.getElementById('profile-link').href = `https://${profile.link}`;
    document.getElementById('profile-joined').textContent = profile.joined;

    // Follow Counts
    document.getElementById('profile-following').textContent = profile.following;
    document.getElementById('profile-followers').textContent = profile.followers;
}

function renderPosts(posts) {
    const container = document.getElementById('posts-container');
    container.innerHTML = ''; // Clear container

    posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'p-4 border-b border-x-border hover:bg-x-hover transition duration-200 cursor-pointer flex gap-3';
        
        // Avatar column
        const avatarHtml = `
            <div class="shrink-0 pt-1">
                <img src="${document.getElementById('profile-avatar').src}" alt="Avatar" class="w-10 h-10 rounded-full object-cover">
            </div>
        `;

        // Content column
        let imageHtml = '';
        if (post.image) {
            imageHtml = `
                <div class="mt-3 rounded-2xl border border-x-border overflow-hidden">
                    <img src="${post.image}" alt="Post Image" class="w-full h-auto object-cover">
                </div>
            `;
        }

        const contentHtml = `
            <div class="flex-1 min-w-0">
                <!-- Header -->
                <div class="flex justify-between items-start">
                    <div class="flex flex-wrap items-center gap-1 text-[15px]">
                        <span class="font-bold text-white hover:underline truncate max-w-[150px] sm:max-w-none">${post.name}</span>
                        <div class="text-x-textDim flex gap-1">
                            <span class="truncate max-w-[100px] sm:max-w-none">${post.handle}</span>
                            <span>·</span>
                            <span class="hover:underline">${post.time}</span>
                        </div>
                    </div>
                    <div class="text-x-textDim hover:text-x-blueHover w-8 h-8 rounded-full hover:bg-x-blue/10 flex items-center justify-center transition duration-200 -mt-1 -mr-2">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>

                <!-- Body -->
                <div class="text-[15px] mt-1 whitespace-pre-wrap leading-tight text-white">${post.content}</div>
                
                ${imageHtml}
            </div>
        `;

        postElement.innerHTML = avatarHtml + contentHtml;
        container.appendChild(postElement);
    });
}





function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            navLinks.forEach(l => {
                const icon = l.querySelector('i');
                const text = l.querySelector('span');
                icon.classList.remove('font-bold', 'text-white');
                text.classList.remove('font-bold', 'text-white');
                if(!l.classList.contains('active')) {
                   icon.classList.add('text-x-textDim');
                   text.classList.add('text-x-textDim');
                }
            });
            
            const clickedIcon = link.querySelector('i');
            const clickedText = link.querySelector('span');
            clickedIcon.classList.remove('text-x-textDim');
            clickedText.classList.remove('text-x-textDim');
            clickedIcon.classList.add('font-bold', 'text-white');
            clickedText.classList.add('font-bold', 'text-white');

            const target = link.dataset.target;
            switchContent(target);
        });
    });
}

function switchContent(target) {
    const container = document.getElementById('posts-container');
    const profileContainer = document.getElementById('profile-container');
    const pinnedHeader = document.getElementById('pinned-header');
    
    container.innerHTML = '';
    
    // Hide the profile cover/bio section if not on home feed
    if (target === 'posts') {
        profileContainer.classList.remove('hidden');
        if (pinnedHeader) pinnedHeader.classList.remove('hidden');
        renderPosts(portfolioData.tweets);
    } else {
        profileContainer.classList.add('hidden');
        if (pinnedHeader) pinnedHeader.classList.add('hidden');
        if (target === 'projects') {
            renderProjects(portfolioData.projects);
        } else if (target === 'education') {
            renderEducation(portfolioData.education);
        } else if (target === 'experience') {
            renderExperience(portfolioData.experience);
        } else if (target === 'certificate') {
            renderCertificate(portfolioData.certificate);
        } else if (target === 'contact') {
            renderContact();
        }
    }
}

function renderProjects(projects) {
    const container = document.getElementById('posts-container');
    projects.forEach(project => {
        const techStackHtml = project.tech.map(t => `<span class="text-x-blue text-[13px] hover:underline cursor-pointer mr-2">#${t.replace(/\s+/g, '')}</span>`).join('');
        
        let imageHtml = '';
        if (project.image) {
            imageHtml = `
                <div class="mt-3 rounded-2xl border border-x-border overflow-hidden">
                    <img src="${project.image}" alt="${project.name}" class="w-full h-auto object-cover">
                </div>
            `;
        }

        const projectHtml = `
            <article class="p-4 border-b border-x-border hover:bg-x-hover transition duration-200 flex gap-3">
                <div class="shrink-0 pt-1">
                    <div class="w-10 h-10 rounded-full bg-x-darkGray flex items-center justify-center text-white border border-x-border">
                        <i class="fa-solid fa-laptop-code"></i>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start">
                        <div class="flex flex-col">
                            <span class="font-bold text-white text-[15px]">${project.name}</span>
                            <a href="${project.link}" target="_blank" class="text-x-textDim text-[13px] hover:underline">${project.link.replace(/^https?:\/\//, '')}</a>
                        </div>
                    </div>
                    <div class="text-[15px] mt-2 whitespace-pre-wrap leading-tight text-white">${project.description}</div>
                    <div class="mt-2">${techStackHtml}</div>
                    ${imageHtml}
                    <!-- Action buttons simulating X -->
                    <div class="flex justify-between text-x-textDim mt-3 max-w-[425px]">
                        <a href="${project.link}" target="_blank" class="flex items-center group cursor-pointer hover:text-x-blue transition duration-200">
                            <div class="w-8 h-8 rounded-full group-hover:bg-x-blue/10 flex items-center justify-center">
                                <i class="fa-brands fa-github"></i>
                            </div>
                            <span class="text-[13px] px-1 group-hover:text-x-blue">Repo</span>
                        </a>
                        <div class="flex items-center group cursor-pointer hover:text-green-500 transition duration-200">
                             <div class="w-8 h-8 rounded-full group-hover:bg-green-500/10 flex items-center justify-center">
                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            </div>
                            <span class="text-[13px] px-1 group-hover:text-green-500">Live Demo</span>
                        </div>
                    </div>
                </div>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', projectHtml);
    });
}

function renderSidebarSkills(skills) {
    const container = document.getElementById('sidebar-skills-container');
    if (!container) return; // In case container doesn't exist on smaller screens
    container.innerHTML = '';
    
    skills.forEach(skillGroup => {
        const skillsHtml = skillGroup.items.map(s => `
            <div class="flex items-center gap-1.5 bg-black rounded-full px-3 py-1.5 text-[13px] font-medium text-white border border-x-border hover:bg-x-hover transition duration-200 cursor-default">
                <img src="${s.icon}" alt="${s.name}" class="w-4 h-4 object-contain">
                <span>${s.name}</span>
            </div>
        `).join('');

        const groupHtml = `
            <div>
                <h4 class="text-x-textDim text-[14px] font-semibold mb-2 uppercase tracking-wider">${skillGroup.category}</h4>
                <div class="flex flex-wrap gap-2">
                    ${skillsHtml}
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', groupHtml);
    });
}

function renderEducation(education) {
    const container = document.getElementById('posts-container');
    education.forEach((edu, index) => {
        const isLast = index === education.length - 1;
        
        let logoHtml = `
            <div class="w-10 h-10 rounded-full bg-x-blue/10 flex items-center justify-center text-x-blue border border-x-border">
                <i class="fa-solid fa-graduation-cap"></i>
            </div>
        `;
        if (edu.logo) {
            logoHtml = `
                <div class="w-10 h-10 rounded-full border border-x-border overflow-hidden bg-white">
                    <img src="${edu.logo}" alt="${edu.school} Logo" class="w-full h-full object-cover">
                </div>
            `;
        }

        let imageHtml = '';
        if (edu.image) {
            imageHtml = `
                <div class="mt-3 rounded-2xl border border-x-border overflow-hidden">
                    <img src="${edu.image}" alt="Education Image" class="w-full h-auto object-cover">
                </div>
            `;
        }

        const eduHtml = `
            <article class="p-4 border-b border-x-border hover:bg-x-hover transition duration-200 flex gap-3">
                <div class="shrink-0 pt-1 flex flex-col items-center">
                    ${logoHtml}
                    ${!isLast ? '<div class="w-0.5 h-full bg-x-border mt-2"></div>' : ''}
                </div>
                <div class="flex-1 min-w-0 pb-2">
                    <div class="flex justify-between items-start">
                        <div class="flex flex-col">
                            <span class="font-bold text-white text-[16px]">${edu.school}</span>
                            <span class="text-x-textDim text-[14px]"><i class="fa-solid fa-book mr-1"></i>${edu.degree}</span>
                        </div>
                        <span class="text-x-textDim text-[13px] whitespace-nowrap">${edu.duration}</span>
                    </div>
                    <div class="text-[15px] mt-2 whitespace-pre-wrap leading-tight text-white">${edu.description}</div>
                    ${imageHtml}
                </div>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', eduHtml);
    });
}

function renderExperience(experience) {
    const container = document.getElementById('posts-container');
    experience.forEach((exp, index) => {
        const isLast = index === experience.length - 1;
        
        let imageHtml = '';
        if (exp.image) {
            imageHtml = `
                <div class="mt-3 rounded-2xl border border-x-border overflow-hidden">
                    <img src="${exp.image}" alt="Experience Image" class="w-full h-auto object-cover">
                </div>
            `;
        }

        const expHtml = `
            <article class="p-4 border-b border-x-border hover:bg-x-hover transition duration-200 flex gap-3">
                <div class="shrink-0 pt-1 flex flex-col items-center">
                    <div class="w-10 h-10 rounded-full bg-x-blue/10 flex items-center justify-center text-x-blue border border-x-border">
                        <i class="fa-solid fa-briefcase"></i>
                    </div>
                    ${!isLast ? '<div class="w-0.5 h-full bg-x-border mt-2"></div>' : ''}
                </div>
                <div class="flex-1 min-w-0 pb-2">
                    <div class="flex justify-between items-start">
                        <div class="flex flex-col">
                            <span class="font-bold text-white text-[16px]">${exp.company}</span>
                            <span class="text-x-textDim text-[14px]">${exp.role}</span>
                        </div>
                        <span class="text-x-textDim text-[13px] whitespace-nowrap">${exp.duration}</span>
                    </div>
                    <div class="text-[15px] mt-2 whitespace-pre-wrap leading-tight text-white">${exp.description}</div>
                    ${imageHtml}
                </div>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', expHtml);
    });
}

function renderCertificate(certificate) {
    const container = document.getElementById('posts-container');
    certificate.forEach((cert) => {
        let imageHtml = '';
        if (cert.image) {
            imageHtml = `
                <div class="mt-3 rounded-2xl border border-x-border overflow-hidden">
                    <img src="${cert.image}" alt="Certificate Image" class="w-full h-auto object-cover">
                </div>
            `;
        }

        let logoHtml = `
            <div class="w-10 h-10 rounded-full bg-x-blue/10 flex items-center justify-center text-x-blue border border-x-border">
                <i class="fa-solid fa-certificate text-xl"></i>
            </div>
        `;
        if (cert.logo) {
            logoHtml = `
                <div class="w-10 h-10 rounded-full border border-x-border overflow-hidden bg-white">
                    <img src="${cert.logo}" alt="${cert.issuer} Logo" class="w-full h-full object-cover">
                </div>
            `;
        }

        const certHtml = `
            <article class="p-4 border-b border-x-border hover:bg-x-hover transition duration-200 flex gap-3">
                <div class="shrink-0 pt-1">
                    ${logoHtml}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start">
                        <div class="flex flex-col">
                            <span class="font-bold text-white text-[16px]">${cert.title}</span>
                            <span class="text-x-textDim text-[14px]">${cert.issuer}</span>
                        </div>
                        <span class="text-x-textDim text-[13px]">${cert.date}</span>
                    </div>
                    <div class="text-[15px] mt-2 whitespace-pre-wrap leading-tight text-white">${cert.description}</div>
                    ${imageHtml}
                </div>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', certHtml);
    });
}

function renderContact() {
    const container = document.getElementById('posts-container');
    const contactHtml = `
        <div class="p-8 flex flex-col items-center text-center">
            <div class="w-20 h-20 rounded-full bg-x-blue/10 flex items-center justify-center text-x-blue mb-6">
                <i class="fa-solid fa-envelope text-4xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">Let's work together</h2>
            <p class="text-x-textDim text-[15px] mb-8 max-w-md">I'm currently looking for full-time opportunities or freelance projects. Check my links below or send me an email.</p>
            
            <a href="mailto:your.email@example.com" class="bg-x-blue hover:bg-x-blueHover text-white font-bold py-3 px-8 rounded-full transition duration-200 shadow-md">
                Send an Email
            </a>
            
            <div class="flex gap-6 mt-12">
                <a href="${portfolioData.profile.link}" target="_blank" class="w-12 h-12 rounded-full border border-x-border flex items-center justify-center text-white hover:bg-x-hover transition duration-200 group">
                    <i class="fa-brands fa-github text-xl group-hover:text-x-blue"></i>
                </a>
                <a href="#" target="_blank" class="w-12 h-12 rounded-full border border-x-border flex items-center justify-center text-white hover:bg-x-hover transition duration-200 group">
                    <i class="fa-brands fa-linkedin-in text-xl group-hover:text-x-blue"></i>
                </a>
                <a href="#" target="_blank" class="w-12 h-12 rounded-full border border-x-border flex items-center justify-center text-white hover:bg-x-hover transition duration-200 group">
                    <i class="fa-brands fa-instagram text-xl group-hover:text-x-blue"></i>
                </a>
            </div>
        </div>
    `;
    container.innerHTML = contactHtml;
}
