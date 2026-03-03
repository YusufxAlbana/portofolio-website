document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

async function fetchData() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        renderProfile(data.profile);
        renderPosts(data.tweets);
        renderTrends(data.trending);
        renderSuggestions(data.suggestions);

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

                <!-- Actions -->
                <div class="flex justify-between text-x-textDim mt-3 max-w-[425px]">
                    <div class="flex items-center group cursor-pointer">
                        <div class="w-8 h-8 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500 flex items-center justify-center transition duration-200">
                            <i class="fa-regular fa-comment"></i>
                        </div>
                        <span class="text-[13px] px-1 group-hover:text-blue-500 transition duration-200">${post.replies}</span>
                    </div>
                    <div class="flex items-center group cursor-pointer">
                        <div class="w-8 h-8 rounded-full group-hover:bg-green-500/10 group-hover:text-green-500 flex items-center justify-center transition duration-200">
                            <i class="fa-solid fa-retweet"></i>
                        </div>
                        <span class="text-[13px] px-1 group-hover:text-green-500 transition duration-200">${post.reposts}</span>
                    </div>
                    <div class="flex items-center group cursor-pointer">
                        <div class="w-8 h-8 rounded-full group-hover:bg-red-500/10 group-hover:text-red-500 flex items-center justify-center transition duration-200">
                            <i class="fa-regular fa-heart"></i>
                        </div>
                        <span class="text-[13px] px-1 group-hover:text-red-500 transition duration-200">${post.likes}</span>
                    </div>
                    <div class="flex items-center group cursor-pointer">
                        <div class="w-8 h-8 rounded-full group-hover:bg-blue-500/10 group-hover:text-blue-500 flex items-center justify-center transition duration-200">
                            <i class="fa-solid fa-chart-simple"></i>
                        </div>
                        <span class="text-[13px] px-1 group-hover:text-blue-500 transition duration-200">${post.views}</span>
                    </div>
                    <div class="flex items-center gap-2">
                         <div class="w-8 h-8 rounded-full hover:bg-blue-500/10 hover:text-blue-500 flex items-center justify-center transition duration-200 text-x-textDim">
                            <i class="fa-regular fa-bookmark"></i>
                        </div>
                        <div class="w-8 h-8 rounded-full hover:bg-blue-500/10 hover:text-blue-500 flex items-center justify-center transition duration-200 text-x-textDim">
                            <i class="fa-solid fa-arrow-up-from-bracket"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;

        postElement.innerHTML = avatarHtml + contentHtml;
        container.appendChild(postElement);
    });
}

function renderTrends(trends) {
    const container = document.getElementById('trends-container');
    container.innerHTML = '';

    trends.forEach(trend => {
        const trendHtml = `
            <div class="px-4 py-3 hover:bg-x-hover transition duration-200 cursor-pointer">
                <div class="flex justify-between items-start">
                    <span class="text-x-textDim text-[13px]">${trend.category}</span>
                    <div class="text-x-textDim hover:text-x-blueHover w-8 h-8 rounded-full hover:bg-x-blue/10 flex items-center justify-center transition duration-200 -mt-2 -mr-2">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
                <h3 class="font-bold text-[15px] mt-0.5">${trend.topic}</h3>
                <span class="text-x-textDim text-[13px] mt-1 block">${trend.posts} posts</span>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', trendHtml);
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
