let portfolioData = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

async function fetchData() {
    try {
        const [profileRes, postsRes, projectsRes, skillsRes, eduRes, trendingRes, suggestRes] = await Promise.all([
            fetch('./data/profile.json'),
            fetch('./data/posts.json'),
            fetch('./data/projects.json'),
            fetch('./data/skills.json'),
            fetch('./data/education.json'),
            fetch('./data/trending.json'),
            fetch('./data/suggestions.json')
        ]);

        if (!profileRes.ok) throw new Error('Failed to load data files');

        const profileData = await profileRes.json();
        const postsData = await postsRes.json();
        const projectsData = await projectsRes.json();
        const skillsData = await skillsRes.json();
        const eduData = await eduRes.json();
        const trendingData = await trendingRes.json();
        const suggestData = await suggestRes.json();

        portfolioData = {
            profile: profileData.profile,
            tweets: postsData.posts,
            projects: projectsData.projects,
            skills: skillsData.skills,
            education: eduData.education,
            trending: trendingData.trending,
            suggestions: suggestData.suggestions
        };
        
        renderProfile(portfolioData.profile);
        renderPosts(portfolioData.tweets);
        renderSidebarSkills(portfolioData.skills);
        renderSuggestions(portfolioData.suggestions);

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
    // Header Info
    document.getElementById('header-name').textContent = profile.name;
    document.getElementById('header-post-count').textContent = `1,337 posts`; // Mock count

    // Cover & Avatar
    document.getElementById('profile-cover').src = profile.cover;
    document.getElementById('profile-avatar').src = profile.avatar;
    document.getElementById('nav-avatar').src = profile.avatar;

    // Profile Details
    document.getElementById('profile-name').textContent = profile.name;
    document.getElementById('profile-handle').textContent = profile.handle;
    document.getElementById('nav-name').textContent = profile.name;
    document.getElementById('nav-handle').textContent = profile.handle;
    
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



function renderSuggestions(suggestions) {
    const container = document.getElementById('suggestions-container');
    container.innerHTML = '';

    suggestions.forEach(suggestion => {
        const suggestionHtml = `
            <div class="px-4 py-3 hover:bg-x-hover transition duration-200 cursor-pointer flex justify-between items-center bg-x-darkGray">
                <div class="flex items-center gap-3">
                    <img src="${suggestion.avatar}" alt="${suggestion.name}" class="w-10 h-10 rounded-full object-cover">
                    <div class="flex flex-col">
                        <span class="font-bold text-[15px] hover:underline">${suggestion.name}</span>
                        <span class="text-x-textDim text-[15px]">${suggestion.handle}</span>
                    </div>
                </div>
                <button class="bg-white hover:bg-gray-200 text-black font-bold py-1.5 px-4 rounded-full text-[14px] transition duration-200">
                    Follow
                </button>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', suggestionHtml);
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
    const headerName = document.getElementById('header-name');
    const headerPostCount = document.getElementById('header-post-count');
    
    container.innerHTML = '';
    
    // Hide the profile cover/bio section if not on home feed
    if (target === 'posts') {
        profileContainer.classList.remove('hidden');
        if (pinnedHeader) pinnedHeader.classList.remove('hidden');
        headerName.textContent = portfolioData.profile.name;
        headerPostCount.textContent = '1,337 posts';
        renderPosts(portfolioData.tweets);
    } else {
        profileContainer.classList.add('hidden');
        if (pinnedHeader) pinnedHeader.classList.add('hidden');
        if (target === 'projects') {
            headerName.textContent = 'Projects';
            headerPostCount.textContent = `${portfolioData.projects.length} projects`;
            renderProjects(portfolioData.projects);
        } else if (target === 'education') {
            headerName.textContent = 'Education';
            headerPostCount.textContent = `${portfolioData.education.length} schools`;
            renderEducation(portfolioData.education);
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
            <div class="bg-black rounded-full px-3 py-1.5 text-[13px] font-medium text-white border border-x-border hover:bg-x-hover transition duration-200 cursor-default">
                ${s}
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
        
        const eduHtml = `
            <article class="p-4 border-b border-x-border hover:bg-x-hover transition duration-200 flex gap-3">
                <div class="shrink-0 pt-1 flex flex-col items-center">
                    <div class="w-10 h-10 rounded-full bg-x-blue/10 flex items-center justify-center text-x-blue border border-x-border">
                        <i class="fa-solid fa-graduation-cap"></i>
                    </div>
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
                </div>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', eduHtml);
    });
}
